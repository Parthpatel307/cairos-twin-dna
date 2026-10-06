from typing import Any, Dict


class FakeNemotronClient:
    def __init__(self, response: str):
        self.response = response

    def generate(
        self,
        prompt: str,
        system_prompt: str = (
            "You are the planning component of CAIROS TWIN DNA."
        ),
    ) -> Dict[str, Any]:
        return {
            "content": self.response,
            "model": "fake-nemotron",
            "usage": None,
        }