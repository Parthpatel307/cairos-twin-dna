import unittest

from agent.agentdna.plan_consistency import PlanConsistencyChecker
from agent.agentdna.recorder import ExecutionRecorder
from agent.agentdna.trace import AgentTrace
from agent.planner.plan import AgentPlan, PlanStep


class TestPlanConsistencyChecker(unittest.TestCase):

    def build_plan(self):
        return AgentPlan(
            run_id="run_consistency_test",
            goal="Inspect customer record",
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
            forbidden_actions=[
                "delete_customer_table",
                "drop_database",
            ],
            success_criteria=["Customer record inspected"],
        )

    def test_consistent_execution(self):
        plan = self.build_plan()

        recorder = ExecutionRecorder()
        trace = AgentTrace(
            run_id=plan.run_id,
            recorder=recorder,
        )

        trace.record_decision(
            "Inspect customer record",
            "Read the requested customer",
        )

        result = PlanConsistencyChecker().check(
            plan=plan,
            events=recorder.get_events(),
        )

        self.assertTrue(result.consistent)
        self.assertEqual(
            result.planned_actions,
            ["Inspect customer record"],
        )
        self.assertEqual(
            result.executed_actions,
            ["Inspect customer record"],
        )
        self.assertEqual(result.unexpected_actions, [])
        self.assertEqual(result.missing_actions, [])

    def test_unexpected_action_is_detected(self):
        plan = self.build_plan()

        recorder = ExecutionRecorder()
        trace = AgentTrace(
            run_id=plan.run_id,
            recorder=recorder,
        )

        trace.record_decision(
            "Inspect customer record",
            "Read the requested customer",
        )

        trace.record_decision(
            "Delete customer table",
            "Unexpected action",
        )

        result = PlanConsistencyChecker().check(
            plan=plan,
            events=recorder.get_events(),
        )

        self.assertFalse(result.consistent)
        self.assertEqual(
            result.unexpected_actions,
            ["Delete customer table"],
        )
        self.assertEqual(result.missing_actions, [])

    def test_missing_action_is_detected(self):
        plan = self.build_plan()

        recorder = ExecutionRecorder()

        result = PlanConsistencyChecker().check(
            plan=plan,
            events=recorder.get_events(),
        )

        self.assertFalse(result.consistent)
        self.assertEqual(result.unexpected_actions, [])
        self.assertEqual(
            result.missing_actions,
            ["Inspect customer record"],
        )


if __name__ == "__main__":
    unittest.main()