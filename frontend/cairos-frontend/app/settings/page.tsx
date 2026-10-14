"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import {
  Activity,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Fingerprint,
  LockKeyhole,
  MonitorCog,
  Network,
  Play,
  RotateCcw,
  Server,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Terminal,
  type LucideIcon,
} from "lucide-react";

import {
  motion,
} from "framer-motion";

const DISPLAY_FONT =
  "'Arial Narrow', 'Roboto Condensed', Haettenschweiler, Impact, sans-serif";

const STORAGE_KEY =
  "cairos-ui-preferences-v1";

type StatusTone =
  | "lime"
  | "gold"
  | "purple"
  | "red";

type UiPreferences = {
  reducedMotion: boolean;
  technicalLabels: boolean;
  cinematicEffects: boolean;
  confirmStoryRestart: boolean;
};

type RuntimeStatus = {
  label: string;
  value: string;
  detail: string;
  tone: StatusTone;
  icon: LucideIcon;
};

const DEFAULT_PREFERENCES: UiPreferences = {
  reducedMotion:
    false,

  technicalLabels:
    true,

  cinematicEffects:
    true,

  confirmStoryRestart:
    true,
};

export default function SettingsPage() {
  const [
    preferences,
    setPreferences,
  ] =
    useState<UiPreferences>(
      DEFAULT_PREFERENCES
    );

  const [
    hydrated,
    setHydrated,
  ] =
    useState(false);

  const [
    saved,
    setSaved,
  ] =
    useState(false);

  const apiUrl =
    process.env
      .NEXT_PUBLIC_API_URL ||
    "http://127.0.0.1:8000";

  const realApiEnabled =
    process.env
      .NEXT_PUBLIC_USE_REAL_API ===
    "true";

  const authEnabled =
    process.env
      .NEXT_PUBLIC_AUTH_ENABLED ===
    "true";

  useEffect(() => {
    try {
      const raw =
        window.localStorage.getItem(
          STORAGE_KEY
        );

      if (raw) {
        const parsed =
          JSON.parse(
            raw
          ) as Partial<UiPreferences>;

        setPreferences({
          ...DEFAULT_PREFERENCES,
          ...parsed,
        });
      }
    } catch {
      setPreferences(
        DEFAULT_PREFERENCES
      );
    } finally {
      setHydrated(
        true
      );
    }
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(
          preferences
        )
      );

      setSaved(
        true
      );

      const timer =
        window.setTimeout(
          () =>
            setSaved(
              false
            ),
          900
        );

      return () =>
        window.clearTimeout(
          timer
        );
    } catch {
      return;
    }
  }, [
    preferences,
    hydrated,
  ]);

  const runtime =
    useMemo<RuntimeStatus[]>(
      () => [
        {
          label:
            "DATA SOURCE",

          value:
            realApiEnabled
              ? "REAL API"
              : "DEMO SESSION",

          detail:
            realApiEnabled
              ? "Frontend configured for backend responses."
              : "Frontend currently using local demo flow.",

          tone:
            realApiEnabled
              ? "lime"
              : "gold",

          icon:
            Network,
        },

        {
          label:
            "BACKEND TARGET",

          value:
            apiUrl,

          detail:
            "Configured through NEXT_PUBLIC_API_URL.",

          tone:
            "purple",

          icon:
            Server,
        },

        {
          label:
            "AUTH MODE",

          value:
            authEnabled
              ? "ENABLED"
              : "DEMO ACCESS",

          detail:
            authEnabled
              ? "Frontend auth mode is enabled."
              : "Secure backend authentication is not being claimed.",

          tone:
            authEnabled
              ? "lime"
              : "gold",

          icon:
            LockKeyhole,
        },

        {
          label:
            "GOVERNANCE",

          value:
            "BACKEND AUTHORITY",

          detail:
            "Frontend displays decisions. It does not manufacture them.",

          tone:
            "lime",

          icon:
            ShieldCheck,
        },
      ],

      [
        apiUrl,
        authEnabled,
        realApiEnabled,
      ]
    );

  const updatePreference =
    (
      key:
        keyof UiPreferences
    ) => {
      setPreferences(
        (
          current
        ) => ({
          ...current,

          [key]:
            !current[
              key
            ],
        })
      );
    };

  return (
    <main className="relative min-h-screen overflow-x-clip bg-[#050705] text-[#efefe5]">
      {/* ==================================================
          HERO
      ================================================== */}

      <section className="relative p-3 sm:p-5">
        <div className="relative min-h-[700px] overflow-hidden rounded-[30px] border border-white/[0.09] bg-[#07110a]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                [
                  "linear-gradient(90deg,rgba(5,7,5,.995) 0%,rgba(5,8,6,.97) 38%,rgba(7,20,12,.78) 72%,rgba(8,28,15,.88) 100%)",
                  "radial-gradient(circle at 77% 27%,rgba(204,232,73,.08),transparent 28%)",
                  "radial-gradient(circle at 72% 72%,rgba(128,98,220,.08),transparent 34%)",
                ].join(
                  ","
                ),
            }}
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage:
                [
                  "linear-gradient(rgba(255,255,255,.045) 1px,transparent 1px)",
                  "linear-gradient(90deg,rgba(255,255,255,.045) 1px,transparent 1px)",
                ].join(
                  ","
                ),

              backgroundSize:
                "82px 82px",
            }}
          />

          <div className="pointer-events-none absolute inset-x-0 bottom-[-4vw] overflow-hidden">
            <p
              className="whitespace-nowrap text-center uppercase"
              style={{
                fontFamily:
                  DISPLAY_FONT,

                fontWeight:
                  900,

                fontSize:
                  "clamp(130px,18vw,310px)",

                lineHeight:
                  0.67,

                letterSpacing:
                  "-0.07em",

                color:
                  "rgba(204,232,73,.04)",
              }}
            >
              CONTROL
            </p>
          </div>

          <div className="absolute left-[4.5vw] right-[4.5vw] top-[6vh] z-30 flex items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Settings2
                size={
                  13
                }
                className="text-[#cce849]"
              />

              <span className="text-[7px] font-black tracking-[0.16em] text-white/34">
                SYSTEM CONFIGURATION
              </span>
            </div>

            <div className="hidden items-center gap-3 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-[#cce849]" />

              <span className="text-[6px] font-black tracking-[0.14em] text-[#cce849]/65">
                FRONTEND CONTROL SURFACE
              </span>
            </div>
          </div>

          <div className="absolute left-[4.5vw] top-[16vh] z-20 w-[min(760px,84vw)]">
            <div className="flex items-center gap-4">
              <span className="text-[7px] font-black tracking-[0.18em] text-[#cce849]">
                SETTINGS
              </span>

              <span className="h-px w-10 bg-[#cce849]/28" />

              <span className="text-[7px] font-black tracking-[0.14em] text-white/24">
                SYSTEM POSTURE
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
                    "clamp(52px,6vw,104px)",

                  lineHeight:
                    0.79,

                  letterSpacing:
                    "-0.06em",
                }}
              >
                <span className="block text-[#efefe5]">
                  CONTROL
                </span>

                <span className="block text-[#cce849]">
                  THE SURFACE.
                </span>
              </h1>
            </motion.div>

            <p className="mt-7 max-w-[500px] text-[10px] leading-6 text-white/38">
              Configure frontend presentation and inspect the current
              runtime posture without moving governance or security
              responsibilities into the browser.
            </p>
          </div>

          <div className="absolute right-[5vw] top-[17vh] hidden h-[410px] w-[470px] xl:block">
            <div className="absolute left-1/2 top-1/2 h-[330px] w-[330px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#cce849]/10" />

            <div className="absolute left-1/2 top-1/2 h-[246px] w-[246px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.055]" />

            <div className="absolute left-1/2 top-1/2 h-[154px] w-[154px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#8062dc]/15 bg-[#09150b]" />

            <div className="absolute left-1/2 top-1/2 flex h-[88px] w-[88px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#cce849]/18 bg-[#0b160c] shadow-[0_0_90px_rgba(204,232,73,.08)]">
              <MonitorCog
                size={
                  27
                }
                className="text-[#cce849]"
              />
            </div>

            <SystemNode
              className="left-[12px] top-[68px]"
              number="01"
              label="CLIENT"
            />

            <SystemNode
              className="right-[6px] top-[106px]"
              number="02"
              label="API"
            />

            <SystemNode
              className="bottom-[72px] left-[24px]"
              number="03"
              label="AUTH"
            />

            <SystemNode
              className="bottom-[24px] right-[42px]"
              number="04"
              label="GOVERNANCE"
            />

            <div className="absolute left-1/2 top-[30px] h-[118px] w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[#cce849]/25 to-transparent" />

            <div className="absolute bottom-[26px] left-1/2 h-[118px] w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[#8062dc]/22 to-transparent" />

            <div className="absolute left-[58px] top-1/2 h-px w-[142px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <div className="absolute right-[58px] top-1/2 h-px w-[142px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>

          <div className="absolute bottom-[6vh] left-[4.5vw] right-[4.5vw] z-20 grid gap-px overflow-hidden rounded-[18px] bg-white/[0.07] sm:grid-cols-3">
            <HeroMetric
              label="API MODE"
              value={
                realApiEnabled
                  ? "REAL"
                  : "DEMO"
              }
              detail="ENVIRONMENT CONTROLLED"
              tone={
                realApiEnabled
                  ? "lime"
                  : "gold"
              }
            />

            <HeroMetric
              label="AUTH"
              value={
                authEnabled
                  ? "ENABLED"
                  : "PENDING"
              }
              detail="NO FALSE SECURITY CLAIM"
              tone={
                authEnabled
                  ? "lime"
                  : "gold"
              }
            />

            <HeroMetric
              label="DECISION SOURCE"
              value="BACKEND"
              detail="FRONTEND IS DISPLAY ONLY"
              tone="lime"
            />
          </div>
        </div>
      </section>

      {/* ==================================================
          RUNTIME POSTURE
      ================================================== */}

      <section className="relative p-3 pt-0 sm:p-5 sm:pt-0">
        <div className="mx-auto max-w-[1480px] overflow-hidden rounded-[30px] border border-white/[0.09] bg-[#07110a]">
          <div className="grid gap-8 border-b border-white/[0.08] px-8 py-9 sm:px-12 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <div className="flex items-center gap-4">
                <span className="text-[7px] font-black tracking-[0.17em] text-[#cce849]">
                  RUNTIME POSTURE
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
                  KNOW WHAT
                </span>

                <span className="block text-[#cce849]">
                  IS REAL.
                </span>
              </h2>
            </div>

            <div className="max-w-[400px] border-t border-white/[0.09] pt-5">
              <p className="text-[6px] font-black tracking-[0.15em] text-white/20">
                CONFIGURATION SOURCE
              </p>

              <p className="mt-3 text-[9px] leading-5 text-white/34">
                Runtime switches shown here are derived from public
                frontend environment variables. Sensitive backend
                secrets must never be exposed here.
              </p>
            </div>
          </div>

          <div className="grid gap-px bg-white/[0.06] md:grid-cols-2">
            {runtime.map(
              (
                item
              ) => (
                <RuntimeCard
                  key={
                    item.label
                  }
                  item={
                    item
                  }
                />
              )
            )}
          </div>
        </div>
      </section>

      {/* ==================================================
          UI PREFERENCES
      ================================================== */}

      <section className="relative p-3 pt-0 sm:p-5 sm:pt-0">
        <div className="mx-auto max-w-[1480px] overflow-hidden rounded-[30px] border border-white/[0.09] bg-[#080b08]">
          <div className="grid gap-px bg-white/[0.06] lg:grid-cols-[0.9fr_1.1fr]">
            <div className="relative overflow-hidden bg-[#0b130c] p-8 sm:p-12">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute right-[-110px] top-[-100px] h-[330px] w-[330px] rounded-full border border-[#8062dc]/10"
              />

              <div className="relative">
                <div className="flex items-center gap-3">
                  <SlidersHorizontal
                    size={
                      14
                    }
                    className="text-[#8062dc]"
                  />

                  <span className="text-[7px] font-black tracking-[0.16em] text-[#8062dc]">
                    EXPERIENCE
                  </span>
                </div>

                <h2
                  className="mt-7 uppercase"
                  style={{
                    fontFamily:
                      DISPLAY_FONT,

                    fontWeight:
                      900,

                    fontSize:
                      "clamp(42px,4.7vw,80px)",

                    lineHeight:
                      0.8,

                    letterSpacing:
                      "-0.055em",
                  }}
                >
                  TUNE THE
                  <br />

                  <span className="text-[#8062dc]">
                    INTERFACE.
                  </span>
                </h2>

                <p className="mt-7 max-w-[430px] text-[10px] leading-6 text-white/36">
                  These controls affect only frontend presentation.
                  They do not change CAIROS policies, permissions,
                  risk analysis or execution authority.
                </p>

                <div className="mt-10 flex items-center gap-3">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      saved
                        ? "bg-[#cce849]"
                        : "bg-white/20"
                    }`}
                  />

                  <span className="text-[6px] font-black tracking-[0.13em] text-white/24">
                    {
                      saved
                        ? "PREFERENCES SAVED LOCALLY"
                        : "LOCAL UI PREFERENCES"
                    }
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-[#deddd2] p-6 text-[#11150f] sm:p-10">
              <div className="flex items-center justify-between gap-5 border-b border-black/12 pb-5">
                <div>
                  <p className="text-[6px] font-black tracking-[0.15em] text-black/30">
                    CAIROS / INTERFACE CONTROL
                  </p>

                  <p className="mt-2 font-mono text-[7px] text-black/43">
                    browser-local preferences
                  </p>
                </div>

                <div className="rounded-[5px] bg-[#11150f] px-3 py-2">
                  <span className="text-[6px] font-black tracking-[0.12em] text-[#cce849]">
                    LOCAL ONLY
                  </span>
                </div>
              </div>

              <div className="mt-2">
                <PreferenceRow
                  icon={
                    Activity
                  }
                  label="REDUCED MOTION"
                  description="Reduce decorative interface motion on cinematic screens."
                  checked={
                    preferences.reducedMotion
                  }
                  onChange={() =>
                    updatePreference(
                      "reducedMotion"
                    )
                  }
                />

                <PreferenceRow
                  icon={
                    Terminal
                  }
                  label="TECHNICAL LABELS"
                  description="Show execution IDs, trace metadata and technical support labels."
                  checked={
                    preferences.technicalLabels
                  }
                  onChange={() =>
                    updatePreference(
                      "technicalLabels"
                    )
                  }
                />

                <PreferenceRow
                  icon={
                    Sparkles
                  }
                  label="CINEMATIC EFFECTS"
                  description="Enable decorative scene glow and environmental visual effects."
                  checked={
                    preferences.cinematicEffects
                  }
                  onChange={() =>
                    updatePreference(
                      "cinematicEffects"
                    )
                  }
                />

                <PreferenceRow
                  icon={
                    RotateCcw
                  }
                  label="CONFIRM STORY RESTART"
                  description="Keep a confirmation preference before resetting the frontend story state."
                  checked={
                    preferences.confirmStoryRestart
                  }
                  onChange={() =>
                    updatePreference(
                      "confirmStoryRestart"
                    )
                  }
                />
              </div>

              <button
                type="button"
                onClick={() =>
                  setPreferences(
                    DEFAULT_PREFERENCES
                  )
                }
                className="mt-7 flex min-h-[48px] items-center justify-center gap-3 rounded-full border border-black/12 px-6 text-[7px] font-black tracking-[0.1em] text-black/45 transition hover:bg-black/[0.04] hover:text-black/75"
              >
                <RotateCcw
                  size={
                    12
                  }
                />

                RESET UI PREFERENCES
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          TRUST BOUNDARY
      ================================================== */}

      <section className="relative p-3 pt-0 sm:p-5 sm:pt-0">
        <div className="mx-auto max-w-[1480px] overflow-hidden rounded-[30px] border border-white/[0.09] bg-[#080b08]">
          <div className="grid gap-px bg-white/[0.06] lg:grid-cols-3">
            <BoundaryPanel
              icon={
                Eye
              }
              index="01"
              title="FRONTEND MAY DISPLAY"
              color="#cce849"
              items={[
                "Governance result",
                "Risk and blast radius",
                "Execution state",
                "Observable trace evidence",
              ]}
            />

            <BoundaryPanel
              icon={
                EyeOff
              }
              index="02"
              title="FRONTEND MUST NOT INVENT"
              color="#c95852"
              items={[
                "Final governance decision",
                "Authority grants",
                "Risk conclusions",
                "AgentDNA root cause",
              ]}
            />

            <BoundaryPanel
              icon={
                Fingerprint
              }
              index="03"
              title="OBSERVABILITY SCOPE"
              color="#8062dc"
              items={[
                "Inputs and outputs",
                "Tool responses",
                "Actions and timestamps",
                "Errors and outcomes",
              ]}
            />
          </div>

          <div className="grid gap-8 border-t border-white/[0.08] px-8 py-8 sm:px-12 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-[6px] font-black tracking-[0.15em] text-[#cce849]">
                SYSTEM PRINCIPLE
              </p>

              <p
                className="mt-3 max-w-[780px] uppercase"
                style={{
                  fontFamily:
                    DISPLAY_FONT,

                  fontWeight:
                    900,

                  fontSize:
                    "clamp(24px,2.25vw,40px)",

                  lineHeight:
                    0.93,

                  letterSpacing:
                    "-0.035em",
                }}
              >
                THE INTERFACE EXPLAINS.

                <span className="text-[#8062dc]">
                  {" "}
                  THE BACKEND DECIDES.
                </span>
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/policies"
                className="flex min-h-[52px] items-center justify-center gap-3 rounded-full border border-white/[0.11] px-7 text-[7px] font-black tracking-[0.1em] text-white/45 transition hover:border-[#8062dc]/30 hover:text-white/75"
              >
                <ShieldCheck
                  size={
                    12
                  }
                />

                VIEW POLICIES
              </Link>

              <Link
                href="/twin"
                className="group flex min-h-[52px] items-center justify-center gap-3 rounded-full bg-[#cce849] px-7 text-[7px] font-black tracking-[0.1em] text-[#11150f] transition hover:bg-[#d8ef63]"
              >
                <Play
                  size={
                    12
                  }
                />

                RUN AGENT TWIN

                <ArrowRight
                  size={
                    12
                  }
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

function RuntimeCard({
  item,
}: {
  item:
    RuntimeStatus;
}) {
  const Icon =
    item.icon;

  const tone =
    toneValues(
      item.tone
    );

  return (
    <div className="relative min-h-[265px] overflow-hidden bg-[#081109] p-8 sm:p-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            `radial-gradient(circle at 84% 16%,${tone.soft},transparent 36%)`,
        }}
      />

      <div className="relative">
        <div className="flex items-start justify-between gap-5">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full border"
            style={{
              borderColor:
                tone.border,

              background:
                tone.soft,

              color:
                tone.accent,
            }}
          >
            <Icon
              size={
                14
              }
            />
          </div>

          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{
              backgroundColor:
                tone.accent,
            }}
          />
        </div>

        <p className="mt-8 text-[6px] font-black tracking-[0.15em] text-white/20">
          {
            item.label
          }
        </p>

        <p
          className="mt-3 break-all text-[14px] font-black tracking-[-0.02em]"
          style={{
            color:
              tone.accent,
          }}
        >
          {
            item.value
          }
        </p>

        <p className="mt-4 max-w-[480px] text-[9px] leading-5 text-white/34">
          {
            item.detail
          }
        </p>
      </div>
    </div>
  );
}

function PreferenceRow({
  icon: Icon,
  label,
  description,
  checked,
  onChange,
}: {
  icon:
    LucideIcon;

  label:
    string;

  description:
    string;

  checked:
    boolean;

  onChange:
    () => void;
}) {
  return (
    <div className="grid grid-cols-[38px_1fr_auto] gap-4 border-b border-black/10 py-5">
      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-black/12">
        <Icon
          size={
            13
          }
          className="text-black/42"
        />
      </div>

      <div>
        <p className="text-[9px] font-black">
          {label}
        </p>

        <p className="mt-2 max-w-[520px] text-[7px] leading-4 text-black/40">
          {description}
        </p>
      </div>

      <button
        type="button"
        onClick={
          onChange
        }
        aria-pressed={
          checked
        }
        className={`relative mt-1 h-[26px] w-[48px] rounded-full border transition ${
          checked
            ? "border-[#839820]/30 bg-[#b9d331]"
            : "border-black/12 bg-black/[0.07]"
        }`}
      >
        <span
          className={`absolute top-[3px] h-[18px] w-[18px] rounded-full transition ${
            checked
              ? "left-[25px] bg-[#11150f]"
              : "left-[4px] bg-black/35"
          }`}
        />
      </button>
    </div>
  );
}

function HeroMetric({
  label,
  value,
  detail,
  tone,
}: {
  label:
    string;

  value:
    string;

  detail:
    string;

  tone:
    StatusTone;
}) {
  const colors =
    toneValues(
      tone
    );

  return (
    <div className="bg-[#09120a]/94 px-6 py-5 backdrop-blur-xl">
      <p className="text-[5px] font-black tracking-[0.14em] text-white/18">
        {label}
      </p>

      <p
        className="mt-2 text-[10px] font-black tracking-[0.04em]"
        style={{
          color:
            colors.accent,
        }}
      >
        {value}
      </p>

      <p className="mt-1 text-[5px] font-black tracking-[0.1em] text-white/20">
        {detail}
      </p>
    </div>
  );
}

function SystemNode({
  className,
  number,
  label,
}: {
  className:
    string;

  number:
    string;

  label:
    string;
}) {
  return (
    <div
      className={`absolute ${className}`}
    >
      <p className="font-mono text-[5px] text-white/16">
        {number}
      </p>

      <p className="mt-1 text-[6px] font-black tracking-[0.12em] text-white/32">
        {label}
      </p>
    </div>
  );
}

function BoundaryPanel({
  icon: Icon,
  index,
  title,
  color,
  items,
}: {
  icon:
    LucideIcon;

  index:
    string;

  title:
    string;

  color:
    string;

  items:
    string[];
}) {
  return (
    <div className="relative min-h-[370px] bg-[#081109] p-8 sm:p-10">
      <div className="flex items-start justify-between gap-6">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full border"
          style={{
            borderColor:
              `${color}30`,

            color,
          }}
        >
          <Icon
            size={
              14
            }
          />
        </div>

        <span className="font-mono text-[6px] text-white/15">
          {index}
        </span>
      </div>

      <p
        className="mt-9 text-[8px] font-black tracking-[0.1em]"
        style={{
          color,
        }}
      >
        {title}
      </p>

      <div className="mt-7 border-t border-white/[0.08]">
        {items.map(
          (
            item
          ) => (
            <div
              key={
                item
              }
              className="flex items-center gap-3 border-b border-white/[0.06] py-4"
            >
              <Check
                size={
                  10
                }
                style={{
                  color,
                }}
              />

              <span className="text-[7px] font-black tracking-[0.04em] text-white/36">
                {item}
              </span>
            </div>
          )
        )}
      </div>
    </div>
  );
}

function toneValues(
  tone:
    StatusTone
) {
  if (
    tone ===
    "gold"
  ) {
    return {
      accent:
        "#c6a248",

      soft:
        "rgba(198,162,72,.08)",

      border:
        "rgba(198,162,72,.18)",
    };
  }

  if (
    tone ===
    "purple"
  ) {
    return {
      accent:
        "#8062dc",

      soft:
        "rgba(128,98,220,.08)",

      border:
        "rgba(128,98,220,.18)",
    };
  }

  if (
    tone ===
    "red"
  ) {
    return {
      accent:
        "#c95852",

      soft:
        "rgba(201,88,82,.08)",

      border:
        "rgba(201,88,82,.18)",
    };
  }

  return {
    accent:
      "#cce849",

    soft:
      "rgba(204,232,73,.08)",

    border:
      "rgba(204,232,73,.18)",
  };
}