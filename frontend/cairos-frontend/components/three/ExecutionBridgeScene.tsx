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

import {
  useReducedMotion,
} from "framer-motion";

import * as THREE from "three";

export type ExecutionBridgeState =
  | "READY"
  | "RUNNING"
  | "FAILED";

interface ExecutionBridgeSceneProps {
  state: ExecutionBridgeState;
  activeStage: number;
}

export default function ExecutionBridgeScene({
  state,
  activeStage,
}: ExecutionBridgeSceneProps) {
  const reduceMotion =
    useReducedMotion();

  const root =
    useRef<THREE.Group | null>(
      null
    );

  const packet =
    useRef<THREE.Mesh | null>(
      null
    );

  const mutation =
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

  const progress =
    useRef(0);

  const running =
    state ===
    "RUNNING";

  const failed =
    state ===
    "FAILED";

  const targetProgress =
    failed
      ? 1
      : !running
        ? 0.05
        : activeStage === 0
          ? 0.2
          : activeStage === 1
            ? 0.44
            : activeStage === 2
              ? 0.72
              : 0.94;

  const path =
    useRef(
      new THREE.CatmullRomCurve3(
        [
          new THREE.Vector3(
            -3,
            0.65,
            0.15
          ),

          new THREE.Vector3(
            -1.8,
            0.45,
            0.18
          ),

          new THREE.Vector3(
            -0.55,
            0.1,
            0.24
          ),

          new THREE.Vector3(
            0.45,
            -0.12,
            0.18
          ),

          new THREE.Vector3(
            1.55,
            -0.35,
            0.12
          ),

          new THREE.Vector3(
            2.85,
            -0.55,
            0.08
          ),
        ],
        false,
        "catmullrom",
        0.5
      )
    );

  useFrame(
    (
      frame,
      delta
    ) => {
      if (
        !reduceMotion
      ) {
        const time =
          frame.clock
            .elapsedTime;

        if (root.current) {
          root.current.position.y =
            Math.sin(
              time * 0.34
            ) * 0.02;
        }

        if (mutation.current) {
          mutation.current.rotation.y +=
            delta *
            (
              running
                ? 0.22
                : failed
                  ? 0.08
                  : 0.025
            );
        }
      }

      progress.current =
        THREE.MathUtils.lerp(
          progress.current,
          targetProgress,
          Math.min(
            1,
            delta * 2.2
          )
        );

      if (packet.current) {
        packet.current.position.copy(
          path.current.getPoint(
            progress.current
          )
        );

        if (
          !reduceMotion
        ) {
          packet.current.rotation.x +=
            delta * 0.6;

          packet.current.rotation.y +=
            delta * 0.85;
        }
      }

      const gateOpen =
        running ||
        failed;

      if (leftGate.current) {
        leftGate.current.position.x =
          THREE.MathUtils.lerp(
            leftGate.current.position.x,
            gateOpen
              ? -1.1
              : -0.57,
            Math.min(
              1,
              delta * 2.8
            )
          );
      }

      if (rightGate.current) {
        rightGate.current.position.x =
          THREE.MathUtils.lerp(
            rightGate.current.position.x,
            gateOpen
              ? 1.1
              : 0.57,
            Math.min(
              1,
              delta * 2.8
            )
          );
      }
    }
  );

  return (
    <group
      ref={root}
      position={[
        1.8,
        0,
        0,
      ]}
    >
      {/* =====================================
          AUTHORITY INPUT
      ===================================== */}

      <group
        position={[
          -3,
          0.65,
          0.15,
        ]}
      >
        <mesh>
          <boxGeometry
            args={[
              0.48,
              0.35,
              0.12,
            ]}
          />

          <meshStandardMaterial
            color="#6c7469"
            metalness={0.75}
            roughness={0.28}
          />
        </mesh>

        <mesh
          position={[
            0,
            0,
            0.075,
          ]}
        >
          <circleGeometry
            args={[
              0.045,
              18,
            ]}
          />

          <meshBasicMaterial
            color="#9fc83b"
          />
        </mesh>
      </group>

      {/* =====================================
          EXECUTION PATH
      ===================================== */}

      <Line
        points={[
          [
            -3,
            0.65,
            0.15,
          ],

          [
            -1.8,
            0.45,
            0.18,
          ],

          [
            -0.55,
            0.1,
            0.24,
          ],

          [
            0.45,
            -0.12,
            0.18,
          ],

          [
            1.55,
            -0.35,
            0.12,
          ],

          [
            2.85,
            -0.55,
            0.08,
          ],
        ]}
        color={
          failed
            ? "#bf514c"
            : "#8fb42f"
        }
        transparent
        opacity={
          running ||
          failed
            ? 0.38
            : 0.12
        }
        lineWidth={1}
        dashed
        dashSize={0.08}
        gapSize={0.08}
      />

      {/* =====================================
          MOVING EXECUTION PACKET
      ===================================== */}

      <mesh
        ref={packet}
      >
        <octahedronGeometry
          args={[
            0.09,
            1,
          ]}
        />

        <meshStandardMaterial
          color={
            failed
              ? "#bf514c"
              : "#9fc83b"
          }
          emissive={
            failed
              ? "#bf514c"
              : "#9fc83b"
          }
          emissiveIntensity={
            running
              ? 0.8
              : failed
                ? 0.7
                : 0.22
          }
          metalness={0.6}
          roughness={0.18}
        />
      </mesh>

      {/* =====================================
          PRODUCTION BOUNDARY
      ===================================== */}

      <group
        position={[
          -0.55,
          0.05,
          -0.12,
        ]}
      >
        <group
          ref={leftGate}
          position={[
            -0.57,
            0,
            0,
          ]}
        >
          <Gate />
        </group>

        <group
          ref={rightGate}
          position={[
            0.57,
            0,
            0,
          ]}
        >
          <Gate />
        </group>
      </group>

      {/* =====================================
          MUTATION CORE
      ===================================== */}

      <group
        ref={mutation}
        position={[
          0.75,
          -0.18,
          0.15,
        ]}
      >
        <mesh>
          <octahedronGeometry
            args={[
              0.46,
              2,
            ]}
          />

          <meshStandardMaterial
            color={
              failed
                ? "#382421"
                : "#2c3128"
            }
            emissive={
              failed
                ? "#bf514c"
                : "#c5a349"
            }
            emissiveIntensity={
              failed
                ? 0.35
                : activeStage >=
                    2
                  ? 0.2
                  : 0.05
            }
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>

        <mesh
          scale={1.1}
        >
          <octahedronGeometry
            args={[
              0.46,
              1,
            ]}
          />

          <meshBasicMaterial
            color={
              failed
                ? "#bf514c"
                : "#c5a349"
            }
            wireframe
            transparent
            opacity={
              activeStage >=
                2 ||
              failed
                ? 0.34
                : 0.09
            }
          />
        </mesh>
      </group>

      {/* =====================================
          VERIFICATION NODE
      ===================================== */}

      <mesh
        position={[
          1.65,
          -0.36,
          0.12,
        ]}
      >
        <sphereGeometry
          args={[
            0.11,
            22,
            22,
          ]}
        />

        <meshStandardMaterial
          color={
            failed
              ? "#bf514c"
              : activeStage >=
                  3
                ? "#c5a349"
                : "#7e877b"
          }
          emissive={
            failed
              ? "#bf514c"
              : activeStage >=
                  3
                ? "#c5a349"
                : "#7e877b"
          }
          emissiveIntensity={
            activeStage >=
              3 ||
            failed
              ? 0.5
              : 0.08
          }
        />
      </mesh>

      {/* =====================================
          FAILURE PROPAGATION
      ===================================== */}

      <FailureBranch
        origin={[
          1.7,
          -0.4,
          0.1,
        ]}
        position={[
          2.75,
          0.75,
          0.05,
        ]}
        failed={
          failed
        }
      />

      <FailureBranch
        origin={[
          1.7,
          -0.4,
          0.1,
        ]}
        position={[
          3.05,
          -0.5,
          0.04,
        ]}
        failed={
          failed
        }
      />

      <FailureBranch
        origin={[
          1.7,
          -0.4,
          0.1,
        ]}
        position={[
          2.45,
          -1.45,
          0.05,
        ]}
        failed={
          failed
        }
      />

      {/* =====================================
          TRACE SEAL
      ===================================== */}

      <group
        position={[
          -2.25,
          -1.25,
          0.1,
        ]}
      >
        <mesh>
          <torusGeometry
            args={[
              0.34,
              0.018,
              10,
              70,
            ]}
          />

          <meshBasicMaterial
            color="#7659d8"
            transparent
            opacity={
              failed
                ? 0.65
                : 0.08
            }
          />
        </mesh>

        <mesh>
          <circleGeometry
            args={[
              0.22,
              36,
            ]}
          />

          <meshBasicMaterial
            color="#7659d8"
            transparent
            opacity={
              failed
                ? 0.055
                : 0.01
            }
            side={
              THREE.DoubleSide
            }
          />
        </mesh>
      </group>
    </group>
  );
}

function Gate() {
  return (
    <mesh>
      <boxGeometry
        args={[
          0.9,
          2.45,
          0.15,
        ]}
      />

      <meshStandardMaterial
        color="#687067"
        metalness={0.7}
        roughness={0.3}
        transparent
        opacity={0.32}
      />
    </mesh>
  );
}

function FailureBranch({
  origin,
  position,
  failed,
}: {
  origin: [
    number,
    number,
    number,
  ];

  position: [
    number,
    number,
    number,
  ];

  failed: boolean;
}) {
  return (
    <>
      <Line
        points={[
          origin,
          position,
        ]}
        color="#bf514c"
        transparent
        opacity={
          failed
            ? 0.4
            : 0.035
        }
        lineWidth={1}
        dashed
      />

      <mesh
        position={
          position
        }
      >
        <sphereGeometry
          args={[
            0.085,
            20,
            20,
          ]}
        />

        <meshStandardMaterial
          color="#bf514c"
          emissive="#bf514c"
          emissiveIntensity={
            failed
              ? 0.6
              : 0.03
          }
          transparent
          opacity={
            failed
              ? 1
              : 0.16
          }
        />
      </mesh>
    </>
  );
}