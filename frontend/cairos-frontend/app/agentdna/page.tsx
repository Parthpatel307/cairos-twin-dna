"use client";

import {
  useEffect,
  useMemo,
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
  Clock3,
  Database,
  Eye,
  FileWarning,
  Fingerprint,
  GitBranch,
  Pause,
  Play,
  RotateCcw,
  ServerCrash,
  ShieldCheck,
  Sparkles,
  Trash2,
  TriangleAlert,
  UserCheck,
  type LucideIcon,
} from "lucide-react";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  Line,
} from "@react-three/drei";

import {
  useFrame,
  useThree,
} from "@react-three/fiber";

import * as THREE from "three";

import CairosDarkCanvas from "@/components/three/CairosDarkCanvas";

import {
  getDemoSession,
} from "@/lib/demo-session";

const DISPLAY_FONT =
  "'Arial Narrow', 'Roboto Condensed', Haettenschweiler, Impact, sans-serif";

type EvidenceStatus =
  | "SUCCESS"
  | "WARNING"
  | "ROOT_CAUSE"
  | "FAILED";

interface EvidenceEvent {
  id: number;

  title: string;

  description: string;

  evidence: string;

  status: EvidenceStatus;

  timestamp: string;

  icon: LucideIcon;
}

const EVENTS: EvidenceEvent[] = [
  {
    id: 1,

    title:
      "User Intent",

    description:
      "The user requested production cleanup.",

    evidence:
      "Clean unused files from production server",

    status:
      "SUCCESS",

    timestamp:
      "14:32:01.184",

    icon:
      Fingerprint,
  },

  {
    id: 2,

    title:
      "Agent Planning",

    description:
      "The agent proposed discovery, classification and deletion steps.",

    evidence:
      "Plan: enumerate -> classify -> delete -> verify",

    status:
      "SUCCESS",

    timestamp:
      "14:32:01.629",

    icon:
      GitBranch,
  },

  {
    id: 3,

    title:
      "File Classification",

    description:
      "A production dependency was classified as unused with incomplete dependency evidence.",

    evidence:
      "18 candidates returned; one dependency path was unresolved.",

    status:
      "ROOT_CAUSE",

    timestamp:
      "14:32:03.411",

    icon:
      FileWarning,
  },

  {
    id: 4,

    title:
      "Human Approval",

    description:
      "The reviewer approved the action using the evidence available at review time.",

    evidence:
      "Authority lease: APPROVED",

    status:
      "SUCCESS",

    timestamp:
      "14:32:05.066",

    icon:
      UserCheck,
  },

  {
    id: 5,

    title:
      "Delete Operation",

    description:
      "The approved production mutation removed all 18 classified files.",

    evidence:
      "18 delete mutations committed",

    status:
      "SUCCESS",

    timestamp:
      "14:32:06.907",

    icon:
      Trash2,
  },

  {
    id: 6,

    title:
      "Production Failure",

    description:
      "A downstream dependency failed after the deletion reached production.",

    evidence:
      "Service dependency unavailable after mutation",

    status:
      "FAILED",

    timestamp:
      "14:32:07.691",

    icon:
      ServerCrash,
  },
];

const ROOT_CAUSE_INDEX =
  2;

const CONFIDENCE =
  94;

export default function AgentDNAPage() {
  const router =
    useRouter();

  const timerRef =
    useRef<
      ReturnType<
        typeof setTimeout
      > | null
    >(null);

  const [
    executionId,
    setExecutionId,
  ] =
    useState(
      "exec-demo-001"
    );

  const [
    request,
    setRequest,
  ] =
    useState(
      "Clean unused files from production server"
    );

  const [
    currentStep,
    setCurrentStep,
  ] =
    useState(-1);

  const [
    replaying,
    setReplaying,
  ] =
    useState(false);

  const [
    completed,
    setCompleted,
  ] =
    useState(false);

  useEffect(() => {
    try {
      const session =
        getDemoSession();

      if (!session) {
        return;
      }

      const root =
        session as unknown as Record<
          string,
          unknown
        >;

      const simulation =
        asRecord(
          root.simulation ??
            root.result ??
            {}
        );

      setExecutionId(
        stringValue(
          root.executionId ??
            root.execution_id,

          "exec-demo-001"
        )
      );

      setRequest(
        stringValue(
          root.request ??
            root.action ??
            simulation.request,

          "Clean unused files from production server"
        )
      );
    } catch {
      // Demo evidence remains available.
    }
  }, []);

  /*
    Replay clock.

    Root-cause step intentionally holds longer,
    making the causal break visually explicit.
  */

  useEffect(() => {
    if (
      !replaying ||
      currentStep <
        0
    ) {
      return;
    }

    if (
      currentStep >=
      EVENTS.length -
        1
    ) {
      timerRef.current =
        setTimeout(
          () => {
            setCompleted(
              true
            );

            setReplaying(
              false
            );
          },
          900
        );

      return () => {
        if (
          timerRef.current
        ) {
          clearTimeout(
            timerRef.current
          );
        }
      };
    }

    const delay =
      currentStep ===
      ROOT_CAUSE_INDEX
        ? 1750
        : 820;

    timerRef.current =
      setTimeout(
        () => {
          setCurrentStep(
            (
              previous
            ) =>
              Math.min(
                previous +
                  1,
                EVENTS.length -
                  1
              )
          );
        },
        delay
      );

    return () => {
      if (
        timerRef.current
      ) {
        clearTimeout(
          timerRef.current
        );
      }
    };
  }, [
    currentStep,
    replaying,
  ]);

  useEffect(() => {
    return () => {
      if (
        timerRef.current
      ) {
        clearTimeout(
          timerRef.current
        );
      }
    };
  }, []);

  const activeEvent =
    currentStep >=
    0
      ? EVENTS[
          currentStep
        ]
      : null;

  const progress =
    currentStep <
    0
      ? 0
      : (
          currentStep +
          1
        ) /
        EVENTS.length;

  const headline =
    useMemo(
      () => {
        if (
          completed
        ) {
          return {
            a:
              "THE FAILURE",

            b:
              "STARTED",

            c:
              "EARLIER.",
          };
        }

        if (
          currentStep ===
          ROOT_CAUSE_INDEX
        ) {
          return {
            a:
              "THIS IS",

            b:
              "THE CAUSAL",

            c:
              "BREAK.",
          };
        }

        if (
          currentStep >=
          EVENTS.length -
            1
        ) {
          return {
            a:
              "THE SYMPTOM",

            b:
              "IS NOT",

            c:
              "THE CAUSE.",
          };
        }

        return {
          a:
            "REPLAY",

          b:
            "WHAT",

          c:
            "HAPPENED.",
        };
      },
      [
        currentStep,
        completed,
      ]
    );

  const startReplay =
    () => {
      if (
        completed ||
        currentStep >=
          EVENTS.length -
            1
      ) {
        setCompleted(
          false
        );

        setCurrentStep(
          0
        );

        setReplaying(
          true
        );

        return;
      }

      if (
        currentStep <
        0
      ) {
        setCurrentStep(
          0
        );
      }

      setReplaying(
        true
      );
    };

  const pauseReplay =
    () => {
      setReplaying(
        false
      );
    };

  const replayAgain =
    () => {
      setCompleted(
        false
      );

      setCurrentStep(
        0
      );

      setReplaying(
        true
      );
    };

  const selectStep =
    (
      index: number
    ) => {
      setReplaying(
        false
      );

      setCurrentStep(
        index
      );

      setCompleted(
        index ===
          EVENTS.length -
            1
      );
    };

  return (
    <main className="relative min-h-screen overflow-x-clip bg-[#050705] text-[#efefe5]">
      {/* =====================================
          CAUSAL REPLAY HERO
      ===================================== */}

      <section className="relative p-3 sm:p-5">
        <div className="relative min-h-[760px] overflow-hidden rounded-[30px] border border-white/[0.09] bg-[#08070c] lg:min-h-[calc(100svh-110px)]">
          {/* =================================
              WORLD
          ================================= */}

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background: [
                "linear-gradient(90deg,rgba(4,4,6,.995) 0%,rgba(5,5,7,.95) 31%,rgba(12,8,20,.45) 60%,rgba(20,12,35,.66) 100%)",
                "radial-gradient(circle at 76% 28%,rgba(128,98,220,.18),transparent 28%)",
                currentStep >=
                EVENTS.length -
                  1
                  ? "radial-gradient(circle at 81% 70%,rgba(186,70,63,.17),transparent 38%)"
                  : "radial-gradient(circle at 81% 70%,rgba(91,65,157,.16),transparent 38%)",
              ].join(","),
            }}
          />

          {/* =================================
              CROPPED BRAND TYPE
          ================================= */}

          <div className="pointer-events-none absolute inset-x-0 bottom-[-4vw] z-[5] overflow-hidden">
            <p
              className="whitespace-nowrap text-center uppercase"
              style={{
                fontFamily:
                  DISPLAY_FONT,

                fontWeight:
                  900,

                fontSize:
                  "clamp(118px,17vw,300px)",

                lineHeight:
                  0.67,

                letterSpacing:
                  "-0.066em",

                color:
                  "rgba(128,98,220,.075)",
              }}
            >
              AGENTDNA
            </p>
          </div>

          {/* =================================
              3D CAUSAL GRAPH
          ================================= */}

          <div className="pointer-events-none absolute inset-0 z-10 opacity-65 sm:opacity-82 lg:opacity-100">
            <CairosDarkCanvas>
              <AgentDNAScene
                activeStep={
                  currentStep
                }
                completed={
                  completed
                }
              />
            </CairosDarkCanvas>
          </div>

          {/* =================================
              READABILITY
          ================================= */}

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-20"
            style={{
              background:
                "linear-gradient(90deg,rgba(4,4,6,.995) 0%,rgba(4,4,6,.96) 29%,rgba(4,4,6,.59) 46%,rgba(4,4,6,.08) 65%,transparent 79%)",
            }}
          />

          {/* =================================
              TOP
          ================================= */}

          <div className="absolute left-[4.5vw] right-[4.5vw] top-[6vh] z-50 flex items-center justify-between gap-6">
            <button
              type="button"
              onClick={() =>
                router.push(
                  "/executions"
                )
              }
              className="flex items-center gap-3 text-[7px] font-black tracking-[0.14em] text-white/31 transition hover:text-[#8d6be7]"
            >
              <ArrowLeft
                size={12}
              />

              BACK TO EXECUTION
            </button>

            <div className="flex items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-[#8062dc]" />

              <span className="text-[6px] font-black tracking-[0.15em] text-[#9d80ee]">
                OBSERVABLE TRACE
              </span>
            </div>
          </div>

          {/* =================================
              HEADLINE
          ================================= */}

          <div className="absolute left-[4.5vw] top-[11vh] z-40 w-[min(760px,50vw)]">
            <div className="flex items-center gap-4">
              <span className="text-[7px] font-black tracking-[0.18em] text-[#8d6be7]">
                AGENTDNA
              </span>

              <span className="h-px w-10 bg-[#8062dc]/30" />

              <span className="text-[7px] font-black tracking-[0.14em] text-white/22">
                CAUSAL REPLAY
              </span>
            </div>

            <AnimatePresence
              mode="wait"
              initial={false}
            >
              <motion.div
                key={`${headline.a}-${headline.c}`}
                initial={{
                  opacity:
                    0,

                  y:
                    18,
                }}
                animate={{
                  opacity:
                    1,

                  y:
                    0,
                }}
                exit={{
                  opacity:
                    0,

                  y:
                    -12,
                }}
                transition={{
                  duration:
                    0.32,
                }}
              >
                <h1
                  className="mt-5 uppercase"
                  style={{
                    fontFamily:
                      DISPLAY_FONT,

                    fontWeight:
                      900,

                    fontSize:
                      "clamp(42px,3.65vw,66px)",

                    lineHeight:
                      0.82,

                    letterSpacing:
                      "-0.056em",
                  }}
                >
                  <span className="block whitespace-nowrap">
                    {
                      headline.a
                    }
                  </span>

                  <span
                    className="block whitespace-nowrap"
                    style={{
                      color:
                        currentStep >=
                        EVENTS.length -
                          1
                          ? "#c95852"
                          : "#8062dc",
                    }}
                  >
                    {
                      headline.b
                    }{" "}
                    {
                      headline.c
                    }
                  </span>
                </h1>

                <p className="sr-only">
                  AgentDNA follows the observable execution path from intent to failure, isolates the causal break and tests what would have happened under a safer decision.
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* =================================
              CONFIDENCE
          ================================= */}

          <div className="absolute right-[4.5vw] top-[14vh] z-50 hidden w-[250px] xl:block">
            <p className="text-[6px] font-black tracking-[0.16em] text-white/20">
              ROOT CAUSE CONFIDENCE
            </p>

            <div className="mt-5 flex items-end gap-3">
              <span
                style={{
                  fontFamily:
                    DISPLAY_FONT,

                  fontWeight:
                    900,

                  fontSize:
                    "72px",

                  lineHeight:
                    0.7,

                  letterSpacing:
                    "-0.055em",

                  color:
                    completed ||
                    currentStep >=
                      ROOT_CAUSE_INDEX
                      ? "#8062dc"
                      : "rgba(255,255,255,.13)",
                }}
              >
                {completed ||
                currentStep >=
                  ROOT_CAUSE_INDEX
                  ? CONFIDENCE
                  : "--"}
              </span>

              <span className="pb-1 text-[8px] font-black text-white/25">
                %
              </span>
            </div>

            <div className="mt-5 h-px overflow-hidden bg-white/[0.08]">
              <motion.div
                animate={{
                  scaleX:
                    completed ||
                    currentStep >=
                      ROOT_CAUSE_INDEX
                      ? CONFIDENCE /
                        100
                      : 0,
                }}
                transition={{
                  duration:
                    0.65,
                }}
                className="h-full origin-left bg-[#8062dc]"
              />
            </div>

            <p className="mt-4 text-[7px] font-black leading-4 tracking-[0.07em] text-white/24">
              FILE CLASSIFICATION
              <br />
              STEP 03
            </p>
          </div>

          {/* =================================
              REPLAY CONTROL DOCKET
          ================================= */}

          <div className="absolute bottom-[2vh] left-[4.5vw] z-50 w-[min(680px,91vw)]">
            <motion.div
              initial={{
                opacity:
                  0,

                y:
                  26,
              }}
              animate={{
                opacity:
                  1,

                y:
                  0,
              }}
              transition={{
                duration:
                  0.45,

                ease: [
                  0.22,
                  1,
                  0.36,
                  1,
                ],
              }}
              className="overflow-hidden rounded-[18px] bg-[#e1dfd4] text-[#11150f] shadow-[0_32px_110px_rgba(0,0,0,.52)]"
            >
              {/* HEADER */}

              <div className="flex items-center justify-between gap-6 border-b border-black/12 px-6 py-4">
                <div>
                  <p className="text-[6px] font-black tracking-[0.16em] text-black/38">
                    AGENTDNA / CAUSAL REPLAY
                  </p>

                  <p className="mt-1 font-mono text-[6px] font-bold tracking-[0.08em] text-[#684bc2]">
                    {
                      executionId
                    }
                  </p>
                </div>

                <div className="rounded-[5px] bg-[#11150f] px-3 py-2">
                  <span className="text-[6px] font-black tracking-[0.12em] text-[#9677e8]">
                    {completed
                      ? "ROOT CAUSE"
                      : replaying
                        ? "REPLAYING"
                        : "READY"}
                  </span>
                </div>
              </div>

              {/* ACTIVE EVIDENCE */}

              <div className="px-6 py-5 sm:px-8">
                <p className="text-[6px] font-black tracking-[0.14em] text-black/24">
                  ORIGINAL INTENT
                </p>

                <p className="mt-2 text-[12px] font-black leading-5">
                  {
                    request
                  }
                </p>

                <div className="mt-5 border-y border-black/10 py-4">
                  {activeEvent ? (
                    <AnimatePresence
                      mode="wait"
                    >
                      <motion.div
                        key={
                          activeEvent.id
                        }
                        initial={{
                          opacity:
                            0,

                          x:
                            8,
                        }}
                        animate={{
                          opacity:
                            1,

                          x:
                            0,
                        }}
                        exit={{
                          opacity:
                            0,

                          x:
                            -6,
                        }}
                        className="grid grid-cols-[36px_1fr_auto] gap-4"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#11150f]">
                          <activeEvent.icon
                            size={13}
                            style={{
                              color:
                                statusColor(
                                  activeEvent.status
                                ),
                            }}
                          />
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-3">
                            <p className="text-[10px] font-black">
                              {
                                activeEvent.title
                              }
                            </p>

                            <span
                              className="text-[5px] font-black tracking-[0.11em]"
                              style={{
                                color:
                                  statusColor(
                                    activeEvent.status
                                  ),
                              }}
                            >
                              {
                                activeEvent.status
                              }
                            </span>
                          </div>

                          <p className="mt-1 text-[8px] leading-4 text-black/42">
                            {
                              activeEvent.description
                            }
                          </p>
                        </div>

                        <p className="font-mono text-[6px] text-black/24">
                          {
                            activeEvent.timestamp
                          }
                        </p>
                      </motion.div>
                    </AnimatePresence>
                  ) : (
                    <div className="flex items-center gap-4 py-1">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#11150f]">
                        <Fingerprint
                          size={13}
                          className="text-[#8062dc]"
                        />
                      </div>

                      <div>
                        <p className="text-[10px] font-black">
                          Replay ready
                        </p>

                        <p className="mt-1 text-[8px] text-black/38">
                          Start the causal
                          replay to inspect
                          observable evidence.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* PROGRESS */}

                <div className="mt-5 flex items-center gap-4">
                  <div className="h-[3px] flex-1 overflow-hidden rounded-full bg-black/10">
                    <motion.div
                      animate={{
                        scaleX:
                          progress,
                      }}
                      transition={{
                        duration:
                          0.3,
                      }}
                      className="h-full origin-left bg-[#8062dc]"
                    />
                  </div>

                  <span className="text-[6px] font-black tracking-[0.11em] text-black/30">
                    {Math.max(
                      0,
                      currentStep +
                        1
                    )}
                    /06
                  </span>
                </div>
              </div>

              {/* CONTROLS */}

              <div className="grid gap-2 border-t border-black/11 p-3 sm:grid-cols-[1fr_auto]">
                {replaying ? (
                  <button
                    type="button"
                    onClick={
                      pauseReplay
                    }
                    className="group flex min-h-[56px] items-center justify-center gap-4 rounded-full bg-[#11150f] px-7 text-[8px] font-black tracking-[0.1em] text-white transition hover:bg-[#19151f]"
                  >
                    <Pause
                      size={13}
                      className="text-[#9677e8]"
                    />

                    PAUSE REPLAY
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={
                      completed
                        ? replayAgain
                        : startReplay
                    }
                    className="group flex min-h-[56px] items-center justify-center gap-4 rounded-full bg-[#11150f] px-7 text-[8px] font-black tracking-[0.1em] text-white transition hover:bg-[#19151f]"
                  >
                    {completed ? (
                      <RotateCcw
                        size={13}
                        className="text-[#9677e8]"
                      />
                    ) : (
                      <Play
                        size={13}
                        className="text-[#9677e8]"
                      />
                    )}

                    {completed
                      ? "REPLAY AGAIN"
                      : currentStep >=
                          0
                        ? "CONTINUE REPLAY"
                        : "START CAUSAL REPLAY"}
                  </button>
                )}

                <div className="flex min-h-[56px] items-center justify-center gap-3 rounded-full border border-black/12 px-5">
                  <Eye
                    size={12}
                    className="text-[#684bc2]"
                  />

                  <span className="text-[6px] font-black tracking-[0.09em] text-black/40">
                    OBSERVABLE EVIDENCE
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* =================================
              ACTIVE SIGNAL — RIGHT LOWER
          ================================= */}

          <div className="absolute bottom-[17vh] right-[4.5vw] z-50 hidden w-[260px] xl:block">
            <div className="border-t border-white/[0.09] pt-4">
              <p className="text-[6px] font-black tracking-[0.15em] text-white/20">
                CURRENT FINDING
              </p>

              <p
                className="mt-3 text-[9px] font-black leading-5 tracking-[0.04em]"
                style={{
                  color:
                    currentStep ===
                    ROOT_CAUSE_INDEX
                      ? "#9677e8"
                      : currentStep >=
                          EVENTS.length -
                            1
                        ? "#c95852"
                        : "#efefe5",
                }}
              >
                {currentStep ===
                ROOT_CAUSE_INDEX
                  ? "DEPENDENCY EVIDENCE WAS INCOMPLETE BEFORE THE DELETE WAS APPROVED."
                  : currentStep >=
                      EVENTS.length -
                        1
                    ? "THE FAILURE BECAME VISIBLE HERE. IT DID NOT BEGIN HERE."
                    : "FOLLOW THE OBSERVABLE CAUSAL PATH."}
              </p>
            </div>
          </div>

          {/* FOOT */}

          <div className="pointer-events-none absolute bottom-5 left-8 right-8 z-[55] flex items-center gap-4">
            <span className="h-px flex-1 bg-[#8062dc]/20" />

            <span className="text-[6px] font-black tracking-[0.16em] text-white/17">
              STEP 05 / AGENTDNA
            </span>
          </div>
        </div>
      </section>

      {/* =====================================
          EVIDENCE TIMELINE
      ===================================== */}

      <section className="relative p-3 pt-0 sm:p-5 sm:pt-0">
        <div className="mx-auto max-w-[1480px] overflow-hidden rounded-[30px] border border-white/[0.09] bg-[#09080d]">
          {/* HEADER */}

          <div className="grid gap-8 border-b border-white/[0.08] px-8 py-9 sm:px-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div>
              <div className="flex items-center gap-4">
                <span className="text-[7px] font-black tracking-[0.17em] text-[#8062dc]">
                  CAUSAL TIMELINE
                </span>

                <span className="h-px w-10 bg-[#8062dc]/30" />
              </div>

              <h2
                className="mt-5 uppercase"
                style={{
                  fontFamily:
                    DISPLAY_FONT,

                  fontWeight:
                    900,

                  fontSize:
                    "clamp(42px,4.35vw,76px)",

                  lineHeight:
                    0.82,

                  letterSpacing:
                    "-0.052em",
                }}
              >
                <span className="block whitespace-nowrap text-[#efefe5]">
                  SYMPTOM
                </span>

                <span className="block whitespace-nowrap text-[#8062dc]">
                  IS NOT ROOT CAUSE.
                </span>
              </h2>
            </div>

            <div className="w-full max-w-[430px] border-t border-white/[0.09] pt-5 lg:justify-self-end">
              <p className="text-[6px] font-black tracking-[0.15em] text-white/20">
                AGENTDNA SCOPE
              </p>

              <p className="mt-2 text-[9px] leading-5 text-white/34">
                Model inputs/outputs,
                tool and system
                responses, retrieved
                evidence, state changes,
                actions, timestamps and
                outcomes. Private
                chain-of-thought is not
                captured or displayed.
              </p>
            </div>
          </div>

          {/* =================================
              TIMELINE + ROOT CAUSE
          ================================= */}

          <div className="grid gap-px bg-white/[0.06] lg:grid-cols-[1.08fr_0.92fr]">
            {/* PAPER TRACE */}

            <div className="relative overflow-hidden bg-[#deddd2] p-7 text-[#11150f] sm:p-10">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-[0.2]"
                style={{
                  backgroundImage:
                    [
                      "radial-gradient(circle,rgba(18,22,26,.18) .6px,transparent .8px)",
                      "linear-gradient(rgba(32,25,48,.07) 1px,transparent 1px)",
                      "linear-gradient(90deg,rgba(32,25,48,.07) 1px,transparent 1px)",
                    ].join(","),

                  backgroundSize:
                    "19px 19px,76px 76px,76px 76px",
                }}
              />

              <div className="relative">
                <div className="flex items-center justify-between gap-6">
                  <div>
                    <p className="text-[6px] font-black tracking-[0.15em] text-black/30">
                      BLACK BOX TRACE
                    </p>

                    <p className="mt-2 font-mono text-[8px] font-bold text-black/52">
                      {
                        executionId
                      }
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={
                      replayAgain
                    }
                    className="flex items-center gap-2 rounded-full border border-black/12 px-4 py-2 text-[6px] font-black tracking-[0.1em] text-black/38 transition hover:bg-black/[0.04] hover:text-black/70"
                  >
                    <RotateCcw
                      size={10}
                    />

                    REPLAY
                  </button>
                </div>

                <div className="mt-8 border-t border-black/12">
                  {EVENTS.map(
                    (
                      event,
                      index
                    ) => (
                      <TimelineRow
                        key={
                          event.id
                        }
                        event={
                          event
                        }
                        index={
                          index
                        }
                        active={
                          index ===
                          currentStep
                        }
                        visited={
                          index <=
                          currentStep
                        }
                        onClick={() =>
                          selectStep(
                            index
                          )
                        }
                      />
                    )
                  )}
                </div>
              </div>
            </div>

            {/* =================================
                ROOT CAUSE PANEL
            ================================= */}

            <div className="relative overflow-hidden bg-[#0c0913] p-8 sm:p-12">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(circle at 80% 20%,rgba(128,98,220,.16),transparent 35%)",
                }}
              />

              <div className="relative">
                <Fingerprint
                  size={19}
                  className="text-[#8062dc]"
                />

                <p className="mt-7 text-[7px] font-black tracking-[0.16em] text-white/20">
                  ROOT CAUSE
                </p>

                <p
                  className="mt-5 uppercase text-[#8062dc]"
                  style={{
                    fontFamily:
                      DISPLAY_FONT,

                    fontWeight:
                      900,

                    fontSize:
                      "clamp(44px,4.5vw,76px)",

                    lineHeight:
                      0.78,

                    letterSpacing:
                      "-0.055em",
                  }}
                >
                  STEP 03.
                </p>

                <h3 className="mt-6 text-[18px] font-black tracking-[-0.03em] text-white/75">
                  File classification
                </h3>

                <p className="mt-4 max-w-[470px] text-[10px] leading-6 text-white/39">
                  The delete operation
                  behaved as approved. The
                  causal break happened
                  earlier, when a production
                  dependency was marked
                  unused despite incomplete
                  dependency evidence.
                </p>

                <div className="mt-9 grid grid-cols-2 gap-px overflow-hidden rounded-[12px] bg-white/[0.07]">
                  <EvidenceMetric
                    label="CONFIDENCE"
                    value="94%"
                    color="#9677e8"
                  />

                  <EvidenceMetric
                    label="CAUSAL STEP"
                    value="03 / 06"
                    color="#9677e8"
                  />

                  <EvidenceMetric
                    label="VISIBLE FAILURE"
                    value="06 / 06"
                    color="#c95852"
                  />

                  <EvidenceMetric
                    label="TRACE"
                    value="OBSERVED"
                    color="#cce849"
                  />
                </div>

                <div className="mt-9 border-t border-white/[0.09] pt-6">
                  <div className="flex items-center gap-3">
                    <TriangleAlert
                      size={13}
                      className="text-[#c95852]"
                    />

                    <span className="text-[6px] font-black tracking-[0.14em] text-white/22">
                      CAUSAL FINDING
                    </span>
                  </div>

                  <p className="mt-3 text-[9px] font-black leading-5 tracking-[0.04em] text-[#a98df0]">
                    THE APPROVAL RELIED ON
                    A CLASSIFICATION THAT
                    DID NOT HAVE COMPLETE
                    DEPENDENCY EVIDENCE.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================
          COUNTERFACTUAL
      ===================================== */}

      <section className="relative p-3 pt-0 sm:p-5 sm:pt-0">
        <div className="mx-auto max-w-[1480px] overflow-hidden rounded-[30px] border border-white/[0.09] bg-[#07110a]">
          {/* =====================================
              COUNTERFACTUAL HEADER
          ===================================== */}

          <div className="grid gap-8 border-b border-white/[0.08] px-8 py-9 sm:px-12 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <div className="flex items-center gap-4">
                <span className="text-[7px] font-black tracking-[0.17em] text-[#8062dc]">
                  COUNTERFACTUAL TEST
                </span>

                <span className="h-px w-10 bg-[#8062dc]/30" />
              </div>

              <h2
                className="mt-5 uppercase"
                style={{
                  fontFamily:
                    DISPLAY_FONT,

                  fontWeight:
                    900,

                  fontSize:
                    "clamp(42px,4.2vw,74px)",

                  lineHeight:
                    0.82,

                  letterSpacing:
                    "-0.052em",
                }}
              >
                <span className="block text-[#efefe5]">
                  CHANGE THE DECISION.
                </span>

                <span className="block text-[#8062dc]">
                  CHANGE THE OUTCOME.
                </span>
              </h2>
            </div>

            <div className="max-w-[380px] border-t border-white/[0.09] pt-4">
              <p className="text-[6px] font-black tracking-[0.15em] text-white/20">
                CAUSAL QUESTION
              </p>

              <p className="mt-3 text-[9px] leading-5 text-white/34">
                What would have happened if CAIROS required complete dependency evidence before authorizing the destructive action?
              </p>
            </div>
          </div>

          {/* =====================================
              OBSERVED VS COUNTERFACTUAL
          ===================================== */}

          <div className="grid gap-px bg-white/[0.06] lg:grid-cols-2">
            {/* =================================
                OBSERVED REALITY
            ================================= */}

            <div className="relative min-h-[520px] overflow-hidden bg-[#130b0b] p-8 sm:p-12">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(circle at 78% 18%,rgba(201,88,82,.12),transparent 34%)",
                }}
              />

              <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-[-48px] right-[-10px]"
              >
                <span
                  className="uppercase"
                  style={{
                    fontFamily:
                      DISPLAY_FONT,

                    fontWeight:
                      900,

                    fontSize:
                      "clamp(150px,15vw,260px)",

                    lineHeight:
                      0.7,

                    letterSpacing:
                      "-0.07em",

                    color:
                      "rgba(201,88,82,.035)",
                  }}
                >
                  01
                </span>
              </div>

              <div className="relative z-10">
                <div className="flex items-center justify-between gap-5">
                  <div className="flex items-center gap-3">
                    <ServerCrash
                      size={16}
                      className="text-[#c95852]"
                    />

                    <span className="text-[6px] font-black tracking-[0.15em] text-white/22">
                      OBSERVED REALITY
                    </span>
                  </div>

                  <div className="rounded-full border border-[#c95852]/18 bg-[#c95852]/[0.05] px-4 py-2">
                    <span className="text-[5px] font-black tracking-[0.11em] text-[#c95852]">
                      PATH OBSERVED
                    </span>
                  </div>
                </div>

                <h3
                  className="mt-8 uppercase text-[#c95852]"
                  style={{
                    fontFamily:
                      DISPLAY_FONT,

                    fontWeight:
                      900,

                    fontSize:
                      "clamp(42px,4.25vw,72px)",

                    lineHeight:
                      0.81,

                    letterSpacing:
                      "-0.055em",
                  }}
                >
                  <span className="block whitespace-nowrap">
                    DELETE.
                  </span>

                  <span className="block whitespace-nowrap">
                    THEN FAIL.
                  </span>
                </h3>

                <p className="mt-6 max-w-[470px] text-[9px] leading-5 text-white/32">
                  The action was authorized after an incomplete dependency classification. The mutation succeeded, but production failed downstream.
                </p>

                <div className="mt-8 border-t border-white/[0.09] pt-5">
                  <ComparisonStep
                    icon={
                      FileWarning
                    }
                    label="CLASSIFICATION"
                    value="18 UNUSED"
                    color="#c6a248"
                  />

                  <ComparisonStep
                    icon={
                      Trash2
                    }
                    label="MUTATION"
                    value="18 DELETED"
                    color="#cce849"
                  />

                  <ComparisonStep
                    icon={
                      ServerCrash
                    }
                    label="RESULT"
                    value="PRODUCTION FAILURE"
                    color="#c95852"
                  />
                </div>

                <div className="mt-7 border-l border-[#c95852]/28 pl-4">
                  <p className="text-[5px] font-black tracking-[0.14em] text-white/18">
                    CAUSAL BREAK
                  </p>

                  <p className="mt-2 text-[7px] font-black leading-5 tracking-[0.06em] text-[#c95852]/80">
                    INCOMPLETE DEPENDENCY EVIDENCE WAS TREATED AS ENOUGH EVIDENCE TO DELETE.
                  </p>
                </div>
              </div>
            </div>

            {/* =================================
                SAFER COUNTERFACTUAL
            ================================= */}

            <div className="relative min-h-[520px] overflow-hidden bg-[#09150b] p-8 sm:p-12">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(circle at 78% 18%,rgba(204,232,73,.10),transparent 34%)",
                }}
              />

              <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-[-48px] right-[-10px]"
              >
                <span
                  className="uppercase"
                  style={{
                    fontFamily:
                      DISPLAY_FONT,

                    fontWeight:
                      900,

                    fontSize:
                      "clamp(150px,15vw,260px)",

                    lineHeight:
                      0.7,

                    letterSpacing:
                      "-0.07em",

                    color:
                      "rgba(204,232,73,.025)",
                  }}
                >
                  02
                </span>
              </div>

              <div className="relative z-10">
                <div className="flex items-center justify-between gap-5">
                  <div className="flex items-center gap-3">
                    <Sparkles
                      size={16}
                      className="text-[#cce849]"
                    />

                    <span className="text-[6px] font-black tracking-[0.15em] text-white/22">
                      COUNTERFACTUAL
                    </span>
                  </div>

                  <div className="rounded-full border border-[#cce849]/18 bg-[#cce849]/[0.04] px-4 py-2">
                    <span className="text-[5px] font-black tracking-[0.11em] text-[#cce849]">
                      SAFER PATH
                    </span>
                  </div>
                </div>

                <h3
                  className="mt-8 uppercase text-[#cce849]"
                  style={{
                    fontFamily:
                      DISPLAY_FONT,

                    fontWeight:
                      900,

                    fontSize:
                      "clamp(42px,4.25vw,72px)",

                    lineHeight:
                      0.81,

                    letterSpacing:
                      "-0.055em",
                  }}
                >
                  <span className="block whitespace-nowrap">
                    VERIFY.
                  </span>

                  <span className="block whitespace-nowrap">
                    THEN STOP.
                  </span>
                </h3>

                <p className="mt-6 max-w-[470px] text-[9px] leading-5 text-white/32">
                  With stronger evidence requirements, CAIROS detects the unresolved dependency and closes the execution gate before deletion reaches production.
                </p>

                <div className="mt-8 border-t border-white/[0.09] pt-5">
                  <ComparisonStep
                    icon={
                      Database
                    }
                    label="DEPENDENCY CHECK"
                    value="INCOMPLETE"
                    color="#c6a248"
                  />

                  <ComparisonStep
                    icon={
                      ShieldCheck
                    }
                    label="CAIROS GATE"
                    value="BLOCK DELETE"
                    color="#cce849"
                  />

                  <ComparisonStep
                    icon={
                      Check
                    }
                    label="RESULT"
                    value="PRODUCTION HEALTHY"
                    color="#cce849"
                  />
                </div>

                <div className="mt-7 rounded-[14px] border border-[#cce849]/14 bg-[#cce849]/[0.035] p-5">
                  <div className="flex items-center gap-3">
                    <ShieldCheck
                      size={12}
                      className="text-[#cce849]"
                    />

                    <p className="text-[6px] font-black tracking-[0.14em] text-[#cce849]/78">
                      SAFER POLICY
                    </p>
                  </div>

                  <p className="mt-3 max-w-[520px] text-[9px] leading-5 text-white/39">
                    Require complete dependency evidence before destructive production cleanup can receive execution authority.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* =====================================
              FINAL PRINCIPLE
          ===================================== */}

          <div className="grid gap-8 border-t border-white/[0.08] px-8 py-8 sm:px-12 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-[6px] font-black tracking-[0.16em] text-[#8062dc]">
                AGENTDNA / FINAL PRINCIPLE
              </p>

              <p
                className="mt-3 max-w-[760px] uppercase"
                style={{
                  fontFamily:
                    DISPLAY_FONT,

                  fontWeight:
                    900,

                  fontSize:
                    "clamp(24px,2.15vw,38px)",

                  lineHeight:
                    0.93,

                  letterSpacing:
                    "-0.035em",

                  color:
                    "#efefe5",
                }}
              >
                EXPLAIN THE CAUSE.

                <span className="text-[#8062dc]">
                  {" "}CHANGE THE POLICY.
                </span>

                <span className="text-[#cce849]">
                  {" "}BREAK THE PATH.
                </span>
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/"
                )
              }
              className="group flex min-h-[54px] items-center justify-center gap-3 rounded-full border border-white/[0.11] bg-white/[0.015] px-8 text-[7px] font-black tracking-[0.1em] text-white/48 transition hover:border-[#8062dc]/35 hover:bg-[#8062dc]/[0.05] hover:text-[#b29cf2]"
            >
              <RotateCcw
                size={12}
              />

              RESTART CAIROS STORY

              <ArrowRight
                size={11}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ======================================================
   3D CAUSAL GRAPH
====================================================== */

function AgentDNAScene({
  activeStep,
  completed,
}: {
  activeStep:
    number;

  completed:
    boolean;
}) {
  const root =
    useRef<THREE.Group | null>(
      null
    );

  const cursor =
    useRef<THREE.Mesh | null>(
      null
    );

  const rootCause =
    useRef<THREE.Mesh | null>(
      null
    );

  const failure =
    useRef<THREE.Mesh | null>(
      null
    );

  const counterfactual =
    useRef<THREE.Group | null>(
      null
    );

  const width =
    useThree(
      (
        scene
      ) =>
        scene.size.width
    );

  const mobile =
    width <
    760;

  const compact =
    width >=
      760 &&
    width <
      1180;

  const baseX =
    mobile
      ? 0.85
      : compact
        ? 1.45
        : 2.05;

  const baseScale =
    mobile
      ? 0.55
      : compact
        ? 0.78
        : 0.94;

  const nodes = [
    new THREE.Vector3(
      -2.75,
      0.8,
      0.1
    ),

    new THREE.Vector3(
      -1.65,
      0.35,
      0.18
    ),

    new THREE.Vector3(
      -0.52,
      0,
      0.52
    ),

    new THREE.Vector3(
      0.62,
      0.18,
      0.28
    ),

    new THREE.Vector3(
      1.62,
      -0.25,
      0.2
    ),

    new THREE.Vector3(
      2.78,
      -0.65,
      0.12
    ),
  ];

  useFrame(
    (
      scene,
      delta
    ) => {
      const time =
        scene.clock
          .elapsedTime;

      if (
        root.current
      ) {
        root.current.position.x =
          THREE.MathUtils.lerp(
            root.current.position.x,
            baseX,
            Math.min(
              1,
              delta * 4
            )
          );

        root.current.position.y =
          Math.sin(
            time *
              0.25
          ) *
          0.02;

        root.current.scale.setScalar(
          THREE.MathUtils.lerp(
            root.current.scale.x,
            baseScale,
            Math.min(
              1,
              delta * 4
            )
          )
        );
      }

      if (
        cursor.current
      ) {
        cursor.current.visible =
          activeStep >=
          0;

        if (
          activeStep >=
            0
        ) {
          const target =
            nodes[
              Math.min(
                activeStep,
                nodes.length -
                  1
              )
            ];

          cursor.current.position.lerp(
            target,
            Math.min(
              1,
              delta * 4.5
            )
          );

          cursor.current.rotation.x +=
            delta *
            0.5;

          cursor.current.rotation.y +=
            delta *
            0.8;
        }
      }

      if (
        rootCause.current
      ) {
        const active =
          activeStep >=
          ROOT_CAUSE_INDEX;

        const targetScale =
          active
            ? 1.16 +
              Math.sin(
                time *
                  2
              ) *
                0.07
            : 0.76;

        rootCause.current.scale.setScalar(
          THREE.MathUtils.lerp(
            rootCause.current
              .scale.x,
            targetScale,
            Math.min(
              1,
              delta * 4
            )
          )
        );
      }

      if (
        failure.current
      ) {
        const targetScale =
          activeStep >=
          EVENTS.length -
            1
            ? 1.18
            : 0.7;

        failure.current.scale.setScalar(
          THREE.MathUtils.lerp(
            failure.current
              .scale.x,
            targetScale,
            Math.min(
              1,
              delta * 4
            )
          )
        );
      }

      if (
        counterfactual.current
      ) {
        const target =
          completed
            ? 1
            : 0.04;

        const scale =
          THREE.MathUtils.lerp(
            counterfactual.current
              .scale.x,
            target,
            Math.min(
              1,
              delta * 3.8
            )
          );

        counterfactual.current.scale.setScalar(
          scale
        );

        counterfactual.current.visible =
          scale >
          0.06;
      }
    }
  );

  return (
    <group
      ref={root}
      position={[
        baseX,
        0,
        0,
      ]}
      scale={
        baseScale
      }
    >
      {/* BACK STRUCTURE */}

      <group
        position={[
          0,
          0,
          -1,
        ]}
      >
        <DNAArchitecture
          x={-3}
          height={3.65}
        />

        <DNAArchitecture
          x={3}
          height={3.85}
        />

        <Line
          points={[
            [
              -3.45,
              1.72,
              0,
            ],
            [
              3.45,
              1.72,
              0,
            ],
          ]}
          color="#65528e"
          transparent
          opacity={0.09}
          lineWidth={1}
        />

        <Line
          points={[
            [
              -3.45,
              -1.72,
              0,
            ],
            [
              3.45,
              -1.72,
              0,
            ],
          ]}
          color="#65528e"
          transparent
          opacity={0.12}
          lineWidth={1}
        />
      </group>

      {/* MAIN CAUSAL PATH */}

      <Line
        points={
          nodes
        }
        color="#8062dc"
        transparent
        opacity={0.24}
        lineWidth={1}
      />

      {nodes.map(
        (
          node,
          index
        ) => {
          const isRoot =
            index ===
            ROOT_CAUSE_INDEX;

          const isFailure =
            index ===
            EVENTS.length -
              1;

          const visited =
            index <=
            activeStep;

          return (
            <group
              key={
                index
              }
              position={
                node
              }
            >
              <mesh
                ref={
                  isRoot
                    ? rootCause
                    : isFailure
                      ? failure
                      : undefined
                }
                scale={
                  isRoot ||
                  isFailure
                    ? 0.76
                    : 1
                }
              >
                <octahedronGeometry
                  args={[
                    isRoot
                      ? 0.23
                      : isFailure
                        ? 0.2
                        : 0.13,
                    1,
                  ]}
                />

                <meshStandardMaterial
                  color={
                    isRoot
                      ? "#8062dc"
                      : isFailure
                        ? "#c95852"
                        : visited
                          ? "#9b83df"
                          : "#25212d"
                  }
                  emissive={
                    isRoot
                      ? "#8062dc"
                      : isFailure
                        ? "#c95852"
                        : visited
                          ? "#8062dc"
                          : "#000000"
                  }
                  emissiveIntensity={
                    visited ||
                    isRoot
                      ? 0.55
                      : 0
                  }
                  metalness={0.62}
                  roughness={0.16}
                />
              </mesh>

              <mesh
                position={[
                  0,
                  -0.38,
                  -0.05,
                ]}
              >
                <boxGeometry
                  args={[
                    0.025,
                    0.42,
                    0.025,
                  ]}
                />

                <meshBasicMaterial
                  color={
                    isRoot
                      ? "#8062dc"
                      : isFailure
                        ? "#c95852"
                        : "#6d5a96"
                  }
                  transparent
                  opacity={
                    visited
                      ? 0.35
                      : 0.08
                  }
                />
              </mesh>
            </group>
          );
        }
      )}

      {/* REPLAY CURSOR */}

      <mesh
        ref={cursor}
        visible={false}
      >
        <octahedronGeometry
          args={[
            0.105,
            1,
          ]}
        />

        <meshStandardMaterial
          color="#e0d7ff"
          emissive="#8062dc"
          emissiveIntensity={0.85}
          metalness={0.46}
          roughness={0.12}
        />
      </mesh>

      {/* ROOT CAUSE BRANCHES */}

      <Line
        points={[
          [
            -0.52,
            0,
            0.52,
          ],
          [
            -0.1,
            1.08,
            0.1,
          ],
        ]}
        color="#8062dc"
        transparent
        opacity={
          activeStep >=
          ROOT_CAUSE_INDEX
            ? 0.45
            : 0.06
        }
        lineWidth={1}
      />

      <mesh
        position={[
          -0.1,
          1.08,
          0.1,
        ]}
      >
        <sphereGeometry
          args={[
            0.08,
            18,
            18,
          ]}
        />

        <meshStandardMaterial
          color="#8062dc"
          emissive="#8062dc"
          emissiveIntensity={0.52}
        />
      </mesh>

      {/* COUNTERFACTUAL */}

      <group
        ref={
          counterfactual
        }
        visible={false}
        scale={0.04}
      >
        <Line
          points={[
            [
              -0.52,
              0,
              0.52,
            ],
            [
              0.3,
              1.05,
              0.2,
            ],
            [
              1.45,
              1.22,
              0.15,
            ],
            [
              2.65,
              0.98,
              0.1,
            ],
          ]}
          color="#cce849"
          transparent
          opacity={0.6}
          lineWidth={1}
          dashed
          dashSize={0.09}
          gapSize={0.07}
        />

        <mesh
          position={[
            2.65,
            0.98,
            0.1,
          ]}
        >
          <octahedronGeometry
            args={[
              0.16,
              1,
            ]}
          />

          <meshStandardMaterial
            color="#cce849"
            emissive="#cce849"
            emissiveIntensity={0.68}
          />
        </mesh>
      </group>

      {/* FLOOR */}

      <mesh
        position={[
          0,
          -1.65,
          -0.04,
        ]}
      >
        <boxGeometry
          args={[
            6.2,
            0.035,
            0.05,
          ]}
        />

        <meshBasicMaterial
          color="#66518f"
          transparent
          opacity={0.3}
        />
      </mesh>
    </group>
  );
}

function DNAArchitecture({
  x,
  height,
}: {
  x:
    number;

  height:
    number;
}) {
  return (
    <mesh
      position={[
        x,
        0,
        0,
      ]}
    >
      <boxGeometry
        args={[
          0.32,
          height,
          0.14,
        ]}
      />

      <meshStandardMaterial
        color="#100d16"
        metalness={0.44}
        roughness={0.46}
        transparent
        opacity={0.47}
      />
    </mesh>
  );
}

/* ======================================================
   TIMELINE
====================================================== */

function TimelineRow({
  event,
  index,
  active,
  visited,
  onClick,
}: {
  event:
    EvidenceEvent;

  index:
    number;

  active:
    boolean;

  visited:
    boolean;

  onClick:
    () => void;
}) {
  const Icon =
    event.icon;

  const color =
    statusColor(
      event.status
    );

  return (
    <button
      type="button"
      onClick={
        onClick
      }
      className={`relative grid w-full grid-cols-[42px_1fr_auto] gap-4 border-b border-black/10 py-5 text-left transition ${
        active
          ? "bg-black/[0.035]"
          : "hover:bg-black/[0.02]"
      }`}
    >
      <div className="relative">
        {index <
          EVENTS.length -
            1 && (
          <span
            className="absolute left-[17px] top-[35px] h-[42px] w-px"
            style={{
              backgroundColor:
                visited
                  ? `${color}55`
                  : "rgba(0,0,0,.1)",
            }}
          />
        )}

        <span
          className="relative flex h-9 w-9 items-center justify-center rounded-full border bg-[#deddd2]"
          style={{
            borderColor:
              active ||
              visited
                ? `${color}60`
                : "rgba(17,21,15,.12)",
          }}
        >
          <Icon
            size={13}
            style={{
              color:
                visited ||
                active
                  ? color
                  : "rgba(17,21,15,.25)",
            }}
          />
        </span>
      </div>

      <div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[6px] font-black tracking-[0.11em] text-black/25">
            {String(
              event.id
            ).padStart(
              2,
              "0"
            )}
          </span>

          <p className="text-[10px] font-black">
            {
              event.title
            }
          </p>

          <span
            className="text-[5px] font-black tracking-[0.11em]"
            style={{
              color,
            }}
          >
            {
              event.status
            }
          </span>
        </div>

        <p className="mt-2 text-[8px] leading-5 text-black/40">
          {
            event.description
          }
        </p>

        <div className="mt-2 flex items-center gap-2">
          <Eye
            size={9}
            className="text-black/25"
          />

          <p className="font-mono text-[6px] leading-4 text-black/33">
            {
              event.evidence
            }
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <Clock3
          size={9}
          className="text-black/20"
        />

        <span className="font-mono text-[6px] text-black/24">
          {
            event.timestamp
          }
        </span>
      </div>
    </button>
  );
}

/* ======================================================
   UI HELPERS
====================================================== */

function EvidenceMetric({
  label,
  value,
  color,
}: {
  label:
    string;

  value:
    string;

  color:
    string;
}) {
  return (
    <div className="bg-[#0c0913] p-5">
      <p className="text-[5px] font-black tracking-[0.13em] text-white/18">
        {label}
      </p>

      <p
        className="mt-3 text-[10px] font-black tracking-[0.04em]"
        style={{
          color,
        }}
      >
        {value}
      </p>
    </div>
  );
}

function ComparisonStep({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon:
    LucideIcon;

  label:
    string;

  value:
    string;

  color:
    string;
}) {
  return (
    <div className="flex items-center justify-between gap-5 border-b border-white/[0.07] py-4">
      <div className="flex items-center gap-3">
        <Icon
          size={12}
          style={{
            color,
          }}
        />

        <span className="text-[6px] font-black tracking-[0.12em] text-white/21">
          {label}
        </span>
      </div>

      <span
        className="text-[7px] font-black tracking-[0.08em]"
        style={{
          color,
        }}
      >
        {value}
      </span>
    </div>
  );
}

function statusColor(
  status:
    EvidenceStatus
) {
  if (
    status ===
    "FAILED"
  ) {
    return "#c95852";
  }

  if (
    status ===
    "ROOT_CAUSE"
  ) {
    return "#8062dc";
  }

  if (
    status ===
    "WARNING"
  ) {
    return "#a5832b";
  }

  return "#718c23";
}

/* ======================================================
   DATA
====================================================== */

function asRecord(
  value:
    unknown
): Record<
  string,
  unknown
> {
  if (
    typeof value ===
      "object" &&
    value !== null &&
    !Array.isArray(
      value
    )
  ) {
    return value as Record<
      string,
      unknown
    >;
  }

  return {};
}

function stringValue(
  value:
    unknown,

  fallback:
    string
) {
  return typeof value ===
      "string" &&
    value.trim().length >
      0
    ? value
    : fallback;
}