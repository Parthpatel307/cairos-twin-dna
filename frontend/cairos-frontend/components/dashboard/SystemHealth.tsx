import {
  Activity,
  BrainCircuit,
  Database,
  FlaskConical,
} from "lucide-react";

const systems = [
  {
    name: "CAIROS Engine",
    icon: BrainCircuit,
  },
  {
    name: "Agent Twin",
    icon: FlaskConical,
  },
  {
    name: "AgentDNA",
    icon: Activity,
  },
  {
    name: "Policy Store",
    icon: Database,
  },
];

export default function SystemHealth() {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#0d100d] p-5">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">
        System Health
      </p>

      <h2 className="mt-1 text-lg font-bold">
        Core infrastructure
      </h2>

      <div className="mt-6 space-y-3">
        {systems.map((system) => {
          const Icon = system.icon;

          return (
            <div
              key={system.name}
              className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
            >
              <div className="flex items-center gap-3">
                <Icon
                  size={17}
                  className="text-white/35"
                />

                <span className="text-sm font-medium text-white/65">
                  {system.name}
                </span>
              </div>

              <div className="flex items-center gap-2 text-[10px] font-bold text-lime-300">
                <span className="h-1.5 w-1.5 rounded-full bg-lime-300" />

                OPERATIONAL
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 rounded-xl border border-lime-300/10 bg-lime-300/[0.04] p-4">
        <p className="text-[10px] font-black tracking-[0.17em] text-lime-300">
          PLATFORM STATUS
        </p>

        <p className="mt-2 text-3xl font-black">
          99.98%
        </p>

        <p className="mt-1 text-xs text-white/25">
          Safety infrastructure availability
        </p>
      </div>
    </div>
  );
}