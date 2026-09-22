from app.database.black_box import (
    EventType,
    black_box,
)


agent_id = "devops-agent-01"


black_box.record(
    event_type=EventType.REQUEST,
    agent_id=agent_id,
    event_id="evt-001",
    action="delete_database",
    data={
        "target": "production_db",
        "user_request": "Delete the production database.",
    },
)


black_box.record(
    event_type=EventType.PERMISSION,
    agent_id=agent_id,
    event_id="evt-002",
    action="delete_database",
    authorized=True,
    decision="allow",
    reason="Action matched the user's available permissions.",
)


black_box.record(
    event_type=EventType.SIMULATION,
    agent_id=agent_id,
    event_id="evt-003",
    action="delete_database",
    authorized=True,
    decision="block",
    reason="Agent Twin detected a high-impact operation.",
    data={
        "risk_score": 100,
        "target": "production_db",
    },
)


black_box.record(
    event_type=EventType.RISK,
    agent_id=agent_id,
    event_id="evt-004",
    action="delete_database",
    decision="block",
    reason="Critical risk detected.",
    data={
        "severity": "critical",
        "blast_radius": "system-wide",
    },
)


black_box.record(
    event_type=EventType.DECISION,
    agent_id=agent_id,
    event_id="evt-005",
    action="delete_database",
    decision="block",
    reason="CAIROS blocked the action before execution.",
)


trace = black_box.export_trace(agent_id)

print(
    __import__("json").dumps(
        trace,
        indent=2,
        default=str,
    )
)