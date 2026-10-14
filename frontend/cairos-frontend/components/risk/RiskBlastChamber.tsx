"use client";

import {
  useMemo,
  useRef,
} from "react";

import {
  Activity,
  Database,
  GitBranch,
  Network,
  Radar,
  Server,
  ShieldAlert,
  ShieldCheck,
  Zap,
} from "lucide-react";

import {
  Line,
  Sparkles as ThreeSparkles,
} from "@react-three/drei";

import {
  useFrame,
} from "@react-three/fiber";

import {
  motion,
} from "framer-motion";

import * as THREE from "three";

import CairosCanvas from "@/components/three/CairosCanvas";

import type {
  Decision,
  RiskLevel,
} from "@/types";

interface RiskBlastChamberProps {
  score: number;
  level: RiskLevel;
  decision: Decision;
  systems: string[];
}

export default function RiskBlastChamber({
  score,
  level,
  decision,
  systems,
}: RiskBlastChamberProps) {
  const normalizedSystems = [
    systems[0] ??
      "API Gateway",

    systems[1] ??
      "Production Database",

    systems[2] ??
      "Deployment Pipeline",
  ];

  const tone =
    decision === "BLOCK"
      ? "red"
      : decision === "ASK"
        ? "yellow"
        : "lime";

  return (
    <div className="relative min-h-[610px] overflow-hidden rounded-[28px]">
      {/* =====================================
          REAL 3D WORLD
      ===================================== */}

      <CairosCanvas>
        <RiskBlastScene
          score={score}
          decision={decision}
        />
      </CairosCanvas>

      {/* =====================================
          ATMOSPHERE
      ===================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(3,4,3,.08)_38%,rgba(2,3,2,.72)_100%)]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.17] [background-image:linear-gradient(rgba(255,255,255,.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.025)_1px,transparent_1px)] [background-size:48px_48px]"
      />

      {/* =====================================
          HEADER
      ===================================== */}

      <div className="relative z-20 flex flex-col gap-4 p-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Network
              size={13}
              className="text-yellow-200"
            />

            <p className="section-label">
              Blast Radius
            </p>
          </div>

          <h2 className="mt-2 text-2xl font-black tracking-[-0.045em] text-white/95">
            Downstream exposure
          </h2>

          <p className="mt-2 max-w-lg text-[11px] leading-6 text-white/52">
            The simulated mutation is
            propagated through connected
            production dependencies
            before execution is allowed.
          </p>
        </div>

        <div
          className={`flex items-center gap-2 rounded-full border px-3 py-2 ${
            tone === "red"
              ? "border-red-400/15 bg-red-400/[0.04]"
              : tone === "yellow"
                ? "border-yellow-300/15 bg-yellow-300/[0.04]"
                : "border-lime-300/15 bg-lime-300/[0.04]"
          }`}
        >
          <Radar
            size={11}
            className={
              tone === "red"
                ? "text-red-300"
                : tone === "yellow"
                  ? "text-yellow-200"
                  : "text-lime-300"
            }
          />

          <span
            className={`text-[9px] font-black tracking-[0.11em] ${
              tone === "red"
                ? "text-red-300"
                : tone === "yellow"
                  ? "text-yellow-200"
                  : "text-lime-300"
            }`}
          >
            PROPAGATION ACTIVE
          </span>
        </div>
      </div>

      {/* =====================================
          DESKTOP SYSTEM LABELS
      ===================================== */}

      <div className="pointer-events-none absolute inset-x-0 top-[125px] z-20 hidden h-[380px] md:block">
        <SystemLabel
          className="absolute left-[4%] top-[14%]"
          icon={Server}
          title="API GATEWAY"
          subtitle={
            normalizedSystems[0]
          }
        />

        <SystemLabel
          className="absolute right-[4%] top-[14%]"
          icon={Database}
          title="DATABASE"
          subtitle={
            normalizedSystems[1]
          }
        />

        <SystemLabel
          className="absolute bottom-[2%] left-1/2 -translate-x-1/2"
          icon={GitBranch}
          title="DEPLOYMENT"
          subtitle={
            normalizedSystems[2]
          }
        />
      </div>

      {/* =====================================
          CENTER HUD
      ===================================== */}

      <div className="pointer-events-none absolute left-1/2 top-[52%] z-20 -translate-x-1/2 -translate-y-1/2 text-center">
        <motion.div
          animate={{
            scale: [
              1,
              1.035,
              1,
            ],
          }}
          transition={{
            duration: 2,
            repeat:
              Infinity,
          }}
        >
          <p
            className={`text-[10px] font-black tracking-[0.16em] ${
              tone === "red"
                ? "text-red-300"
                : tone === "yellow"
                  ? "text-yellow-200"
                  : "text-lime-300"
            }`}
          >
            MUTATION CORE
          </p>

          <p className="mt-2 text-[9px] text-white/44">
            Delete config.json
          </p>
        </motion.div>
      </div>

      {/* =====================================
          MOBILE SYSTEMS
      ===================================== */}

      <div className="relative z-20 mx-5 mt-[350px] grid gap-2 md:hidden">
        <SystemLabel
          icon={Server}
          title="API GATEWAY"
          subtitle={
            normalizedSystems[0]
          }
        />

        <SystemLabel
          icon={Database}
          title="DATABASE"
          subtitle={
            normalizedSystems[1]
          }
        />

        <SystemLabel
          icon={GitBranch}
          title="DEPLOYMENT"
          subtitle={
            normalizedSystems[2]
          }
        />
      </div>

      {/* =====================================
          TELEMETRY
      ===================================== */}

      <div className="relative z-20 grid gap-2 px-5 pb-5 pt-5 sm:grid-cols-2 xl:grid-cols-4">
        <Telemetry
          icon={ShieldAlert}
          label="RISK"
          value={`${score}/100`}
          state={level}
          tone={
            level === "CRITICAL"
              ? "red"
              : level === "HIGH"
                ? "yellow"
                : "lime"
          }
        />

        <Telemetry
          icon={Network}
          label="EXPOSURE"
          value={`${normalizedSystems.length}`}
          state="SYSTEMS"
          tone="yellow"
        />

        <Telemetry
          icon={Radar}
          label="DECISION"
          value={decision}
          state="CAIROS"
          tone={tone}
        />

        <Telemetry
          icon={ShieldCheck}
          label="ANALYSIS"
          value="COMPLETE"
          state="TWIN"
          tone="lime"
        />
      </div>
    </div>
  );
}

/* ======================================================
   THREE.JS SCENE
====================================================== */

function RiskBlastScene({
  score,
  decision,
}: {
  score: number;
  decision: Decision;
}) {
  const root =
    useRef<THREE.Group | null>(
      null
    );

  const core =
    useRef<THREE.Mesh | null>(
      null
    );

  const ringOne =
    useRef<THREE.Mesh | null>(
      null
    );

  const ringTwo =
    useRef<THREE.Mesh | null>(
      null
    );

  const packetA =
    useRef<THREE.Mesh | null>(
      null
    );

  const packetB =
    useRef<THREE.Mesh | null>(
      null
    );

  const packetC =
    useRef<THREE.Mesh | null>(
      null
    );

  const normalized =
    Math.max(
      0,
      Math.min(
        1,
        score / 100
      )
    );

  const accent =
    decision === "BLOCK"
      ? "#ff7f7f"
      : decision === "ASK"
        ? "#ffe56b"
        : "#d6ff4f";

  const leftCurve =
    useMemo(
      () =>
        new THREE.CatmullRomCurve3([
          new THREE.Vector3(
            0,
            0,
            0
          ),

          new THREE.Vector3(
            -0.8,
            0.45,
            0
          ),

          new THREE.Vector3(
            -1.8,
            1,
            0.1
          ),

          new THREE.Vector3(
            -3,
            1.2,
            0.1
          ),
        ]),
      []
    );

  const rightCurve =
    useMemo(
      () =>
        new THREE.CatmullRomCurve3([
          new THREE.Vector3(
            0,
            0,
            0
          ),

          new THREE.Vector3(
            0.8,
            0.45,
            0
          ),

          new THREE.Vector3(
            1.8,
            1,
            -0.1
          ),

          new THREE.Vector3(
            3,
            1.2,
            -0.1
          ),
        ]),
      []
    );

  const bottomCurve =
    useMemo(
      () =>
        new THREE.CatmullRomCurve3([
          new THREE.Vector3(
            0,
            0,
            0
          ),

          new THREE.Vector3(
            0,
            -0.7,
            0.15
          ),

          new THREE.Vector3(
            0,
            -1.5,
            0.2
          ),

          new THREE.Vector3(
            0,
            -2.2,
            0.15
          ),
        ]),
      []
    );

  useFrame(
    (
      state,
      delta
    ) => {
      const time =
        state.clock
          .elapsedTime;

      if (root.current) {
        root.current.rotation.y =
          Math.sin(
            time * 0.18
          ) * 0.06;
      }

      if (core.current) {
        const pulse =
          1 +
          Math.sin(
            time *
              2.4
          ) *
            (
              0.018 +
              normalized *
                0.025
            );

        core.current.scale.setScalar(
          pulse
        );

        core.current.rotation.y +=
          delta *
          (
            0.15 +
            normalized *
              0.25
          );
      }

      if (ringOne.current) {
        ringOne.current.rotation.z +=
          delta *
          (
            0.12 +
            normalized *
              0.35
          );
      }

      if (ringTwo.current) {
        ringTwo.current.rotation.z -=
          delta *
          (
            0.09 +
            normalized *
              0.25
          );
      }

      const speed =
        0.16 +
        normalized *
          0.12;

      if (packetA.current) {
        const point =
          leftCurve.getPoint(
            (
              time *
              speed
            ) %
              1
          );

        packetA.current.position.copy(
          point
        );
      }

      if (packetB.current) {
        const point =
          rightCurve.getPoint(
            (
              time *
                speed +
              0.33
            ) %
              1
          );

        packetB.current.position.copy(
          point
        );
      }

      if (packetC.current) {
        const point =
          bottomCurve.getPoint(
            (
              time *
                speed +
              0.66
            ) %
              1
          );

        packetC.current.position.copy(
          point
        );
      }
    }
  );

  return (
    <group
      ref={root}
      position={[
        0,
        0,
        0,
      ]}
    >
      <pointLight
        position={[
          0,
          0,
          2,
        ]}
        intensity={
          15 +
          normalized *
            20
        }
        distance={7}
        color={accent}
      />

      <ThreeSparkles
        count={
          50 +
          Math.round(
            normalized *
              40
          )
        }
        scale={[
          8,
          5,
          4,
        ]}
        size={1.1}
        speed={
          0.18 +
          normalized *
            0.25
        }
        opacity={0.22}
        color={accent}
      />

      {/* FLOOR */}

      <mesh
        position={[
          0,
          -2.35,
          0,
        ]}
        rotation={[
          -Math.PI /
            2,
          0,
          0,
        ]}
      >
        <circleGeometry
          args={[
            3.7,
            96,
          ]}
        />

        <meshBasicMaterial
          color={accent}
          transparent
          opacity={0.012}
          side={
            THREE.DoubleSide
          }
        />
      </mesh>

      {/* BLAST ORBITS */}

      <mesh
        ref={ringOne}
        rotation={[
          1.18,
          0,
          0,
        ]}
      >
        <torusGeometry
          args={[
            2.05,
            0.012,
            10,
            220,
          ]}
        />

        <meshBasicMaterial
          color={accent}
          transparent
          opacity={
            0.17 +
            normalized *
              0.15
          }
        />
      </mesh>

      <mesh
        ref={ringTwo}
        rotation={[
          1.28,
          0.35,
          0.2,
        ]}
      >
        <torusGeometry
          args={[
            2.65,
            0.009,
            10,
            220,
          ]}
        />

        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.07}
        />
      </mesh>

      {/* CORE */}

      <mesh
        ref={core}
      >
        <octahedronGeometry
          args={[
            0.72,
            3,
          ]}
        />

        <meshStandardMaterial
          color="#12130b"
          emissive={accent}
          emissiveIntensity={
            0.55 +
            normalized *
              0.75
          }
          metalness={0.92}
          roughness={0.2}
        />
      </mesh>

      <mesh
        scale={1.05}
      >
        <octahedronGeometry
          args={[
            0.72,
            1,
          ]}
        />

        <meshBasicMaterial
          color={accent}
          wireframe
          transparent
          opacity={
            0.18 +
            normalized *
              0.18
          }
        />
      </mesh>

      {/* BLAST WAVES */}

      <PulseRing
        color={accent}
        delay={0}
      />

      <PulseRing
        color={accent}
        delay={0.33}
      />

      <PulseRing
        color={accent}
        delay={0.66}
      />

      {/* CONNECTIONS */}

      <Line
        points={[
          [
            0,
            0,
            0,
          ],
          [
            -1.5,
            0.7,
            0,
          ],
          [
            -3,
            1.2,
            0.1,
          ],
        ]}
        color={accent}
        transparent
        opacity={0.35}
        lineWidth={1}
        dashed
      />

      <Line
        points={[
          [
            0,
            0,
            0,
          ],
          [
            1.5,
            0.7,
            0,
          ],
          [
            3,
            1.2,
            -0.1,
          ],
        ]}
        color={accent}
        transparent
        opacity={0.35}
        lineWidth={1}
        dashed
      />

      <Line
        points={[
          [
            0,
            0,
            0,
          ],
          [
            0,
            -1.1,
            0.1,
          ],
          [
            0,
            -2.2,
            0.15,
          ],
        ]}
        color={accent}
        transparent
        opacity={0.35}
        lineWidth={1}
        dashed
      />

      {/* SYSTEM NODES */}

      <SystemNode3D
        position={[
          -3,
          1.2,
          0.1,
        ]}
        color="#ff8b8b"
      />

      <SystemNode3D
        position={[
          3,
          1.2,
          -0.1,
        ]}
        color="#ff8b8b"
      />

      <SystemNode3D
        position={[
          0,
          -2.2,
          0.15,
        ]}
        color="#ff8b8b"
      />

      {/* DATA PACKETS */}

      <DataPacket
        reference={
          packetA
        }
        color={accent}
      />

      <DataPacket
        reference={
          packetB
        }
        color={accent}
      />

      <DataPacket
        reference={
          packetC
        }
        color={accent}
      />
    </group>
  );
}

function PulseRing({
  color,
  delay,
}: {
  color: string;
  delay: number;
}) {
  const ref =
    useRef<THREE.Mesh | null>(
      null
    );

  useFrame(
    (
      state
    ) => {
      if (!ref.current) {
        return;
      }

      const raw =
        (
          state.clock
            .elapsedTime *
            0.32 +
          delay
        ) %
        1;

      const scale =
        0.7 +
        raw *
          2.7;

      ref.current.scale.set(
        scale,
        scale,
        scale
      );

      const material =
        ref.current
          .material as THREE.MeshBasicMaterial;

      material.opacity =
        (
          1 -
          raw
        ) *
        0.14;
    }
  );

  return (
    <mesh
      ref={ref}
      rotation={[
        Math.PI /
          2,
        0,
        0,
      ]}
    >
      <torusGeometry
        args={[
          0.95,
          0.012,
          8,
          160,
        ]}
      />

      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.12}
      />
    </mesh>
  );
}

function SystemNode3D({
  position,
  color,
}: {
  position: [
    number,
    number,
    number,
  ];

  color: string;
}) {
  return (
    <group
      position={
        position
      }
    >
      <mesh>
        <sphereGeometry
          args={[
            0.14,
            24,
            24,
          ]}
        />

        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={2.4}
          metalness={0.45}
          roughness={0.2}
        />
      </mesh>

      <mesh
        scale={2.5}
      >
        <sphereGeometry
          args={[
            0.14,
            20,
            20,
          ]}
        />

        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.045}
        />
      </mesh>
    </group>
  );
}

function DataPacket({
  reference,
  color,
}: {
  reference:
    React.RefObject<THREE.Mesh | null>;

  color: string;
}) {
  return (
    <mesh
      ref={reference}
    >
      <sphereGeometry
        args={[
          0.07,
          20,
          20,
        ]}
      />

      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={3}
      />
    </mesh>
  );
}

/* ======================================================
   HTML OVERLAYS
====================================================== */

function SystemLabel({
  className = "",
  icon: Icon,
  title,
  subtitle,
}: {
  className?: string;

  icon:
    typeof Server;

  title: string;

  subtitle: string;
}) {
  return (
    <div
      className={`min-w-[180px] rounded-[18px] border border-red-400/12 bg-red-400/[0.025] p-3 shadow-[0_18px_50px_rgba(0,0,0,.35)] backdrop-blur-xl ${className}`}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-red-400/15 bg-red-400/[0.04]">
          <Icon
            size={14}
            className="text-red-300"
          />
        </div>

        <div>
          <p className="text-[9px] font-black tracking-[0.1em] text-red-300">
            EXPOSED
          </p>

          <p className="mt-1 text-[10px] font-black text-white/68">
            {title}
          </p>

          <p className="mt-1 text-[8px] text-white/42">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}

function Telemetry({
  icon: Icon,
  label,
  value,
  state,
  tone,
}: {
  icon:
    typeof Activity;

  label: string;

  value: string;

  state: string;

  tone:
    | "lime"
    | "yellow"
    | "red";
}) {
  const color =
    tone === "red"
      ? "text-red-300"
      : tone === "yellow"
        ? "text-yellow-200"
        : "text-lime-300";

  const dot =
    tone === "red"
      ? "bg-red-300"
      : tone === "yellow"
        ? "bg-yellow-200"
        : "bg-lime-300";

  return (
    <div className="rounded-[17px] border border-white/[0.065] bg-black/25 p-4 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon
            size={12}
            className={color}
          />

          <p className="text-[8px] font-black tracking-[0.11em] text-white/44">
            {label}
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <span
            className={`h-1.5 w-1.5 rounded-full ${dot}`}
          />

          <span className="text-[7px] font-black tracking-[0.1em] text-white/35">
            {state}
          </span>
        </div>
      </div>

      <p
        className={`mt-3 text-[15px] font-black ${color}`}
      >
        {value}
      </p>
    </div>
  );
}
