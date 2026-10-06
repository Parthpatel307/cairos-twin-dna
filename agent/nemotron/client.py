import os
from typing import Any, Dict, Optional


class NemotronClient:
    DEFAULT_BASE_URL = "https://api.tokenfactory.nebius.com/"
    DEFAULT_MODEL = "nvidia/nemotron-3-super-120b-a12b"

    def __init__(
        self,
        api_key: Optional[str] = None,
        base_url: str = DEFAULT_BASE_URL,
        model: str = DEFAULT_MODEL,
    ):
        self.api_key = api_key or os.getenv("NEBIUS_API_KEY")
        self.base_url = base_url
        self.model = model

    def is_configured(self) -> bool:
        return bool(self.api_key)

    def generate(
        self,
        prompt: str,
        system_prompt: str = (
            "You are the planning component of CAIROS TWIN DNA."
        ),
    ) -> Dict[str, Any]:
        if not self.api_key:
            raise ValueError(
                "NEBIUS_API_KEY is not configured. "
                "Provide an API key before making a live Nemotron request."
            )

        try:
            from openai import OpenAI
        except ImportError as exc:
            raise ImportError(
                "The 'openai' package is required for live Nemotron requests."
            ) from exc

        client = OpenAI(
            api_key=self.api_key,
            base_url=self.base_url,
        )

        response = client.chat.completions.create(
            model=self.model,
            messages=[
                {
                    "role": "system",
                    "content": system_prompt,
                },
                {
                    "role": "user",
                    "content": prompt,
                },
            ],
        )

        content = response.choices[0].message.content

        usage = None
        if getattr(response, "usage", None) is not None:
            usage = {
                "prompt_tokens": response.usage.prompt_tokens,
                "completion_tokens": response.usage.completion_tokens,
                "total_tokens": response.usage.total_tokens,
            }

        return {
            "content": content,
            "model": response.model,
            "usage": usage,
        }