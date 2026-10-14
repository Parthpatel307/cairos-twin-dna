"use client";

import {
  useRef,
} from "react";

import {
  Line,
} from "@react-three/drei";

import {
  useFrame,
} from "@react-three/fiber";

import * as THREE from "three";

import type {
  Decision,
} from "@/types";

interface RiskCinematicSceneProps {
  progressRef: {
    current: number;
  };

  riskScore:
    number;

  decision:
    Decision;
}

export default function RiskCinematicScene({
  progressRef,
  riskScore,
  decision,
}: RiskCinematicSceneProps) {
  const root =
    useRef<THREE.Group | null>(
      null
    );

  const source =
    useRef<THREE.Group | null>(
      null
    );

  const branchOne =
    useRef<THREE.Group | null>(
      null
    );

  const branchTwo =
    useRef<THREE.Group | null>(
      null
    );

  const branchThree =
    useRef<THREE.Group | null>(
      null
    );

  const checkpointLeft =
    useRef<THREE.Group | null>(
      null
    );

  const checkpointRight =
    useRef<THREE.Group | null>(
      null
    );

  const seal =
    useRef<THREE.Mesh | null>(
      null
    );

  const output =
    useRef<THREE.Mesh | null>(
      null
    );

  const progress =
    useRef(0);

  const score =
    THREE.MathUtils.clamp(
      riskScore / 100,
      0,
      1
    );

  const decisionColor =
    decision === "ALLOW"
      ? "#d4ff32"
      : decision === "BLOCK"
        ? "#e3544d"
        : "#d7a83a";

  useFrame(
    (
      state,
      delta
    ) => {
      progress.current =
        THREE.MathUtils.lerp(
          progress.current,
          progressRef.current,
          Math.min(
            1,
            delta * 4
          )
        );

      const value =
        progress.current;

      const exposure =
        smoothStep(
          0.55,
          1.2,
          value
        );

      const irreversible =
        smoothStep(
          1.35,
          2.05,
          value
        );

      const authority =
        smoothStep(
          2.2,
          3,
          value
        );

      const time =
        state.clock
          .elapsedTime;

      if (root.current) {
        root.current.position.y =
          Math.sin(
            time * 0.3
          ) *
          0.025;

        root.current.rotation.y =
          Math.sin(
            time * 0.19
          ) *
          0.018;
      }

      /* =====================================
         SOURCE MUTATION
      ===================================== */

      if (source.current) {
        const pulse =
          1 +
          Math.sin(
            time * 1.7
          ) *
            0.035 *
            score;

        source.current.scale.setScalar(
          pulse
        );
      }

      /* =====================================
         BLAST PROPAGATION
      ===================================== */

      animateBranch(
        branchOne.current,
        exposure,
        0
      );

      animateBranch(
        branchTwo.current,
        exposure,
        0.13
      );

      animateBranch(
        branchThree.current,
        exposure,
        0.25
      );

      /* =====================================
         POLICY CHECKPOINT

         Irreversible action pushes shutters
         toward the center.
      ===================================== */

      if (
        checkpointLeft.current
      ) {
        checkpointLeft.current.position.x =
          THREE.MathUtils.lerp(
            -2.45,
            -0.72,
            irreversible
          );
      }

      if (
        checkpointRight.current
      ) {
        checkpointRight.current.position.x =
          THREE.MathUtils.lerp(
            2.45,
            0.72,
            irreversible
          );
      }

      /* =====================================
         HUMAN AUTHORITY SEAL
      ===================================== */

      if (seal.current) {
        const shouldShow =
          decision ===
            "ASK" &&
          authority >
            0.02;

        seal.current.visible =
          shouldShow;

        if (
          shouldShow
        ) {
          seal.current.scale.setScalar(
            0.08 +
              authority *
                0.92
          );

          seal.current.rotation.z =
            THREE.MathUtils.lerp(
              0,
              Math.PI /
                4,
              authority
            );
        }
      }

      /* =====================================
         DECISION OUTPUT
      ===================================== */

      if (output.current) {
        output.current.visible =
          authority >
          0.02;

        if (
          decision ===
          "ALLOW"
        ) {
          output.current.position.x =
            THREE.MathUtils.lerp(
              0.8,
              3.25,
              authority
            );
        } else if (
          decision ===
          "BLOCK"
        ) {
          output.current.position.x =
            THREE.MathUtils.lerp(
              0.8,
              0.92,
              authority
            );
        } else {
          output.current.position.x =
            THREE.MathUtils.lerp(
              0.8,
              1.05,
              authority
            );
        }
      }
    }
  );

  return (
    <group
      ref={root}
      position={[
        1.75,
        -0.05,
        0,
      ]}
      scale={0.92}
    >
      {/* =====================================
          ENGINEERING FIELD
      ===================================== */}

      <EngineeringField />

      {/* =====================================
          MUTATION SOURCE
      ===================================== */}

      <group
        ref={source}
        position={[
          -1.7,
          0,
          0.4,
        ]}
      >
        <mesh>
          <octahedronGeometry
            args={[
              0.34,
              1,
            ]}
          />

          <meshStandardMaterial
            color="#3a1514"
            emissive="#e3544d"
            emissiveIntensity={
              0.72
            }
            metalness={0.63}
            roughness={0.15}
          />
        </mesh>

        <mesh
          position={[
            0,
            0,
            -0.16,
          ]}
        >
          <boxGeometry
            args={[
              0.9,
              0.9,
              0.04,
            ]}
          />

          <meshBasicMaterial
            color="#e3544d"
            transparent
            opacity={0.08}
          />
        </mesh>
      </group>

      {/* =====================================
          SOURCE → CHECKPOINT
      ===================================== */}

      <Line
        points={[
          [
            -1.35,
            0,
            0.38,
          ],
          [
            -0.55,
            0,
            0.34,
          ],
          [
            0.2,
            0,
            0.3,
          ],
        ]}
        color="#e3544d"
        transparent
        opacity={0.42}
        lineWidth={1}
      />

      {/* =====================================
          BLAST RADIUS
      ===================================== */}

      <group
        ref={branchOne}
        scale={0.05}
      >
        <RiskBranch
          end={[
            2.5,
            1.15,
            0.16,
          ]}
          labelColor="#e3544d"
        />
      </group>

      <group
        ref={branchTwo}
        scale={0.05}
      >
        <RiskBranch
          end={[
            2.85,
            0,
            0.1,
          ]}
          labelColor="#e3544d"
        />
      </group>

      <group
        ref={branchThree}
        scale={0.05}
      >
        <RiskBranch
          end={[
            2.4,
            -1.18,
            0.12,
          ]}
          labelColor="#e3544d"
        />
      </group>

      {/* =====================================
          GOVERNANCE SHUTTERS
      ===================================== */}

      <group
        ref={
          checkpointLeft
        }
        position={[
          -2.45,
          0,
          0.56,
        ]}
      >
        <PolicyGate
          side="left"
          color={
            decisionColor
          }
        />
      </group>

      <group
        ref={
          checkpointRight
        }
        position={[
          2.45,
          0,
          0.56,
        ]}
      >
        <PolicyGate
          side="right"
          color={
            decisionColor
          }
        />
      </group>

      {/* =====================================
          AUTHORITY SEAL
      ===================================== */}

      <mesh
        ref={seal}
        visible={false}
        position={[
          0.05,
          0,
          0.9,
        ]}
        scale={0.08}
      >
        <octahedronGeometry
          args={[
            0.32,
            1,
          ]}
        />

        <meshStandardMaterial
          color="#d7a83a"
          emissive="#d7a83a"
          emissiveIntensity={0.55}
          metalness={0.74}
          roughness={0.14}
        />
      </mesh>

      {/* =====================================
          DECISION OUTPUT
      ===================================== */}

      <mesh
        ref={output}
        visible={false}
        position={[
          0.8,
          -0.08,
          0.5,
        ]}
      >
        <octahedronGeometry
          args={[
            0.11,
            1,
          ]}
        />

        <meshStandardMaterial
          color={
            decisionColor
          }
          emissive={
            decisionColor
          }
          emissiveIntensity={0.75}
        />
      </mesh>

      {/* =====================================
          BASE
      ===================================== */}

      <mesh
        position={[
          0,
          -1.7,
          -0.08,
        ]}
      >
        <boxGeometry
          args={[
            6.1,
            0.035,
            0.05,
          ]}
        />

        <meshStandardMaterial
          color="#d4ff32"
          emissive="#d4ff32"
          emissiveIntensity={0.12}
          transparent
          opacity={0.4}
        />
      </mesh>
    </group>
  );
}

/* ======================================================
   FIELD
====================================================== */

function EngineeringField() {
  const xs = [
    -3,
    -2,
    -1,
    0,
    1,
    2,
    3,
  ];

  return (
    <group
      position={[
        0,
        0,
        -0.7,
      ]}
    >
      {xs.map(
        (
          x
        ) => (
          <Line
            key={x}
            points={[
              [
                x,
                -1.5,
                0,
              ],
              [
                x,
                1.5,
                0,
              ],
            ]}
            color="#d4ff32"
            transparent
            opacity={0.035}
            lineWidth={1}
          />
        )
      )}

      <Line
        points={[
          [
            -3.3,
            0,
            0,
          ],
          [
            3.3,
            0,
            0,
          ],
        ]}
        color="#d4ff32"
        transparent
        opacity={0.05}
        lineWidth={1}
      />
    </group>
  );
}

/* ======================================================
   RISK BRANCH
====================================================== */

function RiskBranch({
  end,
  labelColor,
}: {
  end: [
    number,
    number,
    number,
  ];

  labelColor:
    string;
}) {
  return (
    <>
      <Line
        points={[
          [
            -0.1,
            0,
            0.4,
          ],
          end,
        ]}
        color={labelColor}
        transparent
        opacity={0.4}
        lineWidth={1}
      />

      <mesh
        position={end}
      >
        <sphereGeometry
          args={[
            0.1,
            18,
            18,
          ]}
        />

        <meshStandardMaterial
          color={labelColor}
          emissive={labelColor}
          emissiveIntensity={0.68}
        />
      </mesh>
    </>
  );
}

/* ======================================================
   POLICY GATE
====================================================== */

function PolicyGate({
  side,
  color,
}: {
  side:
    "left" | "right";

  color:
    string;
}) {
  const direction =
    side ===
    "left"
      ? 1
      : -1;

  return (
    <group>
      <mesh>
        <boxGeometry
          args={[
            0.12,
            3,
            0.13,
          ]}
        />

        <meshStandardMaterial
          color="#313830"
          metalness={0.82}
          roughness={0.18}
        />
      </mesh>

      <mesh
        position={[
          direction *
            0.38,
          0,
          0,
        ]}
      >
        <boxGeometry
          args={[
            0.72,
            0.065,
            0.09,
          ]}
        />

        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.22}
        />
      </mesh>

      <mesh
        position={[
          direction *
            0.28,
          1,
          0,
        ]}
      >
        <boxGeometry
          args={[
            0.5,
            0.032,
            0.07,
          ]}
        />

        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.52}
        />
      </mesh>

      <mesh
        position={[
          direction *
            0.28,
          -1,
          0,
        ]}
      >
        <boxGeometry
          args={[
            0.5,
            0.032,
            0.07,
          ]}
        />

        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.28}
        />
      </mesh>
    </group>
  );
}

/* ======================================================
   ANIMATE BRANCH
====================================================== */

function animateBranch(
  branch:
    THREE.Group | null,

  progress:
    number,

  delay:
    number
) {
  if (!branch) {
    return;
  }

  const local =
    THREE.MathUtils.clamp(
      (
        progress -
        delay
      ) /
        (
          1 -
          delay
        ),
      0,
      1
    );

  const eased =
    local *
    local *
    (
      3 -
      2 *
        local
    );

  branch.scale.setScalar(
    0.05 +
      eased *
        0.95
  );
}

function smoothStep(
  min:
    number,

  max:
    number,

  value:
    number
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