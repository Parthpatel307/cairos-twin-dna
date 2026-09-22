from enum import Enum
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field

from app.database.black_box import BlackBoxEvent


class CausalStatus(str, Enum):
    NO_CHANGE = "no_change"
    SUSPICIOUS = "suspicious"
    ROOT_CAUSE_CANDIDATE = "root_cause_candidate"


class ReplayRequest(BaseModel):
    original_events: List[BlackBoxEvent]
    alternative_decisions: Dict[str, str] = Field(default_factory=dict)


class ReplayFinding(BaseModel):
    event_id: str
    event_type: str
    original_decision: Optional[str] = None
    alternative_decision: Optional[str] = None
    status: CausalStatus
    explanation: str


class ReplayResult(BaseModel):
    agent_id: str
    original_event_count: int
    replayed_event_count: int
    first_suspicious_event: Optional[str] = None
    causal_status: CausalStatus
    findings: List[ReplayFinding]
    conclusion: str


class CausalReplayEngine:
    """
    CAIROS AgentDNA Causal Replay Engine.

    Reconstructs an agent execution trace and compares selected
    decisions against alternative decisions.

    This first version performs deterministic trace-level causal
    analysis. Real model/tool re-execution can be connected later.
    """

    DECISION_EVENTS = {
        "permission",
        "simulation",
        "risk",
        "decision",
        "execution",
    }

    def replay(
        self,
        request: ReplayRequest,
    ) -> ReplayResult:

        events = sorted(
            request.original_events,
            key=lambda event: event.timestamp,
        )

        if not events:
            return ReplayResult(
                agent_id="unknown",
                original_event_count=0,
                replayed_event_count=0,
                first_suspicious_event=None,
                causal_status=CausalStatus.NO_CHANGE,
                findings=[],
                conclusion="No execution trace was available for replay.",
            )

        agent_id = events[0].agent_id
        findings: List[ReplayFinding] = []

        first_suspicious_event: Optional[str] = None
        overall_status = CausalStatus.NO_CHANGE

        for event in events:
            alternative = request.alternative_decisions.get(
                event.event_id
            )

            if alternative is None:
                continue

            original = event.decision

            if original == alternative:
                findings.append(
                    ReplayFinding(
                        event_id=event.event_id,
                        event_type=event.event_type.value,
                        original_decision=original,
                        alternative_decision=alternative,
                        status=CausalStatus.NO_CHANGE,
                        explanation=(
                            "The alternative decision is identical "
                            "to the original decision."
                        ),
                    )
                )
                continue

            status = self._classify_change(
                event=event,
                alternative_decision=alternative,
            )

            findings.append(
                ReplayFinding(
                    event_id=event.event_id,
                    event_type=event.event_type.value,
                    original_decision=original,
                    alternative_decision=alternative,
                    status=status,
                    explanation=self._explain_change(
                        event=event,
                        alternative_decision=alternative,
                        status=status,
                    ),
                )
            )

            if (
                status == CausalStatus.ROOT_CAUSE_CANDIDATE
                and first_suspicious_event is None
            ):
                first_suspicious_event = event.event_id
                overall_status = status

            elif (
                status == CausalStatus.SUSPICIOUS
                and overall_status == CausalStatus.NO_CHANGE
            ):
                overall_status = status

        conclusion = self._build_conclusion(
            status=overall_status,
            first_suspicious_event=first_suspicious_event,
        )

        return ReplayResult(
            agent_id=agent_id,
            original_event_count=len(events),
            replayed_event_count=len(events),
            first_suspicious_event=first_suspicious_event,
            causal_status=overall_status,
            findings=findings,
            conclusion=conclusion,
        )

    def _classify_change(
        self,
        event: BlackBoxEvent,
        alternative_decision: str,
    ) -> CausalStatus:

        original = (event.decision or "").lower()
        alternative = alternative_decision.lower()

        if event.event_type.value == "decision":
            if original == "block" and alternative == "allow":
                return CausalStatus.ROOT_CAUSE_CANDIDATE

            if original == "allow" and alternative == "block":
                return CausalStatus.ROOT_CAUSE_CANDIDATE

        if event.event_type.value in {
            "permission",
            "simulation",
            "risk",
        }:
            if original != alternative:
                return CausalStatus.SUSPICIOUS

        return CausalStatus.SUSPICIOUS

    def _explain_change(
        self,
        event: BlackBoxEvent,
        alternative_decision: str,
        status: CausalStatus,
    ) -> str:

        if status == CausalStatus.ROOT_CAUSE_CANDIDATE:
            return (
                f"Changing the {event.event_type.value} decision "
                f"from '{event.decision}' to "
                f"'{alternative_decision}' changes a critical "
                "control point in the execution trace."
            )

        return (
            f"The {event.event_type.value} decision changes from "
            f"'{event.decision}' to '{alternative_decision}', "
            "making this event a suspicious point for further replay."
        )

    def _build_conclusion(
        self,
        status: CausalStatus,
        first_suspicious_event: Optional[str],
    ) -> str:

        if status == CausalStatus.ROOT_CAUSE_CANDIDATE:
            return (
                "Replay identified a root-cause candidate at "
                f"event '{first_suspicious_event}'."
            )

        if status == CausalStatus.SUSPICIOUS:
            return (
                "Replay identified a suspicious decision, but "
                "the available trace is insufficient to establish "
                "a root-cause candidate."
            )

        return (
            "Replay found no decision change that materially "
            "altered the recorded execution trace."
        )


causal_replay = CausalReplayEngine()