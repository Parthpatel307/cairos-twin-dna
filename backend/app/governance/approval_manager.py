from enum import Enum
from threading import Lock
from typing import Any, Dict, Optional
from uuid import uuid4

from pydantic import BaseModel, Field

from app.execution.execution_gateway import (
    ExecutionRequest,
    ExecutionResult,
    execution_gateway,
)
from app.governance.decision_engine import (
    DecisionResult,
    FinalDecision,
)


class ApprovalStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    EXECUTED = "executed"
    FAILED = "failed"


class ApprovalRequest(BaseModel):
    approval_id: str
    run_id: str
    agent_id: str
    action: str
    target: str
    parameters: Dict[str, Any] = Field(default_factory=dict)
    reason: str
    status: ApprovalStatus = ApprovalStatus.PENDING


class ApprovalDecisionRequest(BaseModel):
    approved: bool
    reviewer: str = "human"


class ApprovalResult(BaseModel):
    approval_id: str
    run_id: str
    agent_id: str
    action: str
    status: ApprovalStatus
    reviewer: Optional[str] = None
    execution_status: Optional[str] = None
    execution_reason: Optional[str] = None
    result: Optional[Any] = None


class ApprovalManager:
    """
    Human-in-the-loop approval manager.

    An approval is bound to the exact action, target and parameters
    produced by the CAIROS pipeline.

    Execution is allowed only after explicit human approval.
    """

    def __init__(self) -> None:
        self._approvals: Dict[str, ApprovalRequest] = {}
        self._decisions: Dict[str, DecisionResult] = {}
        self._lock = Lock()

    def create(
        self,
        run_id: str,
        agent_id: str,
        action: str,
        target: str,
        parameters: Dict[str, Any],
        reason: str,
        decision: DecisionResult,
    ) -> ApprovalRequest:
        approval_id = str(uuid4())

        approval = ApprovalRequest(
            approval_id=approval_id,
            run_id=run_id,
            agent_id=agent_id,
            action=action,
            target=target,
            parameters=dict(parameters),
            reason=reason,
        )

        with self._lock:
            self._approvals[approval_id] = approval
            self._decisions[approval_id] = decision

        return approval

    def get(self, approval_id: str) -> Optional[ApprovalRequest]:
        with self._lock:
            return self._approvals.get(approval_id)

    def approve(
        self,
        approval_id: str,
        reviewer: str,
    ) -> ApprovalResult:
        with self._lock:
            approval = self._approvals.get(approval_id)
            decision = self._decisions.get(approval_id)

            if approval is None or decision is None:
                raise KeyError(
                    f"Approval '{approval_id}' was not found."
                )

            if approval.status != ApprovalStatus.PENDING:
                raise ValueError(
                    f"Approval '{approval_id}' is already "
                    f"{approval.status.value}."
                )

            approval.status = ApprovalStatus.APPROVED

        execution = execution_gateway.execute(
            request=ExecutionRequest(
                tool_name=approval.action,
                action=approval.action,
                parameters=approval.parameters,
            ),
            decision=decision,
        )

        with self._lock:
            if execution.status.value == "executed":
                approval.status = ApprovalStatus.EXECUTED
            else:
                approval.status = ApprovalStatus.FAILED

        return ApprovalResult(
            approval_id=approval.approval_id,
            run_id=approval.run_id,
            agent_id=approval.agent_id,
            action=approval.action,
            status=approval.status,
            reviewer=reviewer,
            execution_status=execution.status.value,
            execution_reason=execution.reason,
            result=execution.result,
        )

    def reject(
        self,
        approval_id: str,
        reviewer: str,
    ) -> ApprovalResult:
        with self._lock:
            approval = self._approvals.get(approval_id)

            if approval is None:
                raise KeyError(
                    f"Approval '{approval_id}' was not found."
                )

            if approval.status != ApprovalStatus.PENDING:
                raise ValueError(
                    f"Approval '{approval_id}' is already "
                    f"{approval.status.value}."
                )

            approval.status = ApprovalStatus.REJECTED

        return ApprovalResult(
            approval_id=approval.approval_id,
            run_id=approval.run_id,
            agent_id=approval.agent_id,
            action=approval.action,
            status=ApprovalStatus.REJECTED,
            reviewer=reviewer,
            execution_status="blocked",
            execution_reason=(
                "Human reviewer rejected the requested action. "
                "The real tool was not called."
            ),
            result=None,
        )


approval_manager = ApprovalManager()