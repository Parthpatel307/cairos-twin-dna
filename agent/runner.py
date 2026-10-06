from typing import Any, Callable, Dict, List, Tuple

from agent.agentdna.recorder import ExecutionRecorder
from agent.nemotron.service import NemotronPlanningService
from agent.planner.executor import PlanExecutor


ToolExecutor = Callable[
    [
        str,
        Dict[str, Any],
    ],
    Dict[str, Any],
]


class AgentRunner:
    """
    Connects planning and execution into one agent workflow.
    """

    def __init__(
        self,
        planning_service: NemotronPlanningService,
        tool_executor: ToolExecutor,
    ) -> None:
        self.planning_service = planning_service
        self.plan_executor = PlanExecutor(
            tool_executor
        )

    def run(
        self,
        run_id: str,
        user_request: str,
        allowed_actions: List[str],
        forbidden_actions: List[str],
    ) -> Tuple[Any, ExecutionRecorder]:

        plan = self.planning_service.create_plan(
            run_id=run_id,
            user_request=user_request,
            allowed_actions=allowed_actions,
            forbidden_actions=forbidden_actions,
        )

        recorder = ExecutionRecorder()

        self.plan_executor.execute(
            plan=plan,
            recorder=recorder,
        )

        return plan, recorder