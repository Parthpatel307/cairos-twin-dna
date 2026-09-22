from typing import Any, Dict, Optional
from uuid import uuid4

from pydantic import BaseModel

from app.database.black_box import EventType, black_box
from app.governance.decision_engine import (
    DecisionRequest,
    DecisionResult,
    decision_engine,
)
from app.governance.intent_engine import (
    IntentRequest,
    intent_engine,
)
from app.governance.permission_engine import (
    PermissionContext,
    permission_engine,
)
from app.risk.risk_engine import RiskRequest, risk_engine
from app.simulation.agent_twin import (
    SimulationRequest,
    agent_twin,
)


class AgentRunRequest(BaseModel):
    agent_id: str
    user_request: str
    authorized_actions: list[str]
    target: str
    action: str
    parameters: Dict[str, Any] = {}


class AgentRunResult(BaseModel):
    run_id: str
    agent_id: str
    decision: str
    reason: str
    risk_score: int
    risk_severity: str
    blast_radius: str
    simulation_status: str
    requires_human_approval: bool
    trace_event_count: int


class CairosOrchestrator:
    """
    CAIROS TWIN DNA orchestration layer.

    Connects:
    Intent → Permission → Agent Twin → Risk → Decision → Black Box

    Real tool execution is intentionally not performed here yet.
    """

    def run(self, request: AgentRunRequest) -> AgentRunResult:
        run_id = str(uuid4())

        # ---------------------------------------------------------
        # 1. INTENT
        # ---------------------------------------------------------

        intent = intent_engine.analyze(
            IntentRequest(
                request=request.user_request,
            )
        )

        black_box.record(
            event_type=EventType.REQUEST,
            agent_id=request.agent_id,
            event_id=f"{run_id}-request",
            action=request.action,
            data={
                "run_id": run_id,
                "user_request": request.user_request,
                "target": request.target,
            },
        )

        black_box.record(
            event_type=EventType.INTENT,
            agent_id=request.agent_id,
            event_id=f"{run_id}-intent",
            action=request.action,
            data={
                "run_id": run_id,
                "goal": intent.goal,
                "allowed_actions": intent.allowed_actions,
                "risk_level": intent.risk_level.value,
            },
        )

        # ---------------------------------------------------------
        # 2. PERMISSION
        # ---------------------------------------------------------

        permission = permission_engine.evaluate(
            intent=intent,
            context=PermissionContext(
                user_id=request.agent_id,
                authorized_actions=request.authorized_actions,
            ),
        )

        black_box.record(
            event_type=EventType.PERMISSION,
            agent_id=request.agent_id,
            event_id=f"{run_id}-permission",
            action=request.action,
            authorized=(
                permission.decision.value == "allow"
            ),
            decision=permission.decision.value,
            reason=permission.reason,
            data={
                "run_id": run_id,
                "denied_actions": permission.denied_actions,
            },
        )

        # ---------------------------------------------------------
        # 3. AGENT TWIN
        # ---------------------------------------------------------

        simulation = agent_twin.simulate(
            SimulationRequest(
                agent_id=request.agent_id,
                action=request.action,
                target=request.target,
                parameters=request.parameters,
            )
        )

        black_box.record(
            event_type=EventType.SIMULATION,
            agent_id=request.agent_id,
            event_id=f"{run_id}-simulation",
            action=request.action,
            decision=simulation.status.value,
            reason=simulation.explanation,
            data={
                "run_id": run_id,
                "risk_score": simulation.risk_score,
                "affected_resources": simulation.affected_resources,
                "warnings": simulation.warnings,
            },
        )

        # ---------------------------------------------------------
        # 4. RISK
        # ---------------------------------------------------------

        risk = risk_engine.analyze(
            RiskRequest(
                action=request.action,
                target=request.target,
                simulation_risk_score=simulation.risk_score,
                affected_resources=simulation.affected_resources,
                warnings=simulation.warnings,
            )
        )

        black_box.record(
            event_type=EventType.RISK,
            agent_id=request.agent_id,
            event_id=f"{run_id}-risk",
            action=request.action,
            decision=risk.severity.value,
            reason=risk.recommendation,
            data={
                "run_id": run_id,
                "risk_score": risk.risk_score,
                "severity": risk.severity.value,
                "blast_radius": risk.blast_radius,
                "potential_impacts": risk.potential_impacts,
            },
        )

        # ---------------------------------------------------------
        # 5. FINAL DECISION
        # ---------------------------------------------------------

        decision: DecisionResult = decision_engine.decide(
            DecisionRequest(
                permission=permission,
                simulation=simulation,
                risk=risk,
            )
        )

        black_box.record(
            event_type=EventType.DECISION,
            agent_id=request.agent_id,
            event_id=f"{run_id}-decision",
            action=request.action,
            decision=decision.decision.value,
            reason=decision.reason,
            data={
                "run_id": run_id,
                "checks_passed": decision.safety_checks_passed,
                "checks_failed": decision.safety_checks_failed,
            },
        )

        # ---------------------------------------------------------
        # 6. RETURN UNIFIED RESULT
        # ---------------------------------------------------------

        trace = black_box.get_events(request.agent_id)

        return AgentRunResult(
            run_id=run_id,
            agent_id=request.agent_id,
            decision=decision.decision.value,
            reason=decision.reason,
            risk_score=risk.risk_score,
            risk_severity=risk.severity.value,
            blast_radius=risk.blast_radius,
            simulation_status=simulation.status.value,
            requires_human_approval=decision.requires_human_approval,
            trace_event_count=len(trace),
        )


cairos_orchestrator = CairosOrchestrator()