"use client";

import {
  Activity,
  Bot,
  Fingerprint,
  FlaskConical,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import {
  motion,
} from "framer-motion";

export default function HeroNetwork() {
  return (
    <div className="relative mx-auto h-[480px] w-full max-w-[560px] overflow-hidden rounded-[32px]">
      {/* BACKGROUND */}

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(213,255,77,.07),transparent_42%)]" />

      <div className="pointer-events-none absolute inset-[9%] rounded-full border border-white/[0.045]" />

      <motion.div
        className="pointer-events-none absolute inset-[16%] rounded-full border border-lime-300/10"
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 26,
          repeat:
            Infinity,
          ease:
            "linear",
        }}
      >
        <span className="absolute left-1/2 top-[-4px] h-2 w-2 -translate-x-1/2 rounded-full bg-lime-300 shadow-[0_0_18px_rgba(213,255,77,.7)]" />
      </motion.div>

      <motion.div
        className="pointer-events-none absolute inset-[25%] rounded-full border border-purple-300/10"
        animate={{
          rotate: -360,
        }}
        transition={{
          duration: 18,
          repeat:
            Infinity,
          ease:
            "linear",
        }}
      >
        <span className="absolute bottom-[13%] right-[3%] h-2 w-2 rounded-full bg-purple-300 shadow-[0_0_18px_rgba(216,180,254,.6)]" />
      </motion.div>

      {/* CONNECTIONS */}

      <svg
        viewBox="0 0 560 480"
        className="pointer-events-none absolute inset-0 h-full w-full"
      >
        <defs>
          <linearGradient
            id="lineLime"
            x1="0"
            x2="1"
          >
            <stop
              offset="0%"
              stopColor="rgba(213,255,77,0.08)"
            />

            <stop
              offset="50%"
              stopColor="rgba(213,255,77,0.42)"
            />

            <stop
              offset="100%"
              stopColor="rgba(213,255,77,0.08)"
            />
          </linearGradient>

          <linearGradient
            id="linePurple"
            x1="0"
            x2="1"
          >
            <stop
              offset="0%"
              stopColor="rgba(216,180,254,0.08)"
            />

            <stop
              offset="50%"
              stopColor="rgba(216,180,254,0.38)"
            />

            <stop
              offset="100%"
              stopColor="rgba(216,180,254,0.08)"
            />
          </linearGradient>
        </defs>

        <path
          d="M105 240 C170 175, 205 175, 280 240"
          fill="none"
          stroke="url(#lineLime)"
          strokeWidth="1.2"
          strokeDasharray="5 7"
        />

        <path
          d="M280 240 C350 170, 395 180, 455 240"
          fill="none"
          stroke="url(#lineLime)"
          strokeWidth="1.2"
          strokeDasharray="5 7"
        />

        <path
          d="M280 240 C300 310, 335 335, 400 366"
          fill="none"
          stroke="url(#linePurple)"
          strokeWidth="1.2"
          strokeDasharray="5 7"
        />

        <path
          d="M280 240 C240 310, 205 335, 150 366"
          fill="none"
          stroke="url(#lineLime)"
          strokeWidth="1.2"
          strokeDasharray="5 7"
        />
      </svg>

      {/* CENTER */}

      <motion.div
        className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2"
        animate={{
          y: [
            0,
            -5,
            0,
          ],
        }}
        transition={{
          duration: 4,
          repeat:
            Infinity,
          ease:
            "easeInOut",
        }}
      >
        <div className="relative flex h-40 w-40 items-center justify-center rounded-full border border-lime-300/20 bg-[#0d120b]/85 shadow-[0_0_90px_rgba(213,255,77,.1)] backdrop-blur-2xl">
          <div className="absolute inset-3 rounded-full border border-white/[0.06]" />

          <div className="absolute inset-7 rounded-full border border-lime-300/[0.07]" />

          <ShieldCheck
            size={42}
            className="text-lime-300"
          />

          <div className="absolute -bottom-10 text-center">
            <p className="text-[9px] font-black tracking-[0.15em] text-lime-300">
              CAIROS CORE
            </p>

            <p className="mt-1 text-[9px] text-white/45">
              Pre-execution authority
            </p>
          </div>
        </div>
      </motion.div>

      {/* NODES */}

      <Node
        className="left-[3%] top-[41%]"
        icon={
          Bot
        }
        title="AGENT"
        subtitle="Plan"
        lime
      />

      <Node
        className="right-[2%] top-[41%]"
        icon={
          FlaskConical
        }
        title="TWIN"
        subtitle="Simulate"
        lime
      />

      <Node
        className="bottom-[5%] left-[16%]"
        icon={
          Activity
        }
        title="RISK"
        subtitle="Govern"
        lime
      />

      <Node
        className="bottom-[5%] right-[13%]"
        icon={
          Fingerprint
        }
        title="AGENTDNA"
        subtitle="Explain"
        purple
      />

      {/* FLOATING STATUS */}

      <div className="absolute left-1/2 top-[6%] -translate-x-1/2 rounded-full border border-white/[0.07] bg-black/30 px-4 py-2 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <Sparkles
            size={11}
            className="text-lime-300"
          />

          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-lime-300 shadow-[0_0_10px_rgba(213,255,77,.8)]" />

          <span className="text-[9px] font-black tracking-[0.12em] text-white/58">
            AGENT SAFETY NETWORK
          </span>
        </div>
      </div>
    </div>
  );
}

function Node({
  className,
  icon: Icon,
  title,
  subtitle,
  lime = false,
  purple = false,
}: {
  className: string;
  icon:
    typeof Bot;
  title: string;
  subtitle: string;
  lime?: boolean;
  purple?: boolean;
}) {
  return (
    <motion.div
      className={`absolute z-20 ${className}`}
      whileHover={{
        y: -4,
        scale: 1.03,
      }}
      transition={{
        type: "spring",
        stiffness: 220,
        damping: 18,
      }}
    >
      <div
        className={`min-w-[126px] rounded-[18px] border bg-[#090c09]/90 p-3 shadow-[0_18px_50px_rgba(0,0,0,.42)] backdrop-blur-2xl ${
          purple
            ? "border-purple-300/15"
            : lime
              ? "border-lime-300/15"
              : "border-white/[0.08]"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-xl border ${
              purple
                ? "border-purple-300/15 bg-purple-300/[0.05]"
                : "border-lime-300/15 bg-lime-300/[0.05]"
            }`}
          >
            <Icon
              size={15}
              className={
                purple
                  ? "text-purple-300"
                  : "text-lime-300"
              }
            />
          </div>

          <div>
            <p
              className={`text-[9px] font-black tracking-[0.1em] ${
                purple
                  ? "text-purple-200"
                  : "text-white/70"
              }`}
            >
              {title}
            </p>

            <p className="mt-1 text-[9px] text-white/42">
              {subtitle}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}