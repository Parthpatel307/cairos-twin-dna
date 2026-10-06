import unittest

from agent.planner.plan import AgentPlan, PlanStep
from agent.safety import SafetyGate
from agent.twin import AgentTwin


class SafetyGateTest(unittest.TestCase):

    def test_low_risk_plan_is_allowed(self):
        plan = AgentPlan(
            run_id="run_119a",
            goal="read customer status",
            steps=[
                PlanStep(
                    step_id=1,
                    action_type="data_read",
                    action="read_customer",
                    input={},
                ),
            ],
            allowed_actions=["read_customer"],
            forbidden_actions=[],
            success_criteria=["customer data is read"],
        )

        decision = SafetyGate(
            twin=AgentTwin({"status": "active"})
        ).evaluate(plan)

        self.assertEqual(decision.decision, "ALLOW")
        self.assertEqual(decision.run_id, "run_119a")

    def test_high_risk_plan_requires_human(self):
        plan = AgentPlan(
            run_id="run_119b",
            goal="update and notify customer",
            steps=[
                PlanStep(
                    step_id=1,
                    action_type="data_write",
                    action="update_customer",
                    input={"status": "verified"},
                ),
                PlanStep(
                    step_id=2,
                    action_type="tool_call",
                    action="send_notification",
                    input={"customer_id": "C001"},
                ),
            ],
            allowed_actions=["update_customer"],
            forbidden_actions=[],
            success_criteria=["customer is verified"],
        )

        decision = SafetyGate(
            twin=AgentTwin({"status": "pending"})
        ).evaluate(plan)

        self.assertEqual(decision.decision, "ASK_HUMAN")
        self.assertEqual(decision.risk.risk_level, "high")

    def test_critical_risk_is_blocked(self):
        plan = AgentPlan(
            run_id="run_119c",
            goal="perform dangerous multi-step update",
            steps=[
                PlanStep(
                    step_id=1,
                    action_type="data_write",
                    action="update_status",
                    input={"status": "verified"},
                ),
                PlanStep(
                    step_id=2,
                    action_type="data_write",
                    action="update_balance",
                    input={"balance": 500},
                ),
                PlanStep(
                    step_id=3,
                    action_type="state_change",
                    action="change_account_state",
                    input={"state": "active"},
                ),
                PlanStep(
                    step_id=4,
                    action_type="tool_call",
                    action="send_payment",
                    input={"amount": 500},
                ),
            ],
            allowed_actions=["update_status"],
            forbidden_actions=[],
            success_criteria=["operation completes safely"],
        )

        decision = SafetyGate(
            twin=AgentTwin({"status": "pending", "balance": 100, "state": "review"})
        ).evaluate(plan)

        self.assertEqual(decision.decision, "BLOCK")
        self.assertEqual(decision.risk.risk_level, "critical")


if __name__ == "__main__":
    unittest.main()
