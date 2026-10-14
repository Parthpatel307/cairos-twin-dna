import {
  AlertTriangle,
  Ban,
  CheckCircle2,
} from "lucide-react";

const actions = [
  {
    agent: "Database Agent",
    action: "UPDATE production.users",
    risk: "HIGH",
    decision: "REVIEW",
    time: "2 min ago",
  },

  {
    agent: "GitHub Agent",
    action: "Delete unused files",
    risk: "CRITICAL",
    decision: "BLOCKED",
    time: "8 min ago",
  },

  {
    agent: "Email Agent",
    action: "Send customer update",
    risk: "LOW",
    decision: "ALLOWED",
    time: "11 min ago",
  },

  {
    agent: "Deployment Agent",
    action: "Deploy release v2.4",
    risk: "MEDIUM",
    decision: "ALLOWED",
    time: "19 min ago",
  },
];

function Risk({ value }: { value: string }) {
  const styles =
    value === "LOW"
      ? "text-lime-300 bg-lime-300/10 border-lime-300/20"
      : value === "MEDIUM"
        ? "text-yellow-200 bg-yellow-300/10 border-yellow-300/20"
        : "text-red-300 bg-red-400/10 border-red-400/20";

  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-[9px] font-black tracking-wider ${styles}`}
    >
      {value}
    </span>
  );
}

function Decision({
  value,
}: {
  value: string;
}) {
  if (value === "ALLOWED") {
    return (
      <span className="flex items-center gap-1.5 text-xs font-bold text-lime-300">
        <CheckCircle2 size={14} />
        ALLOWED
      </span>
    );
  }

  if (value === "BLOCKED") {
    return (
      <span className="flex items-center gap-1.5 text-xs font-bold text-red-300">
        <Ban size={14} />
        BLOCKED
      </span>
    );
  }

  return (
    <span className="flex items-center gap-1.5 text-xs font-bold text-yellow-200">
      <AlertTriangle size={14} />
      REVIEW
    </span>
  );
}

export default function RecentActivity() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0d100d]">
      <div className="flex items-center justify-between border-b border-white/[0.06] p-5">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">
            Recent Agent Activity
          </p>

          <h2 className="mt-1 text-lg font-bold">
            Latest governed actions
          </h2>
        </div>

        <button className="text-[11px] font-bold text-lime-300">
          VIEW ALL →
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="text-left text-[9px] uppercase tracking-[0.15em] text-white/20">
              <th className="px-5 py-4">
                Agent
              </th>

              <th className="px-5 py-4">
                Action
              </th>

              <th className="px-5 py-4">
                Risk
              </th>

              <th className="px-5 py-4">
                Decision
              </th>

              <th className="px-5 py-4">
                Time
              </th>
            </tr>
          </thead>

          <tbody>
            {actions.map((item) => (
              <tr
                key={`${item.agent}-${item.time}`}
                className="border-t border-white/[0.05] transition hover:bg-white/[0.02]"
              >
                <td className="px-5 py-4 text-sm font-semibold text-white/70">
                  {item.agent}
                </td>

                <td className="px-5 py-4 text-sm text-white/35">
                  {item.action}
                </td>

                <td className="px-5 py-4">
                  <Risk value={item.risk} />
                </td>

                <td className="px-5 py-4">
                  <Decision
                    value={item.decision}
                  />
                </td>

                <td className="px-5 py-4 text-xs text-white/25">
                  {item.time}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}