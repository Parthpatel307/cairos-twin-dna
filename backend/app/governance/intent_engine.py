from enum import Enum
from typing import List

from pydantic import BaseModel, Field


class RiskLevel(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class IntentRequest(BaseModel):
    request: str = Field(
        ...,
        min_length=1,
        description="Natural-language request from the user.",
    )


class AgentIntent(BaseModel):
    goal: str
    allowed_actions: List[str]
    forbidden_actions: List[str]
    risk_level: RiskLevel
    requires_human_approval: bool
    reasoning: str


class IntentEngine:
    """
    CAIROS Intent Engine.

    Converts a natural-language request into a structured,
    security-aware agent intent before any real tool execution.
    """

    HIGH_RISK_KEYWORDS = {
        "payment",
        "pay",
        "bank",
        "production",
        "deploy",
        "admin",
        "credential",
        "password",
        "secret",
        "api key",
    }

    CRITICAL_KEYWORDS = {
        "delete database",
        "drop database",
        "wire transfer",
        "transfer funds",
        "disable security",
        "remove authentication",
        "expose credentials",
    }

    def analyze(self, request: IntentRequest) -> AgentIntent:
        text = request.request.strip().lower()

        risk_level = self._calculate_risk(text)

        allowed_actions = self._derive_allowed_actions(text)
        forbidden_actions = self._derive_forbidden_actions(text)

        requires_human_approval = risk_level in {
            RiskLevel.HIGH,
            RiskLevel.CRITICAL,
        }

        goal = self._extract_goal(request.request)

        reasoning = self._build_reasoning(
            risk_level=risk_level,
            requires_human_approval=requires_human_approval,
        )

        return AgentIntent(
            goal=goal,
            allowed_actions=allowed_actions,
            forbidden_actions=forbidden_actions,
            risk_level=risk_level,
            requires_human_approval=requires_human_approval,
            reasoning=reasoning,
        )

    def _contains_word(self, text: str, word: str) -> bool:
        """
        Checks a complete word instead of matching substrings.

        Example:
        'test' matches 'test'
        but does NOT match 'latest'.
        """
        words = text.replace(",", " ").replace(".", " ").split()
        return word.lower() in words

    def _contains_phrase(self, text: str, phrase: str) -> bool:
        return phrase.lower() in text

    def _calculate_risk(self, text: str) -> RiskLevel:
        if any(
            self._contains_phrase(text, keyword)
            for keyword in self.CRITICAL_KEYWORDS
        ):
            return RiskLevel.CRITICAL

        if any(
            self._contains_phrase(text, keyword)
            for keyword in self.HIGH_RISK_KEYWORDS
        ):
            return RiskLevel.HIGH

        medium_words = {
            "write",
            "update",
            "modify",
            "execute",
            "run",
            "upload",
            "download",
            "database",
            "api",
        }

        if any(self._contains_word(text, word) for word in medium_words):
            return RiskLevel.MEDIUM

        return RiskLevel.LOW

    def _derive_allowed_actions(self, text: str) -> List[str]:
        actions: List[str] = []

        read_words = {
            "read",
            "check",
            "view",
            "find",
            "search",
        }

        analyze_words = {
            "analyze",
            "analyse",
            "inspect",
            "debug",
        }

        create_words = {
            "write",
            "create",
            "generate",
        }

        modify_words = {
            "update",
            "modify",
            "edit",
        }

        execute_words = {
            "run",
            "execute",
            "test",
        }

        if any(self._contains_word(text, word) for word in read_words):
            actions.append("read_requested_resource")

        if any(self._contains_word(text, word) for word in analyze_words):
            actions.append("analyze_requested_data")

        if any(self._contains_word(text, word) for word in create_words):
            actions.append("create_requested_output")

        if any(self._contains_word(text, word) for word in modify_words):
            actions.append("modify_requested_resource")

        if any(self._contains_word(text, word) for word in execute_words):
            actions.append("execute_requested_operation")

        if not actions:
            actions.append("perform_non_destructive_analysis")

        return actions

    def _derive_forbidden_actions(self, text: str) -> List[str]:
        forbidden = [
            "access resources outside the requested scope",
            "expose secrets or credentials",
            "bypass authentication or authorization",
            "perform unrelated destructive actions",
            "execute unauthorized external actions",
        ]

        if any(
            self._contains_word(text, word)
            for word in {"payment", "transfer", "bank"}
        ):
            forbidden.append(
                "perform financial transactions without approval"
            )

        if self._contains_word(text, "delete") or self._contains_phrase(
            text, "drop database"
        ):
            forbidden.append(
                "delete resources outside the explicitly requested scope"
            )

        return forbidden

    def _extract_goal(self, request: str) -> str:
        cleaned = request.strip()

        if len(cleaned) > 500:
            cleaned = cleaned[:497] + "..."

        return cleaned

    def _build_reasoning(
        self,
        risk_level: RiskLevel,
        requires_human_approval: bool,
    ) -> str:
        if risk_level == RiskLevel.CRITICAL:
            return (
                "The request contains a critical-risk operation. "
                "CAIROS requires human approval before execution."
            )

        if risk_level == RiskLevel.HIGH:
            return (
                "The request may affect sensitive systems, data, "
                "permissions, or external actions. Human approval is required."
            )

        if risk_level == RiskLevel.MEDIUM:
            return (
                "The request involves an operation that may change "
                "data or execute a tool. It should be simulated "
                "and verified first."
            )

        return (
            "The request appears non-destructive and low risk. "
            "It can proceed to permission and simulation checks."
        )


intent_engine = IntentEngine()