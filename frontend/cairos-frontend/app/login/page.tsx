"use client";

import {
  type FormEvent,
  useState,
} from "react";

import Link from "next/link";

import {
  signIn as signInOAuth,
} from "next-auth/react";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Fingerprint,
  KeyRound,
  LockKeyhole,
  Play,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import {
  motion,
} from "framer-motion";

import {
  signInWithCredentials,
} from "@/lib/auth";

const DISPLAY_FONT =
  "'Arial Narrow', 'Roboto Condensed', Haettenschweiler, Impact, sans-serif";

type NoticeState =
  | null
  | {
      type:
        | "info"
        | "warning"
        | "success";

      message:
        string;
    };

type BusyMode =
  | null
  | "google"
  | "credentials";

export default function LoginPage() {
  const [
    email,
    setEmail,
  ] =
    useState("");

  const [
    password,
    setPassword,
  ] =
    useState("");

  const [
    showPassword,
    setShowPassword,
  ] =
    useState(false);

  const [
    notice,
    setNotice,
  ] =
    useState<NoticeState>(
      null
    );

  const [
    busy,
    setBusy,
  ] =
    useState<BusyMode>(
      null
    );

  const startGoogleLogin =
    async () => {
      if (
        busy
      ) {
        return;
      }

      setBusy(
        "google"
      );

      setNotice(
        null
      );

      try {
        await signInOAuth(
          "google",
          {
            redirectTo:
              "/auth/sync",
          }
        );
      } catch {
        setBusy(
          null
        );

        setNotice({
          type:
            "warning",

          message:
            "Google authentication could not be started. Check the OAuth client configuration and try again.",
        });
      }
    };

  const submitLogin =
    async (
      event:
        FormEvent<HTMLFormElement>
    ) => {
      event.preventDefault();

      if (
        busy
      ) {
        return;
      }

      if (
        !email.trim() ||
        !password
      ) {
        setNotice({
          type:
            "warning",

          message:
            "Enter your email and password before continuing.",
        });

        return;
      }

      setBusy(
        "credentials"
      );

      setNotice(
        null
      );

      try {
        const result =
          await signInWithCredentials({
            email:
              email.trim(),

            password,
          });

        if (
          !result.ok
        ) {
          setNotice({
            type:
              "warning",

            message:
              result.message,
          });

          return;
        }

        setNotice({
          type:
            "success",

          message:
            "Local demo identity activated.",
        });

        window.location.href =
          "/";
      } catch {
        setNotice({
          type:
            "warning",

          message:
            "The local demo account could not be opened.",
        });
      } finally {
        setBusy(
          null
        );
      }
    };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050705] text-[#efefe5]">
      {/* =========================================
          BACKGROUND WORLD
      ========================================= */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            [
              "linear-gradient(90deg,rgba(4,6,4,.995) 0%,rgba(5,8,6,.98) 42%,rgba(7,22,13,.76) 72%,rgba(8,30,16,.88) 100%)",
              "radial-gradient(circle at 77% 28%,rgba(204,232,73,.10),transparent 27%)",
              "radial-gradient(circle at 70% 72%,rgba(128,98,220,.08),transparent 34%)",
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

      {/* GIANT BACKGROUND TYPE */}

      <div className="pointer-events-none absolute inset-x-0 bottom-[-4vw] overflow-hidden">
        <p
          className="whitespace-nowrap text-center uppercase"
          style={{
            fontFamily:
              DISPLAY_FONT,

            fontWeight:
              900,

            fontSize:
              "clamp(150px,20vw,350px)",

            lineHeight:
              0.65,

            letterSpacing:
              "-0.07em",

            color:
              "rgba(204,232,73,.04)",
          }}
        >
          ACCESS
        </p>
      </div>

      <section className="relative z-10 flex min-h-screen items-center justify-center p-3 sm:p-5">
        <div className="relative grid min-h-[760px] w-full max-w-[1480px] overflow-hidden rounded-[30px] border border-white/[0.09] bg-black/20 lg:grid-cols-[1.05fr_0.95fr]">
          {/* LEFT */}

          <div className="relative overflow-hidden p-8 sm:p-12 lg:p-16">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(circle at 34% 45%,rgba(204,232,73,.07),transparent 34%)",
              }}
            />

            <div className="relative z-10 flex items-center justify-between gap-5">
              <Link
                href="/"
                className="group flex items-center gap-3 text-[7px] font-black tracking-[0.14em] text-white/32 transition hover:text-[#cce849]"
              >
                <ArrowLeft
                  size={
                    12
                  }
                  className="transition-transform group-hover:-translate-x-1"
                />

                BACK TO CAIROS
              </Link>

              <div className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-[#cce849]" />

                <span className="text-[6px] font-black tracking-[0.14em] text-[#cce849]/60">
                  GOOGLE OAUTH
                </span>
              </div>
            </div>

            <motion.div
              initial={{
                opacity:
                  0,

                y:
                  24,
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
              className="relative z-10 mt-[12vh]"
            >
              <div className="flex items-center gap-4">
                <span className="text-[7px] font-black tracking-[0.18em] text-[#cce849]">
                  CAIROS ACCESS
                </span>

                <span className="h-px w-10 bg-[#cce849]/28" />

                <span className="text-[7px] font-black tracking-[0.14em] text-white/20">
                  IDENTITY / AUTHORITY
                </span>
              </div>

              <h1
                className="mt-7 uppercase"
                style={{
                  fontFamily:
                    DISPLAY_FONT,

                  fontWeight:
                    900,

                  fontSize:
                    "clamp(54px,6.4vw,108px)",

                  lineHeight:
                    0.78,

                  letterSpacing:
                    "-0.06em",
                }}
              >
                <span className="block">
                  KNOW
                </span>

                <span className="block text-[#cce849]">
                  WHO ACTS.
                </span>
              </h1>

              <p className="mt-8 max-w-[490px] text-[10px] leading-6 text-white/38">
                Google establishes the human identity. Interface roles
                are resolved server-side. CAIROS governance still
                decides whether an autonomous action may execute.
              </p>

              <div className="mt-10 max-w-[520px] border-t border-white/[0.09]">
                <RoleRow
                  index="01"
                  label="OPERATOR"
                  description="Default authenticated access for inspection and Agent Twin workflows."
                />

                <RoleRow
                  index="02"
                  label="REVIEWER"
                  description="Granted only through the server-side reviewer allowlist."
                />

                <RoleRow
                  index="03"
                  label="ADMIN"
                  description="Granted only through the server-side administrator allowlist."
                />
              </div>
            </motion.div>

            <div className="absolute bottom-9 left-8 right-8 z-10 sm:left-12 sm:right-12 lg:left-16 lg:right-16">
              <div className="flex items-center gap-4">
                <Fingerprint
                  size={
                    13
                  }
                  className="text-[#8062dc]"
                />

                <span className="text-[6px] font-black tracking-[0.13em] text-white/20">
                  IDENTITY DOES NOT BYPASS GOVERNANCE
                </span>

                <span className="h-px flex-1 bg-white/[0.07]" />
              </div>
            </div>
          </div>

          {/* RIGHT */}

          <div className="relative flex items-center justify-center border-t border-white/[0.08] bg-[#07110a]/70 p-5 sm:p-8 lg:border-l lg:border-t-0">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(circle at 50% 38%,rgba(204,232,73,.08),transparent 30%)",
              }}
            />

            <div className="pointer-events-none absolute left-1/2 top-[9%] hidden h-[240px] w-[240px] -translate-x-1/2 rounded-full border border-[#cce849]/10 lg:block" />

            <div className="pointer-events-none absolute left-1/2 top-[13%] hidden h-[180px] w-[180px] -translate-x-1/2 rounded-full border border-white/[0.06] lg:block" />

            <div className="relative z-10 w-full max-w-[560px]">
              <motion.div
                initial={{
                  opacity:
                    0,

                  y:
                    28,
                }}
                animate={{
                  opacity:
                    1,

                  y:
                    0,
                }}
                transition={{
                  delay:
                    0.08,

                  duration:
                    0.5,
                }}
                className="overflow-hidden rounded-[20px] bg-[#dfded3] text-[#11150f] shadow-[0_34px_120px_rgba(0,0,0,.5)]"
              >
                {/* HEADER */}

                <div className="flex items-center justify-between gap-6 border-b border-black/12 px-6 py-5 sm:px-8">
                  <div>
                    <p className="text-[6px] font-black tracking-[0.15em] text-black/32">
                      CAIROS / ACCESS DOCKET
                    </p>

                    <p className="mt-2 font-mono text-[6px] font-bold tracking-[0.06em] text-black/38">
                      google-oauth / auth.js
                    </p>
                  </div>

                  <div className="rounded-[5px] bg-[#11150f] px-3 py-2">
                    <span className="text-[6px] font-black tracking-[0.11em] text-[#cce849]">
                      OAUTH READY
                    </span>
                  </div>
                </div>

                {/* GOOGLE */}

                <div className="border-b border-black/10 px-6 py-6 sm:px-8">
                  <p className="text-[6px] font-black tracking-[0.13em] text-black/28">
                    VERIFIED IDENTITY
                  </p>

                  <button
                    type="button"
                    onClick={
                      startGoogleLogin
                    }
                    disabled={
                      busy !==
                      null
                    }
                    className="group mt-4 flex min-h-[58px] w-full items-center justify-center gap-4 rounded-full bg-[#11150f] px-7 text-[8px] font-black tracking-[0.09em] text-white transition hover:bg-[#182018] disabled:cursor-wait disabled:opacity-55"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[13px] font-black text-[#11150f]">
                      G
                    </span>

                    {
                      busy ===
                      "google"
                        ? "CONNECTING TO GOOGLE"
                        : "CONTINUE WITH GOOGLE"
                    }

                    <ArrowRight
                      size={
                        12
                      }
                      className="text-[#cce849] transition-transform group-hover:translate-x-1"
                    />
                  </button>

                  <div className="mt-5 flex items-center gap-4">
                    <span className="h-px flex-1 bg-black/10" />

                    <span className="text-[5px] font-black tracking-[0.13em] text-black/25">
                      OR LOCAL DEMO ACCOUNT
                    </span>

                    <span className="h-px flex-1 bg-black/10" />
                  </div>
                </div>

                {/* LOCAL CREDENTIAL FORM */}

                <form
                  onSubmit={
                    submitLogin
                  }
                  className="px-6 py-6 sm:px-8"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#11150f]">
                      <KeyRound
                        size={
                          14
                        }
                        className="text-[#cce849]"
                      />
                    </div>

                    <div>
                      <p className="text-[8px] font-black">
                        LOCAL DEMO CREDENTIALS
                      </p>

                      <p className="mt-2 max-w-[410px] text-[7px] leading-4 text-black/43">
                        Existing browser-local accounts remain available
                        for hackathon testing. They are not a substitute
                        for Google OAuth or backend authorization.
                      </p>
                    </div>
                  </div>

                  <label className="mt-6 block">
                    <span className="text-[6px] font-black tracking-[0.13em] text-black/28">
                      EMAIL
                    </span>

                    <div className="mt-3 flex min-h-[54px] items-center gap-3 border-b border-black/15">
                      <UserRound
                        size={
                          14
                        }
                        className="shrink-0 text-black/28"
                      />

                      <input
                        type="email"
                        value={
                          email
                        }
                        onChange={(
                          event
                        ) =>
                          setEmail(
                            event
                              .target
                              .value
                          )
                        }
                        placeholder="operator@cairos.local"
                        autoComplete="email"
                        className="min-w-0 flex-1 bg-transparent text-[10px] font-bold text-[#11150f] outline-none placeholder:text-black/20"
                      />
                    </div>
                  </label>

                  <label className="mt-6 block">
                    <span className="text-[6px] font-black tracking-[0.13em] text-black/28">
                      PASSWORD
                    </span>

                    <div className="mt-3 flex min-h-[54px] items-center gap-3 border-b border-black/15">
                      <KeyRound
                        size={
                          14
                        }
                        className="shrink-0 text-black/28"
                      />

                      <input
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        value={
                          password
                        }
                        onChange={(
                          event
                        ) =>
                          setPassword(
                            event
                              .target
                              .value
                          )
                        }
                        placeholder="••••••••••••"
                        autoComplete="current-password"
                        className="min-w-0 flex-1 bg-transparent text-[10px] font-bold text-[#11150f] outline-none placeholder:text-black/20"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(
                            (
                              current
                            ) =>
                              !current
                          )
                        }
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition hover:bg-black/[0.05]"
                        aria-label={
                          showPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff
                            size={
                              13
                            }
                            className="text-black/34"
                          />
                        ) : (
                          <Eye
                            size={
                              13
                            }
                            className="text-black/34"
                          />
                        )}
                      </button>
                    </div>
                  </label>

                  {notice && (
                    <div
                      className={`mt-5 flex items-start gap-3 rounded-[12px] border p-4 ${
                        notice.type ===
                        "warning"
                          ? "border-[#b18d32]/20 bg-[#b18d32]/[0.05]"

                          : notice.type ===
                            "success"
                            ? "border-[#718921]/20 bg-[#718921]/[0.05]"

                            : "border-[#8062dc]/20 bg-[#8062dc]/[0.05]"
                      }`}
                    >
                      <LockKeyhole
                        size={
                          12
                        }
                        className="mt-0.5 shrink-0 text-black/45"
                      />

                      <p className="text-[7px] font-bold leading-4 text-black/48">
                        {
                          notice.message
                        }
                      </p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={
                      busy !==
                      null
                    }
                    className="group mt-6 flex min-h-[54px] w-full items-center justify-center gap-4 rounded-full border border-black/12 px-7 text-[7px] font-black tracking-[0.1em] text-black/48 transition hover:bg-black/[0.04] hover:text-black/75 disabled:cursor-wait disabled:opacity-45"
                  >
                    <LockKeyhole
                      size={
                        12
                      }
                    />

                    {
                      busy ===
                      "credentials"
                        ? "VERIFYING LOCAL ACCOUNT"
                        : "USE LOCAL DEMO ACCOUNT"
                    }
                  </button>
                </form>

                {/* DEMO ACCESS */}

                <div className="border-t border-black/11 p-3">
                  <Link
                    href="/twin"
                    className="group flex min-h-[64px] w-full items-center justify-between rounded-[14px] bg-[#11150f] px-5 text-white transition hover:bg-[#181d15] sm:px-7"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#cce849]/18 bg-[#cce849]/[0.05]">
                        <Play
                          size={
                            13
                          }
                          className="text-[#cce849]"
                        />
                      </div>

                      <div>
                        <p className="text-[8px] font-black tracking-[0.09em]">
                          GUEST DEMO
                        </p>

                        <p className="mt-1 text-[6px] text-white/31">
                          Explore CAIROS without authenticated authority.
                        </p>
                      </div>
                    </div>

                    <ArrowRight
                      size={
                        13
                      }
                      className="text-[#cce849] transition-transform group-hover:translate-x-1"
                    />
                  </Link>
                </div>
              </motion.div>

              <div className="mt-5 flex flex-col gap-4 px-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <ShieldCheck
                    size={
                      11
                    }
                    className="text-[#cce849]/55"
                  />

                  <span className="text-[6px] font-black tracking-[0.11em] text-white/22">
                    GOOGLE IDENTITY / CAIROS GOVERNANCE
                  </span>
                </div>

                <Link
                  href="/signup"
                  className="group flex items-center gap-2 text-[6px] font-black tracking-[0.11em] text-white/25 transition hover:text-[#cce849]"
                >
                  LOCAL DEMO SIGNUP

                  <ArrowRight
                    size={
                      10
                    }
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function RoleRow({
  index,
  label,
  description,
}: {
  index:
    string;

  label:
    string;

  description:
    string;
}) {
  return (
    <div className="grid grid-cols-[34px_100px_1fr] gap-4 border-b border-white/[0.07] py-5">
      <span className="font-mono text-[5px] text-white/16">
        {
          index
        }
      </span>

      <span className="text-[6px] font-black tracking-[0.12em] text-[#cce849]/60">
        {
          label
        }
      </span>

      <p className="text-[7px] leading-4 text-white/28">
        {
          description
        }
      </p>
    </div>
  );
}