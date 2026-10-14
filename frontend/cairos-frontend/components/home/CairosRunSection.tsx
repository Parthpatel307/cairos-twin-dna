"use client";

import {
  FormEvent,
  useRef,
  useState,
  type FocusEvent,
  type PointerEvent,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  ArrowRight,
  Bot,
  Fingerprint,
  Play,
  ShieldCheck,
} from "lucide-react";

import {
  motion,
} from "framer-motion";

import CairosDarkCanvas from "@/components/three/CairosDarkCanvas";
import CairosRunScene from "@/components/three/CairosRunScene";

const QUICK_REQUEST_KEY =
  "cairos_quick_request";

const DISPLAY_FONT =
  "'Arial Narrow', 'Roboto Condensed', Haettenschweiler, Impact, sans-serif";

export default function CairosRunSection() {
  const router =
    useRouter();

  const pointerRef =
    useRef({
      x: 0,
      y: 0,
    });

  const activeRef =
    useRef(false);

  const [
    request,
    setRequest,
  ] =
    useState(
      "Clean unused files from production server"
    );

  const [
    focused,
    setFocused,
  ] =
    useState(false);

  const openTwin =
    (
      requestedAction?: string
    ) => {
      const clean =
        requestedAction?.trim() ||
        request.trim();

      if (!clean) {
        return;
      }

      if (
        typeof window !==
        "undefined"
      ) {
        localStorage.setItem(
          QUICK_REQUEST_KEY,
          clean
        );
      }

      router.push(
        "/twin"
      );
    };

  const submit =
    (
      event:
        FormEvent<HTMLFormElement>
    ) => {
      event.preventDefault();

      openTwin();
    };

  const handlePointerMove =
    (
      event:
        PointerEvent<HTMLElement>
    ) => {
      if (
        event.pointerType !==
        "mouse"
      ) {
        return;
      }

      const rect =
        event.currentTarget.getBoundingClientRect();

      pointerRef.current.x =
        (
          (
            event.clientX -
            rect.left
          ) /
            rect.width
        ) *
          2 -
        1;

      pointerRef.current.y =
        (
          (
            event.clientY -
            rect.top
          ) /
            rect.height
        ) *
          2 -
        1;
    };

  const activate =
    () => {
      activeRef.current =
        true;

      setFocused(
        true
      );
    };

  const deactivate =
    (
      event:
        FocusEvent<HTMLTextAreaElement>
    ) => {
      if (
        event.target.value.trim()
      ) {
        activeRef.current =
          true;

        setFocused(
          false
        );

        return;
      }

      activeRef.current =
        false;

      setFocused(
        false
      );
    };

  const selectScenario =
    (
      value: string
    ) => {
      setRequest(
        value
      );

      activeRef.current =
        true;

      setFocused(
        true
      );
    };

  return (
    <section
      id="try-cairos"
      onPointerMove={
        handlePointerMove
      }
      onPointerLeave={() => {
        pointerRef.current = {
          x: 0,
          y: 0,
        };
      }}
      className="relative p-3 sm:p-5"
    >
      <div className="relative mx-auto min-h-[calc(100svh-24px)] max-w-[1480px] overflow-hidden rounded-[30px] border border-white/[0.09] bg-[#061009]">
        {/* =====================================
            CINEMATIC BACKGROUND
        ===================================== */}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background: [
              "linear-gradient(90deg,rgba(3,7,4,.99) 0%,rgba(4,11,6,.93) 31%,rgba(6,26,12,.45) 61%,rgba(8,38,18,.65) 100%)",
              "radial-gradient(circle at 77% 29%,rgba(132,158,55,.16),transparent 27%)",
              "radial-gradient(circle at 77% 74%,rgba(18,73,34,.38),transparent 39%)",
            ].join(","),
          }}
        />

        {/* =====================================
            HUGE CROPPED BACKGROUND TYPE
        ===================================== */}

        <div className="pointer-events-none absolute inset-x-0 bottom-[-3.5vw] z-[5] overflow-hidden">
          <p
            className="whitespace-nowrap text-center uppercase"
            style={{
              fontFamily:
                DISPLAY_FONT,

              fontWeight:
                900,

              fontSize:
                "clamp(125px,18vw,320px)",

              lineHeight:
                0.67,

              letterSpacing:
                "-0.065em",

              color:
                "rgba(184,211,61,.095)",
            }}
          >
            RUN CAIROS
          </p>
        </div>

        {/* =====================================
            3D SUBJECT
        ===================================== */}

        <div className="absolute inset-0 z-10 opacity-55 sm:opacity-75 lg:opacity-100">
          <CairosDarkCanvas>
            <CairosRunScene
              pointerRef={
                pointerRef
              }
              activeRef={
                activeRef
              }
            />
          </CairosDarkCanvas>
        </div>

        {/* =====================================
            LEFT READABILITY
        ===================================== */}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20"
          style={{
            background:
              "linear-gradient(90deg,rgba(3,7,4,.98) 0%,rgba(3,7,4,.94) 29%,rgba(3,7,4,.57) 45%,rgba(3,7,4,.07) 63%,transparent 77%)",
          }}
        />

        {/* =====================================
            TOP META
        ===================================== */}

        <div className="absolute left-[4.5vw] right-[4.5vw] top-[9vh] z-40 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-[7px] font-black tracking-[0.18em] text-[#cce849]">
              03 / LIVE CONTROL
            </span>

            <span className="h-px w-10 bg-[#cce849]/25" />

            <span className="hidden text-[7px] font-black tracking-[0.14em] text-white/22 sm:block">
              FINAL CONTROL POINT
            </span>
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-[#cce849]" />

            <span className="text-[6px] font-black tracking-[0.15em] text-[#cce849]/75">
              TWIN READY
            </span>
          </div>
        </div>

        {/* =====================================
            GIANT COPY
        ===================================== */}

        <div className="absolute left-[4.5vw] top-[20vh] z-40 max-w-[600px]">
          <motion.div
            initial={{
              opacity:
                0,

              y:
                26,
            }}
            whileInView={{
              opacity:
                1,

              y:
                0,
            }}
            viewport={{
              once:
                true,

              amount:
                0.25,
            }}
            transition={{
              duration:
                0.5,
            }}
          >
            <h2
              className="uppercase text-[#efefe5]"
              style={{
                fontFamily:
                  DISPLAY_FONT,

                fontWeight:
                  900,

                fontSize:
                  "clamp(54px,5.6vw,100px)",

                lineHeight:
                  0.82,

                letterSpacing:
                  "-0.055em",
              }}
            >
              PUT THE
              <br />

              ACTION
              <br />

              <span className="text-[#cce849]">
                THROUGH
              </span>

              <br />

              CAIROS.
            </h2>

            <p className="mt-7 max-w-[390px] text-[11px] leading-6 text-white/41">
              Give the agent a real
              task. The Twin sees the
              proposed action before
              production does.
            </p>
          </motion.div>
        </div>

        {/* =====================================
            CONTRACT FORM
        ===================================== */}

        <motion.form
          onSubmit={
            submit
          }
          initial={{
            opacity:
              0,

            y:
              40,

            rotate:
              0,
          }}
          whileInView={{
            opacity:
              1,

            y:
              0,

            rotate:
              -1.2,
          }}
          viewport={{
            once:
              true,

            amount:
              0.2,
          }}
          transition={{
            duration:
              0.55,

            delay:
              0.08,

            ease: [
              0.22,
              1,
              0.36,
              1,
            ],
          }}
          className="absolute bottom-[8vh] left-[4.5vw] z-50 w-[min(560px,91vw)] overflow-hidden rounded-[18px] bg-[#e4e2d6] shadow-[0_35px_100px_rgba(0,0,0,.5)]"
        >
          {/* PAPER TOP */}

          <div className="flex items-center justify-between gap-5 border-b border-black/12 px-6 py-4">
            <div>
              <p className="text-[6px] font-black tracking-[0.16em] text-[#11150f]/48">
                CAIROS / ACTION CONTRACT
              </p>

              <p className="mt-1 text-[6px] font-black tracking-[0.13em] text-[#759120]">
                SIMULATION REQUIRED
              </p>
            </div>

            <div className="rounded-[5px] bg-[#11150f] px-3 py-2">
              <span className="text-[6px] font-black tracking-[0.12em] text-[#cce849]">
                TWIN 01
              </span>
            </div>
          </div>

          {/* FORM BODY */}

          <div className="px-6 py-6 sm:px-8">
            <div className="flex items-center justify-between gap-6">
              <div>
                <p className="text-[6px] font-black tracking-[0.15em] text-black/30">
                  AGENT INTENT
                </p>

                <p className="mt-2 text-[21px] font-black tracking-[-0.04em] text-[#11150f]">
                  What is the play?
                </p>
              </div>

              <motion.div
                animate={{
                  scale:
                    focused
                      ? 1.08
                      : 1,
                }}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#11150f]"
              >
                <Bot
                  size={16}
                  className="text-[#cce849]"
                />
              </motion.div>
            </div>

            <textarea
              value={
                request
              }
              onFocus={
                activate
              }
              onBlur={
                deactivate
              }
              onChange={(
                event
              ) => {
                const value =
                  event.target.value;

                setRequest(
                  value
                );

                activeRef.current =
                  Boolean(
                    value.trim()
                  );
              }}
              rows={4}
              placeholder="Describe the autonomous action..."
              className="mt-7 w-full resize-none border-b border-black/16 bg-transparent pb-5 text-[15px] font-medium leading-7 text-[#11150f] outline-none placeholder:text-black/22"
            />

            {/* QUICK PLAYS */}

            <div className="mt-5">
              <p className="text-[6px] font-black tracking-[0.15em] text-black/25">
                QUICK PLAYS
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <Scenario
                  label="CLEAN PROD FILES"
                  onClick={() =>
                    selectScenario(
                      "Clean unused files from production server"
                    )
                  }
                />

                <Scenario
                  label="ROTATE CREDENTIALS"
                  onClick={() =>
                    selectScenario(
                      "Rotate production credentials for the API service"
                    )
                  }
                />

                <Scenario
                  label="DEPLOY CONFIG"
                  onClick={() =>
                    selectScenario(
                      "Deploy a configuration update to production"
                    )
                  }
                />
              </div>
            </div>

            {/* STATUS */}

            <div className="mt-6 grid grid-cols-3 border-y border-black/10">
              <PaperStatus
                label="PRODUCTION"
                value="UNTOUCHED"
              />

              <PaperStatus
                label="AUTHORITY"
                value="PENDING"
              />

              <PaperStatus
                label="TRACE"
                value="ARMED"
              />
            </div>
          </div>

          {/* ACTIONS */}

          <div className="flex flex-col gap-2 border-t border-black/11 p-3 sm:flex-row">
            <button
              type="submit"
              className="group flex min-h-[56px] flex-1 items-center justify-center gap-4 rounded-full bg-[#11150f] px-7 text-[8px] font-black tracking-[0.1em] text-white transition hover:bg-[#192419]"
            >
              <Play
                size={13}
                className="text-[#cce849]"
              />

              ENTER THE TWIN

              <ArrowRight
                size={13}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/agentdna"
                )
              }
              className="flex min-h-[56px] items-center justify-center gap-3 rounded-full border border-black/14 px-6 text-[7px] font-black tracking-[0.09em] text-black/48 transition hover:bg-black/[0.04] hover:text-black/75"
            >
              <Fingerprint
                size={13}
                className="text-[#7459d3]"
              />

              AGENTDNA
            </button>
          </div>
        </motion.form>

        {/* =====================================
            RIGHT TECH COPY
        ===================================== */}

        <div className="absolute bottom-[17vh] right-[4.5vw] z-40 hidden w-[250px] xl:block">
          <div className="border-t border-white/[0.11] pt-4">
            <div className="flex items-center gap-3">
              <ShieldCheck
                size={12}
                className="text-[#cce849]"
              />

              <span className="text-[6px] font-black tracking-[0.15em] text-[#cce849]/72">
                BEFORE EXECUTION
              </span>
            </div>

            <p className="mt-3 text-[9px] font-black leading-5 tracking-[0.05em] text-white/35">
              SIMULATE THE PLAN.
              <br />

              MEASURE THE RISK.
              <br />

              OPEN THE RIGHT GATE.
            </p>
          </div>
        </div>

        {/* =====================================
            FOOT
        ===================================== */}

        <div className="pointer-events-none absolute bottom-5 left-8 right-8 z-[60] flex items-center gap-4">
          <span className="h-px flex-1 bg-[#cce849]/17" />

          <span className="text-[6px] font-black tracking-[0.16em] text-white/18">
            CAIROS TWIN DNA / LIVE
          </span>
        </div>
      </div>
    </section>
  );
}

function Scenario({
  label,
  onClick,
}: {
  label:
    string;

  onClick:
    () => void;
}) {
  return (
    <button
      type="button"
      onClick={
        onClick
      }
      className="rounded-full border border-black/12 px-3 py-2 text-[6px] font-black tracking-[0.09em] text-black/35 transition hover:border-black/28 hover:bg-black/[0.035] hover:text-black/68"
    >
      {label}
    </button>
  );
}

function PaperStatus({
  label,
  value,
}: {
  label:
    string;

  value:
    string;
}) {
  return (
    <div className="border-r border-black/10 py-4 pr-3 last:border-r-0 last:pl-3 [&:nth-child(2)]:px-3">
      <p className="text-[5px] font-black tracking-[0.13em] text-black/24">
        {label}
      </p>

      <p className="mt-1 text-[6px] font-black tracking-[0.11em] text-[#6f8b1e]">
        {value}
      </p>
    </div>
  );
}