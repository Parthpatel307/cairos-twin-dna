import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  helper: string;
  icon: LucideIcon;
}

export default function StatCard({
  label,
  value,
  helper,
  icon: Icon,
}: StatCardProps) {
  return (
    <div className="group rounded-2xl border border-white/[0.08] bg-[#0d100d] p-5 transition duration-300 hover:-translate-y-1 hover:border-lime-300/30">
      <div className="flex items-start justify-between">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">
          {label}
        </p>

        <div className="rounded-xl border border-lime-300/10 bg-lime-300/[0.05] p-2.5 text-lime-300">
          <Icon size={18} />
        </div>
      </div>

      <p className="mt-7 text-4xl font-black tracking-tight">
        {value}
      </p>

      <p className="mt-2 text-xs text-white/30">
        {helper}
      </p>
    </div>
  );
}