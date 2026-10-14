"use client";

import {
  useRef,
  useState,
} from "react";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";

const DISPLAY_FONT =
  "'Arial Narrow', 'Roboto Condensed', Haettenschweiler, Impact, sans-serif";

type StageTone =
  | "lime"
  | "gold"
  | "purple";

interface PlaybookStage {
  id: number;
  short: string;
  label: string;
  eyebrow: string;
  headline: string[];
  description: string;
  metric: string;
  metricLabel: string;
  state: string;
  tone: StageTone;
}

const STAGES: PlaybookStage[] = [
  {
    id: 1,
    short: "TWIN",
    label: "ISOLATED SIMULATION",
    eyebrow: "SIMULATION SURFACE",
    headline: [
      "TRY THE PLAN",
      "SOMEWHERE",
      "SAFE.",
    ],
    description:
      "The proposed agent plan is replayed inside the Twin before production is allowed to change.",
    metric: "00",
    metricLabel: "PRODUCTION CHANGES",
    state: "PRODUCTION / UNTOUCHED",
    tone: "lime",
  },
  {
    id: 2,
    short: "RISK",
    label: "BLAST RADIUS",
    eyebrow: "CONSEQUENCE MODEL",
    headline: [
      "SEE WHAT",
      "COULD",
      "BREAK.",
    ],
    description:
      "CAIROS measures affected systems, reversibility and blast radius before granting execution authority.",
    metric: "78",
    metricLabel: "RISK SCORE",
    state: "HIGH / REVIEW REQUIRED",
    tone: "gold",
  },
  {
    id: 3,
    short: "AUTHORITY",
    label: "EXECUTION BOUNDARY",
    eyebrow: "HUMAN CONTROL",
    headline: [
      "AUTONOMY",
      "STOPS",
      "HERE.",
    ],
    description:
      "When policy authority ends, the action pauses and an accountable human owns the decision.",
    metric: "ASK",
    metricLabel: "DECISION",
    state: "HUMAN / REQUIRED",
    tone: "gold",
  },
  {
    id: 4,
    short: "DNA",
    label: "CAUSAL FORENSICS",
    eyebrow: "OBSERVABLE EVIDENCE",
    headline: [
      "REPLAY",
      "THE",
      "CAUSE.",
    ],
    description:
      "AgentDNA reconstructs the observable causal path and tests a safer counterfactual after failure.",
    metric: "94%",
    metricLabel: "CONFIDENCE",
    state: "ROOT CAUSE / STEP 03",
    tone: "purple",
  },
];

export default function CairosPlaybook() {
  const sectionRef =
    useRef<HTMLElement | null>(
      null
    );

  const [
    activeIndex,
    setActiveIndex,
  ] =
    useState(0);

  const {
    scrollYProgress,
  } =
    useScroll({
      target: sectionRef,
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

      const next =
        Math.min(
          STAGES.length -
            1,
          Math.floor(
            progress *
              STAGES.length
          )
        );

      setActiveIndex(
        next
      );
    }
  );

  const activeStage =
    STAGES[
      activeIndex
    ];

  const accent =
    toneColor(
      activeStage.tone
    );

  return (
    <section
      id="cairos-playbook"
      ref={sectionRef}
      className="relative h-[390svh]"
    >
      <div className="sticky top-0 h-[100svh] p-3 sm:p-5">
        <div className="relative h-full overflow-hidden rounded-[30px] border border-white/[0.075] bg-[#061009]">
          {/* WORLD */}

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background: [
                "linear-gradient(110deg,rgba(3,7,4,.995) 0%,rgba(4,9,5,.97) 46%,rgba(6,26,12,.69) 100%)",
                "radial-gradient(circle at 79% 26%,rgba(116,143,48,.11),transparent 28%)",
                "radial-gradient(circle at 74% 74%,rgba(25,70,34,.13),transparent 36%)",
              ].join(","),
            }}
          />

          {/* CHAPTER LABEL */}

          <div className="absolute left-[3.4vw] top-[10.8vh] z-40 flex items-center gap-5">
            <span className="text-[7px] font-black tracking-[0.17em] text-[#cce849]">
              02 / PLAYBOOK
            </span>

            <span className="h-px w-12 bg-[#cce849]/26" />

            <span className="text-[6px] font-black tracking-[0.14em] text-white/20">
              HOW CAIROS CONTROLS THE PATH
            </span>
          </div>

          {/* =====================================
              TITLE

              Important change:
              title now owns its own clean area.
              It never overlaps the tactical board.
          ===================================== */}

          <div className="absolute left-[3.4vw] top-[15.5vh] z-40">
            <h2
              className="uppercase"
              style={{
                fontFamily:
                  DISPLAY_FONT,

                fontWeight:
                  900,

                fontSize:
                  "clamp(52px,4.9vw,88px)",

                lineHeight:
                  0.8,

                letterSpacing:
                  "-0.058em",
              }}
            >
              <span className="block text-[#efefe5]">
                ONE PLAY.
              </span>

              <span className="block text-[#b9d938]">
                FOUR CONTROLS.
              </span>
            </h2>
          </div>

          {/* CONTROL MODEL */}

          <div className="absolute right-[4.1vw] top-[22.5vh] z-40 hidden w-[315px] xl:block">
            <div className="border-t border-white/[0.1] pt-4">
              <p className="text-[5px] font-black tracking-[0.15em] text-white/20">
                CONTROL MODEL
              </p>

              <p className="mt-3 text-[7px] font-black tracking-[0.09em] text-white/40">
                SIMULATE → GOVERN →
                AUTHORIZE → EXPLAIN
              </p>
            </div>
          </div>

          {/* =====================================
              MAIN SURFACE

              Moved down from 31vh → 34.5vh.
              No title/board collision.
          ===================================== */}

          <div className="absolute bottom-[9.2vh] left-[3.4vw] right-[3.4vw] top-[34.5vh] z-30 overflow-hidden rounded-[25px] border border-white/[0.075]">
            <div className="grid h-full bg-white/[0.05] lg:grid-cols-[1.18fr_0.82fr]">
              {/* =================================
                  TACTICAL BOARD
              ================================= */}

              <div className="relative min-h-0 overflow-hidden bg-[#deddd2] text-[#11150f]">
                <BoardTexture />

                {/* BOARD HEADER */}

                <div className="absolute left-7 right-7 top-6 z-20 flex items-start justify-between gap-6 sm:left-9 sm:right-9">
                  <div>
                    <p className="text-[5px] font-black tracking-[0.15em] text-black/31">
                      DIGITAL CONTROL MAP
                    </p>

                    <p className="mt-2 text-[6px] font-black tracking-[0.11em] text-black/17">
                      PRE-EXECUTION PATH
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-[5px] font-black tracking-[0.15em] text-black/24">
                      SIMULATION SURFACE
                    </p>

                    <p className="mt-2 text-[6px] font-black tracking-[0.1em] text-[#607a1b]">
                      PRODUCTION / UNTOUCHED
                    </p>
                  </div>
                </div>

                {/* MAP */}

                <div className="absolute inset-x-[7%] bottom-[13%] top-[18%]">
                  <TacticalBoard
                    activeIndex={
                      activeIndex
                    }
                  />
                </div>

                {/* STAGE TAG */}

                <div className="absolute bottom-6 left-7 sm:left-9">
                  <div className="rounded-full bg-[#10150f] px-5 py-3">
                    <span
                      className="text-[6px] font-black tracking-[0.11em]"
                      style={{
                        color:
                          accent,
                      }}
                    >
                      {String(
                        activeStage.id
                      ).padStart(
                        2,
                        "0"
                      )}
                      {" / "}
                      {
                        activeStage.short
                      }
                    </span>
                  </div>
                </div>

                {/* STATE */}

                <div className="absolute bottom-7 right-7 hidden text-right sm:block">
                  <p className="text-[5px] font-black tracking-[0.13em] text-black/22">
                    CURRENT STATE
                  </p>

                  <p
                    className="mt-2 text-[6px] font-black tracking-[0.1em]"
                    style={{
                      color:
                        accent,
                    }}
                  >
                    {
                      activeStage.state
                    }
                  </p>
                </div>
              </div>

              {/* =================================
                  EVIDENCE PANEL
              ================================= */}

              <div className="relative min-h-0 overflow-hidden bg-[#08150b]">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background: [
                      `radial-gradient(circle at 78% 38%,${hexToRgba(
                        accent,
                        0.09
                      )},transparent 33%)`,
                      "linear-gradient(120deg,rgba(5,11,6,.98),rgba(8,27,13,.82))",
                    ].join(","),
                  }}
                />

                <EvidenceArchitecture
                  tone={
                    activeStage.tone
                  }
                />

                {/* SCOREBOARD */}

                <div className="absolute left-8 right-8 top-7 z-30 flex items-start justify-between gap-6 sm:left-10 sm:right-10">
                  <div>
                    <p className="text-[5px] font-black tracking-[0.15em] text-white/19">
                      PLAY INDEX
                    </p>

                    <p
                      className="mt-2 text-[6px] font-black tracking-[0.11em]"
                      style={{
                        color:
                          accent,
                      }}
                    >
                      {
                        activeStage.label
                      }
                    </p>
                  </div>

                  <div className="flex gap-2">
                    {STAGES.map(
                      (
                        stage,
                        index
                      ) => {
                        const selected =
                          index ===
                          activeIndex;

                        return (
                          <button
                            key={
                              stage.id
                            }
                            type="button"
                            onClick={() =>
                              setActiveIndex(
                                index
                              )
                            }
                            className={`min-w-[44px] border-t px-1 pt-2 text-left transition ${
                              selected
                                ? "border-white/40"
                                : "border-white/[0.09] hover:border-white/20"
                            }`}
                          >
                            <span
                              className="block text-[6px] font-black tracking-[0.1em]"
                              style={{
                                color:
                                  selected
                                    ? toneColor(
                                        stage.tone
                                      )
                                    : "rgba(255,255,255,.18)",
                              }}
                            >
                              {String(
                                stage.id
                              ).padStart(
                                2,
                                "0"
                              )}
                            </span>

                            <span
                              className={`mt-1 block text-[5px] font-black tracking-[0.09em] ${
                                selected
                                  ? "text-white/58"
                                  : "text-white/15"
                              }`}
                            >
                              {
                                stage.short
                              }
                            </span>
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>

                {/* ACTIVE COPY */}

                <div className="absolute bottom-[13%] left-8 right-8 z-30 sm:left-10 sm:right-10">
                  <AnimatePresence
                    mode="wait"
                    initial={false}
                  >
                    <motion.div
                      key={
                        activeStage.id
                      }
                      initial={{
                        opacity: 0,
                        y: 18,
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
                        duration:
                          0.38,

                        ease: [
                          0.22,
                          1,
                          0.36,
                          1,
                        ],
                      }}
                    >
                      <div className="mb-5 flex items-center gap-4">
                        <span
                          className="h-[5px] w-[5px]"
                          style={{
                            backgroundColor:
                              accent,
                          }}
                        />

                        <span
                          className="text-[6px] font-black tracking-[0.15em]"
                          style={{
                            color:
                              accent,
                          }}
                        >
                          {
                            activeStage.eyebrow
                          }
                        </span>
                      </div>

                      <div>
                        {activeStage.headline.map(
                          (
                            line,
                            index
                          ) => (
                            <p
                              key={`${activeStage.id}-${index}`}
                              className="uppercase"
                              style={{
                                fontFamily:
                                  DISPLAY_FONT,

                                fontWeight:
                                  900,

                                fontSize:
                                  "clamp(40px,3.9vw,72px)",

                                lineHeight:
                                  0.78,

                                letterSpacing:
                                  "-0.057em",

                                color:
                                  index ===
                                  activeStage.headline.length -
                                    1
                                    ? accent
                                    : "#efefe5",
                              }}
                            >
                              {
                                line
                              }
                            </p>
                          )
                        )}
                      </div>

                      <p className="mt-6 max-w-[470px] text-[9px] leading-6 text-white/36">
                        {
                          activeStage.description
                        }
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* METRIC */}

                <div className="absolute right-8 top-[28%] z-30 hidden text-right xl:block">
                  <p className="text-[5px] font-black tracking-[0.14em] text-white/18">
                    {
                      activeStage.metricLabel
                    }
                  </p>

                  <AnimatePresence
                    mode="wait"
                    initial={false}
                  >
                    <motion.p
                      key={
                        activeStage.metric
                      }
                      initial={{
                        opacity:
                          0,

                        y:
                          8,
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
                      className="mt-2"
                      style={{
                        fontFamily:
                          DISPLAY_FONT,

                        fontWeight:
                          900,

                        fontSize:
                          "clamp(30px,2.5vw,48px)",

                        lineHeight:
                          0.8,

                        letterSpacing:
                          "-0.04em",

                        color:
                          accent,
                      }}
                    >
                      {
                        activeStage.metric
                      }
                    </motion.p>
                  </AnimatePresence>
                </div>

                {/* GHOST NUMBER */}

                <div className="pointer-events-none absolute bottom-5 right-8 opacity-[0.1]">
                  <span
                    style={{
                      fontFamily:
                        DISPLAY_FONT,

                      fontWeight:
                        900,

                      fontSize:
                        "clamp(68px,5.8vw,108px)",

                      lineHeight:
                        0.7,

                      letterSpacing:
                        "-0.055em",

                      color:
                        accent,
                    }}
                  >
                    {String(
                      activeStage.id
                    ).padStart(
                      2,
                      "0"
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* PROGRESS */}

          <div className="absolute bottom-[3.2vh] left-[3.4vw] right-[3.4vw] z-40 flex items-center gap-5">
            <div className="h-px flex-1 overflow-hidden bg-white/[0.08]">
              <motion.div
                animate={{
                  scaleX:
                    (
                      activeIndex +
                      1
                    ) /
                    STAGES.length,
                }}
                transition={{
                  duration:
                    0.4,
                }}
                className="h-full origin-left"
                style={{
                  backgroundColor:
                    accent,
                }}
              />
            </div>

            <span className="text-[6px] font-black tracking-[0.14em] text-white/19">
              {String(
                activeIndex +
                  1
              ).padStart(
                2,
                "0"
              )}
              /04
            </span>
          </div>

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
   TACTICAL BOARD
====================================================== */

function TacticalBoard({
  activeIndex,
}: {
  activeIndex:
    number;
}) {
  const accent =
    toneColor(
      STAGES[
        activeIndex
      ].tone
    );

  const progress =
    (
      activeIndex +
      1
    ) /
    STAGES.length;

  return (
    <svg
      viewBox="0 0 820 430"
      className="h-full w-full"
      aria-hidden="true"
    >
      <rect
        x="38"
        y="35"
        width="744"
        height="350"
        fill="none"
        stroke="rgba(18,28,17,.17)"
        strokeWidth="1.5"
      />

      <line
        x1="410"
        y1="35"
        x2="410"
        y2="385"
        stroke="rgba(18,28,17,.13)"
        strokeWidth="1.2"
      />

      <circle
        cx="410"
        cy="210"
        r="76"
        fill="none"
        stroke="rgba(18,28,17,.11)"
        strokeWidth="1.5"
      />

      <path
        d="M38 128 H104 V292 H38"
        fill="none"
        stroke="rgba(18,28,17,.11)"
        strokeWidth="1.2"
      />

      <path
        d="M782 128 H716 V292 H782"
        fill="none"
        stroke="rgba(18,28,17,.11)"
        strokeWidth="1.2"
      />

      {/* FULL PATH */}

      <path
        d="M82 326
           C125 310 166 256 218 210
           C270 165 320 168 352 214
           C387 264 420 298 456 286
           C506 270 521 176 582 150
           C635 128 670 184 742 230"
        fill="none"
        stroke="rgba(19,28,17,.22)"
        strokeWidth="4"
        strokeDasharray="7 11"
        strokeLinecap="round"
      />

      {/* ACTIVE PATH */}

      <motion.path
        d="M82 326
           C125 310 166 256 218 210
           C270 165 320 168 352 214
           C387 264 420 298 456 286
           C506 270 521 176 582 150
           C635 128 670 184 742 230"
        fill="none"
        stroke={
          accent
        }
        strokeWidth="5"
        strokeLinecap="round"
        initial={false}
        animate={{
          pathLength:
            progress,
        }}
        transition={{
          duration:
            0.65,
        }}
      />

      <BoardNode
        x={82}
        y={326}
        number="00"
        label="INTENT"
        active
        color="#cce849"
      />

      <BoardNode
        x={218}
        y={210}
        number="01"
        label="TWIN"
        active={
          activeIndex >=
          0
        }
        focus={
          activeIndex ===
          0
        }
        color="#7fa727"
      />

      <BoardNode
        x={438}
        y={288}
        number="02"
        label="RISK"
        active={
          activeIndex >=
          1
        }
        focus={
          activeIndex ===
          1
        }
        color="#c6a248"
      />

      <BoardNode
        x={582}
        y={150}
        number="03"
        label="AUTHORITY"
        active={
          activeIndex >=
          2
        }
        focus={
          activeIndex ===
          2
        }
        color="#c6a248"
      />

      <BoardNode
        x={742}
        y={230}
        number="04"
        label="DNA"
        active={
          activeIndex >=
          3
        }
        focus={
          activeIndex ===
          3
        }
        color="#8062dc"
      />

      {activeIndex ===
        0 && (
        <TwinOverlay />
      )}

      {activeIndex ===
        1 && (
        <RiskOverlay />
      )}

      {activeIndex ===
        2 && (
        <AuthorityOverlay />
      )}

      {activeIndex ===
        3 && (
        <DNAOverlay />
      )}
    </svg>
  );
}

function BoardNode({
  x,
  y,
  number,
  label,
  active,
  focus = false,
  color,
}: {
  x: number;
  y: number;
  number: string;
  label: string;
  active: boolean;
  focus?: boolean;
  color: string;
}) {
  return (
    <g>
      {focus && (
        <motion.circle
          cx={x}
          cy={y}
          r="32"
          fill="none"
          stroke={color}
          strokeWidth="1"
          initial={{
            opacity: 0,
            scale: 0.65,
          }}
          animate={{
            opacity: 0.28,
            scale: 1,
          }}
        />
      )}

      <circle
        cx={x}
        cy={y}
        r="19"
        fill="#d8d8cd"
        stroke={
          active
            ? color
            : "rgba(18,28,17,.26)"
        }
        strokeWidth={
          focus
            ? 2.5
            : 1.6
        }
      />

      <circle
        cx={x}
        cy={y}
        r="6"
        fill={
          active
            ? color
            : "rgba(18,28,17,.22)"
        }
      />

      <text
        x={x}
        y={y - 27}
        textAnchor="middle"
        fill="rgba(17,24,16,.35)"
        fontSize="9"
        fontWeight="800"
        letterSpacing="1"
      >
        {number}
      </text>

      <text
        x={x}
        y={y + 38}
        textAnchor="middle"
        fill="rgba(17,24,16,.34)"
        fontSize="8"
        fontWeight="900"
        letterSpacing="1.2"
      >
        {label}
      </text>
    </g>
  );
}

function TwinOverlay() {
  return (
    <g>
      <motion.path
        d="M82 326 C126 304 168 248 218 210"
        fill="none"
        stroke="#789d24"
        strokeWidth="6"
        strokeLinecap="round"
        initial={{
          pathLength: 0,
        }}
        animate={{
          pathLength: 1,
        }}
      />

      <text
        x="132"
        y="286"
        fill="#5f7c1c"
        fontSize="8"
        fontWeight="900"
        letterSpacing="1.2"
      >
        SAFE COPY
      </text>

      <text
        x="248"
        y="194"
        fill="rgba(17,24,16,.29)"
        fontSize="8"
        fontWeight="900"
        letterSpacing="1.1"
      >
        PRODUCTION
      </text>

      <text
        x="248"
        y="207"
        fill="#61791c"
        fontSize="8"
        fontWeight="900"
        letterSpacing="1.1"
      >
        UNTOUCHED
      </text>
    </g>
  );
}

function RiskOverlay() {
  return (
    <g>
      <line
        x1="438"
        y1="288"
        x2="352"
        y2="346"
        stroke="#c95852"
        strokeWidth="2"
      />

      <line
        x1="438"
        y1="288"
        x2="510"
        y2="352"
        stroke="#c95852"
        strokeWidth="2"
      />

      <line
        x1="438"
        y1="288"
        x2="530"
        y2="245"
        stroke="#c95852"
        strokeWidth="2"
      />

      <circle
        cx="352"
        cy="346"
        r="5"
        fill="#c95852"
      />

      <circle
        cx="510"
        cy="352"
        r="5"
        fill="#c95852"
      />

      <circle
        cx="530"
        cy="245"
        r="5"
        fill="#c95852"
      />

      <text
        x="438"
        y="340"
        textAnchor="middle"
        fill="#a54540"
        fontSize="8"
        fontWeight="900"
        letterSpacing="1.2"
      >
        BLAST RADIUS
      </text>
    </g>
  );
}

function AuthorityOverlay() {
  return (
    <g>
      <line
        x1="546"
        y1="106"
        x2="546"
        y2="208"
        stroke="#c6a248"
        strokeWidth="4"
      />

      <line
        x1="618"
        y1="106"
        x2="618"
        y2="208"
        stroke="#c6a248"
        strokeWidth="4"
      />

      <line
        x1="546"
        y1="106"
        x2="618"
        y2="106"
        stroke="#c6a248"
        strokeWidth="2"
      />

      <text
        x="582"
        y="91"
        textAnchor="middle"
        fill="#967927"
        fontSize="8"
        fontWeight="900"
        letterSpacing="1.2"
      >
        HUMAN GATE
      </text>

      <text
        x="582"
        y="226"
        textAnchor="middle"
        fill="rgba(17,24,16,.33)"
        fontSize="8"
        fontWeight="900"
        letterSpacing="1.2"
      >
        ASK
      </text>
    </g>
  );
}

function DNAOverlay() {
  return (
    <g>
      <motion.path
        d="M582 150
           C618 150 632 185 650 202
           C670 220 700 224 742 230"
        fill="none"
        stroke="#8062dc"
        strokeWidth="3"
        initial={{
          pathLength: 0,
        }}
        animate={{
          pathLength: 1,
        }}
      />

      <circle
        cx="625"
        cy="180"
        r="5"
        fill="#8062dc"
      />

      <circle
        cx="670"
        cy="220"
        r="5"
        fill="#9d80ec"
      />

      <circle
        cx="710"
        cy="225"
        r="5"
        fill="#8062dc"
      />

      <text
        x="680"
        y="274"
        textAnchor="middle"
        fill="#7456ce"
        fontSize="8"
        fontWeight="900"
        letterSpacing="1.2"
      >
        CAUSAL REPLAY
      </text>
    </g>
  );
}

function EvidenceArchitecture({
  tone,
}: {
  tone: StageTone;
}) {
  const accent =
    toneColor(
      tone
    );

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div className="absolute right-[7%] top-[20%] h-[47%] w-[34%] border border-white/[0.035]" />

      <div className="absolute right-[12%] top-[29%] h-[31%] w-[18%] border border-white/[0.035]" />

      <div className="absolute right-[30%] top-[22%] h-[52%] w-[10px] bg-black/28" />

      <div className="absolute right-[5%] top-[17%] h-[58%] w-[12px] bg-black/35" />

      <div
        className="absolute right-[17%] top-[32%] h-[25%] w-[3px]"
        style={{
          backgroundColor:
            accent,
        }}
      />

      <div
        className="absolute right-[6%] top-[45%] h-px w-[30%]"
        style={{
          backgroundColor:
            hexToRgba(
              accent,
              0.2
            ),
        }}
      />

      <div
        className="absolute bottom-[23%] right-[6%] h-px w-[46%]"
        style={{
          backgroundColor:
            hexToRgba(
              accent,
              0.12
            ),
        }}
      />

      <div
        className="absolute right-[23%] top-[39%] h-16 w-16 border"
        style={{
          borderColor:
            hexToRgba(
              accent,
              0.1
            ),
        }}
      />
    </div>
  );
}

function BoardTexture() {
  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.24]"
        style={{
          backgroundImage: [
            "radial-gradient(circle,rgba(27,39,24,.20) .6px,transparent .8px)",
            "linear-gradient(rgba(28,42,26,.06) 1px,transparent 1px)",
            "linear-gradient(90deg,rgba(28,42,26,.06) 1px,transparent 1px)",
          ].join(","),

          backgroundSize:
            "18px 18px,72px 72px,72px 72px",
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(120deg,rgba(255,255,255,.08),transparent 40%,rgba(79,91,62,.035) 100%)",
        }}
      />
    </>
  );
}

function toneColor(
  tone: StageTone
) {
  if (
    tone ===
    "purple"
  ) {
    return "#9172e7";
  }

  if (
    tone ===
    "gold"
  ) {
    return "#c6a248";
  }

  return "#cce849";
}

function hexToRgba(
  hex: string,
  alpha: number
) {
  const clean =
    hex.replace(
      "#",
      ""
    );

  if (
    clean.length !==
    6
  ) {
    return `rgba(204,232,73,${alpha})`;
  }

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

function clamp(
  value: number,
  min: number,
  max: number
) {
  return Math.min(
    max,
    Math.max(
      min,
      value
    )
  );
}