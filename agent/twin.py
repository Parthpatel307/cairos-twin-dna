from dataclasses import dataclass, field
from typing import Any, Dict, List

from agent.planner.plan import AgentPlan


@dataclass
class TwinState:
    """
    Simulated state maintained by the Agent Twin.
    """

    data: Dict[str, Any] = field(default_factory=dict)


@dataclass
class TwinActionResult:
    """
    Result of executing one action inside the simulated twin.
    """

    action: str
    success: bool
    state_before: Dict[str, Any]
    state_after: Dict[str, Any]
    output: Dict[str, Any]
    error: str | None = None


@dataclass
class AgentTwinResult:
    """
    Complete simulation result for an agent plan.
    """

    run_id: str
    success: bool
    initial_state: Dict[str, Any]
    final_state: Dict[str, Any]
    actions: List[TwinActionResult]
    blocked_actions: List[str] = field(default_factory=list)
    errors: List[str] = field(default_factory=list)


class AgentTwin:
    """
    Safe simulated execution environment for an AgentPlan.

    The twin never calls real external tools.
    It only applies deterministic simulated state transitions.
    """

    def __init__(self, initial_state: Dict[str, Any] | None = None) -> None:
        self.state = TwinState(
            data=dict(initial_state or {})
        )

    def simulate(
        self,
        run_id: str,
        actions: List[Dict[str, Any]],
    ) -> AgentTwinResult:

        initial_state = dict(self.state.data)
        results: List[TwinActionResult] = []
        errors: List[str] = []
        blocked_actions: List[str] = []

        for action_data in actions:
            action = action_data.get("action", "")
            action_type = action_data.get("action_type", "")
            inputs = dict(action_data.get("input", {}))

            state_before = dict(self.state.data)

            if action_type == "tool_call":
                error = (
                    f"External tool action '{action}' "
                    "cannot execute inside Agent Twin."
                )

                blocked_actions.append(action)
                errors.append(error)

                results.append(
                    TwinActionResult(
                        action=action,
                        success=False,
                        state_before=state_before,
                        state_after=dict(self.state.data),
                        output={},
                        error=error,
                    )
                )
                continue

            if action_type == "data_write":
                self.state.data.update(inputs)

            elif action_type == "state_change":
                self.state.data.update(inputs)

            elif action_type in {"decision", "data_read"}:
                pass

            else:
                error = f"Unsupported action type: {action_type}"
                errors.append(error)

                results.append(
                    TwinActionResult(
                        action=action,
                        success=False,
                        state_before=state_before,
                        state_after=dict(self.state.data),
                        output={},
                        error=error,
                    )
                )
                continue

            results.append(
                TwinActionResult(
                    action=action,
                    success=True,
                    state_before=state_before,
                    state_after=dict(self.state.data),
                    output={
                        "simulated": True,
                        "action_type": action_type,
                    },
                )
            )

        return AgentTwinResult(
            run_id=run_id,
            success=len(errors) == 0,
            initial_state=initial_state,
            final_state=dict(self.state.data),
            actions=results,
            blocked_actions=blocked_actions,
            errors=errors,
        )

    def simulate_plan(self, plan: AgentPlan) -> AgentTwinResult:
        actions = [
            {
                "action_type": step.action_type,
                "action": step.action,
                "input": step.input,
            }
            for step in plan.steps
        ]

        return self.simulate(
            run_id=plan.run_id,
            actions=actions,
        )
