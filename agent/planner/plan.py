from dataclasses import asdict, dataclass
from typing import Any, Dict, List, Optional


ALLOWED_ACTION_TYPES = {
    "tool_call",
    "decision",
    "data_read",
    "data_write",
    "state_change",
}


@dataclass
class PlanStep:
    step_id: int
    action_type: str
    action: str
    tool: Optional[str] = None
    input: Optional[Dict[str, Any]] = None
    reason: Optional[str] = None
    requires_permission: bool = True

    def __post_init__(self) -> None:
        if self.step_id < 1:
            raise ValueError("step_id must be greater than or equal to 1")

        if self.action_type not in ALLOWED_ACTION_TYPES:
            raise ValueError(
                f"Invalid action_type: {self.action_type}. "
                f"Allowed values: {sorted(ALLOWED_ACTION_TYPES)}"
            )

        if not self.action:
            raise ValueError("action cannot be empty")


@dataclass
class AgentPlan:
    run_id: str
    goal: str
    steps: List[PlanStep]
    allowed_actions: List[str]
    forbidden_actions: List[str]
    success_criteria: List[str]

    def __post_init__(self) -> None:
        if not self.run_id:
            raise ValueError("run_id cannot be empty")

        if not self.goal:
            raise ValueError("goal cannot be empty")

        if not self.steps:
            raise ValueError("plan must contain at least one step")

        step_ids = [step.step_id for step in self.steps]

        if len(step_ids) != len(set(step_ids)):
            raise ValueError("step_id values must be unique")

        expected_ids = list(range(1, len(self.steps) + 1))

        if sorted(step_ids) != expected_ids:
            raise ValueError(
                "step_id values must start at 1 and be sequential"
            )

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)