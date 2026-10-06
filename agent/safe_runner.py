from typing import Any, Callable, Dict, List, Optional, Tuple

from agent.agentdna.recorder import ExecutionRecorder
from agent.agentdna.trace import AgentTrace
from agent.planner.executor import PlanExecutor

from .safety import SafetyDecision, SafetyGate


ToolExecutor = Callable[[str, Dict[str, Any]], Dict[str, Any]]


class SafeAgentRunner:
    """Agent runner with a mandatory pre-execution safety gate."""

    def __init__(
        self,
        planning_service,
        tool_executor: ToolExecutor,
        safety_gate: Optional[SafetyGate] = None,
    ) -> None:
        self.planning_service = planning_service
        self.plan_executor = PlanExecutor(tool_executor)
        self.safety_gate = safety_gate or SafetyGate()

    def run(
        self,
        run_id: str,
        user_request: str,
        allowed_actions: List[str],
        forbidden_actions: List[str],
    ) -> Tuple[Any, SafetyDecision, ExecutionRecorder]:

        plan = self.planning_service.create_plan(
            run_id=run_id,
            user_request=user_request,
            allowed_actions=allowed_actions,
            forbidden_actions=forbidden_actions,
        )

        safety_decision = self.safety_gate.evaluate(plan)

        recorder = ExecutionRecorder()
        trace = AgentTrace(
            run_id=run_id,
            recorder=recorder,
        )

        trace.record_decision(
            decision=safety_decision.decision,
            reason=safety_decision.reason,
        )

        if safety_decision.decision != "ALLOW":
            return plan, safety_decision, recorder

        self.plan_executor.execute(
            plan=plan,
            recorder=recorder,
        )

        return plan, safety_decision, recorder
