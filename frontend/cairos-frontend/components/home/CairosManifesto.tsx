"use client";

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import {
  ArrowDown,
} from "lucide-react";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";

import CairosDarkCanvas from "@/components/three/CairosDarkCanvas";
import CairosHeroScene from "@/components/three/CairosHeroScene";

const DISPLAY_FONT =
  "'Arial Narrow', 'Roboto Condensed', Haettenschweiler, Impact, sans-serif";

interface ManifestoStatement {
  number: string;

  lines: string[];

  accent: string;

  control: string;

  note: string;

  tone:
    | "lime"
    | "gold"
    | "purple";
}

const STATEMENTS: ManifestoStatement[] = [
  {
    number:
      "01",

    lines: [
      "AN AGENT CAN",
      "PROPOSE A CHANGE.",
    ],

    accent:
      "PROPOSE",

    control:
      "INTENT CAPTURE",

    note:
      "The request begins as intent — not authority.",

    tone:
      "lime",
  },

  {
    number:
      "02",

    lines: [
      "THE TWIN TESTS IT",
      "BEFORE PRODUCTION.",
    ],

    accent:
      "TWIN",

    control:
      "SAFE SIMULATION",

    note:
      "The proposed plan is exercised away from production.",

    tone:
      "lime",
  },

  {
    number:
      "03",

    lines: [
      "CAIROS MEASURES",
      "RISK, AUTHORITY",
      "AND REVERSIBILITY.",
    ],

    accent:
      "RISK",

    control:
      "GOVERNANCE",

    note:
      "Blast radius, necessity and authority shape the decision.",

    tone:
      "gold",
  },

  {
    number:
      "04",

    lines: [
      "WHEN AUTONOMY ENDS,",
      "A HUMAN HOLDS",
      "THE GATE.",
    ],

    accent:
      "HUMAN",

    control:
      "HUMAN AUTHORITY",

    note:
      "High-risk action stops where accountable authority begins.",

    tone:
      "gold",
  },

  {
    number:
      "05",

    lines: [
      "WHEN SOMETHING",
      "BREAKS.",
      "AGENTDNA REPLAYS",
      "WHAT HAPPENED.",
    ],

    accent:
      "AGENTDNA",

    control:
      "CAUSAL REPLAY",

    note:
      "Observable evidence is replayed to isolate the causal break.",

    tone:
      "purple",
  },
];

export default function CairosManifesto() {
  const sectionRef =
    useRef<HTMLElement | null>(
      null
    );

  const progressRef =
    useRef(0);

  const pointerRef =
    useRef({
      x: 0,
      y: 0,
    });

  const [
    activeIndex,
    setActiveIndex,
  ] =
    useState(0);

  const {
    scrollYProgress,
  } =
    useScroll({
      target:
        sectionRef,

      offset: [
        "start start",
        "end end",
      ],
    });

  useMotionValueEvent(
    scrollYProgress,
    "change",
    (
      value
    ) => {
      const progress =
        clamp(
          value,
          0,
          1
        );

      progressRef.current =
        progress;

      const nextIndex =
        Math.min(
          STATEMENTS.length -
            1,
          Math.floor(
            progress *
              STATEMENTS.length
          )
        );

      setActiveIndex(
        nextIndex
      );
    }
  );

  useEffect(() => {
    const handlePointerMove =
      (
        event:
          PointerEvent
      ) => {
        const width =
          Math.max(
            1,
            window.innerWidth
          );

        const height =
          Math.max(
            1,
            window.innerHeight
          );

        pointerRef.current.x =
          clamp(
            (
              event.clientX /
              width
            ) *
              2 -
              1,
            -1,
            1
          );

        pointerRef.current.y =
          clamp(
            -(
              (
                event.clientY /
                height
              ) *
                2 -
              1
            ),
            -1,
            1
          );
      };

    window.addEventListener(
      "pointermove",
      handlePointerMove,
      {
        passive:
          true,
      }
    );

    return () => {
      window.removeEventListener(
        "pointermove",
        handlePointerMove
      );
    };
  }, []);

  const activeStatement =
    STATEMENTS[
      activeIndex
    ];

  const accentColor =
    toneColor(
      activeStatement.tone
    );

  return (
    <section
      id="manifesto"
      ref={
        sectionRef
      }
      className="relative h-[410svh]"
    >
      <div className="sticky top-0 h-[100svh] p-3 sm:p-5">
        <div className="relative h-full overflow-hidden rounded-[30px] border border-white/[0.075] bg-[#040704]">
          {/* =====================================
              WORLD
          ===================================== */}

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0"
            style={{
              background: [
                "linear-gradient(90deg,rgba(3,6,3,.995) 0%,rgba(3,7,4,.98) 34%,rgba(5,18,8,.56) 60%,rgba(6,27,13,.70) 100%)",
                "radial-gradient(circle at 76% 34%,rgba(114,141,45,.10),transparent 28%)",
                "radial-gradient(circle at 80% 73%,rgba(23,67,31,.16),transparent 36%)",
              ].join(
                ","
              ),
            }}
          />

          {/* =====================================
              ARCHITECTURAL CONTINUITY
          ===================================== */}

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-[2]"
          >
            <div className="absolute bottom-[15%] left-[8%] top-[15%] w-px bg-white/[0.016]" />

            <div className="absolute bottom-[15%] left-[55%] top-[15%] w-px bg-[#afca4a]/[0.022]" />

            <div className="absolute bottom-[15%] right-[10%] top-[11%] w-px bg-[#afca4a]/[0.04]" />

            <div className="absolute left-[8%] right-[8%] top-[24%] border-t border-white/[0.022]" />

            <div className="absolute bottom-[20%] left-[8%] right-[8%] border-t border-[#a7c33f]/[0.045]" />
          </div>

          {/* =====================================
              TWIN CONTINUATION
          ===================================== */}

          <div className="pointer-events-none absolute inset-0 z-10 opacity-75 sm:opacity-90 lg:opacity-100">
            <CairosDarkCanvas>
              <CairosHeroScene
                progressRef={
                  progressRef
                }
                pointerRef={
                  pointerRef
                }
                variant="manifesto"
              />
            </CairosDarkCanvas>
          </div>

          {/* =====================================
              READABILITY
          ===================================== */}

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-20"
            style={{
              background: [
                "linear-gradient(90deg,rgba(3,6,3,.995) 0%,rgba(3,6,3,.97) 31%,rgba(3,6,3,.70) 43%,rgba(3,6,3,.21) 55%,transparent 67%)",
                "linear-gradient(0deg,rgba(2,4,2,.35) 0%,transparent 23%,transparent 83%,rgba(2,4,2,.12) 100%)",
              ].join(
                ","
              ),
            }}
          />

          {/* =====================================
              CHAPTER HEADER
          ===================================== */}

          <div className="absolute left-[5.2vw] top-[13vh] z-40 flex items-center gap-5">
            <span className="text-[7px] font-black tracking-[0.16em] text-[#cce849]">
              01 / MANIFESTO
            </span>

            <span className="h-px w-12 bg-[#cce849]/24" />

            <span className="text-[6px] font-black tracking-[0.14em] text-white/20">
              AUTONOMY BEFORE REALITY
            </span>
          </div>

          {/* =====================================
              GHOST PRINCIPLES

              Background typography only.
          ===================================== */}

          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-[8.5vw] top-[23vh] z-30 hidden w-[min(800px,46vw)] lg:block"
          >
            <div className="space-y-[1.25vh]">
              {STATEMENTS.map(
                (
                  statement,
                  index
                ) => (
                  <GhostStatement
                    key={
                      statement.number
                    }
                    statement={
                      statement
                    }
                    active={
                      index ===
                      activeIndex
                    }
                  />
                )
              )}
            </div>
          </div>

          {/* =====================================
              FIXED ACTIVE STAGE

              All five statements occupy the exact
              same visual region.
          ===================================== */}

          <div className="absolute left-[5.2vw] top-[29vh] z-40 w-[min(760px,47vw)]">
            <AnimatePresence
              mode="wait"
              initial={false}
            >
              <motion.div
                key={
                  activeStatement.number
                }
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
                exit={{
                  opacity:
                    0,

                  y:
                    -16,
                }}
                transition={{
                  duration:
                    0.4,

                  ease: [
                    0.22,
                    1,
                    0.36,
                    1,
                  ],
                }}
              >
                {/* ACTIVE META */}

                <div className="mb-6 flex items-center gap-4">
                  <span
                    className="text-[6px] font-black tracking-[0.14em]"
                    style={{
                      color:
                        accentColor,
                    }}
                  >
                    {
                      activeStatement.number
                    }
                  </span>

                  <span
                    className="h-px w-8"
                    style={{
                      backgroundColor:
                        `${accentColor}55`,
                    }}
                  />

                  <span className="text-[6px] font-black tracking-[0.13em] text-white/19">
                    ACTIVE PRINCIPLE
                  </span>
                </div>

                {/* HEADLINE */}

                <div>
                  {activeStatement.lines.map(
                    (
                      line,
                      lineIndex
                    ) => (
                      <p
                        key={
                          `${activeStatement.number}-${lineIndex}`
                        }
                        className="whitespace-nowrap uppercase text-[#efefe5]"
                        style={{
                          fontFamily:
                            DISPLAY_FONT,

                          fontWeight:
                            900,

                          fontSize:
                            "clamp(39px,4.15vw,76px)",

                          lineHeight:
                            0.77,

                          letterSpacing:
                            "-0.057em",
                        }}
                      >
                        <HighlightedText
                          text={
                            line
                          }
                          accent={
                            activeStatement.accent
                          }
                          color={
                            accentColor
                          }
                        />
                      </p>
                    )
                  )}
                </div>

                {/* ACTIVE UNDERLINE */}

                <motion.div
                  initial={{
                    scaleX:
                      0,
                  }}
                  animate={{
                    scaleX:
                      1,
                  }}
                  transition={{
                    delay:
                      0.12,

                    duration:
                      0.5,
                  }}
                  className="mt-8 h-px w-[min(350px,40vw)] origin-left"
                  style={{
                    backgroundColor:
                      `${accentColor}50`,
                  }}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* =====================================
              CURRENT CONTROL
          ===================================== */}

          <div className="absolute bottom-[18vh] right-[5.2vw] z-40 hidden w-[300px] xl:block">
            <div
              className="border-t pt-5"
              style={{
                borderColor:
                  `${accentColor}35`,
              }}
            >
              <p className="text-[6px] font-black tracking-[0.15em] text-white/22">
                CURRENT CONTROL
              </p>

              <AnimatePresence
                mode="wait"
                initial={false}
              >
                <motion.div
                  key={
                    activeStatement.control
                  }
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

                    y:
                      -5,
                  }}
                >
                  <p
                    className="mt-3 text-[8px] font-black tracking-[0.11em]"
                    style={{
                      color:
                        accentColor,
                    }}
                  >
                    {
                      activeStatement.control
                    }
                  </p>

                  <p className="mt-4 text-[8px] leading-5 text-white/30">
                    {
                      activeStatement.note
                    }
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* =====================================
              STAGE PROGRESS
          ===================================== */}

          <div className="absolute right-[5.2vw] top-[13vh] z-40 hidden items-center gap-3 lg:flex">
            {STATEMENTS.map(
              (
                statement,
                index
              ) => {
                const complete =
                  index <
                  activeIndex;

                const current =
                  index ===
                  activeIndex;

                return (
                  <span
                    key={
                      statement.number
                    }
                    className="h-[3px] w-10 overflow-hidden bg-white/[0.065]"
                  >
                    <motion.span
                      animate={{
                        scaleX:
                          complete
                            ? 1
                            : current
                              ? 0.58
                              : 0,
                      }}
                      transition={{
                        duration:
                          0.35,
                      }}
                      className="block h-full origin-left"
                      style={{
                        backgroundColor:
                          current
                            ? accentColor
                            : "#cce849",
                      }}
                    />
                  </span>
                );
              }
            )}
          </div>

          {/* =====================================
              NEXT
          ===================================== */}

          <a
            href="#cairos-playbook"
            className="absolute bottom-[7.2vh] right-[5.2vw] z-50 hidden items-center gap-3 text-[6px] font-black tracking-[0.13em] text-white/24 transition hover:text-[#cce849] md:flex"
          >
            NEXT / PLAYBOOK

            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.1]">
              <ArrowDown
                size={11}
              />
            </span>
          </a>

          {/* =====================================
              TICKER
          ===================================== */}

          <div className="absolute inset-x-0 bottom-0 z-50 border-t border-[#cce849]/[0.11] bg-[#020402]/84 backdrop-blur-md">
            <div className="flex min-h-[54px] items-center overflow-hidden">
              <TickerItem>
                SIMULATE BEFORE ACTION
              </TickerItem>

              <TickerDot />

              <TickerItem>
                PRODUCTION UNTOUCHED
              </TickerItem>

              <TickerDot />

              <TickerItem>
                ALLOW / ASK / BLOCK
              </TickerItem>

              <TickerDot />

              <TickerItem>
                HUMAN AUTHORITY
              </TickerItem>

              <TickerDot />

              <TickerItem>
                OBSERVABLE EVIDENCE
              </TickerItem>

              <TickerDot />

              <TickerItem>
                CAUSAL REPLAY
              </TickerItem>
            </div>
          </div>

          {/* FRAME */}

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-[1px] z-[60] rounded-[29px] border border-white/[0.018]"
          />
        </div>
      </div>
    </section>
  );
}

/* ======================================================
   GHOST STATEMENT
====================================================== */

function GhostStatement({
  statement,
  active,
}: {
  statement:
    ManifestoStatement;

  active:
    boolean;
}) {
  return (
    <motion.div
      animate={{
        opacity:
          active
            ? 0.025
            : 0.13,

        x:
          active
            ? 10
            : 0,
      }}
      transition={{
        duration:
          0.38,
      }}
      className="grid grid-cols-[24px_1fr] gap-3"
    >
      <span className="pt-[0.4em] text-[5px] font-black tracking-[0.12em] text-white/10">
        {
          statement.number
        }
      </span>

      <div>
        {statement.lines.map(
          (
            line,
            lineIndex
          ) => (
            <p
              key={
                `${statement.number}-ghost-${lineIndex}`
              }
              className="uppercase text-transparent"
              style={{
                fontFamily:
                  DISPLAY_FONT,

                fontWeight:
                  900,

                fontSize:
                  "clamp(23px,2.65vw,48px)",

                lineHeight:
                  0.82,

                letterSpacing:
                  "-0.05em",

                WebkitTextStroke:
                  "1px rgba(233,235,224,.10)",
              }}
            >
              {
                line
              }
            </p>
          )
        )}
      </div>
    </motion.div>
  );
}

/* ======================================================
   ACTIVE WORD
====================================================== */

function HighlightedText({
  text,
  accent,
  color,
}: {
  text:
    string;

  accent:
    string;

  color:
    string;
}) {
  const upperText =
    text.toUpperCase();

  const upperAccent =
    accent.toUpperCase();

  const index =
    upperText.indexOf(
      upperAccent
    );

  if (
    index ===
    -1
  ) {
    return (
      <>
        {
          text
        }
      </>
    );
  }

  const before =
    text.slice(
      0,
      index
    );

  const word =
    text.slice(
      index,
      index +
        accent.length
    );

  const after =
    text.slice(
      index +
        accent.length
    );

  return (
    <>
      {
        before
      }

      <span
        style={{
          color,
        }}
      >
        {
          word
        }
      </span>

      {
        after
      }
    </>
  );
}

/* ======================================================
   TICKER
====================================================== */

function TickerItem({
  children,
}: {
  children:
    ReactNode;
}) {
  return (
    <span className="shrink-0 px-6 text-[6px] font-black tracking-[0.14em] text-[#cce849]/66 sm:px-9">
      {
        children
      }
    </span>
  );
}

function TickerDot() {
  return (
    <span className="h-[5px] w-[5px] shrink-0 bg-[#cce849]" />
  );
}

/* ======================================================
   COLOR
====================================================== */

function toneColor(
  tone:
    ManifestoStatement["tone"]
) {
  if (
    tone ===
    "purple"
  ) {
    return "#9577e7";
  }

  if (
    tone ===
    "gold"
  ) {
    return "#c6a248";
  }

  return "#cce849";
}

/* ======================================================
   MATH
====================================================== */

function clamp(
  value:
    number,

  min:
    number,

  max:
    number
) {
  return Math.min(
    max,
    Math.max(
      min,
      value
    )
  );
}