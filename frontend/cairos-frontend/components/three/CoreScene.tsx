"use client";

import {
  useMemo,
  useRef,
} from "react";

import {
  ContactShadows,
  Float,
  RoundedBox,
} from "@react-three/drei";

import {
  useFrame,
} from "@react-three/fiber";

import {
  useReducedMotion,
} from "framer-motion";

import * as THREE from "three";

export default function CoreScene() {
  const reduceMotion =
    useReducedMotion();

  const root =
    useRef<THREE.Group | null>(
      null
    );

  const limeRail =
    useRef<THREE.Mesh | null>(
      null
    );

  const graphiteRail =
    useRef<THREE.Mesh | null>(
      null
    );

  const purpleRail =
    useRef<THREE.Mesh | null>(
      null
    );

  const core =
    useRef<THREE.Group | null>(
      null
    );

  const limeCurve =
    useMemo(
      () =>
        createCurve([
          [-2.8, 0.5, 0.2],
          [-1.7, 1.35, -0.25],
          [-0.3, 1.15, 0.3],
          [1.15, 0.5, 0],
          [2.55, -0.15, -0.25],
          [1.6, -1.25, 0.1],
          [0.1, -1.35, 0.35],
          [-1.55, -0.9, -0.05],
        ]),
      []
    );

  const graphiteCurve =
    useMemo(
      () =>
        createCurve([
          [-2.3, -0.65, -0.8],
          [-1.4, 0.45, -0.35],
          [-0.2, 1.7, 0.05],
          [1.25, 1.25, 0.4],
          [2.65, 0.2, -0.1],
          [1.55, -0.85, -0.45],
          [0.1, -1.7, 0],
          [-1.45, -1.35, 0.4],
        ]),
      []
    );

  const purpleCurve =
    useMemo(
      () =>
        createCurve([
          [-1.9, 1.2, 0.8],
          [-0.7, 0.45, 0.55],
          [0.1, -0.5, 0.7],
          [1.3, -1.2, 0.35],
          [2.2, -0.4, -0.2],
          [1.4, 0.75, -0.55],
          [0.1, 1.5, -0.3],
          [-1.1, 1.65, 0.15],
        ]),
      []
    );

  useFrame(
    (
      state,
      delta
    ) => {
      if (reduceMotion) {
        return;
      }

      const time =
        state.clock.elapsedTime;

      if (root.current) {
        root.current.position.y =
          Math.sin(
            time * 0.42
          ) * 0.035;

        root.current.rotation.y =
          Math.sin(
            time * 0.16
          ) * 0.065;

        root.current.rotation.x =
          Math.sin(
            time * 0.11
          ) * 0.015;
      }

      if (core.current) {
        core.current.rotation.y =
          Math.sin(
            time * 0.22
          ) * 0.08;
      }

      if (limeRail.current) {
        limeRail.current.rotation.z +=
          delta * 0.018;
      }

      if (graphiteRail.current) {
        graphiteRail.current.rotation.z -=
          delta * 0.012;
      }

      if (purpleRail.current) {
        purpleRail.current.rotation.y +=
          delta * 0.01;
      }
    }
  );

  return (
    <>
      <group
        ref={root}
        position={[
          2.1,
          0,
          0,
        ]}
        scale={0.92}
      >
        {/* =====================================
            GLASS CONTROL OBJECT
        ===================================== */}

        <Float
          speed={0.32}
          rotationIntensity={0.015}
          floatIntensity={0.04}
        >
          <group ref={core}>
            {/* OUTER GLASS SLAB */}

            <RoundedBox
              args={[
                1.72,
                2.32,
                0.3,
              ]}
              radius={0.27}
              smoothness={8}
            >
              <meshPhysicalMaterial
                color="#dce1da"
                metalness={0.1}
                roughness={0.12}
                transmission={0.72}
                thickness={0.7}
                ior={1.2}
                transparent
                opacity={0.72}
              />
            </RoundedBox>

            {/* GRAPHITE INTERNAL SPINE */}

            <RoundedBox
              args={[
                0.25,
                1.48,
                0.22,
              ]}
              radius={0.11}
              smoothness={6}
              position={[
                0,
                0,
                0.16,
              ]}
            >
              <meshStandardMaterial
                color="#1e241d"
                metalness={0.94}
                roughness={0.2}
              />
            </RoundedBox>

            {/* LIME SIGNAL LINE */}

            <RoundedBox
              args={[
                0.055,
                0.92,
                0.03,
              ]}
              radius={0.02}
              smoothness={4}
              position={[
                0,
                0.04,
                0.285,
              ]}
            >
              <meshStandardMaterial
                color="#9fc83b"
                emissive="#9fc83b"
                emissiveIntensity={0.55}
                metalness={0.45}
                roughness={0.16}
              />
            </RoundedBox>

            {/* SIGNAL POINT */}

            <mesh
              position={[
                0,
                0.66,
                0.31,
              ]}
            >
              <sphereGeometry
                args={[
                  0.07,
                  24,
                  24,
                ]}
              />

              <meshStandardMaterial
                color="#a6ce41"
                emissive="#a6ce41"
                emissiveIntensity={1.1}
                metalness={0.35}
                roughness={0.15}
              />
            </mesh>

            {/* SMALL LOWER NODE */}

            <mesh
              position={[
                0,
                -0.69,
                0.31,
              ]}
            >
              <sphereGeometry
                args={[
                  0.05,
                  20,
                  20,
                ]}
              />

              <meshStandardMaterial
                color="#7659d8"
                emissive="#7659d8"
                emissiveIntensity={0.65}
                metalness={0.4}
                roughness={0.2}
              />
            </mesh>
          </group>
        </Float>

        {/* =====================================
            FLOW RAIL 01 — SIMULATION
        ===================================== */}

        <mesh ref={limeRail}>
          <tubeGeometry
            args={[
              limeCurve,
              180,
              0.025,
              10,
              true,
            ]}
          />

          <meshStandardMaterial
            color="#8caf2e"
            emissive="#8caf2e"
            emissiveIntensity={0.08}
            metalness={0.76}
            roughness={0.24}
          />
        </mesh>

        {/* =====================================
            FLOW RAIL 02 — GOVERNANCE
        ===================================== */}

        <mesh ref={graphiteRail}>
          <tubeGeometry
            args={[
              graphiteCurve,
              180,
              0.017,
              10,
              true,
            ]}
          />

          <meshStandardMaterial
            color="#50584d"
            metalness={0.82}
            roughness={0.27}
            transparent
            opacity={0.5}
          />
        </mesh>

        {/* =====================================
            FLOW RAIL 03 — AGENTDNA
        ===================================== */}

        <mesh ref={purpleRail}>
          <tubeGeometry
            args={[
              purpleCurve,
              180,
              0.012,
              9,
              true,
            ]}
          />

          <meshStandardMaterial
            color="#7659d8"
            emissive="#7659d8"
            emissiveIntensity={0.06}
            metalness={0.6}
            roughness={0.28}
            transparent
            opacity={0.38}
          />
        </mesh>

        {/* =====================================
            FUNCTION NODES
        ===================================== */}

        <FunctionNode
          position={[
            -2.3,
            0.73,
            0.23,
          ]}
          color="#859374"
          scale={0.075}
        />

        <FunctionNode
          position={[
            2.28,
            0.08,
            -0.12,
          ]}
          color="#9fc83b"
          scale={0.095}
          active
        />

        <FunctionNode
          position={[
            -1.42,
            -1.18,
            0.12,
          ]}
          color="#c5a349"
          scale={0.075}
        />

        <FunctionNode
          position={[
            1.58,
            -1.22,
            0.2,
          ]}
          color="#7659d8"
          scale={0.078}
        />

        {/* =====================================
            GROUND DISC
        ===================================== */}

        <mesh
          position={[
            0,
            -2.12,
            0,
          ]}
          rotation={[
            -Math.PI / 2,
            0,
            0,
          ]}
        >
          <circleGeometry
            args={[
              2.1,
              64,
            ]}
          />

          <meshBasicMaterial
            color="#4d5649"
            transparent
            opacity={0.018}
            side={
              THREE.DoubleSide
            }
          />
        </mesh>
      </group>

      <ContactShadows
        position={[
          2.1,
          -2.22,
          0,
        ]}
        opacity={0.12}
        scale={6}
        blur={3}
        far={4}
        color="#353b32"
      />
    </>
  );
}

/* ======================================================
   CLOSED SCULPTURAL CURVE
====================================================== */

function createCurve(
  points: number[][]
) {
  return new THREE.CatmullRomCurve3(
    points.map(
      (
        point
      ) =>
        new THREE.Vector3(
          point[0],
          point[1],
          point[2]
        )
    ),
    true,
    "catmullrom",
    0.55
  );
}

/* ======================================================
   FUNCTION NODE
====================================================== */

function FunctionNode({
  position,
  color,
  scale,
  active = false,
}: {
  position: [
    number,
    number,
    number,
  ];

  color: string;

  scale: number;

  active?: boolean;
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
            scale,
            24,
            24,
          ]}
        />

        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={
            active
              ? 0.85
              : 0.25
          }
          metalness={0.5}
          roughness={0.18}
        />
      </mesh>

      {active && (
        <mesh
          scale={2.4}
        >
          <sphereGeometry
            args={[
              scale,
              18,
              18,
            ]}
          />

          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.025}
          />
        </mesh>
      )}
    </group>
  );
}