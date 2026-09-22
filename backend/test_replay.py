from app.database.black_box import EventType, black_box
from app.agentdna.replay_engine import (
    ReplayRequest,
    causal_replay,
)


agent_id = "devops-agent-01"

black_box.clear()

black_box.record(
    event_type=EventType.REQUEST,
    agent_id=agent_id,
    event_id="evt-001",
    action="delete_database",
    data={
        "target": "production_db",
    },
)

black_box.record(
    event_type=EventType.PERMISSION,
    agent_id=agent_id,
    event_id="evt-002",
    action="delete_database",
    authorized=True,
    decision="allow",
)

black_box.record(
    event_type=EventType.SIMULATION,
    agent_id=agent_id,
    event_id="evt-003",
    action="delete_database",
    decision="block",
    reason="High-impact operation detected.",
)

black_box.record(
    event_type=EventType.RISK,
    agent_id=agent_id,
    event_id="evt-004",
    action="delete_database",
    decision="block",
    reason="Critical risk.",
)

black_box.record(
    event_type=EventType.DECISION,
    agent_id=agent_id,
    event_id="evt-005",
    action="delete_database",
    decision="block",
    reason="CAIROS blocked execution.",
)


events = black_box.get_events(agent_id)

result = causal_replay.replay(
    ReplayRequest(
        original_events=events,
        alternative_decisions={
            "evt-005": "allow",
        },
    )
)

print(result.model_dump_json(indent=2))