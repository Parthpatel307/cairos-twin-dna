from dataclasses import dataclass
from typing import Any, Callable, Dict, List, Optional

from .event import ExecutionEvent


@dataclass
class ReplayResult:
    original_run_id: str
    counterfactual_run_id: str
    candidate_event_id: str
    original_outcome: str
    counterfactual_outcome: str
    failure_avoided: bool
    alternative_action: str
    evidence: Dict[str, Any]


ReplayExecutor = Callable[
    [
        str,
        ExecutionEvent,
        List[ExecutionEvent],
    ],
    str,
]


class CausalReplayer:
    """
    Executes a counterfactual alternative for a selected event.

    The actual execution is delegated to a replay executor so that
    AgentDNA does not hard-code any external environment behavior.
    """

    def replay(
        self,
        events: List[ExecutionEvent],
        candidate_event_id: str,
        alternative_action: str,
        executor: Optional[ReplayExecutor] = None,
    ) -> ReplayResult:
        if not events:
            raise ValueError("Cannot replay an empty execution trace.")

        candidate = self._find_candidate(
            events,
            candidate_event_id,
        )

        if candidate is None:
            raise ValueError(
                f"Candidate event not found: {candidate_event_id}"
            )

        original_outcome = self._find_final_outcome(events)

        counterfactual_events = self._build_counterfactual_trace(
            events=events,
            candidate_event_id=candidate_event_id,
            alternative_action=alternative_action,
        )

        if executor is None:
            counterfactual_outcome = self._default_executor(
                alternative_action=alternative_action,
                candidate=candidate,
                events=counterfactual_events,
            )
        else:
            counterfactual_outcome = executor(
                alternative_action,
                candidate,
                counterfactual_events,
            )

        failure_avoided = (
            original_outcome == "failure"
            and counterfactual_outcome == "success"
        )

        evidence = {
            "candidate_sequence": candidate.sequence,
            "candidate_event_type": candidate.event_type,
            "original_action": candidate.action,
            "alternative_action": alternative_action,
            "original_outcome": original_outcome,
            "counterfactual_outcome": counterfactual_outcome,
            "failure_avoided": failure_avoided,
        }

        return ReplayResult(
            original_run_id=events[0].run_id,
            counterfactual_run_id=(
                f"{events[0].run_id}_counterfactual"
            ),
            candidate_event_id=candidate_event_id,
            original_outcome=original_outcome,
            counterfactual_outcome=counterfactual_outcome,
            failure_avoided=failure_avoided,
            alternative_action=alternative_action,
            evidence=evidence,
        )

    def _find_candidate(
        self,
        events: List[ExecutionEvent],
        candidate_event_id: str,
    ) -> Optional[ExecutionEvent]:
        for event in events:
            if event.event_id == candidate_event_id:
                return event

        return None

    def _build_counterfactual_trace(
        self,
        events: List[ExecutionEvent],
        candidate_event_id: str,
        alternative_action: str,
    ) -> List[ExecutionEvent]:
        counterfactual_events: List[ExecutionEvent] = []

        for event in events:
            if event.event_id != candidate_event_id:
                counterfactual_events.append(event)
                continue

            metadata = dict(event.metadata or {})

            metadata["original_action"] = event.action
            metadata["counterfactual_action"] = alternative_action
            metadata["counterfactual"] = True

            counterfactual_events.append(
                ExecutionEvent(
                    event_id=f"{event.event_id}_cf",
                    run_id=f"{event.run_id}_counterfactual",
                    sequence=event.sequence,
                    timestamp=event.timestamp,
                    event_type=event.event_type,
                    actor=event.actor,
                    action=alternative_action,
                    tool=event.tool,
                    input=event.input,
                    output=event.output,
                    state_before=event.state_before,
                    state_after=event.state_after,
                    error=None,
                    metadata=metadata,
                )
            )

        return counterfactual_events

    def _find_final_outcome(
        self,
        events: List[ExecutionEvent],
    ) -> str:
        for event in reversed(events):
            if event.event_type == "error":
                return "failure"

            if event.event_type == "result":
                if event.output:
                    status = event.output.get("status")

                    if status == "success":
                        return "success"

                    if status == "failure":
                        return "failure"

        return "unknown"

    def _default_executor(
        self,
        alternative_action: str,
        candidate: ExecutionEvent,
        events: List[ExecutionEvent],
    ) -> str:
        """
        Default deterministic executor used only when no external
        replay executor has been connected yet.

        A real Agent Twin executor will replace this later.
        """
        if not alternative_action.strip():
            raise ValueError(
                "alternative_action cannot be empty."
            )

        if alternative_action == candidate.action:
            return "failure"

        has_error_before_candidate = any(
            event.event_type == "error"
            and event.sequence <= candidate.sequence
            for event in events
        )

        if has_error_before_candidate:
            return "failure"

        return "success"