"use client";

import {
  useRef,
} from "react";

import {
  Float,
  Line,
  Sparkles,
} from "@react-three/drei";

import {
  useFrame,
} from "@react-three/fiber";

import * as THREE from "three";

export type ApprovalSceneState =
  | "PENDING"
  | "PROCESSING"
  | "APPROVED"
  | "DENIED";

interface ApprovalSceneProps {
  state: ApprovalSceneState;
  canAuthorize: boolean;
}

export default function ApprovalScene({
  state,
  canAuthorize,
}: ApprovalSceneProps) {
  const root =
    useRef<THREE.Group | null>(
      null
    );

  const outerRing =
    useRef<THREE.Mesh | null>(
      null
    );

  const middleRing =
    useRef<THREE.Mesh | null>(
      null
    );

  const innerRing =
    useRef<THREE.Mesh | null>(
      null
    );

  const core =
    useRef<THREE.Mesh | null>(
      null
    );

  const releasePacket =
    useRef<THREE.Mesh | null>(
      null
    );

  const scan =
    useRef<THREE.Mesh | null>(
      null
    );

  const approved =
    state ===
    "APPROVED";

  const denied =
    state ===
    "DENIED";

  const processing =
    state ===
    "PROCESSING";

  const accent =
    denied
      ? "#ff7f7f"
      : approved
        ? "#d6ff4f"
        : canAuthorize
          ? "#ffe56b"
          : "#858585";

  useFrame(
    (
      stateFrame,
      delta
    ) => {
      const time =
        stateFrame.clock
          .elapsedTime;

      if (root.current) {
        root.current.rotation.y =
          Math.sin(
            time * 0.18
          ) * 0.07;
      }

      if (outerRing.current) {
        outerRing.current.rotation.z +=
          delta *
          (
            processing
              ? 1.15
              : approved
                ? 0.28
                : denied
                  ? -0.08
                  : 0.11
          );
      }

      if (middleRing.current) {
        middleRing.current.rotation.z -=
          delta *
          (
            processing
              ? 1.5
              : approved
                ? 0.19
                : 0.08
          );
      }

      if (innerRing.current) {
        innerRing.current.rotation.y +=
          delta *
          (
            processing
              ? 0.95
              : approved
                ? 0.22
                : 0.09
          );
      }

      if (core.current) {
        const pulse =
          approved
            ? 1 +
              Math.sin(
                time * 2.5
              ) *
                0.025
            : processing
              ? 1 +
                Math.sin(
                  time * 5
                ) *
                  0.055
              : denied
                ? 0.92
              : 1 +
                Math.sin(
                  time * 1.5
                ) *
                  0.015;

        core.current.scale.setScalar(
          pulse
        );

        if (
          processing
        ) {
          core.current.rotation.y +=
            delta * 0.6;
        }
      }

      if (scan.current) {
        scan.current.visible =
          processing;

        if (
          processing
        ) {
          scan.current.position.y =
            Math.sin(
              time * 3.2
            ) * 1.5;
        }
      }

      if (
        releasePacket.current
      ) {
        releasePacket.current.visible =
          approved;

        if (
          approved
        ) {
          const progress =
            (
              time *
              0.34
            ) %
            1;

          releasePacket.current.position.set(
            progress *
              4.4,
            Math.sin(
              progress *
                Math.PI
            ) *
              0.28,
            0
          );
        }
      }
    }
  );

  return (
    <group
      ref={root}
      position={[
        0,
        0.1,
        0,
      ]}
    >
      {/* =====================================
          ENVIRONMENT
      ===================================== */}

      <pointLight
        position={[
          0,
          0,
          2,
        ]}
        intensity={
          processing
            ? 38
            : approved
              ? 28
              : denied
                ? 18
                : 22
        }
        distance={8}
        color={accent}
      />

      <Sparkles
        count={
          processing
            ? 85
            : approved
              ? 70
              : 45
        }
        scale={[
          8,
          5,
          4,
        ]}
        size={
          processing
            ? 1.4
            : 1
        }
        speed={
          processing
            ? 0.65
            : 0.18
        }
        opacity={0.24}
        color={accent}
      />

      {/* FLOOR */}

      <mesh
        position={[
          0,
          -2.15,
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
            3.8,
            96,
          ]}
        />

        <meshBasicMaterial
          color={accent}
          transparent
          opacity={0.015}
          side={
            THREE.DoubleSide
          }
        />
      </mesh>

      <mesh
        position={[
          0,
          -2.14,
          0,
        ]}
        rotation={[
          -Math.PI /
            2,
          0,
          0,
        ]}
      >
        <ringGeometry
          args={[
            2.6,
            2.62,
            96,
          ]}
        />

        <meshBasicMaterial
          color={accent}
          transparent
          opacity={0.14}
          side={
            THREE.DoubleSide
          }
        />
      </mesh>

      {/* =====================================
          AUTHORIZATION RINGS
      ===================================== */}

      <mesh
        ref={outerRing}
        rotation={[
          1.14,
          0,
          0,
        ]}
      >
        <torusGeometry
          args={[
            2.55,
            0.014,
            12,
            220,
          ]}
        />

        <meshBasicMaterial
          color={accent}
          transparent
          opacity={
            processing
              ? 0.48
              : approved
                ? 0.35
                : 0.2
          }
        />
      </mesh>

      <mesh
        ref={middleRing}
        rotation={[
          1.28,
          0.42,
          0.18,
        ]}
      >
        <torusGeometry
          args={[
            2,
            0.011,
            12,
            220,
          ]}
        />

        <meshBasicMaterial
          color={
            approved
              ? "#d6ff4f"
              : "#ffffff"
          }
          transparent
          opacity={
            processing
              ? 0.3
              : 0.11
          }
        />
      </mesh>

      <mesh
        ref={innerRing}
        rotation={[
          0.1,
          1.28,
          0.12,
        ]}
      >
        <torusGeometry
          args={[
            1.72,
            0.01,
            12,
            220,
          ]}
        />

        <meshBasicMaterial
          color={
            denied
              ? "#ff7f7f"
              : "#d6b3ff"
          }
          transparent
          opacity={
            processing
              ? 0.32
              : 0.13
          }
        />
      </mesh>

      {/* =====================================
          IDENTITY NODE
      ===================================== */}

      <AuthorizationNode
        position={[
          -3.2,
          0.6,
          0.1,
        ]}
        color={
          canAuthorize
            ? "#ffe56b"
            : "#6c6c6c"
        }
        active={
          canAuthorize
        }
      />

      <Line
        points={[
          [
            -3.2,
            0.6,
            0.1,
          ],
          [
            -1.8,
            0.45,
            0.05,
          ],
          [
            -0.75,
            0.12,
            0,
          ],
        ]}
        color={
          canAuthorize
            ? "#ffe56b"
            : "#6c6c6c"
        }
        transparent
        opacity={
          canAuthorize
            ? 0.32
            : 0.1
        }
        lineWidth={1}
        dashed
      />

      {/* =====================================
          EXECUTION GATE NODE
      ===================================== */}

      <AuthorizationNode
        position={[
          3.2,
          0.55,
          -0.05,
        ]}
        color={
          approved
            ? "#d6ff4f"
            : denied
              ? "#ff7f7f"
              : "#ffffff"
        }
        active={
          approved ||
          denied
        }
      />

      <Line
        points={[
          [
            0.72,
            0.1,
            0,
          ],
          [
            1.8,
            0.4,
            0,
          ],
          [
            3.2,
            0.55,
            -0.05,
          ],
        ]}
        color={
          approved
            ? "#d6ff4f"
            : denied
              ? "#ff7f7f"
              : "#ffffff"
        }
        transparent
        opacity={
          approved
            ? 0.4
            : denied
              ? 0.25
              : 0.08
        }
        lineWidth={1}
        dashed
      />

      {/* =====================================
          CENTER SEAL
      ===================================== */}

      <Float
        speed={
          processing
            ? 2
            : 0.9
        }
        rotationIntensity={
          processing
            ? 0.12
            : 0.03
        }
        floatIntensity={
          processing
            ? 0.18
            : 0.08
        }
      >
        <group>
          <mesh
            ref={core}
          >
            <cylinderGeometry
              args={[
                0.95,
                0.95,
                0.34,
                64,
              ]}
            />

            <meshStandardMaterial
              color="#11120d"
              emissive={accent}
              emissiveIntensity={
                processing
                  ? 1.25
                  : approved
                    ? 0.8
                    : denied
                      ? 0.55
                      : 0.42
              }
              metalness={0.94}
              roughness={0.2}
            />
          </mesh>

          <mesh
            rotation={[
              Math.PI /
                2,
              0,
              0,
            ]}
            position={[
              0,
              0.18,
              0,
            ]}
          >
            <ringGeometry
              args={[
                0.57,
                0.74,
                64,
              ]}
            />

            <meshStandardMaterial
              color={accent}
              emissive={accent}
              emissiveIntensity={2}
              metalness={0.55}
              roughness={0.2}
            />
          </mesh>

          <mesh
            rotation={[
              Math.PI /
                2,
              0,
              0,
            ]}
            position={[
              0,
              0.19,
              0,
            ]}
          >
            <circleGeometry
              args={[
                0.42,
                64,
              ]}
            />

            <meshBasicMaterial
              color={accent}
              transparent
              opacity={
                processing
                  ? 0.3
                  : approved
                    ? 0.2
                    : 0.1
              }
            />
          </mesh>
        </group>
      </Float>

      {/* =====================================
          PROCESSING SCAN
      ===================================== */}

      <mesh
        ref={scan}
        position={[
          0,
          0,
          0.9,
        ]}
      >
        <planeGeometry
          args={[
            4.5,
            0.028,
          ]}
        />

        <meshBasicMaterial
          color="#ffe56b"
          transparent
          opacity={0.85}
          side={
            THREE.DoubleSide
          }
        />
      </mesh>

      {/* =====================================
          APPROVAL RELEASE PACKET
      ===================================== */}

      <mesh
        ref={
          releasePacket
        }
      >
        <sphereGeometry
          args={[
            0.09,
            24,
            24,
          ]}
        />

        <meshStandardMaterial
          color="#d6ff4f"
          emissive="#d6ff4f"
          emissiveIntensity={3.5}
        />
      </mesh>

      {/* =====================================
          APPROVED WAVE
      ===================================== */}

      {approved && (
        <>
          <ApprovalPulse
            color="#d6ff4f"
            delay={0}
          />

          <ApprovalPulse
            color="#d6ff4f"
            delay={0.4}
          />
        </>
      )}

      {/* =====================================
          DENIED WAVE
      ===================================== */}

      {denied && (
        <ApprovalPulse
          color="#ff7f7f"
          delay={0}
        />
      )}
    </group>
  );
}

function AuthorizationNode({
  position,
  color,
  active,
}: {
  position: [
    number,
    number,
    number,
  ];

  color: string;

  active: boolean;
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
          emissiveIntensity={
            active
              ? 2.5
              : 0.35
          }
          metalness={0.5}
          roughness={0.18}
        />
      </mesh>

      {active && (
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
            opacity={0.05}
          />
        </mesh>
      )}
    </group>
  );
}

function ApprovalPulse({
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

      const progress =
        (
          state.clock
            .elapsedTime *
            0.35 +
          delay
        ) %
        1;

      const scale =
        0.8 +
        progress *
          2.5;

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
          progress
        ) *
        0.15;
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