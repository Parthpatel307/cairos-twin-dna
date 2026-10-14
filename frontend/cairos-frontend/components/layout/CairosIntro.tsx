"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  usePathname,
} from "next/navigation";

import {
  ShieldCheck,
} from "lucide-react";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";

const INTRO_KEY =
  "cairos_intro_seen_v3";

export default function CairosIntro() {
  const pathname =
    usePathname();

  const reduceMotion =
    useReducedMotion();

  const [
    mounted,
    setMounted,
  ] = useState(false);

  const [
    visible,
    setVisible,
  ] = useState(false);

  useEffect(() => {
    setMounted(true);

    /*
      Intro only belongs to the homepage.

      This prevents it from randomly
      appearing inside Twin / Risk / etc.
    */

    if (
      pathname !== "/"
    ) {
      setVisible(false);
      return;
    }

    const params =
      new URLSearchParams(
        window.location.search
      );

    /*
      DEVELOPMENT PREVIEW:

      http://localhost:3000/?intro=1

      This ALWAYS forces the animation
      without changing the saved state.
    */

    const forcePreview =
      params.get(
        "intro"
      ) === "1";

    if (forcePreview) {
      setVisible(true);

      const previewTimer =
        window.setTimeout(
          () => {
            setVisible(false);
          },
          reduceMotion
            ? 1200
            : 4300
        );

      return () => {
        window.clearTimeout(
          previewTimer
        );
      };
    }

    const alreadySeen =
      localStorage.getItem(
        INTRO_KEY
      );

    if (
      alreadySeen === "true"
    ) {
      setVisible(false);
      return;
    }

    /*
      First normal visit.
    */

    setVisible(true);

    /*
      Mark as seen only after the animation
      has actually had time to appear.
    */

    const seenTimer =
      window.setTimeout(
        () => {
          localStorage.setItem(
            INTRO_KEY,
            "true"
          );
        },
        reduceMotion
          ? 400
          : 2500
      );

    const closeTimer =
      window.setTimeout(
        () => {
          setVisible(false);
        },
        reduceMotion
          ? 1200
          : 4300
      );

    return () => {
      window.clearTimeout(
        seenTimer
      );

      window.clearTimeout(
        closeTimer
      );
    };
  }, [
    pathname,
    reduceMotion,
  ]);

  if (
    !mounted ||
    pathname !== "/"
  ) {
    return null;
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="cairos-cinematic-intro"
          initial={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
            scale: 1.035,
            filter:
              "blur(12px)",
          }}
          transition={{
            duration: 0.75,

            ease: [
              0.22,
              1,
              0.36,
              1,
            ],
          }}
          className="fixed inset-0 z-[999999] flex items-center justify-center overflow-hidden bg-[#020302]"
        >
          {/* =================================
              BACKGROUND
          ================================= */}

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(205,255,70,.09),transparent_28%,rgba(0,0,0,.76)_67%,#020302_100%)]" />

            <div className="absolute inset-0 opacity-[0.13] [background-image:linear-gradient(rgba(255,255,255,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.04)_1px,transparent_1px)] [background-size:62px_62px]" />

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.35,
              }}
              animate={{
                opacity: [
                  0,
                  0.8,
                  0.35,
                ],

                scale: [
                  0.35,
                  1,
                  1.2,
                ],
              }}
              transition={{
                duration: 3.7,
              }}
              className="absolute left-1/2 top-1/2 h-[680px] w-[680px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime-300/[0.05] blur-[135px]"
            />
          </div>

          {/* =================================
              SCAN EFFECT
          ================================= */}

          {!reduceMotion && (
            <>
              <motion.div
                initial={{
                  top: "-10%",
                }}
                animate={{
                  top: "110%",
                }}
                transition={{
                  duration: 3,
                  ease:
                    "easeInOut",
                }}
                className="pointer-events-none absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-lime-300/60 to-transparent shadow-[0_0_35px_rgba(190,242,100,.7)]"
              />

              <motion.div
                initial={{
                  left: "-30%",
                  opacity: 0,
                }}
                animate={{
                  left: "120%",
                  opacity: [
                    0,
                    0.45,
                    0,
                  ],
                }}
                transition={{
                  delay: 0.35,
                  duration: 2.8,
                }}
                className="pointer-events-none absolute top-0 h-full w-[18%] skew-x-[-18deg] bg-gradient-to-r from-transparent via-lime-300/[0.05] to-transparent blur-xl"
              />
            </>
          )}

          {/* =================================
              3D CORE SYSTEM
          ================================= */}

          <div
            className="relative flex h-[680px] w-[680px] items-center justify-center"
            style={{
              perspective:
                "1600px",
            }}
          >
            {/* OUTER RING */}

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.25,
                rotateX: 68,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                rotateX: 68,

                rotateZ:
                  reduceMotion
                    ? 0
                    : 360,
              }}
              transition={{
                opacity: {
                  duration: 0.8,
                },

                scale: {
                  duration: 1.35,

                  ease: [
                    0.16,
                    1,
                    0.3,
                    1,
                  ],
                },

                rotateZ: {
                  duration: 12,
                  repeat:
                    Infinity,
                  ease:
                    "linear",
                },
              }}
              className="pointer-events-none absolute h-[470px] w-[470px] rounded-full border border-lime-300/20"
            >
              <span className="absolute left-1/2 top-[-5px] h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-lime-300 shadow-[0_0_26px_rgba(190,242,100,.95)]" />

              <span className="absolute bottom-[12%] right-[10%] h-2 w-2 rounded-full bg-white/70 shadow-[0_0_18px_rgba(255,255,255,.8)]" />
            </motion.div>

            {/* SECOND RING */}

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.3,
                rotateX: 72,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                rotateX: 72,

                rotateZ:
                  reduceMotion
                    ? 0
                    : -360,
              }}
              transition={{
                opacity: {
                  delay: 0.12,
                  duration: 0.8,
                },

                scale: {
                  delay: 0.12,
                  duration: 1.2,
                },

                rotateZ: {
                  duration: 8,
                  repeat:
                    Infinity,
                  ease:
                    "linear",
                },
              }}
              className="pointer-events-none absolute h-[355px] w-[355px] rounded-full border border-white/[0.09]"
            >
              <span className="absolute bottom-[-4px] left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-purple-300 shadow-[0_0_20px_rgba(216,180,254,.85)]" />
            </motion.div>

            {/* VERTICAL RING */}

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.45,
                rotateY: 65,
              }}
              animate={{
                opacity: 0.75,
                scale: 1,

                rotateY:
                  reduceMotion
                    ? 65
                    : 425,
              }}
              transition={{
                opacity: {
                  duration: 1,
                },

                scale: {
                  duration: 1.3,
                },

                rotateY: {
                  duration: 10,
                  repeat:
                    Infinity,
                  ease:
                    "linear",
                },
              }}
              className="pointer-events-none absolute h-[405px] w-[405px] rounded-full border border-lime-300/[0.09]"
            />

            {/* =================================
                LOGO CUBE / CORE
            ================================= */}

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.12,
                rotateY: -60,
                rotateX: 28,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                rotateY: 0,
                rotateX: 0,
              }}
              transition={{
                delay:
                  reduceMotion
                    ? 0
                    : 0.45,

                duration:
                  reduceMotion
                    ? 0.25
                    : 1.25,

                ease: [
                  0.16,
                  1,
                  0.3,
                  1,
                ],
              }}
              className="relative z-20 flex h-[196px] w-[196px] items-center justify-center rounded-[50px] border border-lime-300/25 bg-[#0b1009]/95 shadow-[0_0_110px_rgba(190,242,100,.18),0_45px_110px_rgba(0,0,0,.8)] backdrop-blur-3xl"
            >
              <div className="pointer-events-none absolute inset-3 rounded-[42px] border border-white/[0.08]" />

              <div className="pointer-events-none absolute inset-8 rounded-[30px] border border-lime-300/[0.1]" />

              <motion.div
                animate={
                  reduceMotion
                    ? undefined
                    : {
                        scale: [
                          1,
                          1.08,
                          1,
                        ],

                        filter: [
                          "drop-shadow(0 0 12px rgba(190,242,100,.25))",

                          "drop-shadow(0 0 35px rgba(190,242,100,.8))",

                          "drop-shadow(0 0 12px rgba(190,242,100,.25))",
                        ],
                      }
                }
                transition={{
                  duration: 1.8,
                  repeat:
                    Infinity,
                  ease:
                    "easeInOut",
                }}
              >
                <ShieldCheck
                  size={72}
                  strokeWidth={1.5}
                  className="text-lime-300"
                />
              </motion.div>

              <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/45 to-transparent" />
            </motion.div>

            {/* =================================
                BRAND
            ================================= */}

            <motion.div
              initial={{
                opacity: 0,
                y: 30,
                filter:
                  "blur(12px)",
              }}
              animate={{
                opacity: 1,
                y: 0,
                filter:
                  "blur(0px)",
              }}
              transition={{
                delay:
                  reduceMotion
                    ? 0.1
                    : 1.2,

                duration: 0.85,
              }}
              className="absolute bottom-[34px] z-30 text-center"
            >
              <p className="text-[11px] font-black tracking-[0.46em] text-lime-300">
                CAIROS
              </p>

              <h1 className="mt-3 text-[40px] font-black tracking-[0.18em] text-white sm:text-[46px]">
                TWIN DNA
              </h1>

              <motion.div
                initial={{
                  scaleX: 0,
                }}
                animate={{
                  scaleX: 1,
                }}
                transition={{
                  delay: 1.55,
                  duration: 0.7,
                }}
                className="mx-auto mt-4 h-px w-48 bg-gradient-to-r from-transparent via-lime-300/80 to-transparent"
              />

              <motion.p
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                transition={{
                  delay: 1.8,
                  duration: 0.5,
                }}
                className="mt-4 text-[9px] font-black uppercase tracking-[0.25em] text-white/50"
              >
                Simulate · Govern · Explain
              </motion.p>
            </motion.div>

            {/* STATUS */}

            <motion.div
              initial={{
                opacity: 0,
                y: -15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 1.35,
              }}
              className="absolute top-[35px] flex items-center gap-2 rounded-full border border-white/[0.08] bg-black/30 px-4 py-2 backdrop-blur-xl"
            >
              <motion.span
                animate={
                  reduceMotion
                    ? undefined
                    : {
                        opacity: [
                          0.3,
                          1,
                          0.3,
                        ],
                      }
                }
                transition={{
                  duration: 1,
                  repeat:
                    Infinity,
                }}
                className="h-1.5 w-1.5 rounded-full bg-lime-300 shadow-[0_0_12px_rgba(190,242,100,.9)]"
              />

              <span className="text-[8px] font-black uppercase tracking-[0.17em] text-white/50">
                INITIALIZING SAFETY NETWORK
              </span>
            </motion.div>
          </div>

          {/* =================================
              FINAL FLASH
          ================================= */}

          {!reduceMotion && (
            <motion.div
              initial={{
                opacity: 0,
                scaleX: 0,
              }}
              animate={{
                opacity: [
                  0,
                  0,
                  1,
                  0,
                ],

                scaleX: [
                  0,
                  0,
                  1,
                  1,
                ],
              }}
              transition={{
                duration: 4.15,

                times: [
                  0,
                  0.78,
                  0.9,
                  1,
                ],
              }}
              className="pointer-events-none absolute left-1/2 top-1/2 h-px w-[82%] -translate-x-1/2 bg-gradient-to-r from-transparent via-lime-300 to-transparent shadow-[0_0_55px_rgba(190,242,100,.95)]"
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}