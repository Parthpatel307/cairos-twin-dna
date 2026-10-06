import json
import unittest

from agent.agentdna.runner_analysis import AgentForensicRunner
from agent.nemotron.fake_client import FakeNemotronClient
from agent.nemotron.service import NemotronPlanningService


class TestForensicIntegration(unittest.TestCase):

    def test_fake_nemotron_to_agentdna(self):
        response = json.dumps(
            {
                "run_id": "run_059",
                "goal": "Inspect customer record",
                "steps": [
                    {
                        "step_id": 1,
                        "action_type": "data_read",
                        "action": "Inspect customer record",
                        "tool": "customer_lookup",
                        "input": {
                            "customer_id": "C001"
                        },
                        "reason": "Read the customer record",
                        "requires_permission": False,
                    }
                ],
                "allowed_actions": [
                    "Inspect customer record"
                ],
                "forbidden_actions": [
                    "Delete customer record"
                ],
                "success_criteria": [
                    "Customer record inspected"
                ],
            }
        )

        planning_service = NemotronPlanningService(
            FakeNemotronClient(response)
        )

        runner = AgentForensicRunner(
            planning_service=planning_service,
            tool_executor=lambda tool, inputs: {
                "customer_id": inputs["customer_id"],
                "status": "found",
            },
        )

        plan, recorder, result = runner.run(
            goal="Inspect customer record",
            context={
                "run_id": "run_059",
                "allowed_actions": [
                    "Inspect customer record"
                ],
                "forbidden_actions": [
                    "Delete customer record"
                ],
            },
        )

        self.assertEqual(plan.run_id, "run_059")
        self.assertEqual(len(recorder.get_events()), 5)
        self.assertEqual(result.status, "success")
        self.assertTrue(result.plan_consistency.consistent)


if __name__ == "__main__":
    unittest.main()