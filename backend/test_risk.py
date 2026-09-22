from app.risk.risk_engine import RiskEngine, RiskRequest


engine = RiskEngine()

request = RiskRequest(
    action="delete_database",
    target="production_db",
    simulation_risk_score=100,
    affected_resources=[
        "production_db",
        "database",
    ],
    warnings=[
        "Sensitive production resource",
        "Destructive operation",
    ],
)

result = engine.analyze(request)

print(result.model_dump_json(indent=2))