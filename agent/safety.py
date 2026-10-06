from dataclasses import dataclass

from agent.planner.plan import AgentPlan
from agent.risk import RiskAssessment, RiskAnalyzer
from agent.twin import AgentTwin, AgentTwinResult


@dataclass
class SafetyDecision:
    run_id: str
    decision: str
    reason: str
    simulation: AgentTwinResult
    risk: RiskAssessment


class SafetyGate:
    """
    Converts Agent Twin simulation and risk analysis
    into an execution safety decision.
    """

    def __init__(
        self,
        twin: AgentTwin | None = None,
        risk_analyzer: RiskAnalyzer | None = None,
    ) -> None:
        self.twin = twin or AgentTwin()
        self.risk_analyzer = risk_analyzer or RiskAnalyzer()

    def evaluate(self, plan: AgentPlan) -> SafetyDecision:
        simulation = self.twin.simulate_plan(plan)
        risk = self.risk_analyzer.analyze(simulation)

        if risk.risk_score >= 75:
            decision = "BLOCK"
            reason = "Critical risk detected by Agent Twin analysis."

        elif risk.risk_score >= 50:
            decision = "ASK_HUMAN"
            reason = "High risk requires human approval before execution."

        elif simulation.errors:
            decision = "BLOCK"
            reason = "Agent Twin simulation could not safely validate the plan."

        else:
            decision = "ALLOW"
            reason = "Simulation completed without material safety concerns."

        return SafetyDecision(
            run_id=plan.run_id,
            decision=decision,
            reason=reason,
            simulation=simulation,
            risk=risk,
        )
