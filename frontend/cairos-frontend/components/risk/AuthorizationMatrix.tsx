import {
  CheckCircle2,
  LockKeyhole,
  RotateCcw,
  Target,
  XCircle,
} from "lucide-react";

interface AuthorizationMatrixProps {
  authorized: boolean;
  requiredForGoal: boolean;
  reversible: boolean;
}

export default function AuthorizationMatrix({
  authorized,
  requiredForGoal,
  reversible,
}: AuthorizationMatrixProps) {
  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <p className="section-label">
            Authorization Matrix
          </p>

          <h2 className="section-title">
            Execution constraints
          </h2>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/[0.07] bg-black/20">
          <LockKeyhole
            size={18}
            className="text-lime-300"
          />
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <MatrixRow
          icon={LockKeyhole}
          label="Agent Authorized"
          description="Agent has permission for this action domain."
          value={authorized}
          positiveLabel="AUTHORIZED"
          negativeLabel="UNAUTHORIZED"
        />

        <MatrixRow
          icon={Target}
          label="Required For Goal"
          description="Checks whether the risky action is necessary."
          value={
            requiredForGoal
          }
          positiveLabel="REQUIRED"
          negativeLabel="NOT REQUIRED"
        />

        <MatrixRow
          icon={RotateCcw}
          label="Reversibility"
          description="Determines whether the action can be safely undone."
          value={reversible}
          positiveLabel="REVERSIBLE"
          negativeLabel="IRREVERSIBLE"
        />
      </div>

      <div className="mt-5 rounded-2xl border border-yellow-300/10 bg-yellow-300/[0.018] p-4">
        <p className="text-[8px] font-black uppercase tracking-[0.15em] text-yellow-200/70">
          GOVERNANCE SIGNAL
        </p>

        <p className="mt-2 text-[11px] leading-6 text-white/28">
          Authorization alone does
          not guarantee execution.
          CAIROS also evaluates
          necessity, reversibility,
          risk and downstream impact.
        </p>
      </div>
    </div>
  );
}

function MatrixRow({
  icon: Icon,
  label,
  description,
  value,
  positiveLabel,
  negativeLabel,
}: {
  icon: typeof LockKeyhole;
  label: string;
  description: string;
  value: boolean;
  positiveLabel: string;
  negativeLabel: string;
}) {
  return (
    <div
      className={`group rounded-2xl border p-4 transition ${
        value
          ? "border-lime-300/10 bg-lime-300/[0.018] hover:border-lime-300/20"
          : "border-red-400/10 bg-red-400/[0.018] hover:border-red-400/20"
      }`}
    >
      <div className="flex items-center justify-between gap-5">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
              value
                ? "border-lime-300/15 bg-lime-300/[0.05]"
                : "border-red-400/15 bg-red-400/[0.05]"
            }`}
          >
            <Icon
              size={16}
              className={
                value
                  ? "text-lime-300"
                  : "text-red-300"
              }
            />
          </div>

          <div>
            <p className="text-xs font-black text-white/65">
              {label}
            </p>

            <p className="mt-1 text-[9px] leading-4 text-white/20">
              {description}
            </p>
          </div>
        </div>

        <div
          className={`flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 ${
            value
              ? "border-lime-300/15 bg-lime-300/[0.04] text-lime-300"
              : "border-red-400/15 bg-red-400/[0.04] text-red-300"
          }`}
        >
          {value ? (
            <CheckCircle2
              size={11}
            />
          ) : (
            <XCircle
              size={11}
            />
          )}

          <span className="text-[7px] font-black tracking-[0.1em]">
            {value
              ? positiveLabel
              : negativeLabel}
          </span>
        </div>
      </div>
    </div>
  );
}