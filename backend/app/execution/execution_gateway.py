from enum import Enum
from typing import Any, Callable, Dict, Optional

from pydantic import BaseModel

from app.governance.decision_engine import (
    DecisionResult,
    FinalDecision,
)


class ExecutionStatus(str, Enum):
    EXECUTED = "executed"
    BLOCKED = "blocked"
    WAITING_FOR_HUMAN = "waiting_for_human"


class ExecutionRequest(BaseModel):
    tool_name: str
    action: str
    parameters: Dict[str, Any] = {}


class ExecutionResult(BaseModel):
    status: ExecutionStatus
    tool_name: str
    action: str
    result: Optional[Any] = None
    reason: str


class ExecutionGateway:
    """
    CAIROS Execution Gateway.

    The gateway is the final security boundary between the
    CAIROS decision system and real-world tool execution.

    A tool can execute only when the final decision is ALLOW.
    """

    def execute(
        self,
        request: ExecutionRequest,
        decision: DecisionResult,
        tool: Optional[Callable[..., Any]] = None,
    ) -> ExecutionResult:

        # BLOCKED actions never reach the real tool.
        if decision.decision == FinalDecision.BLOCK:
            return ExecutionResult(
                status=ExecutionStatus.BLOCKED,
                tool_name=request.tool_name,
                action=request.action,
                result=None,
                reason=(
                    "Execution blocked by CAIROS. "
                    "The real tool was not called."
                ),
            )

        # Human approval is required before execution.
        if decision.decision == FinalDecision.ASK_HUMAN:
            return ExecutionResult(
                status=ExecutionStatus.WAITING_FOR_HUMAN,
                tool_name=request.tool_name,
                action=request.action,
                result=None,
                reason=(
                    "Execution paused because human approval "
                    "is required."
                ),
            )

        # Safety requirement: ALLOW must be explicit.
        if decision.decision != FinalDecision.ALLOW:
            return ExecutionResult(
                status=ExecutionStatus.BLOCKED,
                tool_name=request.tool_name,
                action=request.action,
                result=None,
                reason=(
                    "No explicit ALLOW decision was received. "
                    "Failing closed for safety."
                ),
            )

        # Do not pretend execution happened without a real tool.
        if tool is None:
            return ExecutionResult(
                status=ExecutionStatus.BLOCKED,
                tool_name=request.tool_name,
                action=request.action,
                result=None,
                reason=(
                    "Execution was authorized, but no real tool "
                    "was registered with the gateway."
                ),
            )

        try:
            result = tool(**request.parameters)

            return ExecutionResult(
                status=ExecutionStatus.EXECUTED,
                tool_name=request.tool_name,
                action=request.action,
                result=result,
                reason=(
                    "CAIROS authorized the action and the "
                    "registered tool executed successfully."
                ),
            )

        except Exception as exc:
            return ExecutionResult(
                status=ExecutionStatus.BLOCKED,
                tool_name=request.tool_name,
                action=request.action,
                result=None,
                reason=f"Tool execution failed safely: {exc}",
            )


execution_gateway = ExecutionGateway()