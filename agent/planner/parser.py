from typing import Any, Dict, List

from .plan import AgentPlan, PlanStep


class AgentPlanParser:
    """
    Converts a structured dictionary into a validated AgentPlan.
    """

    def parse(self, data: Dict[str, Any]) -> AgentPlan:
        if not isinstance(data, dict):
            raise ValueError("Plan data must be a dictionary.")

        required_fields = {
            "run_id",
            "goal",
            "steps",
            "allowed_actions",
            "forbidden_actions",
            "success_criteria",
        }

        missing_fields = required_fields - set(data.keys())

        if missing_fields:
            raise ValueError(
                f"Missing required plan fields: {sorted(missing_fields)}"
            )

        raw_steps = data["steps"]

        if not isinstance(raw_steps, list):
            raise ValueError("steps must be a list.")

        steps: List[PlanStep] = []

        for raw_step in raw_steps:
            if not isinstance(raw_step, dict):
                raise ValueError("Each step must be a dictionary.")

            steps.append(
                PlanStep(
                    step_id=raw_step["step_id"],
                    action_type=raw_step["action_type"],
                    action=raw_step["action"],
                    tool=raw_step.get("tool"),
                    input=raw_step.get("input"),
                    reason=raw_step.get("reason"),
                    requires_permission=raw_step.get(
                        "requires_permission",
                        True,
                    ),
                )
            )

        return AgentPlan(
            run_id=data["run_id"],
            goal=data["goal"],
            steps=steps,
            allowed_actions=data["allowed_actions"],
            forbidden_actions=data["forbidden_actions"],
            success_criteria=data["success_criteria"],
        )