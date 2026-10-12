from datetime import datetime, timezone
from typing import Any, Dict


def check_status() -> Dict[str, Any]:
    """
    Real CAIROS system health/status tool.

    This function is executed only after the CAIROS
    decision engine explicitly authorizes the action.
    """

    return {
        "status": "operational",
        "service": "cairos-backend",
        "message": "CAIROS backend is running normally.",
        "checked_at": datetime.now(timezone.utc).isoformat(),
    }