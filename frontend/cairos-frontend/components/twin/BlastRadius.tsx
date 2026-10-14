import {
  AlertTriangle,
  Database,
  GitBranch,
  Server,
} from "lucide-react";

interface BlastRadiusProps {
  systems: string[];
  count: number;
  visible: boolean;
}

const iconMap: Record<string, typeof Server> = {
  "API Gateway": Server,
  "Production Database": Database,
  "Deployment Pipeline": GitBranch,
};

export default function BlastRadius({
  systems,
  count,
  visible,
}: BlastRadiusProps) {
  return (
    <div
      className={`rounded-2xl border bg-[#0d100d] p-5 transition ${
        visible
          ? "border-red-400/20"
          : "border-white/[0.08] opacity-40"
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/30">
            Blast Radius
          </p>

          <h2 className="mt-1 text-lg font-bold">
            Affected systems
          </h2>
        </div>

        <div className="rounded-xl border border-red-400/20 bg-red-400/10 p-2.5 text-red-300">
          <AlertTriangle size={18} />
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {visible &&
          systems.map((system) => {
            const Icon =
              iconMap[system] ?? Server;

            return (
              <div
                key={system}
                className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
              >
                <div className="flex items-center gap-3">
                  <Icon
                    size={17}
                    className="text-white/35"
                  />

                  <span className="text-sm font-semibold text-white/65">
                    {system}
                  </span>
                </div>

                <span className="rounded-full border border-red-400/20 bg-red-400/10 px-2.5 py-1 text-[9px] font-black text-red-300">
                  AFFECTED
                </span>
              </div>
            );
          })}
      </div>

      <div className="mt-5 rounded-xl border border-white/[0.06] bg-white/[0.015] p-4">
        <p className="text-[9px] uppercase tracking-wider text-white/25">
          Systems affected
        </p>

        <p className="mt-2 text-3xl font-black">
          {visible ? count : "—"}
        </p>
      </div>
    </div>
  );
}