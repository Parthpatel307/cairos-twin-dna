"use client";

import {
  ArrowDownRight,
} from "lucide-react";

function scrollTo(
  id: string
) {
  document
    .getElementById(
      id
    )
    ?.scrollIntoView({
      behavior:
        "smooth",

      block:
        "start",
    });
}

export default function CairosHomeHeader() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-4 z-[120] px-4 sm:px-6">
      <div className="mx-auto flex w-full max-w-[1450px] items-center justify-between gap-4">
        {/* LEFT */}

        <button
          type="button"
          onClick={() =>
            scrollTo(
              "cairos-home"
            )
          }
          className="pointer-events-auto flex min-h-[42px] items-center gap-3 rounded-full border border-white/[0.13] bg-black/45 px-4 backdrop-blur-xl transition hover:border-[#cce84d]/35"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[#cae84b]/30 bg-[#0d150e]">
            <span className="h-2 w-2 rounded-full bg-[#cdea4b]" />
          </span>

          <span className="text-[8px] font-black tracking-[0.13em] text-[#ececdf]/80">
            CAIROS
          </span>

          <span className="hidden text-[6px] font-black tracking-[0.15em] text-[#ececdf]/28 sm:inline">
            TWIN DNA
          </span>
        </button>

        {/* CENTER */}

        <nav className="pointer-events-auto hidden items-center rounded-full border border-white/[0.1] bg-black/42 p-1.5 backdrop-blur-xl md:flex">
          <button
            type="button"
            onClick={() =>
              scrollTo(
                "manifesto"
              )
            }
            className="rounded-full px-5 py-2 text-[7px] font-black tracking-[0.13em] text-[#ececdf]/42 transition hover:text-[#d0ec58]"
          >
            01 MANIFESTO
          </button>

          <button
            type="button"
            onClick={() =>
              scrollTo(
                "cairos-playbook"
              )
            }
            className="rounded-full px-5 py-2 text-[7px] font-black tracking-[0.13em] text-[#ececdf]/42 transition hover:text-[#d0ec58]"
          >
            02 PLAYBOOK
          </button>

          <button
            type="button"
            onClick={() =>
              scrollTo(
                "try-cairos"
              )
            }
            className="rounded-full px-5 py-2 text-[7px] font-black tracking-[0.13em] text-[#ececdf]/42 transition hover:text-[#d0ec58]"
          >
            03 RUN
          </button>
        </nav>

        {/* RIGHT */}

        <button
          type="button"
          onClick={() =>
            scrollTo(
              "try-cairos"
            )
          }
          className="pointer-events-auto flex min-h-[42px] items-center gap-3 rounded-full bg-[#d2ef4d] px-5 text-[8px] font-black tracking-[0.11em] text-[#091009] transition hover:scale-[1.025] hover:bg-[#def95e]"
        >
          RUN CAIROS

          <ArrowDownRight
            size={12}
          />
        </button>
      </div>
    </header>
  );
}