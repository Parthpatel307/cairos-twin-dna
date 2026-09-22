from fastapi import FastAPI

from app.api.agent_routes import router as agent_router


app = FastAPI(
    title="CAIROS TWIN DNA",
    description=(
        "AI Agent Governance, Simulation, Risk Analysis, "
        "Execution Control, and AgentDNA Causal Debugging."
    ),
    version="1.0.0",
)


app.include_router(agent_router)


@app.get("/")
def root():
    return {
        "name": "CAIROS TWIN DNA",
        "status": "running",
        "message": "CAIROS Agent Governance Engine is online.",
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
    }