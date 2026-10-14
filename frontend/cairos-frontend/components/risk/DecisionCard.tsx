import {
  AlertTriangle,
  Ban,
  CheckCircle2,
} from "lucide-react";

import type { Decision } from "@/types";

interface DecisionCardProps {
  decision: Decision;
  reason: string;
}

export default function DecisionCard({
  decision,
  reason,
}: DecisionCardProps) {
  const config = {
    ALLOW: {
      label: "ALLOW",
      icon: CheckCircle2,
      color: "text-lime-300",
      border: "border-lime-300/20",
      bg: "bg-lime-300/[0.05]",
    },

    ASK: {
      label: "ASK HUMAN",
      icon: AlertTriangle,
      color: "text-yellow-200",
      border: "border-yellow-300/20",
      bg: "bg-yellow-300/[0.05]",
    },

    BLOCK: {
      label: "BLOCK",
      icon: Ban,
      color: "text-red-300",
      border: "border-red-400/20",
      bg: "bg-red-400/[0.05]",
    },
  };

  const selected = config[decision];
  const Icon = selected.icon;

  return (
    <div
      className={`rounded-2xl border ${selected.border} ${selected.bg} p-5`}
    >
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/30">
        Governance Decision
      </p>

      <div className="mt-5 flex items-center gap-3">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl border ${selected.border}`}
        >
          <Icon
            size={23}
            className={selected.color}
          />
        </div>

        <div>
          <p className="text-[9px] uppercase tracking-widest text-white/20">
            Final action
          </p>

          <p
            className={`mt-1 text-3xl font-black ${selected.color}`}
          >
            {selected.label}
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-white/[0.06] bg-black/10 p-4">
        <p className="text-[9px] font-bold uppercase tracking-wider text-white/20">
          Reason
        </p>

        <p className="mt-2 text-xs leading-5 text-white/40">
          {reason}
        </p>
      </div>
    </div>
  );
}