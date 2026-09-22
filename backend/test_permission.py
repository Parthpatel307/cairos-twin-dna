from app.governance.intent_engine import IntentRequest, intent_engine
from app.governance.permission_engine import (
    PermissionContext,
    permission_engine,
)


intent = intent_engine.analyze(
    IntentRequest(
        request="Check the customer database and analyze the latest orders."
    )
)

context = PermissionContext(
    user_id="demo-user",
    authorized_actions=[
        "read_requested_resource",
        "analyze_requested_data",
    ],
)

result = permission_engine.evaluate(
    intent=intent,
    context=context,
)

print(result.model_dump_json(indent=2))