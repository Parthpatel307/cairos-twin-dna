import {
  ArrowRight,
  CheckCircle2,
  FileCheck2,
  FileWarning,
  LoaderCircle,
  Play,
  RotateCcw,
  ShieldCheck,
  XCircle,
} from "lucide-react";

interface CausalReplayProps {
  original: string;
  counterfactual: string;
  replaying: boolean;
  replayComplete: boolean;
  onReplay: () => void;
}

export default function CausalReplay({
  original,
  counterfactual,
  replaying,
  replayComplete,
  onReplay,
}: CausalReplayProps) {
  return (
    <div>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="section-label">
            Causal Replay
          </p>

          <h2 className="section-title">
            Reconstruct the failure
          </h2>

          <p className="mt-2 max-w-lg text-[10px] leading-5 text-white/20">
            Replay observable events
            while changing one causal
            variable to test whether
            the final outcome changes.
          </p>
        </div>

        <button
          onClick={
            onReplay
          }
          disabled={
            replaying
          }
          className="lime-btn shrink-0 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {replaying ? (
            <LoaderCircle
              size={14}
              className="animate-spin"
            />
          ) : replayComplete ? (
            <RotateCcw
              size={14}
            />
          ) : (
            <Play
              size={14}
            />
          )}

          {replaying
            ? "REPLAYING"
            : replayComplete
              ? "REPLAY AGAIN"
              : "START REPLAY"}
        </button>
      </div>

      <div className="mt-7 grid gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-stretch">
        {/* ORIGINAL */}

        <div className="rounded-[22px] border border-red-400/12 bg-red-400/[0.018] p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[8px] font-black tracking-[0.15em] text-red-300/60">
                ORIGINAL PATH
              </p>

              <h3 className="mt-2 text-base font-black text-white/70">
                Observed execution
              </h3>
            </div>

            <XCircle
              size={19}
              className="text-red-300"
            />
          </div>

          <div className="mt-6 space-y-3">
            <ReplayStep
              number="01"
              text="Filesystem candidates identified"
              state="success"
            />

            <ReplayStep
              number="02"
              text="config.json classified as unused"
              state="root"
            />

            <ReplayStep
              number="03"
              text="Delete operation released"
              state="warning"
            />

            <ReplayStep
              number="04"
              text={original}
              state="failed"
            />
          </div>
        </div>

        {/* ARROW */}

        <div className="flex items-center justify-center">
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-full border transition-all ${
              replaying
                ? "animate-pulse border-purple-300/25 bg-purple-300/[0.07] text-purple-300"
                : replayComplete
                  ? "border-lime-300/20 bg-lime-300/[0.05] text-lime-300"
                  : "border-white/[0.07] bg-black/20 text-white/20"
            }`}
          >
            <ArrowRight
              size={17}
              className="rotate-90 lg:rotate-0"
            />
          </div>
        </div>

        {/* COUNTERFACTUAL */}

        <div
          className={`rounded-[22px] border p-5 transition-all duration-500 ${
            replayComplete
              ? "border-lime-300/15 bg-lime-300/[0.025]"
              : replaying
                ? "border-purple-300/15 bg-purple-300/[0.02]"
                : "border-white/[0.055] bg-black/10"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={`text-[8px] font-black tracking-[0.15em] ${
                  replayComplete
                    ? "text-lime-300/65"
                    : "text-white/20"
                }`}
              >
                COUNTERFACTUAL
              </p>

              <h3 className="mt-2 text-base font-black text-white/70">
                Corrected path
              </h3>
            </div>

            {replayComplete ? (
              <CheckCircle2
                size={19}
                className="text-lime-300"
              />
            ) : replaying ? (
              <LoaderCircle
                size={19}
                className="animate-spin text-purple-300"
              />
            ) : (
              <ShieldCheck
                size={19}
                className="text-white/15"
              />
            )}
          </div>

          <div className="mt-6 space-y-3">
            <ReplayStep
              number="01"
              text="Filesystem candidates identified"
              state={
                replayComplete
                  ? "success"
                  : "locked"
              }
            />

            <ReplayStep
              number="02"
              text="config.json correctly classified as required"
              state={
                replayComplete
                  ? "success"
                  : "locked"
              }
            />

            <ReplayStep
              number="03"
              text="Unsafe delete operation removed from plan"
              state={
                replayComplete
                  ? "success"
                  : "locked"
              }
            />

            <ReplayStep
              number="04"
              text={
                replayComplete
                  ? counterfactual
                  : "Run replay to calculate outcome"
              }
              state={
                replayComplete
                  ? "success"
                  : "locked"
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ReplayStep({
  number,
  text,
  state,
}: {
  number: string;
  text: string;
  state:
    | "success"
    | "root"
    | "warning"
    | "failed"
    | "locked";
}) {
  const config =
    state === "success"
      ? {
          icon:
            FileCheck2,
          color:
            "text-lime-300",
          box:
            "border-lime-300/10 bg-lime-300/[0.018]",
        }
      : state === "root"
        ? {
            icon:
              FileWarning,
            color:
              "text-purple-300",
            box:
              "border-purple-300/15 bg-purple-300/[0.03]",
          }
        : state === "warning"
          ? {
              icon:
                FileWarning,
              color:
                "text-yellow-200",
              box:
                "border-yellow-300/10 bg-yellow-300/[0.018]",
            }
          : state === "failed"
            ? {
                icon:
                  XCircle,
                color:
                  "text-red-300",
                box:
                  "border-red-400/10 bg-red-400/[0.018]",
              }
            : {
                icon:
                  ShieldCheck,
                color:
                  "text-white/15",
                box:
                  "border-white/[0.05] bg-black/10",
              };

  const Icon =
    config.icon;

  return (
    <div
      className={`flex items-center gap-3 rounded-2xl border p-3.5 ${config.box}`}
    >
      <span className="w-5 shrink-0 text-[7px] font-black text-white/15">
        {number}
      </span>

      <Icon
        size={13}
        className={
          config.color
        }
      />

      <p className="text-[9px] leading-5 text-white/35">
        {text}
      </p>
    </div>
  );
}