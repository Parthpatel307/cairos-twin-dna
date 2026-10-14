export type RiskLevel =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "CRITICAL";

export type Decision =
  | "ALLOW"
  | "ASK"
  | "BLOCK";

export type StepStatus =
  | "PENDING"
  | "RUNNING"
  | "SUCCESS"
  | "WARNING"
  | "FAILED";

export interface SimulationStep {
  id: number;
  title: string;
  description: string;
  status: StepStatus;
}

export interface SimulationRequest {
  request: string;
}

export interface SimulationResult {
  simulation_id: string;
  request: string;

  agent: string;

  risk_score: number;
  risk_level: RiskLevel;

  decision: Decision;

  blast_radius: number;

  reason: string;

  steps: SimulationStep[];
}

export interface RiskAnalysis {
  risk_score: number;
  risk_level: RiskLevel;

  authorized: boolean;
  required_for_goal: boolean;
  reversible: boolean;

  affected_systems: string[];

  decision: Decision;

  reason: string;
}

export interface DNAEvent {
  id: number;

  title: string;
  description: string;

  status:
    | "SUCCESS"
    | "WARNING"
    | "ROOT_CAUSE"
    | "FAILED";

  timestamp: string;
}

export interface DNAResult {
  execution_id: string;

  root_cause_step: number;

  confidence: number;

  explanation: string;

  timeline: DNAEvent[];

  original_result: string;

  counterfactual_result: string;
}