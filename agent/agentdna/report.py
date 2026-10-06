from typing import Any, Dict

from .pipeline import AgentDNAAnalysis


class AgentDNAReportBuilder:
    def build(self, analysis: AgentDNAAnalysis) -> Dict[str, Any]:
        report = {
            "failure": None,
            "suspicious_events": [],
            "root_cause": None,
            "replay": None,
            "causal_verification": None,
        }

        if analysis.failure_event is not None:
            report["failure"] = analysis.failure_event.__dict__

        report["suspicious_events"] = [
            event.__dict__
            for event in analysis.suspicious_events
        ]

        if analysis.root_cause_candidate is not None:
            report["root_cause"] = (
                analysis.root_cause_candidate.__dict__
            )

        if analysis.replay_result is not None:
            report["replay"] = (
                analysis.replay_result.__dict__
            )

        if analysis.causal_verification is not None:
            report["causal_verification"] = (
                analysis.causal_verification.__dict__
            )

        return report