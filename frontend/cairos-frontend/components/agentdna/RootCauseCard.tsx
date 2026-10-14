import {
  CheckCircle2,
  Crosshair,
  Fingerprint,
  LoaderCircle,
  Sparkles,
} from "lucide-react";

interface RootCauseCardProps {
  step: number;
  confidence: number;
  explanation: string;
  analyzing?: boolean;
  verified?: boolean;
}

export default function RootCauseCard({
  step,
  confidence,
  explanation,
  analyzing = false,
  verified = false,
}: RootCauseCardProps) {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-purple-400/[0.055] blur-[100px]" />

      {verified && (
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-lime-300/[0.035] blur-[90px]" />
      )}

      <div className="relative">
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="section-label">
              Root Cause
            </p>

            <h2 className="section-title">
              Causal isolation
            </h2>
          </div>

          <div
            className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${
              verified
                ? "border-lime-300/15 bg-lime-300/[0.05]"
                : "border-purple-300/15 bg-purple-300/[0.05]"
            }`}
          >
            {analyzing ? (
              <LoaderCircle
                size={18}
                className="animate-spin text-purple-300"
              />
            ) : verified ? (
              <CheckCircle2
                size={18}
                className="text-lime-300"
              />
            ) : (
              <Crosshair
                size={18}
                className="text-purple-300"
              />
            )}
          </div>
        </div>

        <div className="mt-7 rounded-[24px] border border-purple-300/14 bg-purple-300/[0.025] p-5">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[8px] font-black uppercase tracking-[0.16em] text-purple-300/55">
                ISOLATED EVENT
              </p>

              <p className="mt-2 text-3xl font-black tracking-[-0.05em] text-purple-200">
                Step {step}
              </p>
            </div>

            <div className="sm:text-right">
              <p className="text-[8px] font-black uppercase tracking-[0.16em] text-white/20">
                Confidence
              </p>

              <p className="mt-2 text-3xl font-black tracking-[-0.05em] text-white/85">
                {analyzing
                  ? "..."
                  : `${confidence}%`}
              </p>
            </div>
          </div>

          <div className="mt-5 border-t border-purple-300/10 pt-5">
            <div className="flex items-start gap-3">
              <Fingerprint
                size={16}
                className="mt-0.5 shrink-0 text-purple-300"
              />

              <p className="text-[11px] leading-7 text-white/38">
                {explanation}
              </p>
            </div>
          </div>
        </div>

        <div
          className={`mt-4 rounded-2xl border p-4 ${
            verified
              ? "border-lime-300/12 bg-lime-300/[0.018]"
              : "border-white/[0.06] bg-black/15"
          }`}
        >
          <div className="flex items-start gap-3">
            {verified ? (
              <CheckCircle2
                size={14}
                className="mt-0.5 shrink-0 text-lime-300"
              />
            ) : (
              <Sparkles
                size={14}
                className="mt-0.5 shrink-0 text-purple-300"
              />
            )}

            <div>
              <p
                className={`text-[8px] font-black tracking-[0.13em] ${
                  verified
                    ? "text-lime-300"
                    : "text-purple-300"
                }`}
              >
                {verified
                  ? "CAUSAL LINK VERIFIED"
                  : analyzing
                    ? "TESTING COUNTERFACTUAL"
                    : "REPLAY REQUIRED"}
              </p>

              <p className="mt-2 text-[9px] leading-5 text-white/22">
                {verified
                  ? "Changing the isolated classification step prevents the downstream failure in replay."
                  : "Run causal replay to test whether changing this event alters the final execution outcome."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}