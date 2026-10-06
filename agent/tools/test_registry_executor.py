import unittest

from agent.agentdna.recorder import ExecutionRecorder
from agent.planner.executor import PlanExecutor
from agent.planner.plan import AgentPlan, PlanStep
from agent.tools.registry import ToolRegistry


class TestToolRegistryExecutor(unittest.TestCase):

    def test_registry_executes_planned_tool(self):
        registry = ToolRegistry()

        registry.register(
            "customer_lookup",
            lambda inputs: {
                "customer_id": inputs["customer_id"],
                "status": "found",
            },
        )

        plan = AgentPlan(
            run_id="run_071",
            goal="Inspect customer record",
            steps=[
                PlanStep(
                    step_id=1,
                    action_type="data_read",
                    action="Inspect customer record",
                    tool="customer_lookup",
                    input={"customer_id": "C001"},
                    reason="Read the customer record",
                    requires_permission=False,
                )
            ],
            allowed_actions=["Inspect customer record"],
            forbidden_actions=["Delete customer record"],
            success_criteria=["Customer record inspected"],
        )

        recorder = ExecutionRecorder()

        executor = PlanExecutor(registry.execute)
        executor.execute(plan, recorder)

        events = recorder.get_events()

        self.assertEqual(len(events), 5)
        self.assertEqual(events[0].event_type, "plan_created")
        self.assertEqual(events[1].event_type, "decision")
        self.assertEqual(events[2].event_type, "tool_call")
        self.assertEqual(events[3].event_type, "tool_response")
        self.assertEqual(events[4].event_type, "result")
        self.assertEqual(events[3].output["status"], "found")
        self.assertEqual(events[4].output["status"], "success")


if __name__ == "__main__":
    unittest.main()