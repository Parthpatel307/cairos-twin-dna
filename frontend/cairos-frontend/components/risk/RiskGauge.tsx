"use client";

import {
  AlertTriangle,
  Ban,
  CheckCircle2,
  ShieldAlert,
} from "lucide-react";

import type {
  Decision,
  RiskLevel,
} from "@/types";

interface RiskGaugeProps {
  score: number;
  level: RiskLevel;
  decision: Decision;
}

export default function RiskGauge({
  score,
  level,
  decision,
}: RiskGaugeProps) {
  const safeScore =
    Math.max(
      0,
      Math.min(
        score,
        100
      )
    );

  const radius = 104;

  const circumference =
    2 *
    Math.PI *
    radius;

  const progress =
    circumference -
    (safeScore / 100) *
      circumference;

  const color =
    level === "LOW"
      ? "#bef264"
      : level ===
          "MEDIUM"
        ? "#fde047"
        : level ===
            "HIGH"
          ? "#fb923c"
          : "#f87171";

  const Icon =
    decision === "ALLOW"
      ? CheckCircle2
      : decision ===
          "ASK"
        ? AlertTriangle
        : Ban;

  return (
    <div className="relative overflow-hidden rounded-[26px]">
      {/* AMBIENT */}

      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[110px]"
        style={{
          background:
            `${color}12`,
        }}
      />

      {/* HEADER */}

      <div className="relative z-10 flex items-start justify-between">
        <div>
          <p className="section-label">
            Threat Analysis
          </p>

          <h2 className="section-title">
            Risk intelligence
          </h2>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/[0.07] bg-black/20">
          <ShieldAlert
            size={18}
            style={{
              color,
            }}
          />
        </div>
      </div>

      {/* GAUGE */}

      <div className="relative z-10 mt-8 flex justify-center">
        <div className="relative h-[270px] w-[270px]">
          {/* outer orbital rings */}

          <div className="absolute inset-0 rounded-full border border-white/[0.04]" />

          <div className="absolute inset-[17px] rounded-full border border-dashed border-white/[0.045] animate-[spin_25s_linear_infinite]" />

          <div className="absolute inset-[38px] rounded-full border border-white/[0.04]" />

          {/* SVG */}

          <svg
            viewBox="0 0 240 240"
            className="absolute inset-[15px] h-[240px] w-[240px] -rotate-90"
          >
            <circle
              cx="120"
              cy="120"
              r={radius}
              fill="none"
              stroke="rgba(255,255,255,.045)"
              strokeWidth="8"
            />

            <circle
              cx="120"
              cy="120"
              r={radius}
              fill="none"
              stroke={color}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={
                circumference
              }
              strokeDashoffset={
                progress
              }
              className="transition-all duration-1000 ease-out"
              style={{
                filter:
                  `drop-shadow(0 0 8px ${color}65)`,
              }}
            />
          </svg>

          {/* CENTER */}

          <div className="absolute inset-[68px] flex flex-col items-center justify-center rounded-full border border-white/[0.07] bg-[#080a08]/80 shadow-[inset_0_1px_0_rgba(255,255,255,.04)] backdrop-blur-xl">
            <p className="text-[8px] font-black uppercase tracking-[0.18em] text-white/20">
              Risk Score
            </p>

            <div className="mt-1 flex items-end">
              <span
                className="text-5xl font-black tracking-[-0.07em]"
                style={{
                  color,
                }}
              >
                {safeScore}
              </span>

              <span className="mb-1 ml-1 text-[10px] font-black text-white/18">
                /100
              </span>
            </div>

            <p
              className="mt-2 text-[9px] font-black tracking-[0.16em]"
              style={{
                color,
              }}
            >
              {level}
            </p>
          </div>
        </div>
      </div>

      {/* DECISION */}

      <div className="relative z-10 mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-white/[0.06] bg-black/15 p-4">
          <p className="text-[8px] font-black uppercase tracking-[0.15em] text-white/20">
            Risk Class
          </p>

          <p
            className="mt-2 text-lg font-black"
            style={{
              color,
            }}
          >
            {level}
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-black/15 p-4">
          <p className="text-[8px] font-black uppercase tracking-[0.15em] text-white/20">
            CAIROS
          </p>

          <div className="mt-2 flex items-center gap-2">
            <Icon
              size={15}
              style={{
                color,
              }}
            />

            <p
              className="text-lg font-black"
              style={{
                color,
              }}
            >
              {decision}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}