interface RiskMeterProps {
  score: number;
}

export default function RiskMeter({
  score,
}: RiskMeterProps) {
  const getLabel = () => {
    if (score < 30) return "LOW";
    if (score < 60) return "MEDIUM";
    if (score < 80) return "HIGH";
    return "CRITICAL";
  };

  const getColor = () => {
    if (score < 30) return "bg-lime-300";
    if (score < 60) return "bg-yellow-300";
    if (score < 80) return "bg-orange-300";
    return "bg-red-400";
  };

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#0d100d] p-5">
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/30">
        Risk Score
      </p>

      <div className="mt-5 flex items-end justify-between">
        <div>
          <p className="text-6xl font-black tracking-[-0.05em]">
            {score}
          </p>

          <p className="mt-1 text-xs text-white/25">
            out of 100
          </p>
        </div>

        <div className="text-right">
          <p className="text-[9px] uppercase tracking-widest text-white/20">
            Classification
          </p>

          <p className="mt-2 text-lg font-black">
            {getLabel()}
          </p>
        </div>
      </div>

      <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className={`h-full rounded-full transition-all duration-700 ${getColor()}`}
          style={{
            width: `${score}%`,
          }}
        />
      </div>

      <div className="mt-3 flex justify-between text-[8px] font-bold tracking-wider text-white/15">
        <span>SAFE</span>
        <span>CAUTION</span>
        <span>HIGH</span>
        <span>CRITICAL</span>
      </div>
    </div>
  );
}