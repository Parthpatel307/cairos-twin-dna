from app.governance.intent_engine import IntentRequest, intent_engine
from app.governance.permission_engine import (
    PermissionContext,
    permission_engine,
)
from app.simulation.agent_twin import (
    SimulationRequest,
    agent_twin,
)
from app.risk.risk_engine import (
    RiskRequest,
    risk_engine,
)
from app.governance.decision_engine import (
    DecisionRequest,
    decision_engine,
)


# 1. Intent
intent = intent_engine.analyze(
    IntentRequest(
        request="Delete the production database."
    )
)

# 2. Permission
permission = permission_engine.evaluate(
    intent=intent,
    context=PermissionContext(
        user_id="devops-user",
        authorized_actions=[
            "read_requested_resource",
            "analyze_requested_data",
            "modify_requested_resource",
        ],
    ),
)

# 3. Agent Twin
simulation = agent_twin.simulate(
    SimulationRequest(
        agent_id="devops-agent-01",
        action="delete_database",
        target="production_db",
    )
)

# 4. Risk
risk = risk_engine.analyze(
    RiskRequest(
        action=simulation.action,
        target=simulation.target,
        simulation_risk_score=simulation.risk_score,
        affected_resources=simulation.affected_resources,
        warnings=simulation.warnings,
    )
)

# 5. Final CAIROS decision
decision = decision_engine.decide(
    DecisionRequest(
        permission=permission,
        simulation=simulation,
        risk=risk,
    )
)

print(decision.model_dump_json(indent=2))