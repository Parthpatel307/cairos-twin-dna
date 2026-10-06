import unittest

from agent.agentdna.runner_analysis import AgentForensicRunner
from agent.planner.plan import AgentPlan, PlanStep


class FakePlanningClient:
    def __init__(self, run_id: str):
        self.run_id = run_id

    def generate(self, goal, context):
        return AgentPlan(
            run_id=self.run_id,
            goal=goal,
            steps=[
                PlanStep(
                    step_id=1,
                    action_type="data_read",
                    action="Inspect customer record",
                    tool="read_customer_record",
                    input={"customer_id": "C001"},
                    reason="Read the requested customer",
                    requires_permission=True,
                )
            ],
            allowed_actions=["read_customer_record"],
            forbidden_actions=["delete_customer_table"],
            success_criteria=["Customer record inspected"],
        )


class TestAgentForensicRunner(unittest.TestCase):

    def create_runner(self, run_id):
        def tool_executor(tool_name, tool_input):
            return {
                "tool": tool_name,
                "input": tool_input,
                "status": "success",
            }

        return AgentForensicRunner(
            planning_service=FakePlanningClient(run_id),
            tool_executor=tool_executor,
        )

    def test_runner_success_flow(self):
        runner = self.create_runner("integration_run_001")

        plan, recorder, result = runner.run(
            goal="Inspect customer record",
            context={"customer_id": "C001"},
        )

        self.assertEqual(plan.run_id, "integration_run_001")
        self.assertGreater(recorder.count(), 0)
        self.assertEqual(result.run_id, "integration_run_001")
        self.assertEqual(result.status, "success")

    def test_result_contains_execution_graph(self):
        runner = self.create_runner("integration_run_002")

        plan, recorder, result = runner.run(
            goal="Inspect customer record",
            context={"customer_id": "C001"},
        )

        self.assertEqual(
            result.execution_graph["run_id"],
            "integration_run_002",
        )
        self.assertGreater(
            len(result.execution_graph["nodes"]),
            0,
        )
        self.assertGreater(
            len(result.execution_graph["edges"]),
            0,
        )

    def test_result_contains_plan_consistency(self):
        runner = self.create_runner("integration_run_003")

        plan, recorder, result = runner.run(
            goal="Inspect customer record",
            context={"customer_id": "C001"},
        )

        self.assertIsNotNone(result.plan_consistency)
        self.assertTrue(result.plan_consistency.consistent)

        self.assertEqual(
            result.plan_consistency.planned_actions,
            ["Inspect customer record"],
        )

        self.assertEqual(
            result.plan_consistency.executed_actions,
            ["Inspect customer record"],
        )

        self.assertEqual(
            result.plan_consistency.unexpected_actions,
            [],
        )

        self.assertEqual(
            result.plan_consistency.missing_actions,
            [],
        )


if __name__ == "__main__":
    unittest.main()