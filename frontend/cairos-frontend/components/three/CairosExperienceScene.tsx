"use client";

import {
  useMemo,
  useRef,
} from "react";

import {
  Line,
} from "@react-three/drei";

import {
  useFrame,
  useThree,
} from "@react-three/fiber";

import {
  useReducedMotion,
} from "framer-motion";

import * as THREE from "three";

interface CairosExperienceSceneProps {
  progressRef: {
    current: number;
  };

  pointerRef: {
    current: {
      x: number;
      y: number;
    };
  };

  velocityRef: {
    current: number;
  };
}

export default function CairosExperienceScene({
  progressRef,
  pointerRef,
  velocityRef,
}: CairosExperienceSceneProps) {
  const reduceMotion =
    useReducedMotion();

  const width =
    useThree(
      (
        state
      ) =>
        state.size.width
    );

  const root =
    useRef<THREE.Group | null>(
      null
    );

  const machine =
    useRef<THREE.Group | null>(
      null
    );

  const intake =
    useRef<THREE.Group | null>(
      null
    );

  const intakeToken =
    useRef<THREE.Mesh | null>(
      null
    );

  const leftShell =
    useRef<THREE.Group | null>(
      null
    );

  const rightShell =
    useRef<THREE.Group | null>(
      null
    );

  const leftInner =
    useRef<THREE.Group | null>(
      null
    );

  const rightInner =
    useRef<THREE.Group | null>(
      null
    );

  const scanner =
    useRef<THREE.Mesh | null>(
      null
    );

  const gateLeft =
    useRef<THREE.Group | null>(
      null
    );

  const gateRight =
    useRef<THREE.Group | null>(
      null
    );

  const lock =
    useRef<THREE.Mesh | null>(
      null
    );

  const riskGroup =
    useRef<THREE.Group | null>(
      null
    );

  const dnaGroup =
    useRef<THREE.Group | null>(
      null
    );

  const core =
    useRef<THREE.Group | null>(
      null
    );

  const smoothProgress =
    useRef(0);

  const compact =
    width <
    1280;

  const mobile =
    width <
    760;

  const baseX =
    mobile
      ? 0.65
      : compact
        ? 1.15
        : 1.85;

  const baseY =
    mobile
      ? -0.95
      : 0;

  const baseScale =
    mobile
      ? 0.58
      : compact
        ? 0.78
        : 0.94;

  useFrame(
    (
      state,
      delta
    ) => {
      const targetProgress =
        THREE.MathUtils.clamp(
          progressRef.current,
          0,
          3
        );

      smoothProgress.current =
        THREE.MathUtils.lerp(
          smoothProgress.current,
          targetProgress,
          reduceMotion
            ? 1
            : Math.min(
                1,
                delta * 4.2
              )
        );

      const progress =
        smoothProgress.current;

      const twin =
        smoothStep(
          0.55,
          1.05,
          progress
        );

      const govern =
        smoothStep(
          1.45,
          2.05,
          progress
        );

      const dna =
        smoothStep(
          2.35,
          3,
          progress
        );

      const time =
        state.clock.elapsedTime;

      const velocity =
        THREE.MathUtils.clamp(
          velocityRef.current,
          -10,
          10
        );

      /* =====================================
         WHOLE MACHINE
      ===================================== */

      if (root.current) {
        const pointerX =
          mobile
            ? 0
            : pointerRef.current.x;

        const pointerY =
          mobile
            ? 0
            : pointerRef.current.y;

        root.current.position.x =
          THREE.MathUtils.lerp(
            root.current.position.x,
            baseX +
              pointerX *
                0.16,
            Math.min(
              1,
              delta * 4
            )
          );

        root.current.position.y =
          THREE.MathUtils.lerp(
            root.current.position.y,
            baseY -
              pointerY *
                0.1 +
              (
                reduceMotion
                  ? 0
                  : Math.sin(
                      time *
                        0.32
                    ) *
                    0.025
              ),
            Math.min(
              1,
              delta * 4
            )
          );

        root.current.rotation.y =
          reduceMotion
            ? 0
            : THREE.MathUtils.lerp(
                root.current.rotation.y,
                pointerX *
                    0.07 +
                  velocity *
                    0.0035,
                Math.min(
                  1,
                  delta * 3.6
                )
              );

        root.current.rotation.x =
          reduceMotion
            ? 0
            : THREE.MathUtils.lerp(
                root.current.rotation.x,
                pointerY *
                  -0.035,
                Math.min(
                  1,
                  delta * 3.6
                )
              );

        const nextScale =
          THREE.MathUtils.lerp(
            root.current.scale.x,
            baseScale,
            Math.min(
              1,
              delta * 4
            )
          );

        root.current.scale.setScalar(
          nextScale
        );
      }

      velocityRef.current *=
        0.88;

      /* =====================================
         01 — REQUEST INTAKE
      ===================================== */

      const intakeProgress =
        THREE.MathUtils.clamp(
          progress /
            0.85,
          0,
          1
        );

      if (intake.current) {
        intake.current.visible =
          progress <
          1.4;
      }

      if (
        intakeToken.current
      ) {
        intakeToken.current.position.x =
          THREE.MathUtils.lerp(
            -3.65,
            -0.08,
            intakeProgress
          );

        intakeToken.current.position.y =
          THREE.MathUtils.lerp(
            0.68,
            0.05,
            intakeProgress
          );

        intakeToken.current.position.z =
          THREE.MathUtils.lerp(
            0,
            0.42,
            intakeProgress
          );

        if (
          !reduceMotion
        ) {
          intakeToken.current.rotation.x +=
            delta * 0.65;

          intakeToken.current.rotation.y +=
            delta * 0.9;
        }
      }

      /* =====================================
         02 — TWIN SPLIT
      ===================================== */

      if (
        leftShell.current
      ) {
        leftShell.current.position.x =
          THREE.MathUtils.lerp(
            -0.38,
            -1.18,
            twin
          );

        leftShell.current.rotation.y =
          THREE.MathUtils.lerp(
            -0.03,
            -0.16,
            twin
          );
      }

      if (
        rightShell.current
      ) {
        rightShell.current.position.x =
          THREE.MathUtils.lerp(
            0.38,
            1.18,
            twin
          );

        rightShell.current.rotation.y =
          THREE.MathUtils.lerp(
            0.03,
            0.16,
            twin
          );
      }

      if (
        leftInner.current
      ) {
        leftInner.current.position.x =
          THREE.MathUtils.lerp(
            -0.2,
            -0.64,
            twin
          );
      }

      if (
        rightInner.current
      ) {
        rightInner.current.position.x =
          THREE.MathUtils.lerp(
            0.2,
            0.64,
            twin
          );
      }

      if (
        scanner.current
      ) {
        scanner.current.visible =
          progress >
            0.55 &&
          progress <
            1.65;

        scanner.current.position.y =
          -1.05 +
          (
            (
              Math.sin(
                time * 1.7
              ) +
              1
            ) /
            2
          ) *
            2.1;

        const material =
          scanner.current
            .material as THREE.MeshBasicMaterial;

        material.opacity =
          0.16 +
          twin *
            0.23;
      }

      /* =====================================
         03 — GOVERNANCE GATE
      ===================================== */

      if (
        gateLeft.current
      ) {
        gateLeft.current.position.x =
          THREE.MathUtils.lerp(
            -2.15,
            -0.62,
            govern
          );
      }

      if (
        gateRight.current
      ) {
        gateRight.current.position.x =
          THREE.MathUtils.lerp(
            2.15,
            0.62,
            govern
          );
      }

      if (lock.current) {
        lock.current.visible =
          govern >
          0.04;

        const lockScale =
          0.12 +
          govern *
            0.88;

        lock.current.scale.setScalar(
          lockScale
        );

        if (
          !reduceMotion
        ) {
          lock.current.rotation.y +=
            delta *
            (
              0.18 -
              govern *
                0.13
            );
        }
      }

      if (
        riskGroup.current
      ) {
        riskGroup.current.visible =
          govern >
            0.08 &&
          dna <
            0.7;

        riskGroup.current.scale.setScalar(
          0.35 +
            govern *
              0.65
        );
      }

      /* =====================================
         04 — AGENTDNA UNFOLD
      ===================================== */

      if (
        machine.current
      ) {
        machine.current.scale.setScalar(
          THREE.MathUtils.lerp(
            1,
            0.7,
            dna
          )
        );

        machine.current.position.z =
          THREE.MathUtils.lerp(
            0,
            -0.35,
            dna
          );
      }

      if (core.current) {
        core.current.scale.y =
          THREE.MathUtils.lerp(
            1,
            0.62,
            dna
          );

        core.current.position.z =
          dna *
          0.16;
      }

      if (
        dnaGroup.current
      ) {
        dnaGroup.current.visible =
          dna >
          0.02;

        dnaGroup.current.scale.setScalar(
          0.08 +
            dna *
              0.92
        );

        dnaGroup.current.position.z =
          0.15 +
          dna *
            0.48;
      }
    }
  );

  return (
    <group
      ref={root}
      position={[
        baseX,
        baseY,
        0,
      ]}
      scale={
        baseScale
      }
    >
      {/* =====================================
          MACHINE
      ===================================== */}

      <group
        ref={machine}
      >
        {/* LEFT OUTER SHELL */}

        <group
          ref={
            leftShell
          }
          position={[
            -0.38,
            0,
            0,
          ]}
        >
          <MechanicalShell
            side="left"
          />
        </group>

        {/* RIGHT OUTER SHELL */}

        <group
          ref={
            rightShell
          }
          position={[
            0.38,
            0,
            0,
          ]}
        >
          <MechanicalShell
            side="right"
          />
        </group>

        {/* INNER TWIN MODULES */}

        <group
          ref={
            leftInner
          }
          position={[
            -0.2,
            0,
            0.12,
          ]}
        >
          <InnerTwin
            color="#d4ff32"
          />
        </group>

        <group
          ref={
            rightInner
          }
          position={[
            0.2,
            0,
            0.12,
          ]}
        >
          <InnerTwin
            color="#7f9e21"
          />
        </group>

        {/* CENTRAL CAIROS CORE */}

        <group
          ref={core}
        >
          <mesh>
            <boxGeometry
              args={[
                0.24,
                2.05,
                0.3,
              ]}
            />

            <meshStandardMaterial
              color="#050805"
              metalness={0.9}
              roughness={0.16}
            />
          </mesh>

          <mesh
            position={[
              0,
              0.02,
              0.165,
            ]}
          >
            <boxGeometry
              args={[
                0.042,
                1.22,
                0.018,
              ]}
            />

            <meshStandardMaterial
              color="#d4ff32"
              emissive="#d4ff32"
              emissiveIntensity={
                0.78
              }
            />
          </mesh>

          <mesh
            position={[
              0,
              0.78,
              0.19,
            ]}
          >
            <sphereGeometry
              args={[
                0.075,
                20,
                20,
              ]}
            />

            <meshStandardMaterial
              color="#d4ff32"
              emissive="#d4ff32"
              emissiveIntensity={
                0.9
              }
            />
          </mesh>

          <mesh
            position={[
              0,
              -0.81,
              0.19,
            ]}
          >
            <sphereGeometry
              args={[
                0.052,
                18,
                18,
              ]}
            />

            <meshStandardMaterial
              color="#8a63ff"
              emissive="#8a63ff"
              emissiveIntensity={
                0.62
              }
            />
          </mesh>
        </group>

        {/* SCAN PLANE */}

        <mesh
          ref={scanner}
          visible={false}
          position={[
            0,
            -1.05,
            0.52,
          ]}
        >
          <boxGeometry
            args={[
              3.15,
              0.025,
              0.025,
            ]}
          />

          <meshBasicMaterial
            color="#d4ff32"
            transparent
            opacity={0.18}
          />
        </mesh>

        {/* GOVERNANCE GATES */}

        <group
          ref={gateLeft}
          position={[
            -2.15,
            0,
            0.44,
          ]}
        >
          <GovernanceGate
            flip={false}
          />
        </group>

        <group
          ref={gateRight}
          position={[
            2.15,
            0,
            0.44,
          ]}
        >
          <GovernanceGate
            flip
          />
        </group>

        {/* AUTHORITY LOCK */}

        <mesh
          ref={lock}
          visible={false}
          position={[
            0,
            0,
            0.82,
          ]}
          scale={0.12}
        >
          <octahedronGeometry
            args={[
              0.28,
              1,
            ]}
          />

          <meshStandardMaterial
            color="#d7a83a"
            emissive="#d7a83a"
            emissiveIntensity={
              0.46
            }
            metalness={0.72}
            roughness={0.16}
          />
        </mesh>

        {/* RISK PROPAGATION */}

        <group
          ref={riskGroup}
          visible={false}
        >
          <RiskBranch
            target={[
              2.35,
              0.95,
              0.2,
            ]}
          />

          <RiskBranch
            target={[
              2.6,
              -0.08,
              0.18,
            ]}
          />

          <RiskBranch
            target={[
              2.1,
              -1.15,
              0.14,
            ]}
          />
        </group>

        {/* BASE RAIL */}

        <mesh
          position={[
            0,
            -1.66,
            -0.08,
          ]}
        >
          <boxGeometry
            args={[
              5.6,
              0.035,
              0.045,
            ]}
          />

          <meshStandardMaterial
            color="#d4ff32"
            emissive="#d4ff32"
            emissiveIntensity={
              0.15
            }
            transparent
            opacity={0.48}
          />
        </mesh>
      </group>

      {/* =====================================
          REQUEST INTAKE
      ===================================== */}

      <group
        ref={intake}
      >
        <Line
          points={[
            [
              -3.8,
              0.72,
              0,
            ],
            [
              -2.75,
              0.55,
              0.02,
            ],
            [
              -1.5,
              0.3,
              0.1,
            ],
            [
              0,
              0.05,
              0.28,
            ],
          ]}
          color="#d4ff32"
          transparent
          opacity={0.34}
          lineWidth={1}
          dashed
          dashSize={0.085}
          gapSize={0.08}
        />

        <mesh
          ref={
            intakeToken
          }
          position={[
            -3.65,
            0.68,
            0,
          ]}
        >
          <octahedronGeometry
            args={[
              0.13,
              1,
            ]}
          />

          <meshStandardMaterial
            color="#d4ff32"
            emissive="#d4ff32"
            emissiveIntensity={
              0.72
            }
            metalness={0.58}
            roughness={0.13}
          />
        </mesh>
      </group>

      {/* =====================================
          AGENTDNA CAUSAL UNFOLD
      ===================================== */}

      <group
        ref={dnaGroup}
        visible={false}
        scale={0.08}
      >
        <CausalBranch
          target={[
            -2.2,
            1.18,
            0.1,
          ]}
          color="#8a63ff"
        />

        <CausalBranch
          target={[
            2.15,
            1.08,
            0.08,
          ]}
          color="#8a63ff"
        />

        <CausalBranch
          target={[
            -1.85,
            -1.22,
            0.06,
          ]}
          color="#d4ff32"
        />

        <CausalBranch
          target={[
            2.05,
            -1.2,
            0.06,
          ]}
          color="#e3544d"
        />

        <CausalBranch
          target={[
            0,
            1.72,
            0.12,
          ]}
          color="#8a63ff"
        />

        <mesh
          position={[
            0,
            0,
            0.5,
          ]}
        >
          <octahedronGeometry
            args={[
              0.3,
              1,
            ]}
          />

          <meshStandardMaterial
            color="#2b2046"
            emissive="#8a63ff"
            emissiveIntensity={
              0.75
            }
            metalness={0.64}
            roughness={0.15}
          />
        </mesh>
      </group>
    </group>
  );
}

/* ======================================================
   OUTER SHELL
====================================================== */

function MechanicalShell({
  side,
}: {
  side:
    "left" | "right";
}) {
  const direction =
    side ===
    "left"
      ? -1
      : 1;

  return (
    <group>
      <mesh>
        <boxGeometry
          args={[
            0.72,
            2.5,
            0.18,
          ]}
        />

        <meshStandardMaterial
          color="#18311e"
          metalness={0.64}
          roughness={0.24}
          transparent
          opacity={0.78}
        />
      </mesh>

      <mesh
        position={[
          direction *
            0.42,
          0,
          -0.02,
        ]}
      >
        <boxGeometry
          args={[
            0.05,
            2.12,
            0.12,
          ]}
        />

        <meshStandardMaterial
          color="#d4ff32"
          emissive="#d4ff32"
          emissiveIntensity={
            0.16
          }
          transparent
          opacity={0.42}
        />
      </mesh>

      <mesh
        position={[
          0,
          0.9,
          0.12,
        ]}
      >
        <boxGeometry
          args={[
            0.42,
            0.035,
            0.03,
          ]}
        />

        <meshBasicMaterial
          color="#d4ff32"
          transparent
          opacity={0.32}
        />
      </mesh>

      <mesh
        position={[
          0,
          -0.9,
          0.12,
        ]}
      >
        <boxGeometry
          args={[
            0.42,
            0.035,
            0.03,
          ]}
        />

        <meshBasicMaterial
          color="#8a63ff"
          transparent
          opacity={0.25}
        />
      </mesh>
    </group>
  );
}

/* ======================================================
   INNER TWIN
====================================================== */

function InnerTwin({
  color,
}: {
  color:
    string;
}) {
  return (
    <group>
      <mesh>
        <boxGeometry
          args={[
            0.22,
            1.48,
            0.16,
          ]}
        />

        <meshStandardMaterial
          color="#0b160d"
          metalness={0.82}
          roughness={0.19}
        />
      </mesh>

      <mesh
        position={[
          0,
          0.15,
          0.095,
        ]}
      >
        <boxGeometry
          args={[
            0.04,
            0.78,
            0.015,
          ]}
        />

        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={
            0.48
          }
        />
      </mesh>
    </group>
  );
}

/* ======================================================
   GOVERNANCE GATE
====================================================== */

function GovernanceGate({
  flip,
}: {
  flip:
    boolean;
}) {
  return (
    <group
      rotation={[
        0,
        0,
        flip
          ? -0.05
          : 0.05,
      ]}
    >
      <mesh>
        <boxGeometry
          args={[
            0.12,
            2.86,
            0.12,
          ]}
        />

        <meshStandardMaterial
          color="#29312b"
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      <mesh
        position={[
          flip
            ? -0.34
            : 0.34,
          0,
          0,
        ]}
      >
        <boxGeometry
          args={[
            0.65,
            0.06,
            0.09,
          ]}
        />

        <meshStandardMaterial
          color="#d7a83a"
          emissive="#d7a83a"
          emissiveIntensity={
            0.14
          }
        />
      </mesh>

      <mesh
        position={[
          flip
            ? -0.25
            : 0.25,
          0.92,
          0,
        ]}
      >
        <boxGeometry
          args={[
            0.45,
            0.035,
            0.08,
          ]}
        />

        <meshBasicMaterial
          color="#d7a83a"
          transparent
          opacity={0.52}
        />
      </mesh>

      <mesh
        position={[
          flip
            ? -0.25
            : 0.25,
          -0.92,
          0,
        ]}
      >
        <boxGeometry
          args={[
            0.45,
            0.035,
            0.08,
          ]}
        />

        <meshBasicMaterial
          color="#d7a83a"
          transparent
          opacity={0.3}
        />
      </mesh>
    </group>
  );
}

/* ======================================================
   RISK BRANCH
====================================================== */

function RiskBranch({
  target,
}: {
  target: [
    number,
    number,
    number,
  ];
}) {
  return (
    <>
      <Line
        points={[
          [
            0,
            0,
            0.55,
          ],
          target,
        ]}
        color="#e3544d"
        transparent
        opacity={0.38}
        lineWidth={1}
      />

      <mesh
        position={target}
      >
        <sphereGeometry
          args={[
            0.09,
            18,
            18,
          ]}
        />

        <meshStandardMaterial
          color="#e3544d"
          emissive="#e3544d"
          emissiveIntensity={
            0.62
          }
        />
      </mesh>
    </>
  );
}

/* ======================================================
   CAUSAL BRANCH
====================================================== */

function CausalBranch({
  target,
  color,
}: {
  target: [
    number,
    number,
    number,
  ];

  color:
    string;
}) {
  return (
    <>
      <Line
        points={[
          [
            0,
            0,
            0.5,
          ],
          target,
        ]}
        color={color}
        transparent
        opacity={0.52}
        lineWidth={1}
      />

      <mesh
        position={target}
      >
        <sphereGeometry
          args={[
            0.095,
            18,
            18,
          ]}
        />

        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={
            0.62
          }
        />
      </mesh>
    </>
  );
}

/* ======================================================
   SMOOTH STEP
====================================================== */

function smoothStep(
  min: number,
  max: number,
  value: number
) {
  const normalized =
    THREE.MathUtils.clamp(
      (
        value -
        min
      ) /
        (
          max -
          min
        ),
      0,
      1
    );

  return (
    normalized *
    normalized *
    (
      3 -
      2 *
        normalized
    )
  );
}