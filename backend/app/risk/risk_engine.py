from enum import Enum
from typing import List

from pydantic import BaseModel, Field


class RiskSeverity(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class RiskRequest(BaseModel):
    action: str
    target: str
    simulation_risk_score: int = Field(ge=0, le=100)
    affected_resources: List[str] = Field(default_factory=list)
    warnings: List[str] = Field(default_factory=list)


class RiskResult(BaseModel):
    risk_score: int
    severity: RiskSeverity
    blast_radius: str
    affected_resources: List[str]
    potential_impacts: List[str]
    requires_human_approval: bool
    recommendation: str


class RiskEngine:
    """
    CAIROS Risk and Blast-Radius Engine.

    Converts Agent Twin simulation results into a structured
    risk assessment before any real-world execution.
    """

    def analyze(self, request: RiskRequest) -> RiskResult:
        score = request.simulation_risk_score

        potential_impacts: List[str] = []

        action = request.action.lower()
        target = request.target.lower()

        # Destructive operations
        if any(
            keyword in action
            for keyword in {
                "delete",
                "drop",
                "remove",
                "destroy",
            }
        ):
            potential_impacts.append(
                "Permanent data or resource loss may occur."
            )
            score += 10

        # Production environment
        if "production" in target:
            potential_impacts.append(
                "A production system may be affected."
            )
            score += 10

        # Database impact
        if "database" in action or "database" in target:
            potential_impacts.append(
                "Database state may be modified."
            )
            score += 5

        # External side effects
        if any(
            keyword in action
            for keyword in {
                "payment",
                "transfer",
                "send_email",
                "send_message",
                "deploy",
            }
        ):
            potential_impacts.append(
                "The action may create an external side effect."
            )
            score += 10

        score = min(score, 100)

        severity = self._calculate_severity(score)

        blast_radius = self._calculate_blast_radius(
            severity=severity,
            affected_resources=request.affected_resources,
        )

        requires_human_approval = severity in {
            RiskSeverity.HIGH,
            RiskSeverity.CRITICAL,
        }

        recommendation = self._recommend(
            severity=severity,
            requires_human_approval=requires_human_approval,
        )

        return RiskResult(
            risk_score=score,
            severity=severity,
            blast_radius=blast_radius,
            affected_resources=request.affected_resources,
            potential_impacts=potential_impacts,
            requires_human_approval=requires_human_approval,
            recommendation=recommendation,
        )

    def _calculate_severity(self, score: int) -> RiskSeverity:
        if score >= 90:
            return RiskSeverity.CRITICAL

        if score >= 70:
            return RiskSeverity.HIGH

        if score >= 40:
            return RiskSeverity.MEDIUM

        return RiskSeverity.LOW

    def _calculate_blast_radius(
        self,
        severity: RiskSeverity,
        affected_resources: List[str],
    ) -> str:
        resource_count = len(set(affected_resources))

        if severity == RiskSeverity.CRITICAL:
            return "system-wide"

        if severity == RiskSeverity.HIGH:
            return "multi-resource"

        if severity == RiskSeverity.MEDIUM:
            if resource_count > 1:
                return "multi-resource"
            return "single-resource"

        return "single-resource"

    def _recommend(
        self,
        severity: RiskSeverity,
        requires_human_approval: bool,
    ) -> str:
        if severity == RiskSeverity.CRITICAL:
            return (
                "BLOCK execution. Require explicit human review "
                "and additional verification."
            )

        if severity == RiskSeverity.HIGH:
            return (
                "ASK HUMAN before execution. Do not execute "
                "automatically."
            )

        if severity == RiskSeverity.MEDIUM:
            return (
                "Continue with additional simulation and "
                "policy validation before execution."
            )

        return (
            "Action may proceed to the final authorization check."
        )


risk_engine = RiskEngine()