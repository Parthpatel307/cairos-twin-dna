from dataclasses import dataclass
from typing import List, Optional

from .event import ExecutionEvent


@dataclass
class RootCauseCandidate:
    event_id: str
    sequence: int
    event_type: str
    score: float
    reason: str


class RootCauseAnalyzer:
    """
    Finds the most likely earlier event that contributed to
    an observed execution failure.

    This is a preliminary causal candidate detector.
    Causal replay will later be used to verify the candidate.
    """

    EVENT_WEIGHTS = {
        "decision": 1.00,
        "state_change": 0.90,
        "tool_call": 0.80,
        "permission_check": 0.70,
        "simulation": 0.70,
        "risk_analysis": 0.60,
        "plan_created": 0.50,
    }

    def find_failure_event(
        self,
        events: List[ExecutionEvent],
    ) -> Optional[ExecutionEvent]:
        """
        Find the first error event in the execution trace.
        """
        for event in events:
            if event.event_type == "error":
                return event

        return None

    def find_candidates(
        self,
        events: List[ExecutionEvent],
        failure_event: ExecutionEvent,
    ) -> List[RootCauseCandidate]:
        """
        Build candidate root causes from events that occurred
        before the observed failure.
        """
        candidates: List[RootCauseCandidate] = []

        for event in events:
            if event.sequence >= failure_event.sequence:
                continue

            base_score = self.EVENT_WEIGHTS.get(
                event.event_type,
                0.0,
            )

            if base_score == 0.0:
                continue

            score = base_score
            reasons: List[str] = []

            reasons.append(
                f"Event type '{event.event_type}' can influence execution."
            )

            if event.action:
                score += 0.05
                reasons.append("Event contains an explicit action.")

            if event.state_before is not None and event.state_after is not None:
                if event.state_before != event.state_after:
                    score += 0.10
                    reasons.append(
                        "Event changed observable system state."
                    )

            if event.tool:
                score += 0.05
                reasons.append(
                    f"Event interacted with tool '{event.tool}'."
                )

            candidates.append(
                RootCauseCandidate(
                    event_id=event.event_id,
                    sequence=event.sequence,
                    event_type=event.event_type,
                    score=min(score, 1.0),
                    reason=" ".join(reasons),
                )
            )

        candidates.sort(
            key=lambda candidate: (
                -candidate.score,
                candidate.sequence,
            )
        )

        return candidates

    def analyze(
        self,
        events: List[ExecutionEvent],
    ) -> Optional[RootCauseCandidate]:
        """
        Identify the strongest preliminary root-cause candidate.
        """
        if not events:
            return None

        failure_event = self.find_failure_event(events)

        if failure_event is None:
            return None

        candidates = self.find_candidates(
            events,
            failure_event,
        )

        if not candidates:
            return None

        return candidates[0]