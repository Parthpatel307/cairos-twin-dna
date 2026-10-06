import json
import unittest

from agent.nemotron.client import NemotronClient
from agent.nemotron.fake_client import FakeNemotronClient
from agent.nemotron.planner import NemotronPlanner
from agent.nemotron.prompt import NemotronPromptBuilder
from agent.nemotron.response_parser import NemotronResponseParser
from agent.nemotron.service import NemotronPlanningService
from agent.planner.plan import AgentPlan


class TestNemotron(unittest.TestCase):

    def _plan_data(self):
        return {
            "run_id": "run_090",
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

    def test_client_defaults_and_missing_key_guard(self):
        client = NemotronClient(api_key=None)

        self.assertFalse(client.is_configured())
        self.assertEqual(
            client.base_url,
            "https://api.tokenfactory.nebius.com/",
        )
        self.assertEqual(
            client.model,
            "nvidia/nemotron-3-super-120b-a12b",
        )

        with self.assertRaises(ValueError):
            client.generate("test prompt")

    def test_fake_client_returns_structured_response(self):
        client = FakeNemotronClient(
            json.dumps(self._plan_data())
        )

        response = client.generate("test prompt")

        self.assertEqual(
            response["model"],
            "fake-nemotron",
        )
        self.assertIsNone(response["usage"])
        self.assertEqual(
            json.loads(response["content"])["run_id"],
            "run_090",
        )

    def test_planner_builds_agent_plan(self):
        plan = NemotronPlanner().build_plan(
            self._plan_data()
        )

        self.assertIsInstance(plan, AgentPlan)
        self.assertEqual(plan.run_id, "run_090")
        self.assertEqual(
            plan.steps[0].action,
            "Inspect customer record",
        )

    def test_prompt_contains_governance_constraints(self):
        prompt = NemotronPromptBuilder().build(
            run_id="run_090",
            user_request="Inspect customer record",
            allowed_actions=["Inspect customer record"],
            forbidden_actions=["Delete customer record"],
        )

        self.assertIn(
            "Return ONLY valid JSON",
            prompt,
        )
        self.assertIn(
            "Inspect customer record",
            prompt,
        )
        self.assertIn(
            "Delete customer record",
            prompt,
        )
        self.assertIn(
            "requires_permission",
            prompt,
        )

    def test_response_parser_accepts_fenced_json(self):
        content = (
            "```json\n"
            + json.dumps(self._plan_data())
            + "\n```"
        )

        parsed = NemotronResponseParser().parse(content)

        self.assertEqual(
            parsed["run_id"],
            "run_090",
        )
        self.assertEqual(
            parsed["goal"],
            "Inspect customer record",
        )

    def test_response_parser_rejects_invalid_json(self):
        with self.assertRaises(ValueError):
            NemotronResponseParser().parse(
                "not valid json"
            )

    def test_service_creates_plan(self):
        client = FakeNemotronClient(
            json.dumps(self._plan_data())
        )

        service = NemotronPlanningService(client)

        plan = service.create_plan(
            run_id="run_090",
            user_request="Inspect customer record",
            allowed_actions=["Inspect customer record"],
            forbidden_actions=["Delete customer record"],
        )

        self.assertIsInstance(plan, AgentPlan)
        self.assertEqual(plan.run_id, "run_090")
        self.assertEqual(
            plan.steps[0].tool,
            "customer_lookup",
        )

    def test_service_generate_uses_context(self):
        client = FakeNemotronClient(
            json.dumps(self._plan_data())
        )

        service = NemotronPlanningService(client)

        plan = service.generate(
            goal="Inspect customer record",
            context={
                "run_id": "run_090",
                "allowed_actions": [
                    "Inspect customer record"
                ],
                "forbidden_actions": [
                    "Delete customer record"
                ],
            },
        )

        self.assertEqual(
            plan.run_id,
            "run_090",
        )
        self.assertEqual(
            plan.goal,
            "Inspect customer record",
        )

    def test_service_generate_requires_run_id(self):
        client = FakeNemotronClient(
            json.dumps(self._plan_data())
        )

        service = NemotronPlanningService(client)

        with self.assertRaises(ValueError):
            service.generate(
                goal="Inspect customer record",
                context={},
            )


if __name__ == "__main__":
    unittest.main()