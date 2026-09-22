from enum import Enum
from typing import List

from pydantic import BaseModel, Field


class SimulationStatus(str, Enum):
    SAFE = "safe"
    WARNING = "warning"
    BLOCKED = "blocked"


class SimulationRequest(BaseModel):
    agent_id: str
    action: str
    target: str
    parameters: dict = Field(default_factory=dict)


class SimulationResult(BaseModel):
    agent_id: str
    action: str
    target: str
    status: SimulationStatus
    risk_score: int
    affected_resources: List[str]
    predicted_changes: List[str]
    warnings: List[str]
    can_execute: bool
    explanation: str


class AgentTwin:
    """
    CAIROS Agent Twin.

    Simulates an agent action inside a controlled virtual environment.
    No real external system is modified.
    """

    DESTRUCTIVE_ACTIONS = {
        "delete",
        "delete_database",
        "drop_database",
        "remove",
    }

    SENSITIVE_TARGETS = {
        "production",
        "production_db",
        "bank",
        "payment",
        "credentials",
        "user_database",
    }

    def simulate(self, request: SimulationRequest) -> SimulationResult:
        action = request.action.lower().strip()
        target = request.target.lower().strip()

        risk_score = 10
        affected_resources: List[str] = []
        predicted_changes: List[str] = []
        warnings: List[str] = []

        # Sensitive target detection
        if target in self.SENSITIVE_TARGETS:
            risk_score += 40
            affected_resources.append(target)
            warnings.append(
                "The requested target is a sensitive resource."
            )

        # Destructive action detection
        if action in self.DESTRUCTIVE_ACTIONS:
            risk_score += 40
            predicted_changes.append(
                f"Potential destructive operation on {target}."
            )
            warnings.append(
                "The requested action may permanently modify or delete data."
            )

        # Database operations
        if "database" in action or "database" in target:
            risk_score += 20
            affected_resources.append("database")
            predicted_changes.append(
                "Database state may change."
            )

        # External actions
        if action in {
            "send_email",
            "send_message",
            "make_payment",
            "transfer_funds",
            "deploy",
        }:
            risk_score += 30
            affected_resources.append("external_system")
            warnings.append(
                "The action can create an external side effect."
            )

        risk_score = min(risk_score, 100)

        if risk_score >= 80:
            status = SimulationStatus.BLOCKED
            can_execute = False
            explanation = (
                "Agent Twin predicts a high-impact operation. "
                "The action must not reach the real environment "
                "without explicit human approval."
            )

        elif risk_score >= 50:
            status = SimulationStatus.WARNING
            can_execute = False
            explanation = (
                "Agent Twin detected meaningful risk. "
                "The action should undergo additional risk analysis "
                "and human approval before execution."
            )

        else:
            status = SimulationStatus.SAFE
            can_execute = True
            explanation = (
                "Agent Twin found no high-impact side effects "
                "in the simulated environment."
            )

        if not affected_resources:
            affected_resources.append("no_known_external_resource")

        return SimulationResult(
            agent_id=request.agent_id,
            action=request.action,
            target=request.target,
            status=status,
            risk_score=risk_score,
            affected_resources=affected_resources,
            predicted_changes=predicted_changes,
            warnings=warnings,
            can_execute=can_execute,
            explanation=explanation,
        )


agent_twin = AgentTwin()