import unittest

from agent.planner.plan import AgentPlan, PlanStep
from agent.safe_forensic_runner import SafeForensicRunner


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


class SafeForensicRunnerTest(unittest.TestCase):

    def test_allowed_execution_produces_agentdna_result(self):
        plan = AgentPlan(
            run_id="run_123a",
            goal="read customer",
            steps=[
                PlanStep(
                    step_id=1,
                    action_type="data_read",
                    action="read_customer",
                    tool="customer_lookup",
                    input={"customer_id": "C001"},
                ),
            ],
            allowed_actions=["read_customer"],
            forbidden_actions=[],
            success_criteria=["customer is read"],
        )

        def tool_executor(tool, inputs):
            return {"customer_id": inputs["customer_id"], "status": "found"}

        runner = SafeForensicRunner(
            planning_service=StubPlanningService(plan),
            tool_executor=tool_executor,
        )

        returned_plan, decision, recorder, dna_result = runner.run(
            run_id="run_123a",
            user_request="read customer",
            allowed_actions=["read_customer"],
            forbidden_actions=[],
        )

        self.assertIs(returned_plan, plan)
        self.assertEqual(decision.decision, "ALLOW")
        self.assertGreater(recorder.count(), 0)
        self.assertIsNotNone(dna_result)
        self.assertEqual(dna_result.status, "success")
        self.assertEqual(dna_result.run_id, "run_123a")

    def test_blocked_execution_does_not_run_agentdna(self):
        plan = AgentPlan(
            run_id="run_123b",
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

        runner = SafeForensicRunner(
            planning_service=StubPlanningService(plan),
            tool_executor=tool_executor,
        )

        _, decision, recorder, dna_result = runner.run(
            run_id="run_123b",
            user_request="update and notify customer",
            allowed_actions=["update_customer"],
            forbidden_actions=[],
        )

        self.assertEqual(decision.decision, "ASK_HUMAN")
        self.assertEqual(calls, [])
        self.assertGreater(recorder.count(), 0)
        self.assertIsNone(dna_result)


if __name__ == "__main__":
    unittest.main()
