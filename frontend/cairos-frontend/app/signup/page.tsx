"use client";

import {
  useState,
} from "react";

import Link from "next/link";

import {
  ArrowLeft,
  ArrowRight,
  Fingerprint,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

import {
  motion,
} from "framer-motion";

import {
  signIn,
} from "next-auth/react";

const DISPLAY_FONT =
  "'Arial Narrow', 'Roboto Condensed', Haettenschweiler, Impact, sans-serif";

export default function SignupPage() {
  const [
    busy,
    setBusy,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null
    );

  const continueWithGoogle =
    async () => {
      if (
        busy
      ) {
        return;
      }

      setBusy(
        true
      );

      setError(
        null
      );

      try {
        await signIn(
          "google",
          {
            redirectTo:
              "/auth/sync",
          }
        );
      } catch {
        setBusy(
          false
        );

        setError(
          "Google authentication could not be started. Please try again."
        );
      }
    };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050705] text-[#efefe5]">
      {/* BACKGROUND */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            [
              "linear-gradient(90deg,rgba(4,6,4,.995) 0%,rgba(5,8,6,.98) 42%,rgba(7,22,13,.76) 72%,rgba(8,30,16,.88) 100%)",
              "radial-gradient(circle at 76% 28%,rgba(128,98,220,.10),transparent 28%)",
              "radial-gradient(circle at 68% 72%,rgba(204,232,73,.08),transparent 34%)",
            ].join(
              ","
            ),
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.11]"
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
              "clamp(140px,19vw,330px)",

            lineHeight:
              0.65,

            letterSpacing:
              "-0.07em",

            color:
              "rgba(128,98,220,.045)",
          }}
        >
          IDENTITY
        </p>
      </div>

      <section className="relative z-10 flex min-h-screen items-center justify-center p-3 sm:p-5">
        <div className="grid min-h-[720px] w-full max-w-[1420px] overflow-hidden rounded-[30px] border border-white/[0.09] bg-[#061009]/70 shadow-[0_40px_150px_rgba(0,0,0,.42)] lg:grid-cols-[1.05fr_0.95fr]">
          {/* LEFT */}

          <div className="relative overflow-hidden p-8 sm:p-12 lg:p-16">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(circle at 30% 44%,rgba(204,232,73,.07),transparent 34%)",
              }}
            />

            <div className="relative z-10">
              <Link
                href="/"
                className="group flex w-fit items-center gap-3 text-[8px] font-black tracking-[0.14em] text-white/45 transition hover:text-[#cce849]"
              >
                <ArrowLeft
                  size={
                    13
                  }
                  className="transition-transform group-hover:-translate-x-1"
                />

                BACK TO CAIROS
              </Link>

              <motion.div
                initial={{
                  opacity:
                    0,

                  y:
                    22,
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
                className="mt-[11vh]"
              >
                <div className="flex items-center gap-4">
                  <span className="text-[8px] font-black tracking-[0.17em] text-[#8062dc]">
                    CREATE IDENTITY
                  </span>

                  <span className="h-px w-10 bg-[#8062dc]/30" />

                  <span className="text-[7px] font-black tracking-[0.13em] text-white/28">
                    GOOGLE OAUTH
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
                      "clamp(54px,6vw,104px)",

                    lineHeight:
                      0.79,

                    letterSpacing:
                      "-0.06em",
                  }}
                >
                  <span className="block">
                    ONE
                  </span>

                  <span className="block text-[#8062dc]">
                    VERIFIED
                  </span>

                  <span className="block text-[#cce849]">
                    IDENTITY.
                  </span>
                </h1>

                <p className="mt-8 max-w-[500px] text-[11px] leading-6 text-white/46">
                  Create your CAIROS identity with Google. No separate
                  CAIROS password or frontend role selection is
                  required.
                </p>

                <div className="mt-10 max-w-[540px] border-t border-white/[0.09]">
                  <Principle
                    index="01"
                    title="IDENTITY"
                    description="Google verifies the person entering CAIROS."
                  />

                  <Principle
                    index="02"
                    title="ROLE"
                    description="New identities default to OPERATOR unless trusted configuration grants another role."
                  />

                  <Principle
                    index="03"
                    title="GOVERNANCE"
                    description="Authentication never bypasses CAIROS policy, risk or execution controls."
                  />
                </div>
              </motion.div>
            </div>
          </div>

          {/* RIGHT */}

          <div className="relative flex items-center justify-center border-t border-white/[0.08] bg-[#0c0913]/80 p-5 sm:p-8 lg:border-l lg:border-t-0">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(circle at 50% 35%,rgba(128,98,220,.11),transparent 32%)",
              }}
            />

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
                delay:
                  0.08,

                duration:
                  0.5,
              }}
              className="relative z-10 w-full max-w-[540px]"
            >
              <div className="overflow-hidden rounded-[22px] bg-[#dfded3] text-[#11150f] shadow-[0_38px_130px_rgba(0,0,0,.52)]">
                {/* HEADER */}

                <div className="flex items-center justify-between gap-6 border-b border-black/12 px-7 py-6">
                  <div>
                    <p className="text-[7px] font-black tracking-[0.15em] text-black/36">
                      CAIROS / ACCOUNT ENROLLMENT
                    </p>

                    <p className="mt-2 font-mono text-[7px] font-bold tracking-[0.06em] text-black/42">
                      google-oauth / auth.js
                    </p>
                  </div>

                  <div className="rounded-[6px] bg-[#11150f] px-3 py-2">
                    <span className="text-[6px] font-black tracking-[0.11em] text-[#cce849]">
                      OAUTH
                    </span>
                  </div>
                </div>

                {/* BODY */}

                <div className="px-7 py-10 sm:px-9">
                  <div className="flex h-13 w-13 items-center justify-center rounded-full bg-[#11150f]">
                    <Fingerprint
                      size={
                        20
                      }
                      className="text-[#9677e8]"
                    />
                  </div>

                  <p className="mt-8 text-[7px] font-black tracking-[0.14em] text-black/32">
                    CREATE CAIROS ACCOUNT
                  </p>

                  <h2
                    className="mt-4 uppercase"
                    style={{
                      fontFamily:
                        DISPLAY_FONT,

                      fontWeight:
                        900,

                      fontSize:
                        "clamp(42px,3.8vw,66px)",

                      lineHeight:
                        0.83,

                      letterSpacing:
                        "-0.05em",
                    }}
                  >
                    CONTINUE

                    <br />

                    <span className="text-[#684bc2]">
                      WITH GOOGLE.
                    </span>
                  </h2>

                  <p className="mt-6 max-w-[430px] text-[9px] leading-5 text-black/48">
                    Google securely verifies your identity. CAIROS
                    then establishes the application session without
                    asking you to create another password.
                  </p>

                  {/* GOOGLE BUTTON */}

                  <button
                    type="button"
                    onClick={
                      continueWithGoogle
                    }
                    disabled={
                      busy
                    }
                    className="group mt-8 flex min-h-[62px] w-full items-center justify-center gap-4 rounded-full bg-[#11150f] px-7 text-[9px] font-black tracking-[0.09em] text-white transition hover:bg-[#182018] disabled:cursor-wait disabled:opacity-55"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[14px] font-black text-[#11150f]">
                      G
                    </span>

                    {
                      busy
                        ? "CONNECTING TO GOOGLE"
                        : "CONTINUE WITH GOOGLE"
                    }

                    <ArrowRight
                      size={
                        13
                      }
                      className="text-[#cce849] transition-transform group-hover:translate-x-1"
                    />
                  </button>

                  {error && (
                    <div className="mt-5 flex items-start gap-3 rounded-[12px] border border-[#b64e47]/18 bg-[#b64e47]/[0.06] p-4">
                      <LockKeyhole
                        size={
                          13
                        }
                        className="mt-0.5 shrink-0 text-[#9f4742]"
                      />

                      <p className="text-[8px] font-bold leading-4 text-[#87423e]">
                        {
                          error
                        }
                      </p>
                    </div>
                  )}

                  {/* SAFETY */}

                  <div className="mt-8 border-t border-black/10 pt-6">
                    <div className="flex items-start gap-3">
                      <ShieldCheck
                        size={
                          14
                        }
                        className="mt-0.5 shrink-0 text-[#718921]"
                      />

                      <div>
                        <p className="text-[7px] font-black tracking-[0.12em] text-black/52">
                          AUTHORITY BOUNDARY
                        </p>

                        <p className="mt-2 text-[8px] leading-5 text-black/42">
                          Signing up establishes identity only. It does
                          not grant execution authority or bypass
                          CAIROS governance.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* LOGIN */}

                <div className="border-t border-black/11 p-3">
                  <Link
                    href="/login"
                    className="group flex min-h-[60px] w-full items-center justify-between rounded-[14px] border border-black/10 px-6 transition hover:bg-black/[0.035]"
                  >
                    <div>
                      <p className="text-[8px] font-black tracking-[0.09em]">
                        ALREADY HAVE ACCESS?
                      </p>

                      <p className="mt-1 text-[7px] text-black/38">
                        Open the CAIROS login surface.
                      </p>
                    </div>

                    <ArrowRight
                      size={
                        13
                      }
                      className="text-black/40 transition-transform group-hover:translate-x-1"
                    />
                  </Link>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-3 px-2">
                <ShieldCheck
                  size={
                    12
                  }
                  className="text-[#cce849]/65"
                />

                <span className="text-[7px] font-black tracking-[0.11em] text-white/32">
                  GOOGLE IDENTITY / CAIROS GOVERNANCE
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Principle({
  index,
  title,
  description,
}: {
  index:
    string;

  title:
    string;

  description:
    string;
}) {
  return (
    <div className="grid grid-cols-[32px_110px_1fr] gap-4 border-b border-white/[0.07] py-5">
      <span className="font-mono text-[6px] text-white/24">
        {
          index
        }
      </span>

      <span className="text-[7px] font-black tracking-[0.12em] text-[#9677e8]">
        {
          title
        }
      </span>

      <p className="text-[8px] leading-4 text-white/40">
        {
          description
        }
      </p>
    </div>
  );
}