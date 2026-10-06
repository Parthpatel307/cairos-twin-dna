import unittest

from agent.planner.plan import AgentPlan, PlanStep
from agent.risk import RiskAnalyzer
from agent.twin import AgentTwin


class SafetyFlowTest(unittest.TestCase):

    def test_plan_to_simulation_to_risk(self):
        plan = AgentPlan(
            run_id="run_117",
            goal="update customer",
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

        twin = AgentTwin({"status": "pending"})
        twin_result = twin.simulate_plan(plan)
        assessment = RiskAnalyzer().analyze(twin_result)

        self.assertFalse(twin_result.success)
        self.assertEqual(twin_result.final_state["status"], "verified")
        self.assertEqual(twin_result.blocked_actions, ["send_notification"])
        self.assertEqual(twin_result.run_id, "run_117")
        self.assertEqual(assessment.run_id, "run_117")
        self.assertEqual(assessment.risk_score, 60)
        self.assertEqual(assessment.risk_level, "high")
        self.assertEqual(assessment.blast_radius, 1)


if __name__ == "__main__":
    unittest.main()
