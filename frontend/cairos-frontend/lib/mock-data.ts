import type {
  DNAResult,
  RiskAnalysis,
  SimulationResult,
} from "@/types";

export const mockSimulation: SimulationResult = {
  simulation_id: "SIM-001",

  request:
    "Clean unused files from production server",

  agent: "Infrastructure Agent",

  risk_score: 87,

  risk_level: "CRITICAL",

  decision: "BLOCK",

  blast_radius: 3,

  reason:
    "Agent attempted to delete a configuration file required by production services.",

  steps: [
    {
      id: 1,

      title: "Inspect filesystem",

      description:
        "Scanning production filesystem.",

      status: "SUCCESS",
    },

    {
      id: 2,

      title: "Identify unused files",

      description:
        "18 candidate files detected.",

      status: "SUCCESS",
    },

    {
      id: 3,

      title: "Delete config.json",

      description:
        "config.json is required by deployment services.",

      status: "WARNING",
    },

    {
      id: 4,

      title: "Execute deletion",

      description:
        "CAIROS blocked the action.",

      status: "FAILED",
    },
  ],
};

export const mockRisk: RiskAnalysis = {
  risk_score: 87,

  risk_level: "CRITICAL",

  authorized: true,

  required_for_goal: false,

  reversible: false,

  affected_systems: [
    "API Gateway",
    "Production Database",
    "Deployment Pipeline",
  ],

  decision: "BLOCK",

  reason:
    "The simulated action has a high blast radius and is not necessary to achieve the user's goal.",
};

export const mockDNA: DNAResult = {
  execution_id: "EXEC-001",

  root_cause_step: 3,

  confidence: 94,

  explanation:
    "The agent incorrectly classified config.json as an unused file.",

  timeline: [
    {
      id: 1,

      title: "Intent received",

      description:
        "Clean unused production files.",

      status: "SUCCESS",

      timestamp: "12:41:01",
    },

    {
      id: 2,

      title: "Filesystem inspected",

      description:
        "Candidate files discovered.",

      status: "SUCCESS",

      timestamp: "12:41:03",
    },

    {
      id: 3,

      title: "File classification",

      description:
        "config.json incorrectly classified as unused.",

      status: "ROOT_CAUSE",

      timestamp: "12:41:05",
    },

    {
      id: 4,

      title: "Delete operation",

      description:
        "Unsafe delete operation attempted.",

      status: "FAILED",

      timestamp: "12:41:07",
    },
  ],

  original_result:
    "Production services fail",

  counterfactual_result:
    "Production remains healthy",
};