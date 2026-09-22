from fastapi import APIRouter, HTTPException

from app.database.black_box import black_box
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
    """

    return cairos_orchestrator.run(request)


@router.get(
    "/trace/{agent_id}",
)
def get_agent_trace(agent_id: str):
    """
    Return the complete AgentDNA Black Box trace for an agent.
    """

    events = black_box.get_events(agent_id)

    if not events:
        raise HTTPException(
            status_code=404,
            detail=f"No trace found for agent '{agent_id}'.",
        )

    return black_box.export_trace(agent_id)