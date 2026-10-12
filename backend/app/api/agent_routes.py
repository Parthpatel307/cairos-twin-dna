from typing import Dict

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.agentdna.replay_engine import (
    ReplayRequest,
    ReplayResult,
    causal_replay,
)
from app.database.black_box import black_box
from app.execution.orchestrator import (
    AgentRunRequest,
    AgentRunResult,
    HumanApprovalRequest,
    cairos_orchestrator,
)


router = APIRouter(
    prefix="/api/v1/agent",
    tags=["Agent"],
)


class AgentReplayRequest(BaseModel):
    """
    Request body for AgentDNA causal replay.

    Keys are Black Box event IDs and values are the
    alternative decisions to test.
    """

    alternative_decisions: Dict[str, str] = Field(
        default_factory=dict,
        description=(
            "Mapping of Black Box event_id to the alternative "
            "decision that should be evaluated."
        ),
    )


@router.post(
    "/run",
    response_model=AgentRunResult,
)
def run_agent(request: AgentRunRequest) -> AgentRunResult:
    """
    Run an agent request through the complete CAIROS pipeline.

    Pipeline:

        Intent
        Permission
        Simulation
        Risk
        Decision
        Human Approval if required
        Execution
        Black Box Trace
    """

    return cairos_orchestrator.run(request)


@router.post(
    "/approval/{run_id}",
    response_model=AgentRunResult,
)
def approve_agent_run(
    run_id: str,
    approval: HumanApprovalRequest,
) -> AgentRunResult:
    """
    Approve or reject a CAIROS run that is waiting for human approval.

    approved=true:
        Human explicitly approves the action and the registered
        tool may execute.

    approved=false:
        Human rejects the action and execution is blocked.
    """

    try:
        return cairos_orchestrator.approve_run(
            run_id=run_id,
            approval=approval,
        )

    except KeyError as exc:
        raise HTTPException(
            status_code=404,
            detail=str(exc),
        ) from exc


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


@router.post(
    "/replay/{agent_id}",
    response_model=ReplayResult,
)
def replay_agent(
    agent_id: str,
    request: AgentReplayRequest,
) -> ReplayResult:
    """
    Perform deterministic AgentDNA causal replay.

    The endpoint loads the original Black Box trace for the
    requested agent and evaluates the supplied alternative
    decisions against the recorded decisions.

    Example:

        {
            "alternative_decisions": {
                "<event_id>": "allow"
            }
        }

    The replay does not execute real tools. It performs
    trace-level causal analysis only.
    """

    events = black_box.get_events(agent_id)

    if not events:
        raise HTTPException(
            status_code=404,
            detail=f"No trace found for agent '{agent_id}'.",
        )

    replay_request = ReplayRequest(
        original_events=events,
        alternative_decisions=request.alternative_decisions,
    )

    return causal_replay.replay(replay_request)