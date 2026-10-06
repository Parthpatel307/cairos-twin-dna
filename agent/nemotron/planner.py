from typing import Any, Dict

from agent.planner.parser import AgentPlanParser
from agent.planner.plan import AgentPlan


class NemotronPlanner:
    """
    Interface for converting an AI-generated structured plan
    into the validated AgentPlan model.

    The actual Nemotron API call will be connected later.
    """

    def __init__(self) -> None:
        self.parser = AgentPlanParser()

    def build_plan(
        self,
        structured_response: Dict[str, Any],
    ) -> AgentPlan:
        """
        Convert a structured model response into AgentPlan.
        """
        return self.parser.parse(structured_response)