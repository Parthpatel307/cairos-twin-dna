from typing import Any, Dict, Optional, Tuple

from agent.agentdna.result import AgentDNAResult
from agent.agentdna.service import AgentDNAService

from .safety import SafetyDecision
from .safe_runner import SafeAgentRunner


class SafeForensicRunner:
    """Safety-gated execution followed by AgentDNA analysis."""

    def __init__(
        self,
        planning_service,
        tool_executor,
        safety_gate=None,
        dna_service: Optional[AgentDNAService] = None,
    ) -> None:
        self.safe_runner = SafeAgentRunner(
            planning_service=planning_service,
            tool_executor=tool_executor,
            safety_gate=safety_gate,
        )
        self.dna_service = dna_service or AgentDNAService()

    def run(
        self,
        run_id: str,
        user_request: str,
        allowed_actions,
        forbidden_actions,
        alternative_action: Optional[str] = None,
    ) -> Tuple[Any, SafetyDecision, Any, Optional[AgentDNAResult]]:

        plan, safety_decision, recorder = self.safe_runner.run(
            run_id=run_id,
            user_request=user_request,
            allowed_actions=allowed_actions,
            forbidden_actions=forbidden_actions,
        )

        dna_result = None

        if safety_decision.decision == "ALLOW":
            dna_result = self.dna_service.analyze(
                events=recorder.get_events(),
                alternative_action=alternative_action,
                plan=plan,
            )

        return plan, safety_decision, recorder, dna_result
