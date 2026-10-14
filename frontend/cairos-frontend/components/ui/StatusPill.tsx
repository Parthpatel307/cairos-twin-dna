import { cn } from "@/lib/utils";

interface StatusPillProps {
  label: string;
  type?: "success" | "warning" | "danger" | "neutral";
}

export default function StatusPill({
  label,
  type = "neutral",
}: StatusPillProps) {
  const styles = {
    success:
      "border-lime-300/20 bg-lime-300/10 text-lime-300",
    warning:
      "border-yellow-300/20 bg-yellow-300/10 text-yellow-200",
    danger:
      "border-red-400/20 bg-red-400/10 text-red-300",
    neutral:
      "border-white/10 bg-white/[0.03] text-white/50",
  };

  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold tracking-wider",
        styles[type]
      )}
    >
      {label}
    </span>
  );
}