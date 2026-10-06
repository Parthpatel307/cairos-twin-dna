from typing import Any, Dict, List, Optional

from agent.planner.plan import AgentPlan

from .event import ExecutionEvent
from .graph import AgentDNAExecutionGraph
from .pipeline import AgentDNAPipeline
from .plan_consistency import PlanConsistencyChecker
from .replay import ReplayExecutor
from .report import AgentDNAReportBuilder
from .result import AgentDNAResult


class AgentDNAService:
    def __init__(self):
        self.pipeline = AgentDNAPipeline()
        self.report_builder = AgentDNAReportBuilder()
        self.graph_builder = AgentDNAExecutionGraph()
        self.plan_consistency_checker = PlanConsistencyChecker()

    def analyze(
        self,
        events: List[ExecutionEvent],
        alternative_action: Optional[str] = None,
        replay_executor: Optional[ReplayExecutor] = None,
        plan: Optional[AgentPlan] = None,
    ) -> AgentDNAResult:
        if not events:
            raise ValueError("events cannot be empty")

        analysis = self.pipeline.analyze(
            events=events,
            alternative_action=alternative_action,
            replay_executor=replay_executor,
        )

        report = self.report_builder.build(analysis)
        report["execution_graph"] = self.graph_builder.build(events)

        plan_consistency = None

        if plan is not None:
            plan_consistency = self.plan_consistency_checker.check(
                plan=plan,
                events=events,
            )

        status = "verified"

        if analysis.failure_event is None:
            status = "success"
        elif (
            analysis.causal_verification is None
            or not analysis.causal_verification.verified
        ):
            status = "unverified"

        return AgentDNAResult(
            run_id=events[0].run_id,
            status=status,
            failure=report["failure"],
            suspicious_events=report["suspicious_events"],
            root_cause=report["root_cause"],
            replay=report["replay"],
            causal_verification=report["causal_verification"],
            execution_graph=report["execution_graph"],
            plan_consistency=plan_consistency,
        )