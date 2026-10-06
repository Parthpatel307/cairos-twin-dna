import json
import unittest

from agent.agentdna.runner_analysis import AgentForensicRunner
from agent.nemotron.fake_client import FakeNemotronClient
from agent.nemotron.service import NemotronPlanningService
from agent.tools.registry import ToolRegistry


class TestForensicRegistry(unittest.TestCase):

    def test_registry_drives_full_forensic_flow(self):
        response = json.dumps(
            {
                "run_id": "run_074",
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

        registry = ToolRegistry()

        registry.register(
            "customer_lookup",
            lambda inputs: {
                "customer_id": inputs["customer_id"],
                "status": "found",
            },
        )

        runner = AgentForensicRunner(
            planning_service=planning_service,
            tool_executor=registry.execute,
        )

        plan, recorder, result = runner.run(
            goal="Inspect customer record",
            context={
                "run_id": "run_074",
                "allowed_actions": [
                    "Inspect customer record"
                ],
                "forbidden_actions": [
                    "Delete customer record"
                ],
            },
        )

        events = recorder.get_events()

        self.assertEqual(plan.run_id, "run_074")
        self.assertEqual(len(events), 5)
        self.assertEqual(events[3].output["status"], "found")
        self.assertEqual(result.status, "success")
        self.assertTrue(result.plan_consistency.consistent)


if __name__ == "__main__":
    unittest.main()