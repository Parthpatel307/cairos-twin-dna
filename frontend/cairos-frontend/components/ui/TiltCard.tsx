"use client";

import {
  type PointerEvent,
  type ReactNode,
} from "react";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";

interface TiltCardProps {
  children:
    ReactNode;

  className?:
    string;

  intensity?:
    number;
}

export default function TiltCard({
  children,
  className = "",
  intensity = 2.2,
}: TiltCardProps) {
  const reduceMotion =
    useReducedMotion();

  const pointerX =
    useMotionValue(0);

  const pointerY =
    useMotionValue(0);

  const springX =
    useSpring(
      pointerX,
      {
        stiffness: 160,
        damping: 28,
        mass: 0.55,
      }
    );

  const springY =
    useSpring(
      pointerY,
      {
        stiffness: 160,
        damping: 28,
        mass: 0.55,
      }
    );

  const rotateX =
    useTransform(
      springY,
      [
        -0.5,
        0.5,
      ],
      [
        intensity,
        -intensity,
      ]
    );

  const rotateY =
    useTransform(
      springX,
      [
        -0.5,
        0.5,
      ],
      [
        -intensity,
        intensity,
      ]
    );

  const glowX =
    useTransform(
      springX,
      [
        -0.5,
        0.5,
      ],
      [
        "25%",
        "75%",
      ]
    );

  const glowY =
    useTransform(
      springY,
      [
        -0.5,
        0.5,
      ],
      [
        "25%",
        "75%",
      ]
    );

  const handlePointerMove =
    (
      event:
        PointerEvent<HTMLDivElement>
    ) => {
      if (
        reduceMotion ||
        event.pointerType !==
          "mouse"
      ) {
        return;
      }

      const rect =
        event.currentTarget.getBoundingClientRect();

      const x =
        (
          event.clientX -
          rect.left
        ) /
          rect.width -
        0.5;

      const y =
        (
          event.clientY -
          rect.top
        ) /
          rect.height -
        0.5;

      pointerX.set(
        x
      );

      pointerY.set(
        y
      );
    };

  const handlePointerLeave =
    () => {
      pointerX.set(
        0
      );

      pointerY.set(
        0
      );
    };

  return (
    <div
      onPointerMove={
        handlePointerMove
      }
      onPointerLeave={
        handlePointerLeave
      }
      className={`relative ${className}`}
      style={{
        perspective:
          "1500px",
      }}
    >
      {/* =====================================
          DECORATIVE DEPTH ONLY

          pointer-events:none means buttons/forms
          remain completely normal DOM.
      ===================================== */}

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[30px]"
        style={{
          rotateX:
            reduceMotion
              ? 0
              : rotateX,

          rotateY:
            reduceMotion
              ? 0
              : rotateY,

          transformStyle:
            "preserve-3d",

          background: `radial-gradient(circle at ${glowX} ${glowY}, rgba(159,200,59,.08), transparent 31%), linear-gradient(145deg,rgba(245,248,242,.88),rgba(231,235,228,.82))`,

          border:
            "1px solid rgba(18,21,16,.09)",

          boxShadow:
            "0 30px 80px rgba(37,42,34,.065), inset 0 1px 0 rgba(255,255,255,.76)",
        }}
      >
        <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />

        <div className="pointer-events-none absolute bottom-10 left-0 top-10 w-px bg-gradient-to-b from-transparent via-[#9fc83b]/15 to-transparent" />

        <div className="pointer-events-none absolute inset-[1px] rounded-[29px] border border-white/20" />
      </motion.div>

      {/* =====================================
          REAL INTERACTIVE CONTENT

          NEVER transformed.
      ===================================== */}

      <div
        className="relative z-10 overflow-hidden rounded-[30px]"
        style={{
          pointerEvents:
            "auto",
        }}
      >
        {children}
      </div>
    </div>
  );
}