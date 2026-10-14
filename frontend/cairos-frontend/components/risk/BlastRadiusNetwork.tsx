import {
  Database,
  GitBranch,
  RadioTower,
  Server,
  ShieldAlert,
} from "lucide-react";

interface BlastRadiusNetworkProps {
  systems: string[];
}

export default function BlastRadiusNetwork({
  systems,
}: BlastRadiusNetworkProps) {
  const displaySystems =
    systems.slice(0, 3);

  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <p className="section-label">
            Blast Radius
          </p>

          <h2 className="section-title">
            Dependency impact network
          </h2>
        </div>

        <div className="rounded-full border border-red-400/15 bg-red-400/[0.05] px-3 py-1.5 text-[8px] font-black tracking-[0.12em] text-red-300">
          {systems.length} SYSTEMS
        </div>
      </div>

      <div className="relative mt-6 h-[390px] overflow-hidden rounded-[22px] border border-white/[0.06] bg-black/15">
        {/* ambient */}

        <div className="pointer-events-none absolute left-1/2 top-1/2 h-60 w-60 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-400/[0.045] blur-[80px]" />

        {/* GRID */}

        <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.025)_1px,transparent_1px)] [background-size:32px_32px]" />

        {/* CONNECTION LINES */}

        <div className="absolute left-1/2 top-1/2 h-px w-[64%] -translate-x-1/2 -translate-y-1/2 rotate-[28deg] bg-gradient-to-r from-transparent via-red-300/20 to-transparent" />

        <div className="absolute left-1/2 top-1/2 h-px w-[64%] -translate-x-1/2 -translate-y-1/2 -rotate-[28deg] bg-gradient-to-r from-transparent via-red-300/20 to-transparent" />

        <div className="absolute left-1/2 top-1/2 h-[64%] w-px -translate-x-1/2 -translate-y-1/2 bg-gradient-to-b from-transparent via-red-300/15 to-transparent" />

        {/* CENTER */}

        <div className="absolute left-1/2 top-1/2 z-10 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-red-400/20 bg-[#100b0b]/90 shadow-[0_0_65px_rgba(248,113,113,.09)] backdrop-blur-xl">
          <div className="absolute inset-3 animate-pulse rounded-full border border-red-400/10" />

          <ShieldAlert
            size={24}
            className="text-red-300"
          />

          <p className="mt-2 text-[7px] font-black tracking-[0.13em] text-white/25">
            ACTION
          </p>

          <p className="mt-1 text-[8px] font-black text-red-300">
            HIGH IMPACT
          </p>
        </div>

        {/* NODES */}

        {displaySystems[0] && (
          <SystemNode
            system={
              displaySystems[0]
            }
            className="left-[6%] top-[12%]"
          />
        )}

        {displaySystems[1] && (
          <SystemNode
            system={
              displaySystems[1]
            }
            className="right-[6%] top-[13%]"
          />
        )}

        {displaySystems[2] && (
          <SystemNode
            system={
              displaySystems[2]
            }
            className="bottom-[8%] left-1/2 -translate-x-1/2"
          />
        )}

        {/* SCANNING RING */}

        <div className="absolute left-1/2 top-1/2 h-[235px] w-[235px] -translate-x-1/2 -translate-y-1/2 animate-[spin_18s_linear_infinite] rounded-full border border-dashed border-red-400/[0.08]">
          <span className="absolute left-1/2 top-[-3px] h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-red-300 shadow-[0_0_12px_rgba(248,113,113,.8)]" />
        </div>
      </div>
    </div>
  );
}

function SystemNode({
  system,
  className,
}: {
  system: string;
  className: string;
}) {
  const Icon =
    system
      .toLowerCase()
      .includes(
        "database"
      )
      ? Database
      : system
          .toLowerCase()
          .includes(
            "pipeline"
          )
        ? GitBranch
        : system
            .toLowerCase()
            .includes(
              "gateway"
            )
          ? RadioTower
          : Server;

  return (
    <div
      className={`absolute z-20 ${className}`}
    >
      <div className="min-w-[145px] rounded-2xl border border-red-400/12 bg-[#0c0909]/85 p-3.5 shadow-[0_15px_40px_rgba(0,0,0,.35)] backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-red-400/15 bg-red-400/[0.05]">
            <Icon
              size={15}
              className="text-red-300"
            />
          </div>

          <div>
            <p className="max-w-[95px] text-[9px] font-black leading-4 text-white/60">
              {system}
            </p>

            <p className="mt-1 text-[7px] font-black tracking-[0.1em] text-red-300/70">
              AFFECTED
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}