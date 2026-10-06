from dataclasses import dataclass
from typing import Callable, List, Optional

from .analyzer import AgentDNAAnalyzer
from .causal_verifier import CausalVerification, CausalVerifier
from .event import ExecutionEvent
from .replay import CausalReplayer, ReplayExecutor, ReplayResult
from .root_cause import RootCauseAnalyzer, RootCauseCandidate


@dataclass
class AgentDNAAnalysis:
    failure_event: Optional[ExecutionEvent]
    suspicious_events: List
    root_cause_candidate: Optional[RootCauseCandidate]
    replay_result: Optional[ReplayResult]
    causal_verification: Optional[CausalVerification]


class AgentDNAPipeline:
    """
    Orchestrates the complete AgentDNA forensic workflow.
    """

    def __init__(self) -> None:
        self.analyzer = AgentDNAAnalyzer()
        self.root_cause_analyzer = RootCauseAnalyzer()
        self.replayer = CausalReplayer()
        self.verifier = CausalVerifier()

    def analyze(
        self,
        events: List[ExecutionEvent],
        alternative_action: Optional[str] = None,
        replay_executor: Optional[ReplayExecutor] = None,
    ) -> AgentDNAAnalysis:
        if not events:
            raise ValueError("Cannot analyze an empty execution trace.")

        suspicious_events = self.analyzer.analyze(events)

        failure_event = self.root_cause_analyzer.find_failure_event(
            events
        )

        root_cause_candidate = None
        replay_result = None
        causal_verification = None

        if failure_event is not None:
            root_cause_candidate = self.root_cause_analyzer.analyze(
                events
            )

            if (
                root_cause_candidate is not None
                and alternative_action
            ):
                replay_result = self.replayer.replay(
                    events=events,
                    candidate_event_id=(
                        root_cause_candidate.event_id
                    ),
                    alternative_action=alternative_action,
                    executor=replay_executor,
                )

                causal_verification = self.verifier.verify(
                    replay_result
                )

        return AgentDNAAnalysis(
            failure_event=failure_event,
            suspicious_events=suspicious_events,
            root_cause_candidate=root_cause_candidate,
            replay_result=replay_result,
            causal_verification=causal_verification,
        )