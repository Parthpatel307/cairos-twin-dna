import json
import unittest

from agent.nemotron.fake_client import FakeNemotronClient
from agent.nemotron.service import NemotronPlanningService
from agent.runner import AgentRunner


class TestAgentRunner(unittest.TestCase):

    def test_run_creates_plan_and_execution_trace(self):
        response = json.dumps(
            {
                "run_id": "run_093",
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

        runner = AgentRunner(
            planning_service=planning_service,
            tool_executor=lambda tool, inputs: {
                "customer_id": inputs["customer_id"],
                "status": "found",
            },
        )

        plan, recorder = runner.run(
            run_id="run_093",
            user_request="Inspect customer record",
            allowed_actions=[
                "Inspect customer record"
            ],
            forbidden_actions=[
                "Delete customer record"
            ],
        )

        events = recorder.get_events()

        self.assertEqual(plan.run_id, "run_093")
        self.assertEqual(
            plan.goal,
            "Inspect customer record",
        )
        self.assertEqual(len(events), 5)

        self.assertEqual(
            events[0].event_type,
            "plan_created",
        )
        self.assertEqual(
            events[1].event_type,
            "decision",
        )
        self.assertEqual(
            events[2].event_type,
            "tool_call",
        )
        self.assertEqual(
            events[3].event_type,
            "tool_response",
        )
        self.assertEqual(
            events[4].event_type,
            "result",
        )

        self.assertEqual(
            events[3].output["status"],
            "found",
        )
        self.assertEqual(
            events[4].output["status"],
            "success",
        )


if __name__ == "__main__":
    unittest.main()