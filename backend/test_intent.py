from app.governance.intent_engine import IntentRequest, intent_engine


request = IntentRequest(
    request="Check the customer database and analyze the latest orders."
)

result = intent_engine.analyze(request)

print(result.model_dump_json(indent=2))