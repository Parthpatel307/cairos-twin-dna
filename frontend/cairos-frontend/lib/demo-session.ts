"use client";

import type {
  Decision,
  RiskLevel,
} from "@/types";

export interface DemoSession {
  id: string;

  request: string;

  agent: string;

  action: string;

  target: string;

  simulationId: string;

  riskScore: number;

  riskLevel: RiskLevel;

  decision: Decision;

  reason: string;

  affectedSystems: string[];

  reversible: boolean;

  approvalStatus:
    | "PENDING"
    | "APPROVED"
    | "DENIED"
    | null;

  executionStatus:
    | "NOT_STARTED"
    | "RUNNING"
    | "SUCCESS"
    | "FAILED";

  createdAt: string;

  reviewerName?:
    string | null;

  reviewerRole?:
    string | null;

  approvalTimestamp?:
    string | null;
}

const STORAGE_KEY =
  "cairos_demo_session";

export function saveDemoSession(
  session: DemoSession
) {
  if (
    typeof window ===
    "undefined"
  ) {
    return;
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(
      session
    )
  );
}

export function getDemoSession():
  DemoSession | null {
  if (
    typeof window ===
    "undefined"
  ) {
    return null;
  }

  const raw =
    localStorage.getItem(
      STORAGE_KEY
    );

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(
      raw
    ) as DemoSession;
  } catch {
    return null;
  }
}

export function updateDemoSession(
  updates:
    Partial<DemoSession>
):
  DemoSession | null {
  const current =
    getDemoSession();

  if (!current) {
    return null;
  }

  const next:
    DemoSession = {
      ...current,
      ...updates,
    };

  saveDemoSession(
    next
  );

  return next;
}

export function clearDemoSession() {
  if (
    typeof window ===
    "undefined"
  ) {
    return;
  }

  localStorage.removeItem(
    STORAGE_KEY
  );
}