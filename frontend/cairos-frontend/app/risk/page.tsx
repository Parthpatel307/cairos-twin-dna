"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  Database,
  GitBranch,
  LockKeyhole,
  RotateCcw,
  Server,
  ShieldCheck,
  UserCheck,
  Workflow,
  X,
  type LucideIcon,
} from "lucide-react";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  getDemoSession,
  saveDemoSession,
} from "@/lib/demo-session";

import type {
  Decision,
  RiskLevel,
} from "@/types";

const DISPLAY_FONT =
  "'Arial Narrow', 'Roboto Condensed', Haettenschweiler, Impact, sans-serif";

type RiskStageTone =
  | "red"
  | "gold";

interface RiskStage {
  index: string;
  label: string;
  headline: string[];
  accentLine?: number;
  description: string;
  tone: RiskStageTone;
}

interface RiskView {
  score: number;
  level: RiskLevel;
  decision: Decision;
  blastRadius: number;
  authorized: boolean;
  required: boolean;
  reversible: boolean;
  reason: string;
  affectedSystems: string[];
}

const STAGES: RiskStage[] = [
  {
    index:
      "01",

    label:
      "RISK SCORE",

    headline: [
      "78",
      "HIGH RISK.",
    ],

    accentLine:
      0,

    description:
      "The Twin detected a proposal whose consequence exceeds the safe autonomous threshold.",

    tone:
      "red",
  },

  {
    index:
      "02",

    label:
      "BLAST RADIUS",

    headline: [
      "SEE THE",
      "SYSTEMS",
      "AT RISK.",
    ],

    accentLine:
      1,

    description:
      "CAIROS traces the proposed action across production dependencies before execution authority is considered.",

    tone:
      "red",
  },

  {
    index:
      "03",

    label:
      "REVERSIBILITY",

    headline: [
      "THIS CHANGE",
      "DOES NOT",
      "UNDO CLEANLY.",
    ],

    accentLine:
      1,

    description:
      "The proposed mutation is not safely reversible once downstream production state changes.",

    tone:
      "gold",
  },

  {
    index:
      "04",

    label:
      "AUTHORITY",

    headline: [
      "AUTONOMY",
      "STOPS HERE.",
    ],

    accentLine:
      1,

    description:
      "The agent may propose the change. It does not hold enough authority to make this decision alone.",

    tone:
      "gold",
  },
];

const FALLBACK_SYSTEMS = [
  "API Gateway",
  "Production Database",
  "Deployment Pipeline",
];

export default function RiskPage() {
  const router =
    useRouter();

  const storyRef =
    useRef<HTMLElement | null>(
      null
    );

  const animationFrameRef =
    useRef<number | null>(
      null
    );

  const [
    activeIndex,
    setActiveIndex,
  ] =
    useState(0);

  const [
    storyProgress,
    setStoryProgress,
  ] =
    useState(0);

  const [
    risk,
    setRisk,
  ] =
    useState<RiskView>(
      createFallbackRisk()
    );

  const [
    ready,
    setReady,
  ] =
    useState(false);

  /* ====================================================
     LOAD DEMO / SIMULATION DATA
  ==================================================== */

  useEffect(() => {
    try {
      const raw =
        getDemoSession() as unknown as
          | Record<
              string,
              unknown
            >
          | null;

      const resolved =
        resolveRisk(
          raw
        );

      setRisk(
        resolved
      );

      try {
        saveDemoSession(
          {
            ...(raw ??
              {}),

            riskAnalysis: {
              risk_score:
                resolved.score,

              risk_level:
                resolved.level,

              authorized:
                resolved.authorized,

              required_for_goal:
                resolved.required,

              reversible:
                resolved.reversible,

              affected_systems:
                resolved.affectedSystems,

              decision:
                resolved.decision,

              reason:
                resolved.reason,
            },

            risk: {
              risk_score:
                resolved.score,

              risk_level:
                resolved.level,

              authorized:
                resolved.authorized,

              required_for_goal:
                resolved.required,

              reversible:
                resolved.reversible,

              affected_systems:
                resolved.affectedSystems,

              decision:
                resolved.decision,

              reason:
                resolved.reason,
            },

            riskScore:
              resolved.score,

            blastRadius:
              resolved.blastRadius,

            decision:
              resolved.decision,

            affectedSystems:
              resolved.affectedSystems,

            authorized:
              resolved.authorized,

            requiredForGoal:
              resolved.required,

            reversible:
              resolved.reversible,
          } as never
        );
      } catch {
        // Session persistence must not block UI.
      }
    } catch {
      setRisk(
        createFallbackRisk()
      );
    }

    setReady(
      true
    );
  }, []);

  /* ====================================================
     RELIABLE NATIVE SCROLL TRACKER

     This replaces Framer useScroll target tracking.

     Works from the actual sticky story position inside
     the current AppShell / route layout.
  ==================================================== */

  useEffect(() => {
    if (
      !ready
    ) {
      return;
    }

    const calculate =
      () => {
        animationFrameRef.current =
          null;

        const section =
          storyRef.current;

        if (
          !section
        ) {
          return;
        }

        const rect =
          section.getBoundingClientRect();

        const viewportHeight =
          Math.max(
            1,
            window.innerHeight
          );

        const scrollDistance =
          Math.max(
            1,
            section.offsetHeight -
              viewportHeight
          );

        /*
          rect.top:
            0    => story just reached sticky start
            -x   => user progressed through story
        */

        const travelled =
          clamp(
            -rect.top,
            0,
            scrollDistance
          );

        const progress =
          clamp(
            travelled /
              scrollDistance,
            0,
            1
          );

        setStoryProgress(
          progress
        );

        const nextIndex =
          Math.min(
            STAGES.length -
              1,
            Math.floor(
              progress *
                STAGES.length
            )
          );

        setActiveIndex(
          (
            current
          ) =>
            current ===
            nextIndex
              ? current
              : nextIndex
        );
      };

    const schedule =
      () => {
        if (
          animationFrameRef.current !==
          null
        ) {
          return;
        }

        animationFrameRef.current =
          window.requestAnimationFrame(
            calculate
          );
      };

    calculate();

    window.addEventListener(
      "scroll",
      schedule,
      {
        passive:
          true,
      }
    );

    window.addEventListener(
      "resize",
      schedule
    );

    return () => {
      window.removeEventListener(
        "scroll",
        schedule
      );

      window.removeEventListener(
        "resize",
        schedule
      );

      if (
        animationFrameRef.current !==
        null
      ) {
        window.cancelAnimationFrame(
          animationFrameRef.current
        );
      }
    };
  }, [
    ready,
  ]);

  if (
    !ready
  ) {
    return (
      <main className="min-h-screen bg-[#050705]" />
    );
  }

  const stage =
    STAGES[
      activeIndex
    ];

  const accent =
    stage.tone ===
    "red"
      ? "#cf5650"
      : "#d0a844";

  const goForward =
    () => {
      if (
        risk.decision ===
        "ASK"
      ) {
        router.push(
          "/approvals"
        );

        return;
      }

      if (
        risk.decision ===
        "ALLOW"
      ) {
        router.push(
          "/executions"
        );
      }
    };

  return (
    <main className="relative min-h-screen overflow-x-clip bg-[#050705] text-[#efefe5]">
      {/* =================================================
          SCROLL STORY
      ================================================= */}

      <section
        ref={
          storyRef
        }
        className="relative h-[400svh]"
      >
        <div className="sticky top-0 h-[100svh] p-3 sm:p-5">
          <div className="relative h-full overflow-hidden rounded-[30px] border border-white/[0.075] bg-[#061009]">
            {/* =====================================
                WORLD
            ===================================== */}

            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background: [
                  "linear-gradient(105deg,rgba(3,7,4,.995) 0%,rgba(4,9,5,.98) 48%,rgba(14,19,9,.86) 100%)",

                  `radial-gradient(circle at 76% 45%,${hexToRgba(
                    accent,
                    0.08
                  )},transparent 32%)`,
                ].join(
                  ","
                ),
              }}
            />

            {/* =====================================
                GHOST STAGE VALUE
            ===================================== */}

            <AnimatePresence
              mode="wait"
            >
              {activeIndex <
                3 && (
                <motion.div
                  key={`ghost-${activeIndex}`}
                  initial={{
                    opacity:
                      0,
                  }}
                  animate={{
                    opacity:
                      1,
                  }}
                  exit={{
                    opacity:
                      0,
                  }}
                  transition={{
                    duration:
                      0.45,
                  }}
                  className="pointer-events-none absolute bottom-[4vh] right-[2vw] z-[2] hidden xl:block"
                >
                  <span
                    className="uppercase"
                    style={{
                      fontFamily:
                        DISPLAY_FONT,

                      fontWeight:
                        900,

                      fontSize:
                        activeIndex ===
                        0
                          ? "clamp(250px,35vw,640px)"
                          : "clamp(210px,29vw,520px)",

                      lineHeight:
                        0.65,

                      letterSpacing:
                        "-0.075em",

                      color:
                        hexToRgba(
                          accent,
                          activeIndex ===
                          0
                            ? 0.075
                            : 0.045
                        ),
                    }}
                  >
                    {activeIndex ===
                    0
                      ? risk.score
                      : activeIndex ===
                          1
                        ? String(
                            risk.blastRadius
                          ).padStart(
                            2,
                            "0"
                          )
                        : "NO"}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* =====================================
                RETURN
            ===================================== */}

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/twin"
                )
              }
              className="absolute left-[4.7vw] top-[6vh] z-50 flex items-center gap-3 text-[6px] font-black tracking-[0.13em] text-white/18 transition hover:text-[#cce849]"
            >
              <ArrowLeft
                size={10}
              />

              TWIN
            </button>

            {/* =====================================
                HIGH RISK STATE
            ===================================== */}

            <div className="absolute right-[4.7vw] top-[6vh] z-40 flex items-center gap-3">
              <span
                className="h-[6px] w-[6px] rounded-full"
                style={{
                  backgroundColor:
                    riskLevelColor(
                      risk.level
                    ),
                }}
              />

              <span
                className="text-[6px] font-black tracking-[0.14em]"
                style={{
                  color:
                    riskLevelColor(
                      risk.level
                    ),
                }}
              >
                {
                  risk.level
                }{" "}
                RISK
              </span>
            </div>

            {/* =====================================
                ACTIVE COPY
            ===================================== */}

            <div className="absolute left-[4.7vw] top-[31vh] z-40 w-[min(760px,49vw)]">
              <AnimatePresence
                mode="wait"
                initial={false}
              >
                <motion.div
                  key={
                    stage.index
                  }
                  initial={{
                    opacity:
                      0,

                    y:
                      34,

                    filter:
                      "blur(8px)",
                  }}
                  animate={{
                    opacity:
                      1,

                    y:
                      0,

                    filter:
                      "blur(0px)",
                  }}
                  exit={{
                    opacity:
                      0,

                    y:
                      -26,

                    filter:
                      "blur(6px)",
                  }}
                  transition={{
                    duration:
                      0.52,

                    ease: [
                      0.22,
                      1,
                      0.36,
                      1,
                    ],
                  }}
                >
                  <div className="mb-7 flex items-center gap-5">
                    <span
                      className="text-[6px] font-black tracking-[0.14em]"
                      style={{
                        color:
                          accent,
                      }}
                    >
                      {
                        stage.index
                      }
                    </span>

                    <motion.span
                      key={`line-${stage.index}`}
                      initial={{
                        scaleX:
                          0,
                      }}
                      animate={{
                        scaleX:
                          1,
                      }}
                      transition={{
                        duration:
                          0.45,
                      }}
                      className="h-px w-12 origin-left"
                      style={{
                        backgroundColor:
                          hexToRgba(
                            accent,
                            0.4
                          ),
                      }}
                    />

                    <span className="text-[6px] font-black tracking-[0.13em] text-white/20">
                      {
                        stage.label
                      }
                    </span>
                  </div>

                  <div>
                    {stage.headline.map(
                      (
                        line,
                        index
                      ) => (
                        <motion.p
                          key={`${stage.index}-${index}`}
                          initial={{
                            opacity:
                              0,

                            x:
                              -16,
                          }}
                          animate={{
                            opacity:
                              1,

                            x:
                              0,
                          }}
                          transition={{
                            delay:
                              index *
                              0.055,

                            duration:
                              0.45,
                          }}
                          className="uppercase"
                          style={{
                            fontFamily:
                              DISPLAY_FONT,

                            fontWeight:
                              900,

                            fontSize:
                              stage.index ===
                              "01"
                                ? "clamp(62px,6.5vw,118px)"
                                : "clamp(52px,5.8vw,104px)",

                            lineHeight:
                              0.76,

                            letterSpacing:
                              "-0.061em",

                            color:
                              index ===
                              stage.accentLine
                                ? accent
                                : "#efefe5",
                          }}
                        >
                          {stage.index ===
                            "01" &&
                          index ===
                            0
                            ? risk.score
                            : line}
                        </motion.p>
                      )
                    )}
                  </div>

                  <motion.p
                    key={`description-${stage.index}`}
                    initial={{
                      opacity:
                        0,
                    }}
                    animate={{
                      opacity:
                        1,
                    }}
                    transition={{
                      delay:
                        0.14,

                      duration:
                        0.5,
                    }}
                    className="mt-8 max-w-[570px] text-[9px] leading-6 text-white/34"
                  >
                    {stage.index ===
                    "01"
                      ? `The Twin detected a ${risk.level.toLowerCase()}-risk proposal whose consequence exceeds the safe autonomous threshold.`
                      : stage.description}
                  </motion.p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* =====================================
                RISK MECHANISM
            ===================================== */}

            <div className="absolute bottom-[13vh] right-[4.7vw] top-[19vh] z-30 hidden w-[55%] lg:block">
              <RiskMechanism
                stage={
                  activeIndex
                }
                score={
                  risk.score
                }
                blastRadius={
                  risk.blastRadius
                }
                authorized={
                  risk.authorized
                }
                required={
                  risk.required
                }
                reversible={
                  risk.reversible
                }
                accent={
                  accent
                }
              />
            </div>

            {/* =====================================
                STAGE INDEX
            ===================================== */}

            <div className="absolute bottom-[14vh] right-[4.7vw] z-40 hidden w-[62px] lg:block">
              {STAGES.map(
                (
                  item,
                  index
                ) => (
                  <div
                    key={
                      item.index
                    }
                    className="mb-6 flex items-center justify-between gap-3"
                  >
                    <span
                      className="text-[5px] font-black tracking-[0.1em]"
                      style={{
                        color:
                          index ===
                          activeIndex
                            ? accent
                            : "rgba(255,255,255,.16)",
                      }}
                    >
                      {
                        item.index
                      }
                    </span>

                    <motion.span
                      animate={{
                        width:
                          index ===
                          activeIndex
                            ? 29
                            : 10,
                      }}
                      className="h-px"
                      style={{
                        backgroundColor:
                          index ===
                          activeIndex
                            ? accent
                            : "rgba(255,255,255,.12)",
                      }}
                    />
                  </div>
                )
              )}
            </div>

            {/* =====================================
                EXACT SCROLL PROGRESS
            ===================================== */}

            <div className="absolute bottom-[3.8vh] left-[4.7vw] right-[4.7vw] z-40 flex items-center gap-5">
              <div className="h-px flex-1 overflow-hidden bg-white/[0.07]">
                <motion.div
                  animate={{
                    scaleX:
                      storyProgress,
                  }}
                  transition={{
                    duration:
                      0.08,

                    ease:
                      "linear",
                  }}
                  className="h-full origin-left"
                  style={{
                    backgroundColor:
                      accent,
                  }}
                />
              </div>

              <span className="text-[5px] font-black tracking-[0.12em] text-white/18">
                {String(
                  activeIndex +
                    1
                ).padStart(
                  2,
                  "0"
                )}
                /04
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================
          FINAL BLAST MAP
      ================================================= */}

      <section className="relative px-3 pb-5 sm:px-5">
        <div className="relative mx-auto max-w-[1500px] overflow-hidden rounded-[30px] border border-white/[0.075] bg-[#061009]">
          {/* HEADER */}

          <div className="grid border-b border-white/[0.07] lg:grid-cols-[1.08fr_0.92fr]">
            <div className="px-[4vw] pb-10 pt-14 sm:pt-16">
              <div className="flex items-center gap-4">
                <span className="text-[6px] font-black tracking-[0.15em] text-[#cf5650]">
                  02 / CONSEQUENCE
                </span>

                <span className="h-px w-10 bg-[#cf5650]/30" />
              </div>

              <h2
                className="mt-7 uppercase"
                style={{
                  fontFamily:
                    DISPLAY_FONT,

                  fontWeight:
                    900,

                  fontSize:
                    "clamp(56px,5.9vw,104px)",

                  lineHeight:
                    0.78,

                  letterSpacing:
                    "-0.06em",
                }}
              >
                <span className="block text-[#efefe5]">
                  SEE THE
                </span>

                <span className="block text-[#cf5650]">
                  BLAST RADIUS.
                </span>
              </h2>
            </div>

            <div className="flex items-end px-[4vw] pb-10 pt-10 lg:justify-end">
              <div className="w-full max-w-[360px] border-t border-white/[0.1] pt-5">
                <p className="text-[5px] font-black tracking-[0.15em] text-white/18">
                  SIMULATION RESULT
                </p>

                <p className="mt-3 text-[8px] font-black leading-5 text-white/38">
                  Risk is evaluated before
                  the real-world action is
                  authorized.
                </p>
              </div>
            </div>
          </div>

          {/* MAIN RESULT */}

          <div className="grid min-h-[590px] gap-px bg-white/[0.055] lg:grid-cols-[1.08fr_0.92fr]">
            {/* =================================
                BLAST MAP
            ================================= */}

            <div className="relative overflow-hidden bg-[#deddd2] p-7 text-[#11150f] sm:p-10 lg:p-12">
              <PaperTexture />

              <div className="relative z-10">
                <div className="flex items-start justify-between gap-7">
                  <div>
                    <p className="text-[5px] font-black tracking-[0.15em] text-black/26">
                      AFFECTED SYSTEMS
                    </p>

                    <h3 className="mt-3 text-[20px] font-black tracking-[-0.04em]">
                      Blast map /{" "}
                      {String(
                        risk.blastRadius
                      ).padStart(
                        2,
                        "0"
                      )}
                    </h3>
                  </div>

                  <div className="rounded-full bg-[#11150f] px-5 py-3">
                    <span className="text-[6px] font-black tracking-[0.11em] text-[#cf5650]">
                      {
                        risk.level
                      }{" "}
                      RISK
                    </span>
                  </div>
                </div>

                <div className="relative mt-12">
                  <div className="absolute bottom-[35px] left-[18px] top-[35px] w-px bg-[#c95750]/20" />

                  {risk.affectedSystems.map(
                    (
                      system,
                      index
                    ) => (
                      <AffectedSystem
                        key={`${system}-${index}`}
                        index={
                          index
                        }
                        system={
                          system
                        }
                      />
                    )
                  )}
                </div>

                <div className="mt-10 grid overflow-hidden rounded-[14px] border border-black/13 sm:grid-cols-2">
                  <RiskFact
                    icon={
                      LockKeyhole
                    }
                    label="AUTHORIZED?"
                    value={
                      risk.authorized
                        ? "YES"
                        : "NO"
                    }
                    good={
                      risk.authorized
                    }
                  />

                  <RiskFact
                    icon={
                      ShieldCheck
                    }
                    label="REQUIRED?"
                    value={
                      risk.required
                        ? "YES"
                        : "NO"
                    }
                    good={
                      risk.required
                    }
                  />

                  <RiskFact
                    icon={
                      RotateCcw
                    }
                    label="REVERSIBLE?"
                    value={
                      risk.reversible
                        ? "YES"
                        : "NO"
                    }
                    good={
                      risk.reversible
                    }
                  />

                  <RiskFact
                    icon={
                      GitBranch
                    }
                    label="BLAST RADIUS?"
                    value={String(
                      risk.blastRadius
                    ).padStart(
                      2,
                      "0"
                    )}
                    good={false}
                  />
                </div>
              </div>
            </div>

            {/* =================================
                VERDICT
            ================================= */}

            <div className="relative overflow-hidden bg-[#0a1a0c] p-8 sm:p-10 lg:p-12">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(circle at 78% 22%,rgba(198,162,72,.08),transparent 34%)",
                }}
              />

              <div className="relative z-10 flex h-full flex-col">
                <div className="flex items-center gap-3">
                  <UserCheck
                    size={13}
                    className="text-[#d0a844]"
                  />

                  <span className="text-[6px] font-black tracking-[0.15em] text-white/20">
                    CAIROS VERDICT
                  </span>
                </div>

                <p
                  className="mt-10 uppercase"
                  style={{
                    fontFamily:
                      DISPLAY_FONT,

                    fontWeight:
                      900,

                    fontSize:
                      "clamp(82px,8vw,146px)",

                    lineHeight:
                      0.72,

                    letterSpacing:
                      "-0.065em",

                    color:
                      decisionColor(
                        risk.decision
                      ),
                  }}
                >
                  {
                    risk.decision
                  }
                </p>

                <p className="mt-8 max-w-[560px] text-[9px] leading-6 text-white/34">
                  {
                    risk.reason
                  }
                </p>

                <div className="mt-12 border-t border-white/[0.09] pt-7">
                  <p className="text-[5px] font-black tracking-[0.15em] text-white/18">
                    AUTHORITY BOUNDARY
                  </p>

                  <p
                    className="mt-4 text-[8px] font-black tracking-[0.08em]"
                    style={{
                      color:
                        decisionColor(
                          risk.decision
                        ),
                    }}
                  >
                    {risk.decision ===
                    "ASK"
                      ? "A HUMAN MUST HOLD THE GATE."
                      : risk.decision ===
                          "ALLOW"
                        ? "POLICY AUTHORITY IS SUFFICIENT."
                        : "EXECUTION REMAINS CLOSED."}
                  </p>
                </div>

                <div className="mt-auto pt-12">
                  {risk.decision ===
                  "BLOCK" ? (
                    <div className="flex min-h-[60px] w-full items-center justify-center gap-4 rounded-full border border-[#cf5650]/25 bg-[#cf5650]/[0.05] px-7 text-[8px] font-black tracking-[0.1em] text-[#cf5650]">
                      <X
                        size={13}
                      />

                      EXECUTION BLOCKED
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={
                        goForward
                      }
                      className="group flex min-h-[60px] w-full items-center justify-center gap-4 rounded-full px-7 text-[8px] font-black tracking-[0.1em] text-[#11150f] transition hover:brightness-105"
                      style={{
                        backgroundColor:
                          decisionColor(
                            risk.decision
                          ),
                      }}
                    >
                      {risk.decision ===
                      "ASK" ? (
                        <UserCheck
                          size={13}
                        />
                      ) : (
                        <Check
                          size={13}
                        />
                      )}

                      {risk.decision ===
                      "ASK"
                        ? "OPEN HUMAN AUTHORITY"
                        : "CONTINUE TO EXECUTION"}

                      <ArrowRight
                        size={13}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ======================================================
   RISK MECHANISM
====================================================== */

function RiskMechanism({
  stage,
  score,
  blastRadius,
  authorized,
  required,
  reversible,
  accent,
}: {
  stage: number;
  score: number;
  blastRadius: number;
  authorized: boolean;
  required: boolean;
  reversible: boolean;
  accent: string;
}) {
  return (
    <div className="relative h-full w-full">
      {/* FIELD */}

      <div className="absolute bottom-[12%] left-[5%] right-[2%] top-[7%] border border-white/[0.035]" />

      <div className="absolute bottom-[18%] left-[28%] top-[14%] w-[22%] bg-white/[0.018]" />

      <div className="absolute bottom-[14%] right-[9%] top-[13%] w-[18px] bg-black/52" />

      <div className="absolute bottom-[14%] left-[9%] top-[13%] w-[18px] bg-black/58" />

      {/* AXIS */}

      <motion.div
        animate={{
          backgroundColor:
            hexToRgba(
              accent,
              0.34
            ),
        }}
        className="absolute left-[14%] right-[13%] top-[50%] h-px"
      />

      {/* CENTRAL DIAMOND */}

      <motion.div
        animate={{
          borderColor:
            hexToRgba(
              accent,
              0.18
            ),

          rotate:
            stage >=
            2
              ? 90
              : 45,
        }}
        transition={{
          duration:
            0.65,
        }}
        className="absolute left-[50%] top-[50%] h-[118px] w-[118px] -translate-x-1/2 -translate-y-1/2 border"
      />

      <motion.div
        animate={{
          scale:
            stage ===
            0
              ? 1
              : stage ===
                  1
                ? 0.88
                : 0.74,

          rotate:
            stage >=
            2
              ? 135
              : 45,

          backgroundColor:
            stage <=
            1
              ? "#b44d47"
              : "#c6a248",
        }}
        transition={{
          duration:
            0.6,

          ease: [
            0.22,
            1,
            0.36,
            1,
          ],
        }}
        className="absolute left-[50%] top-[50%] h-[70px] w-[70px] -translate-x-1/2 -translate-y-1/2 shadow-[0_0_45px_rgba(178,75,69,.08)]"
      />

      {/* BLAST PROPAGATION */}

      <AnimatePresence>
        {stage >=
          1 && (
          <>
            <BlastLine
              key="blast-a"
              className="left-[50%] top-[50%] w-[28%] origin-left -rotate-[29deg]"
            />

            <BlastLine
              key="blast-b"
              className="left-[50%] top-[50%] w-[30%] origin-left"
            />

            <BlastLine
              key="blast-c"
              className="left-[50%] top-[50%] w-[26%] origin-left rotate-[31deg]"
            />

            <BlastNode
              key="node-a"
              className="right-[14%] top-[24%]"
            />

            <BlastNode
              key="node-b"
              className="right-[10%] top-[48%]"
            />

            <BlastNode
              key="node-c"
              className="right-[14%] top-[73%]"
            />
          </>
        )}
      </AnimatePresence>

      {/* REVERSIBILITY BARRIER */}

      <AnimatePresence>
        {stage >=
          2 && (
          <motion.div
            initial={{
              opacity:
                0,

              scaleX:
                0,
            }}
            animate={{
              opacity:
                1,

              scaleX:
                1,
            }}
            exit={{
              opacity:
                0,
            }}
            transition={{
              duration:
                0.5,
            }}
            className="absolute left-[28%] top-[73%] h-px w-[36%] origin-left bg-[#c6a248]/50"
          />
        )}
      </AnimatePresence>

      {/* AUTHORITY GATE */}

      <AnimatePresence>
        {stage >=
          3 && (
          <>
            <motion.div
              initial={{
                opacity:
                  0,

                scaleY:
                  0,
              }}
              animate={{
                opacity:
                  1,

                scaleY:
                  1,
              }}
              transition={{
                duration:
                  0.45,
              }}
              className="absolute left-[66%] top-[18%] h-[64%] w-[18px] origin-center bg-black/85"
            />

            <motion.div
              initial={{
                opacity:
                  0,

                scaleY:
                  0,
              }}
              animate={{
                opacity:
                  1,

                scaleY:
                  1,
              }}
              transition={{
                duration:
                  0.45,

                delay:
                  0.06,
              }}
              className="absolute right-[20%] top-[18%] h-[64%] w-[18px] origin-center bg-black/85"
            />

            <motion.div
              initial={{
                opacity:
                  0,

                scale:
                  0.45,

                rotate:
                  0,
              }}
              animate={{
                opacity:
                  1,

                scale:
                  1,

                rotate:
                  45,
              }}
              transition={{
                duration:
                  0.55,

                delay:
                  0.1,
              }}
              className="absolute left-[74%] top-[50%] h-[64px] w-[64px] -translate-x-1/2 -translate-y-1/2 bg-[#c6a248]"
            />
          </>
        )}
      </AnimatePresence>

      {/* MODEL */}

      <div className="absolute bottom-[10%] right-[7%] w-[245px]">
        <p className="text-[5px] font-black tracking-[0.15em] text-white/17">
          RISK MODEL
        </p>

        <RiskModelRow
          label="SCORE"
          value={`${score}`}
          color="#cf5650"
        />

        <RiskModelRow
          label="AUTHORIZED"
          value={
            authorized
              ? "YES"
              : "NO"
          }
          color={
            authorized
              ? "#cce849"
              : "#cf5650"
          }
        />

        <RiskModelRow
          label="REQUIRED"
          value={
            required
              ? "YES"
              : "NO"
          }
          color={
            required
              ? "#cce849"
              : "#cf5650"
          }
        />

        <RiskModelRow
          label="REVERSIBLE"
          value={
            reversible
              ? "YES"
              : "NO"
          }
          color={
            reversible
              ? "#cce849"
              : "#cf5650"
          }
        />

        <RiskModelRow
          label="BLAST"
          value={String(
            blastRadius
          ).padStart(
            2,
            "0"
          )}
          color="#cf5650"
        />
      </div>
    </div>
  );
}

function BlastLine({
  className,
}: {
  className: string;
}) {
  return (
    <motion.div
      initial={{
        scaleX:
          0,

        opacity:
          0,
      }}
      animate={{
        scaleX:
          1,

        opacity:
          1,
      }}
      exit={{
        opacity:
          0,
      }}
      transition={{
        duration:
          0.55,

        ease: [
          0.22,
          1,
          0.36,
          1,
        ],
      }}
      className={`absolute h-px bg-[#c95750]/55 ${className}`}
    />
  );
}

function BlastNode({
  className,
}: {
  className: string;
}) {
  return (
    <motion.div
      initial={{
        opacity:
          0,

        scale:
          0.25,
      }}
      animate={{
        opacity:
          1,

        scale:
          1,
      }}
      exit={{
        opacity:
          0,

        scale:
          0.3,
      }}
      transition={{
        duration:
          0.45,

        delay:
          0.18,
      }}
      className={`absolute h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#df6557] ${className}`}
    />
  );
}

/* ======================================================
   FINAL MAP
====================================================== */

function AffectedSystem({
  index,
  system,
}: {
  index: number;
  system: string;
}) {
  const Icon =
    index ===
    0
      ? Server
      : index ===
          1
        ? Database
        : Workflow;

  return (
    <div className="relative grid grid-cols-[38px_46px_1fr_auto] items-center gap-4 border-b border-black/10 py-6">
      <div className="relative z-10 flex h-[38px] w-[38px] items-center justify-center rounded-full border border-[#c95750]/30 bg-[#deddd2]">
        <span className="h-[7px] w-[7px] rounded-full bg-[#c95750]" />
      </div>

      <div className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-[#11150f]">
        <Icon
          size={15}
          className="text-[#d55b54]"
        />
      </div>

      <div>
        <p className="text-[5px] font-black tracking-[0.13em] text-black/24">
          SYSTEM{" "}
          {String(
            index +
              1
          ).padStart(
            2,
            "0"
          )}
        </p>

        <p className="mt-2 text-[10px] font-black">
          {
            system
          }
        </p>
      </div>

      <span className="text-[5px] font-black tracking-[0.11em] text-[#bd4e48]">
        EXPOSED
      </span>
    </div>
  );
}

function RiskFact({
  icon: Icon,
  label,
  value,
  good,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  good: boolean;
}) {
  return (
    <div className="flex min-h-[66px] items-center justify-between gap-5 border-b border-r border-black/10 px-5 py-4 even:border-r-0 [&:nth-last-child(-n+2)]:border-b-0">
      <div className="flex items-center gap-3">
        <Icon
          size={11}
          className={
            good
              ? "text-[#718b21]"
              : "text-[#c95750]"
          }
        />

        <span className="text-[5px] font-black tracking-[0.12em] text-black/28">
          {label}
        </span>
      </div>

      <span
        className={`text-[6px] font-black tracking-[0.1em] ${
          good
            ? "text-[#66801d]"
            : "text-[#bd4e48]"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function RiskModelRow({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between gap-5 border-t border-white/[0.07] py-3">
      <span className="text-[5px] font-black tracking-[0.12em] text-white/18">
        {label}
      </span>

      <span
        className="text-[5px] font-black tracking-[0.1em]"
        style={{
          color,
        }}
      >
        {value}
      </span>
    </div>
  );
}

function PaperTexture() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 opacity-[0.2]"
      style={{
        backgroundImage: [
          "radial-gradient(circle,rgba(24,36,22,.18) .55px,transparent .8px)",
          "linear-gradient(rgba(28,42,26,.06) 1px,transparent 1px)",
          "linear-gradient(90deg,rgba(28,42,26,.06) 1px,transparent 1px)",
        ].join(
          ","
        ),

        backgroundSize:
          "18px 18px,72px 72px,72px 72px",
      }}
    />
  );
}

/* ======================================================
   DATA
====================================================== */

function createFallbackRisk(): RiskView {
  return {
    score:
      78,

    level:
      "HIGH",

    decision:
      "ASK",

    blastRadius:
      3,

    authorized:
      false,

    required:
      true,

    reversible:
      false,

    reason:
      "The action touches production systems and has a non-trivial downstream blast radius. Human confirmation is required.",

    affectedSystems:
      FALLBACK_SYSTEMS,
  };
}

function resolveRisk(
  raw:
    | Record<
        string,
        unknown
      >
    | null
): RiskView {
  const fallback =
    createFallbackRisk();

  if (!raw) {
    return fallback;
  }

  const simulation =
    asRecord(
      raw.simulation
    ) ??
    asRecord(
      raw.result
    );

  const riskRecord =
    asRecord(
      raw.riskAnalysis
    ) ??
    asRecord(
      raw.risk
    );

  const score =
    readNumber(
      riskRecord?.risk_score,
      readNumber(
        simulation?.risk_score,
        readNumber(
          raw.riskScore,
          fallback.score
        )
      )
    );

  const blastRadius =
    Math.max(
      0,
      Math.round(
        readNumber(
          raw.blastRadius,
          readNumber(
            simulation?.blast_radius,
            fallback.blastRadius
          )
        )
      )
    );

  const level =
    readRiskLevel(
      riskRecord?.risk_level,
      readRiskLevel(
        simulation?.risk_level,
        deriveRiskLevel(
          score
        )
      )
    );

  const decision =
    readDecision(
      riskRecord?.decision,
      readDecision(
        simulation?.decision,
        readDecision(
          raw.decision,
          fallback.decision
        )
      )
    );

  const systems =
    readStringArray(
      riskRecord?.affected_systems
    );

  const reason =
    readString(
      riskRecord?.reason,
      readString(
        simulation?.reason,
        fallback.reason
      )
    );

  return {
    score,

    level,

    decision,

    blastRadius:
      blastRadius ||
      fallback.blastRadius,

    authorized:
      readBoolean(
        riskRecord?.authorized,
        fallback.authorized
      ),

    required:
      readBoolean(
        riskRecord?.required_for_goal,
        fallback.required
      ),

    reversible:
      readBoolean(
        riskRecord?.reversible,
        fallback.reversible
      ),

    reason,

    affectedSystems:
      systems.length >
      0
        ? systems
        : FALLBACK_SYSTEMS,
  };
}

/* ======================================================
   HELPERS
====================================================== */

function asRecord(
  value:
    unknown
) {
  if (
    typeof value ===
      "object" &&
    value !==
      null &&
    !Array.isArray(
      value
    )
  ) {
    return value as Record<
      string,
      unknown
    >;
  }

  return null;
}

function readNumber(
  value:
    unknown,

  fallback:
    number
) {
  const number =
    typeof value ===
    "number"
      ? value
      : typeof value ===
          "string"
        ? Number(
            value
          )
        : NaN;

  return Number.isFinite(
    number
  )
    ? number
    : fallback;
}

function readBoolean(
  value:
    unknown,

  fallback:
    boolean
) {
  return typeof value ===
    "boolean"
    ? value
    : fallback;
}

function readString(
  value:
    unknown,

  fallback:
    string
) {
  return typeof value ===
      "string" &&
    value.trim()
    ? value
    : fallback;
}

function readStringArray(
  value:
    unknown
) {
  if (
    !Array.isArray(
      value
    )
  ) {
    return [];
  }

  return value.filter(
    (
      item
    ): item is string =>
      typeof item ===
        "string" &&
      item.trim().length >
        0
  );
}

function readDecision(
  value:
    unknown,

  fallback:
    Decision
): Decision {
  if (
    value ===
      "ALLOW" ||
    value ===
      "ASK" ||
    value ===
      "BLOCK"
  ) {
    return value;
  }

  return fallback;
}

function readRiskLevel(
  value:
    unknown,

  fallback:
    RiskLevel
): RiskLevel {
  if (
    value ===
      "LOW" ||
    value ===
      "MEDIUM" ||
    value ===
      "HIGH" ||
    value ===
      "CRITICAL"
  ) {
    return value;
  }

  return fallback;
}

function deriveRiskLevel(
  score:
    number
): RiskLevel {
  if (
    score >=
    80
  ) {
    return "CRITICAL";
  }

  if (
    score >=
    50
  ) {
    return "HIGH";
  }

  if (
    score >=
    25
  ) {
    return "MEDIUM";
  }

  return "LOW";
}

function riskLevelColor(
  level:
    RiskLevel
) {
  if (
    level ===
      "CRITICAL" ||
    level ===
      "HIGH"
  ) {
    return "#cf5650";
  }

  if (
    level ===
    "MEDIUM"
  ) {
    return "#d0a844";
  }

  return "#cce849";
}

function decisionColor(
  decision:
    Decision
) {
  if (
    decision ===
    "ALLOW"
  ) {
    return "#cce849";
  }

  if (
    decision ===
    "ASK"
  ) {
    return "#d0a844";
  }

  return "#cf5650";
}

function hexToRgba(
  hex:
    string,

  alpha:
    number
) {
  const clean =
    hex.replace(
      "#",
      ""
    );

  const r =
    parseInt(
      clean.slice(
        0,
        2
      ),
      16
    );

  const g =
    parseInt(
      clean.slice(
        2,
        4
      ),
      16
    );

  const b =
    parseInt(
      clean.slice(
        4,
        6
      ),
      16
    );

  return `rgba(${r},${g},${b},${alpha})`;
}

function clamp(
  value:
    number,

  min:
    number,

  max:
    number
) {
  return Math.min(
    max,
    Math.max(
      min,
      value
    )
  );
}