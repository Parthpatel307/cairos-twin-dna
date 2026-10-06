from typing import Any, Callable, Dict

from agent.agentdna.recorder import ExecutionRecorder
from agent.agentdna.trace import AgentTrace
from agent.planner.plan import AgentPlan


ToolExecutor = Callable[
    [
        str,
        Dict[str, Any],
    ],
    Dict[str, Any],
]


class PlanExecutor:
    """
    Executes an AgentPlan while recording observable execution
    events through AgentDNA.
    """

    def __init__(
        self,
        tool_executor: ToolExecutor,
    ) -> None:
        self.tool_executor = tool_executor

    def execute(
        self,
        plan: AgentPlan,
        recorder: ExecutionRecorder,
    ) -> None:
        trace = AgentTrace(
            run_id=plan.run_id,
            recorder=recorder,
        )

        trace.record_plan(
            plan.to_dict()
        )

        for step in plan.steps:
            if step.requires_permission:
                trace._record(
                    event_type="permission_check",
                    actor="system",
                    action=step.action,
                    tool=step.tool,
                    input_data=step.input,
                    metadata={
                        "required": True
                    },
                )

            trace.record_decision(
                decision=step.action,
                reason=step.reason,
            )

            tool_name = step.tool

            if not tool_name:
                trace.record_error(
                    {
                        "type": "missing_tool",
                        "message": (
                            f"No tool specified for step "
                            f"{step.step_id}"
                        ),
                    }
                )

                raise ValueError(
                    f"No tool specified for step {step.step_id}"
                )

            trace.record_tool_call(
                tool=tool_name,
                input_data=step.input,
            )

            result = self.tool_executor(
                tool_name,
                step.input or {},
            )

            trace.record_tool_response(
                tool=tool_name,
                output_data=result,
            )

        trace.record_result(
            {
                "status": "success",
                "message": "Agent plan executed successfully.",
            }
        )