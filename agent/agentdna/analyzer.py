from dataclasses import dataclass
from typing import List

from .event import ExecutionEvent


@dataclass
class SuspiciousEvent:
    event_id: str
    sequence: int
    event_type: str
    reason: str
    score: float


class AgentDNAAnalyzer:
    """
    Analyzes an observable execution trace and identifies
    suspicious events that may have contributed to a failure.
    """

    def analyze(
        self,
        events: List[ExecutionEvent],
    ) -> List[SuspiciousEvent]:
        suspicious: List[SuspiciousEvent] = []

        if not events:
            return suspicious

        for event in events:
            score = 0.0
            reasons: List[str] = []

            if event.event_type == "error":
                score += 1.0
                reasons.append("Execution produced an error.")

            if event.event_type == "decision":
                score += 0.20
                reasons.append("Agent made a decision.")

            if event.event_type == "tool_call":
                score += 0.15
                reasons.append("Agent invoked a tool.")

            if event.event_type == "state_change":
                score += 0.20
                reasons.append("Execution changed system state.")

            if event.error is not None:
                score += 0.50
                reasons.append("Event contains error information.")

            if event.state_before is not None and event.state_after is not None:
                if event.state_before != event.state_after:
                    score += 0.30
                    reasons.append("State changed during this event.")

            if score > 0:
                suspicious.append(
                    SuspiciousEvent(
                        event_id=event.event_id,
                        sequence=event.sequence,
                        event_type=event.event_type,
                        reason=" ".join(reasons),
                        score=min(score, 1.0),
                    )
                )

        suspicious.sort(
            key=lambda item: item.score,
            reverse=True,
        )

        return suspicious