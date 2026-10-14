"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

export default function CinematicBackdrop() {
  const reduceMotion =
    useReducedMotion();

  const {
    scrollYProgress,
  } =
    useScroll();

  const progress =
    useSpring(
      scrollYProgress,
      {
        stiffness: 90,
        damping: 30,
        mass: 0.5,
      }
    );

  const gridY =
    useTransform(
      progress,
      [0, 1],
      [0, -120]
    );

  const limeY =
    useTransform(
      progress,
      [0, 1],
      ["0%", "24%"]
    );

  const purpleY =
    useTransform(
      progress,
      [0, 1],
      ["0%", "-15%"]
    );

  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#e4e8e1]">
        {/* ENGINEERING GRID */}

        <motion.div
          aria-hidden="true"
          style={{
            y:
              reduceMotion
                ? 0
                : gridY,
          }}
          className="editorial-grid absolute -inset-[15%] opacity-[0.36]"
        />

        {/* LIME ATMOSPHERE */}

        <motion.div
          aria-hidden="true"
          style={{
            y:
              reduceMotion
                ? 0
                : limeY,
          }}
          className="absolute -right-[16vw] -top-[18vh] h-[720px] w-[720px] rounded-full bg-[#a4ca42]/[0.08] blur-[190px]"
        />

        {/* PURPLE ATMOSPHERE */}

        <motion.div
          aria-hidden="true"
          style={{
            y:
              reduceMotion
                ? 0
                : purpleY,
          }}
          className="absolute -left-[18vw] top-[52vh] h-[650px] w-[650px] rounded-full bg-purple-500/[0.035] blur-[190px]"
        />

        {/* COOL WHITE DEPTH */}

        <div
          aria-hidden="true"
          className="absolute left-[22%] top-[4%] h-[55vh] w-[55vw] rounded-full bg-white/35 blur-[180px]"
        />

        {/* VERY SUBTLE GRAIN */}

        <div
          aria-hidden="true"
          className="editorial-noise absolute inset-0 opacity-[0.017]"
        />

        {/* VIGNETTE */}

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(54,61,50,.025)_72%,rgba(54,61,50,.055)_100%)]"
        />
      </div>

      {/* GLOBAL SCROLL SIGNAL */}

      <div className="pointer-events-none fixed inset-x-0 top-[82px] z-[89] h-px bg-black/[0.05]">
        <motion.div
          style={{
            scaleX:
              progress,
          }}
          className="h-full origin-left bg-gradient-to-r from-[#8db52d] via-[#c1a23e] to-[#7659d8]"
        />
      </div>
    </>
  );
}