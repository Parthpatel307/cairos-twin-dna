"use client";

import {
  Activity,
  Bot,
  Database,
  Gauge,
  Network,
  Radar,
  Server,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import {
  motion,
} from "framer-motion";

import CairosCanvas from "@/components/three/CairosCanvas";

import TwinSimulationScene from "@/components/three/TwinSimulationScene";

import type {
  Decision,
  RiskLevel,
} from "@/types";

interface TwinCoreProps {
  loading?: boolean;
  decision?: Decision;
  riskScore?: number;
  riskLevel?: RiskLevel;
}

export default function TwinCore({
  loading = false,
  decision,
  riskScore,
  riskLevel,
}: TwinCoreProps) {
  const hasResult =
    typeof riskScore ===
    "number";

  const accent =
    decision === "BLOCK"
      ? "red"
      : decision === "ASK"
        ? "yellow"
        : "lime";

  return (
    <div className="relative min-h-[680px] overflow-hidden rounded-[28px]">
      {/* =====================================
          REAL 3D WORLD
      ===================================== */}

      <CairosCanvas>
        <TwinSimulationScene
          loading={
            loading
          }
          decision={
            decision
          }
          riskScore={
            riskScore
          }
          riskLevel={
            riskLevel
          }
        />
      </CairosCanvas>

      {/* =====================================
          BACKGROUND FADES
      ===================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(3,5,3,.14)_44%,rgba(3,5,3,.72)_100%)]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.16] [background-image:linear-gradient(rgba(255,255,255,.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.025)_1px,transparent_1px)] [background-size:52px_52px]"
      />

      {/* =====================================
          HEADER
      ===================================== */}

      <div className="relative z-20 flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between md:p-6">
        <div>
          <div className="flex items-center gap-2">
            <Radar
              size={13}
              className="text-lime-300"
            />

            <p className="section-label">
              Digital Twin Chamber
            </p>
          </div>

          <h2 className="mt-2 text-2xl font-black tracking-[-0.045em] text-white/95">
            Isolated execution environment
          </h2>

          <p className="mt-2 max-w-xl text-[11px] leading-6 text-white/50">
            A real-time virtual scene of
            the proposed action before
            production is touched.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <StatusChip
            label="ISOLATED"
            active
          />

          <StatusChip
            label={
              loading
                ? "SIMULATING"
                : hasResult
                  ? "ANALYZED"
                  : "STANDBY"
            }
            active={
              loading ||
              hasResult
            }
          />
        </div>
      </div>

      {/* =====================================
          3D LABELS
      ===================================== */}

      <div className="pointer-events-none absolute inset-x-0 top-[125px] z-20 hidden h-[430px] md:block">
        <SceneLabel
          className="absolute left-[5%] top-[27%]"
          icon={
            Bot
          }
          title="AGENT"
          subtitle={
            loading
              ? "Plan streaming"
              : hasResult
                ? "Plan observed"
                : "Plan ready"
          }
          active={
            loading ||
            hasResult
          }
        />

        <SceneLabel
          className="absolute right-[5%] top-[27%]"
          icon={
            Server
          }
          title="TARGET"
          subtitle="Production"
        />

        <SceneLabel
          className="absolute bottom-[7%] left-[16%]"
          icon={
            Database
          }
          title="STATE"
          subtitle={
            loading
              ? "Snapshot active"
              : "Snapshot"
          }
          active={
            loading ||
            hasResult
          }
        />

        <SceneLabel
          className="absolute bottom-[7%] right-[15%]"
          icon={
            Network
          }
          title="BLAST"
          subtitle={
            hasResult
              ? "Mapped"
              : "Pending"
          }
          active={
            hasResult
          }
          warning={
            hasResult
          }
        />
      </div>

      {/* =====================================
          CENTER STATUS
      ===================================== */}

      <div className="pointer-events-none absolute left-1/2 top-[51%] z-20 -translate-x-1/2 text-center">
        <motion.div
          animate={
            loading
              ? {
                  opacity: [
                    0.45,
                    1,
                    0.45,
                  ],
                }
              : undefined
          }
          transition={{
            duration: 1.3,
            repeat:
              Infinity,
          }}
        >
          <p
            className={`text-[10px] font-black tracking-[0.16em] ${
              accent ===
              "red"
                ? "text-red-300"
                : accent ===
                    "yellow"
                  ? "text-yellow-200"
                  : "text-lime-300"
            }`}
          >
            {loading
              ? "SIMULATING"
              : decision
                ? `CAIROS · ${decision}`
                : "TWIN CORE"}
          </p>

          <p className="mt-2 text-[9px] tracking-[0.08em] text-white/40">
            {loading
              ? "Replaying proposed action"
              : hasResult
                ? "Simulation evidence captured"
                : "Awaiting agent execution"}
          </p>
        </motion.div>
      </div>

      {/* =====================================
          MOBILE LABEL STRIP
      ===================================== */}

      <div className="relative z-20 mx-5 mt-[380px] grid grid-cols-2 gap-2 md:hidden">
        <SceneLabel
          icon={
            Bot
          }
          title="AGENT"
          subtitle={
            loading
              ? "Planning"
              : "Ready"
          }
          active={
            loading ||
            hasResult
          }
        />

        <SceneLabel
          icon={
            Server
          }
          title="TARGET"
          subtitle="Production"
        />

        <SceneLabel
          icon={
            Database
          }
          title="STATE"
          subtitle="Snapshot"
          active={
            loading ||
            hasResult
          }
        />

        <SceneLabel
          icon={
            Network
          }
          title="BLAST"
          subtitle={
            hasResult
              ? "Mapped"
              : "Pending"
          }
          active={
            hasResult
          }
          warning={
            hasResult
          }
        />
      </div>

      {/* =====================================
          TELEMETRY
      ===================================== */}

      <div className="relative z-20 mt-auto grid gap-2 px-5 pb-5 pt-5 sm:grid-cols-2 xl:grid-cols-4">
        <TelemetryCell
          icon={
            ShieldCheck
          }
          label="ISOLATION"
          value="100%"
          state="SAFE"
          tone="lime"
        />

        <TelemetryCell
          icon={
            Gauge
          }
          label="RISK SCORE"
          value={
            hasResult
              ? `${riskScore}/100`
              : "--"
          }
          state={
            riskLevel ??
            "PENDING"
          }
          tone={
            riskLevel ===
              "CRITICAL"
              ? "red"
              : riskLevel ===
                  "HIGH"
                ? "yellow"
                : "lime"
          }
        />

        <TelemetryCell
          icon={
            Radar
          }
          label="DECISION"
          value={
            decision ??
            "WAITING"
          }
          state="CAIROS"
          tone={
            accent
          }
        />

        <TelemetryCell
          icon={
            Sparkles
          }
          label="ENVIRONMENT"
          value={
            loading
              ? "ACTIVE"
              : hasResult
                ? "COMPLETE"
                : "READY"
          }
          state="TWIN"
          tone="lime"
        />
      </div>
    </div>
  );
}

function StatusChip({
  label,
  active,
}: {
  label: string;
  active: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-2 rounded-full border px-3 py-2 backdrop-blur-xl ${
        active
          ? "border-lime-300/15 bg-lime-300/[0.04]"
          : "border-white/[0.07] bg-black/25"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          active
            ? "bg-lime-300 shadow-[0_0_10px_rgba(214,255,79,.65)]"
            : "bg-white/25"
        }`}
      />

      <span
        className={`text-[8px] font-black tracking-[0.12em] ${
          active
            ? "text-lime-300"
            : "text-white/45"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

function SceneLabel({
  className = "",
  icon: Icon,
  title,
  subtitle,
  active = false,
  warning = false,
}: {
  className?: string;

  icon:
    typeof Bot;

  title: string;

  subtitle: string;

  active?: boolean;

  warning?: boolean;
}) {
  return (
    <div
      className={`rounded-[17px] border px-3 py-3 backdrop-blur-xl ${
        warning
          ? "border-yellow-300/16 bg-yellow-300/[0.03]"
          : active
            ? "border-lime-300/15 bg-lime-300/[0.03]"
            : "border-white/[0.07] bg-black/30"
      } ${className}`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${
            warning
              ? "border-yellow-300/15 bg-yellow-300/[0.045]"
              : active
                ? "border-lime-300/15 bg-lime-300/[0.045]"
                : "border-white/[0.07] bg-white/[0.02]"
          }`}
        >
          <Icon
            size={14}
            className={
              warning
                ? "text-yellow-200"
                : active
                  ? "text-lime-300"
                  : "text-white/42"
            }
          />
        </div>

        <div>
          <p className="text-[9px] font-black tracking-[0.1em] text-white/70">
            {title}
          </p>

          <p
            className={`mt-1 text-[8px] ${
              warning
                ? "text-yellow-200/70"
                : active
                  ? "text-lime-300/70"
                  : "text-white/42"
            }`}
          >
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}

function TelemetryCell({
  icon: Icon,
  label,
  value,
  state,
  tone,
}: {
  icon:
    typeof ShieldCheck;

  label: string;

  value: string;

  state: string;

  tone:
    | "lime"
    | "yellow"
    | "red";
}) {
  const color =
    tone === "red"
      ? "text-red-300"
      : tone ===
          "yellow"
        ? "text-yellow-200"
        : "text-lime-300";

  const dot =
    tone === "red"
      ? "bg-red-300"
      : tone ===
          "yellow"
        ? "bg-yellow-200"
        : "bg-lime-300";

  return (
    <div className="rounded-[17px] border border-white/[0.065] bg-black/25 p-4 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon
            size={12}
            className={color}
          />

          <p className="text-[8px] font-black tracking-[0.11em] text-white/45">
            {label}
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <span
            className={`h-1.5 w-1.5 rounded-full ${dot}`}
          />

          <span className="text-[7px] font-black tracking-[0.1em] text-white/35">
            {state}
          </span>
        </div>
      </div>

      <p
        className={`mt-3 text-[15px] font-black tracking-[-0.02em] ${color}`}
      >
        {value}
      </p>
    </div>
  );
}