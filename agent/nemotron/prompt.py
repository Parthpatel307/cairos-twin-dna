from typing import List


class NemotronPromptBuilder:
    """
    Builds a strict planning prompt for the Nemotron model.
    """

    def build(
        self,
        run_id: str,
        user_request: str,
        allowed_actions: List[str],
        forbidden_actions: List[str],
    ) -> str:
        if not run_id:
            raise ValueError("run_id cannot be empty")

        if not user_request:
            raise ValueError("user_request cannot be empty")

        return f"""
You are the planning component of CAIROS TWIN DNA.

Your job is to convert the user's request into a safe,
structured execution plan for an AI agent.

IMPORTANT RULES:

1. Return ONLY valid JSON.
2. Do not return markdown.
3. Do not explain the JSON.
4. Use only actions listed in allowed_actions.
5. Never use actions listed in forbidden_actions.
6. Every step must have a clear reason.
7. Every step that changes data, files, systems, or external state
   must have requires_permission set to true.
8. Keep the plan minimal and directly related to the user's goal.
9. Do not invent tools that are not required by the request.

Required JSON structure:

{{
  "run_id": "{run_id}",
  "goal": "clear description of the goal",
  "steps": [
    {{
      "step_id": 1,
      "action_type": "data_read",
      "action": "clear action",
      "tool": "tool_name",
      "input": {{}},
      "reason": "why this step is required",
      "requires_permission": true
    }}
  ],
  "allowed_actions": [],
  "forbidden_actions": [],
  "success_criteria": []
}}

Allowed actions:
{allowed_actions}

Forbidden actions:
{forbidden_actions}

User request:
{user_request}
""".strip()