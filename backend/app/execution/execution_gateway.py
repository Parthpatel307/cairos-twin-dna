from enum import Enum
from typing import Any, Callable, Dict, Optional

from pydantic import BaseModel, Field

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
    parameters: Dict[str, Any] = Field(default_factory=dict)


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

    Security guarantees:
        - BLOCK never executes a tool.
        - ASK_HUMAN never executes a tool.
        - Only explicit ALLOW can execute a tool.
        - Missing tools fail closed.
        - Tool exceptions are safely converted into BLOCKED results.
    """

    def execute(
        self,
        request: ExecutionRequest,
        decision: DecisionResult,
        tool: Optional[Callable[..., Any]] = None,
    ) -> ExecutionResult:

        # --------------------------------------------------------
        # 1. BLOCKED
        # --------------------------------------------------------

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

        # --------------------------------------------------------
        # 2. HUMAN APPROVAL REQUIRED
        # --------------------------------------------------------

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

        # --------------------------------------------------------
        # 3. FAIL CLOSED
        # --------------------------------------------------------

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

        # --------------------------------------------------------
        # 4. TOOL MUST EXIST
        # --------------------------------------------------------

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

        # --------------------------------------------------------
        # 5. EXECUTE REGISTERED TOOL
        # --------------------------------------------------------

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

        # --------------------------------------------------------
        # 6. SAFE FAILURE
        # --------------------------------------------------------

        except Exception as exc:
            return ExecutionResult(
                status=ExecutionStatus.BLOCKED,
                tool_name=request.tool_name,
                action=request.action,
                result=None,
                reason=f"Tool execution failed safely: {exc}",
            )


execution_gateway = ExecutionGateway()