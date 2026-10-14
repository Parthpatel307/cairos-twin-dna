"use client";

import {
  type ReactNode,
} from "react";

import {
  usePathname,
} from "next/navigation";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";

interface RouteTransitionProps {
  children:
    ReactNode;
}

export default function RouteTransition({
  children,
}: RouteTransitionProps) {
  const pathname =
    usePathname();

  const reduceMotion =
    useReducedMotion();

  return (
    <AnimatePresence
      mode="wait"
      initial={false}
    >
      <motion.main
        key={pathname}
        initial={
          reduceMotion
            ? {
                opacity: 1,
              }
            : {
                opacity: 0,
                y: 14,
              }
        }
        animate={{
          opacity: 1,
          y: 0,
        }}
        exit={
          reduceMotion
            ? {
                opacity: 1,
              }
            : {
                opacity: 0,
                y: -7,
              }
        }
        transition={{
          duration:
            reduceMotion
              ? 0
              : 0.38,

          ease: [
            0.22,
            1,
            0.36,
            1,
          ],
        }}
        className="relative"
      >
        {!reduceMotion && (
          <motion.div
            aria-hidden="true"
            initial={{
              scaleX: 0,
              opacity: 0.7,
            }}
            animate={{
              scaleX: 1,
              opacity: 0,
            }}
            transition={{
              duration: 0.65,

              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}
            className="pointer-events-none fixed inset-x-0 top-[82px] z-[55] h-px origin-left bg-gradient-to-r from-transparent via-[#8fb52d]/60 to-transparent"
          />
        )}

        {children}
      </motion.main>
    </AnimatePresence>
  );
}