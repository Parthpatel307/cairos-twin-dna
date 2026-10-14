"use client";

import {
  type ReactNode,
} from "react";

import {
  usePathname,
} from "next/navigation";

import Navbar from "@/components/layout/Navbar";
import FirstRunGuide from "@/components/layout/FirstRunGuide";
import RouteTransition from "@/components/layout/RouteTransition";

interface AppShellProps {
  children:
    ReactNode;
}

export default function AppShell({
  children,
}: AppShellProps) {
  const pathname =
    usePathname();

  const isHome =
    pathname === "/";

  const isAuth =
    pathname ===
      "/login" ||
    pathname ===
      "/signup" ||
    pathname.startsWith(
      "/auth/"
    );

  /* =====================================
     HOME

     Full immersive world.
     Home keeps its own CairosHomeHeader.
  ===================================== */

  if (
    isHome
  ) {
    return (
      <div className="relative min-h-screen overflow-x-clip bg-[#050705]">
        <RouteTransition>
          {
            children
          }
        </RouteTransition>
      </div>
    );
  }

  /* =====================================
     AUTH

     Login, signup and OAuth callback/sync
     stay isolated from lifecycle chrome.
  ===================================== */

  if (
    isAuth
  ) {
    return (
      <div className="relative min-h-screen overflow-x-clip bg-[#050705]">
        <ShellAtmosphere />

        <div className="relative z-10">
          <RouteTransition>
            {
              children
            }
          </RouteTransition>
        </div>
      </div>
    );
  }

  /* =====================================
     PRODUCT ROUTES
  ===================================== */

  return (
    <div className="relative min-h-screen overflow-x-clip bg-[#050705]">
      <ShellAtmosphere />

      {/* NAVBAR */}

      <div className="fixed inset-x-0 top-0 z-[100]">
        <Navbar />
      </div>

      {/* CONTENT */}

      <div className="relative z-10 pt-[96px] sm:pt-[88px] lg:pt-[84px]">
        <RouteTransition>
          {
            children
          }
        </RouteTransition>
      </div>

      <FirstRunGuide />
    </div>
  );
}

/* ======================================================
   GLOBAL PRODUCT ATMOSPHERE
====================================================== */

function ShellAtmosphere() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* BASE */}

      <div className="absolute inset-0 bg-[#050705]" />

      {/* FOREST DEPTH */}

      <div
        className="absolute inset-0"
        style={{
          background:
            [
              "radial-gradient(circle at 77% 18%,rgba(78,105,36,.07),transparent 27%)",
              "radial-gradient(circle at 20% 84%,rgba(32,62,34,.08),transparent 31%)",
              "linear-gradient(135deg,#050705 0%,#061009 55%,#050705 100%)",
            ].join(
              ","
            ),
        }}
      />

      {/* TECHNICAL HORIZON */}

      <div
        className="absolute inset-0 opacity-[0.055]"
        style={{
          backgroundImage:
            [
              "linear-gradient(rgba(215,225,198,.16) 1px,transparent 1px)",
              "linear-gradient(90deg,rgba(215,225,198,.16) 1px,transparent 1px)",
            ].join(
              ","
            ),

          backgroundSize:
            "120px 120px",
        }}
      />

      {/* VERTICAL ARCHITECTURE */}

      <div className="absolute left-[12%] top-0 h-full w-px bg-gradient-to-b from-transparent via-white/[0.025] to-transparent" />

      <div className="absolute right-[18%] top-0 h-full w-px bg-gradient-to-b from-transparent via-[#cce849]/[0.035] to-transparent" />

      {/* TOP SHADOW FOR NAV */}

      <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-black/55 to-transparent" />

      {/* FILM TEXTURE */}

      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "radial-gradient(circle,rgba(255,255,255,.7) .55px,transparent .8px)",

          backgroundSize:
            "7px 7px",
        }}
      />

      {/* VIGNETTE */}

      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at center,transparent 35%,rgba(0,0,0,.34) 100%)",
        }}
      />
    </div>
  );
}