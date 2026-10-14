import {
  CheckCircle2,
  RotateCcw,
  ShieldCheck,
  Target,
  XCircle,
} from "lucide-react";

interface RiskPanelProps {
  authorized: boolean;
  requiredForGoal: boolean;
  reversible: boolean;
  affectedSystems: string[];
}

function CheckItem({
  title,
  value,
  goodWhenTrue = true,
}: {
  title: string;
  value: boolean;
  goodWhenTrue?: boolean;
}) {
  const isGood =
    goodWhenTrue ? value : !value;

  return (
    <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.015] p-4">
      <div className="flex items-center gap-3">
        {isGood ? (
          <CheckCircle2
            size={18}
            className="text-lime-300"
          />
        ) : (
          <XCircle
            size={18}
            className="text-red-300"
          />
        )}

        <span className="text-sm font-semibold text-white/60">
          {title}
        </span>
      </div>

      <span
        className={`text-[10px] font-black ${
          isGood
            ? "text-lime-300"
            : "text-red-300"
        }`}
      >
        {value ? "YES" : "NO"}
      </span>
    </div>
  );
}

export default function RiskPanel({
  authorized,
  requiredForGoal,
  reversible,
  affectedSystems,
}: RiskPanelProps) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#0d100d] p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/30">
            Causal Check
          </p>

          <h2 className="mt-1 text-lg font-bold">
            Action validation
          </h2>
        </div>

        <div className="rounded-xl border border-lime-300/15 bg-lime-300/[0.05] p-2.5 text-lime-300">
          <ShieldCheck size={18} />
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <CheckItem
          title="Action authorized"
          value={authorized}
        />

        <CheckItem
          title="Required for user goal"
          value={requiredForGoal}
        />

        <CheckItem
          title="Action reversible"
          value={reversible}
        />
      </div>

      <div className="mt-6">
        <div className="flex items-center gap-2">
          <Target
            size={15}
            className="text-white/30"
          />

          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/30">
            Affected Systems
          </p>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {affectedSystems.map((system) => (
            <span
              key={system}
              className="rounded-lg border border-red-400/15 bg-red-400/[0.05] px-3 py-2 text-[10px] font-bold text-red-200"
            >
              {system}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.015] p-4">
        <RotateCcw
          size={16}
          className="text-white/30"
        />

        <p className="text-xs leading-5 text-white/30">
          CAIROS evaluates authorization,
          necessity, reversibility and downstream
          dependency impact before execution.
        </p>
      </div>
    </div>
  );
}