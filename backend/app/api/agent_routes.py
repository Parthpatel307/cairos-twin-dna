from fastapi import APIRouter

from app.execution.orchestrator import (
    AgentRunRequest,
    AgentRunResult,
    cairos_orchestrator,
)

router = APIRouter(
    prefix="/api/v1/agent",
    tags=["Agent"],
)


@router.post(
    "/run",
    response_model=AgentRunResult,
)
def run_agent(request: AgentRunRequest) -> AgentRunResult:
    """
    Run an agent request through the complete CAIROS pipeline.

    Flow:
    Intent → Permission → Agent Twin → Risk → Decision → Black Box
    """

    return cairos_orchestrator.run(request)