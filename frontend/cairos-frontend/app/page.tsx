"use client";

import CairosGlobalField from "@/components/home/CairosGlobalField";
import CairosHomeHeader from "@/components/home/CairosHomeHeader";
import CairosHero from "@/components/home/CairosHero";
import CairosManifesto from "@/components/home/CairosManifesto";
import CairosPlaybook from "@/components/home/CairosPlaybook";
import CairosRunSection from "@/components/home/CairosRunSection";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-x-clip bg-[#050705] lg:cursor-none">
      {/* =====================================
          GLOBAL WORLD
      ===================================== */}

      <CairosGlobalField />

      {/* =====================================
          IMMERSIVE HOME NAV
      ===================================== */}

      <CairosHomeHeader />

      {/* =====================================
          CONTENT
      ===================================== */}

      <div className="relative z-10">
        {/* 00 / ENTRY */}

        <CairosHero />

        {/* 01 / PRINCIPLES */}

        <CairosManifesto />

        {/* 02 / SYSTEM PLAYBOOK */}

        <CairosPlaybook />

        {/* 03 / REAL TASK */}

        <CairosRunSection />
      </div>
    </main>
  );
}