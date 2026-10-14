"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  ArrowRight,
  Check,
  CircleAlert,
  Eye,
  Fingerprint,
  KeyRound,
  LockKeyhole,
  LogIn,
  LogOut,
  Play,
  Settings2,
  ShieldCheck,
  UserPlus,
  UserRound,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

import {
  motion,
} from "framer-motion";

import {
  signOut as signOutGoogle,
} from "next-auth/react";

import {
  AUTH_EVENT,
  getCurrentUser,
  signOut as clearLocalSession,
  type AuthUser,
} from "@/lib/auth";

const DISPLAY_FONT =
  "'Arial Narrow', 'Roboto Condensed', Haettenschweiler, Impact, sans-serif";

const ROLE_MATRIX = [
  {
    id: "01",
    role: "OPERATOR",
    accent: "#cce849",
    description:
      "Inspect agent requests, simulation results, risk, execution status and observable evidence.",
    capabilities: [
      "Run Agent Twin",
      "Inspect risk",
      "Inspect execution",
      "View AgentDNA",
    ],
    restriction:
      "Cannot self-authorize high-risk actions.",
  },

  {
    id: "02",
    role: "REVIEWER",
    accent: "#c6a248",
    description:
      "Review actions only when CAIROS governance explicitly requests human authority.",
    capabilities: [
      "Inspect evidence",
      "Approve eligible requests",
      "Reject pending requests",
      "Review authority context",
    ],
    restriction:
      "Approval does not bypass policy or execution controls.",
  },

  {
    id: "03",
    role: "ADMIN",
    accent: "#8062dc",
    description:
      "Manage administrative surfaces such as policy and system configuration.",
    capabilities: [
      "Inspect policies",
      "Inspect settings",
      "Administrative visibility",
      "System configuration",
    ],
    restriction:
      "Admin identity still does not manufacture governance decisions.",
  },
];

export default function ProfilePage() {
  const authEnabled =
    process.env.NEXT_PUBLIC_AUTH_ENABLED ===
    "true";

  const [
    currentUser,
    setCurrentUser,
  ] =
    useState<AuthUser | null>(
      null
    );

  const [
    hydrated,
    setHydrated,
  ] =
    useState(false);

  const [
    signingOut,
    setSigningOut,
  ] =
    useState(false);

  useEffect(() => {
    const refreshUser =
      () => {
        setCurrentUser(
          getCurrentUser()
        );

        setHydrated(
          true
        );
      };

    refreshUser();

    window.addEventListener(
      AUTH_EVENT,
      refreshUser
    );

    window.addEventListener(
      "storage",
      refreshUser
    );

    return () => {
      window.removeEventListener(
        AUTH_EVENT,
        refreshUser
      );

      window.removeEventListener(
        "storage",
        refreshUser
      );
    };
  }, []);

  const sessionActive =
    hydrated &&
    currentUser !==
      null;

  const identityState =
    !hydrated
      ? "CHECKING SESSION"
      : sessionActive
        ? "SESSION ACTIVE"
        : authEnabled
          ? "SIGN IN REQUIRED"
          : "GUEST / DEMO";

  const identityAccent =
    sessionActive
      ? "#8062dc"
      : authEnabled
        ? "#9677e8"
        : "#c6a248";

  const displayName =
    currentUser?.name?.trim() ||
    "Guest";

  const displayEmail =
    currentUser?.email?.trim() ||
    "No authenticated email";

  const displayRole =
    currentUser?.role ||
    "NONE";

  const displayOrganization =
    currentUser?.organization?.trim() ||
    "CAIROS Twin DNA";

  const displayTitle =
    currentUser?.title?.trim() ||
    "Authenticated identity";

  const handleLogout =
    async () => {
      if (
        signingOut
      ) {
        return;
      }

      setSigningOut(
        true
      );

      try {
        clearLocalSession();

        await signOutGoogle({
          redirectTo:
            "/login",
        });
      } catch {
        clearLocalSession();

        window.location.href =
          "/login";
      }
    };

  return (
    <main className="relative min-h-screen overflow-x-clip bg-[#050705] text-[#efefe5]">
      {/* ==================================================
          HERO
      ================================================== */}

      <section className="relative p-3 sm:p-5">
        <div className="relative min-h-[650px] overflow-hidden rounded-[30px] border border-white/[0.09] bg-[#07110a]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background: [
                "linear-gradient(90deg,rgba(4,6,4,.995) 0%,rgba(5,8,6,.98) 38%,rgba(7,22,13,.72) 72%,rgba(8,28,15,.88) 100%)",
                "radial-gradient(circle at 76% 28%,rgba(128,98,220,.10),transparent 28%)",
                "radial-gradient(circle at 72% 72%,rgba(204,232,73,.07),transparent 34%)",
              ].join(
                ","
              ),
            }}
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.11]"
            style={{
              backgroundImage: [
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
                  "clamp(140px,19vw,330px)",

                lineHeight:
                  0.66,

                letterSpacing:
                  "-0.07em",

                color:
                  "rgba(128,98,220,.045)",
              }}
            >
              IDENTITY
            </p>
          </div>

          {/* TOP STATUS */}

          <div className="absolute left-[4.5vw] right-[4.5vw] top-[6vh] z-30 flex items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <UserRound
                size={
                  13
                }
                className="text-[#8062dc]"
              />

              <span className="text-[7px] font-black tracking-[0.16em] text-white/40">
                IDENTITY SURFACE
              </span>
            </div>

            <div className="hidden items-center gap-3 sm:flex">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{
                  backgroundColor:
                    identityAccent,
                }}
              />

              <span
                className="text-[6px] font-black tracking-[0.14em]"
                style={{
                  color:
                    identityAccent,
                }}
              >
                {
                  identityState
                }
              </span>
            </div>
          </div>

          {/* HERO COPY */}

          <div className="absolute left-[4.5vw] top-[16vh] z-20 w-[min(720px,84vw)]">
            <div className="flex items-center gap-4">
              <span className="text-[7px] font-black tracking-[0.18em] text-[#8062dc]">
                PROFILE
              </span>

              <span className="h-px w-10 bg-[#8062dc]/30" />

              <span className="text-[7px] font-black tracking-[0.14em] text-white/28">
                IDENTITY / SCOPE
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
                <span className="block">
                  IDENTITY
                </span>

                <span className="block text-[#8062dc]">
                  SETS SCOPE.
                </span>
              </h1>
            </motion.div>

            <p className="mt-7 max-w-[500px] text-[10px] leading-6 text-white/45">
              Identity controls access to CAIROS interfaces. It does
              not replace policy, simulation, risk analysis or
              execution authority.
            </p>

            {sessionActive && (
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <div className="rounded-full border border-[#8062dc]/25 bg-[#8062dc]/[0.07] px-4 py-2.5">
                  <span className="text-[6px] font-black tracking-[0.11em] text-[#b198f2]">
                    {
                      displayName.toUpperCase()
                    }
                  </span>
                </div>

                <div className="rounded-full border border-white/[0.08] bg-white/[0.025] px-4 py-2.5">
                  <span className="text-[6px] font-black tracking-[0.11em] text-white/42">
                    {
                      displayRole
                    }
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* IDENTITY WORLD */}

          <div className="absolute right-[6vw] top-[18vh] hidden h-[400px] w-[470px] xl:block">
            <div className="absolute left-1/2 top-1/2 h-[318px] w-[318px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#8062dc]/12" />

            <div className="absolute left-1/2 top-1/2 h-[236px] w-[236px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.06]" />

            <div className="absolute left-1/2 top-1/2 h-[146px] w-[146px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#cce849]/10 bg-[#09120a]" />

            <div className="absolute left-1/2 top-1/2 flex h-[84px] w-[84px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#8062dc]/20 bg-[#0b140c] shadow-[0_0_90px_rgba(128,98,220,.1)]">
              <Fingerprint
                size={
                  28
                }
                className="text-[#9677e8]"
              />
            </div>

            <IdentityNode
              className="left-[10px] top-[64px]"
              index="01"
              label="IDENTITY"
            />

            <IdentityNode
              className="right-[4px] top-[106px]"
              index="02"
              label="ROLE"
            />

            <IdentityNode
              className="bottom-[72px] left-[25px]"
              index="03"
              label="SCOPE"
            />

            <IdentityNode
              className="bottom-[24px] right-[36px]"
              index="04"
              label="AUTHORITY"
            />

            <div className="absolute left-1/2 top-[28px] h-[120px] w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[#8062dc]/25 to-transparent" />

            <div className="absolute bottom-[25px] left-1/2 h-[120px] w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[#cce849]/18 to-transparent" />

            <div className="absolute left-[58px] top-1/2 h-px w-[142px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <div className="absolute right-[58px] top-1/2 h-px w-[142px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>
        </div>
      </section>

      {/* ==================================================
          ACCOUNT / SESSION
      ================================================== */}

      <section className="relative p-3 pt-0 sm:p-5 sm:pt-0">
        <div className="mx-auto max-w-[1480px] overflow-hidden rounded-[30px] border border-white/[0.09] bg-[#081009]">
          {!hydrated ? (
            <div className="flex min-h-[280px] items-center justify-center bg-[#0c0913]">
              <div className="text-center">
                <Fingerprint
                  size={
                    24
                  }
                  className="mx-auto animate-pulse text-[#8062dc]"
                />

                <p className="mt-5 text-[7px] font-black tracking-[0.14em] text-white/32">
                  CHECKING IDENTITY SESSION
                </p>
              </div>
            </div>
          ) : sessionActive ? (
            <div className="grid gap-px bg-white/[0.06] lg:grid-cols-[1fr_1fr]">
              {/* VERIFIED USER */}

              <div className="relative min-h-[300px] overflow-hidden bg-[#09140a] p-7 sm:p-10">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(circle at 85% 20%,rgba(204,232,73,.08),transparent 38%)",
                  }}
                />

                <div className="relative">
                  <ShieldCheck
                    size={
                      18
                    }
                    className="text-[#cce849]"
                  />

                  <p className="mt-6 text-[7px] font-black tracking-[0.15em] text-white/28">
                    VERIFIED IDENTITY
                  </p>

                  <p
                    className="mt-4 uppercase text-[#cce849]"
                    style={{
                      fontFamily:
                        DISPLAY_FONT,

                      fontWeight:
                        900,

                      fontSize:
                        "clamp(32px,3vw,52px)",

                      lineHeight:
                        0.84,

                      letterSpacing:
                        "-0.05em",
                    }}
                  >
                    {
                      displayName
                    }
                  </p>

                  <p className="mt-5 text-[9px] font-bold text-white/52">
                    {
                      displayEmail
                    }
                  </p>

                  <p className="mt-2 max-w-[470px] text-[8px] leading-5 text-white/35">
                    Google identity has been synchronized with the
                    CAIROS frontend session.
                  </p>

                  <div className="mt-7 flex flex-wrap gap-2">
                    <SessionTag
                      label="ROLE"
                      value={
                        displayRole
                      }
                      color="#cce849"
                    />

                    <SessionTag
                      label="ORG"
                      value={
                        displayOrganization
                      }
                      color="#9677e8"
                    />
                  </div>
                </div>
              </div>

              {/* ACTIVE SESSION */}

              <div className="relative min-h-[300px] overflow-hidden bg-[#0c0913] p-7 sm:p-10">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(circle at 85% 20%,rgba(128,98,220,.11),transparent 38%)",
                  }}
                />

                <div className="relative">
                  <Fingerprint
                    size={
                      18
                    }
                    className="text-[#9677e8]"
                  />

                  <p className="mt-6 text-[7px] font-black tracking-[0.15em] text-white/28">
                    ACCOUNT SESSION
                  </p>

                  <p
                    className="mt-4 uppercase text-[#9677e8]"
                    style={{
                      fontFamily:
                        DISPLAY_FONT,

                      fontWeight:
                        900,

                      fontSize:
                        "clamp(32px,3vw,52px)",

                      lineHeight:
                        0.84,

                      letterSpacing:
                        "-0.05em",
                    }}
                  >
                    SESSION
                    <br />
                    ACTIVE.
                  </p>

                  <p className="mt-5 max-w-[500px] text-[9px] leading-5 text-white/42">
                    You are signed in as{" "}
                    <span className="font-black text-white/70">
                      {
                        displayEmail
                      }
                    </span>
                    . Your interface role is{" "}
                    <span className="font-black text-[#b198f2]">
                      {
                        displayRole
                      }
                    </span>
                    .
                  </p>

                  <button
                    type="button"
                    onClick={
                      handleLogout
                    }
                    disabled={
                      signingOut
                    }
                    className="group mt-7 flex min-h-[50px] items-center justify-center gap-3 rounded-full border border-[#8062dc]/30 bg-[#8062dc]/[0.07] px-7 text-[7px] font-black tracking-[0.1em] text-[#b69df4] transition hover:border-[#8062dc]/50 hover:bg-[#8062dc]/[0.12] disabled:cursor-wait disabled:opacity-50"
                  >
                    <LogOut
                      size={
                        12
                      }
                    />

                    {
                      signingOut
                        ? "SIGNING OUT"
                        : "LOG OUT"
                    }

                    <ArrowRight
                      size={
                        11
                      }
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid gap-px bg-white/[0.06] lg:grid-cols-2">
              {/* DEMO */}

              <div className="relative min-h-[300px] overflow-hidden bg-[#09140a] p-7 sm:p-10">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(circle at 85% 20%,rgba(204,232,73,.08),transparent 38%)",
                  }}
                />

                <div className="relative">
                  <Play
                    size={
                      17
                    }
                    className="text-[#cce849]"
                  />

                  <p className="mt-6 text-[7px] font-black tracking-[0.15em] text-white/28">
                    DEMO EXPERIENCE
                  </p>

                  <p
                    className="mt-4 uppercase text-[#cce849]"
                    style={{
                      fontFamily:
                        DISPLAY_FONT,

                      fontWeight:
                        900,

                      fontSize:
                        "clamp(32px,3vw,52px)",

                      lineHeight:
                        0.84,

                      letterSpacing:
                        "-0.05em",
                    }}
                  >
                    ENTER WITHOUT
                    <br />
                    FALSE AUTH.
                  </p>

                  <p className="mt-5 max-w-[460px] text-[9px] leading-5 text-white/42">
                    Guest mode keeps the CAIROS experience available
                    without pretending that an authenticated identity
                    exists.
                  </p>

                  <Link
                    href="/twin"
                    className="group mt-6 flex min-h-[50px] w-fit items-center justify-center gap-3 rounded-full bg-[#cce849] px-7 text-[7px] font-black tracking-[0.1em] text-[#11150f] transition hover:bg-[#d8ef63]"
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

              {/* LOGIN */}

              <div className="relative min-h-[300px] overflow-hidden bg-[#0c0913] p-7 sm:p-10">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(circle at 85% 20%,rgba(128,98,220,.10),transparent 38%)",
                  }}
                />

                <div className="relative">
                  <KeyRound
                    size={
                      17
                    }
                    className="text-[#8062dc]"
                  />

                  <p className="mt-6 text-[7px] font-black tracking-[0.15em] text-white/28">
                    ACCOUNT ACCESS
                  </p>

                  <p
                    className="mt-4 uppercase text-[#9677e8]"
                    style={{
                      fontFamily:
                        DISPLAY_FONT,

                      fontWeight:
                        900,

                      fontSize:
                        "clamp(32px,3vw,52px)",

                      lineHeight:
                        0.84,

                      letterSpacing:
                        "-0.05em",
                    }}
                  >
                    IDENTITY NEEDS
                    <br />
                    A REAL SESSION.
                  </p>

                  <p className="mt-5 max-w-[500px] text-[9px] leading-5 text-white/42">
                    Continue with Google to establish an authenticated
                    CAIROS identity.
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                      href="/login"
                      className="group flex min-h-[50px] items-center justify-center gap-3 rounded-full border border-[#8062dc]/35 bg-[#8062dc]/[0.07] px-7 text-[7px] font-black tracking-[0.1em] text-[#b69df4] transition hover:border-[#8062dc]/55 hover:bg-[#8062dc]/[0.12]"
                    >
                      <LogIn
                        size={
                          12
                        }
                      />

                      LOGIN

                      <ArrowRight
                        size={
                          11
                        }
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </Link>

                    <Link
                      href="/signup"
                      className="group flex min-h-[50px] items-center justify-center gap-3 rounded-full border border-white/[0.12] px-7 text-[7px] font-black tracking-[0.1em] text-white/55 transition hover:border-white/25 hover:text-white"
                    >
                      <UserPlus
                        size={
                          12
                        }
                      />

                      SIGN UP
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ==================================================
          IDENTITY DOCKET
      ================================================== */}

      <section className="relative p-3 pt-0 sm:p-5 sm:pt-0">
        <div className="mx-auto max-w-[1480px] overflow-hidden rounded-[30px] border border-white/[0.09] bg-[#081009]">
          <div className="grid gap-px bg-white/[0.06] lg:grid-cols-[0.9fr_1.1fr]">
            {/* PROFILE PAPER */}

            <div className="relative bg-[#dfded3] p-7 text-[#11150f] sm:p-10">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-[0.18]"
                style={{
                  backgroundImage: [
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
                    <p className="text-[6px] font-black tracking-[0.15em] text-black/30">
                      CAIROS / IDENTITY RECORD
                    </p>

                    <p className="mt-2 font-mono text-[7px] font-bold text-black/44">
                      authenticated identity surface
                    </p>
                  </div>

                  <div
                    className={`rounded-[5px] px-3 py-2 ${
                      sessionActive
                        ? "bg-[#11150f]"
                        : "bg-[#2b2413]"
                    }`}
                  >
                    <span
                      className={`text-[6px] font-black tracking-[0.11em] ${
                        sessionActive
                          ? "text-[#9677e8]"
                          : "text-[#d2ac4b]"
                      }`}
                    >
                      {
                        sessionActive
                          ? "SESSION ACTIVE"
                          : "GUEST MODE"
                      }
                    </span>
                  </div>
                </div>

                {/* AVATAR */}

                <div className="flex items-center gap-5 border-b border-black/10 py-7">
                  <div className="flex h-[70px] w-[70px] shrink-0 items-center justify-center rounded-full bg-[#11150f]">
                    <UserRound
                      size={
                        25
                      }
                      className={
                        sessionActive
                          ? "text-[#9677e8]"
                          : "text-[#cce849]"
                      }
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[6px] font-black tracking-[0.13em] text-black/26">
                      CURRENT IDENTITY
                    </p>

                    <p className="mt-2 truncate text-[18px] font-black tracking-[-0.03em]">
                      {
                        sessionActive
                          ? displayName
                          : "Guest"
                      }
                    </p>

                    <p className="mt-1 break-all text-[7px] text-black/40">
                      {
                        sessionActive
                          ? displayEmail
                          : "No authenticated account is active."
                      }
                    </p>
                  </div>
                </div>

                <ProfileRow
                  label="SESSION"
                  value={
                    sessionActive
                      ? "Google / Auth.js active"
                      : "Guest demo"
                  }
                />

                <ProfileRow
                  label="ROLE"
                  value={
                    sessionActive
                      ? displayRole
                      : "No authenticated role"
                  }
                />

                <ProfileRow
                  label="ORGANIZATION"
                  value={
                    sessionActive
                      ? displayOrganization
                      : "Not available"
                  }
                />

                <ProfileRow
                  label="TITLE"
                  value={
                    sessionActive
                      ? displayTitle
                      : "Not available"
                  }
                />

                <ProfileRow
                  label="AUTHORITY"
                  value="Evaluated per action"
                />

                <ProfileRow
                  label="PROFILE SOURCE"
                  value={
                    sessionActive
                      ? "Google OAuth / CAIROS session"
                      : "Frontend guest state"
                  }
                />

                <div className="mt-7 flex items-start gap-3 rounded-[13px] border border-[#8062dc]/18 bg-[#8062dc]/[0.045] p-5">
                  <CircleAlert
                    size={
                      13
                    }
                    className="mt-0.5 shrink-0 text-[#684bc2]"
                  />

                  <div>
                    <p className="text-[6px] font-black tracking-[0.12em] text-[#684bc2]">
                      TRUST BOUNDARY
                    </p>

                    <p className="mt-2 text-[7px] leading-4 text-black/44">
                      Authentication establishes identity and interface
                      role. It does not grant execution authority or
                      bypass CAIROS governance decisions.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* PRINCIPLE */}

            <div className="relative overflow-hidden bg-[#0c0913] p-8 sm:p-12">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(circle at 82% 18%,rgba(128,98,220,.10),transparent 36%)",
                }}
              />

              <div className="relative">
                <Fingerprint
                  size={
                    19
                  }
                  className="text-[#8062dc]"
                />

                <p className="mt-8 text-[7px] font-black tracking-[0.16em] text-white/26">
                  ACCESS MODEL
                </p>

                <h2
                  className="mt-5 uppercase"
                  style={{
                    fontFamily:
                      DISPLAY_FONT,

                    fontWeight:
                      900,

                    fontSize:
                      "clamp(42px,4.4vw,76px)",

                    lineHeight:
                      0.8,

                    letterSpacing:
                      "-0.055em",
                  }}
                >
                  <span className="block">
                    ROLE IS
                  </span>

                  <span className="block text-[#8062dc]">
                    NOT AUTHORITY.
                  </span>
                </h2>

                <p className="mt-7 max-w-[500px] text-[10px] leading-6 text-white/42">
                  A role controls interface access. CAIROS still
                  evaluates the requested action, its permissions,
                  risk and required human authority independently.
                </p>

                <div className="mt-9 border-t border-white/[0.08]">
                  <AccessPrinciple
                    icon={
                      UserRound
                    }
                    label="IDENTITY"
                    value="Who is using CAIROS."
                    color="#9677e8"
                  />

                  <AccessPrinciple
                    icon={
                      UsersRound
                    }
                    label="ROLE"
                    value="Which interface capabilities are available."
                    color="#c6a248"
                  />

                  <AccessPrinciple
                    icon={
                      ShieldCheck
                    }
                    label="GOVERNANCE"
                    value="Whether this action may proceed."
                    color="#cce849"
                  />

                  <AccessPrinciple
                    icon={
                      LockKeyhole
                    }
                    label="EXECUTION GATE"
                    value="Enforces the final authority at runtime."
                    color="#c95852"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          ROLE MATRIX
      ================================================== */}

      <section className="relative p-3 pt-0 sm:p-5 sm:pt-0">
        <div className="mx-auto max-w-[1480px] overflow-hidden rounded-[30px] border border-white/[0.09] bg-[#07110a]">
          <div className="grid gap-8 border-b border-white/[0.08] px-8 py-9 sm:px-12 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <div className="flex items-center gap-4">
                <span className="text-[7px] font-black tracking-[0.17em] text-[#8062dc]">
                  ROLE MATRIX
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
                    "clamp(42px,4.8vw,82px)",

                  lineHeight:
                    0.8,

                  letterSpacing:
                    "-0.055em",
                }}
              >
                <span className="block">
                  ACCESS HAS
                </span>

                <span className="block text-[#8062dc]">
                  BOUNDARIES.
                </span>
              </h2>
            </div>

            <div className="max-w-[410px] border-t border-white/[0.09] pt-5">
              <p className="text-[6px] font-black tracking-[0.15em] text-white/24">
                CURRENT ROLE
              </p>

              <p className="mt-3 text-[9px] leading-5 text-white/40">
                {sessionActive
                  ? `Your current interface role is ${displayRole}. Role access does not bypass CAIROS governance.`
                  : "Sign in to establish an authenticated interface role."}
              </p>
            </div>
          </div>

          <div className="grid gap-px bg-white/[0.06] lg:grid-cols-3">
            {ROLE_MATRIX.map(
              (
                item
              ) => (
                <RolePanel
                  key={
                    item.role
                  }
                  item={
                    item
                  }
                  active={
                    sessionActive &&
                    item.role ===
                      displayRole
                  }
                />
              )
            )}
          </div>

          <div className="flex flex-col gap-7 border-t border-white/[0.08] px-8 py-8 sm:px-12 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[6px] font-black tracking-[0.15em] text-[#8062dc]">
                CAIROS / IDENTITY PRINCIPLE
              </p>

              <p
                className="mt-3 max-w-[800px] uppercase"
                style={{
                  fontFamily:
                    DISPLAY_FONT,

                  fontWeight:
                    900,

                  fontSize:
                    "clamp(23px,2.15vw,38px)",

                  lineHeight:
                    0.94,

                  letterSpacing:
                    "-0.035em",
                }}
              >
                KNOW THE ACTOR.

                <span className="text-[#8062dc]">
                  {" "}
                  RESPECT THE ROLE.
                </span>

                <span className="text-[#cce849]">
                  {" "}
                  KEEP THE GATE.
                </span>
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/policies"
                className="flex min-h-[50px] items-center justify-center gap-3 rounded-full border border-white/[0.1] px-6 text-[7px] font-black tracking-[0.1em] text-white/50 transition hover:border-white/20 hover:text-white/80"
              >
                <Eye
                  size={
                    12
                  }
                />

                POLICIES
              </Link>

              <Link
                href="/settings"
                className="flex min-h-[50px] items-center justify-center gap-3 rounded-full border border-white/[0.1] px-6 text-[7px] font-black tracking-[0.1em] text-white/50 transition hover:border-white/20 hover:text-white/80"
              >
                <Settings2
                  size={
                    12
                  }
                />

                SETTINGS
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ==================================================
   COMPONENTS
================================================== */

function IdentityNode({
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
      <p className="font-mono text-[5px] text-white/20">
        {
          index
        }
      </p>

      <p className="mt-1 text-[6px] font-black tracking-[0.12em] text-white/38">
        {
          label
        }
      </p>
    </div>
  );
}

function SessionTag({
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
    <div className="rounded-full border border-white/[0.08] bg-white/[0.025] px-4 py-2.5">
      <span className="text-[5px] font-black tracking-[0.1em] text-white/22">
        {
          label
        }
      </span>

      <span
        className="ml-2 text-[6px] font-black tracking-[0.08em]"
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

function ProfileRow({
  label,
  value,
}: {
  label:
    string;

  value:
    string;
}) {
  return (
    <div className="grid grid-cols-[120px_1fr] gap-4 border-b border-black/10 py-5">
      <p className="text-[6px] font-black tracking-[0.12em] text-black/30">
        {
          label
        }
      </p>

      <p className="break-words text-[8px] font-black text-black/65">
        {
          value
        }
      </p>
    </div>
  );
}

function AccessPrinciple({
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
    <div className="grid grid-cols-[36px_110px_1fr] gap-4 border-b border-white/[0.07] py-5">
      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.08]">
        <Icon
          size={
            12
          }
          style={{
            color,
          }}
        />
      </div>

      <p
        className="pt-3 text-[6px] font-black tracking-[0.11em]"
        style={{
          color,
        }}
      >
        {
          label
        }
      </p>

      <p className="pt-2 text-[8px] leading-5 text-white/42">
        {
          value
        }
      </p>
    </div>
  );
}

function RolePanel({
  item,
  active,
}: {
  item: {
    id:
      string;

    role:
      string;

    accent:
      string;

    description:
      string;

    capabilities:
      string[];

    restriction:
      string;
  };

  active:
    boolean;
}) {
  return (
    <div
      className={`relative min-h-[460px] overflow-hidden bg-[#081109] p-8 sm:p-10 ${
        active
          ? "ring-1 ring-inset ring-white/[0.12]"
          : ""
      }`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            `radial-gradient(circle at 86% 10%,${item.accent}12,transparent 34%)`,
        }}
      />

      <div className="relative">
        <div className="flex items-start justify-between gap-5">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full border"
            style={{
              borderColor:
                `${item.accent}35`,
            }}
          >
            <UsersRound
              size={
                14
              }
              style={{
                color:
                  item.accent,
              }}
            />
          </div>

          <div className="flex items-center gap-2">
            {active && (
              <span
                className="rounded-full border px-2.5 py-1 text-[5px] font-black tracking-[0.1em]"
                style={{
                  borderColor:
                    `${item.accent}35`,

                  color:
                    item.accent,

                  backgroundColor:
                    `${item.accent}0d`,
                }}
              >
                CURRENT
              </span>
            )}

            <span className="font-mono text-[6px] text-white/20">
              {
                item.id
              }
            </span>
          </div>
        </div>

        <p className="mt-9 text-[6px] font-black tracking-[0.14em] text-white/24">
          ACCESS ROLE
        </p>

        <p
          className="mt-3 uppercase"
          style={{
            fontFamily:
              DISPLAY_FONT,

            fontWeight:
              900,

            fontSize:
              "clamp(34px,3vw,54px)",

            lineHeight:
              0.85,

            letterSpacing:
              "-0.048em",

            color:
              item.accent,
          }}
        >
          {
            item.role
          }
        </p>

        <p className="mt-6 min-h-[60px] text-[9px] leading-5 text-white/40">
          {
            item.description
          }
        </p>

        <div className="mt-7 border-t border-white/[0.08]">
          {item.capabilities.map(
            (
              capability
            ) => (
              <div
                key={
                  capability
                }
                className="flex items-center gap-3 border-b border-white/[0.06] py-4"
              >
                <Check
                  size={
                    10
                  }
                  style={{
                    color:
                      item.accent,
                  }}
                />

                <span className="text-[7px] font-black tracking-[0.04em] text-white/42">
                  {
                    capability
                  }
                </span>
              </div>
            )
          )}
        </div>

        <div className="mt-6 flex items-start gap-3">
          <LockKeyhole
            size={
              11
            }
            className="mt-0.5 shrink-0 text-white/28"
          />

          <p className="text-[6px] leading-4 text-white/32">
            {
              item.restriction
            }
          </p>
        </div>
      </div>
    </div>
  );
}