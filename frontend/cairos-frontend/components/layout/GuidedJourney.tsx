"use client";

import Link from "next/link";

import {
  usePathname,
} from "next/navigation";

import {
  Check,
} from "lucide-react";

import {
  motion,
} from "framer-motion";

const journey = [
  {
    step:
      "01",

    short:
      "TWIN",

    title:
      "Simulate",

    href:
      "/twin",

    accent:
      "#779d21",
  },

  {
    step:
      "02",

    short:
      "RISK",

    title:
      "Govern",

    href:
      "/risk",

    accent:
      "#779d21",
  },

  {
    step:
      "03",

    short:
      "AUTHORITY",

    title:
      "Authorize",

    href:
      "/approvals",

    accent:
      "#a9872b",
  },

  {
    step:
      "04",

    short:
      "EXECUTION",

    title:
      "Execute",

    href:
      "/executions",

    accent:
      "#779d21",
  },

  {
    step:
      "05",

    short:
      "AGENTDNA",

    title:
      "Explain",

    href:
      "/agentdna",

    accent:
      "#7659d8",
  },
] as const;

export default function GuidedJourney() {
  const pathname =
    usePathname();

  const activeIndex =
    journey.findIndex(
      (
        item
      ) =>
        pathname ===
          item.href ||
        pathname.startsWith(
          `${item.href}/`
        )
    );

  /*
    Only show journey rail inside
    the actual guided product flow.
  */
  if (
    activeIndex ===
    -1
  ) {
    return null;
  }

  const progress =
    (
      activeIndex /
      (
        journey.length -
        1
      )
    ) *
    100;

  return (
    <div className="mb-3 pt-2">
      <div className="relative overflow-hidden rounded-[22px] border border-black/[0.07] bg-[#edf1ea]/72 px-4 py-3 backdrop-blur-lg sm:px-5">
        {/* =====================================
            PROGRESS LINE
        ===================================== */}

        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-black/[0.05]">
          <motion.div
            animate={{
              width:
                `${progress}%`,
            }}
            transition={{
              duration:
                0.5,

              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}
            className="h-full bg-[#8fb52d]"
          />
        </div>

        {/* =====================================
            DESKTOP
        ===================================== */}

        <div className="hidden items-center justify-between md:flex">
          {journey.map(
            (
              item,
              index
            ) => {
              const active =
                index ===
                activeIndex;

              const complete =
                index <
                activeIndex;

              return (
                <div
                  key={
                    item.href
                  }
                  className="flex min-w-0 items-center"
                >
                  <Link
                    href={
                      item.href
                    }
                    className="group flex items-center gap-3"
                  >
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition ${
                        active
                          ? "border-transparent bg-[#171a15]"
                          : complete
                            ? "border-[#779d21]/16 bg-[#779d21]/[0.05]"
                            : "border-black/[0.08] bg-white/24"
                      }`}
                    >
                      {complete ? (
                        <Check
                          size={10}
                          className="text-[#779d21]"
                        />
                      ) : (
                        <span
                          className={`text-[7px] font-black ${
                            active
                              ? "text-white"
                              : "text-black/28"
                          }`}
                        >
                          {
                            item.step
                          }
                        </span>
                      )}
                    </div>

                    <div>
                      <p
                        className={`text-[7px] font-black tracking-[0.12em] transition ${
                          active
                            ? "text-black/65"
                            : complete
                              ? "text-black/42"
                              : "text-black/24"
                        }`}
                      >
                        {
                          item.short
                        }
                      </p>

                      <p
                        className="mt-0.5 text-[6px] font-black tracking-[0.08em]"
                        style={{
                          color:
                            active
                              ? item.accent
                              : "rgba(18,21,16,.22)",
                        }}
                      >
                        {
                          item.title
                        }
                      </p>
                    </div>
                  </Link>

                  {index <
                    journey.length -
                      1 && (
                    <div className="mx-4 h-px w-[clamp(18px,3vw,55px)] bg-black/[0.07]" />
                  )}
                </div>
              );
            }
          )}
        </div>

        {/* =====================================
            MOBILE
        ===================================== */}

        <div className="flex items-center justify-between md:hidden">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#171a15]">
              <span className="text-[7px] font-black text-white">
                {
                  journey[
                    activeIndex
                  ].step
                }
              </span>
            </div>

            <div>
              <p className="text-[7px] font-black tracking-[0.13em] text-black/34">
                GUIDED DEMO
              </p>

              <p
                className="mt-1 text-[9px] font-black tracking-[0.08em]"
                style={{
                  color:
                    journey[
                      activeIndex
                    ].accent,
                }}
              >
                {
                  journey[
                    activeIndex
                  ].short
                }{" "}
                ·{" "}
                {
                  journey[
                    activeIndex
                  ].title
                }
              </p>
            </div>
          </div>

          <span className="text-[7px] font-black tracking-[0.12em] text-black/27">
            {activeIndex +
              1}
            /
            {
              journey.length
            }
          </span>
        </div>
      </div>
    </div>
  );
}