"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  ArrowDownRight,
  LogIn,
  Settings2,
  UserRound,
} from "lucide-react";

import {
  AUTH_EVENT,
  getCurrentUser,
  type AuthUser,
} from "@/lib/auth";

function scrollToSection(
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
  const [
    currentUser,
    setCurrentUser,
  ] =
    useState<AuthUser | null>(
      null
    );

  useEffect(() => {
    const refreshUser =
      () => {
        setCurrentUser(
          getCurrentUser()
        );
      };

    refreshUser();

    window.addEventListener(
      AUTH_EVENT,
      refreshUser
    );

    window.addEventListener(
      "storage",
      refreshUser
    );

    return () => {
      window.removeEventListener(
        AUTH_EVENT,
        refreshUser
      );

      window.removeEventListener(
        "storage",
        refreshUser
      );
    };
  }, []);

  const identityHref =
    currentUser
      ? "/profile"
      : "/login";

  const identityLabel =
    currentUser
      ? "PROFILE"
      : "LOGIN";

  const IdentityIcon =
    currentUser
      ? UserRound
      : LogIn;

  return (
    <header className="pointer-events-none fixed inset-x-0 top-3 z-[10000] px-3 sm:px-5">
      <div className="pointer-events-auto mx-auto flex min-h-[56px] w-full max-w-[1460px] items-center rounded-full border border-white/[0.12] bg-[#061008]/[0.94] px-3 shadow-[0_18px_55px_rgba(0,0,0,.45)] backdrop-blur-2xl">
        {/* BRAND */}

        <button
          type="button"
          onClick={() =>
            scrollToSection(
              "cairos-home"
            )
          }
          className="group flex min-h-[44px] shrink-0 items-center gap-3 rounded-full px-3 transition hover:bg-white/[0.04]"
        >
          <span className="relative flex h-[30px] w-[30px] items-center justify-center rounded-full border border-[#cce849]/40 bg-[#0a140b]">
            <span className="absolute inset-[5px] rounded-full border border-white/[0.10]" />

            <span className="h-[7px] w-[7px] rounded-full bg-[#cce849] shadow-[0_0_15px_rgba(204,232,73,.55)]" />
          </span>

          <span className="text-[8px] font-black tracking-[0.15em] text-[#f1f1e8]">
            CAIROS
          </span>

          <span className="hidden text-[5px] font-black tracking-[0.16em] text-white/45 xl:inline">
            TWIN DNA
          </span>
        </button>

        {/* CENTER */}

        <div className="hidden min-w-0 flex-1 justify-center lg:flex">
          <nav className="flex items-center gap-1 rounded-full border border-white/[0.06] bg-black/[0.22] p-1">
            <NavItem
              label="01"
              title="MANIFESTO"
              onClick={() =>
                scrollToSection(
                  "manifesto"
                )
              }
            />

            <NavItem
              label="02"
              title="PLAYBOOK"
              onClick={() =>
                scrollToSection(
                  "cairos-playbook"
                )
              }
            />

            <NavItem
              label="03"
              title="RUN"
              onClick={() =>
                scrollToSection(
                  "try-cairos"
                )
              }
            />
          </nav>
        </div>

        {/* RIGHT */}

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <Link
            href="/settings"
            className="group flex min-h-[42px] items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-4 text-[7px] font-black tracking-[0.11em] text-white/65 transition hover:border-[#8062dc]/35 hover:bg-[#8062dc]/[0.07] hover:text-[#b69df4]"
          >
            <Settings2
              size={
                11
              }
            />

            <span className="hidden xl:inline">
              SETTINGS
            </span>
          </Link>

          <Link
            href={
              identityHref
            }
            className={`flex min-h-[42px] items-center gap-2.5 rounded-full border px-4 text-[7px] font-black tracking-[0.11em] transition ${
              currentUser
                ? "border-[#8062dc]/40 bg-[#8062dc]/[0.11] text-[#c1acf7]"
                : "border-white/[0.10] bg-white/[0.025] text-white/72 hover:border-[#cce849]/30 hover:text-[#cce849]"
            }`}
          >
            <IdentityIcon
              size={
                11
              }
            />

            <span>
              {
                identityLabel
              }
            </span>
          </Link>

          <button
            type="button"
            onClick={() =>
              scrollToSection(
                "try-cairos"
              )
            }
            className="group flex min-h-[44px] items-center gap-3 rounded-full bg-[#cce849] px-6 text-[9px] font-black tracking-[0.11em] text-[#071007] shadow-[0_8px_24px_rgba(204,232,73,.12)] transition hover:bg-[#ddf85e]"
          >
            <span className="hidden sm:inline">
              RUN CAIROS
            </span>

            <ArrowDownRight
              size={
                12
              }
              className="transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5"
            />
          </button>
        </div>
      </div>

      {/* MOBILE NAV */}

      <div className="pointer-events-auto mx-auto mt-2 flex w-fit max-w-[calc(100vw-24px)] items-center gap-1 overflow-x-auto rounded-full border border-white/[0.10] bg-[#061008]/[0.95] p-1.5 shadow-[0_12px_35px_rgba(0,0,0,.4)] backdrop-blur-xl lg:hidden">
        <MobileNavItem
          label="01"
          title="MANIFESTO"
          onClick={() =>
            scrollToSection(
              "manifesto"
            )
          }
        />

        <MobileNavItem
          label="02"
          title="PLAYBOOK"
          onClick={() =>
            scrollToSection(
              "cairos-playbook"
            )
          }
        />

        <MobileNavItem
          label="03"
          title="RUN"
          onClick={() =>
            scrollToSection(
              "try-cairos"
            )
          }
        />
      </div>
    </header>
  );
}

function NavItem({
  label,
  title,
  onClick,
}: {
  label:
    string;

  title:
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
      className="group flex min-h-[36px] items-center gap-2.5 rounded-full px-5 transition hover:bg-white/[0.06]"
    >
      <span className="text-[5px] font-black tracking-[0.12em] text-[#cce849]/80">
        {
          label
        }
      </span>

      <span className="text-[7px] font-black tracking-[0.12em] text-[#f0f0e7]/70 transition group-hover:text-white">
        {
          title
        }
      </span>
    </button>
  );
}

function MobileNavItem({
  label,
  title,
  onClick,
}: {
  label:
    string;

  title:
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
      className="flex min-h-[34px] shrink-0 items-center gap-2 rounded-full px-4 transition hover:bg-white/[0.05]"
    >
      <span className="text-[5px] font-black tracking-[0.12em] text-[#cce849]/80">
        {
          label
        }
      </span>

      <span className="text-[6px] font-black tracking-[0.11em] text-white/70">
        {
          title
        }
      </span>
    </button>
  );
}