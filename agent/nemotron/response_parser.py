import json
from typing import Any, Dict


class NemotronResponseParser:
    """
    Extracts a structured JSON object from a Nemotron response.
    """

    def parse(
        self,
        content: str,
    ) -> Dict[str, Any]:
        if not content or not content.strip():
            raise ValueError(
                "Nemotron response is empty."
            )

        cleaned = content.strip()

        if cleaned.startswith("```"):
            lines = cleaned.splitlines()

            if lines and lines[0].strip().startswith("```"):
                lines = lines[1:]

            if lines and lines[-1].strip() == "```":
                lines = lines[:-1]

            cleaned = "\n".join(lines).strip()

            if cleaned.lower().startswith("json"):
                cleaned = cleaned[4:].strip()

        try:
            parsed = json.loads(cleaned)
        except json.JSONDecodeError as exc:
            raise ValueError(
                "Nemotron response does not contain valid JSON."
            ) from exc

        if not isinstance(parsed, dict):
            raise ValueError(
                "Nemotron response must contain a JSON object."
            )

        return parsed