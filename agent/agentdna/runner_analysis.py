from typing import Any, Callable, Dict, Optional, Tuple

from agent.agentdna.recorder import ExecutionRecorder
from agent.planner.executor import PlanExecutor
from agent.planner.plan import AgentPlan

from .result import AgentDNAResult
from .service import AgentDNAService


PlanningService = Any
ToolExecutor = Callable[[str, Dict[str, Any]], Any]


class AgentForensicRunner:
    def __init__(
        self,
        planning_service: PlanningService,
        tool_executor: ToolExecutor,
        dna_service: Optional[AgentDNAService] = None,
    ):
        self.planning_service = planning_service
        self.plan_executor = PlanExecutor(tool_executor)
        self.dna_service = dna_service or AgentDNAService()

    def run(
        self,
        goal: str,
        context: Optional[Dict[str, Any]] = None,
        alternative_action: Optional[str] = None,
    ) -> Tuple[AgentPlan, ExecutionRecorder, AgentDNAResult]:

        plan = self.planning_service.generate(
            goal=goal,
            context=context or {},
        )

        recorder = ExecutionRecorder()

        self.plan_executor.execute(
            plan,
            recorder,
        )

        result = self.dna_service.analyze(
            events=recorder.get_events(),
            alternative_action=alternative_action,
            plan=plan,
        )

        return plan, recorder, result