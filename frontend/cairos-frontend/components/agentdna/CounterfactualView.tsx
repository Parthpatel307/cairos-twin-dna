import {
  ArrowRight,
  CheckCircle2,
  LoaderCircle,
  LockKeyhole,
  ShieldCheck,
  XCircle,
} from "lucide-react";

interface CounterfactualViewProps {
  originalResult: string;
  counterfactualResult: string;
  replaying?: boolean;
  verified?: boolean;
}

export default function CounterfactualView({
  originalResult,
  counterfactualResult,
  replaying = false,
  verified = false,
}: CounterfactualViewProps) {
  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="section-label">
            Counterfactual Test
          </p>

          <h2 className="section-title">
            What changes if the cause is removed?
          </h2>
        </div>

        <div
          className={`status-chip ${
            verified
              ? "online"
              : ""
          }`}
        >
          {verified
            ? "VERIFIED"
            : replaying
              ? "COMPUTING"
              : "LOCKED"}
        </div>
      </div>

      <div className="mt-7 grid gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
        {/* OBSERVED */}

        <div className="relative overflow-hidden rounded-[24px] border border-red-400/12 bg-red-400/[0.02] p-6">
          <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-red-400/[0.04] blur-[90px]" />

          <div className="relative">
            <div className="flex items-center justify-between">
              <p className="text-[8px] font-black uppercase tracking-[0.16em] text-red-300/60">
                OBSERVED OUTCOME
              </p>

              <XCircle
                size={18}
                className="text-red-300"
              />
            </div>

            <p className="mt-6 text-2xl font-black tracking-[-0.04em] text-red-200">
              {originalResult}
            </p>

            <p className="mt-3 text-[10px] leading-6 text-white/24">
              Outcome produced by the
              recorded execution path.
            </p>
          </div>
        </div>

        {/* ARROW */}

        <div className="flex justify-center">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-full border ${
              verified
                ? "border-lime-300/20 bg-lime-300/[0.05] text-lime-300"
                : replaying
                  ? "border-purple-300/20 bg-purple-300/[0.05] text-purple-300"
                  : "border-white/[0.07] bg-black/20 text-white/15"
            }`}
          >
            {replaying ? (
              <LoaderCircle
                size={17}
                className="animate-spin"
              />
            ) : (
              <ArrowRight
                size={17}
                className="rotate-90 lg:rotate-0"
              />
            )}
          </div>
        </div>

        {/* COUNTERFACTUAL */}

        <div
          className={`relative overflow-hidden rounded-[24px] border p-6 transition-all duration-500 ${
            verified
              ? "border-lime-300/15 bg-lime-300/[0.025]"
              : replaying
                ? "border-purple-300/15 bg-purple-300/[0.02]"
                : "border-white/[0.055] bg-black/10"
          }`}
        >
          {verified && (
            <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-lime-300/[0.045] blur-[90px]" />
          )}

          <div className="relative">
            <div className="flex items-center justify-between">
              <p
                className={`text-[8px] font-black uppercase tracking-[0.16em] ${
                  verified
                    ? "text-lime-300/65"
                    : replaying
                      ? "text-purple-300/65"
                      : "text-white/18"
                }`}
              >
                COUNTERFACTUAL OUTCOME
              </p>

              {verified ? (
                <CheckCircle2
                  size={18}
                  className="text-lime-300"
                />
              ) : replaying ? (
                <LoaderCircle
                  size={18}
                  className="animate-spin text-purple-300"
                />
              ) : (
                <LockKeyhole
                  size={18}
                  className="text-white/15"
                />
              )}
            </div>

            <p
              className={`mt-6 text-2xl font-black tracking-[-0.04em] ${
                verified
                  ? "text-lime-200"
                  : "text-white/20"
              }`}
            >
              {verified
                ? counterfactualResult
                : replaying
                  ? "Testing alternate path..."
                  : "Run causal replay"}
            </p>

            <p className="mt-3 text-[10px] leading-6 text-white/24">
              {verified
                ? "The failure disappears when the isolated classification error is corrected."
                : "Counterfactual outcome remains locked until replay is complete."}
            </p>
          </div>
        </div>
      </div>

      {verified && (
        <div className="mt-4 flex items-start gap-3 rounded-2xl border border-lime-300/12 bg-lime-300/[0.018] p-4">
          <ShieldCheck
            size={15}
            className="mt-0.5 shrink-0 text-lime-300"
          />

          <p className="text-[10px] leading-5 text-white/28">
            Causal evidence supports
            the classification event as
            the failure-producing
            variable in this replay.
          </p>
        </div>
      )}
    </div>
  );
}