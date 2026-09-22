from datetime import datetime, timezone
from enum import Enum
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class EventType(str, Enum):
    REQUEST = "request"
    INTENT = "intent"
    PERMISSION = "permission"
    SIMULATION = "simulation"
    RISK = "risk"
    DECISION = "decision"
    EXECUTION = "execution"
    ERROR = "error"


class BlackBoxEvent(BaseModel):
    event_id: str
    timestamp: datetime
    event_type: EventType
    agent_id: str
    action: Optional[str] = None
    authorized: Optional[bool] = None
    decision: Optional[str] = None
    reason: Optional[str] = None
    data: Dict[str, Any] = Field(default_factory=dict)


class BlackBoxLogger:
    """
    CAIROS AgentDNA Black Box.

    Records the important events of an agent execution so that
    the complete execution history can later be reconstructed
    and replayed.
    """

    def __init__(self) -> None:
        self._events: List[BlackBoxEvent] = []

    def record(
        self,
        event_type: EventType,
        agent_id: str,
        event_id: str,
        action: Optional[str] = None,
        authorized: Optional[bool] = None,
        decision: Optional[str] = None,
        reason: Optional[str] = None,
        data: Optional[Dict[str, Any]] = None,
    ) -> BlackBoxEvent:

        event = BlackBoxEvent(
            event_id=event_id,
            timestamp=datetime.now(timezone.utc),
            event_type=event_type,
            agent_id=agent_id,
            action=action,
            authorized=authorized,
            decision=decision,
            reason=reason,
            data=data or {},
        )

        self._events.append(event)

        return event

    def get_events(self, agent_id: Optional[str] = None) -> List[BlackBoxEvent]:
        if agent_id is None:
            return list(self._events)

        return [
            event
            for event in self._events
            if event.agent_id == agent_id
        ]

    def get_event(self, event_id: str) -> Optional[BlackBoxEvent]:
        for event in self._events:
            if event.event_id == event_id:
                return event

        return None

    def export_trace(self, agent_id: str) -> Dict[str, Any]:
        events = self.get_events(agent_id)

        return {
            "agent_id": agent_id,
            "event_count": len(events),
            "events": [
                event.model_dump(mode="json")
                for event in events
            ],
        }

    def clear(self) -> None:
        self._events.clear()


black_box = BlackBoxLogger()