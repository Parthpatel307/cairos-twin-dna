import unittest

from agent.agentdna.recorder import ExecutionRecorder
from agent.planner.executor import PlanExecutor
from agent.planner.parser import AgentPlanParser
from agent.planner.plan import AgentPlan, PlanStep


class TestPlanner(unittest.TestCase):

    def test_plan_step_validation(self):
        step = PlanStep(
            step_id=1,
            action_type="data_read",
            action="Inspect customer record",
            tool="customer_lookup",
            input={"customer_id": "C001"},
            reason="Read the customer record",
            requires_permission=False,
        )

        self.assertEqual(step.step_id, 1)
        self.assertEqual(step.action_type, "data_read")
        self.assertEqual(step.action, "Inspect customer record")
        self.assertEqual(step.tool, "customer_lookup")
        self.assertFalse(step.requires_permission)

        with self.assertRaises(ValueError):
            PlanStep(
                step_id=0,
                action_type="data_read",
                action="Invalid step",
            )

        with self.assertRaises(ValueError):
            PlanStep(
                step_id=1,
                action_type="invalid_type",
                action="Invalid step",
            )

    def test_parser_creates_valid_agent_plan(self):
        data = {
            "run_id": "run_085",
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

        plan = AgentPlanParser().parse(data)

        self.assertIsInstance(plan, AgentPlan)
        self.assertEqual(plan.run_id, "run_085")
        self.assertEqual(plan.goal, "Inspect customer record")
        self.assertEqual(len(plan.steps), 1)
        self.assertEqual(
            plan.steps[0].action,
            "Inspect customer record",
        )
        self.assertEqual(
            plan.to_dict()["run_id"],
            "run_085",
        )

    def test_parser_rejects_missing_required_field(self):
        data = {
            "run_id": "run_085",
            "goal": "Inspect customer record",
            "steps": [],
            "allowed_actions": [],
            "forbidden_actions": [],
        }

        with self.assertRaises(ValueError):
            AgentPlanParser().parse(data)

    def test_executor_records_successful_execution(self):
        plan = AgentPlan(
            run_id="run_085_executor",
            goal="Inspect customer record",
            steps=[
                PlanStep(
                    step_id=1,
                    action_type="data_read",
                    action="Inspect customer record",
                    tool="customer_lookup",
                    input={"customer_id": "C001"},
                    reason="Read the customer record",
                    requires_permission=True,
                )
            ],
            allowed_actions=[
                "Inspect customer record"
            ],
            forbidden_actions=[
                "Delete customer record"
            ],
            success_criteria=[
                "Customer record inspected"
            ],
        )

        recorder = ExecutionRecorder()

        executor = PlanExecutor(
            lambda tool, inputs: {
                "customer_id": inputs["customer_id"],
                "status": "found",
            }
        )

        executor.execute(plan, recorder)

        events = recorder.get_events()

        self.assertEqual(len(events), 6)
        self.assertEqual(
            events[0].event_type,
            "plan_created",
        )
        self.assertEqual(
            events[1].event_type,
            "permission_check",
        )
        self.assertEqual(
            events[2].event_type,
            "decision",
        )
        self.assertEqual(
            events[3].event_type,
            "tool_call",
        )
        self.assertEqual(
            events[4].event_type,
            "tool_response",
        )
        self.assertEqual(
            events[5].event_type,
            "result",
        )
        self.assertEqual(
            events[4].output["status"],
            "found",
        )
        self.assertEqual(
            events[5].output["status"],
            "success",
        )


if __name__ == "__main__":
    unittest.main()