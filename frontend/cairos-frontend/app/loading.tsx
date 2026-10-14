import {
  LoaderCircle,
  ShieldCheck,
} from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="relative flex flex-col items-center">

        <div className="absolute h-40 w-40 rounded-full bg-lime-300/5 blur-3xl" />

        <div className="relative flex h-20 w-20 items-center justify-center rounded-[24px] border border-lime-300/20 bg-lime-300/[0.04]">
          <ShieldCheck
            size={32}
            className="text-lime-300"
          />

          <LoaderCircle
            size={76}
            className="absolute animate-spin text-lime-300/20"
          />
        </div>

        <p className="mt-6 text-[10px] font-black tracking-[0.3em] text-lime-300">
          CAIROS
        </p>

        <p className="mt-2 text-xs font-bold text-white/25">
          Loading command
          environment...
        </p>
      </div>
    </div>
  );
}