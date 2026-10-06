import unittest

from agent.planner.plan import AgentPlan, PlanStep
from agent.twin import AgentTwin


class AgentTwinTest(unittest.TestCase):

    def test_simulation_blocks_external_tool(self):
        twin = AgentTwin({"balance": 100, "status": "active"})

        result = twin.simulate(
            "run_112",
            [
                {
                    "action_type": "data_read",
                    "action": "read_balance",
                    "input": {},
                },
                {
                    "action_type": "data_write",
                    "action": "update_balance",
                    "input": {"balance": 150},
                },
                {
                    "action_type": "tool_call",
                    "action": "send_payment",
                    "input": {"amount": 50},
                },
            ],
        )

        self.assertFalse(result.success)
        self.assertEqual(result.final_state["balance"], 150)
        self.assertEqual(result.blocked_actions, ["send_payment"])
        self.assertEqual(len(result.actions), 3)

    def test_simulate_plan_uses_agent_plan(self):
        plan = AgentPlan(
            run_id="run_113",
            goal="update customer status",
            steps=[
                PlanStep(
                    step_id=1,
                    action_type="data_write",
                    action="update_customer",
                    input={"status": "verified"},
                ),
            ],
            allowed_actions=["update_customer"],
            forbidden_actions=[],
            success_criteria=["status becomes verified"],
        )

        twin = AgentTwin({"status": "pending"})
        result = twin.simulate_plan(plan)

        self.assertTrue(result.success)
        self.assertEqual(result.run_id, "run_113")
        self.assertEqual(result.final_state["status"], "verified")
        self.assertEqual(len(result.actions), 1)


if __name__ == "__main__":
    unittest.main()
