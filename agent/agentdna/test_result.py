import unittest

from agent.agentdna.plan_consistency import PlanConsistencyResult
from agent.agentdna.result import AgentDNAResult


class TestAgentDNAResult(unittest.TestCase):

    def test_plan_consistency_is_serialized(self):
        consistency = PlanConsistencyResult(
            consistent=False,
            planned_actions=["Inspect customer record"],
            executed_actions=[
                "Inspect customer record",
                "Delete customer table",
            ],
            unexpected_actions=["Delete customer table"],
            missing_actions=[],
        )

        result = AgentDNAResult(
            run_id="result_test_001",
            status="verified",
            failure=None,
            suspicious_events=[],
            root_cause=None,
            replay=None,
            causal_verification=None,
            execution_graph={
                "run_id": "result_test_001",
                "nodes": [],
                "edges": [],
            },
            plan_consistency=consistency,
        )

        data = result.to_dict()

        self.assertIn("plan_consistency", data)
        self.assertEqual(
            data["plan_consistency"]["consistent"],
            False,
        )
        self.assertEqual(
            data["plan_consistency"]["planned_actions"],
            ["Inspect customer record"],
        )
        self.assertEqual(
            data["plan_consistency"]["executed_actions"],
            [
                "Inspect customer record",
                "Delete customer table",
            ],
        )
        self.assertEqual(
            data["plan_consistency"]["unexpected_actions"],
            ["Delete customer table"],
        )
        self.assertEqual(
            data["plan_consistency"]["missing_actions"],
            [],
        )


if __name__ == "__main__":
    unittest.main()