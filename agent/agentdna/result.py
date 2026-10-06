from dataclasses import asdict, dataclass
from typing import Any, Dict, List, Optional

from .plan_consistency import PlanConsistencyResult


@dataclass
class AgentDNAResult:
    run_id: str
    status: str
    failure: Optional[Dict[str, Any]]
    suspicious_events: List[Dict[str, Any]]
    root_cause: Optional[Dict[str, Any]]
    replay: Optional[Dict[str, Any]]
    causal_verification: Optional[Dict[str, Any]]
    execution_graph: Dict[str, Any]
    plan_consistency: Optional[PlanConsistencyResult] = None

    def to_dict(self) -> Dict[str, Any]:
        result = asdict(self)
        if self.plan_consistency is not None:
            result["plan_consistency"] = self.plan_consistency.to_dict()
        return result