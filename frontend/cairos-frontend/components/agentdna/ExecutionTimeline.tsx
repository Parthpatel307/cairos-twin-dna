import {
  AlertTriangle,
  CheckCircle2,
  Circle,
  Crosshair,
  XCircle,
} from "lucide-react";

import type {
  DNAEvent,
} from "@/types";

interface ExecutionTimelineProps {
  events: DNAEvent[];
  activeStep?: number;
}

export default function ExecutionTimeline({
  events,
  activeStep = 0,
}: ExecutionTimelineProps) {
  return (
    <div>
      <div>
        <p className="section-label">
          Black Box Trace
        </p>

        <h2 className="section-title">
          Observable event sequence
        </h2>

        <p className="mt-2 text-[10px] leading-5 text-white/20">
          Model I/O, actions,
          observable state changes
          and execution outcomes.
        </p>
      </div>

      <div className="relative mt-7">
        <div className="absolute bottom-5 left-[19px] top-5 w-px bg-gradient-to-b from-lime-300/20 via-purple-300/20 to-red-300/20" />

        <div className="space-y-4">
          {events.map(
            (
              event,
              index
            ) => {
              const config =
                getConfig(
                  event.status
                );

              const Icon =
                config.icon;

              const active =
                activeStep ===
                event.id;

              return (
                <div
                  key={
                    event.id
                  }
                  className="relative flex gap-4"
                >
                  <div
                    className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all duration-500 ${config.iconBox} ${
                      active
                        ? "scale-110 shadow-[0_0_30px_rgba(216,180,254,.18)]"
                        : ""
                    }`}
                  >
                    <Icon
                      size={15}
                      className={
                        config.iconColor
                      }
                    />
                  </div>

                  <div
                    className={`min-w-0 flex-1 rounded-2xl border p-4 transition-all duration-500 ${config.card} ${
                      active
                        ? "translate-x-1 border-purple-300/25"
                        : ""
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-black text-white/65">
                            {
                              event.title
                            }
                          </p>

                          {event.status ===
                            "ROOT_CAUSE" && (
                            <span className="rounded-full border border-purple-300/15 bg-purple-300/[0.05] px-2 py-1 text-[6px] font-black tracking-[0.12em] text-purple-300">
                              ROOT CAUSE
                            </span>
                          )}
                        </div>

                        <p className="mt-2 text-[10px] leading-5 text-white/25">
                          {
                            event.description
                          }
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="font-mono text-[8px] text-white/18">
                          {
                            event.timestamp
                          }
                        </p>

                        <p
                          className={`mt-1 text-[7px] font-black tracking-[0.1em] ${config.iconColor}`}
                        >
                          EVENT{" "}
                          {String(
                            index +
                              1
                          ).padStart(
                            2,
                            "0"
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
}

function getConfig(
  status: DNAEvent["status"]
) {
  switch (status) {
    case "SUCCESS":
      return {
        icon:
          CheckCircle2,

        iconColor:
          "text-lime-300",

        iconBox:
          "border-lime-300/15 bg-lime-300/[0.05]",

        card:
          "border-lime-300/8 bg-lime-300/[0.012]",
      };

    case "WARNING":
      return {
        icon:
          AlertTriangle,

        iconColor:
          "text-yellow-200",

        iconBox:
          "border-yellow-300/15 bg-yellow-300/[0.05]",

        card:
          "border-yellow-300/8 bg-yellow-300/[0.012]",
      };

    case "ROOT_CAUSE":
      return {
        icon:
          Crosshair,

        iconColor:
          "text-purple-300",

        iconBox:
          "border-purple-300/25 bg-purple-300/[0.07]",

        card:
          "border-purple-300/14 bg-purple-300/[0.025]",
      };

    case "FAILED":
      return {
        icon:
          XCircle,

        iconColor:
          "text-red-300",

        iconBox:
          "border-red-400/20 bg-red-400/[0.06]",

        card:
          "border-red-400/10 bg-red-400/[0.018]",
      };

    default:
      return {
        icon:
          Circle,

        iconColor:
          "text-white/20",

        iconBox:
          "border-white/[0.06] bg-white/[0.02]",

        card:
          "border-white/[0.05] bg-black/10",
      };
  }
}