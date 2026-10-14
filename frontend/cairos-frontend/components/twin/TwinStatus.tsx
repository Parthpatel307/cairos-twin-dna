import {
  AlertTriangle,
  Ban,
  CheckCircle2,
  LoaderCircle,
} from "lucide-react";

import type {
  Decision,
  RiskLevel,
} from "@/types";

interface TwinStatusProps {
  loading: boolean;
  decision?: Decision;
  riskScore?: number;
  riskLevel?: RiskLevel;
  reason?: string;
}

export default function TwinStatus({
  loading,
  decision,
  riskScore,
  riskLevel,
  reason,
}: TwinStatusProps) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-lime-300/20 bg-[#0d100d] p-5">
        <p className="text-[10px] font-black tracking-[0.18em] text-lime-300">
          TWIN ENGINE
        </p>

        <div className="flex flex-col items-center py-10">
          <LoaderCircle
            size={34}
            className="animate-spin text-lime-300"
          />

          <p className="mt-4 text-sm font-black text-lime-300">
            SIMULATING
          </p>
        </div>
      </div>
    );
  }

  if (!decision) {
    return (
      <div className="rounded-2xl border border-white/[0.08] bg-[#0d100d] p-5">
        <p className="text-[10px] font-black tracking-[0.18em] text-white/30">
          TWIN ENGINE
        </p>

        <p className="mt-8 text-sm text-white/30">
          Waiting for simulation.
        </p>
      </div>
    );
  }

  const decisionStyle =
    decision === "ALLOW"
      ? "text-lime-300"
      : decision === "ASK"
        ? "text-yellow-200"
        : "text-red-300";

  const DecisionIcon =
    decision === "ALLOW"
      ? CheckCircle2
      : decision === "ASK"
        ? AlertTriangle
        : Ban;

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#0d100d] p-5">
      <p className="text-[10px] font-black tracking-[0.18em] text-white/30">
        TWIN DECISION
      </p>

      <div className="mt-6 flex items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.02] p-5">
        <div>
          <p className="text-[9px] text-white/25">
            FINAL DECISION
          </p>

          <div className={`mt-2 flex items-center gap-2 ${decisionStyle}`}>
            <DecisionIcon size={24} />

            <p className="text-3xl font-black">
              {decision}
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-[9px] text-white/25">
            RISK SCORE
          </p>

          <p className="mt-1 text-4xl font-black">
            {riskScore}
          </p>

          <p className="text-xs text-white/25">
            {riskLevel}
          </p>
        </div>
      </div>

      {reason && (
        <div className="mt-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
          <p className="text-xs leading-5 text-white/35">
            {reason}
          </p>
        </div>
      )}
    </div>
  );
}