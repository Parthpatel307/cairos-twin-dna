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
  Activity,
  ArrowLeft,
  ArrowRight,
  Check,
  CircleAlert,
  Database,
  Fingerprint,
  Gauge,
  LockKeyhole,
  Server,
  ShieldCheck,
  TriangleAlert,
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
  saveDemoSession,
} from "@/lib/demo-session";

import type {
  Decision,
} from "@/types";

const DISPLAY_FONT =
  "'Arial Narrow', 'Roboto Condensed', Haettenschweiler, Impact, sans-serif";

type ExecutionState =
  | "LOCKED"
  | "READY"
  | "STARTING"
  | "EXECUTING"
  | "MUTATING"
  | "FAILED";

type LogStatus =
  | "PENDING"
  | "RUNNING"
  | "SUCCESS"
  | "WARNING"
  | "FAILED";

interface ExecutionLog {
  id: number;
  label: string;
  detail: string;
  status: LogStatus;
  time: string;
}

interface ExecutionView {
  request: string;
  decision: Decision;
  riskScore: number;
  blastRadius: number;
  approvalStatus: string;
  reviewerName: string | null;
  authorized: boolean;
}

const FALLBACK: ExecutionView = {
  request: "Clean unused files from production server",
  decision: "ASK",
  riskScore: 78,
  blastRadius: 3,
  approvalStatus: "PENDING",
  reviewerName: null,
  authorized: false,
};

const BASE_LOGS: ExecutionLog[] = [
  {
    id: 1,
    label: "Authority lease",
    detail: "Waiting for execution authority.",
    status: "PENDING",
    time: "--:--:--",
  },
  {
    id: 2,
    label: "Production connection",
    detail: "No production mutation started.",
    status: "PENDING",
    time: "--:--:--",
  },
  {
    id: 3,
    label: "File classification",
    detail: "Pending dependency classification.",
    status: "PENDING",
    time: "--:--:--",
  },
  {
    id: 4,
    label: "Delete operation",
    detail: "Mutation has not executed.",
    status: "PENDING",
    time: "--:--:--",
  },
  {
    id: 5,
    label: "Production verification",
    detail: "Waiting for downstream verification.",
    status: "PENDING",
    time: "--:--:--",
  },
];

export default function ExecutionsPage() {
  const router = useRouter();

  const mountedRef = useRef(true);
  const startedRef = useRef(false);

  const [execution, setExecution] =
    useState<ExecutionView>(FALLBACK);

  const [loaded, setLoaded] =
    useState(false);

  const [state, setState] =
    useState<ExecutionState>("LOCKED");

  const [logs, setLogs] =
    useState<ExecutionLog[]>(BASE_LOGS);

  const [executionId, setExecutionId] =
    useState<string | null>(null);

  const [mutationCount, setMutationCount] =
    useState(0);

  const [latency, setLatency] =
    useState(0);

  const [notice, setNotice] =
    useState<string | null>(null);

  useEffect(() => {
    mountedRef.current = true;

    try {
      const session = getDemoSession();

      if (!session) {
        setExecution(FALLBACK);
        setState("LOCKED");
        setLoaded(true);
        return;
      }

      const root =
        session as unknown as Record<
          string,
          unknown
        >;

      const simulation = asRecord(
        root.simulation ??
          root.result ??
          root
      );

      const risk = asRecord(
        root.risk ??
          root.riskAnalysis ??
          root.risk_analysis ??
          {}
      );

      const decision = decisionValue(
        risk.decision ??
          simulation.decision ??
          root.decision,
        FALLBACK.decision
      );

      const approvalStatus = stringValue(
        root.approvalStatus,
        decision === "ALLOW"
          ? "NOT_REQUIRED"
          : "PENDING"
      );

      const authorized =
        decision === "ALLOW" ||
        approvalStatus === "APPROVED";

      const existingExecutionId =
        stringValue(
          root.executionId ??
            root.execution_id,
          ""
        );

      const existingExecutionStatus =
        stringValue(
          root.executionStatus,
          ""
        );

      const nextExecution: ExecutionView = {
        request: stringValue(
          root.request ??
            root.action ??
            simulation.request,
          FALLBACK.request
        ),

        decision,

        riskScore: numberValue(
          risk.risk_score ??
            risk.riskScore ??
            simulation.risk_score ??
            root.riskScore,
          FALLBACK.riskScore
        ),

        blastRadius: numberValue(
          risk.blast_radius ??
            risk.blastRadius ??
            simulation.blast_radius ??
            root.blastRadius,
          FALLBACK.blastRadius
        ),

        approvalStatus,

        reviewerName: nullableString(
          root.reviewerName
        ),

        authorized,
      };

      setExecution(nextExecution);

      if (existingExecutionId) {
        setExecutionId(
          existingExecutionId
        );
      }

      if (
        authorized &&
        existingExecutionStatus ===
          "FAILED"
      ) {
        setState("FAILED");

        setMutationCount(18);
        setLatency(143);

        setLogs(
          completedFailureLogs()
        );
      } else {
        setState(
          authorized
            ? "READY"
            : "LOCKED"
        );
      }
    } catch {
      setExecution(FALLBACK);
      setState("LOCKED");
    } finally {
      setLoaded(true);
    }

    return () => {
      mountedRef.current = false;
    };
  }, []);

  /*
    Entering this page from an approved decision
    starts the controlled execution automatically.

    Existing FAILED sessions do not replay on refresh.
  */

  useEffect(() => {
    if (
      !loaded ||
      state !== "READY" ||
      !execution.authorized ||
      startedRef.current
    ) {
      return;
    }

    startedRef.current = true;

    const timer =
      window.setTimeout(() => {
        void runExecution();
      }, 850);

    return () => {
      window.clearTimeout(timer);
    };
  }, [
    loaded,
    state,
    execution.authorized,
  ]);

  const statusColor =
    useMemo(() => {
      if (state === "FAILED") {
        return "#c95852";
      }

      if (
        state === "EXECUTING" ||
        state === "MUTATING"
      ) {
        return "#cce849";
      }

      return "#c6a248";
    }, [state]);

  const runExecution =
    async () => {
      if (
        !execution.authorized ||
        state === "STARTING" ||
        state === "EXECUTING" ||
        state === "MUTATING"
      ) {
        return;
      }

      setNotice(null);

      const id =
        executionId ||
        `exec-${Date.now()}`;

      setExecutionId(id);

      setMutationCount(0);
      setLatency(0);
      setLogs(BASE_LOGS);

      saveExecutionState({
        executionStatus: "RUNNING",
        executionId: id,
        executionStartedAt:
          new Date().toISOString(),
      });

      setState("STARTING");

      updateLog(1, {
        status: "RUNNING",
        detail:
          "Verifying execution lease and reviewer authority.",
        time: timeNow(),
      });

      await wait(650);

      if (!mountedRef.current) {
        return;
      }

      updateLog(1, {
        status: "SUCCESS",
        detail:
          execution.decision ===
          "ALLOW"
            ? "Policy authority verified. Human review was not required."
            : `Execution lease signed by ${
                execution.reviewerName ??
                "authorized reviewer"
              }.`,
        time: timeNow(),
      });

      setState("EXECUTING");

      updateLog(2, {
        status: "RUNNING",
        detail:
          "Opening controlled production connection.",
        time: timeNow(),
      });

      setLatency(42);

      await wait(720);

      if (!mountedRef.current) {
        return;
      }

      updateLog(2, {
        status: "SUCCESS",
        detail:
          "Production connection established under CAIROS execution lease.",
        time: timeNow(),
      });

      updateLog(3, {
        status: "RUNNING",
        detail:
          "Classifying candidate files against observed dependency evidence.",
        time: timeNow(),
      });

      setLatency(67);

      await wait(820);

      if (!mountedRef.current) {
        return;
      }

      updateLog(3, {
        status: "WARNING",
        detail:
          "18 files classified as unused; dependency evidence is incomplete for one production path.",
        time: timeNow(),
      });

      setState("MUTATING");

      updateLog(4, {
        status: "RUNNING",
        detail:
          "Applying approved delete operation to 18 classified files.",
        time: timeNow(),
      });

      setMutationCount(6);

      await wait(380);

      if (!mountedRef.current) {
        return;
      }

      setMutationCount(12);
      setLatency(101);

      await wait(380);

      if (!mountedRef.current) {
        return;
      }

      setMutationCount(18);

      updateLog(4, {
        status: "SUCCESS",
        detail:
          "18 file mutations committed under the approved execution lease.",
        time: timeNow(),
      });

      updateLog(5, {
        status: "RUNNING",
        detail:
          "Checking service health and downstream production dependencies.",
        time: timeNow(),
      });

      setLatency(128);

      await wait(760);

      if (!mountedRef.current) {
        return;
      }

      setLatency(143);

      updateLog(5, {
        status: "FAILED",
        detail:
          "Production dependency failed after deletion. Observable evidence has been frozen for AgentDNA replay.",
        time: timeNow(),
      });

      setState("FAILED");

      saveExecutionState({
        executionStatus: "FAILED",
        executionId: id,
        executionFailedAt:
          new Date().toISOString(),
        executionError:
          "Production dependency failed after approved file deletion.",
        mutationCount: 18,
        executionLatency: 143,
        traceStatus: "FROZEN",
        failureStep: 5,
      });
    };

  const updateLog = (
    id: number,
    patch: Partial<ExecutionLog>
  ) => {
    setLogs((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              ...patch,
            }
          : item
      )
    );
  };

  const saveExecutionState = (
    patch: Record<
      string,
      unknown
    >
  ) => {
    const current =
      getDemoSession();

    saveDemoSession({
      ...(current ?? {}),
      ...patch,
    } as never);
  };

  const openAgentDNA =
    () => {
      if (state !== "FAILED") {
        return;
      }

      router.push("/agentdna");
    };

  if (!loaded) {
    return (
      <main className="min-h-screen bg-[#050705]" />
    );
  }

  return (
    <main className="relative min-h-screen overflow-x-clip bg-[#050705] text-[#efefe5]">
      {/* =====================================
          PRODUCTION CHAPTER
      ===================================== */}

      <section className="relative p-3 sm:p-5">
        <div className="relative min-h-[calc(100svh-110px)] overflow-hidden rounded-[30px] border border-white/[0.09] bg-[#061009]">
          {/* BACKGROUND */}

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background: [
                "linear-gradient(90deg,rgba(3,7,4,.995) 0%,rgba(4,8,4,.94) 31%,rgba(5,24,11,.4) 60%,rgba(9,32,15,.58) 100%)",
                "radial-gradient(circle at 76% 29%,rgba(120,151,48,.14),transparent 28%)",
                state === "FAILED"
                  ? "radial-gradient(circle at 78% 68%,rgba(166,61,54,.18),transparent 37%)"
                  : "radial-gradient(circle at 78% 68%,rgba(18,73,34,.28),transparent 37%)",
              ].join(","),
            }}
          />

          {/* LARGE CROPPED TYPE */}

          <div className="pointer-events-none absolute inset-x-0 bottom-[-4vw] z-[5] overflow-hidden">
            <p
              className="whitespace-nowrap text-center uppercase"
              style={{
                fontFamily:
                  DISPLAY_FONT,
                fontWeight: 900,
                fontSize:
                  "clamp(120px,17vw,305px)",
                lineHeight: 0.67,
                letterSpacing:
                  "-0.066em",
                color:
                  state === "FAILED"
                    ? "rgba(201,88,82,.07)"
                    : "rgba(185,211,61,.075)",
              }}
            >
              EXECUTION
            </p>
          </div>

          {/* 3D PRODUCTION TUNNEL */}

          <div className="pointer-events-none absolute inset-0 z-10 opacity-60 sm:opacity-80 lg:opacity-100">
            <CairosDarkCanvas>
              <ExecutionScene
                state={state}
              />
            </CairosDarkCanvas>
          </div>

          {/* LEFT READABILITY */}

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-20"
            style={{
              background:
                "linear-gradient(90deg,rgba(3,7,4,.995) 0%,rgba(3,7,4,.96) 29%,rgba(3,7,4,.58) 46%,rgba(3,7,4,.08) 65%,transparent 79%)",
            }}
          />

          {/* TOP */}

          <div className="absolute left-[4.5vw] right-[4.5vw] top-[6vh] z-50 flex items-center justify-between gap-6">
            <button
              type="button"
              onClick={() =>
                router.push(
                  execution.decision ===
                    "ASK"
                    ? "/approvals"
                    : "/risk"
                )
              }
              className="flex items-center gap-3 text-[7px] font-black tracking-[0.14em] text-white/31 transition hover:text-[#cce849]"
            >
              <ArrowLeft size={12} />

              {execution.decision ===
              "ASK"
                ? "BACK TO AUTHORITY"
                : "BACK TO RISK"}
            </button>

            <div className="flex items-center gap-3">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{
                  backgroundColor:
                    statusColor,
                }}
              />

              <span
                className="text-[6px] font-black tracking-[0.15em]"
                style={{
                  color:
                    statusColor,
                }}
              >
                {state === "FAILED"
                  ? "INCIDENT DETECTED"
                  : state ===
                      "MUTATING"
                    ? "PRODUCTION MUTATING"
                    : state}
              </span>
            </div>
          </div>

          {/* =================================
              MAIN COPY
              Safe dedicated headline zone
          ================================= */}

          <div className="absolute left-[4.5vw] top-[13.5vh] z-40 w-[min(760px,48vw)]">
            <div className="flex items-center gap-4">
              <span
                className="text-[7px] font-black tracking-[0.18em]"
                style={{
                  color:
                    state === "FAILED"
                      ? "#c95852"
                      : "#cce849",
                }}
              >
                REAL EXECUTION
              </span>

              <span className="h-px w-10 bg-white/12" />

              <span className="text-[7px] font-black tracking-[0.14em] text-white/22">
                PRODUCTION / CONTROLLED
              </span>
            </div>

            <AnimatePresence
              mode="wait"
              initial={false}
            >
              <motion.div
                key={state}
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -12,
                }}
                transition={{
                  duration: 0.32,
                }}
              >
                <h1
                  className="mt-7 uppercase"
                  style={{
                    fontFamily:
                      DISPLAY_FONT,
                    fontWeight: 900,
                    fontSize:
                      "clamp(42px,3.9vw,70px)",
                    lineHeight: 0.8,
                    letterSpacing:
                      "-0.058em",
                  }}
                >
                  {state === "LOCKED" ? (
                    <>
                      <span className="block whitespace-nowrap">
                        THE GATE
                      </span>

                      <span className="block whitespace-nowrap text-[#c6a248]">
                        IS CLOSED.
                      </span>
                    </>
                  ) : state ===
                    "FAILED" ? (
                    <>
                      <span className="block whitespace-nowrap">
                        REALITY
                      </span>

                      <span className="block whitespace-nowrap text-[#c95852]">
                        BROKE HERE.
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="block whitespace-nowrap">
                        NOW IT TOUCHES
                      </span>

                      <span className="block whitespace-nowrap text-[#cce849]">
                        REALITY.
                      </span>
                    </>
                  )}
                </h1>

                <p className="mt-5 max-w-[500px] text-[10px] leading-5 text-white/36">
                  {state === "LOCKED"
                    ? "CAIROS has not found a valid execution authority. Production remains untouched."
                    : state ===
                        "FAILED"
                      ? "The approved action reached production and triggered a downstream failure. The trace is frozen. AgentDNA can now replay the observable cause."
                      : "The request passed simulation and authority. CAIROS is now executing under a bounded lease while every observable action is recorded."}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* TELEMETRY */}

          <div className="absolute right-[4.5vw] top-[18vh] z-50 hidden w-[250px] xl:block">
            <p className="text-[6px] font-black tracking-[0.16em] text-white/20">
              LIVE TELEMETRY
            </p>

            <div className="mt-4 border-t border-white/[0.09]">
              <TelemetryRow
                icon={Gauge}
                label="LATENCY"
                value={`${latency} MS`}
                color={
                  state === "FAILED"
                    ? "#c95852"
                    : "#cce849"
                }
              />

              <TelemetryRow
                icon={Database}
                label="MUTATIONS"
                value={`${String(
                  mutationCount
                ).padStart(
                  2,
                  "0"
                )} FILES`}
                color={
                  mutationCount > 0
                    ? "#c6a248"
                    : "#cce849"
                }
              />

              <TelemetryRow
                icon={Fingerprint}
                label="TRACE"
                value={
                  state === "FAILED"
                    ? "FROZEN"
                    : "ARMED"
                }
                color="#8062dc"
              />

              <TelemetryRow
                icon={Server}
                label="TARGET"
                value="PRODUCTION"
                color={
                  state === "FAILED"
                    ? "#c95852"
                    : "#cce849"
                }
              />
            </div>
          </div>

          {/* =================================
              EXECUTION DOCKET
              Fixed below headline.
              No rotation on interactive box.
          ================================= */}

          <div className="absolute left-[4.5vw] top-[34vh] z-50 w-[min(660px,91vw)]">
            <motion.div
              initial={{
                opacity: 0,
                y: 28,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.45,
                ease: [
                  0.22,
                  1,
                  0.36,
                  1,
                ],
              }}
              className="overflow-hidden rounded-[18px] bg-[#e3e1d5] text-[#11150f] shadow-[0_32px_110px_rgba(0,0,0,.52)]"
            >
              <div className="flex items-center justify-between gap-6 border-b border-black/12 px-6 py-4">
                <div>
                  <p className="text-[6px] font-black tracking-[0.16em] text-black/38">
                    CAIROS / EXECUTION LEASE
                  </p>

                  <p
                    className="mt-1 text-[6px] font-black tracking-[0.12em]"
                    style={{
                      color:
                        state ===
                        "FAILED"
                          ? "#a9433e"
                          : "#708a20",
                    }}
                  >
                    {state ===
                    "FAILED"
                      ? "TRACE FROZEN / INCIDENT"
                      : execution.authorized
                        ? "AUTHORITY VERIFIED"
                        : "AUTHORITY REQUIRED"}
                  </p>
                </div>

                <div className="rounded-[5px] bg-[#11150f] px-3 py-2">
                  <span
                    className="text-[6px] font-black tracking-[0.12em]"
                    style={{
                      color:
                        state ===
                        "FAILED"
                          ? "#dc7068"
                          : "#cce849",
                    }}
                  >
                    {state}
                  </span>
                </div>
              </div>

              <div className="px-6 py-5 sm:px-8">
                <p className="text-[6px] font-black tracking-[0.14em] text-black/24">
                  APPROVED ACTION
                </p>

                <p className="mt-3 text-[15px] font-black leading-6 tracking-[-0.025em]">
                  {execution.request}
                </p>

                <div className="mt-5 grid grid-cols-3 border-y border-black/10">
                  <DocketMetric
                    label="RISK"
                    value={`${execution.riskScore}`}
                    bad
                  />

                  <DocketMetric
                    label="BLAST"
                    value={`${execution.blastRadius}`}
                    bad
                  />

                  <DocketMetric
                    label="AUTHORITY"
                    value={
                      execution.authorized
                        ? "VALID"
                        : "LOCKED"
                    }
                    gold={
                      execution.authorized
                    }
                    bad={
                      !execution.authorized
                    }
                  />
                </div>
              </div>

              {/* ACTION */}

              <div className="border-t border-black/11 p-3">
                {state === "LOCKED" ? (
                  <button
                    type="button"
                    onClick={() =>
                      router.push(
                        "/approvals"
                      )
                    }
                    className="group flex min-h-[56px] w-full items-center justify-center gap-4 rounded-full bg-[#11150f] px-7 text-[8px] font-black tracking-[0.1em] text-white transition hover:bg-[#201d12]"
                  >
                    <LockKeyhole
                      size={13}
                      className="text-[#c6a248]"
                    />

                    OPEN HUMAN AUTHORITY

                    <ArrowRight
                      size={13}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </button>
                ) : state ===
                  "FAILED" ? (
                  <button
                    type="button"
                    onClick={
                      openAgentDNA
                    }
                    className="group flex min-h-[56px] w-full items-center justify-center gap-4 rounded-full bg-[#11150f] px-7 text-[8px] font-black tracking-[0.1em] text-white transition hover:bg-[#17131f]"
                  >
                    <Fingerprint
                      size={13}
                      className="text-[#8d6be7]"
                    />

                    OPEN AGENTDNA

                    <ArrowRight
                      size={13}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </button>
                ) : (
                  <div className="flex min-h-[56px] items-center justify-center gap-4 rounded-full bg-[#11150f] px-7">
                    <Activity
                      size={13}
                      className="animate-pulse text-[#cce849]"
                    />

                    <span className="text-[8px] font-black tracking-[0.1em] text-white">
                      {state ===
                      "READY"
                        ? "EXECUTION LEASE READY"
                        : state ===
                            "STARTING"
                          ? "VERIFYING LEASE"
                          : state ===
                              "MUTATING"
                            ? "PRODUCTION MUTATING"
                            : "EXECUTION LIVE"}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>

            <AnimatePresence>
              {notice && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 8,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: -5,
                  }}
                  className="mt-4 flex items-start gap-3 rounded-[12px] border border-[#c95852]/15 bg-[#170b09]/90 p-4 backdrop-blur-xl"
                >
                  <CircleAlert
                    size={13}
                    className="mt-0.5 shrink-0 text-[#c95852]"
                  />

                  <p className="text-[7px] font-black leading-4 tracking-[0.07em] text-[#d3655d]">
                    {notice}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* FOOT */}

          <div className="pointer-events-none absolute bottom-5 left-8 right-8 z-[55] flex items-center gap-4">
            <span
              className="h-px flex-1"
              style={{
                backgroundColor:
                  state === "FAILED"
                    ? "rgba(201,88,82,.18)"
                    : "rgba(204,232,73,.15)",
              }}
            />

            <span className="text-[6px] font-black tracking-[0.16em] text-white/17">
              STEP 04 / REAL EXECUTION
            </span>
          </div>
        </div>
      </section>

      {/* =====================================
          BLACK BOX TRANSCRIPT
      ===================================== */}

      <section className="relative p-3 pt-0 sm:p-5 sm:pt-0">
        <div className="mx-auto max-w-[1480px] overflow-hidden rounded-[30px] border border-white/[0.09] bg-[#07120a]">
          {/* HEADER */}

          <div className="flex flex-wrap items-end justify-between gap-8 border-b border-white/[0.08] px-8 py-8 sm:px-12">
            <div>
              <div className="flex items-center gap-4">
                <span
                  className="text-[7px] font-black tracking-[0.17em]"
                  style={{
                    color:
                      state === "FAILED"
                        ? "#c95852"
                        : "#cce849",
                  }}
                >
                  OBSERVABLE EXECUTION
                </span>

                <span className="h-px w-10 bg-white/12" />
              </div>

              <h2
                className="mt-5 uppercase"
                style={{
                  fontFamily:
                    DISPLAY_FONT,
                  fontWeight: 900,
                  fontSize:
                    "clamp(46px,5vw,84px)",
                  lineHeight: 0.83,
                  letterSpacing:
                    "-0.052em",
                }}
              >
                BLACK BOX
                <br />

                <span
                  style={{
                    color:
                      state === "FAILED"
                        ? "#c95852"
                        : "#cce849",
                  }}
                >
                  TRANSCRIPT.
                </span>
              </h2>
            </div>

            <div className="max-w-[360px] border-t border-white/[0.09] pt-4">
              <p className="text-[6px] font-black tracking-[0.15em] text-white/19">
                TRACE POLICY
              </p>

              <p className="mt-2 text-[9px] leading-5 text-white/35">
                Observable actions,
                tool results,
                timestamps and system
                outcomes only. No private
                chain-of-thought is
                recorded.
              </p>
            </div>
          </div>

          {/* PAPER TRANSCRIPT + INCIDENT */}

          <div className="grid gap-px bg-white/[0.06] lg:grid-cols-[1.12fr_0.88fr]">
            {/* TRANSCRIPT */}

            <div className="relative overflow-hidden bg-[#deddd2] p-7 text-[#11150f] sm:p-10">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-[0.2]"
                style={{
                  backgroundImage: [
                    "radial-gradient(circle,rgba(18,32,17,.18) .6px,transparent .8px)",
                    "linear-gradient(rgba(20,38,20,.07) 1px,transparent 1px)",
                    "linear-gradient(90deg,rgba(20,38,20,.07) 1px,transparent 1px)",
                  ].join(","),
                  backgroundSize:
                    "19px 19px,76px 76px,76px 76px",
                }}
              />

              <div className="relative">
                <div className="flex items-center justify-between gap-6">
                  <div>
                    <p className="text-[6px] font-black tracking-[0.15em] text-black/31">
                      EXECUTION ID
                    </p>

                    <p className="mt-2 font-mono text-[9px] font-bold text-black/62">
                      {executionId ??
                        "PENDING"}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        state ===
                        "FAILED"
                          ? "bg-[#b84c46]"
                          : "bg-[#748d25]"
                      }`}
                    />

                    <span
                      className={`text-[6px] font-black tracking-[0.12em] ${
                        state ===
                        "FAILED"
                          ? "text-[#a9433e]"
                          : "text-[#657e20]"
                      }`}
                    >
                      {state ===
                      "FAILED"
                        ? "TRACE FROZEN"
                        : "TRACE LIVE"}
                    </span>
                  </div>
                </div>

                <div className="mt-8 border-t border-black/12">
                  {logs.map((log) => (
                    <TranscriptRow
                      key={log.id}
                      log={log}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* INCIDENT */}

            <div className="relative overflow-hidden bg-[#0a170c] p-8 sm:p-12">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    state === "FAILED"
                      ? "radial-gradient(circle at 78% 20%,rgba(201,88,82,.13),transparent 35%)"
                      : "radial-gradient(circle at 78% 20%,rgba(204,232,73,.08),transparent 35%)",
                }}
              />

              <div className="relative">
                {state ===
                "FAILED" ? (
                  <TriangleAlert
                    size={18}
                    className="text-[#c95852]"
                  />
                ) : (
                  <ShieldCheck
                    size={18}
                    className="text-[#cce849]"
                  />
                )}

                <p className="mt-7 text-[7px] font-black tracking-[0.16em] text-white/20">
                  PRODUCTION RESULT
                </p>

                <p
                  className="mt-4 uppercase"
                  style={{
                    fontFamily:
                      DISPLAY_FONT,
                    fontWeight: 900,
                    fontSize:
                      "clamp(55px,6vw,98px)",
                    lineHeight: 0.74,
                    letterSpacing:
                      "-0.06em",
                    color:
                      state === "FAILED"
                        ? "#c95852"
                        : "#cce849",
                  }}
                >
                  {state === "FAILED"
                    ? "FAILED."
                    : "LIVE."}
                </p>

                <p className="mt-8 max-w-[430px] text-[11px] leading-6 text-white/39">
                  {state === "FAILED"
                    ? "A downstream production dependency failed after the approved mutation. The visible failure is not automatically the root cause."
                    : "Execution is still inside the bounded CAIROS lease. Observable evidence continues to stream into the black box."}
                </p>

                {state === "FAILED" && (
                  <>
                    <div className="mt-9 border-t border-white/[0.09] pt-6">
                      <p className="text-[6px] font-black tracking-[0.15em] text-white/19">
                        IMPORTANT
                      </p>

                      <p className="mt-3 text-[9px] font-black leading-5 tracking-[0.04em] text-[#c95852]/78">
                        FAILURE LOCATION ≠
                        ROOT CAUSE
                      </p>

                      <p className="mt-3 text-[9px] leading-5 text-white/30">
                        AgentDNA will replay
                        the observable causal
                        path and test a safer
                        counterfactual.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={
                        openAgentDNA
                      }
                      className="group mt-9 flex min-h-[56px] w-full items-center justify-center gap-4 rounded-full bg-[#8062dc] px-7 text-[8px] font-black tracking-[0.1em] text-white transition hover:bg-[#9070eb]"
                    >
                      <Fingerprint
                        size={13}
                      />

                      REPLAY WITH AGENTDNA

                      <ArrowRight
                        size={13}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ======================================================
   TRANSCRIPT
====================================================== */

function TranscriptRow({
  log,
}: {
  log: ExecutionLog;
}) {
  const tone =
    log.status === "FAILED"
      ? "#a9433e"
      : log.status === "WARNING"
        ? "#947522"
        : log.status === "SUCCESS"
          ? "#647d20"
          : log.status === "RUNNING"
            ? "#647d20"
            : "rgba(17,21,15,.26)";

  return (
    <motion.div
      layout
      className="grid grid-cols-[34px_1fr_auto] gap-4 border-b border-black/10 py-5"
    >
      <div className="pt-0.5">
        <span
          className="flex h-[24px] w-[24px] items-center justify-center rounded-full border"
          style={{
            borderColor:
              `${tone}55`,
          }}
        >
          {log.status ===
          "SUCCESS" ? (
            <Check
              size={10}
              style={{
                color: tone,
              }}
            />
          ) : log.status ===
            "FAILED" ? (
            <TriangleAlert
              size={10}
              style={{
                color: tone,
              }}
            />
          ) : log.status ===
            "WARNING" ? (
            <CircleAlert
              size={10}
              style={{
                color: tone,
              }}
            />
          ) : (
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                log.status ===
                "RUNNING"
                  ? "animate-pulse"
                  : ""
              }`}
              style={{
                backgroundColor:
                  tone,
              }}
            />
          )}
        </span>
      </div>

      <div>
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-[9px] font-black">
            {log.label}
          </p>

          <span
            className="text-[5px] font-black tracking-[0.12em]"
            style={{
              color: tone,
            }}
          >
            {log.status}
          </span>
        </div>

        <p className="mt-2 text-[8px] leading-5 text-black/41">
          {log.detail}
        </p>
      </div>

      <p className="pt-1 font-mono text-[6px] text-black/24">
        {log.time}
      </p>
    </motion.div>
  );
}

/* ======================================================
   TELEMETRY / DOCKET
====================================================== */

function TelemetryRow({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/[0.07] py-3">
      <div className="flex items-center gap-3">
        <Icon
          size={12}
          style={{
            color,
          }}
        />

        <span className="text-[6px] font-black tracking-[0.12em] text-white/20">
          {label}
        </span>
      </div>

      <span
        className="text-[6px] font-black tracking-[0.1em]"
        style={{
          color,
        }}
      >
        {value}
      </span>
    </div>
  );
}

function DocketMetric({
  label,
  value,
  bad = false,
  gold = false,
}: {
  label: string;
  value: string;
  bad?: boolean;
  gold?: boolean;
}) {
  return (
    <div className="border-r border-black/10 py-4 pr-3 last:border-r-0 last:pl-3 [&:nth-child(2)]:px-3">
      <p className="text-[5px] font-black tracking-[0.13em] text-black/23">
        {label}
      </p>

      <p
        className={`mt-1 text-[7px] font-black tracking-[0.1em] ${
          bad
            ? "text-[#ad4842]"
            : gold
              ? "text-[#8e7020]"
              : "text-[#69831f]"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

/* ======================================================
   3D EXECUTION
====================================================== */

function ExecutionScene({
  state,
}: {
  state: ExecutionState;
}) {
  const root =
    useRef<THREE.Group | null>(
      null
    );

  const packet =
    useRef<THREE.Mesh | null>(
      null
    );

  const mutationCore =
    useRef<THREE.Mesh | null>(
      null
    );

  const failureGroup =
    useRef<THREE.Group | null>(
      null
    );

  const scanner =
    useRef<THREE.Mesh | null>(
      null
    );

  const smooth =
    useRef(0);

  const width =
    useThree(
      (scene) =>
        scene.size.width
    );

  const mobile =
    width < 760;

  const compact =
    width >= 760 &&
    width < 1180;

  const baseX =
    mobile
      ? 0.8
      : compact
        ? 1.4
        : 2;

  const baseScale =
    mobile
      ? 0.58
      : compact
        ? 0.8
        : 0.96;

  useFrame(
    (
      scene,
      delta
    ) => {
      const target =
        state === "LOCKED"
          ? 0
          : state === "READY"
            ? 0.1
            : state ===
                "STARTING"
              ? 0.25
              : state ===
                  "EXECUTING"
                ? 0.55
                : state ===
                    "MUTATING"
                  ? 0.8
                  : 1;

      smooth.current =
        THREE.MathUtils.lerp(
          smooth.current,
          target,
          Math.min(
            1,
            delta * 3.7
          )
        );

      const value =
        smooth.current;

      const time =
        scene.clock.elapsedTime;

      if (root.current) {
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
            time * 0.24
          ) * 0.02;

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

      if (packet.current) {
        packet.current.visible =
          state !== "LOCKED";

        const targetX =
          state === "FAILED"
            ? 0.65
            : -3.3 +
              value * 4.25;

        packet.current.position.x =
          THREE.MathUtils.lerp(
            packet.current.position.x,
            targetX,
            Math.min(
              1,
              delta * 2.4
            )
          );

        packet.current.position.y =
          Math.sin(
            time * 1.2
          ) * 0.08;

        packet.current.rotation.x +=
          delta * 0.55;

        packet.current.rotation.y +=
          delta * 0.82;
      }

      if (mutationCore.current) {
        const scale =
          state === "MUTATING"
            ? 1.18 +
              Math.sin(
                time * 2.8
              ) * 0.08
            : state === "FAILED"
              ? 1.12
              : 1;

        mutationCore.current.scale.setScalar(
          scale
        );

        const material =
          mutationCore.current
            .material as THREE.MeshStandardMaterial;

        material.color.set(
          state === "FAILED"
            ? "#c95852"
            : state === "MUTATING"
              ? "#c6a248"
              : "#cce849"
        );

        material.emissive.set(
          state === "FAILED"
            ? "#c95852"
            : state === "MUTATING"
              ? "#c6a248"
              : "#cce849"
        );
      }

      if (scanner.current) {
        scanner.current.visible =
          state === "EXECUTING" ||
          state === "MUTATING";

        scanner.current.position.y =
          -1.4 +
          ((Math.sin(
            time * 2
          ) + 1) /
            2) *
            2.8;
      }

      if (failureGroup.current) {
        const failed =
          state === "FAILED"
            ? 1
            : 0;

        const scale =
          THREE.MathUtils.lerp(
            failureGroup.current
              .scale.x,
            0.04 +
              failed * 0.96,
            Math.min(
              1,
              delta * 4
            )
          );

        failureGroup.current.scale.setScalar(
          scale
        );

        failureGroup.current.visible =
          scale > 0.06;
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
      scale={baseScale}
    >
      {/* ARCHITECTURE */}

      <group
        position={[
          0,
          0,
          -1,
        ]}
      >
        <ProductionTower
          x={-2.85}
          height={3.75}
        />

        <ProductionTower
          x={2.9}
          height={3.95}
        />

        <ProductionTower
          x={-1.95}
          height={2.35}
          opacity={0.17}
        />

        <ProductionTower
          x={1.95}
          height={2.6}
          opacity={0.17}
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
          color="#718a45"
          transparent
          opacity={0.08}
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
          color="#718a45"
          transparent
          opacity={0.12}
          lineWidth={1}
        />
      </group>

      {/* EXECUTION PATH */}

      <Line
        points={[
          [
            -3.6,
            0,
            0.08,
          ],
          [
            -2.45,
            0.08,
            0.16,
          ],
          [
            -1.15,
            -0.02,
            0.34,
          ],
          [
            0,
            0,
            0.62,
          ],
          [
            1.3,
            -0.05,
            0.32,
          ],
          [
            3.35,
            -0.1,
            0.08,
          ],
        ]}
        color={
          state === "FAILED"
            ? "#c95852"
            : "#cce849"
        }
        transparent
        opacity={0.21}
        lineWidth={1}
      />

      <mesh
        ref={packet}
        visible={false}
        position={[
          -3.3,
          0,
          0.25,
        ]}
      >
        <octahedronGeometry
          args={[
            0.11,
            1,
          ]}
        />

        <meshStandardMaterial
          color={
            state === "FAILED"
              ? "#c95852"
              : "#cce849"
          }
          emissive={
            state === "FAILED"
              ? "#c95852"
              : "#cce849"
          }
          emissiveIntensity={0.72}
          metalness={0.58}
          roughness={0.14}
        />
      </mesh>

      {/* PRODUCTION CORE */}

      <group
        position={[
          0,
          0,
          0.4,
        ]}
      >
        <mesh>
          <boxGeometry
            args={[
              1.28,
              2.72,
              0.34,
            ]}
          />

          <meshStandardMaterial
            color="#0b160d"
            metalness={0.76}
            roughness={0.2}
          />
        </mesh>

        <mesh
          position={[
            0,
            0,
            0.2,
          ]}
        >
          <boxGeometry
            args={[
              0.9,
              2.18,
              0.08,
            ]}
          />

          <meshStandardMaterial
            color="#071008"
            metalness={0.82}
            roughness={0.16}
          />
        </mesh>

        <mesh
          ref={mutationCore}
          position={[
            0,
            0,
            0.32,
          ]}
        >
          <octahedronGeometry
            args={[
              0.32,
              1,
            ]}
          />

          <meshStandardMaterial
            color="#cce849"
            emissive="#cce849"
            emissiveIntensity={0.56}
            metalness={0.7}
            roughness={0.13}
          />
        </mesh>

        <mesh
          position={[
            0,
            0.92,
            0.3,
          ]}
        >
          <boxGeometry
            args={[
              0.48,
              0.04,
              0.02,
            ]}
          />

          <meshBasicMaterial
            color="#cce849"
            transparent
            opacity={0.25}
          />
        </mesh>

        <mesh
          position={[
            0,
            -0.94,
            0.3,
          ]}
        >
          <boxGeometry
            args={[
              0.48,
              0.04,
              0.02,
            ]}
          />

          <meshBasicMaterial
            color="#8062dc"
            transparent
            opacity={0.22}
          />
        </mesh>
      </group>

      {/* SCANNER */}

      <mesh
        ref={scanner}
        visible={false}
        position={[
          0,
          -1.3,
          0.84,
        ]}
      >
        <boxGeometry
          args={[
            3.8,
            0.024,
            0.024,
          ]}
        />

        <meshBasicMaterial
          color="#cce849"
          transparent
          opacity={0.25}
        />
      </mesh>

      {/* FAILURE PROPAGATION */}

      <group
        ref={failureGroup}
        visible={false}
        scale={0.04}
      >
        <FailureBranch
          target={[
            2.25,
            1.1,
            0.22,
          ]}
        />

        <FailureBranch
          target={[
            2.85,
            0,
            0.14,
          ]}
        />

        <FailureBranch
          target={[
            2.28,
            -1.15,
            0.16,
          ]}
        />
      </group>

      {/* FLOOR */}

      <mesh
        position={[
          0,
          -1.68,
          -0.02,
        ]}
      >
        <boxGeometry
          args={[
            6.1,
            0.035,
            0.05,
          ]}
        />

        <meshBasicMaterial
          color={
            state === "FAILED"
              ? "#8d413b"
              : "#819944"
          }
          transparent
          opacity={0.28}
        />
      </mesh>
    </group>
  );
}

function ProductionTower({
  x,
  height,
  opacity = 0.44,
}: {
  x: number;
  height: number;
  opacity?: number;
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
          0.15,
        ]}
      />

      <meshStandardMaterial
        color="#0b170e"
        metalness={0.44}
        roughness={0.45}
        transparent
        opacity={opacity}
      />
    </mesh>
  );
}

function FailureBranch({
  target,
}: {
  target: [
    number,
    number,
    number,
  ];
}) {
  return (
    <>
      <Line
        points={[
          [
            0.25,
            0,
            0.65,
          ],
          target,
        ]}
        color="#c95852"
        transparent
        opacity={0.5}
        lineWidth={1}
      />

      <mesh
        position={target}
      >
        <sphereGeometry
          args={[
            0.105,
            18,
            18,
          ]}
        />

        <meshStandardMaterial
          color="#c95852"
          emissive="#c95852"
          emissiveIntensity={0.72}
        />
      </mesh>
    </>
  );
}

/* ======================================================
   DATA
====================================================== */

function completedFailureLogs(): ExecutionLog[] {
  return [
    {
      id: 1,
      label:
        "Authority lease",
      detail:
        "Execution authority verified.",
      status:
        "SUCCESS",
      time:
        "00:00:01",
    },
    {
      id: 2,
      label:
        "Production connection",
      detail:
        "Production connection established under CAIROS lease.",
      status:
        "SUCCESS",
      time:
        "00:00:02",
    },
    {
      id: 3,
      label:
        "File classification",
      detail:
        "18 files classified as unused; dependency evidence was incomplete for one production path.",
      status:
        "WARNING",
      time:
        "00:00:03",
    },
    {
      id: 4,
      label:
        "Delete operation",
      detail:
        "18 file mutations committed.",
      status:
        "SUCCESS",
      time:
        "00:00:04",
    },
    {
      id: 5,
      label:
        "Production verification",
      detail:
        "Downstream production dependency failed. Trace frozen for causal replay.",
      status:
        "FAILED",
      time:
        "00:00:05",
    },
  ];
}

function wait(
  ms: number
) {
  return new Promise<void>(
    (resolve) => {
      window.setTimeout(
        resolve,
        ms
      );
    }
  );
}

function timeNow() {
  return new Date()
    .toLocaleTimeString(
      [],
      {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }
    );
}

function asRecord(
  value: unknown
): Record<
  string,
  unknown
> {
  if (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  ) {
    return value as Record<
      string,
      unknown
    >;
  }

  return {};
}

function stringValue(
  value: unknown,
  fallback: string
) {
  return typeof value ===
      "string" &&
    value.trim().length > 0
    ? value
    : fallback;
}

function nullableString(
  value: unknown
) {
  return typeof value ===
      "string" &&
    value.trim().length > 0
    ? value
    : null;
}

function numberValue(
  value: unknown,
  fallback: number
) {
  return typeof value ===
      "number" &&
    Number.isFinite(value)
    ? value
    : fallback;
}

function decisionValue(
  value: unknown,
  fallback: Decision
): Decision {
  if (
    value === "ALLOW" ||
    value === "ASK" ||
    value === "BLOCK"
  ) {
    return value;
  }

  return fallback;
}