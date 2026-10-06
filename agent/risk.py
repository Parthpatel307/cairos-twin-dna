from dataclasses import dataclass, field
from typing import List

from agent.twin import AgentTwinResult


@dataclass
class RiskAssessment:
    run_id: str
    risk_score: int
    risk_level: str
    blast_radius: int
    factors: List[str] = field(default_factory=list)


class RiskAnalyzer:
    """Deterministic risk and blast-radius analysis for Agent Twin results."""

    def analyze(self, result: AgentTwinResult) -> RiskAssessment:
        score = 0
        factors: List[str] = []

        state_changing_actions = [
            action
            for action in result.actions
            if action.state_before != action.state_after
        ]

        affected_fields = set()

        for action in state_changing_actions:
            before = action.state_before
            after = action.state_after

            for key in set(before) | set(after):
                if before.get(key) != after.get(key):
                    affected_fields.add(key)

        if state_changing_actions:
            score += min(20 * len(state_changing_actions), 60)
            factors.append(
                f"{len(state_changing_actions)} state-changing action(s)"
            )

        if affected_fields:
            score += min(10 * len(affected_fields), 30)
            factors.append(
                f"{len(affected_fields)} state field(s) affected"
            )

        if result.blocked_actions:
            score += min(30 * len(result.blocked_actions), 60)
            factors.append(
                f"{len(result.blocked_actions)} external action(s) blocked"
            )

        if len(result.actions) > 3:
            score += 10
            factors.append("multi-step execution")

        score = min(score, 100)

        if score >= 75:
            risk_level = "critical"
        elif score >= 50:
            risk_level = "high"
        elif score >= 25:
            risk_level = "medium"
        else:
            risk_level = "low"

        blast_radius = len(affected_fields)

        return RiskAssessment(
            run_id=result.run_id,
            risk_score=score,
            risk_level=risk_level,
            blast_radius=blast_radius,
            factors=factors,
        )
