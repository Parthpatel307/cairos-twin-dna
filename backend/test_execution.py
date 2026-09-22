from app.execution.execution_gateway import (
    ExecutionGateway,
    ExecutionRequest,
)

from app.governance.decision_engine import (
    DecisionResult,
    FinalDecision,
)


gateway = ExecutionGateway()

decision = DecisionResult(
    decision=FinalDecision.BLOCK,
    reason="Critical risk detected.",
    safety_checks_passed=[
        "permission_check",
    ],
    safety_checks_failed=[
        "agent_twin_simulation",
    ],
    requires_human_approval=True,
)

request = ExecutionRequest(
    tool_name="production_database",
    action="delete_database",
    parameters={
        "database": "production_db",
    },
)


def fake_database_delete(**kwargs):
    print("❌ REAL TOOL SHOULD NEVER RUN")
    return "database deleted"


result = gateway.execute(
    request=request,
    decision=decision,
    tool=fake_database_delete,
)

print(result.model_dump_json(indent=2))