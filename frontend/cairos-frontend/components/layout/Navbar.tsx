"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  usePathname,
  useRouter,
} from "next/navigation";

import {
  ArrowUpRight,
  BookOpen,
  Fingerprint,
  Gauge,
  GitBranch,
  Home,
  LogIn,
  Play,
  Settings2,
  UserCheck,
  UserRound,
  Workflow,
  type LucideIcon,
} from "lucide-react";

import {
  AUTH_EVENT,
  getCurrentUser,
  type AuthUser,
} from "@/lib/auth";

const lifecycleLinks: {
  href: string;
  label: string;
  index: string;
  icon: LucideIcon;
}[] = [
  {
    href: "/twin",
    label: "TWIN",
    index: "01",
    icon: GitBranch,
  },
  {
    href: "/risk",
    label: "RISK",
    index: "02",
    icon: Gauge,
  },
  {
    href: "/approvals",
    label: "AUTHORITY",
    index: "03",
    icon: UserCheck,
  },
  {
    href: "/executions",
    label: "EXECUTION",
    index: "04",
    icon: Workflow,
  },
  {
    href: "/agentdna",
    label: "AGENTDNA",
    index: "05",
    icon: Fingerprint,
  },
];

const governanceLinks: {
  href: string;
  label: string;
  icon: LucideIcon;
}[] = [
  {
    href: "/policies",
    label: "POLICIES",
    icon: BookOpen,
  },
  {
    href: "/settings",
    label: "SETTINGS",
    icon: Settings2,
  },
];

export default function Navbar() {
  const pathname =
    usePathname();

  const router =
    useRouter();

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
    <header className="pointer-events-none w-full px-3 pt-3 sm:px-5 sm:pt-4">
      <div className="pointer-events-auto mx-auto flex min-h-[60px] w-full max-w-[1540px] items-center gap-2 overflow-x-auto rounded-full border border-white/[0.10] bg-[#030503]/95 px-2.5 shadow-[0_18px_55px_rgba(0,0,0,.48)] backdrop-blur-2xl">
        {/* =====================================
            BRAND
        ===================================== */}

        <Link
          href="/"
          className="group flex min-h-[48px] shrink-0 items-center gap-3 rounded-full px-3 transition hover:bg-white/[0.035]"
        >
          <span className="relative flex h-[31px] w-[31px] items-center justify-center rounded-full border border-[#cce849]/32 bg-[#0a110b]">
            <span className="absolute inset-[5px] rounded-full border border-white/[0.07]" />

            <span className="h-[7px] w-[7px] rounded-full bg-[#cce849] shadow-[0_0_14px_rgba(204,232,73,.48)]" />
          </span>

          <span>
            <span className="block text-[10px] font-black tracking-[0.14em] text-white/88">
              CAIROS
            </span>

            <span className="mt-0.5 hidden text-[6px] font-black tracking-[0.15em] text-white/32 2xl:block">
              TWIN DNA
            </span>
          </span>
        </Link>

        {/* =====================================
            DIVIDER
        ===================================== */}

        <span className="mx-1 hidden h-8 w-px shrink-0 bg-white/[0.08] xl:block" />

        {/* =====================================
            LIFECYCLE
        ===================================== */}

        <nav className="flex shrink-0 items-center gap-0.5">
          {lifecycleLinks.map(
            (
              item
            ) => {
              const active =
                pathname ===
                item.href;

              const Icon =
                item.icon;

              return (
                <Link
                  key={
                    item.href
                  }
                  href={
                    item.href
                  }
                  className={`group flex min-h-[42px] shrink-0 items-center gap-2.5 rounded-full px-4 transition ${
                    active
                      ? "bg-[#e5e3d7] text-[#11150f]"
                      : "text-white/48 hover:bg-white/[0.045] hover:text-white/82"
                  }`}
                >
                  <span
                    className={`text-[6px] font-black tracking-[0.1em] ${
                      active
                        ? "text-[#6f8820]"
                        : "text-[#cce849]/65"
                    }`}
                  >
                    {
                      item.index
                    }
                  </span>

                  <Icon
                    size={
                      11
                    }
                  />

                  <span className="text-[8px] font-black tracking-[0.08em]">
                    {
                      item.label
                    }
                  </span>
                </Link>
              );
            }
          )}
        </nav>

        {/* =====================================
            DIVIDER
        ===================================== */}

        <span className="mx-1 h-8 w-px shrink-0 bg-white/[0.08]" />

        {/* =====================================
            GOVERNANCE
        ===================================== */}

        <nav className="flex shrink-0 items-center gap-0.5">
          {governanceLinks.map(
            (
              item
            ) => {
              const active =
                pathname ===
                item.href;

              const Icon =
                item.icon;

              return (
                <Link
                  key={
                    item.href
                  }
                  href={
                    item.href
                  }
                  className={`flex min-h-[42px] shrink-0 items-center gap-2.5 rounded-full px-4 transition ${
                    active
                      ? "bg-[#142014] text-[#cce849]"
                      : "text-white/46 hover:bg-white/[0.04] hover:text-white/78"
                  }`}
                >
                  <Icon
                    size={
                      11
                    }
                  />

                  <span className="text-[8px] font-black tracking-[0.08em]">
                    {
                      item.label
                    }
                  </span>
                </Link>
              );
            }
          )}
        </nav>

        {/* =====================================
            FLEX SPACE
        ===================================== */}

        <div className="min-w-3 flex-1" />

        {/* =====================================
            RIGHT ACTIONS
        ===================================== */}

        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={() =>
              router.push(
                "/"
              )
            }
            className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full text-white/45 transition hover:bg-white/[0.045] hover:text-white/85"
            aria-label="Back to home"
          >
            <Home
              size={
                12
              }
            />
          </button>

          <Link
            href={
              identityHref
            }
            className={`flex min-h-[44px] shrink-0 items-center gap-2.5 rounded-full border px-4 text-[8px] font-black tracking-[0.09em] transition ${
              pathname ===
              identityHref
                ? "border-[#8062dc]/42 bg-[#8062dc]/[0.13] text-[#c1acf7]"
                : currentUser
                  ? "border-[#8062dc]/28 bg-[#8062dc]/[0.08] text-[#b39af2] hover:border-[#8062dc]/45"
                  : "border-white/[0.08] bg-white/[0.02] text-white/58 hover:border-[#cce849]/25 hover:text-[#cce849]"
            }`}
          >
            <IdentityIcon
              size={
                12
              }
            />

            <span>
              {
                identityLabel
              }
            </span>

            {currentUser && (
              <span className="hidden rounded-full bg-[#8062dc]/12 px-2 py-1 text-[5px] tracking-[0.08em] text-[#c1acf7]/70 2xl:inline">
                {
                  currentUser.role
                }
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={() =>
              router.push(
                "/twin"
              )
            }
            className="group flex min-h-[46px] shrink-0 items-center gap-3 rounded-full bg-[#cce849] px-6 text-[9px] font-black tracking-[0.09em] text-[#081008] shadow-[0_8px_26px_rgba(204,232,73,.10)] transition hover:bg-[#ddf85d]"
          >
            <Play
              size={
                12
              }
            />

            <span>
              RUN TWIN
            </span>

            <ArrowUpRight
              size={
                12
              }
              className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </button>
        </div>
      </div>
    </header>
  );
}