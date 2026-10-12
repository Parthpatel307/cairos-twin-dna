from enum import Enum
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field

from app.database.black_box import BlackBoxEvent


# ============================================================
# CAUSAL STATUS
# ============================================================


class CausalStatus(str, Enum):
    NO_CHANGE = "no_change"
    SUSPICIOUS = "suspicious"
    ROOT_CAUSE_CANDIDATE = "root_cause_candidate"


# ============================================================
# REQUEST / RESPONSE MODELS
# ============================================================


class ReplayRequest(BaseModel):
    original_events: List[BlackBoxEvent]
    alternative_decisions: Dict[str, str] = Field(
        default_factory=dict
    )


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


# ============================================================
# CAUSAL REPLAY ENGINE
# ============================================================


class CausalReplayEngine:
    """
    CAIROS Causal Replay Engine.

    Replays an existing Black Box trace and evaluates whether
    changing a decision could have materially changed the
    execution outcome.

    This is an analysis-only component.
    Replay never executes real-world tools.
    """

    DECISION_EVENTS = {
        "permission",
        "simulation",
        "risk",
        "decision",
        "execution",
    }

    def replay(self, request: ReplayRequest) -> ReplayResult:
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
                conclusion="No events were available for replay.",
            )

        agent_id = events[0].agent_id
        findings: List[ReplayFinding] = []

        first_suspicious_event: Optional[str] = None
        overall_status = CausalStatus.NO_CHANGE

        for event in events:

            alternative = request.alternative_decisions.get(
                event.event_id
            )

            # No alternative decision supplied for this event.
            if alternative is None:
                continue

            original = event.decision

            # ------------------------------------------------
            # NO CHANGE
            # ------------------------------------------------

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
                            "to the original decision, so no causal "
                            "change was detected."
                        ),
                    )
                )
                continue

            # ------------------------------------------------
            # CLASSIFY CHANGE
            # ------------------------------------------------

            status = self._classify_change(
                event=event,
                alternative=alternative,
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
                        original=original,
                        alternative=alternative,
                    ),
                )
            )

            # ------------------------------------------------
            # UPDATE OVERALL CAUSAL STATUS
            # ------------------------------------------------

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

    # ========================================================
    # CHANGE CLASSIFICATION
    # ========================================================

    def _classify_change(
        self,
        event: BlackBoxEvent,
        alternative: str,
    ) -> CausalStatus:

        original = event.decision

        # Final decision changes from allow <-> block.
        # This is the strongest causal signal.
        if event.event_type.value == "decision":
            if {
                original,
                alternative,
            } == {"allow", "block"}:
                return CausalStatus.ROOT_CAUSE_CANDIDATE

        # Permission, simulation, or risk changes can affect
        # later decisions, so mark them as suspicious.
        if event.event_type.value in {
            "permission",
            "simulation",
            "risk",
        }:
            return CausalStatus.SUSPICIOUS

        # Execution changes are also suspicious because they
        # represent the final real-world execution boundary.
        if event.event_type.value == "execution":
            return CausalStatus.SUSPICIOUS

        return CausalStatus.SUSPICIOUS

    # ========================================================
    # EXPLANATION
    # ========================================================

    def _explain_change(
        self,
        event: BlackBoxEvent,
        original: Optional[str],
        alternative: str,
    ) -> str:

        event_type = event.event_type.value

        # Avoid awkward text such as:
        # "Changing the decision decision..."
        if event_type == "decision":
            return (
                f"Changing the final decision from "
                f"'{original}' to '{alternative}' changes a "
                f"critical control point in the execution trace."
            )

        if event_type == "permission":
            return (
                f"Changing the permission outcome from "
                f"'{original}' to '{alternative}' may change "
                f"whether the requested action is authorized."
            )

        if event_type == "simulation":
            return (
                f"Changing the simulation outcome from "
                f"'{original}' to '{alternative}' may change "
                f"the safety assessment before execution."
            )

        if event_type == "risk":
            return (
                f"Changing the risk outcome from "
                f"'{original}' to '{alternative}' may change "
                f"the final authorization path."
            )

        if event_type == "execution":
            return (
                f"Changing the execution outcome from "
                f"'{original}' to '{alternative}' changes the "
                f"observed execution result."
            )

        return (
            f"Changing the {event_type} outcome from "
            f"'{original}' to '{alternative}' may affect "
            f"the execution trace."
        )

    # ========================================================
    # CONCLUSION
    # ========================================================

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
            if first_suspicious_event:
                return (
                    "Replay identified a suspicious change at "
                    f"event '{first_suspicious_event}', but the "
                    "change was not classified as a root-cause "
                    "candidate."
                )

            return (
                "Replay identified suspicious decision changes "
                "but could not establish a root-cause candidate."
            )

        return (
            "Replay found no meaningful causal change in the "
            "provided alternative decisions."
        )


# ============================================================
# GLOBAL REPLAY ENGINE
# ============================================================

causal_replay = CausalReplayEngine()