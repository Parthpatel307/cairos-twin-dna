from app.execution.orchestrator import (
    AgentRunRequest,
    cairos_orchestrator,
)


request = AgentRunRequest(
    agent_id="demo-agent-01",
    user_request="Delete the production database.",
    authorized_actions=[
        "modify_requested_resource",
    ],
    target="production_db",
    action="delete_database",
)

result = cairos_orchestrator.run(request)

print(result.model_dump_json(indent=2))