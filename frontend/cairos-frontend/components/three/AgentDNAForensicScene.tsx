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
} from "@react-three/fiber";

import {
  useReducedMotion,
} from "framer-motion";

import * as THREE from "three";

interface AgentDNAForensicSceneProps {
  activeStep: number;
  replayComplete: boolean;
}

export default function AgentDNAForensicScene({
  activeStep,
  replayComplete,
}: AgentDNAForensicSceneProps) {
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

  const rootCause =
    useRef<THREE.Group | null>(
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

  const packetProgress =
    useRef(0);

  const observedPath =
    useMemo(
      () =>
        new THREE.CatmullRomCurve3(
          [
            new THREE.Vector3(
              -2.8,
              1.25,
              0.2
            ),

            new THREE.Vector3(
              -1.55,
              0.9,
              0.2
            ),

            new THREE.Vector3(
              -0.25,
              0.18,
              0.3
            ),

            new THREE.Vector3(
              1.05,
              -0.32,
              0.18
            ),

            new THREE.Vector3(
              2.1,
              -0.95,
              0.1
            ),

            new THREE.Vector3(
              2.95,
              -1.35,
              0.05
            ),
          ],
          false,
          "catmullrom",
          0.5
        ),
      []
    );

  const targetProgress =
    Math.min(
      1,
      activeStep / 6
    );

  useFrame(
    (
      frame,
      delta
    ) => {
      const time =
        frame.clock
          .elapsedTime;

      packetProgress.current =
        THREE.MathUtils.lerp(
          packetProgress.current,
          targetProgress,
          Math.min(
            1,
            delta * 2.2
          )
        );

      if (packet.current) {
        packet.current.position.copy(
          observedPath.getPoint(
            packetProgress.current
          )
        );

        packet.current.visible =
          activeStep >
          0;

        if (
          !reduceMotion
        ) {
          packet.current.rotation.x +=
            delta * 0.55;

          packet.current.rotation.y +=
            delta * 0.8;
        }
      }

      if (
        !reduceMotion &&
        root.current
      ) {
        root.current.position.y =
          Math.sin(
            time * 0.34
          ) * 0.022;

        root.current.rotation.y =
          Math.sin(
            time * 0.1
          ) * 0.025;
      }

      if (
        !reduceMotion &&
        rootCause.current
      ) {
        const pulse =
          activeStep >=
          3
            ? 1 +
              Math.sin(
                time * 2.4
              ) *
                0.045
            : 1;

        rootCause.current.scale.setScalar(
          pulse
        );
      }

      if (
        !reduceMotion &&
        ringOne.current
      ) {
        ringOne.current.rotation.z +=
          delta * 0.025;
      }

      if (
        !reduceMotion &&
        ringTwo.current
      ) {
        ringTwo.current.rotation.z -=
          delta * 0.018;
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
          OBSERVED EXECUTION PATH
      ===================================== */}

      <Line
        points={[
          [
            -2.8,
            1.25,
            0.2,
          ],
          [
            -1.55,
            0.9,
            0.2,
          ],
          [
            -0.25,
            0.18,
            0.3,
          ],
          [
            1.05,
            -0.32,
            0.18,
          ],
          [
            2.1,
            -0.95,
            0.1,
          ],
          [
            2.95,
            -1.35,
            0.05,
          ],
        ]}
        color="#7659d8"
        transparent
        opacity={0.23}
        lineWidth={1}
        dashed
        dashSize={0.08}
        gapSize={0.09}
      />

      {/* =====================================
          NODE 01 — INTENT
      ===================================== */}

      <ForensicNode
        position={[
          -2.8,
          1.25,
          0.2,
        ]}
        color="#8fb52d"
        active={
          activeStep >=
          1
        }
      />

      {/* =====================================
          NODE 02 — PLAN
      ===================================== */}

      <ForensicNode
        position={[
          -1.55,
          0.9,
          0.2,
        ]}
        color="#8fb52d"
        active={
          activeStep >=
          2
        }
      />

      {/* =====================================
          NODE 03 — ROOT CAUSE
      ===================================== */}

      <group
        ref={rootCause}
        position={[
          -0.25,
          0.18,
          0.3,
        ]}
      >
        <mesh>
          <octahedronGeometry
            args={[
              0.38,
              2,
            ]}
          />

          <meshStandardMaterial
            color="#312744"
            emissive="#7659d8"
            emissiveIntensity={
              activeStep >=
              3
                ? 0.52
                : 0.08
            }
            metalness={0.86}
            roughness={0.2}
          />
        </mesh>

        <mesh
          scale={1.12}
        >
          <octahedronGeometry
            args={[
              0.38,
              1,
            ]}
          />

          <meshBasicMaterial
            color="#7659d8"
            wireframe
            transparent
            opacity={
              activeStep >=
              3
                ? 0.48
                : 0.1
            }
          />
        </mesh>

        <mesh
          ref={ringOne}
          rotation={[
            Math.PI /
              2,
            0,
            0,
          ]}
        >
          <torusGeometry
            args={[
              0.65,
              0.012,
              10,
              80,
            ]}
          />

          <meshBasicMaterial
            color="#7659d8"
            transparent
            opacity={
              activeStep >=
              3
                ? 0.28
                : 0.04
            }
          />
        </mesh>

        <mesh
          ref={ringTwo}
          rotation={[
            1.15,
            0.4,
            0,
          ]}
        >
          <torusGeometry
            args={[
              0.85,
              0.008,
              8,
              80,
            ]}
          />

          <meshBasicMaterial
            color="#7659d8"
            transparent
            opacity={
              activeStep >=
              3
                ? 0.14
                : 0.025
            }
          />
        </mesh>
      </group>

      {/* =====================================
          NODE 04 — HUMAN APPROVAL
      ===================================== */}

      <ForensicNode
        position={[
          1.05,
          -0.32,
          0.18,
        ]}
        color="#c5a349"
        active={
          activeStep >=
          4
        }
      />

      {/* =====================================
          NODE 05 — DELETE ACTION
      ===================================== */}

      <ForensicNode
        position={[
          2.1,
          -0.95,
          0.1,
        ]}
        color="#b78338"
        active={
          activeStep >=
          5
        }
      />

      {/* =====================================
          NODE 06 — FAILURE
      ===================================== */}

      <ForensicNode
        position={[
          2.95,
          -1.35,
          0.05,
        ]}
        color="#bf514c"
        active={
          activeStep >=
          6
        }
        large
      />

      {/* =====================================
          REPLAY PACKET
      ===================================== */}

      <mesh
        ref={packet}
        visible={false}
      >
        <octahedronGeometry
          args={[
            0.085,
            1,
          ]}
        />

        <meshStandardMaterial
          color="#7659d8"
          emissive="#7659d8"
          emissiveIntensity={0.85}
          metalness={0.55}
          roughness={0.16}
        />
      </mesh>

      {/* =====================================
          COUNTERFACTUAL BRANCH
      ===================================== */}

      <Line
        points={[
          [
            -0.25,
            0.18,
            0.3,
          ],
          [
            -0.45,
            -0.7,
            0.22,
          ],
          [
            -1.35,
            -1.35,
            0.14,
          ],
          [
            -2.5,
            -1.55,
            0.08,
          ],
        ]}
        color="#8fb52d"
        transparent
        opacity={
          replayComplete
            ? 0.46
            : 0.025
        }
        lineWidth={1}
        dashed
      />

      <ForensicNode
        position={[
          -2.5,
          -1.55,
          0.08,
        ]}
        color="#8fb52d"
        active={
          replayComplete
        }
        large
      />
    </group>
  );
}

function ForensicNode({
  position,
  color,
  active,
  large = false,
}: {
  position: [
    number,
    number,
    number,
  ];

  color: string;

  active: boolean;

  large?: boolean;
}) {
  const size =
    large
      ? 0.12
      : 0.085;

  return (
    <group
      position={
        position
      }
    >
      <mesh>
        <sphereGeometry
          args={[
            size,
            22,
            22,
          ]}
        />

        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={
            active
              ? 0.72
              : 0.04
          }
          metalness={0.48}
          roughness={0.18}
          transparent
          opacity={
            active
              ? 1
              : 0.25
          }
        />
      </mesh>

      {active && (
        <mesh
          scale={2.4}
        >
          <sphereGeometry
            args={[
              size,
              18,
              18,
            ]}
          />

          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.03}
          />
        </mesh>
      )}
    </group>
  );
}