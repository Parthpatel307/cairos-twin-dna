import {
  AlertTriangle,
  CheckCircle2,
  Circle,
  LoaderCircle,
  XCircle,
} from "lucide-react";

import type { SimulationStep } from "@/types";

interface AgentPlanProps {
  steps: SimulationStep[];
}

export default function AgentPlan({
  steps,
}: AgentPlanProps) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#0d100d] p-5">
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/30">
        Agent Plan
      </p>

      <h2 className="mt-1 text-lg font-bold">
        Proposed execution
      </h2>

      <div className="mt-6 space-y-3">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className="flex gap-4 rounded-xl border border-white/[0.06] bg-white/[0.015] p-4"
          >
            <div className="mt-0.5">
              {step.status === "RUNNING" && (
                <LoaderCircle
                  size={26}
                  className="animate-spin text-lime-300"
                />
              )}

              {step.status === "SUCCESS" && (
                <CheckCircle2
                  size={26}
                  className="text-lime-300"
                />
              )}

              {step.status === "WARNING" && (
                <AlertTriangle
                  size={26}
                  className="text-yellow-200"
                />
              )}

              {step.status === "FAILED" && (
                <XCircle
                  size={26}
                  className="text-red-300"
                />
              )}

              {step.status === "PENDING" && (
                <Circle
                  size={26}
                  className="text-white/15"
                />
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-bold text-white/80">
                  {step.title}
                </p>

                <span className="text-[9px] font-black tracking-wider text-white/20">
                  STEP {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <p className="mt-1 text-xs leading-5 text-white/30">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}