import type { RiskLevel } from "@/types";

interface RiskBadgeProps {
  level: RiskLevel;
}

export default function RiskBadge({
  level,
}: RiskBadgeProps) {
  const styles = {
    LOW:
      "border-lime-300/20 bg-lime-300/10 text-lime-300",
    MEDIUM:
      "border-yellow-300/20 bg-yellow-300/10 text-yellow-200",
    HIGH:
      "border-orange-300/20 bg-orange-300/10 text-orange-200",
    CRITICAL:
      "border-red-400/20 bg-red-400/10 text-red-300",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-[9px] font-black tracking-[0.14em] ${styles[level]}`}
    >
      {level}
    </span>
  );
}