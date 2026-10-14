"use client";

import {
  useRef,
  useState,
  type PointerEvent,
} from "react";

import {
  ArrowDown,
  ArrowRight,
  Fingerprint,
  Play,
} from "lucide-react";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";

import CairosCanvas from "@/components/three/CairosCanvas";
import CairosExperienceScene from "@/components/three/CairosExperienceScene";

interface CairosExperienceProps {
  onRun: () => void;
  onAgentDNA: () => void;
}

const chapters = [
  {
    index: "01",
    label: "CAIROS",
    meta: "AUTONOMOUS AGENT SAFETY",

    lines: [
      "BEFORE",
      "REALITY",
      "CHANGES.",
    ],

    accentLine: 2,

    accent: "#88b22a",

    description:
      "An autonomous agent has a plan. CAIROS decides whether that plan gets a future.",

    footer:
      "SCROLL TO EXPLORE",
  },

  {
    index: "02",
    label: "AGENT TWIN",
    meta: "SAFE SIMULATION",

    lines: [
      "SIMULATE",
      "THE",
      "PLAN.",
    ],

    accentLine: 0,

    accent: "#88b22a",

    description:
      "Run the proposed action somewhere safe before the real environment is allowed to change.",

    footer:
      "PRODUCTION UNTOUCHED",
  },

  {
    index: "03",
    label: "CAIROS",
    meta: "GOVERNANCE",

    lines: [
      "AUTONOMY",
      "STOPS",
      "HERE.",
    ],

    accentLine: 1,

    accent: "#a9872b",

    description:
      "Risk is evidence. Authority is a decision. CAIROS closes the gate when the action needs a human.",

    footer:
      "ALLOW / ASK / BLOCK",
  },

  {
    index: "04",
    label: "AGENTDNA",
    meta: "CAUSAL FORENSICS",

    lines: [
      "EXPLAIN",
      "WHAT",
      "HAPPENED.",
    ],

    accentLine: 0,

    accent: "#7659d8",

    description:
      "Replay observable evidence, isolate the causal failure and compare the outcome against a safer path.",

    footer:
      "OBSERVABLE EVIDENCE / COUNTERFACTUAL",
  },
] as const;

export default function CairosExperience({
  onRun,
  onAgentDNA,
}: CairosExperienceProps) {
  const containerRef =
    useRef<HTMLElement | null>(
      null
    );

  const progressRef =
    useRef(0);

  /*
    This pointer is ONLY for WebGL reaction.

    Important:
    We do NOT draw another HTML cursor here.
    CairosGlobalField owns the single cursor
    for the entire homepage.
  */
  const pointerRef =
    useRef({
      x: 0,
      y: 0,
    });

  const velocityRef =
    useRef(0);

  const previousProgress =
    useRef(0);

  const activeRef =
    useRef(0);

  const [
    activeChapter,
    setActiveChapter,
  ] =
    useState(0);

  const {
    scrollYProgress,
  } =
    useScroll({
      target:
        containerRef,

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
          chapters.length -
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
          chapters.length -
            1,
          Math.floor(
            value *
            chapters.length
          )
        );

      if (
        next !==
        activeRef.current
      ) {
        activeRef.current =
          next;

        setActiveChapter(
          next
        );
      }
    }
  );

  const chapter =
    chapters[
      activeChapter
    ];

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

  const handlePointerLeave =
    () => {
      pointerRef.current = {
        x: 0,
        y: 0,
      };
    };

  const skipExperience =
    () => {
      document
        .getElementById(
          "try-cairos"
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
      ref={
        containerRef
      }
      onPointerMove={
        handlePointerMove
      }
      onPointerLeave={
        handlePointerLeave
      }
      className="relative"
      style={{
        height:
          "400svh",
      }}
    >
      {/* =====================================
          STICKY EXPERIENCE WORLD
      ===================================== */}

      <div className="sticky top-[84px] h-[calc(100svh-84px)] min-h-[600px] overflow-hidden bg-[#e4e8e1]/40">
        {/* =====================================
            BACKGROUND

            Very transparent because global
            dotted field is already behind it.
        ===================================== */}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              activeChapter ===
              3
                ? "radial-gradient(circle at 74% 48%,rgba(118,89,216,.075),transparent 30%),radial-gradient(circle at 70% 50%,rgba(255,255,255,.34),transparent 38%)"
                : activeChapter ===
                    2
                  ? "radial-gradient(circle at 74% 48%,rgba(197,163,73,.075),transparent 30%),radial-gradient(circle at 70% 50%,rgba(255,255,255,.34),transparent 38%)"
                  : "radial-gradient(circle at 74% 48%,rgba(159,200,59,.065),transparent 30%),radial-gradient(circle at 70% 50%,rgba(255,255,255,.34),transparent 38%)",
          }}
        />

        {/* =====================================
            WEBGL WORLD

            Cursor movement still affects particles
            and the CAIROS object.
        ===================================== */}

        <CairosCanvas className="opacity-70 sm:opacity-85 lg:opacity-100">
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

        {/* =====================================
            TEXT READABILITY
        ===================================== */}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden sm:block"
          style={{
            background:
              "linear-gradient(90deg,rgba(228,232,225,.97) 0%,rgba(228,232,225,.91) 25%,rgba(228,232,225,.54) 41%,rgba(228,232,225,.035) 60%,transparent 71%)",
          }}
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 sm:hidden"
          style={{
            background:
              "linear-gradient(180deg,rgba(228,232,225,.95) 0%,rgba(228,232,225,.82) 60%,rgba(228,232,225,.28) 82%,transparent 100%)",
          }}
        />

        {/* =====================================
            GLOBAL EXPERIENCE HEADER
        ===================================== */}

        <div className="absolute left-6 right-6 top-7 z-40 flex items-center justify-between sm:left-10 sm:right-10 lg:left-14 lg:right-14">
          <div className="flex items-center gap-4">
            <CairosMark />

            <span className="text-[8px] font-black tracking-[0.18em] text-black/40">
              CAIROS TWIN DNA
            </span>

            <span className="hidden h-px w-10 bg-black/13 sm:block" />

            <span className="hidden text-[7px] font-black tracking-[0.14em] text-black/22 md:block">
              SIMULATE · GOVERN · EXPLAIN
            </span>
          </div>

          <button
            type="button"
            onClick={
              skipExperience
            }
            className="group flex min-h-[42px] items-center gap-2 rounded-full border border-black/[0.09] bg-white/30 px-5 text-[7px] font-black tracking-[0.13em] text-black/42 backdrop-blur-xl transition hover:bg-white/60 hover:text-black/68"
          >
            SKIP EXPERIENCE

            <ArrowDown
              size={11}
              className="transition-transform group-hover:translate-y-0.5"
            />
          </button>
        </div>

        {/* =====================================
            STORY COPY
        ===================================== */}

        <div className="absolute inset-0 z-30 flex items-center">
          <div className="mx-auto w-full max-w-[1320px] px-6 sm:px-10 lg:px-14">
            <AnimatePresence
              mode="wait"
              initial={false}
            >
              <motion.div
                key={
                  chapter.index
                }
                initial={{
                  opacity: 0,
                  y: 30,
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
                    0.38,

                  ease: [
                    0.22,
                    1,
                    0.36,
                    1,
                  ],
                }}
                className="pointer-events-none max-w-[700px]"
              >
                {/* CHAPTER */}

                <div className="flex items-center gap-4">
                  <span
                    className="text-[8px] font-black tracking-[0.18em]"
                    style={{
                      color:
                        chapter.accent,
                    }}
                  >
                    {
                      chapter.index
                    }
                  </span>

                  <span className="h-px w-10 bg-black/14" />

                  <span className="text-[8px] font-black tracking-[0.16em] text-black/39">
                    {
                      chapter.label
                    }
                  </span>

                  <span className="hidden text-[7px] font-black tracking-[0.13em] text-black/21 md:inline">
                    {
                      chapter.meta
                    }
                  </span>
                </div>

                {/* TITLE */}

                <h1
                  className="mt-[clamp(26px,4vh,40px)] font-black leading-[0.79] tracking-[-0.076em]"
                  style={{
                    fontSize:
                      "clamp(54px,min(6.7vw,11.5vh),114px)",
                  }}
                >
                  {chapter.lines.map(
                    (
                      line,
                      index
                    ) => (
                      <span
                        key={
                          `${chapter.index}-${line}`
                        }
                        className="block"
                        style={{
                          color:
                            index ===
                            chapter.accentLine
                              ? chapter.accent
                              : "#11130f",
                        }}
                      >
                        {line}
                      </span>
                    )
                  )}
                </h1>

                {/* DESCRIPTION */}

                <p className="mt-8 max-w-[525px] text-[12px] leading-7 text-black/44 sm:text-[13px]">
                  {
                    chapter.description
                  }
                </p>

                {/* FOOTER */}

                <div className="mt-6 flex items-center gap-3">
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{
                      backgroundColor:
                        chapter.accent,
                    }}
                  />

                  <span className="text-[7px] font-black tracking-[0.15em] text-black/29">
                    {
                      chapter.footer
                    }
                  </span>
                </div>

                {/* OPENING CUE */}

                {activeChapter ===
                  0 && (
                  <motion.div
                    animate={{
                      y: [
                        0,
                        4,
                        0,
                      ],
                    }}
                    transition={{
                      duration:
                        1.8,

                      repeat:
                        Infinity,
                    }}
                    className="mt-8 flex items-center gap-2"
                  >
                    <ArrowDown
                      size={11}
                      className="text-black/28"
                    />

                    <span className="text-[7px] font-black tracking-[0.17em] text-black/27">
                      SCROLL TO EXPLORE
                    </span>
                  </motion.div>
                )}

                {/* LAST CHAPTER CTA */}

                {activeChapter ===
                  chapters.length -
                    1 && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 8,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    className="pointer-events-auto mt-8 flex flex-wrap gap-2"
                  >
                    <button
                      type="button"
                      onClick={
                        onRun
                      }
                      className="editorial-primary min-h-[54px]"
                    >
                      <Play
                        size={13}
                      />

                      RUN CAIROS

                      <ArrowRight
                        size={13}
                      />
                    </button>

                    <button
                      type="button"
                      onClick={
                        onAgentDNA
                      }
                      className="editorial-secondary min-h-[54px]"
                    >
                      <Fingerprint
                        size={13}
                        className="text-[#7659d8]"
                      />

                      AGENTDNA
                    </button>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* =====================================
            RIGHT RAIL
        ===================================== */}

        <div className="pointer-events-none absolute right-10 top-1/2 z-40 hidden -translate-y-1/2 xl:block">
          <div className="space-y-5">
            {chapters.map(
              (
                item,
                index
              ) => {
                const active =
                  index ===
                  activeChapter;

                return (
                  <div
                    key={
                      item.index
                    }
                    className="flex items-center gap-3"
                  >
                    <span
                      className={`text-[7px] font-black tracking-[0.13em] ${
                        active
                          ? "text-black/60"
                          : "text-black/16"
                      }`}
                    >
                      {
                        item.index
                      }
                    </span>

                    <motion.span
                      animate={{
                        width:
                          active
                            ? 36
                            : 10,

                        backgroundColor:
                          active
                            ? item.accent
                            : "rgba(17,19,15,.14)",
                      }}
                      className="h-px"
                    />
                  </div>
                );
              }
            )}
          </div>
        </div>

        {/* =====================================
            BOTTOM PROGRESS
        ===================================== */}

        <div className="pointer-events-none absolute bottom-6 left-6 right-6 z-40 sm:left-10 sm:right-10 lg:left-14 lg:right-14">
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 overflow-hidden bg-black/[0.075]">
              <motion.div
                style={{
                  scaleX:
                    scrollYProgress,
                }}
                className="h-full origin-left bg-[#8fb52d]"
              />
            </div>

            <span className="text-[7px] font-black tracking-[0.13em] text-black/24">
              {
                chapter.index
              }
              /
              {String(
                chapters.length
              ).padStart(
                2,
                "0"
              )}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function CairosMark() {
  return (
    <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#171a15]">
      <span className="absolute inset-[5px] rounded-full border border-white/[0.1]" />

      <span className="h-2 w-2 rounded-full bg-[#9fc83b]" />
    </div>
  );
}