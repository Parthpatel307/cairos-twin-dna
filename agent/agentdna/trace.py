from typing import Any, Dict, Optional
from uuid import uuid4

from .event import ExecutionEvent
from .recorder import ExecutionRecorder


class AgentTrace:
    """
    High-level helper for recording observable AI-agent execution events.
    """

    def __init__(self, run_id: str, recorder: ExecutionRecorder) -> None:
        if not run_id:
            raise ValueError("run_id cannot be empty")

        self.run_id = run_id
        self.recorder = recorder
        self._sequence = 0

    def _next_sequence(self) -> int:
        self._sequence += 1
        return self._sequence

    def _record(
        self,
        event_type: str,
        actor: str,
        action: Optional[str] = None,
        tool: Optional[str] = None,
        input_data: Optional[Dict[str, Any]] = None,
        output_data: Optional[Dict[str, Any]] = None,
        state_before: Optional[Dict[str, Any]] = None,
        state_after: Optional[Dict[str, Any]] = None,
        error: Optional[Dict[str, Any]] = None,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> ExecutionEvent:
        event = ExecutionEvent(
            event_id=f"evt_{uuid4().hex}",
            run_id=self.run_id,
            sequence=self._next_sequence(),
            event_type=event_type,
            actor=actor,
            action=action,
            tool=tool,
            input=input_data,
            output=output_data,
            state_before=state_before,
            state_after=state_after,
            error=error,
            metadata=metadata,
        )

        self.recorder.record(event)
        return event

    def record_user_request(
        self,
        request: str,
    ) -> ExecutionEvent:
        return self._record(
            event_type="user_request",
            actor="user",
            action=request,
        )

    def record_plan(
        self,
        plan: Dict[str, Any],
    ) -> ExecutionEvent:
        return self._record(
            event_type="plan_created",
            actor="agent",
            output_data=plan,
        )

    def record_decision(
        self,
        decision: str,
        reason: Optional[str] = None,
    ) -> ExecutionEvent:
        metadata = None

        if reason is not None:
            metadata = {
                "reason": reason,
            }

        return self._record(
            event_type="decision",
            actor="agent",
            action=decision,
            metadata=metadata,
        )

    def record_tool_call(
        self,
        tool: str,
        input_data: Optional[Dict[str, Any]] = None,
    ) -> ExecutionEvent:
        return self._record(
            event_type="tool_call",
            actor="agent",
            tool=tool,
            input_data=input_data,
        )

    def record_tool_response(
        self,
        tool: str,
        output_data: Optional[Dict[str, Any]] = None,
    ) -> ExecutionEvent:
        return self._record(
            event_type="tool_response",
            actor="tool",
            tool=tool,
            output_data=output_data,
        )

    def record_state_change(
        self,
        state_before: Dict[str, Any],
        state_after: Dict[str, Any],
    ) -> ExecutionEvent:
        return self._record(
            event_type="state_change",
            actor="system",
            state_before=state_before,
            state_after=state_after,
        )

    def record_error(
        self,
        error: Dict[str, Any],
    ) -> ExecutionEvent:
        return self._record(
            event_type="error",
            actor="system",
            error=error,
        )

    def record_result(
        self,
        result: Dict[str, Any],
    ) -> ExecutionEvent:
        return self._record(
            event_type="result",
            actor="system",
            output_data=result,
        )