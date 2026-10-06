from dataclasses import dataclass
from typing import Optional

from .replay import ReplayResult


@dataclass
class CausalVerification:
    verified: bool
    confidence: float
    conclusion: str
    candidate_event_id: str
    original_outcome: str
    counterfactual_outcome: str
    evidence: str


class CausalVerifier:
    """
    Converts a counterfactual replay result into a causal
    verification decision.
    """

    def verify(
        self,
        replay_result: ReplayResult,
    ) -> CausalVerification:
        if replay_result.failure_avoided:
            return CausalVerification(
                verified=True,
                confidence=1.0,
                conclusion="Causal contribution verified.",
                candidate_event_id=replay_result.candidate_event_id,
                original_outcome=replay_result.original_outcome,
                counterfactual_outcome=replay_result.counterfactual_outcome,
                evidence=(
                    "The original execution failed, while the "
                    "counterfactual execution succeeded after changing "
                    "the candidate decision."
                ),
            )

        if (
            replay_result.original_outcome == "failure"
            and replay_result.counterfactual_outcome == "failure"
        ):
            return CausalVerification(
                verified=False,
                confidence=0.0,
                conclusion="Causal contribution not verified.",
                candidate_event_id=replay_result.candidate_event_id,
                original_outcome=replay_result.original_outcome,
                counterfactual_outcome=replay_result.counterfactual_outcome,
                evidence=(
                    "Changing the candidate decision did not prevent "
                    "the failure."
                ),
            )

        return CausalVerification(
            verified=False,
            confidence=0.0,
            conclusion="Insufficient evidence for causal verification.",
            candidate_event_id=replay_result.candidate_event_id,
            original_outcome=replay_result.original_outcome,
            counterfactual_outcome=replay_result.counterfactual_outcome,
            evidence=(
                "The execution outcomes do not provide enough evidence "
                "to verify causality."
            ),
        )