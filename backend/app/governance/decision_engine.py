from enum import Enum
from typing import List

from pydantic import BaseModel

from app.governance.permission_engine import (
    PermissionDecision,
    PermissionResult,
)
from app.risk.risk_engine import RiskResult, RiskSeverity
from app.simulation.agent_twin import SimulationResult, SimulationStatus


class FinalDecision(str, Enum):
    ALLOW = "allow"
    BLOCK = "block"
    ASK_HUMAN = "ask_human"


class DecisionRequest(BaseModel):
    permission: PermissionResult
    simulation: SimulationResult
    risk: RiskResult


class DecisionResult(BaseModel):
    decision: FinalDecision
    reason: str
    safety_checks_passed: List[str]
    safety_checks_failed: List[str]
    requires_human_approval: bool


class DecisionEngine:
    """
    CAIROS Final Decision Engine.

    Combines authorization, simulation, and risk analysis
    before allowing an agent action to reach execution.
    """

    def decide(
        self,
        request: DecisionRequest,
    ) -> DecisionResult:

        passed: List[str] = []
        failed: List[str] = []

        permission = request.permission
        simulation = request.simulation
        risk = request.risk

        # 1. Permission check
        if permission.decision == PermissionDecision.BLOCK:
            failed.append("permission_check")

            return DecisionResult(
                decision=FinalDecision.BLOCK,
                reason=(
                    "The requested action is not authorized "
                    "for the current execution context."
                ),
                safety_checks_passed=passed,
                safety_checks_failed=failed,
                requires_human_approval=False,
            )

        passed.append("permission_check")

        # 2. Agent Twin simulation check
        if simulation.status == SimulationStatus.BLOCKED:
            failed.append("agent_twin_simulation")

            return DecisionResult(
                decision=FinalDecision.BLOCK,
                reason=(
                    "Agent Twin detected a high-impact operation "
                    "that should not reach the real environment."
                ),
                safety_checks_passed=passed,
                safety_checks_failed=failed,
                requires_human_approval=False,
            )

        passed.append("agent_twin_simulation")

        # 3. Critical risk
        if risk.severity == RiskSeverity.CRITICAL:
            failed.append("risk_check")

            return DecisionResult(
                decision=FinalDecision.BLOCK,
                reason=(
                    "Critical risk detected. CAIROS blocks "
                    "automatic execution."
                ),
                safety_checks_passed=passed,
                safety_checks_failed=failed,
                requires_human_approval=True,
            )

        # 4. High risk
        if risk.severity == RiskSeverity.HIGH:
            failed.append("risk_check")

            return DecisionResult(
                decision=FinalDecision.ASK_HUMAN,
                reason=(
                    "High-risk operation detected. "
                    "Explicit human approval is required."
                ),
                safety_checks_passed=passed,
                safety_checks_failed=failed,
                requires_human_approval=True,
            )

        passed.append("risk_check")

        # 5. Permission engine may explicitly require approval
        if permission.decision == PermissionDecision.ASK_HUMAN:
            return DecisionResult(
                decision=FinalDecision.ASK_HUMAN,
                reason=(
                    "The permission policy requires human approval "
                    "before this action can be executed."
                ),
                safety_checks_passed=passed,
                safety_checks_failed=failed,
                requires_human_approval=True,
            )

        # 6. Medium-risk simulation warning
        if (
            risk.severity == RiskSeverity.MEDIUM
            or simulation.status == SimulationStatus.WARNING
        ):
            return DecisionResult(
                decision=FinalDecision.ASK_HUMAN,
                reason=(
                    "The operation has meaningful risk or simulation "
                    "warnings and requires human review."
                ),
                safety_checks_passed=passed,
                safety_checks_failed=failed,
                requires_human_approval=True,
            )

        # 7. Safe execution
        return DecisionResult(
            decision=FinalDecision.ALLOW,
            reason=(
                "Authorization, simulation, and risk checks "
                "passed successfully."
            ),
            safety_checks_passed=passed,
            safety_checks_failed=failed,
            requires_human_approval=False,
        )


decision_engine = DecisionEngine()