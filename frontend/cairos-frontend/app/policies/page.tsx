"use client";

import {
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import {
  ArrowRight,
  Check,
  CircleAlert,
  Database,
  Eye,
  Fingerprint,
  Globe2,
  LockKeyhole,
  Network,
  Server,
  ShieldCheck,
  TriangleAlert,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import {
  motion,
} from "framer-motion";

const DISPLAY_FONT =
  "'Arial Narrow', 'Roboto Condensed', Haettenschweiler, Impact, sans-serif";

type PolicyPosture =
  | "ALLOW"
  | "ASK_HUMAN"
  | "BLOCK";

type PolicyTone =
  | "lime"
  | "gold"
  | "red"
  | "purple";

interface PolicyDefinition {
  id: string;
  code: string;
  title: string;
  shortTitle: string;
  description: string;
  scope: string;
  trigger: string;
  evidence: string;
  posture: PolicyPosture;
  effect: string;
  tone: PolicyTone;
  icon: LucideIcon;
}

const POLICIES: PolicyDefinition[] = [
  {
    id:
      "prod-destructive",

    code:
      "POL-01",

    title:
      "Destructive Production Actions",

    shortTitle:
      "Destructive production",

    description:
      "Production mutations with destructive or irreversible effects require explicit authority before execution can proceed.",

    scope:
      "Production systems",

    trigger:
      "Delete, purge, destroy, revoke, overwrite or equivalent destructive mutation.",

    evidence:
      "Intent, target scope, reversibility, affected systems and human authority when required.",

    posture:
      "ASK_HUMAN",

    effect:
      "Hold execution until valid authority exists.",

    tone:
      "gold",

    icon:
      LockKeyhole,
  },

  {
    id:
      "dependency-proof",

    code:
      "POL-02",

    title:
      "Dependency Evidence Requirement",

    shortTitle:
      "Dependency evidence",

    description:
      "A destructive classification must not be treated as safe when dependency evidence is incomplete or unresolved.",

    scope:
      "Agent Twin + Risk",

    trigger:
      "A target is classified as unused, redundant or safe to remove.",

    evidence:
      "Complete dependency graph or equivalent evidence supporting the classification.",

    posture:
      "BLOCK",

    effect:
      "Fail closed when dependency evidence is incomplete.",

    tone:
      "red",

    icon:
      Database,
  },

  {
    id:
      "external-boundary",

    code:
      "POL-03",

    title:
      "External Boundary Control",

    shortTitle:
      "External boundary",

    description:
      "Actions that cross a trusted system boundary require explicit scope and destination verification.",

    scope:
      "Network + external tools",

    trigger:
      "Outbound network call, third-party service access or external data transfer.",

    evidence:
      "Destination, purpose, data scope and registered capability.",

    posture:
      "ASK_HUMAN",

    effect:
      "Request authority when the boundary is sensitive or the scope expands.",

    tone:
      "purple",

    icon:
      Globe2,
  },

  {
    id:
      "registered-tool",

    code:
      "POL-04",

    title:
      "Registered Tool Requirement",

    shortTitle:
      "Registered tools only",

    description:
      "Execution may only use capabilities registered with the execution gateway. Unknown tools never receive implicit authority.",

    scope:
      "Execution gateway",

    trigger:
      "Agent attempts to invoke a tool or capability.",

    evidence:
      "Registered tool identity and permitted operation.",

    posture:
      "BLOCK",

    effect:
      "Fail closed when no registered execution capability exists.",

    tone:
      "red",

    icon:
      Wrench,
  },

  {
    id:
      "read-only",

    code:
      "POL-05",

    title:
      "Bounded Read Operations",

    shortTitle:
      "Bounded reads",

    description:
      "Low-impact read-only operations may proceed when target scope and permission evidence are valid.",

    scope:
      "Read-only inspection",

    trigger:
      "Status checks, bounded reads and non-mutating inspection.",

    evidence:
      "Authorized target, bounded scope and non-mutating action.",

    posture:
      "ALLOW",

    effect:
      "Permit execution while preserving Black Box observability.",

    tone:
      "lime",

    icon:
      Eye,
  },
];

const TONE = {
  lime: {
    accent:
      "#cce849",

    soft:
      "rgba(204,232,73,.08)",

    border:
      "rgba(204,232,73,.18)",
  },

  gold: {
    accent:
      "#c6a248",

    soft:
      "rgba(198,162,72,.08)",

    border:
      "rgba(198,162,72,.18)",
  },

  red: {
    accent:
      "#c95852",

    soft:
      "rgba(201,88,82,.08)",

    border:
      "rgba(201,88,82,.18)",
  },

  purple: {
    accent:
      "#8062dc",

    soft:
      "rgba(128,98,220,.08)",

    border:
      "rgba(128,98,220,.18)",
  },
};

export default function PoliciesPage() {
  const [
    selectedId,
    setSelectedId,
  ] =
    useState(
      POLICIES[0].id
    );

  const selected =
    useMemo(
      () =>
        POLICIES.find(
          (
            policy
          ) =>
            policy.id ===
            selectedId
        ) ??
        POLICIES[0],

      [
        selectedId,
      ]
    );

  const selectedTone =
    TONE[
      selected.tone
    ];

  return (
    <main className="relative min-h-screen overflow-x-clip bg-[#050705] text-[#efefe5]">
      {/* ==================================================
          HERO
      ================================================== */}

      <section className="relative p-3 sm:p-5">
        <div className="relative min-h-[720px] overflow-hidden rounded-[30px] border border-white/[0.09] bg-[#07110a]">
          {/* WORLD */}

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                [
                  "linear-gradient(90deg,rgba(5,7,5,.99) 0%,rgba(5,8,6,.96) 38%,rgba(7,24,14,.62) 72%,rgba(8,28,15,.78) 100%)",
                  "radial-gradient(circle at 76% 30%,rgba(204,232,73,.08),transparent 28%)",
                  "radial-gradient(circle at 78% 72%,rgba(128,98,220,.07),transparent 34%)",
                ].join(
                  ","
                ),
            }}
          />

          {/* GRID */}

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage:
                [
                  "linear-gradient(rgba(255,255,255,.05) 1px,transparent 1px)",
                  "linear-gradient(90deg,rgba(255,255,255,.05) 1px,transparent 1px)",
                ].join(
                  ","
                ),

              backgroundSize:
                "78px 78px",
            }}
          />

          {/* GIANT TYPE */}

          <div className="pointer-events-none absolute inset-x-0 bottom-[-4vw] overflow-hidden">
            <p
              className="whitespace-nowrap text-center uppercase"
              style={{
                fontFamily:
                  DISPLAY_FONT,

                fontWeight:
                  900,

                fontSize:
                  "clamp(140px,20vw,340px)",

                lineHeight:
                  0.66,

                letterSpacing:
                  "-0.07em",

                color:
                  "rgba(204,232,73,.045)",
              }}
            >
              POLICY
            </p>
          </div>

          {/* TOP */}

          <div className="absolute left-[4.5vw] right-[4.5vw] top-[6vh] z-30 flex items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <ShieldCheck
                size={13}
                className="text-[#cce849]"
              />

              <span className="text-[7px] font-black tracking-[0.16em] text-white/34">
                GOVERNANCE CONTRACT
              </span>
            </div>

            <div className="hidden items-center gap-3 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-[#cce849]" />

              <span className="text-[6px] font-black tracking-[0.14em] text-[#cce849]/70">
                READ-ONLY FRONTEND VIEW
              </span>
            </div>
          </div>

          {/* HEADLINE */}

          <div className="absolute left-[4.5vw] top-[16vh] z-20 w-[min(720px,82vw)]">
            <div className="flex items-center gap-4">
              <span className="text-[7px] font-black tracking-[0.18em] text-[#cce849]">
                POLICIES
              </span>

              <span className="h-px w-10 bg-[#cce849]/28" />

              <span className="text-[7px] font-black tracking-[0.14em] text-white/24">
                EXECUTION BOUNDARIES
              </span>
            </div>

            <motion.div
              initial={{
                opacity:
                  0,

                y:
                  20,
              }}
              animate={{
                opacity:
                  1,

                y:
                  0,
              }}
              transition={{
                duration:
                  0.5,
              }}
            >
              <h1
                className="mt-7 uppercase"
                style={{
                  fontFamily:
                    DISPLAY_FONT,

                  fontWeight:
                    900,

                  fontSize:
                    "clamp(52px,6.2vw,108px)",

                  lineHeight:
                    0.78,

                  letterSpacing:
                    "-0.06em",
                }}
              >
                <span className="block text-[#efefe5]">
                  AUTHORITY
                </span>

                <span className="block text-[#cce849]">
                  HAS TERMS.
                </span>
              </h1>
            </motion.div>

            <p className="mt-7 max-w-[470px] text-[10px] leading-6 text-white/38">
              Policies define the evidence and authority conditions
              CAIROS expects before an autonomous action may touch
              reality.
            </p>
          </div>

          {/* GOVERNANCE MACHINE */}

          <div className="absolute right-[4.5vw] top-[18vh] z-20 hidden w-[min(510px,40vw)] xl:block">
            <div className="relative min-h-[390px]">
              <div className="absolute left-1/2 top-1/2 h-[310px] w-[310px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#cce849]/10" />

              <div className="absolute left-1/2 top-1/2 h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.06]" />

              <div className="absolute left-1/2 top-1/2 flex h-[118px] w-[118px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#cce849]/16 bg-[#0c170d] shadow-[0_0_90px_rgba(204,232,73,.08)]">
                <Fingerprint
                  size={31}
                  className="text-[#cce849]"
                />
              </div>

              <PolicyOrbitLabel
                className="left-0 top-[42px]"
                index="01"
                label="INTENT"
              />

              <PolicyOrbitLabel
                className="right-0 top-[92px]"
                index="02"
                label="PERMISSION"
              />

              <PolicyOrbitLabel
                className="bottom-[74px] left-[28px]"
                index="03"
                label="RISK"
              />

              <PolicyOrbitLabel
                className="bottom-[26px] right-[42px]"
                index="04"
                label="AUTHORITY"
              />

              <div className="absolute left-1/2 top-[34px] h-[102px] w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[#cce849]/24 to-transparent" />

              <div className="absolute bottom-[30px] left-1/2 h-[102px] w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[#8062dc]/20 to-transparent" />

              <div className="absolute left-[66px] top-1/2 h-px w-[135px] -translate-y-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              <div className="absolute right-[66px] top-1/2 h-px w-[135px] -translate-y-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>
          </div>

          {/* STATUS RAIL */}

          <div className="absolute bottom-[6vh] left-[4.5vw] right-[4.5vw] z-20 grid gap-px overflow-hidden rounded-[18px] bg-white/[0.07] sm:grid-cols-3">
            <HeroMetric
              label="POLICIES"
              value="05"
              detail="REFERENCE RULES"
            />

            <HeroMetric
              label="DEFAULT SAFETY"
              value="FAIL CLOSED"
              detail="UNKNOWN CAPABILITY"
            />

            <HeroMetric
              label="RUNTIME AUTHORITY"
              value="BACKEND"
              detail="NO FRONTEND DECISION"
            />
          </div>
        </div>
      </section>

      {/* ==================================================
          POLICY BOARD
      ================================================== */}

      <section className="relative p-3 pt-0 sm:p-5 sm:pt-0">
        <div className="mx-auto max-w-[1480px] overflow-hidden rounded-[30px] border border-white/[0.09] bg-[#07110a]">
          {/* HEADER */}

          <div className="grid gap-8 border-b border-white/[0.08] px-8 py-9 sm:px-12 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <div className="flex items-center gap-4">
                <span className="text-[7px] font-black tracking-[0.17em] text-[#cce849]">
                  POLICY MATRIX
                </span>

                <span className="h-px w-10 bg-[#cce849]/28" />
              </div>

              <h2
                className="mt-5 uppercase"
                style={{
                  fontFamily:
                    DISPLAY_FONT,

                  fontWeight:
                    900,

                  fontSize:
                    "clamp(42px,4.8vw,82px)",

                  lineHeight:
                    0.8,

                  letterSpacing:
                    "-0.055em",
                }}
              >
                <span className="block">
                  DEFINE THE
                </span>

                <span className="block text-[#cce849]">
                  BOUNDARY.
                </span>
              </h2>
            </div>

            <div className="max-w-[400px] border-t border-white/[0.09] pt-5">
              <p className="text-[6px] font-black tracking-[0.15em] text-white/20">
                IMPORTANT
              </p>

              <p className="mt-3 text-[9px] leading-5 text-white/34">
                This frontend presents policy definitions only. The
                actual ALLOW, ASK_HUMAN or BLOCK result must come from
                the governance backend at runtime.
              </p>
            </div>
          </div>

          {/* MATRIX */}

          <div className="grid gap-px bg-white/[0.06] lg:grid-cols-[1.08fr_0.92fr]">
            {/* PAPER */}

            <div className="relative bg-[#dfded3] p-6 text-[#11150f] sm:p-10">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-[0.18]"
                style={{
                  backgroundImage:
                    [
                      "radial-gradient(circle,rgba(17,21,15,.18) .6px,transparent .8px)",
                      "linear-gradient(rgba(17,21,15,.07) 1px,transparent 1px)",
                      "linear-gradient(90deg,rgba(17,21,15,.07) 1px,transparent 1px)",
                    ].join(
                      ","
                    ),

                  backgroundSize:
                    "18px 18px,74px 74px,74px 74px",
                }}
              />

              <div className="relative">
                <div className="flex items-center justify-between gap-6 border-b border-black/12 pb-5">
                  <div>
                    <p className="text-[6px] font-black tracking-[0.15em] text-black/31">
                      CAIROS / GOVERNANCE RULEBOOK
                    </p>

                    <p className="mt-2 font-mono text-[7px] font-bold text-black/44">
                      policy-set / frontend-reference
                    </p>
                  </div>

                  <div className="rounded-[5px] bg-[#11150f] px-3 py-2">
                    <span className="text-[6px] font-black tracking-[0.12em] text-[#cce849]">
                      05 RULES
                    </span>
                  </div>
                </div>

                <div>
                  {POLICIES.map(
                    (
                      policy
                    ) => (
                      <PolicyRow
                        key={
                          policy.id
                        }
                        policy={
                          policy
                        }
                        active={
                          policy.id ===
                          selectedId
                        }
                        onSelect={() =>
                          setSelectedId(
                            policy.id
                          )
                        }
                      />
                    )
                  )}
                </div>
              </div>
            </div>

            {/* DETAIL */}

            <div className="relative overflow-hidden bg-[#08140a] p-8 sm:p-12">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    `radial-gradient(circle at 82% 18%,${selectedTone.soft},transparent 36%)`,
                }}
              />

              <div className="relative">
                <div className="flex items-start justify-between gap-8">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-full border"
                    style={{
                      borderColor:
                        selectedTone.border,

                      background:
                        selectedTone.soft,

                      color:
                        selectedTone.accent,
                    }}
                  >
                    {(() => {
                      const SelectedIcon =
                        selected.icon;

                      return (
                        <SelectedIcon
                          size={17}
                        />
                      );
                    })()}
                  </div>

                  <span
                    className="rounded-full border px-4 py-2 text-[5px] font-black tracking-[0.13em]"
                    style={{
                      borderColor:
                        selectedTone.border,

                      color:
                        selectedTone.accent,

                      background:
                        selectedTone.soft,
                    }}
                  >
                    {
                      selected.posture
                    }
                  </span>
                </div>

                <p className="mt-8 text-[7px] font-black tracking-[0.16em] text-white/20">
                  {
                    selected.code
                  }

                  {" / "}

                  POLICY DETAIL
                </p>

                <h3
                  className="mt-4 max-w-[600px] uppercase"
                  style={{
                    fontFamily:
                      DISPLAY_FONT,

                    fontWeight:
                      900,

                    fontSize:
                      "clamp(36px,3.5vw,64px)",

                    lineHeight:
                      0.84,

                    letterSpacing:
                      "-0.05em",

                    color:
                      selectedTone.accent,
                  }}
                >
                  {
                    selected.title
                  }
                </h3>

                <p className="mt-7 max-w-[520px] text-[10px] leading-6 text-white/39">
                  {
                    selected.description
                  }
                </p>

                <div className="mt-9 border-t border-white/[0.09]">
                  <PolicyDetailRow
                    label="SCOPE"
                    value={
                      selected.scope
                    }
                  />

                  <PolicyDetailRow
                    label="TRIGGER"
                    value={
                      selected.trigger
                    }
                  />

                  <PolicyDetailRow
                    label="REQUIRED EVIDENCE"
                    value={
                      selected.evidence
                    }
                  />

                  <PolicyDetailRow
                    label="REFERENCE EFFECT"
                    value={
                      selected.effect
                    }
                  />
                </div>

                <div className="mt-8 rounded-[14px] border border-white/[0.08] bg-black/15 p-5">
                  <div
                    className="flex items-center gap-3"
                    style={{
                      color:
                        selectedTone.accent,
                    }}
                  >
                    <CircleAlert
                      size={12}
                    />

                    <p className="text-[6px] font-black tracking-[0.14em] text-white/28">
                      RUNTIME NOTE
                    </p>
                  </div>

                  <p className="mt-3 text-[9px] leading-5 text-white/36">
                    This posture is policy context, not a frontend
                    governance result. Runtime authority still comes
                    from CAIROS governance and execution services.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          DECISION LANGUAGE
      ================================================== */}

      <section className="relative p-3 pt-0 sm:p-5 sm:pt-0">
        <div className="mx-auto max-w-[1480px] overflow-hidden rounded-[30px] border border-white/[0.09] bg-[#060a07]">
          <div className="grid gap-px bg-white/[0.06] lg:grid-cols-[0.8fr_1.2fr]">
            <div className="relative overflow-hidden bg-[#0a120b] p-8 sm:p-12">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute right-[-60px] top-[-60px] h-[260px] w-[260px] rounded-full border border-white/[0.04]"
              />

              <div className="relative">
                <p className="text-[7px] font-black tracking-[0.16em] text-[#cce849]">
                  DECISION LANGUAGE
                </p>

                <h2
                  className="mt-5 uppercase"
                  style={{
                    fontFamily:
                      DISPLAY_FONT,

                    fontWeight:
                      900,

                    fontSize:
                      "clamp(42px,4.5vw,78px)",

                    lineHeight:
                      0.8,

                    letterSpacing:
                      "-0.055em",
                  }}
                >
                  THREE
                  <br />

                  <span className="text-[#cce849]">
                    OUTCOMES.
                  </span>
                </h2>

                <p className="mt-7 max-w-[420px] text-[10px] leading-6 text-white/36">
                  The UI should explain the backend decision clearly
                  without recreating the decision engine locally.
                </p>
              </div>
            </div>

            <div className="grid gap-px bg-white/[0.06] sm:grid-cols-3">
              <DecisionPanel
                icon={
                  Check
                }
                label="ALLOW"
                color="#cce849"
                description="Authority conditions are satisfied and execution may proceed."
              />

              <DecisionPanel
                icon={
                  LockKeyhole
                }
                label="ASK_HUMAN"
                color="#c6a248"
                description="Execution pauses until valid human authority is received."
              />

              <DecisionPanel
                icon={
                  TriangleAlert
                }
                label="BLOCK"
                color="#c95852"
                description="Execution remains closed because required conditions are not satisfied."
              />
            </div>
          </div>

          {/* FOOT */}

          <div className="flex flex-col gap-7 border-t border-white/[0.08] px-8 py-8 sm:px-12 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[6px] font-black tracking-[0.15em] text-white/20">
                CAIROS PRINCIPLE
              </p>

              <p className="mt-3 max-w-[760px] text-[13px] font-black leading-6 text-white/58">
                Policy defines the boundary. Governance evaluates the
                request. Execution obeys the authority.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/settings"
                className="flex min-h-[50px] items-center justify-center gap-3 rounded-full border border-white/[0.1] px-6 text-[7px] font-black tracking-[0.1em] text-white/44 transition hover:border-white/20 hover:text-white/75"
              >
                <Server
                  size={12}
                />

                SETTINGS
              </Link>

              <Link
                href="/twin"
                className="group flex min-h-[50px] items-center justify-center gap-3 rounded-full bg-[#cce849] px-7 text-[7px] font-black tracking-[0.1em] text-[#11150f] transition hover:bg-[#d8ef63]"
              >
                RUN AGENT TWIN

                <ArrowRight
                  size={12}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ==================================================
   POLICY ROW
================================================== */

function PolicyRow({
  policy,
  active,
  onSelect,
}: {
  policy:
    PolicyDefinition;

  active:
    boolean;

  onSelect:
    () => void;
}) {
  const Icon =
    policy.icon;

  const tone =
    TONE[
      policy.tone
    ];

  return (
    <button
      type="button"
      onClick={
        onSelect
      }
      className={`grid w-full grid-cols-[40px_1fr_auto] gap-4 border-b border-black/10 py-5 text-left transition ${
        active
          ? "bg-black/[0.045]"
          : "hover:bg-black/[0.025]"
      }`}
    >
      <div
        className="flex h-9 w-9 items-center justify-center rounded-full border"
        style={{
          borderColor:
            active
              ? `${tone.accent}55`
              : "rgba(17,21,15,.13)",

          background:
            active
              ? tone.soft
              : "transparent",

          color:
            active
              ? tone.accent
              : "rgba(17,21,15,.34)",
        }}
      >
        <Icon
          size={13}
        />
      </div>

      <div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono text-[6px] font-bold text-black/28">
            {
              policy.code
            }
          </span>

          <span className="text-[10px] font-black">
            {
              policy.shortTitle
            }
          </span>
        </div>

        <p className="mt-2 max-w-[520px] text-[8px] leading-5 text-black/40">
          {
            policy.effect
          }
        </p>
      </div>

      <div className="pt-1">
        <span
          className="text-[5px] font-black tracking-[0.1em]"
          style={{
            color:
              tone.accent,
          }}
        >
          {
            policy.posture
          }
        </span>
      </div>
    </button>
  );
}

/* ==================================================
   SMALL COMPONENTS
================================================== */

function HeroMetric({
  label,
  value,
  detail,
}: {
  label:
    string;

  value:
    string;

  detail:
    string;
}) {
  return (
    <div className="bg-[#09120a]/94 px-6 py-5 backdrop-blur-xl">
      <p className="text-[5px] font-black tracking-[0.14em] text-white/18">
        {label}
      </p>

      <p className="mt-2 text-[10px] font-black tracking-[0.04em] text-[#efefe5]">
        {value}
      </p>

      <p className="mt-1 text-[5px] font-black tracking-[0.1em] text-[#cce849]/48">
        {detail}
      </p>
    </div>
  );
}

function PolicyOrbitLabel({
  className,
  index,
  label,
}: {
  className:
    string;

  index:
    string;

  label:
    string;
}) {
  return (
    <div
      className={`absolute ${className}`}
    >
      <p className="font-mono text-[5px] text-white/18">
        {index}
      </p>

      <p className="mt-1 text-[6px] font-black tracking-[0.12em] text-white/34">
        {label}
      </p>
    </div>
  );
}

function PolicyDetailRow({
  label,
  value,
}: {
  label:
    string;

  value:
    string;
}) {
  return (
    <div className="grid gap-3 border-b border-white/[0.07] py-5 sm:grid-cols-[140px_1fr]">
      <p className="text-[5px] font-black tracking-[0.13em] text-white/18">
        {label}
      </p>

      <p className="text-[8px] font-black leading-5 text-white/48">
        {value}
      </p>
    </div>
  );
}

function DecisionPanel({
  icon: Icon,
  label,
  color,
  description,
}: {
  icon:
    LucideIcon;

  label:
    string;

  color:
    string;

  description:
    string;
}) {
  return (
    <div className="relative min-h-[330px] bg-[#07110a] p-7 sm:p-9">
      <div
        className="flex h-10 w-10 items-center justify-center rounded-full border"
        style={{
          borderColor:
            `${color}30`,

          color,
        }}
      >
        <Icon
          size={14}
        />
      </div>

      <p className="mt-10 text-[6px] font-black tracking-[0.15em] text-white/18">
        GOVERNANCE RESULT
      </p>

      <p
        className="mt-3 uppercase"
        style={{
          fontFamily:
            DISPLAY_FONT,

          fontWeight:
            900,

          fontSize:
            "clamp(28px,2.7vw,46px)",

          lineHeight:
            0.85,

          letterSpacing:
            "-0.045em",

          color,
        }}
      >
        {label}
      </p>

      <p className="mt-6 text-[9px] leading-5 text-white/34">
        {description}
      </p>

      <div className="absolute bottom-7 left-7 right-7 flex items-center gap-3">
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{
            backgroundColor:
              color,
          }}
        />

        <span className="text-[5px] font-black tracking-[0.11em] text-white/20">
          BACKEND AUTHORITY
        </span>
      </div>
    </div>
  );
}