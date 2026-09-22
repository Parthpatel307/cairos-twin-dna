from enum import Enum
from typing import List

from pydantic import BaseModel

from app.governance.intent_engine import AgentIntent, RiskLevel


class PermissionDecision(str, Enum):
    ALLOW = "allow"
    BLOCK = "block"
    ASK_HUMAN = "ask_human"


class PermissionContext(BaseModel):
    user_id: str
    authorized_actions: List[str]
    allowed_resources: List[str] = []


class PermissionResult(BaseModel):
    decision: PermissionDecision
    reason: str
    checked_actions: List[str]
    denied_actions: List[str]


class PermissionEngine:
    """
    CAIROS Permission Engine.

    Verifies whether an agent intent is permitted for the
    current user and execution context.
    """

    def evaluate(
        self,
        intent: AgentIntent,
        context: PermissionContext,
    ) -> PermissionResult:

        checked_actions = intent.allowed_actions
        denied_actions = [
            action
            for action in checked_actions
            if action not in context.authorized_actions
        ]

        # Critical operations are never automatically executed.
        if intent.risk_level == RiskLevel.CRITICAL:
            return PermissionResult(
                decision=PermissionDecision.BLOCK,
                reason=(
                    "Critical-risk operation detected. "
                    "CAIROS blocks automatic execution."
                ),
                checked_actions=checked_actions,
                denied_actions=denied_actions,
            )

        # High-risk operations require human approval.
        if intent.risk_level == RiskLevel.HIGH:
            return PermissionResult(
                decision=PermissionDecision.ASK_HUMAN,
                reason=(
                    "High-risk operation detected. "
                    "Human approval is required before execution."
                ),
                checked_actions=checked_actions,
                denied_actions=denied_actions,
            )

        # Any unauthorized action is blocked.
        if denied_actions:
            return PermissionResult(
                decision=PermissionDecision.BLOCK,
                reason=(
                    "One or more requested actions are not "
                    "authorized for this execution context."
                ),
                checked_actions=checked_actions,
                denied_actions=denied_actions,
            )

        # Medium-risk operations can continue to simulation.
        if intent.risk_level == RiskLevel.MEDIUM:
            return PermissionResult(
                decision=PermissionDecision.ALLOW,
                reason=(
                    "Actions are authorized. Medium-risk operation "
                    "must proceed through Agent Twin simulation before "
                    "real execution."
                ),
                checked_actions=checked_actions,
                denied_actions=[],
            )

        # Low-risk authorized operations can proceed.
        return PermissionResult(
            decision=PermissionDecision.ALLOW,
            reason="Requested actions are authorized.",
            checked_actions=checked_actions,
            denied_actions=[],
        )


permission_engine = PermissionEngine()