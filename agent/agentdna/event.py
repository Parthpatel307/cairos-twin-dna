from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any, Dict, Optional


ALLOWED_EVENT_TYPES = {
    "user_request",
    "plan_created",
    "decision",
    "tool_call",
    "tool_response",
    "state_change",
    "memory_change",
    "permission_check",
    "simulation",
    "risk_analysis",
    "execution",
    "error",
    "result",
}

ALLOWED_ACTORS = {
    "user",
    "agent",
    "tool",
    "system",
}


@dataclass
class ExecutionEvent:
    event_id: str
    run_id: str
    sequence: int
    event_type: str
    actor: str

    timestamp: str = field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat()
    )

    action: Optional[str] = None
    tool: Optional[str] = None

    input: Optional[Dict[str, Any]] = None
    output: Optional[Dict[str, Any]] = None

    state_before: Optional[Dict[str, Any]] = None
    state_after: Optional[Dict[str, Any]] = None

    error: Optional[Dict[str, Any]] = None
    metadata: Optional[Dict[str, Any]] = None

    def __post_init__(self) -> None:
        if not self.event_id:
            raise ValueError("event_id cannot be empty")

        if not self.run_id:
            raise ValueError("run_id cannot be empty")

        if self.sequence < 1:
            raise ValueError("sequence must be greater than or equal to 1")

        if self.event_type not in ALLOWED_EVENT_TYPES:
            raise ValueError(
                f"Invalid event_type: {self.event_type}. "
                f"Allowed values: {sorted(ALLOWED_EVENT_TYPES)}"
            )

        if self.actor not in ALLOWED_ACTORS:
            raise ValueError(
                f"Invalid actor: {self.actor}. "
                f"Allowed values: {sorted(ALLOWED_ACTORS)}"
            )

    def to_dict(self) -> Dict[str, Any]:
        return {
            "event_id": self.event_id,
            "run_id": self.run_id,
            "sequence": self.sequence,
            "timestamp": self.timestamp,
            "event_type": self.event_type,
            "actor": self.actor,
            "action": self.action,
            "tool": self.tool,
            "input": self.input,
            "output": self.output,
            "state_before": self.state_before,
            "state_after": self.state_after,
            "error": self.error,
            "metadata": self.metadata,
        }