import unittest

from agent.agentdna.event import ExecutionEvent
from agent.agentdna.service import AgentDNAService
from agent.planner.plan import AgentPlan, PlanStep


class TestAgentDNAService(unittest.TestCase):

    def build_plan(self, run_id):
        return AgentPlan(
            run_id=run_id,
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
            forbidden_actions=["delete_customer_table"],
            success_criteria=["Customer record inspected"],
        )

    def test_plan_consistency_is_included_in_result(self):
        run_id = "service_consistency_001"
        plan = self.build_plan(run_id)

        events = [
            ExecutionEvent(
                event_id="event_001",
                run_id=run_id,
                sequence=1,
                timestamp="2026-01-01T00:00:00Z",
                event_type="decision",
                actor="agent",
                action="Inspect customer record",
            )
        ]

        result = AgentDNAService().analyze(
            events=events,
            plan=plan,
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

    def test_unexpected_action_makes_plan_inconsistent(self):
        run_id = "service_consistency_002"
        plan = self.build_plan(run_id)

        events = [
            ExecutionEvent(
                event_id="event_001",
                run_id=run_id,
                sequence=1,
                timestamp="2026-01-01T00:00:00Z",
                event_type="decision",
                actor="agent",
                action="Inspect customer record",
            ),
            ExecutionEvent(
                event_id="event_002",
                run_id=run_id,
                sequence=2,
                timestamp="2026-01-01T00:00:01Z",
                event_type="decision",
                actor="agent",
                action="Delete customer table",
            ),
        ]

        result = AgentDNAService().analyze(
            events=events,
            plan=plan,
        )

        self.assertIsNotNone(result.plan_consistency)
        self.assertFalse(result.plan_consistency.consistent)
        self.assertEqual(
            result.plan_consistency.unexpected_actions,
            ["Delete customer table"],
        )
        self.assertEqual(
            result.plan_consistency.missing_actions,
            [],
        )

    def test_missing_action_makes_plan_inconsistent(self):
        run_id = "service_consistency_003"
        plan = self.build_plan(run_id)

        events = []

        result = AgentDNAService().analyze(
            events=[
                ExecutionEvent(
                    event_id="event_001",
                    run_id=run_id,
                    sequence=1,
                    timestamp="2026-01-01T00:00:00Z",
                    event_type="user_request",
                    actor="user",
                    action="Inspect customer record",
                )
            ],
            plan=plan,
        )

        self.assertIsNotNone(result.plan_consistency)
        self.assertFalse(result.plan_consistency.consistent)
        self.assertEqual(
            result.plan_consistency.unexpected_actions,
            [],
        )
        self.assertEqual(
            result.plan_consistency.missing_actions,
            ["Inspect customer record"],
        )


if __name__ == "__main__":
    unittest.main()