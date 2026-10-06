import unittest

from agent.planner.plan import AgentPlan, PlanStep
from agent.safe_runner import SafeAgentRunner


class StubPlanningService:
    def __init__(self, plan):
        self.plan = plan

    def create_plan(
        self,
        run_id,
        user_request,
        allowed_actions,
        forbidden_actions,
    ):
        return self.plan


class SafeRunnerTest(unittest.TestCase):

    def test_allow_decision_executes_plan(self):
        plan = AgentPlan(
            run_id="run_121a",
            goal="read customer",
            steps=[
                PlanStep(
                    step_id=1,
                    action_type="data_read",
                    action="read_customer",
                    tool="customer_lookup",
                    input={},
                ),
            ],
            allowed_actions=["read_customer"],
            forbidden_actions=[],
            success_criteria=["customer is read"],
        )

        calls = []

        def tool_executor(tool, inputs):
            calls.append((tool, inputs))
            return {"status": "ok"}

        runner = SafeAgentRunner(
            planning_service=StubPlanningService(plan),
            tool_executor=tool_executor,
        )

        returned_plan, decision, recorder = runner.run(
            run_id="run_121a",
            user_request="read customer",
            allowed_actions=["read_customer"],
            forbidden_actions=[],
        )

        self.assertIs(returned_plan, plan)
        self.assertEqual(decision.decision, "ALLOW")
        self.assertEqual(len(calls), 1)
        self.assertGreater(recorder.count(), 0)

        decision_events = [
            event
            for event in recorder.get_events()
            if event.event_type == "decision"
        ]

        self.assertGreaterEqual(len(decision_events), 1)
        self.assertEqual(decision_events[0].action, "ALLOW")

    def test_high_risk_plan_is_not_executed(self):
        plan = AgentPlan(
            run_id="run_121b",
            goal="update and notify customer",
            steps=[
                PlanStep(
                    step_id=1,
                    action_type="data_write",
                    action="update_customer",
                    input={"status": "verified"},
                ),
                PlanStep(
                    step_id=2,
                    action_type="tool_call",
                    action="send_notification",
                    tool="notify_customer",
                    input={"customer_id": "C001"},
                ),
            ],
            allowed_actions=["update_customer"],
            forbidden_actions=[],
            success_criteria=["customer is verified"],
        )

        calls = []

        def tool_executor(tool, inputs):
            calls.append((tool, inputs))
            return {"status": "ok"}

        runner = SafeAgentRunner(
            planning_service=StubPlanningService(plan),
            tool_executor=tool_executor,
        )

        _, decision, recorder = runner.run(
            run_id="run_121b",
            user_request="update and notify customer",
            allowed_actions=["update_customer"],
            forbidden_actions=[],
        )

        self.assertEqual(decision.decision, "ASK_HUMAN")
        self.assertEqual(calls, [])

        decision_events = [
            event
            for event in recorder.get_events()
            if event.event_type == "decision"
        ]

        self.assertEqual(len(decision_events), 1)
        self.assertEqual(decision_events[0].action, "ASK_HUMAN")


if __name__ == "__main__":
    unittest.main()
