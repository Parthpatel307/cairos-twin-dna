import {
  Bot,
  CheckCircle2,
  FileWarning,
  Fingerprint,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
  XCircle,
} from "lucide-react";

import type {
  LucideIcon,
} from "lucide-react";

interface CausalGraphProps {
  activeStep: number;
  replaying: boolean;
  replayComplete: boolean;
}

const nodes: {
  id: number;
  label: string;
  detail: string;
  icon: LucideIcon;
  position: string;
  type:
    | "normal"
    | "warning"
    | "root"
    | "failed";
}[] = [
  {
    id: 1,
    label: "USER INTENT",
    detail: "Clean unused files",
    icon: Sparkles,
    position:
      "left-[4%] top-[12%]",
    type: "normal",
  },
  {
    id: 2,
    label: "AGENT PLAN",
    detail: "Filesystem cleanup",
    icon: Bot,
    position:
      "right-[4%] top-[12%]",
    type: "normal",
  },
  {
    id: 3,
    label: "CLASSIFICATION",
    detail: "config.json → unused",
    icon: FileWarning,
    position:
      "left-1/2 top-[42%] -translate-x-1/2",
    type: "root",
  },
  {
    id: 4,
    label: "HUMAN APPROVAL",
    detail: "Execution authorized",
    icon: ShieldCheck,
    position:
      "left-[5%] bottom-[8%]",
    type: "warning",
  },
  {
    id: 5,
    label: "DELETE ACTION",
    detail: "Dependency failure",
    icon: XCircle,
    position:
      "right-[5%] bottom-[8%]",
    type: "failed",
  },
];

export default function CausalGraph({
  activeStep,
  replaying,
  replayComplete,
}: CausalGraphProps) {
  return (
    <div className="relative min-h-[530px] overflow-hidden rounded-[26px]">
      {/* BACKGROUND */}

      <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.025)_1px,transparent_1px)] [background-size:34px_34px]" />

      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-400/[0.045] blur-[110px]" />

      {replayComplete && (
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[250px] w-[250px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime-300/[0.04] blur-[90px]" />
      )}

      {/* HEADER */}

      <div className="relative z-20 flex items-start justify-between p-6">
        <div>
          <p className="section-label">
            Causal Graph
          </p>

          <h2 className="section-title">
            Failure propagation
          </h2>
        </div>

        <div
          className={`status-chip ${
            replaying ||
            replayComplete
              ? "online"
              : ""
          }`}
        >
          {replaying
            ? "TRACE ACTIVE"
            : replayComplete
              ? "CAUSAL LINK VERIFIED"
              : "TRACE READY"}
        </div>
      </div>

      {/* CONNECTIONS */}

      <div className="absolute left-[18%] top-[28%] h-px w-[32%] rotate-[22deg] bg-gradient-to-r from-white/5 via-purple-300/20 to-purple-300/30" />

      <div className="absolute right-[18%] top-[28%] h-px w-[32%] -rotate-[22deg] bg-gradient-to-l from-white/5 via-purple-300/20 to-purple-300/30" />

      <div className="absolute left-[27%] top-[63%] h-px w-[28%] -rotate-[28deg] bg-gradient-to-r from-yellow-200/20 via-purple-300/20 to-purple-300/30" />

      <div className="absolute right-[27%] top-[63%] h-px w-[28%] rotate-[28deg] bg-gradient-to-l from-red-300/30 via-purple-300/20 to-purple-300/30" />

      {/* CENTER ROOT CAUSE HALO */}

      <div
        className={`absolute left-1/2 top-[51%] h-[190px] w-[190px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed transition-all duration-500 ${
          activeStep >= 3
            ? "animate-[spin_16s_linear_infinite] border-purple-300/20"
            : "border-white/[0.04]"
        }`}
      >
        <span
          className={`absolute left-1/2 top-[-4px] h-2 w-2 -translate-x-1/2 rounded-full ${
            activeStep >= 3
              ? "bg-purple-300 shadow-[0_0_14px_rgba(216,180,254,.8)]"
              : "bg-white/10"
          }`}
        />
      </div>

      {/* NODES */}

      {nodes.map(
        (node) => (
          <GraphNode
            key={
              node.id
            }
            node={
              node
            }
            active={
              activeStep ===
              node.id
            }
            passed={
              activeStep >
              node.id
            }
            replayComplete={
              replayComplete
            }
          />
        )
      )}

      {/* FORENSIC CORE */}

      <div className="absolute bottom-5 left-1/2 z-20 -translate-x-1/2">
        <div className="flex items-center gap-2 rounded-full border border-purple-300/12 bg-purple-300/[0.035] px-4 py-2 backdrop-blur-xl">
          <Fingerprint
            size={12}
            className="text-purple-300"
          />

          <span className="text-[8px] font-black tracking-[0.14em] text-purple-200/75">
            OBSERVABLE EXECUTION TRACE
          </span>
        </div>
      </div>
    </div>
  );
}

function GraphNode({
  node,
  active,
  passed,
  replayComplete,
}: {
  node: {
    id: number;
    label: string;
    detail: string;
    icon: LucideIcon;
    position: string;
    type:
      | "normal"
      | "warning"
      | "root"
      | "failed";
  };

  active: boolean;
  passed: boolean;
  replayComplete: boolean;
}) {
  const Icon =
    node.icon;

  const root =
    node.type ===
    "root";

  const failed =
    node.type ===
    "failed";

  const warning =
    node.type ===
    "warning";

  const activeStyle =
    active
      ? root
        ? "border-purple-300/35 bg-purple-300/[0.09] shadow-[0_0_45px_rgba(216,180,254,.12)]"
        : failed
          ? "border-red-400/30 bg-red-400/[0.08] shadow-[0_0_40px_rgba(248,113,113,.1)]"
          : warning
            ? "border-yellow-300/25 bg-yellow-300/[0.06]"
            : "border-lime-300/25 bg-lime-300/[0.06]"
      : passed ||
          replayComplete
        ? "border-white/[0.11] bg-white/[0.035]"
        : "border-white/[0.065] bg-[#090b09]/80";

  return (
    <div
      className={`absolute z-20 ${node.position}`}
    >
      <div
        className={`min-w-[150px] rounded-[20px] border p-4 shadow-[0_18px_50px_rgba(0,0,0,.35)] backdrop-blur-xl transition-all duration-500 ${activeStyle} ${
          active
            ? "scale-[1.06]"
            : ""
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
              root
                ? "border-purple-300/15 bg-purple-300/[0.05]"
                : failed
                  ? "border-red-400/15 bg-red-400/[0.05]"
                  : warning
                    ? "border-yellow-300/15 bg-yellow-300/[0.05]"
                    : "border-lime-300/12 bg-lime-300/[0.035]"
            }`}
          >
            {passed &&
            !failed ? (
              <CheckCircle2
                size={15}
                className="text-lime-300"
              />
            ) : (
              <Icon
                size={15}
                className={
                  root
                    ? "text-purple-300"
                    : failed
                      ? "text-red-300"
                      : warning
                        ? "text-yellow-200"
                        : "text-white/35"
                }
              />
            )}
          </div>

          <div>
            <p className="text-[8px] font-black tracking-[0.13em] text-white/45">
              {node.label}
            </p>

            <p className="mt-1 max-w-[105px] text-[9px] leading-4 text-white/25">
              {node.detail}
            </p>
          </div>
        </div>

        {root && (
          <div className="mt-3 flex items-center gap-2 border-t border-purple-300/10 pt-3">
            <TriangleAlert
              size={10}
              className="text-purple-300"
            />

            <span className="text-[7px] font-black tracking-[0.12em] text-purple-300">
              ROOT CAUSE
            </span>
          </div>
        )}
      </div>
    </div>
  );
}