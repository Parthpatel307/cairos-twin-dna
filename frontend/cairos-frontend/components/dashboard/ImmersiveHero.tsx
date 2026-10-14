"use client";

import {
  ArrowDown,
  ArrowRight,
  Fingerprint,
  Play,
  ShieldCheck,
} from "lucide-react";

import {
  motion,
} from "framer-motion";

import type {
  AuthUser,
} from "@/lib/auth";

import CairosCanvas from "@/components/three/CairosCanvas";

import CoreScene from "@/components/three/CoreScene";

interface ImmersiveHeroProps {
  user:
    AuthUser | null;

  onStart:
    () => void;

  onAgentDNA:
    () => void;
}

export default function ImmersiveHero({
  user,
  onStart,
  onAgentDNA,
}: ImmersiveHeroProps) {
  return (
    <section className="editorial-hero relative min-h-[760px] overflow-hidden rounded-[38px]">
      {/* =====================================
          3D SCULPTURE
      ===================================== */}

      <CairosCanvas>
        <CoreScene />
      </CairosCanvas>

      {/* =====================================
          SUBTLE GRID
      ===================================== */}

      <div
        aria-hidden="true"
        className="editorial-grid pointer-events-none absolute inset-0 opacity-[0.13]"
      />

      {/* =====================================
          READABILITY FADE

          Only left half receives opacity.
          Right sculpture remains crisp.
      ===================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(239,242,236,.99) 0%, rgba(239,242,236,.95) 31%, rgba(239,242,236,.68) 46%, rgba(239,242,236,.12) 61%, rgba(239,242,236,0) 73%)",
        }}
      />

      {/* TOP SIGNAL LINE */}

      <div className="pointer-events-none absolute left-[4%] right-[4%] top-[84px] h-px bg-gradient-to-r from-[#91b82e]/55 via-black/[0.04] to-transparent" />

      {/* =====================================
          CONTENT
      ===================================== */}

      <div className="relative z-20 grid min-h-[760px] lg:grid-cols-[0.87fr_1.13fr]">
        <div className="flex items-center px-7 py-14 sm:px-10 lg:px-14 xl:px-16">
          <div className="max-w-[690px]">
            {/* META */}

            <motion.div
              initial={{
                opacity: 0,
                y: 8,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.7,
              }}
              className="flex flex-wrap items-center gap-4"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck
                  size={12}
                  className="text-[#779d21]"
                />

                <span className="text-[9px] font-black tracking-[0.16em] text-black/48">
                  AUTONOMOUS AGENT SAFETY
                </span>
              </div>

              <span className="h-3 w-px bg-black/14" />

              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#9fc83b]" />

                <span className="text-[8px] font-black tracking-[0.14em] text-black/38">
                  SYSTEM ONLINE
                </span>
              </div>
            </motion.div>

            {/* HERO TITLE */}

            <motion.h1
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.08,
                duration: 0.8,
              }}
              className="editorial-hero-title mt-9 text-[55px] font-black leading-[0.9] tracking-[-0.074em] sm:text-[70px] lg:text-[72px] xl:text-[88px]"
            >
              SIMULATE.
              <br />

              <span className="editorial-hero-accent">
                GOVERN.
              </span>

              <br />

              EXPLAIN.
            </motion.h1>

            {/* COPY */}

            <motion.p
              initial={{
                opacity: 0,
                y: 12,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.18,
                duration: 0.7,
              }}
              className="editorial-hero-copy mt-8 max-w-[580px] text-[14px] leading-[2]"
            >
              Simulate autonomous agent
              actions before they change
              reality. Govern sensitive
              decisions through CAIROS.
              Explain failures through
              observable AgentDNA
              evidence.
            </motion.p>

            {/* BUTTONS */}

            <motion.div
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.27,
                duration: 0.65,
              }}
              className="mt-9 flex flex-wrap gap-3"
            >
              <button
                type="button"
                onClick={
                  onStart
                }
                className="editorial-primary"
              >
                <Play
                  size={13}
                />

                {user
                  ? "OPEN TWIN LAB"
                  : "START GUIDED DEMO"}

                <ArrowRight
                  size={13}
                />
              </button>

              <button
                type="button"
                onClick={
                  onAgentDNA
                }
                className="editorial-secondary"
              >
                <Fingerprint
                  size={13}
                  className="text-purple-600"
                />

                EXPLORE AGENTDNA
              </button>
            </motion.div>

            {/* FUNCTION LANGUAGE */}

            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              transition={{
                delay: 0.42,
                duration: 0.8,
              }}
              className="mt-12 grid max-w-[570px] grid-cols-2 gap-x-8 gap-y-5 border-t border-black/[0.1] pt-5 sm:grid-cols-4"
            >
              <FunctionLabel
                number="01"
                label="SIMULATE"
                value="TWIN"
                tone="lime"
              />

              <FunctionLabel
                number="02"
                label="GOVERN"
                value="CAIROS"
                tone="lime"
              />

              <FunctionLabel
                number="03"
                label="AUTHORIZE"
                value="HUMAN"
                tone="gold"
              />

              <FunctionLabel
                number="04"
                label="EXPLAIN"
                value="AGENTDNA"
                tone="purple"
              />
            </motion.div>
          </div>
        </div>

        {/* =====================================
            RIGHT VISUAL SPACE
        ===================================== */}

        <div className="relative hidden lg:block">
          <div className="absolute right-[8%] top-[16%]">
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-black/18" />

              <span className="text-[8px] font-black tracking-[0.15em] text-black/28">
                01
              </span>
            </div>

            <p className="mt-3 pl-[52px] text-[9px] font-black tracking-[0.13em] text-black/52">
              CAIROS CORE
            </p>

            <p className="mt-1 pl-[52px] text-[8px] font-black tracking-[0.08em] text-[#779d21]">
              PRE-EXECUTION SAFETY
            </p>
          </div>

          <div className="absolute bottom-[10%] right-[8%] flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#7659d8]" />

            <span className="text-[8px] font-black tracking-[0.14em] text-black/34">
              OBSERVABLE TRACE READY
            </span>
          </div>
        </div>
      </div>

      {/* SCROLL */}

      <motion.div
        animate={{
          y: [
            0,
            5,
            0,
          ],
        }}
        transition={{
          duration: 2.2,
          repeat:
            Infinity,
          ease:
            "easeInOut",
        }}
        className="absolute bottom-6 left-1/2 z-30 hidden -translate-x-1/2 items-center gap-2 lg:flex"
      >
        <ArrowDown
          size={10}
          className="text-black/27"
        />

        <span className="text-[8px] font-black tracking-[0.17em] text-black/27">
          SCROLL TO EXPLORE
        </span>
      </motion.div>
    </section>
  );
}

function FunctionLabel({
  number,
  label,
  value,
  tone,
}: {
  number: string;

  label: string;

  value: string;

  tone:
    | "lime"
    | "gold"
    | "purple";
}) {
  const accent =
    tone === "purple"
      ? "text-[#7659d8]"
      : tone === "gold"
        ? "text-[#a9872b]"
        : "text-[#779d21]";

  return (
    <div>
      <p
        className={`text-[8px] font-black tracking-[0.15em] ${accent}`}
      >
        {number}
      </p>

      <p className="mt-1.5 text-[8px] font-black tracking-[0.11em] text-black/43">
        {label}
      </p>

      <p className="mt-1 text-[7px] font-black tracking-[0.11em] text-black/28">
        {value}
      </p>
    </div>
  );
}