from dataclasses import asdict, dataclass
from typing import List

from agent.planner.plan import AgentPlan

from .event import ExecutionEvent


@dataclass
class PlanConsistencyResult:
    consistent: bool
    planned_actions: List[str]
    executed_actions: List[str]
    unexpected_actions: List[str]
    missing_actions: List[str]

    def to_dict(self):
        return asdict(self)


class PlanConsistencyChecker:
    GOVERNANCE_DECISIONS = {"ALLOW", "ASK_HUMAN", "BLOCK"}

    def check(
        self,
        plan: AgentPlan,
        events: List[ExecutionEvent],
    ) -> PlanConsistencyResult:
        planned_actions = [step.action for step in plan.steps]

        executed_actions = [
            event.action
            for event in events
            if event.event_type == "decision"
            and event.action
            and event.action not in self.GOVERNANCE_DECISIONS
        ]

        unexpected_actions = [
            action
            for action in executed_actions
            if action not in planned_actions
        ]

        missing_actions = [
            action
            for action in planned_actions
            if action not in executed_actions
        ]

        consistent = (
            len(unexpected_actions) == 0
            and len(missing_actions) == 0
        )

        return PlanConsistencyResult(
            consistent=consistent,
            planned_actions=planned_actions,
            executed_actions=executed_actions,
            unexpected_actions=unexpected_actions,
            missing_actions=missing_actions,
        )
