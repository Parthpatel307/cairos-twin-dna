import {
  Bot,
  FlaskConical,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const nodes = [
  {
    label: "USER INTENT",
    icon: Sparkles,
  },
  {
    label: "AGENT PLAN",
    icon: Bot,
  },
  {
    label: "AGENT TWIN",
    icon: FlaskConical,
  },
  {
    label: "CAIROS",
    icon: ShieldCheck,
  },
];

export default function SimulationFlow() {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#0d100d] p-5">
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/30">
        Safety Pipeline
      </p>

      <h2 className="mt-1 text-lg font-bold">
        Pre-execution verification
      </h2>

      <div className="mt-7 grid gap-3 lg:grid-cols-4">
        {nodes.map((node, index) => {
          const Icon = node.icon;

          return (
            <div
              key={node.label}
              className="rounded-xl border border-lime-300/15 bg-lime-300/[0.03] p-4"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-lime-300/20 bg-lime-300/10 text-lime-300">
                <Icon size={18} />
              </div>

              <p className="mt-4 text-[9px] text-white/20">
                0{index + 1}
              </p>

              <p className="mt-1 text-xs font-black">
                {node.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}