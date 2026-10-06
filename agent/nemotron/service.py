from typing import Any, Dict, List

from agent.planner.parser import AgentPlanParser
from agent.planner.plan import AgentPlan

from .prompt import NemotronPromptBuilder
from .response_parser import NemotronResponseParser


class NemotronPlanningService:
    def __init__(self, client):
        self.client = client
        self.prompt_builder = NemotronPromptBuilder()
        self.response_parser = NemotronResponseParser()
        self.plan_parser = AgentPlanParser()

    def create_plan(
        self,
        run_id: str,
        user_request: str,
        allowed_actions: List[str],
        forbidden_actions: List[str],
    ) -> AgentPlan:

        prompt = self.prompt_builder.build(
            run_id=run_id,
            user_request=user_request,
            allowed_actions=allowed_actions,
            forbidden_actions=forbidden_actions,
        )

        response = self.client.generate(prompt)

        content = response.get("content")

        if not content:
            raise ValueError(
                "Nemotron response did not contain content."
            )

        structured_plan: Dict[str, Any] = (
            self.response_parser.parse(content)
        )

        return self.plan_parser.parse(
            structured_plan
        )

    def generate(
        self,
        goal: str,
        context: Dict[str, Any] = None,
    ) -> AgentPlan:
        context = context or {}

        run_id = context.get("run_id")
        allowed_actions = context.get("allowed_actions", [])
        forbidden_actions = context.get("forbidden_actions", [])

        if not run_id:
            raise ValueError(
                "context must contain 'run_id' when using generate()."
            )

        return self.create_plan(
            run_id=run_id,
            user_request=goal,
            allowed_actions=allowed_actions,
            forbidden_actions=forbidden_actions,
        )