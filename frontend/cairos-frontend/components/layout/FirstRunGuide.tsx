"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  usePathname,
  useRouter,
} from "next/navigation";

import {
  ArrowRight,
  Check,
  Fingerprint,
  FlaskConical,
  Play,
  ShieldCheck,
  UserCheck,
  X,
} from "lucide-react";

import type {
  LucideIcon,
} from "lucide-react";

import {
  AUTH_EVENT,
  getCurrentUser,
} from "@/lib/auth";

const STORAGE_KEY =
  "cairos_onboarding_seen_v1";

const DEFAULT_REQUEST =
  "Clean unused files from production server";

export default function FirstRunGuide() {
  const pathname =
    usePathname();

  const router =
    useRouter();

  const [
    visible,
    setVisible,
  ] =
    useState(false);

  useEffect(() => {
    const evaluate =
      () => {
        if (
          pathname !== "/"
        ) {
          setVisible(false);
          return;
        }

        const user =
          getCurrentUser();

        if (user) {
          setVisible(false);
          return;
        }

        const seen =
          localStorage.getItem(
            STORAGE_KEY
          );

        if (seen) {
          setVisible(false);
          return;
        }

        setVisible(true);
      };

    const timer =
      window.setTimeout(
        evaluate,
        450
      );

    window.addEventListener(
      AUTH_EVENT,
      evaluate
    );

    window.addEventListener(
      "storage",
      evaluate
    );

    return () => {
      window.clearTimeout(
        timer
      );

      window.removeEventListener(
        AUTH_EVENT,
        evaluate
      );

      window.removeEventListener(
        "storage",
        evaluate
      );
    };
  }, [
    pathname,
  ]);

  const close =
    () => {
      localStorage.setItem(
        STORAGE_KEY,
        "true"
      );

      setVisible(false);
  };

  const start =
    () => {
      localStorage.setItem(
        STORAGE_KEY,
        "true"
      );

      localStorage.setItem(
        "cairos_quick_request",
        DEFAULT_REQUEST
      );

      setVisible(false);

      router.push(
        "/twin"
      );
    };

  if (
    !visible ||
    pathname !== "/"
  ) {
    return null;
  }

  return (
    <div className="fixed bottom-5 right-5 z-[80] w-[calc(100%-40px)] max-w-[440px]">
      <div className="relative overflow-hidden rounded-[26px] border border-white/[0.1] bg-[#090c09]/95 p-5 shadow-[0_30px_100px_rgba(0,0,0,.65)] backdrop-blur-3xl">
        {/* DECORATION */}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-lime-300/[0.07] blur-[80px]"
        />

        {/* CLOSE */}

        <button
          type="button"
          onClick={
            close
          }
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-xl border border-white/[0.07] bg-black/20 text-white/45 transition hover:bg-white/[0.04] hover:text-white"
          aria-label="Close guide"
        >
          <X
            size={14}
          />
        </button>

        <div className="relative z-10">
          {/* HEADER */}

          <div className="hero-kicker">
            <ShieldCheck
              size={11}
            />

            NEW TO CAIROS?
          </div>

          <h2 className="mt-5 text-2xl font-black tracking-[-0.045em] text-white/90">
            One agent action.
            <br />
            Five safety stages.
          </h2>

          <p className="mt-3 text-[12px] leading-6 text-white/52">
            Give an AI agent a task.
            CAIROS simulates it,
            evaluates risk, requests
            human authority when
            needed, executes it under
            observation and explains
            failures.
          </p>

          {/* FLOW */}

          <div className="mt-5 grid grid-cols-5 gap-1.5">
            <MiniStep
              icon={
                FlaskConical
              }
              value="1"
              label="Twin"
            />

            <MiniStep
              icon={
                ShieldCheck
              }
              value="2"
              label="Risk"
            />

            <MiniStep
              icon={
                UserCheck
              }
              value="3"
              label="Approve"
            />

            <MiniStep
              icon={
                Play
              }
              value="4"
              label="Run"
            />

            <MiniStep
              icon={
                Fingerprint
              }
              value="5"
              label="Explain"
            />
          </div>

          {/* ACTIONS */}

          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={
                start
              }
              className="lime-btn flex-1"
            >
              <Play
                size={13}
              />

              START GUIDED DEMO

              <ArrowRight
                size={13}
              />
            </button>

            <button
              type="button"
              onClick={
                close
              }
              className="ghost-btn"
            >
              <Check
                size={13}
              />

              EXPLORE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniStep({
  icon: Icon,
  value,
  label,
}: {
  icon: LucideIcon;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-black/15 px-2 py-2.5 text-center">
      <Icon
        size={12}
        className="mx-auto text-lime-300/75"
      />

      <p className="mt-1.5 text-[8px] font-black text-white/30">
        {value}
      </p>

      <p className="mt-0.5 truncate text-[8px] font-black uppercase tracking-[0.05em] text-white/48">
        {label}
      </p>
    </div>
  );
}