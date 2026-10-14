import type {
  DNAResult,
  RiskAnalysis,
  SimulationResult,
} from "@/types";

const API_URL =
  process.env
    .NEXT_PUBLIC_API_URL ??
  "http://localhost:8000";

export class ApiError extends Error {
  status: number;

  details?: string;

  constructor(
    message: string,
    status: number,
    details?: string
  ) {
    super(message);

    this.name =
      "ApiError";

    this.status =
      status;

    this.details =
      details;
  }
}

async function request<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  let response:
    Response;

  try {
    response =
      await fetch(
        `${API_URL}${endpoint}`,
        {
          ...options,

          headers: {
            "Content-Type":
              "application/json",

            ...options?.headers,
          },
        }
      );
  } catch {
    throw new ApiError(
      "Unable to connect to backend service.",
      0,
      "Check whether the FastAPI server is running."
    );
  }

  if (!response.ok) {
    let details:
      string | undefined;

    try {
      const body =
        await response.json();

      details =
        body.detail ??
        body.message ??
        undefined;
    } catch {
      details =
        undefined;
    }

    throw new ApiError(
      `API request failed with status ${response.status}.`,
      response.status,
      details
    );
  }

  try {
    return (
      await response.json()
    ) as T;
  } catch {
    throw new ApiError(
      "Backend returned an invalid JSON response.",
      response.status
    );
  }
}

export async function runSimulation(
  userRequest: string
): Promise<SimulationResult> {
  return request<SimulationResult>(
    "/simulation/run",
    {
      method: "POST",

      body: JSON.stringify({
        request:
          userRequest,
      }),
    }
  );
}

export async function analyzeRisk(
  simulationId: string
): Promise<RiskAnalysis> {
  return request<RiskAnalysis>(
    `/risk/analyze/${simulationId}`,
    {
      method: "POST",
    }
  );
}

export async function getDNAReplay(
  executionId: string
): Promise<DNAResult> {
  return request<DNAResult>(
    `/agentdna/${executionId}`
  );
}

export async function checkBackendHealth(): Promise<{
  status: string;
}> {
  return request<{
    status: string;
  }>("/health");
}