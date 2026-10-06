import unittest

from agent.nemotron.fake_client import FakeNemotronClient
from agent.nemotron.service import NemotronPlanningService
from agent.safe_forensic_runner import SafeForensicRunner


FAKE_PLAN = """
{
  "run_id": "run_125",
  "goal": "read customer record",
  "steps": [
    {
      "step_id": 1,
      "action_type": "data_read",
      "action": "read_customer",
      "tool": "customer_lookup",
      "input": {"customer_id": "C001"},
      "reason": "Retrieve the customer record",
      "requires_permission": false
    }
  ],
  "allowed_actions": ["read_customer"],
  "forbidden_actions": [],
  "success_criteria": ["customer record is returned"]
}
"""


class EndToEndTest(unittest.TestCase):

    def test_nemotron_to_safety_to_agentdna(self):
        planning_service = NemotronPlanningService(
            FakeNemotronClient(FAKE_PLAN)
        )

        def tool_executor(tool, inputs):
            self.assertEqual(tool, "customer_lookup")
            self.assertEqual(inputs["customer_id"], "C001")
            return {
                "customer_id": "C001",
                "status": "found",
            }

        runner = SafeForensicRunner(
            planning_service=planning_service,
            tool_executor=tool_executor,
        )

        plan, decision, recorder, dna_result = runner.run(
            run_id="run_125",
            user_request="read customer record",
            allowed_actions=["read_customer"],
            forbidden_actions=[],
        )

        self.assertEqual(plan.run_id, "run_125")
        self.assertEqual(decision.decision, "ALLOW")
        self.assertGreater(recorder.count(), 0)
        self.assertIsNotNone(dna_result)
        self.assertEqual(dna_result.status, "success")
        self.assertEqual(dna_result.run_id, "run_125")
        self.assertIsNotNone(dna_result.execution_graph)
        self.assertIsNotNone(dna_result.plan_consistency)
        self.assertTrue(dna_result.plan_consistency.consistent)


if __name__ == "__main__":
    unittest.main()
