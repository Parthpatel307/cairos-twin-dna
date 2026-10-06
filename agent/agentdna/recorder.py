from typing import List, Optional

from .event import ExecutionEvent


class ExecutionRecorder:
    """
    In-memory recorder for observable AI-agent execution events.

    One recorder instance represents one agent execution context.
    """

    def __init__(self) -> None:
        self._events: List[ExecutionEvent] = []

    def record(self, event: ExecutionEvent) -> None:
        """
        Store one execution event.
        """
        self._events.append(event)

    def get_events(self) -> List[ExecutionEvent]:
        """
        Return all recorded events in sequence order.
        """
        return sorted(
            self._events,
            key=lambda event: event.sequence,
        )

    def get_event(self, event_id: str) -> Optional[ExecutionEvent]:
        """
        Find one event by its event_id.
        """
        for event in self._events:
            if event.event_id == event_id:
                return event

        return None

    def count(self) -> int:
        """
        Return the number of recorded events.
        """
        return len(self._events)

    def clear(self) -> None:
        """
        Remove all recorded events.
        """
        self._events.clear()

    def to_list(self) -> List[dict]:
        """
        Return all recorded events as dictionaries.
        """
        return [
            event.to_dict()
            for event in self.get_events()
        ]