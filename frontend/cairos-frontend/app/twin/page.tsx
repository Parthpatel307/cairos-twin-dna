"use client";

import {
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  ArrowRight,
  Bot,
  Check,
  CircleAlert,
  Gauge,
  Play,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import CairosDarkCanvas from "@/components/three/CairosDarkCanvas";
import TwinCinematicScene from "@/components/three/TwinCinematicScene";

import {
  getDemoSession,
  saveDemoSession,
} from "@/lib/demo-session";

import {
  runSimulation,
} from "@/lib/api";

import type {
  Decision,
  SimulationResult,
} from "@/types";

const QUICK_REQUEST_KEY =
  "cairos_quick_request";

const DISPLAY_FONT =
  "'Arial Narrow', 'Roboto Condensed', Haettenschweiler, Impact, sans-serif";

type TwinPhase =
  | "READY"
  | "PLANNING"
  | "SIMULATING"
  | "ANALYZING"
  | "COMPLETE";

interface PhaseDefinition {
  phase: TwinPhase;
  label: string;
  description: string;
}

const PHASES: PhaseDefinition[] = [
  {
    phase: "READY",
    label: "READY",
    description: "Awaiting agent intent",
  },
  {
    phase: "PLANNING",
    label: "PLAN",
    description: "Building proposed action",
  },
  {
    phase: "SIMULATING",
    label: "TWIN",
    description: "Running isolated consequence",
  },
  {
    phase: "ANALYZING",
    label: "RISK",
    description: "Mapping blast radius",
  },
  {
    phase: "COMPLETE",
    label: "VERDICT",
    description: "Applying CAIROS authority",
  },
];

export default function TwinPage() {
  const router =
    useRouter();

  const mountedRef =
    useRef(true);

  const [
    request,
    setRequest,
  ] =
    useState(
      "Clean unused files from production server"
    );

  const [
    phase,
    setPhase,
  ] =
    useState<TwinPhase>(
      "READY"
    );

  const [
    result,
    setResult,
  ] =
    useState<SimulationResult | null>(
      null
    );

  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null
    );

  const [
    running,
    setRunning,
  ] =
    useState(false);

  useEffect(() => {
    mountedRef.current =
      true;

    try {
      const quickRequest =
        window.localStorage.getItem(
          QUICK_REQUEST_KEY
        );

      if (
        quickRequest?.trim()
      ) {
        setRequest(
          quickRequest.trim()
        );
      }
    } catch {
      // Local storage is optional.
    }

    return () => {
      mountedRef.current =
        false;
    };
  }, []);

  const runTwin =
    async (
      event?:
        FormEvent<HTMLFormElement>
    ) => {
      event?.preventDefault();

      const cleanRequest =
        request.trim();

      if (
        !cleanRequest ||
        running
      ) {
        return;
      }

      setError(
        null
      );

      setResult(
        null
      );

      setRunning(
        true
      );

      setPhase(
        "PLANNING"
      );

      try {
        await wait(
          620
        );

        if (
          !mountedRef.current
        ) {
          return;
        }

        setPhase(
          "SIMULATING"
        );

        const simulationPromise =
          runSimulation(
            cleanRequest
          );

        await wait(
          850
        );

        if (
          !mountedRef.current
        ) {
          return;
        }

        setPhase(
          "ANALYZING"
        );

        const simulation =
          await simulationPromise;

        if (
          !mountedRef.current
        ) {
          return;
        }

        await wait(
          650
        );

        if (
          !mountedRef.current
        ) {
          return;
        }

        setResult(
          simulation
        );

        setPhase(
          "COMPLETE"
        );

        try {
          const current =
            getDemoSession();

          saveDemoSession(
            {
              ...(current ??
                {}),

              request:
                cleanRequest,

              simulation,

              result:
                simulation,

              simulationId:
                simulation.simulation_id,

              simulation_id:
                simulation.simulation_id,

              decision:
                simulation.decision,

              riskScore:
                simulation.risk_score,

              blastRadius:
                simulation.blast_radius,

              simulationStatus:
                "COMPLETE",

              simulationCompletedAt:
                new Date().toISOString(),
            } as never
          );
        } catch {
          /*
            Demo session persistence should never
            block the visible simulation result.
          */
        }
      } catch (
        caught
      ) {
        if (
          !mountedRef.current
        ) {
          return;
        }

        setPhase(
          "READY"
        );

        setError(
          caught instanceof
            Error
            ? caught.message
            : "The Twin could not complete this simulation."
        );
      } finally {
        if (
          mountedRef.current
        ) {
          setRunning(
            false
          );
        }
      }
    };

  const resetTwin =
    () => {
      if (
        running
      ) {
        return;
      }

      setResult(
        null
      );

      setError(
        null
      );

      setPhase(
        "READY"
      );
    };

  const viewRisk =
    () => {
      if (
        !result
      ) {
        return;
      }

      router.push(
        "/risk"
      );
    };

  const decision =
    result?.decision ??
    null;

  const activePhaseIndex =
    phaseIndex(
      phase
    );

  return (
    <main className="relative min-h-screen overflow-x-clip bg-[#050705] text-[#efefe5]">
      <section className="relative p-3 sm:p-5">
        <div className="relative mx-auto min-h-[calc(100svh-110px)] max-w-[1500px] overflow-hidden rounded-[30px] border border-white/[0.08] bg-[#061009]">
          {/* =====================================
              WORLD
          ===================================== */}

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0"
            style={{
              background:
                [
                  "linear-gradient(90deg,rgba(3,7,4,.995) 0%,rgba(4,8,4,.96) 39%,rgba(5,20,9,.58) 66%,rgba(6,28,13,.72) 100%)",
                  "radial-gradient(circle at 72% 34%,rgba(119,148,48,.12),transparent 27%)",

                  decision ===
                  "BLOCK"
                    ? "radial-gradient(circle at 77% 70%,rgba(185,67,59,.13),transparent 36%)"

                    : decision ===
                      "ASK"

                      ? "radial-gradient(circle at 77% 70%,rgba(198,162,72,.11),transparent 36%)"

                      : "radial-gradient(circle at 77% 70%,rgba(31,76,36,.16),transparent 36%)",
                ].join(
                  ","
                ),
            }}
          />

          {/* =====================================
              GIANT WORD
          ===================================== */}

          <div className="pointer-events-none absolute inset-x-0 bottom-[-5vw] z-[2] overflow-hidden">
            <p
              className="whitespace-nowrap text-center uppercase"
              style={{
                fontFamily:
                  DISPLAY_FONT,

                fontWeight:
                  900,

                fontSize:
                  "clamp(120px,17vw,300px)",

                lineHeight:
                  0.67,

                letterSpacing:
                  "-0.07em",

                color:
                  result
                    ? decisionColor(
                        result.decision,
                        0.07
                      )
                    : "rgba(185,211,61,.055)",
              }}
            >
              TWIN
            </p>
          </div>

          {/* =====================================
              TECH ARCHITECTURE
          ===================================== */}

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-[3]"
          >
            <div className="absolute bottom-[13%] left-[45%] top-[13%] w-px bg-white/[0.02]" />

            <div className="absolute bottom-[13%] right-[10%] top-[12%] w-px bg-[#cce849]/[0.035]" />

            <div className="absolute bottom-[18%] left-[43%] right-[8%] border-t border-[#a3be45]/[0.06]" />

            <div className="absolute right-[8%] top-[19%] h-[56%] w-[43%] border border-[#a9c343]/[0.035]" />
          </div>

          {/* =====================================
              MACHINE

              Full canvas, but machine itself is
              positioned on the right by the scene.
          ===================================== */}

          <div className="pointer-events-none absolute inset-0 z-10">
            <CairosDarkCanvas>
              <TwinCinematicScene
                phase={
                  phase
                }
                decision={
                  decision
                }
                riskScore={
                  result?.risk_score ??
                  0
                }
              />
            </CairosDarkCanvas>
          </div>

          {/* =====================================
              LEFT READABILITY
          ===================================== */}

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-20"
            style={{
              background:
                "linear-gradient(90deg,rgba(3,7,4,.99) 0%,rgba(3,7,4,.93) 31%,rgba(3,7,4,.42) 46%,rgba(3,7,4,.07) 59%,transparent 70%)",
            }}
          />

          {/* =====================================
              CHAPTER
          ===================================== */}

          <div className="absolute left-[4.7vw] top-[7vh] z-40 flex items-center gap-5">
            <span className="text-[7px] font-black tracking-[0.17em] text-[#cce849]">
              01 / AGENT TWIN
            </span>

            <span className="h-px w-12 bg-[#cce849]/25" />

            <span className="text-[6px] font-black tracking-[0.14em] text-white/21">
              SAFE SIMULATION
            </span>
          </div>

          {/* =====================================
              CONTRACT
          ===================================== */}

          <div className="absolute left-[4.7vw] top-[15vh] z-50 w-[min(650px,88vw)]">
            <form
              onSubmit={
                runTwin
              }
              className="overflow-hidden rounded-[19px] bg-[#e3e1d5] text-[#11150f] shadow-[0_36px_120px_rgba(0,0,0,.48)]"
            >
              {/* HEADER */}

              <div className="flex items-center justify-between gap-6 border-b border-black/12 px-6 py-5 sm:px-8">
                <div>
                  <p className="text-[6px] font-black tracking-[0.16em] text-black/36">
                    TWIN / SIMULATION CONTRACT
                  </p>

                  <p
                    className="mt-1 text-[6px] font-black tracking-[0.12em]"
                    style={{
                      color:
                        result
                          ? decisionColor(
                              result.decision
                            )

                          : "#718921",
                    }}
                  >
                    {
                      result
                        ? `${result.decision} / SIMULATION COMPLETE`

                        : running
                          ? `${phaseLabel(
                              phase
                            )} / PRODUCTION UNTOUCHED`

                          : "NO REAL-WORLD MUTATION"
                    }
                  </p>
                </div>

                <div className="rounded-[6px] bg-[#11150f] px-4 py-3">
                  <span
                    className="text-[6px] font-black tracking-[0.11em]"
                    style={{
                      color:
                        result
                          ? decisionColor(
                              result.decision
                            )

                          : "#cce849",
                    }}
                  >
                    {
                      result
                        ? result.decision

                        : phaseLabel(
                            phase
                          )
                    }
                  </span>
                </div>
              </div>

              {/* BODY */}

              <div className="px-6 py-7 sm:px-8 sm:py-8">
                <div className="flex items-start justify-between gap-7">
                  <div className="min-w-0 flex-1">
                    <p className="text-[6px] font-black tracking-[0.14em] text-black/25">
                      AGENT INTENT
                    </p>

                    <h1
                      className="mt-3 uppercase"
                      style={{
                        fontFamily:
                          DISPLAY_FONT,

                        fontWeight:
                          900,

                        fontSize:
                          "clamp(30px,2.4vw,46px)",

                        lineHeight:
                          0.88,

                        letterSpacing:
                          "-0.045em",
                      }}
                    >
                      Proposed action
                    </h1>
                  </div>

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#11150f]">
                    <Bot
                      size={
                        17
                      }
                      className="text-[#cce849]"
                    />
                  </div>
                </div>

                <textarea
                  value={
                    request
                  }
                  onChange={(
                    event
                  ) =>
                    setRequest(
                      event.target.value
                    )
                  }
                  disabled={
                    running
                  }
                  rows={
                    3
                  }
                  className="mt-7 w-full resize-none border-b border-black/14 bg-transparent pb-5 text-[16px] font-medium leading-7 text-black/72 outline-none placeholder:text-black/25 disabled:cursor-wait disabled:opacity-60"
                  placeholder="Describe the action the agent wants to perform..."
                />

                {/* RESULT */}

                <AnimatePresence>
                  {result && (
                    <motion.div
                      initial={{
                        opacity:
                          0,

                        y:
                          12,
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
                      }}
                      className="mt-6"
                    >
                      <div className="grid grid-cols-3 border-y border-black/10">
                        <ContractMetric
                          label="RISK"
                          value={`${result.risk_score}`}
                          color={
                            riskColor(
                              result.risk_score
                            )
                          }
                        />

                        <ContractMetric
                          label="BLAST"
                          value={`${result.blast_radius}`}
                          color="#a17e23"
                        />

                        <ContractMetric
                          label="DECISION"
                          value={
                            result.decision
                          }
                          color={
                            decisionColor(
                              result.decision
                            )
                          }
                        />
                      </div>

                      <p className="mt-5 text-[8px] leading-5 text-black/43">
                        {
                          result.reason
                        }
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* ERROR */}

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{
                        opacity:
                          0,

                        y:
                          6,
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
                      }}
                      className="mt-5 flex items-start gap-3 rounded-[10px] bg-[#b64e47]/[0.08] p-4"
                    >
                      <CircleAlert
                        size={
                          13
                        }
                        className="mt-0.5 shrink-0 text-[#a9433e]"
                      />

                      <p className="text-[7px] font-black leading-4 tracking-[0.04em] text-[#8d3d38]">
                        {
                          error
                        }
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* ACTION */}

              <div className="border-t border-black/11 p-3">
                {result ? (
                  <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                    <button
                      type="button"
                      onClick={
                        viewRisk
                      }
                      className="group flex min-h-[58px] items-center justify-center gap-4 rounded-full bg-[#11150f] px-7 text-[8px] font-black tracking-[0.1em] text-white transition hover:bg-[#192019]"
                    >
                      <Gauge
                        size={
                          13
                        }
                        style={{
                          color:
                            decisionColor(
                              result.decision
                            ),
                        }}
                      />

                      VIEW RISK ANALYSIS

                      <ArrowRight
                        size={
                          13
                        }
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </button>

                    <button
                      type="button"
                      onClick={
                        resetTwin
                      }
                      className="flex min-h-[58px] items-center justify-center gap-3 rounded-full border border-black/12 px-6 text-[7px] font-black tracking-[0.09em] text-black/38 transition hover:bg-black/[0.035] hover:text-black/70"
                    >
                      <RotateCcw
                        size={
                          12
                        }
                      />

                      RESET
                    </button>
                  </div>
                ) : (
                  <button
                    type="submit"
                    disabled={
                      running ||
                      !request.trim()
                    }
                    className="group flex min-h-[58px] w-full items-center justify-center gap-5 rounded-full bg-[#11150f] px-7 text-[8px] font-black tracking-[0.1em] text-white transition hover:bg-[#182018] disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    {running ? (
                      <span className="h-2 w-2 animate-pulse rounded-full bg-[#cce849]" />
                    ) : (
                      <Play
                        size={
                          13
                        }
                        className="text-[#cce849]"
                      />
                    )}

                    {
                      running
                        ? phaseAction(
                            phase
                          )

                        : "RUN THROUGH THE TWIN"
                    }

                    <ArrowRight
                      size={
                        13
                      }
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </button>
                )}
              </div>
            </form>

            {/* CONTRACT META */}

            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 px-2">
              <span className="flex items-center gap-2 text-[6px] font-black tracking-[0.12em] text-white/22">
                <ShieldCheck
                  size={
                    10
                  }
                  className="text-[#cce849]"
                />

                PRODUCTION UNTOUCHED
              </span>

              <span className="text-[6px] font-black tracking-[0.12em] text-white/16">
                INTENT ≠ AUTHORITY
              </span>
            </div>
          </div>

          {/* =====================================
              STATE RAIL
          ===================================== */}

          <div className="absolute bottom-[15vh] right-[4.5vw] top-[16vh] z-40 hidden w-[255px] xl:block">
            <p className="text-[6px] font-black tracking-[0.16em] text-white/28">
              SIMULATION STATE
            </p>

            <div className="relative mt-7">
              <span className="absolute bottom-6 left-[12px] top-5 w-px bg-white/[0.08]" />

              {PHASES.map(
                (
                  item,
                  index
                ) => (
                  <PhaseRow
                    key={
                      item.phase
                    }
                    item={
                      item
                    }
                    index={
                      index
                    }
                    activeIndex={
                      activePhaseIndex
                    }
                    decision={
                      result?.decision ??
                      null
                    }
                  />
                )
              )}
            </div>
          </div>

          {/* =====================================
              RESULT CALLOUT
          ===================================== */}

          <AnimatePresence>
            {result && (
              <motion.div
                initial={{
                  opacity:
                    0,

                  x:
                    12,
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
                }}
                className="absolute bottom-[8vh] right-[4.5vw] z-40 hidden w-[255px] border-t border-white/[0.09] pt-4 xl:block"
              >
                <p className="text-[5px] font-black tracking-[0.15em] text-white/20">
                  CAIROS VERDICT
                </p>

                <p
                  className="mt-3 text-[11px] font-black tracking-[0.1em]"
                  style={{
                    color:
                      decisionColor(
                        result.decision
                      ),
                  }}
                >
                  {
                    result.decision
                  }
                </p>

                <p className="mt-2 text-[7px] leading-4 text-white/28">
                  Risk{" "}
                  {
                    result.risk_score
                  }
                  {" / Blast radius "}
                  {
                    result.blast_radius
                  }
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* =====================================
              FOOT
          ===================================== */}

          <div className="pointer-events-none absolute bottom-5 left-8 right-8 z-[55] flex items-center gap-4">
            <span className="h-px flex-1 bg-[#cce849]/15" />

            <span className="text-[6px] font-black tracking-[0.15em] text-white/17">
              STEP 01 / AGENT TWIN
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ======================================================
   PHASE ROW
====================================================== */

function PhaseRow({
  item,
  index,
  activeIndex,
  decision,
}: {
  item:
    PhaseDefinition;

  index:
    number;

  activeIndex:
    number;

  decision:
    Decision | null;
}) {
  const active =
    index ===
    activeIndex;

  const complete =
    index <
    activeIndex;

  const finalColor =
    item.phase ===
      "COMPLETE" &&
    decision
      ? decisionColor(
          decision
        )

      : "#cce849";

  return (
    <div className="relative grid grid-cols-[26px_1fr] gap-4 pb-7 last:pb-0">
      <div className="relative z-10 flex h-[25px] w-[25px] items-center justify-center rounded-full border border-white/[0.1] bg-[#071009]">
        {complete ? (
          <Check
            size={
              9
            }
            style={{
              color:
                finalColor,
            }}
          />
        ) : (
          <span
            className={`h-[5px] w-[5px] rounded-full ${
              active
                ? "animate-pulse"
                : ""
            }`}
            style={{
              backgroundColor:
                active
                  ? finalColor
                  : "rgba(255,255,255,.15)",
            }}
          />
        )}
      </div>

      <div className="pt-[1px]">
        <p
          className="text-[7px] font-black tracking-[0.1em]"
          style={{
            color:
              active
                ? finalColor

                : complete
                  ? "rgba(239,239,229,.48)"

                  : "rgba(239,239,229,.21)",
          }}
        >
          {
            item.label
          }
        </p>

        <p
          className={`mt-2 text-[6px] leading-4 ${
            active
              ? "text-white/34"
              : "text-white/16"
          }`}
        >
          {
            item.description
          }
        </p>
      </div>
    </div>
  );
}

/* ======================================================
   CONTRACT METRIC
====================================================== */

function ContractMetric({
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
    <div className="border-r border-black/10 py-4 pr-3 last:border-r-0 last:pl-3 [&:nth-child(2)]:px-3">
      <p className="text-[5px] font-black tracking-[0.13em] text-black/23">
        {
          label
        }
      </p>

      <p
        className="mt-2 text-[8px] font-black tracking-[0.08em]"
        style={{
          color,
        }}
      >
        {
          value
        }
      </p>
    </div>
  );
}

/* ======================================================
   HELPERS
====================================================== */

function phaseIndex(
  phase:
    TwinPhase
) {
  return PHASES.findIndex(
    (
      item
    ) =>
      item.phase ===
      phase
  );
}

function phaseLabel(
  phase:
    TwinPhase
) {
  if (
    phase ===
    "PLANNING"
  ) {
    return "PLAN";
  }

  if (
    phase ===
    "SIMULATING"
  ) {
    return "TWIN";
  }

  if (
    phase ===
    "ANALYZING"
  ) {
    return "RISK";
  }

  if (
    phase ===
    "COMPLETE"
  ) {
    return "VERDICT";
  }

  return "READY";
}

function phaseAction(
  phase:
    TwinPhase
) {
  if (
    phase ===
    "PLANNING"
  ) {
    return "BUILDING AGENT PLAN";
  }

  if (
    phase ===
    "SIMULATING"
  ) {
    return "RUNNING SAFE TWIN";
  }

  if (
    phase ===
    "ANALYZING"
  ) {
    return "MEASURING CONSEQUENCE";
  }

  return "RUNNING CAIROS";
}

function decisionColor(
  decision:
    Decision,

  alpha?:
    number
) {
  const hex =
    decision ===
    "ALLOW"
      ? "#cce849"

      : decision ===
        "ASK"
        ? "#c6a248"

        : "#c95852";

  if (
    typeof alpha ===
    "number"
  ) {
    return hexToRgba(
      hex,
      alpha
    );
  }

  return hex;
}

function riskColor(
  score:
    number
) {
  if (
    score >=
    80
  ) {
    return "#c95852";
  }

  if (
    score >=
    50
  ) {
    return "#c6a248";
  }

  return "#718b21";
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

function wait(
  ms:
    number
) {
  return new Promise<void>(
    (
      resolve
    ) => {
      window.setTimeout(
        resolve,
        ms
      );
    }
  );
}