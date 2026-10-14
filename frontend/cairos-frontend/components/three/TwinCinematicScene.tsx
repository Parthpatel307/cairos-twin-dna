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

import * as THREE from "three";

import type {
  Decision,
} from "@/types";

type TwinPhase =
  | "READY"
  | "PLANNING"
  | "SIMULATING"
  | "ANALYZING"
  | "COMPLETE";

interface TwinCinematicSceneProps {
  phase:
    TwinPhase;

  decision:
    Decision | null;

  riskScore:
    number;
}

export default function TwinCinematicScene({
  phase,
  decision,
  riskScore,
}: TwinCinematicSceneProps) {
  const root =
    useRef<THREE.Group | null>(
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

  const leftGate =
    useRef<THREE.Group | null>(
      null
    );

  const rightGate =
    useRef<THREE.Group | null>(
      null
    );

  const signal =
    useRef<THREE.Mesh | null>(
      null
    );

  const scanner =
    useRef<THREE.Mesh | null>(
      null
    );

  const riskGroup =
    useRef<THREE.Group | null>(
      null
    );

  const verdictGroup =
    useRef<THREE.Group | null>(
      null
    );

  const progress =
    useRef(0);

  const width =
    useThree(
      (
        state
      ) =>
        state.size.width
    );

  const mobile =
    width <
    760;

  const compact =
    width >=
      760 &&
    width <
      1180;

  const baseX =
    mobile
      ? 0.9
      : compact
        ? 1.52
        : 1.92;

  const baseScale =
    mobile
      ? 0.64
      : compact
        ? 0.88
        : 1.08;

  const path =
    useMemo(
      () =>
        new THREE.CatmullRomCurve3(
          [
            new THREE.Vector3(
              -2.8,
              0.55,
              0.3
            ),

            new THREE.Vector3(
              -1.65,
              0.36,
              0.45
            ),

            new THREE.Vector3(
              -0.45,
              0.14,
              0.62
            ),

            new THREE.Vector3(
              0.5,
              -0.02,
              0.68
            ),

            new THREE.Vector3(
              1.45,
              -0.2,
              0.5
            ),

            new THREE.Vector3(
              2.7,
              -0.42,
              0.28
            ),
          ],
          false,
          "catmullrom",
          0.45
        ),
      []
    );

  const pathPoints =
    useMemo(
      () =>
        path
          .getPoints(
            36
          )
          .map(
            (
              point
            ) => [
              point.x,
              point.y,
              point.z,
            ] as [
              number,
              number,
              number
            ]
          ),
      [
        path,
      ]
    );

  useFrame(
    (
      state,
      delta
    ) => {
      const target =
        phaseTarget(
          phase
        );

      progress.current =
        THREE.MathUtils.lerp(
          progress.current,
          target,
          Math.min(
            1,
            delta *
              3.1
          )
        );

      const value =
        progress.current;

      const time =
        state.clock.elapsedTime;

      if (
        root.current
      ) {
        root.current.position.x =
          THREE.MathUtils.lerp(
            root.current.position.x,
            baseX,
            Math.min(
              1,
              delta *
                4
            )
          );

        root.current.position.y =
          Math.sin(
            time *
              0.23
          ) *
          0.02;

        root.current.scale.setScalar(
          THREE.MathUtils.lerp(
            root.current.scale.x,
            baseScale,
            Math.min(
              1,
              delta *
                4
            )
          )
        );
      }

      /* =====================================
         TWIN SHELL OPENING
      ===================================== */

      const simulationOpen =
        smoothStep(
          0.28,
          0.62,
          value
        );

      if (
        leftShell.current
      ) {
        leftShell.current.position.x =
          THREE.MathUtils.lerp(
            -0.67,
            -1.04,
            simulationOpen
          );

        leftShell.current.rotation.y =
          THREE.MathUtils.lerp(
            -0.02,
            -0.1,
            simulationOpen
          );
      }

      if (
        rightShell.current
      ) {
        rightShell.current.position.x =
          THREE.MathUtils.lerp(
            0.67,
            1.04,
            simulationOpen
          );

        rightShell.current.rotation.y =
          THREE.MathUtils.lerp(
            0.02,
            0.1,
            simulationOpen
          );
      }

      /* =====================================
         PLAN SIGNAL
      ===================================== */

      if (
        signal.current
      ) {
        const point =
          path.getPointAt(
            THREE.MathUtils.clamp(
              value,
              0.03,
              0.98
            )
          );

        signal.current.position.lerp(
          point,
          Math.min(
            1,
            delta *
              4
          )
        );

        signal.current.rotation.x +=
          delta *
          0.55;

        signal.current.rotation.y +=
          delta *
          0.8;
      }

      /* =====================================
         SCAN
      ===================================== */

      if (
        scanner.current
      ) {
        scanner.current.visible =
          phase ===
            "SIMULATING" ||
          phase ===
            "ANALYZING";

        scanner.current.position.y =
          -1.28 +
          (
            (
              Math.sin(
                time *
                  1.8
              ) +
              1
            ) /
            2
          ) *
            2.56;
      }

      /* =====================================
         RISK
      ===================================== */

      if (
        riskGroup.current
      ) {
        const riskVisible =
          smoothStep(
            0.62,
            0.84,
            value
          );

        riskGroup.current.visible =
          riskVisible >
          0.02;

        riskGroup.current.scale.setScalar(
          0.02 +
            riskVisible *
              0.98
        );
      }

      /* =====================================
         VERDICT / GATES
      ===================================== */

      const verdict =
        smoothStep(
          0.82,
          1,
          value
        );

      let gateOpen =
        0.15;

      if (
        phase ===
          "COMPLETE" &&
        decision ===
          "ALLOW"
      ) {
        gateOpen =
          1;
      }

      if (
        phase ===
          "COMPLETE" &&
        decision ===
          "ASK"
      ) {
        gateOpen =
          0.34;
      }

      if (
        phase ===
          "COMPLETE" &&
        decision ===
          "BLOCK"
      ) {
        gateOpen =
          0;
      }

      if (
        leftGate.current
      ) {
        leftGate.current.position.x =
          THREE.MathUtils.lerp(
            -2.12,
            -2.72,
            verdict *
              gateOpen
          );
      }

      if (
        rightGate.current
      ) {
        rightGate.current.position.x =
          THREE.MathUtils.lerp(
            2.12,
            2.72,
            verdict *
              gateOpen
          );
      }

      if (
        verdictGroup.current
      ) {
        verdictGroup.current.visible =
          verdict >
          0.03;

        verdictGroup.current.scale.setScalar(
          0.04 +
            verdict *
              0.96
        );
      }
    }
  );

  const verdictColor =
    decision ===
    "ALLOW"
      ? "#cce849"
      : decision ===
          "BLOCK"
        ? "#c95852"
        : "#c6a248";

  const riskTone =
    riskScore >=
    80
      ? "#c95852"
      : "#c6a248";

  return (
    <group
      ref={
        root
      }
      position={[
        baseX,
        0,
        0,
      ]}
      scale={
        baseScale
      }
    >
      {/* =====================================
          BACKPLANE
      ===================================== */}

      <Backplane />

      {/* =====================================
          PLAN PATH
      ===================================== */}

      <Line
        points={
          pathPoints
        }
        color="#a9bd62"
        transparent
        opacity={0.16}
        lineWidth={1}
      />

      <mesh
        ref={
          signal
        }
        position={[
          -2.7,
          0.52,
          0.3,
        ]}
      >
        <octahedronGeometry
          args={[
            0.105,
            1,
          ]}
        />

        <meshStandardMaterial
          color="#d8ec58"
          emissive="#cce849"
          emissiveIntensity={0.7}
          metalness={0.54}
          roughness={0.12}
        />
      </mesh>

      {/* =====================================
          TWIN BODY
      ===================================== */}

      <group
        ref={
          leftShell
        }
        position={[
          -0.67,
          0,
          0,
        ]}
      >
        <TwinShell
          side="left"
        />
      </group>

      <group
        ref={
          rightShell
        }
        position={[
          0.67,
          0,
          0,
        ]}
      >
        <TwinShell
          side="right"
        />
      </group>

      <TwinCore />

      {/* =====================================
          GOVERNANCE GATES
      ===================================== */}

      <group
        ref={
          leftGate
        }
        position={[
          -2.12,
          0,
          0.05,
        ]}
      >
        <Gate
          side="left"
        />
      </group>

      <group
        ref={
          rightGate
        }
        position={[
          2.12,
          0,
          0.05,
        ]}
      >
        <Gate
          side="right"
        />
      </group>

      {/* =====================================
          SCANNER
      ===================================== */}

      <mesh
        ref={
          scanner
        }
        visible={false}
        position={[
          0,
          -1.2,
          0.88,
        ]}
      >
        <boxGeometry
          args={[
            3.45,
            0.022,
            0.022,
          ]}
        />

        <meshBasicMaterial
          color="#cce849"
          transparent
          opacity={0.22}
        />
      </mesh>

      {/* =====================================
          RISK PROPAGATION
      ===================================== */}

      <group
        ref={
          riskGroup
        }
        visible={false}
        scale={0.02}
      >
        <RiskBranch
          target={[
            2.0,
            1.15,
            0.18,
          ]}
          color={
            riskTone
          }
        />

        <RiskBranch
          target={[
            2.7,
            0.25,
            0.12,
          ]}
          color={
            riskTone
          }
        />

        <RiskBranch
          target={[
            2.15,
            -1.1,
            0.16,
          ]}
          color="#c95852"
        />
      </group>

      {/* =====================================
          VERDICT
      ===================================== */}

      <group
        ref={
          verdictGroup
        }
        visible={false}
        scale={0.04}
        position={[
          0,
          1.28,
          0.72,
        ]}
      >
        <mesh
          rotation={[
            0,
            0,
            Math.PI /
              4,
          ]}
        >
          <octahedronGeometry
            args={[
              0.17,
              1,
            ]}
          />

          <meshStandardMaterial
            color={
              verdictColor
            }
            emissive={
              verdictColor
            }
            emissiveIntensity={0.72}
            metalness={0.54}
            roughness={0.12}
          />
        </mesh>

        <mesh
          position={[
            0,
            -0.34,
            -0.08,
          ]}
        >
          <boxGeometry
            args={[
              0.03,
              0.43,
              0.03,
            ]}
          />

          <meshBasicMaterial
            color={
              verdictColor
            }
            transparent
            opacity={0.45}
          />
        </mesh>
      </group>
    </group>
  );
}

/* ======================================================
   BACKPLANE
====================================================== */

function Backplane() {
  return (
    <group
      position={[
        0,
        0,
        -1.05,
      ]}
    >
      <mesh>
        <boxGeometry
          args={[
            4.2,
            3.2,
            0.12,
          ]}
        />

        <meshStandardMaterial
          color="#071109"
          metalness={0.58}
          roughness={0.34}
        />
      </mesh>

      <mesh
        position={[
          0,
          0,
          0.08,
        ]}
      >
        <boxGeometry
          args={[
            3.78,
            2.82,
            0.06,
          ]}
        />

        <meshStandardMaterial
          color="#0a180d"
          metalness={0.5}
          roughness={0.38}
        />
      </mesh>

      <ArchitecturePost
        x={-3}
        height={4}
      />

      <ArchitecturePost
        x={3}
        height={4.15}
      />

      <ArchitecturePost
        x={-2.3}
        height={2.8}
        opacity={0.16}
      />

      <ArchitecturePost
        x={2.3}
        height={2.9}
        opacity={0.16}
      />

      <Line
        points={[
          [
            -3.4,
            1.65,
            0,
          ],
          [
            3.4,
            1.65,
            0,
          ],
        ]}
        color="#7f9346"
        transparent
        opacity={0.07}
        lineWidth={1}
      />

      <Line
        points={[
          [
            -3.4,
            -1.62,
            0,
          ],
          [
            3.4,
            -1.62,
            0,
          ],
        ]}
        color="#7f9346"
        transparent
        opacity={0.11}
        lineWidth={1}
      />
    </group>
  );
}

function ArchitecturePost({
  x,
  height,
  opacity = 0.44,
}: {
  x:
    number;

  height:
    number;

  opacity?:
    number;
}) {
  return (
    <mesh
      position={[
        x,
        0,
        0,
      ]}
    >
      <boxGeometry
        args={[
          0.2,
          height,
          0.18,
        ]}
      />

      <meshStandardMaterial
        color="#020502"
        metalness={0.72}
        roughness={0.22}
        transparent
        opacity={opacity}
      />
    </mesh>
  );
}

/* ======================================================
   SHELL
====================================================== */

function TwinShell({
  side,
}: {
  side:
    "left" |
    "right";
}) {
  const direction =
    side ===
    "left"
      ? -1
      : 1;

  return (
    <group>
      <mesh
        position={[
          0,
          0,
          -0.16,
        ]}
      >
        <boxGeometry
          args={[
            1.05,
            2.72,
            0.5,
          ]}
        />

        <meshStandardMaterial
          color="#061008"
          metalness={0.82}
          roughness={0.16}
        />
      </mesh>

      <mesh
        position={[
          direction *
            0.03,
          0,
          0.13,
        ]}
      >
        <boxGeometry
          args={[
            0.9,
            2.52,
            0.28,
          ]}
        />

        <meshStandardMaterial
          color="#0b190e"
          metalness={0.7}
          roughness={0.2}
        />
      </mesh>

      <mesh
        position={[
          direction *
            -0.02,
          0,
          0.3,
        ]}
      >
        <boxGeometry
          args={[
            0.56,
            1.84,
            0.07,
          ]}
        />

        <meshStandardMaterial
          color="#020402"
          metalness={0.42}
          roughness={0.48}
        />
      </mesh>

      <mesh
        position={[
          direction *
            0.46,
          0,
          0.29,
        ]}
      >
        <boxGeometry
          args={[
            0.05,
            2.14,
            0.07,
          ]}
        />

        <meshStandardMaterial
          color="#91b82b"
          emissive="#71981f"
          emissiveIntensity={0.22}
          metalness={0.45}
          roughness={0.24}
        />
      </mesh>

      <mesh
        position={[
          direction *
            -0.02,
          -1,
          0.42,
        ]}
      >
        <boxGeometry
          args={[
            0.45,
            0.04,
            0.03,
          ]}
        />

        <meshBasicMaterial
          color="#8062dc"
          transparent
          opacity={0.46}
        />
      </mesh>
    </group>
  );
}

/* ======================================================
   CORE
====================================================== */

function TwinCore() {
  return (
    <group>
      <mesh
        position={[
          0,
          0,
          -0.02,
        ]}
      >
        <boxGeometry
          args={[
            0.55,
            3.05,
            0.6,
          ]}
        />

        <meshStandardMaterial
          color="#020402"
          metalness={0.92}
          roughness={0.11}
        />
      </mesh>

      <mesh
        position={[
          0,
          -0.03,
          0.35,
        ]}
      >
        <boxGeometry
          args={[
            0.17,
            2,
            0.1,
          ]}
        />

        <meshStandardMaterial
          color="#17200e"
          metalness={0.72}
          roughness={0.17}
        />
      </mesh>

      <mesh
        position={[
          0,
          -0.03,
          0.43,
        ]}
      >
        <boxGeometry
          args={[
            0.058,
            1.5,
            0.04,
          ]}
        />

        <meshStandardMaterial
          color="#dce97b"
          emissive="#cce849"
          emissiveIntensity={0.62}
          metalness={0.44}
          roughness={0.12}
        />
      </mesh>

      <mesh
        position={[
          0,
          1.08,
          0.49,
        ]}
        rotation={[
          0,
          0,
          Math.PI /
            4,
        ]}
      >
        <octahedronGeometry
          args={[
            0.15,
            1,
          ]}
        />

        <meshStandardMaterial
          color="#e1ed82"
          emissive="#cce849"
          emissiveIntensity={0.48}
          metalness={0.52}
          roughness={0.11}
        />
      </mesh>

      <mesh
        position={[
          0,
          -1.07,
          0.5,
        ]}
        rotation={[
          0,
          0,
          Math.PI /
            4,
        ]}
      >
        <octahedronGeometry
          args={[
            0.11,
            1,
          ]}
        />

        <meshStandardMaterial
          color="#8062dc"
          emissive="#8062dc"
          emissiveIntensity={0.56}
          metalness={0.58}
          roughness={0.13}
        />
      </mesh>
    </group>
  );
}

/* ======================================================
   GATE
====================================================== */

function Gate({
  side,
}: {
  side:
    "left" |
    "right";
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
            0.14,
            3.45,
            0.28,
          ]}
        />

        <meshStandardMaterial
          color="#020402"
          metalness={0.92}
          roughness={0.12}
        />
      </mesh>

      <mesh
        position={[
          direction *
            0.43,
          0.65,
          0.15,
        ]}
      >
        <boxGeometry
          args={[
            0.88,
            0.07,
            0.08,
          ]}
        />

        <meshStandardMaterial
          color="#806721"
          metalness={0.65}
          roughness={0.18}
        />
      </mesh>

      <mesh
        position={[
          direction *
            0.43,
          -0.65,
          0.15,
        ]}
      >
        <boxGeometry
          args={[
            0.88,
            0.07,
            0.08,
          ]}
        />

        <meshStandardMaterial
          color="#58491e"
          metalness={0.65}
          roughness={0.18}
        />
      </mesh>
    </group>
  );
}

/* ======================================================
   RISK
====================================================== */

function RiskBranch({
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
            0.65,
            -0.12,
            0.58,
          ],
          target,
        ]}
        color={
          color
        }
        transparent
        opacity={0.5}
        lineWidth={1}
      />

      <mesh
        position={
          target
        }
      >
        <sphereGeometry
          args={[
            0.075,
            16,
            16,
          ]}
        />

        <meshStandardMaterial
          color={
            color
          }
          emissive={
            color
          }
          emissiveIntensity={0.55}
        />
      </mesh>
    </>
  );
}

/* ======================================================
   PHASE
====================================================== */

function phaseTarget(
  phase:
    TwinPhase
) {
  if (
    phase ===
    "PLANNING"
  ) {
    return 0.26;
  }

  if (
    phase ===
    "SIMULATING"
  ) {
    return 0.56;
  }

  if (
    phase ===
    "ANALYZING"
  ) {
    return 0.8;
  }

  if (
    phase ===
    "COMPLETE"
  ) {
    return 1;
  }

  return 0.04;
}

function smoothStep(
  min:
    number,

  max:
    number,

  value:
    number
) {
  const t =
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
    t *
    t *
    (
      3 -
      2 *
        t
    )
  );
}