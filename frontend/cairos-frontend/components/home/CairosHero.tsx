"use client";

import {
  useEffect,
  useRef,
} from "react";

import {
  ArrowDown,
} from "lucide-react";

import {
  useMotionValueEvent,
  useScroll,
} from "framer-motion";

import CairosDarkCanvas from "@/components/three/CairosDarkCanvas";
import CairosHeroScene from "@/components/three/CairosHeroScene";

const DISPLAY_FONT =
  "'Arial Narrow', 'Roboto Condensed', Haettenschweiler, Impact, sans-serif";

export default function CairosHero() {
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

  const {
    scrollYProgress,
  } =
    useScroll({
      target:
        sectionRef,

      offset: [
        "start start",
        "end start",
      ],
    });

  useMotionValueEvent(
    scrollYProgress,
    "change",
    (
      value
    ) => {
      progressRef.current =
        clamp(
          value,
          0,
          1
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

  return (
    <section
      id="cairos-home"
      ref={sectionRef}
      className="relative h-[118svh]"
    >
      <div className="sticky top-0 h-[100svh] p-3 sm:p-5">
        <div className="relative h-full overflow-hidden rounded-[30px] border border-white/[0.075] bg-[#040704]">
          {/* =====================================
              CINEMATIC BACKGROUND
          ===================================== */}

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0"
            style={{
              background: [
                "linear-gradient(90deg,rgba(3,6,3,.995) 0%,rgba(3,7,4,.98) 32%,rgba(5,18,8,.57) 58%,rgba(6,28,13,.72) 100%)",
                "radial-gradient(circle at 74% 34%,rgba(117,145,47,.10),transparent 27%)",
                "radial-gradient(circle at 79% 72%,rgba(24,69,32,.16),transparent 35%)",
              ].join(
                ","
              ),
            }}
          />

          {/* =====================================
              DEEP ARCHITECTURAL SILHOUETTES
          ===================================== */}

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-[2]"
          >
            <div className="absolute bottom-[13%] left-[41%] top-[17%] w-px bg-white/[0.025]" />

            <div className="absolute bottom-[14%] right-[11%] top-[12%] w-px bg-[#a8c640]/[0.05]" />

            <div className="absolute bottom-[17%] left-[39%] right-[10%] border-t border-[#a3be45]/[0.07]" />

            <div className="absolute right-[7%] top-[22%] h-[49%] w-[39%] border border-[#a9c343]/[0.04]" />

            <div className="absolute right-[12%] top-[15%] h-[66%] w-[1.1vw] min-w-[10px] bg-black/25" />

            <div className="absolute right-[43%] top-[15%] h-[68%] w-[1vw] min-w-[9px] bg-black/35" />
          </div>

          {/* =====================================
              CAIROS WORD

              Cropped, but readable.
          ===================================== */}

          <div className="pointer-events-none absolute inset-x-0 bottom-[-4.9vw] z-10 overflow-hidden">
            <p
              className="whitespace-nowrap text-center uppercase"
              style={{
                fontFamily:
                  DISPLAY_FONT,

                fontWeight:
                  900,

                fontSize:
                  "clamp(108px,14.6vw,258px)",

                lineHeight:
                  0.68,

                letterSpacing:
                  "-0.07em",

                color:
                  "#b5d337",

                opacity:
                  0.84,
              }}
            >
              CAIROS
            </p>
          </div>

          {/* =====================================
              3D SUBJECT
          ===================================== */}

          <div className="pointer-events-none absolute inset-0 z-20">
            <CairosDarkCanvas>
              <CairosHeroScene
                progressRef={
                  progressRef
                }
                pointerRef={
                  pointerRef
                }
                variant="hero"
              />
            </CairosDarkCanvas>
          </div>

          {/* =====================================
              LEFT READABILITY

              Stronger near headline only.
          ===================================== */}

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-30"
            style={{
              background: [
                "linear-gradient(90deg,rgba(3,6,3,.995) 0%,rgba(3,6,3,.96) 28%,rgba(3,6,3,.60) 42%,rgba(3,6,3,.10) 58%,transparent 70%)",
                "linear-gradient(0deg,rgba(2,4,2,.38) 0%,transparent 25%,transparent 78%,rgba(2,4,2,.14) 100%)",
              ].join(
                ","
              ),
            }}
          />

          {/* =====================================
              COPY
          ===================================== */}

          <div className="absolute left-[5.3vw] top-[27vh] z-40 w-[min(760px,85vw)] sm:top-[28vh]">
            <div className="flex items-center gap-5">
              <span className="text-[7px] font-black tracking-[0.17em] text-[#cce849] sm:text-[8px]">
                AUTONOMOUS AGENT SAFETY
              </span>

              <span className="h-px w-14 bg-[#cce849]/25" />
            </div>

            <h1
              className="mt-7 max-w-[760px] uppercase"
              style={{
                fontFamily:
                  DISPLAY_FONT,

                fontWeight:
                  900,

                fontStretch:
                  "condensed",

                fontSize:
                  "clamp(55px,6.15vw,112px)",

                lineHeight:
                  0.76,

                letterSpacing:
                  "-0.058em",
              }}
            >
              <span className="block text-[#efefe5]">
                AUTONOMY
              </span>

              <span className="block text-[#efefe5]">
                NEEDS A{" "}
                <span className="text-[#c7e735]">
                  GATE.
                </span>
              </span>
            </h1>

            <p className="mt-8 max-w-[505px] text-[10px] font-medium leading-6 text-white/44 sm:text-[11px]">
              The agent proposes the
              change. The Twin tests
              the consequence. CAIROS
              decides what is allowed
              to reach reality.
            </p>

            <div className="mt-9 flex items-center gap-4">
              <span className="h-[6px] w-[6px] bg-[#cce849]" />

              <p className="text-[6px] font-black tracking-[0.15em] text-white/31 sm:text-[7px]">
                TWIN → GOVERNANCE →
                AUTHORITY → AGENTDNA
              </p>
            </div>
          </div>

          {/* =====================================
              RIGHT STATE
          ===================================== */}

          <div className="absolute bottom-[23%] right-[5.1vw] z-40 hidden w-[255px] xl:block">
            <div className="border-t border-[#c7df60]/[0.16] pt-5 text-right">
              <p className="text-[6px] font-black tracking-[0.16em] text-white/29">
                STATE
              </p>

              <p className="mt-3 text-[8px] font-black tracking-[0.12em] text-[#cce849]">
                PRODUCTION / UNTOUCHED
              </p>

              <p className="mt-2 text-[6px] font-black tracking-[0.11em] text-white/29">
                AUTHORITY / NOT GRANTED
              </p>
            </div>
          </div>

          {/* =====================================
              BOTTOM META
          ===================================== */}

          <div className="absolute bottom-6 left-[5.3vw] right-[5.3vw] z-40 flex items-end justify-between gap-5">
            <a
              href="#manifesto"
              className="group flex items-center gap-3 text-[6px] font-black tracking-[0.14em] text-white/30 transition hover:text-[#cce849]"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.11] bg-black/15">
                <ArrowDown
                  size={11}
                  className="transition-transform duration-300 group-hover:translate-y-0.5"
                />
              </span>

              <span className="hidden sm:inline">
                ENTER THE SYSTEM
              </span>
            </a>

            <p className="text-[6px] font-black tracking-[0.14em] text-white/23">
              00 / BEFORE REALITY
            </p>
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