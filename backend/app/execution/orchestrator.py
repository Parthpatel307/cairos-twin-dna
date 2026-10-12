from dataclasses import dataclass
from typing import Any, Dict

from uuid import uuid4

from pydantic import BaseModel, Field

from app.database.black_box import EventType, black_box
from app.execution.execution_gateway import (
    ExecutionRequest,
    ExecutionStatus,
    execution_gateway,
)
from app.execution.tools import check_status
from app.governance.decision_engine import (
    DecisionRequest,
    DecisionResult,
    FinalDecision,
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


# ============================================================
# TOOL REGISTRY
# ============================================================

TOOL_REGISTRY = {
    "check_status": check_status,
}


# ============================================================
# REQUEST / RESPONSE MODELS
# ============================================================


class AgentRunRequest(BaseModel):
    agent_id: str
    user_request: str
    authorized_actions: list[str]
    target: str
    action: str
    parameters: Dict[str, Any] = Field(default_factory=dict)


class HumanApprovalRequest(BaseModel):
    approved: bool


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
    execution_status: str
    execution_reason: str
    trace_event_count: int


# ============================================================
# PENDING HUMAN APPROVAL
# ============================================================


@dataclass
class PendingHumanApproval:
    request: AgentRunRequest
    decision: DecisionResult
    risk_score: int
    risk_severity: str
    blast_radius: str
    simulation_status: str


# In-memory pending approval store.
#
# Important:
# This is intentionally simple for the current CAIROS prototype.
# A production deployment should persist pending approvals in a
# database so they survive process restarts.

pending_human_approvals: Dict[str, PendingHumanApproval] = {}


# ============================================================
# ORCHESTRATOR
# ============================================================


class CairosOrchestrator:
    """
    CAIROS TWIN DNA orchestration layer.

    Pipeline:

        Intent
            ↓
        Permission
            ↓
        Agent Twin
            ↓
        Risk
            ↓
        Decision
            ↓
        Human Approval if required
            ↓
        Execution Gateway
            ↓
        Black Box Trace

    The Execution Gateway is the final security boundary.
    Real-world execution occurs only when the final decision
    explicitly allows the requested action and a registered
    real tool exists.
    """

    # ========================================================
    # RUN AGENT
    # ========================================================

    def run(self, request: AgentRunRequest) -> AgentRunResult:
        run_id = str(uuid4())

        # ----------------------------------------------------
        # 1. INTENT
        # ----------------------------------------------------

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

        # ----------------------------------------------------
        # 2. PERMISSION
        # ----------------------------------------------------

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

        # ----------------------------------------------------
        # 3. AGENT TWIN SIMULATION
        # ----------------------------------------------------

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

        # ----------------------------------------------------
        # 4. RISK
        # ----------------------------------------------------

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

        # ----------------------------------------------------
        # 5. FINAL DECISION
        # ----------------------------------------------------

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
                "requires_human_approval": (
                    decision.requires_human_approval
                ),
            },
        )

        # ----------------------------------------------------
        # 6. HUMAN APPROVAL REQUIRED
        # ----------------------------------------------------

        if decision.decision == FinalDecision.ASK_HUMAN:

            pending_human_approvals[run_id] = PendingHumanApproval(
                request=request,
                decision=decision,
                risk_score=risk.risk_score,
                risk_severity=risk.severity.value,
                blast_radius=risk.blast_radius,
                simulation_status=simulation.status.value,
            )

            execution = execution_gateway.execute(
                request=ExecutionRequest(
                    tool_name=request.action,
                    action=request.action,
                    parameters=request.parameters,
                ),
                decision=decision,
                tool=TOOL_REGISTRY.get(request.action),
            )

            black_box.record(
                event_type=EventType.EXECUTION,
                agent_id=request.agent_id,
                event_id=f"{run_id}-execution",
                action=request.action,
                authorized=False,
                decision=execution.status.value,
                reason=execution.reason,
                data={
                    "run_id": run_id,
                    "tool_name": request.action,
                    "execution_status": execution.status.value,
                    "result": None,
                    "waiting_for_human": True,
                },
            )

            trace = self._get_current_run_trace(
                agent_id=request.agent_id,
                run_id=run_id,
            )

            return AgentRunResult(
                run_id=run_id,
                agent_id=request.agent_id,
                decision=decision.decision.value,
                reason=decision.reason,
                risk_score=risk.risk_score,
                risk_severity=risk.severity.value,
                blast_radius=risk.blast_radius,
                simulation_status=simulation.status.value,
                requires_human_approval=True,
                execution_status=ExecutionStatus.WAITING_FOR_HUMAN.value,
                execution_reason=(
                    "Execution paused because human approval "
                    "is required."
                ),
                trace_event_count=len(trace),
            )

        # ----------------------------------------------------
        # 7. NORMAL EXECUTION
        # ----------------------------------------------------

        execution = execution_gateway.execute(
            request=ExecutionRequest(
                tool_name=request.action,
                action=request.action,
                parameters=request.parameters,
            ),
            decision=decision,
            tool=TOOL_REGISTRY.get(request.action),
        )

        black_box.record(
            event_type=EventType.EXECUTION,
            agent_id=request.agent_id,
            event_id=f"{run_id}-execution",
            action=request.action,
            authorized=(
                decision.decision == FinalDecision.ALLOW
            ),
            decision=execution.status.value,
            reason=execution.reason,
            data={
                "run_id": run_id,
                "tool_name": execution.tool_name,
                "execution_status": execution.status.value,
                "result": execution.result,
            },
        )

        # ----------------------------------------------------
        # 8. TRACE
        # ----------------------------------------------------

        trace = self._get_current_run_trace(
            agent_id=request.agent_id,
            run_id=run_id,
        )

        # ----------------------------------------------------
        # 9. FINAL RESPONSE
        # ----------------------------------------------------

        return AgentRunResult(
            run_id=run_id,
            agent_id=request.agent_id,
            decision=decision.decision.value,
            reason=decision.reason,
            risk_score=risk.risk_score,
            risk_severity=risk.severity.value,
            blast_radius=risk.blast_radius,
            simulation_status=simulation.status.value,
            requires_human_approval=(
                decision.requires_human_approval
            ),
            execution_status=execution.status.value,
            execution_reason=execution.reason,
            trace_event_count=len(trace),
        )

    # ========================================================
    # HUMAN APPROVAL
    # ========================================================

    def approve_run(
        self,
        run_id: str,
        approval: HumanApprovalRequest,
    ) -> AgentRunResult:

        # ----------------------------------------------------
        # FIND PENDING RUN
        # ----------------------------------------------------

        pending = pending_human_approvals.get(run_id)

        if pending is None:
            raise KeyError(
                f"No pending human approval found for run "
                f"'{run_id}'."
            )

        request = pending.request
        original_decision = pending.decision

        # ----------------------------------------------------
        # HUMAN REJECTED
        # ----------------------------------------------------

        if not approval.approved:

            pending_human_approvals.pop(run_id, None)

            reason = (
                "Human approval was rejected. "
                "Execution was blocked."
            )

            black_box.record(
                event_type=EventType.DECISION,
                agent_id=request.agent_id,
                event_id=f"{run_id}-human-rejection",
                action=request.action,
                authorized=False,
                decision="blocked",
                reason=reason,
                data={
                    "run_id": run_id,
                    "human_approved": False,
                },
            )

            black_box.record(
                event_type=EventType.EXECUTION,
                agent_id=request.agent_id,
                event_id=f"{run_id}-approval-execution",
                action=request.action,
                authorized=False,
                decision=ExecutionStatus.BLOCKED.value,
                reason=reason,
                data={
                    "run_id": run_id,
                    "execution_status": (
                        ExecutionStatus.BLOCKED.value
                    ),
                    "human_approved": False,
                    "result": None,
                },
            )

            trace = self._get_current_run_trace(
                agent_id=request.agent_id,
                run_id=run_id,
            )

            return AgentRunResult(
                run_id=run_id,
                agent_id=request.agent_id,
                decision=FinalDecision.BLOCK.value,
                reason=reason,
                risk_score=pending.risk_score,
                risk_severity=pending.risk_severity,
                blast_radius=pending.blast_radius,
                simulation_status=pending.simulation_status,
                requires_human_approval=False,
                execution_status=ExecutionStatus.BLOCKED.value,
                execution_reason=reason,
                trace_event_count=len(trace),
            )

        # ----------------------------------------------------
        # HUMAN APPROVED
        # ----------------------------------------------------

        pending_human_approvals.pop(run_id, None)

        # Convert ASK_HUMAN into explicit ALLOW.
        #
        # Pydantic v2 -> model_copy()
        # Pydantic v1 -> copy()

        if hasattr(original_decision, "model_copy"):
            approved_decision = original_decision.model_copy(
                update={
                    "decision": FinalDecision.ALLOW,
                    "requires_human_approval": False,
                    "reason": (
                        "Human approval received. "
                        "CAIROS authorized execution."
                    ),
                }
            )
        else:
            approved_decision = original_decision.copy(
                update={
                    "decision": FinalDecision.ALLOW,
                    "requires_human_approval": False,
                    "reason": (
                        "Human approval received. "
                        "CAIROS authorized execution."
                    ),
                }
            )

        # ----------------------------------------------------
        # LOG HUMAN APPROVAL
        # ----------------------------------------------------

        black_box.record(
            event_type=EventType.DECISION,
            agent_id=request.agent_id,
            event_id=f"{run_id}-human-approval",
            action=request.action,
            authorized=True,
            decision=FinalDecision.ALLOW.value,
            reason=(
                "Human approval received. "
                "CAIROS authorized execution."
            ),
            data={
                "run_id": run_id,
                "human_approved": True,
                "previous_decision": (
                    original_decision.decision.value
                ),
                "new_decision": FinalDecision.ALLOW.value,
            },
        )

        # ----------------------------------------------------
        # EXECUTE REGISTERED TOOL
        # ----------------------------------------------------

        execution = execution_gateway.execute(
            request=ExecutionRequest(
                tool_name=request.action,
                action=request.action,
                parameters=request.parameters,
            ),
            decision=approved_decision,
            tool=TOOL_REGISTRY.get(request.action),
        )

        black_box.record(
            event_type=EventType.EXECUTION,
            agent_id=request.agent_id,
            event_id=f"{run_id}-approval-execution",
            action=request.action,
            authorized=True,
            decision=execution.status.value,
            reason=execution.reason,
            data={
                "run_id": run_id,
                "tool_name": execution.tool_name,
                "execution_status": execution.status.value,
                "human_approved": True,
                "result": execution.result,
            },
        )

        # ----------------------------------------------------
        # UPDATED TRACE
        # ----------------------------------------------------

        trace = self._get_current_run_trace(
            agent_id=request.agent_id,
            run_id=run_id,
        )

        # ----------------------------------------------------
        # RETURN FINAL RESULT
        # ----------------------------------------------------

        return AgentRunResult(
            run_id=run_id,
            agent_id=request.agent_id,
            decision=FinalDecision.ALLOW.value,
            reason=(
                "Human approval received. "
                "CAIROS authorized execution."
            ),
            risk_score=pending.risk_score,
            risk_severity=pending.risk_severity,
            blast_radius=pending.blast_radius,
            simulation_status=pending.simulation_status,
            requires_human_approval=False,
            execution_status=execution.status.value,
            execution_reason=execution.reason,
            trace_event_count=len(trace),
        )

    # ========================================================
    # TRACE HELPER
    # ========================================================

    def _get_current_run_trace(
        self,
        agent_id: str,
        run_id: str,
    ):
        return [
            event
            for event in black_box.get_events(agent_id)
            if event.event_id.startswith(f"{run_id}-")
        ]


# ============================================================
# GLOBAL ORCHESTRATOR
# ============================================================

cairos_orchestrator = CairosOrchestrator()