"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "framer-motion";

export default function CairosGlobalField() {
  const fieldRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const [
    enabled,
    setEnabled,
  ] =
    useState(false);

  const [
    visible,
    setVisible,
  ] =
    useState(false);

  const rawX =
    useMotionValue(
      -100
    );

  const rawY =
    useMotionValue(
      -100
    );

  const cursorX =
    useSpring(
      rawX,
      {
        stiffness: 520,
        damping: 38,
        mass: 0.26,
      }
    );

  const cursorY =
    useSpring(
      rawY,
      {
        stiffness: 520,
        damping: 38,
        mass: 0.26,
      }
    );

  useEffect(() => {
    const media =
      window.matchMedia(
        "(pointer: fine) and (hover: hover)"
      );

    const sync =
      () => {
        setEnabled(
          media.matches
        );
      };

    sync();

    media.addEventListener(
      "change",
      sync
    );

    const handleMove =
      (
        event: MouseEvent
      ) => {
        if (
          !media.matches
        ) {
          return;
        }

        rawX.set(
          event.clientX
        );

        rawY.set(
          event.clientY
        );

        setVisible(
          true
        );

        fieldRef.current?.style.setProperty(
          "--mouse-x",
          `${event.clientX}px`
        );

        fieldRef.current?.style.setProperty(
          "--mouse-y",
          `${event.clientY}px`
        );
      };

    const handleLeave =
      () => {
        setVisible(
          false
        );
      };

    window.addEventListener(
      "mousemove",
      handleMove,
      {
        passive: true,
      }
    );

    document.addEventListener(
      "mouseleave",
      handleLeave
    );

    return () => {
      media.removeEventListener(
        "change",
        sync
      );

      window.removeEventListener(
        "mousemove",
        handleMove
      );

      document.removeEventListener(
        "mouseleave",
        handleLeave
      );
    };
  }, [
    rawX,
    rawY,
  ]);

  return (
    <>
      <div
        ref={fieldRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[1] overflow-hidden"
        style={
          {
            "--mouse-x":
              "-300px",

            "--mouse-y":
              "-300px",

            background:
              "#050705",
          } as CSSProperties
        }
      >
        {/* =====================================
            DEEP FOREST WORLD
        ===================================== */}

        <div
          className="absolute inset-0"
          style={{
            background:
              [
                "radial-gradient(circle at 68% 16%, rgba(64,100,37,.18), transparent 27%)",
                "radial-gradient(circle at 81% 58%, rgba(8,63,31,.40), transparent 37%)",
                "radial-gradient(circle at 15% 78%, rgba(18,45,23,.46), transparent 38%)",
                "linear-gradient(180deg,#050705 0%,#061009 38%,#07160c 72%,#040604 100%)",
              ].join(","),
          }}
        />

        {/* =====================================
            LARGE GREEN SHADOW
        ===================================== */}

        <div
          className="absolute right-[-12vw] top-[8vh] h-[72vh] w-[72vh] rounded-full blur-[130px]"
          style={{
            background:
              "rgba(28,92,42,.12)",
          }}
        />

        {/* =====================================
            VERY FINE DOT TEXTURE
        ===================================== */}

        <div
          className="absolute inset-0 opacity-[0.13]"
          style={{
            backgroundImage:
              "radial-gradient(circle,rgba(214,235,170,.42) .55px,transparent .7px)",

            backgroundSize:
              "22px 22px",
          }}
        />

        {/* =====================================
            FINE PAPER / FILM TEXTURE
        ===================================== */}

        <div
          className="absolute inset-0 opacity-[0.055]"
          style={{
            backgroundImage:
              [
                "repeating-linear-gradient(0deg,rgba(255,255,255,.08) 0px,rgba(255,255,255,.08) 1px,transparent 1px,transparent 4px)",
                "repeating-linear-gradient(90deg,rgba(255,255,255,.035) 0px,rgba(255,255,255,.035) 1px,transparent 1px,transparent 7px)",
              ].join(","),
          }}
        />

        {/* =====================================
            CURSOR ATMOSPHERE
        ===================================== */}

        {enabled && (
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle 145px at var(--mouse-x) var(--mouse-y),rgba(194,229,70,.095) 0%,rgba(45,103,49,.055) 35%,transparent 74%)",
            }}
          />
        )}

        {/* =====================================
            EDGES
        ===================================== */}

        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at center,transparent 42%,rgba(0,0,0,.36) 100%)",
          }}
        />
      </div>

      {/* =====================================
          GLOBAL CURSOR
      ===================================== */}

      <AnimatePresence>
        {enabled &&
          visible && (
            <motion.div
              aria-hidden="true"
              initial={{
                opacity: 0,
                scale: 0.7,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                scale: 0.75,
              }}
              style={{
                x: cursorX,
                y: cursorY,

                marginLeft: -27,
                marginTop: -27,
              }}
              className="pointer-events-none fixed left-0 top-0 z-[180] hidden h-[54px] w-[54px] lg:block"
            >
              <div className="absolute inset-[-20px] rounded-full bg-[radial-gradient(circle,rgba(201,232,77,.09),transparent_70%)]" />

              <div className="absolute inset-0 rounded-full border border-[#d0ec69]/35" />

              <div className="absolute inset-[7px] rounded-full border border-white/[0.07]" />

              <div className="absolute left-1/2 top-1/2 h-px w-4 -translate-x-1/2 -translate-y-1/2 bg-white/38" />

              <div className="absolute left-1/2 top-1/2 h-4 w-px -translate-x-1/2 -translate-y-1/2 bg-white/38" />

              <div className="absolute left-1/2 top-1/2 h-[7px] w-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d3f04f]" />

              <motion.div
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 5.4,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute inset-0"
              >
                <span className="absolute left-1/2 top-[-3px] h-[7px] w-[7px] -translate-x-1/2 rounded-full bg-[#d3f04f]" />

                <span className="absolute bottom-[3px] left-[8px] h-[5px] w-[5px] rounded-full bg-[#8764e8]" />

                <span className="absolute right-[2px] top-[13px] h-[5px] w-[5px] rounded-full bg-[#c8a44b]" />
              </motion.div>
            </motion.div>
          )}
      </AnimatePresence>
    </>
  );
}