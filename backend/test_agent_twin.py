from app.simulation.agent_twin import (
    AgentTwin,
    SimulationRequest,
)


twin = AgentTwin()

request = SimulationRequest(
    agent_id="devops-agent-01",
    action="delete_database",
    target="production_db",
)

result = twin.simulate(request)

print(result.model_dump_json(indent=2))