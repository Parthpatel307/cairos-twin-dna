"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import Link from "next/link";

import {
  ArrowRight,
  Check,
  Clock3,
  LockKeyhole,
  ShieldCheck,
  UserCheck,
  X,
} from "lucide-react";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  getCurrentUser,
} from "@/lib/auth";

import {
  getDemoSession,
  saveDemoSession,
} from "@/lib/demo-session";

const DISPLAY_FONT =
  "'Arial Narrow', 'Roboto Condensed', Haettenschweiler, Impact, sans-serif";

type ApprovalState =
  | "PENDING"
  | "PROCESSING"
  | "APPROVED"
  | "DENIED";

interface AuthorityIdentity {
  name: string;
  role: string;
  simulated: boolean;
  canAuthorize: boolean;
}

export default function ApprovalsPage() {
  const timersRef =
    useRef<number[]>(
      []
    );

  const [
    session,
    setSession,
  ] =
    useState<Record<
      string,
      unknown
    > | null>(
      null
    );

  const [
    identity,
    setIdentity,
  ] =
    useState<AuthorityIdentity>({
      name:
        "Demo Reviewer",

      role:
        "SIMULATED AUTHORITY",

      simulated:
        true,

      canAuthorize:
        true,
    });

  const [
    approvalState,
    setApprovalState,
  ] =
    useState<ApprovalState>(
      "PENDING"
    );

  useEffect(() => {
    let raw:
      | Record<
          string,
          unknown
        >
      | null =
      null;

    try {
      raw =
        getDemoSession() as unknown as
          | Record<
              string,
              unknown
            >
          | null;

      setSession(
        raw
      );

      const existingStatus =
        resolveString(
          raw?.approvalStatus,
          ""
        ).toUpperCase();

      if (
        existingStatus ===
        "APPROVED"
      ) {
        setApprovalState(
          "APPROVED"
        );
      } else if (
        existingStatus ===
        "DENIED"
      ) {
        setApprovalState(
          "DENIED"
        );
      }
    } catch {
      setSession(
        null
      );
    }

    try {
      const currentUser =
        getCurrentUser() as unknown as
          | Record<
              string,
              unknown
            >
          | null;

      setIdentity(
        resolveAuthority(
          currentUser
        )
      );
    } catch {
      setIdentity({
        name:
          "Demo Reviewer",

        role:
          "SIMULATED AUTHORITY",

        simulated:
          true,

        canAuthorize:
          true,
      });
    }

    return () => {
      timersRef.current.forEach(
        (
          timer
        ) =>
          window.clearTimeout(
            timer
          )
      );
    };
  }, []);

  const request =
    resolveString(
      session?.request,
      "Clean unused files from production server"
    );

  const risk =
    resolveNumber(
      session?.riskScore,
      resolveNestedNumber(
        session,
        "simulation",
        "risk_score",
        78
      )
    );

  const blast =
    resolveNumber(
      session?.blastRadius,
      resolveNestedNumber(
        session,
        "simulation",
        "blast_radius",
        3
      )
    );

  const decision =
    resolveString(
      session?.decision,
      resolveNestedString(
        session,
        "simulation",
        "decision",
        "ASK"
      )
    );

  const reason =
    resolveNestedString(
      session,
      "simulation",
      "reason",
      "The action touches production systems and has a non-trivial downstream blast radius. Human confirmation is required."
    );

  const accent =
    approvalState ===
    "APPROVED"
      ? "#cce849"
      : approvalState ===
          "DENIED"
        ? "#cf5650"
        : "#d0a844";

  const approve =
    () => {
      if (
        !identity.canAuthorize ||
        approvalState ===
          "PROCESSING"
      ) {
        return;
      }

      setApprovalState(
        "PROCESSING"
      );

      const timer =
        window.setTimeout(
          () => {
            const timestamp =
              new Date().toISOString();

            try {
              const current =
                getDemoSession() as unknown as
                  | Record<
                      string,
                      unknown
                    >
                  | null;

              saveDemoSession(
                {
                  ...(current ??
                    {}),

                  approved:
                    true,

                  authorityApproved:
                    true,

                  approvalStatus:
                    "APPROVED",

                  reviewerName:
                    identity.name,

                  reviewerRole:
                    identity.role,

                  approvalTimestamp:
                    timestamp,

                  approval: {
                    status:
                      "APPROVED",

                    reviewerName:
                      identity.name,

                    reviewerRole:
                      identity.role,

                    simulated:
                      identity.simulated,

                    timestamp,
                  },
                } as never
              );
            } catch {
              // Demo persistence should not block UI.
            }

            setApprovalState(
              "APPROVED"
            );
          },
          1200
        );

      timersRef.current.push(
        timer
      );
    };

  const deny =
    () => {
      if (
        !identity.canAuthorize ||
        approvalState ===
          "PROCESSING"
      ) {
        return;
      }

      const timestamp =
        new Date().toISOString();

      try {
        const current =
          getDemoSession() as unknown as
            | Record<
                string,
                unknown
              >
            | null;

        saveDemoSession(
          {
            ...(current ??
              {}),

            approved:
              false,

            authorityApproved:
              false,

            approvalStatus:
              "DENIED",

            reviewerName:
              identity.name,

            reviewerRole:
              identity.role,

            approvalTimestamp:
              timestamp,

            approval: {
              status:
                "DENIED",

              reviewerName:
                identity.name,

              reviewerRole:
                identity.role,

              simulated:
                identity.simulated,

              timestamp,
            },
          } as never
        );
      } catch {
        // Demo persistence should not block UI.
      }

      setApprovalState(
        "DENIED"
      );
    };

  const resetDecision =
    () => {
      if (
        approvalState ===
        "PROCESSING"
      ) {
        return;
      }

      setApprovalState(
        "PENDING"
      );
    };

  const statusLabel =
    approvalState ===
    "PROCESSING"
      ? "VERIFYING AUTHORITY"
      : approvalState ===
          "APPROVED"
        ? "AUTHORITY GRANTED"
        : approvalState ===
            "DENIED"
          ? "EXECUTION CLOSED"
          : "HUMAN DECISION REQUIRED";

  return (
    <main className="relative min-h-screen overflow-x-clip bg-[#050705] text-[#efefe5]">
      <section className="relative p-3 sm:p-5">
        <div className="relative mx-auto min-h-[calc(100svh-110px)] max-w-[1500px] overflow-hidden rounded-[30px] border border-white/[0.075] bg-[#071008]">
          {/* WORLD */}

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background: [
                `radial-gradient(circle at 77% 42%,${hexToRgba(
                  accent,
                  0.11
                )},transparent 29%)`,

                "linear-gradient(105deg,rgba(3,7,4,.995) 0%,rgba(4,8,4,.98) 45%,rgba(18,18,8,.72) 100%)",
              ].join(","),
            }}
          />

          {/* ARCHITECTURE */}

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-[2]"
          >
            <div className="absolute bottom-[12%] left-[49%] top-[13%] w-px bg-white/[0.025]" />

            <div className="absolute bottom-[13%] right-[11%] top-[11%] w-px bg-[#c6a248]/[0.05]" />

            <div className="absolute bottom-[16%] left-[46%] right-[6%] border-t border-[#c6a248]/[0.07]" />

            <div className="absolute right-[7%] top-[20%] h-[54%] w-[44%] border border-white/[0.025]" />
          </div>

          {/* CHAPTER */}

          <div className="absolute left-[4.8vw] top-[7.5vh] z-40 flex items-center gap-5">
            <span className="text-[7px] font-black tracking-[0.17em] text-[#d0a844]">
              03 / HUMAN AUTHORITY
            </span>

            <span className="h-px w-12 bg-[#d0a844]/30" />

            <span className="text-[6px] font-black tracking-[0.14em] text-white/20">
              ACCOUNTABLE DECISION
            </span>
          </div>

          {/* =====================================
              HEADLINE

              HARD FIX:
              - exactly 2 visual lines
              - second line never wraps
              - smaller max size
              - docket begins well below it
          ===================================== */}

          <div className="absolute left-[4.8vw] top-[13.8vh] z-30 w-[min(820px,52vw)]">
            <AnimatePresence
              mode="wait"
              initial={false}
            >
              <motion.div
                key={
                  approvalState
                }
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

                  y:
                    -10,
                }}
                transition={{
                  duration:
                    0.38,
                }}
              >
                <h1
                  className="uppercase"
                  style={{
                    fontFamily:
                      DISPLAY_FONT,

                    fontWeight:
                      900,

                    fontSize:
                      "clamp(42px,3.75vw,68px)",

                    lineHeight:
                      0.82,

                    letterSpacing:
                      "-0.056em",
                  }}
                >
                  {approvalState ===
                  "APPROVED" ? (
                    <>
                      <span className="block whitespace-nowrap text-[#efefe5]">
                        HUMAN
                      </span>

                      <span className="block whitespace-nowrap text-[#cce849]">
                        AUTHORITY HOLDS.
                      </span>
                    </>
                  ) : approvalState ===
                    "DENIED" ? (
                    <>
                      <span className="block whitespace-nowrap text-[#efefe5]">
                        THE GATE
                      </span>

                      <span className="block whitespace-nowrap text-[#cf5650]">
                        STAYS CLOSED.
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="block whitespace-nowrap text-[#efefe5]">
                        A HUMAN
                      </span>

                      <span className="block whitespace-nowrap text-[#d0a844]">
                        HOLDS THE GATE.
                      </span>
                    </>
                  )}
                </h1>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* =====================================
              AUTHORITY DOCKET

              HARD SEPARATION:
              starts at 30vh only after compact
              2-line headline has fully ended.
          ===================================== */}

          <div className="absolute left-[4.8vw] top-[30vh] z-50 w-[min(690px,48vw)]">
            <div className="overflow-hidden rounded-[20px] bg-[#dfddd1] text-[#11150f] shadow-[0_35px_120px_rgba(0,0,0,.5)]">
              {/* HEADER */}

              <div className="flex items-center justify-between gap-6 border-b border-black/11 px-7 py-4">
                <div>
                  <p className="text-[5px] font-black tracking-[0.16em] text-black/30">
                    CAIROS / AUTHORITY DOCKET
                  </p>

                  <p
                    className="mt-2 text-[6px] font-black tracking-[0.11em]"
                    style={{
                      color:
                        accent,
                    }}
                  >
                    {
                      statusLabel
                    }
                  </p>
                </div>

                <div className="rounded-[6px] bg-[#11150f] px-4 py-3">
                  <span
                    className="text-[6px] font-black tracking-[0.1em]"
                    style={{
                      color:
                        accent,
                    }}
                  >
                    {approvalState ===
                    "PENDING"
                      ? "ASK"
                      : approvalState}
                  </span>
                </div>
              </div>

              {/* BODY */}

              <div className="px-7 py-5">
                <p className="text-[5px] font-black tracking-[0.14em] text-black/24">
                  PROPOSED ACTION
                </p>

                <p className="mt-4 text-[16px] font-black leading-6 tracking-[-0.025em]">
                  {
                    request
                  }
                </p>

                <div className="mt-5 grid grid-cols-3 border-y border-black/10">
                  <AuthorityMetric
                    label="RISK"
                    value={`${risk}`}
                    color="#bd4e48"
                  />

                  <AuthorityMetric
                    label="BLAST"
                    value={`${blast}`}
                    color="#bd4e48"
                  />

                  <AuthorityMetric
                    label="DECISION"
                    value={
                      decision
                    }
                    color="#9b7924"
                  />
                </div>

                <p className="mt-4 text-[8px] leading-5 text-black/42">
                  {
                    reason
                  }
                </p>

                {!identity.canAuthorize && (
                  <div className="mt-4 rounded-[10px] border border-[#b68a2f]/20 bg-[#b68a2f]/[0.06] px-4 py-3">
                    <p className="text-[6px] font-black leading-4 tracking-[0.08em] text-[#85661f]">
                      OPERATOR ACCESS / INSPECT ONLY — REVIEWER OR ADMIN AUTHORITY IS REQUIRED.
                    </p>
                  </div>
                )}
              </div>

              {/* ACTIONS */}

              <div className="border-t border-black/11 p-3">
                {approvalState ===
                "APPROVED" ? (
                  <Link
                    href="/executions"
                    className="group flex min-h-[56px] w-full items-center justify-center gap-4 rounded-full bg-[#11150f] px-7 text-[8px] font-black tracking-[0.1em] text-white transition hover:bg-[#182018]"
                  >
                    <Check
                      size={13}
                      className="text-[#cce849]"
                    />

                    CONTINUE TO EXECUTION

                    <ArrowRight
                      size={13}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </Link>
                ) : approvalState ===
                  "DENIED" ? (
                  <button
                    type="button"
                    onClick={
                      resetDecision
                    }
                    className="flex min-h-[56px] w-full items-center justify-center gap-4 rounded-full bg-[#11150f] px-7 text-[8px] font-black tracking-[0.1em] text-white"
                  >
                    RETURN TO REVIEW
                  </button>
                ) : (
                  <div className="grid gap-2 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={
                        deny
                      }
                      disabled={
                        !identity.canAuthorize ||
                        approvalState ===
                          "PROCESSING"
                      }
                      className="flex min-h-[56px] items-center justify-center gap-4 rounded-full border border-black/12 px-7 text-[8px] font-black tracking-[0.1em] text-black/44 transition hover:bg-black/[0.035] hover:text-black/70 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <X
                        size={12}
                      />

                      DENY ACTION
                    </button>

                    <button
                      type="button"
                      onClick={
                        approve
                      }
                      disabled={
                        !identity.canAuthorize ||
                        approvalState ===
                          "PROCESSING"
                      }
                      className="flex min-h-[56px] items-center justify-center gap-4 rounded-full bg-[#11150f] px-7 text-[8px] font-black tracking-[0.1em] text-white transition hover:bg-[#182018] disabled:cursor-not-allowed disabled:opacity-45"
                    >
                      {approvalState ===
                      "PROCESSING" ? (
                        <Clock3
                          size={12}
                          className="animate-pulse text-[#d0a844]"
                        />
                      ) : (
                        <UserCheck
                          size={12}
                          className="text-[#d0a844]"
                        />
                      )}

                      {approvalState ===
                      "PROCESSING"
                        ? "VERIFYING AUTHORITY"
                        : "AUTHORIZE ACTION"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* =====================================
              AUTHORITY MACHINE
          ===================================== */}

          <div className="pointer-events-none absolute bottom-[11vh] right-[5.1vw] top-[24vh] z-30 hidden w-[43%] lg:block">
            <AuthorityMachine
              state={
                approvalState
              }
              accent={
                accent
              }
            />
          </div>

          {/* REVIEWER */}

          <div className="absolute right-[5.1vw] top-[13vh] z-40 hidden w-[310px] xl:block">
            <div className="border-t border-white/[0.1] pt-5">
              <div className="flex items-center gap-3">
                <UserCheck
                  size={12}
                  style={{
                    color:
                      accent,
                  }}
                />

                <span className="text-[5px] font-black tracking-[0.15em] text-white/20">
                  REVIEWER
                </span>
              </div>

              <p className="mt-5 text-[15px] font-black text-white/74">
                {
                  identity.name
                }
              </p>

              <p
                className="mt-2 text-[6px] font-black tracking-[0.11em]"
                style={{
                  color:
                    identity.simulated
                      ? "#d0a844"
                      : "#cce849",
                }}
              >
                {
                  identity.role
                }
              </p>

              {identity.simulated && (
                <div className="mt-5 rounded-[11px] border border-[#d0a844]/20 bg-[#d0a844]/[0.045] px-4 py-4">
                  <p className="text-[6px] font-black leading-5 tracking-[0.08em] text-[#d0a844]/75">
                    DEMO REVIEWER — SIMULATED AUTHORITY, NOT REAL AUTHENTICATION.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* FACTS */}

          <div className="absolute bottom-[8.5vh] right-[5.1vw] z-40 hidden w-[310px] xl:block">
            <AuthorityFact
              icon={
                LockKeyhole
              }
              label="AUTONOMOUS GATE"
              value={
                approvalState ===
                "APPROVED"
                  ? "OPEN"
                  : "CLOSED"
              }
              color={
                approvalState ===
                "APPROVED"
                  ? "#cce849"
                  : "#d0a844"
              }
            />

            <AuthorityFact
              icon={
                ShieldCheck
              }
              label="HUMAN AUTHORITY"
              value={
                identity.canAuthorize
                  ? "AVAILABLE"
                  : "INSPECT ONLY"
              }
              color={
                identity.canAuthorize
                  ? "#d0a844"
                  : "#cf5650"
              }
            />

            <AuthorityFact
              icon={
                UserCheck
              }
              label="DECISION"
              value={
                approvalState
              }
              color={
                accent
              }
            />
          </div>

          {/* TOP STATUS */}

          <div className="absolute right-[4.8vw] top-[7vh] z-50 flex items-center gap-3">
            <span
              className={`h-[6px] w-[6px] rounded-full ${
                approvalState ===
                "PROCESSING"
                  ? "animate-pulse"
                  : ""
              }`}
              style={{
                backgroundColor:
                  accent,
              }}
            />

            <span
              className="text-[6px] font-black tracking-[0.14em]"
              style={{
                color:
                  accent,
              }}
            >
              {
                statusLabel
              }
            </span>
          </div>

          {/* FOOT */}

          <div className="pointer-events-none absolute bottom-5 left-8 right-8 z-[60] flex items-center gap-4">
            <span
              className="h-px flex-1"
              style={{
                backgroundColor:
                  hexToRgba(
                    accent,
                    0.16
                  ),
              }}
            />

            <span className="text-[6px] font-black tracking-[0.15em] text-white/17">
              STEP 03 / HUMAN AUTHORITY
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}

function AuthorityMachine({
  state,
  accent,
}: {
  state:
    ApprovalState;

  accent:
    string;
}) {
  const approved =
    state ===
    "APPROVED";

  const denied =
    state ===
    "DENIED";

  const processing =
    state ===
    "PROCESSING";

  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-[7%] border border-white/[0.035]" />

      <div className="absolute left-[14%] right-[8%] top-1/2 h-px bg-white/[0.06]" />

      <motion.div
        animate={{
          width:
            approved
              ? "72%"
              : "43%",
        }}
        transition={{
          duration:
            0.65,
        }}
        className="absolute left-[8%] top-1/2 h-px -translate-y-1/2"
        style={{
          backgroundColor:
            hexToRgba(
              accent,
              approved
                ? 0.55
                : 0.25
            ),
        }}
      />

      <motion.div
        animate={{
          left:
            approved
              ? "72%"
              : "38%",

          rotate:
            approved
              ? 135
              : 45,

          backgroundColor:
            denied
              ? "#cf5650"
              : approved
                ? "#cce849"
                : "#d0a844",

          scale:
            processing
              ? [
                  0.92,
                  1.08,
                  0.92,
                ]
              : 1,
        }}
        transition={{
          left: {
            duration:
              0.75,
          },

          scale: {
            duration:
              1,

            repeat:
              processing
                ? Infinity
                : 0,
          },
        }}
        className="absolute top-1/2 h-[74px] w-[74px] -translate-x-1/2 -translate-y-1/2"
      />

      <motion.div
        animate={{
          left:
            approved
              ? "48%"
              : "55%",
        }}
        className="absolute top-[18%] h-[64%] w-[18px] bg-black/90"
      />

      <motion.div
        animate={{
          right:
            approved
              ? "27%"
              : "35%",
        }}
        className="absolute top-[18%] h-[64%] w-[18px] bg-black/90"
      />

      <motion.div
        animate={{
          opacity:
            approved
              ? 0.75
              : 0.38,
        }}
        className="absolute left-[48%] right-[27%] top-[35%] h-[7px]"
        style={{
          backgroundColor:
            accent,
        }}
      />

      <motion.div
        animate={{
          opacity:
            approved
              ? 0.75
              : 0.24,
        }}
        className="absolute left-[48%] right-[27%] bottom-[35%] h-[7px]"
        style={{
          backgroundColor:
            accent,
        }}
      />

      <AnimatePresence>
        {processing && (
          <motion.div
            initial={{
              left:
                "47%",

              opacity:
                0,
            }}
            animate={{
              left: [
                "47%",
                "75%",
                "47%",
              ],

              opacity:
                0.5,
            }}
            exit={{
              opacity:
                0,
            }}
            transition={{
              duration:
                1.25,

              repeat:
                Infinity,

              ease:
                "linear",
            }}
            className="absolute top-[22%] h-[56%] w-px bg-[#d0a844]"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {approved && (
          <motion.div
            initial={{
              opacity:
                0,

              scale:
                0.35,
            }}
            animate={{
              opacity:
                1,

              scale:
                1,
            }}
            className="absolute right-[8%] top-1/2 h-[25px] w-[25px] -translate-y-1/2 rotate-45 bg-[#cce849]"
          />
        )}
      </AnimatePresence>

      <div className="absolute bottom-[8%] left-[10%]">
        <p className="text-[5px] font-black tracking-[0.15em] text-white/18">
          AUTHORITY BOUNDARY
        </p>

        <p
          className="mt-3 text-[7px] font-black tracking-[0.1em]"
          style={{
            color:
              accent,
          }}
        >
          {approved
            ? "GATE OPEN / EXECUTION AUTHORIZED"
            : denied
              ? "GATE CLOSED / REQUEST DENIED"
              : processing
                ? "VERIFYING HUMAN AUTHORITY"
                : "AUTONOMY STOPS HERE"}
        </p>
      </div>
    </div>
  );
}

function AuthorityMetric({
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
    <div className="border-r border-black/10 py-4 pr-4 last:border-r-0 last:pl-4 [&:nth-child(2)]:px-4">
      <p className="text-[5px] font-black tracking-[0.13em] text-black/22">
        {
          label
        }
      </p>

      <p
        className="mt-2 text-[7px] font-black tracking-[0.09em]"
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

function AuthorityFact({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon:
    typeof ShieldCheck;

  label:
    string;

  value:
    string;

  color:
    string;
}) {
  return (
    <div className="flex items-center justify-between gap-6 border-t border-white/[0.08] py-4">
      <div className="flex items-center gap-3">
        <Icon
          size={11}
          style={{
            color,
          }}
        />

        <span className="text-[5px] font-black tracking-[0.12em] text-white/20">
          {
            label
          }
        </span>
      </div>

      <span
        className="text-[5px] font-black tracking-[0.1em]"
        style={{
          color,
        }}
      >
        {
          value
        }
      </span>
    </div>
  );
}

function resolveAuthority(
  user:
    | Record<
        string,
        unknown
      >
    | null
): AuthorityIdentity {
  if (
    !user
  ) {
    return {
      name:
        "Demo Reviewer",

      role:
        "SIMULATED AUTHORITY",

      simulated:
        true,

      canAuthorize:
        true,
    };
  }

  const role =
    resolveString(
      user.role,
      "OPERATOR"
    ).toUpperCase();

  const name =
    resolveString(
      user.name,
      resolveString(
        user.email,
        "Signed-in user"
      )
    );

  return {
    name,

    role,

    simulated:
      false,

    canAuthorize:
      role ===
        "REVIEWER" ||
      role ===
        "ADMIN",
  };
}

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

function resolveNestedString(
  parent:
    | Record<
        string,
        unknown
      >
    | null,

  objectKey:
    string,

  valueKey:
    string,

  fallback:
    string
) {
  const nested =
    asRecord(
      parent?.[
        objectKey
      ]
    );

  return resolveString(
    nested?.[
      valueKey
    ],
    fallback
  );
}

function resolveNestedNumber(
  parent:
    | Record<
        string,
        unknown
      >
    | null,

  objectKey:
    string,

  valueKey:
    string,

  fallback:
    number
) {
  const nested =
    asRecord(
      parent?.[
        objectKey
      ]
    );

  return resolveNumber(
    nested?.[
      valueKey
    ],
    fallback
  );
}

function resolveString(
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

function resolveNumber(
  value:
    unknown,

  fallback:
    number
) {
  if (
    typeof value ===
      "number" &&
    Number.isFinite(
      value
    )
  ) {
    return value;
  }

  if (
    typeof value ===
    "string"
  ) {
    const parsed =
      Number(
        value
      );

    if (
      Number.isFinite(
        parsed
      )
    ) {
      return parsed;
    }
  }

  return fallback;
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