"use client";

import {
  useRef,
  useState,
  type PointerEvent,
} from "react";

import {
  ArrowDown,
} from "lucide-react";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";

import CairosCanvas from "@/components/three/CairosCanvas";
import CairosExperienceScene from "@/components/three/CairosExperienceScene";

const scenes = [
  {
    index:
      "01",

    label:
      "INTAKE",

    kicker:
      "USER REQUEST",

    lines: [
      "THE REQUEST",
      "ENTERS.",
    ],

    accentLine:
      1,

    accent:
      "#d4ff32",

    description:
      "The agent's intended action becomes an observable proposal before it is allowed anywhere near production.",

    foot:
      "INTENT → PLAN",
  },

  {
    index:
      "02",

    label:
      "AGENT TWIN",

    kicker:
      "ISOLATED SIMULATION",

    lines: [
      "SPLIT",
      "REALITY.",
    ],

    accentLine:
      0,

    accent:
      "#d4ff32",

    description:
      "The same plan is replayed inside the Twin. Production remains untouched while consequences are exposed.",

    foot:
      "SIMULATE BEFORE ACTION",
  },

  {
    index:
      "03",

    label:
      "CAIROS",

    kicker:
      "GOVERNANCE",

    lines: [
      "CLOSE",
      "THE GATE.",
    ],

    accentLine:
      1,

    accent:
      "#d7a83a",

    description:
      "Risk propagates across dependent systems. When authority is insufficient, the execution boundary physically closes.",

    foot:
      "DECISION / ASK",
  },

  {
    index:
      "04",

    label:
      "AGENTDNA",

    kicker:
      "CAUSAL REPLAY",

    lines: [
      "UNFOLD",
      "THE CAUSE.",
    ],

    accentLine:
      0,

    accent:
      "#8a63ff",

    description:
      "Observable evidence expands into a causal graph. Failure and counterfactual paths separate so the root cause can be isolated.",

    foot:
      "REPLAY / ROOT CAUSE / COUNTERFACTUAL",
  },
] as const;

export default function CairosTwinWorld() {
  const sectionRef =
    useRef<HTMLElement | null>(
      null
    );

  const pointerRef =
    useRef({
      x: 0,
      y: 0,
    });

  const progressRef =
    useRef(0);

  const velocityRef =
    useRef(0);

  const previousProgress =
    useRef(0);

  const activeRef =
    useRef(0);

  const [
    active,
    setActive,
  ] =
    useState(0);

  const {
    scrollYProgress,
  } =
    useScroll({
      target:
        sectionRef,

      offset: [
        "start start",
        "end end",
      ],
    });

  useMotionValueEvent(
    scrollYProgress,
    "change",
    (
      value
    ) => {
      progressRef.current =
        value *
        (
          scenes.length -
          1
        );

      velocityRef.current =
        (
          value -
          previousProgress.current
        ) *
        100;

      previousProgress.current =
        value;

      const next =
        Math.min(
          scenes.length -
            1,
          Math.max(
            0,
            Math.floor(
              value *
                scenes.length
            )
          )
        );

      if (
        next !==
        activeRef.current
      ) {
        activeRef.current =
          next;

        setActive(
          next
        );
      }
    }
  );

  const handlePointerMove =
    (
      event:
        PointerEvent<HTMLElement>
    ) => {
      if (
        event.pointerType !==
        "mouse"
      ) {
        return;
      }

      const rect =
        event.currentTarget.getBoundingClientRect();

      pointerRef.current.x =
        (
          (
            event.clientX -
            rect.left
          ) /
            rect.width
        ) *
          2 -
        1;

      pointerRef.current.y =
        (
          (
            event.clientY -
            rect.top
          ) /
            rect.height
        ) *
          2 -
        1;
    };

  const scene =
    scenes[
      active
    ];

  const skip =
    () => {
      document
        .getElementById(
          "cairos-playbook"
        )
        ?.scrollIntoView({
          behavior:
            "smooth",

          block:
            "start",
        });
    };

  return (
    <section
      ref={sectionRef}
      onPointerMove={
        handlePointerMove
      }
      onPointerLeave={() => {
        pointerRef.current = {
          x: 0,
          y: 0,
        };
      }}
      className="relative"
      style={{
        height:
          "390svh",
      }}
    >
      <div className="sticky top-[84px] flex h-[calc(100svh-84px)] min-h-[650px] items-center py-5">
        <div className="mx-auto h-[calc(100%-20px)] w-full max-w-[1440px] px-4 sm:px-6">
          <div className="relative h-full overflow-hidden rounded-[34px] border border-[#d4ff32]/15 bg-[#050805]/90 shadow-[0_35px_110px_rgba(0,0,0,.36)]">
            {/* =================================
                ATMOSPHERE
            ================================= */}

            <motion.div
              animate={{
                background:
                  active ===
                  3
                    ? "radial-gradient(circle at 73% 47%,rgba(138,99,255,.14),transparent 31%)"
                    : active ===
                        2
                      ? "radial-gradient(circle at 73% 47%,rgba(215,168,58,.13),transparent 31%)"
                      : "radial-gradient(circle at 73% 47%,rgba(212,255,50,.095),transparent 31%)",
              }}
              transition={{
                duration:
                  0.55,
              }}
              className="pointer-events-none absolute inset-0"
            />

            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-[0.12]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(212,255,50,.16) 1px,transparent 1px),linear-gradient(90deg,rgba(212,255,50,.16) 1px,transparent 1px)",

                backgroundSize:
                  "110px 110px",
              }}
            />

            {/* =================================
                3D
            ================================= */}

            <div className="absolute inset-0 z-10">
              <CairosCanvas className="opacity-85 lg:opacity-100">
                <CairosExperienceScene
                  progressRef={
                    progressRef
                  }
                  pointerRef={
                    pointerRef
                  }
                  velocityRef={
                    velocityRef
                  }
                />
              </CairosCanvas>
            </div>

            {/* LEFT GRADIENT */}

            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-20 hidden sm:block"
              style={{
                background:
                  "linear-gradient(90deg,rgba(5,8,5,.99) 0%,rgba(5,8,5,.95) 28%,rgba(5,8,5,.62) 43%,rgba(5,8,5,.08) 61%,transparent 72%)",
              }}
            />

            {/* =================================
                TOP META
            ================================= */}

            <div className="absolute left-7 right-7 top-6 z-40 flex items-center justify-between sm:left-10 sm:right-10">
              <div className="flex items-center gap-4">
                <span className="rounded-full border border-[#d4ff32]/18 px-4 py-2 text-[7px] font-black tracking-[0.15em] text-[#e8e9df]/60">
                  DIGITAL TWIN
                </span>

                <span className="hidden text-[7px] font-black tracking-[0.15em] text-[#d4ff32]/46 md:block">
                  LIVE SYSTEM MODEL
                </span>
              </div>

              <button
                type="button"
                onClick={
                  skip
                }
                className="flex min-h-[40px] items-center gap-2 rounded-full border border-[#d4ff32]/16 px-5 text-[7px] font-black tracking-[0.13em] text-[#e8e9df]/45 transition hover:border-[#d4ff32]/40 hover:text-[#d4ff32]"
              >
                PLAYBOOK

                <ArrowDown
                  size={11}
                />
              </button>
            </div>

            {/* =================================
                COPY
            ================================= */}

            <div className="absolute inset-0 z-30 flex items-center">
              <div className="w-full px-8 sm:px-12 lg:px-16">
                <AnimatePresence
                  mode="wait"
                  initial={false}
                >
                  <motion.div
                    key={
                      scene.index
                    }
                    initial={{
                      opacity: 0,
                      y: 26,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      y: -18,
                    }}
                    transition={{
                      duration:
                        0.36,

                      ease: [
                        0.22,
                        1,
                        0.36,
                        1,
                      ],
                    }}
                    className="pointer-events-none max-w-[610px]"
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className="text-[8px] font-black tracking-[0.18em]"
                        style={{
                          color:
                            scene.accent,
                        }}
                      >
                        {
                          scene.index
                        }
                      </span>

                      <span className="h-px w-10 bg-[#e8e9df]/15" />

                      <span className="text-[8px] font-black tracking-[0.16em] text-[#e8e9df]/52">
                        {
                          scene.label
                        }
                      </span>

                      <span className="hidden text-[7px] font-black tracking-[0.13em] text-[#e8e9df]/22 sm:inline">
                        {
                          scene.kicker
                        }
                      </span>
                    </div>

                    <h2
                      className="mt-8 font-black uppercase tracking-[-0.075em]"
                      style={{
                        fontSize:
                          "clamp(54px,min(6.2vw,10.5vh),105px)",

                        lineHeight:
                          0.79,
                      }}
                    >
                      {scene.lines.map(
                        (
                          line,
                          index
                        ) => (
                          <span
                            key={
                              line
                            }
                            className="block"
                            style={{
                              color:
                                index ===
                                scene.accentLine
                                  ? scene.accent
                                  : "#e8e9df",
                            }}
                          >
                            {line}
                          </span>
                        )
                      )}
                    </h2>

                    <p className="mt-8 max-w-[500px] text-[12px] leading-7 text-[#e8e9df]/42">
                      {
                        scene.description
                      }
                    </p>

                    <div className="mt-7 flex items-center gap-3">
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{
                          backgroundColor:
                            scene.accent,
                        }}
                      />

                      <span className="text-[7px] font-black tracking-[0.15em] text-[#e8e9df]/28">
                        {
                          scene.foot
                        }
                      </span>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* =================================
                RIGHT INDEX
            ================================= */}

            <div className="pointer-events-none absolute right-8 top-1/2 z-40 hidden -translate-y-1/2 xl:block">
              <div className="space-y-5">
                {scenes.map(
                  (
                    item,
                    index
                  ) => (
                    <div
                      key={
                        item.index
                      }
                      className="flex items-center gap-3"
                    >
                      <span
                        className={`text-[7px] font-black tracking-[0.13em] ${
                          active ===
                          index
                            ? "text-[#e8e9df]/70"
                            : "text-[#e8e9df]/16"
                        }`}
                      >
                        {
                          item.index
                        }
                      </span>

                      <motion.span
                        animate={{
                          width:
                            active ===
                            index
                              ? 38
                              : 10,

                          backgroundColor:
                            active ===
                            index
                              ? item.accent
                              : "rgba(232,233,223,.14)",
                        }}
                        className="h-px"
                      />
                    </div>
                  )
                )}
              </div>
            </div>

            {/* =================================
                PROGRESS
            ================================= */}

            <div className="pointer-events-none absolute bottom-7 left-8 right-8 z-40 sm:left-12 sm:right-12">
              <div className="flex items-center gap-4">
                <div className="h-px flex-1 overflow-hidden bg-[#e8e9df]/10">
                  <motion.div
                    style={{
                      scaleX:
                        scrollYProgress,
                    }}
                    className="h-full origin-left bg-[#d4ff32]"
                  />
                </div>

                <span className="text-[7px] font-black tracking-[0.13em] text-[#e8e9df]/25">
                  {
                    scene.index
                  }
                  /04
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}