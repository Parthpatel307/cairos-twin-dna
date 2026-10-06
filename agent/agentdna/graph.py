from typing import Any, Dict, List

from .event import ExecutionEvent


class AgentDNAExecutionGraph:
    """
    Converts an execution trace into graph data that can be
    consumed directly by a frontend visualization.
    """

    def build(
        self,
        events: List[ExecutionEvent],
    ) -> Dict[str, Any]:
        nodes: List[Dict[str, Any]] = []
        edges: List[Dict[str, Any]] = []

        ordered_events = sorted(
            events,
            key=lambda event: event.sequence,
        )

        for event in ordered_events:
            nodes.append(
                {
                    "id": event.event_id,
                    "sequence": event.sequence,
                    "type": event.event_type,
                    "actor": event.actor,
                    "action": event.action,
                    "tool": event.tool,
                    "status": self._get_status(event),
                }
            )

        for index in range(
            len(ordered_events) - 1
        ):
            current_event = ordered_events[index]
            next_event = ordered_events[index + 1]

            edges.append(
                {
                    "from": current_event.event_id,
                    "to": next_event.event_id,
                    "label": "next",
                }
            )

        return {
            "run_id": (
                ordered_events[0].run_id
                if ordered_events
                else None
            ),
            "nodes": nodes,
            "edges": edges,
        }

    def _get_status(
        self,
        event: ExecutionEvent,
    ) -> str:
        if event.event_type == "error":
            return "failed"

        if event.event_type == "result":
            if event.output:
                status = event.output.get("status")

                if status == "success":
                    return "success"

                if status == "failure":
                    return "failed"

        return "normal"