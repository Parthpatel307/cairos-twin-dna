"use client";

import {
  useRef,
  useState,
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
import CairosIdentityScene from "@/components/three/CairosIdentityScene";

interface CairosScrollStoryProps {
  onStart: () => void;
  onAgentDNA: () => void;
}

const chapters = [
  {
    index: "01",
    label: "CAIROS",
    meta: "AUTONOMOUS AGENT SAFETY",

    lines: [
      "AUTONOMY",
      "NEEDS",
      "AUTHORITY.",
    ],

    accentLine: 2,

    description:
      "Intelligence may propose an action. CAIROS decides whether that action has the authority to become reality.",

    foot:
      "PRE-EXECUTION AUTHORITY",

    accent:
      "#88b22a",
  },

  {
    index: "02",
    label: "AGENT TWIN",
    meta: "ISOLATED SIMULATION",

    lines: [
      "SIMULATE",
      "BEFORE",
      "ACTION.",
    ],

    accentLine: 0,

    description:
      "Run the proposed plan against an isolated representation before production is allowed to change.",

    foot:
      "PRODUCTION UNTOUCHED",

    accent:
      "#88b22a",
  },

  {
    index: "03",
    label: "GOVERNANCE",
    meta: "CAIROS DECISION",

    lines: [
      "GOVERN",
      "THE",
      "DECISION.",
    ],

    accentLine: 0,

    description:
      "Authority, necessity, reversibility and blast radius converge before the execution boundary.",

    foot:
      "ALLOW / ASK / BLOCK",

    accent:
      "#88b22a",
  },

  {
    index: "04",
    label: "AUTHORITY",
    meta: "HUMAN DECISION",

    lines: [
      "HUMANS",
      "HOLD",
      "THE GATE.",
    ],

    accentLine: 1,

    description:
      "When autonomous authority ends, execution remains locked until an accountable reviewer decides.",

    foot:
      "ACCOUNTABLE AUTHORIZATION",

    accent:
      "#a9872b",
  },

  {
    index: "05",
    label: "AGENTDNA",
    meta: "CAUSAL FORENSICS",

    lines: [
      "EXPLAIN",
      "THE",
      "CAUSE.",
    ],

    accentLine: 2,

    description:
      "Replay observable evidence, isolate the causal failure and compare the outcome against a safer counterfactual.",

    foot:
      "ROOT CAUSE / 94% CONFIDENCE",

    accent:
      "#7659d8",
  },
] as const;

export default function CairosScrollStory({
  onStart,
  onAgentDNA,
}: CairosScrollStoryProps) {
  const containerRef =
    useRef<HTMLElement | null>(
      null
    );

  const sceneProgressRef =
    useRef(0);

  const activeChapterRef =
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
      const raw =
        value *
        chapters.length;

      sceneProgressRef.current =
        Math.min(
          4,
          Math.max(
            0,
            raw
          )
        );

      const next =
        Math.min(
          chapters.length -
            1,
          Math.max(
            0,
            Math.floor(
              raw
            )
          )
        );

      if (
        next !==
        activeChapterRef.current
      ) {
        activeChapterRef.current =
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

  const skipStory =
    () => {
      document
        .getElementById(
          "after-story"
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
      className="relative"
      style={{
        height:
          "420svh",
      }}
    >
      {/* =====================================
          IMPORTANT

          NO CARD BACKGROUND.
          NO ROUNDED STORY CONTAINER.
          SAME WORLD AS THE REST OF HOME.
      ===================================== */}

      <div className="sticky top-[84px] h-[calc(100svh-84px)] min-h-[600px] overflow-hidden bg-transparent">
        {/* =====================================
            BACKGROUND ATMOSPHERE
        ===================================== */}

        <div
          aria-hidden="true"
          className="editorial-grid pointer-events-none absolute inset-0 opacity-[0.055]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 72% 46%, rgba(255,255,255,.42), transparent 32%), radial-gradient(circle at 77% 52%, rgba(159,200,59,.035), transparent 25%)",
          }}
        />

        {/* =====================================
            3D WORLD
        ===================================== */}

        <CairosCanvas className="opacity-55 sm:opacity-75 lg:opacity-100">
          <CairosIdentityScene
            progressRef={
              sceneProgressRef
            }
          />
        </CairosCanvas>

        {/* =====================================
            LEFT READABILITY

            Same mineral color as global world,
            so it won't look like a white card.
        ===================================== */}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden sm:block"
          style={{
            background:
              "linear-gradient(90deg, rgba(228,232,225,.99) 0%, rgba(228,232,225,.95) 27%, rgba(228,232,225,.62) 43%, rgba(228,232,225,.08) 60%, transparent 71%)",
          }}
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 sm:hidden"
          style={{
            background:
              "linear-gradient(180deg, rgba(228,232,225,.96) 0%, rgba(228,232,225,.86) 62%, rgba(228,232,225,.34) 82%, transparent 100%)",
          }}
        />

        {/* =====================================
            ONE SHARED 1240 GRID

            Same width as sections below.
        ===================================== */}

        <div className="pointer-events-none absolute inset-0 z-30">
          <div className="relative mx-auto h-full w-full max-w-[1240px]">
            {/* TOP */}

            <div className="pointer-events-auto absolute left-0 right-0 top-7 flex items-center justify-between px-1">
              <div className="flex items-center gap-4">
                <CairosMiniMark />

                <span className="text-[8px] font-black tracking-[0.18em] text-black/40">
                  CAIROS TWIN DNA
                </span>

                <span className="hidden h-px w-12 bg-black/12 sm:block" />

                <span className="hidden text-[7px] font-black tracking-[0.14em] text-black/22 md:block">
                  SAFE AUTONOMOUS EXECUTION
                </span>
              </div>

              <button
                type="button"
                onClick={
                  skipStory
                }
                className="group flex min-h-[42px] items-center gap-2 rounded-full border border-black/[0.09] bg-white/25 px-5 text-[7px] font-black tracking-[0.13em] text-black/41 backdrop-blur-lg transition hover:bg-white/50 hover:text-black/65"
              >
                SKIP STORY

                <ArrowDown
                  size={11}
                  className="transition-transform group-hover:translate-y-0.5"
                />
              </button>
            </div>

            {/* RIGHT CHAPTER RAIL */}

            <div className="absolute right-0 top-1/2 hidden -translate-y-1/2 xl:block">
              <div className="space-y-5">
                {chapters.map(
                  (
                    item,
                    index
                  ) => {
                    const active =
                      index ===
                      activeChapter;

                    const complete =
                      index <
                      activeChapter;

                    return (
                      <div
                        key={
                          item.index
                        }
                        className="flex items-center justify-end gap-3"
                      >
                        <span
                          className={`text-[7px] font-black tracking-[0.13em] ${
                            active
                              ? "text-black/62"
                              : complete
                                ? "text-black/30"
                                : "text-black/14"
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
                                ? 34
                                : complete
                                  ? 19
                                  : 10,

                            backgroundColor:
                              active
                                ? item.accent
                                : "rgba(17,19,15,.14)",
                          }}
                          transition={{
                            duration:
                              0.28,
                          }}
                          className="h-px"
                        />
                      </div>
                    );
                  }
                )}
              </div>
            </div>

            {/* BOTTOM */}

            <div className="absolute bottom-6 left-0 right-0">
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

                <span className="text-[7px] font-black tracking-[0.13em] text-black/25">
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
        </div>

        {/* =====================================
            CHAPTER CONTENT

            SAME 1240 GRID.
        ===================================== */}

        <div className="absolute inset-0 z-20 flex items-center">
          <div className="mx-auto w-full max-w-[1240px]">
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
                  y: 24,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -16,
                }}
                transition={{
                  duration:
                    0.34,

                  ease: [
                    0.22,
                    1,
                    0.36,
                    1,
                  ],
                }}
                className="pointer-events-none max-w-[690px]"
              >
                {/* CHAPTER LABEL */}

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
                  className="mt-[clamp(24px,4vh,38px)] font-black leading-[0.82] tracking-[-0.074em] text-[#11130f]"
                  style={{
                    fontSize:
                      "clamp(52px, min(6.4vw, 11.2vh), 108px)",
                  }}
                >
                  {chapter.lines.map(
                    (
                      line,
                      lineIndex
                    ) => (
                      <span
                        key={
                          `${chapter.index}-${line}`
                        }
                        className="block"
                        style={{
                          color:
                            chapter.accentLine ===
                            lineIndex
                              ? chapter.accent
                              : "#11130f",
                        }}
                      >
                        {line}
                      </span>
                    )
                  )}
                </h1>

                {/* COPY */}

                <p className="mt-7 max-w-[520px] text-[12px] leading-7 text-black/44 sm:text-[13px]">
                  {
                    chapter.description
                  }
                </p>

                {/* FOOT */}

                <div className="mt-6 flex items-center gap-3">
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{
                      backgroundColor:
                        chapter.accent,
                    }}
                  />

                  <span className="text-[7px] font-black tracking-[0.15em] text-black/30">
                    {
                      chapter.foot
                    }
                  </span>
                </div>

                {/* FINAL CTA */}

                {activeChapter ===
                  4 && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 8,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    className="pointer-events-auto mt-7 flex flex-wrap gap-2"
                  >
                    <button
                      type="button"
                      onClick={
                        onStart
                      }
                      className="editorial-primary min-h-[52px]"
                    >
                      <Play
                        size={13}
                      />

                      START DEMO

                      <ArrowRight
                        size={13}
                      />
                    </button>

                    <button
                      type="button"
                      onClick={
                        onAgentDNA
                      }
                      className="editorial-secondary min-h-[52px]"
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
      </div>
    </section>
  );
}

function CairosMiniMark() {
  return (
    <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#171a15]">
      <span className="absolute inset-[5px] rounded-full border border-white/[0.1]" />

      <span className="h-2 w-2 rounded-full bg-[#9fc83b]" />
    </div>
  );
}