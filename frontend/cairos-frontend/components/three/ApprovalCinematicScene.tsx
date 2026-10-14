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

export type ApprovalSceneState =
  | "PENDING"
  | "APPROVED"
  | "DENIED"
  | "LOCKED";

interface ApprovalCinematicSceneProps {
  state: ApprovalSceneState;
  canDecide: boolean;
}

export default function ApprovalCinematicScene({
  state,
  canDecide,
}: ApprovalCinematicSceneProps) {
  const reduceMotion =
    useReducedMotion();

  const root =
    useRef<THREE.Group | null>(
      null
    );

  const outerSeal =
    useRef<THREE.Mesh | null>(
      null
    );

  const innerSeal =
    useRef<THREE.Mesh | null>(
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

  const authorityNode =
    useRef<THREE.Mesh | null>(
      null
    );

  useFrame(
    (
      stateFrame,
      delta
    ) => {
      const time =
        stateFrame.clock
          .elapsedTime;

      if (reduceMotion) {
        return;
      }

      if (root.current) {
        root.current.position.y =
          Math.sin(
            time * 0.36
          ) * 0.025;
      }

      if (outerSeal.current) {
        outerSeal.current.rotation.z +=
          delta *
          (
            state ===
            "PENDING"
              ? 0.035
              : 0.015
          );
      }

      if (innerSeal.current) {
        innerSeal.current.rotation.z -=
          delta *
          (
            state ===
            "PENDING"
              ? 0.05
              : 0.02
          );
      }

      const open =
        state ===
        "APPROVED";

      const denied =
        state ===
        "DENIED";

      if (leftGate.current) {
        leftGate.current.position.x =
          THREE.MathUtils.lerp(
            leftGate.current.position.x,
            open
              ? -1.48
              : -0.78,
            Math.min(
              1,
              delta * 2.8
            )
          );

        leftGate.current.rotation.y =
          THREE.MathUtils.lerp(
            leftGate.current.rotation.y,
            open
              ? -0.28
              : 0,
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
            open
              ? 1.48
              : 0.78,
            Math.min(
              1,
              delta * 2.8
            )
          );

        rightGate.current.rotation.y =
          THREE.MathUtils.lerp(
            rightGate.current.rotation.y,
            open
              ? 0.28
              : 0,
            Math.min(
              1,
              delta * 2.8
            )
          );
      }

      if (authorityNode.current) {
        const pulse =
          state ===
          "PENDING" &&
          canDecide
            ? 1 +
              Math.sin(
                time * 2.3
              ) * 0.07
            : 1;

        authorityNode.current.scale.setScalar(
          pulse
        );

        const material =
          authorityNode.current
            .material as THREE.MeshStandardMaterial;

        material.emissiveIntensity =
          denied
            ? 0.45
            : state ===
                "APPROVED"
              ? 0.8
              : canDecide
                ? 0.45
                : 0.12;
      }
    }
  );

  const accent =
    state ===
    "APPROVED"
      ? "#8fb52d"
      : state ===
          "DENIED"
        ? "#bf514c"
        : "#c5a349";

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
          CAIROS EVIDENCE INPUT
      ===================================== */}

      <group
        position={[
          -2.7,
          0.85,
          0.1,
        ]}
      >
        <mesh>
          <boxGeometry
            args={[
              0.52,
              0.34,
              0.12,
            ]}
          />

          <meshStandardMaterial
            color="#6a7166"
            metalness={0.68}
            roughness={0.3}
            transparent
            opacity={0.66}
          />
        </mesh>

        <mesh
          position={[
            0,
            0,
            0.08,
          ]}
        >
          <circleGeometry
            args={[
              0.045,
              18,
            ]}
          />

          <meshBasicMaterial
            color="#c5a349"
          />
        </mesh>
      </group>

      <Line
        points={[
          [
            -2.45,
            0.85,
            0.1,
          ],
          [
            -1.6,
            0.55,
            0.12,
          ],
          [
            -0.85,
            0.25,
            0.16,
          ],
          [
            0,
            0,
            0.22,
          ],
        ]}
        color="#b19540"
        transparent
        opacity={0.3}
        lineWidth={1}
        dashed
        dashSize={0.08}
        gapSize={0.08}
      />

      {/* =====================================
          HUMAN AUTHORITY SEAL
      ===================================== */}

      <group>
        <mesh
          ref={outerSeal}
          rotation={[
            0,
            0,
            0,
          ]}
        >
          <torusGeometry
            args={[
              1.25,
              0.035,
              14,
              110,
            ]}
          />

          <meshStandardMaterial
            color={accent}
            emissive={accent}
            emissiveIntensity={0.12}
            metalness={0.82}
            roughness={0.23}
          />
        </mesh>

        <mesh
          ref={innerSeal}
          rotation={[
            0,
            0,
            0,
          ]}
        >
          <torusGeometry
            args={[
              0.93,
              0.015,
              12,
              100,
            ]}
          />

          <meshBasicMaterial
            color="#8d7f50"
            transparent
            opacity={0.28}
          />
        </mesh>

        <mesh
          ref={authorityNode}
          position={[
            0,
            0,
            0.12,
          ]}
        >
          <octahedronGeometry
            args={[
              0.32,
              2,
            ]}
          />

          <meshStandardMaterial
            color={accent}
            emissive={accent}
            emissiveIntensity={0.4}
            metalness={0.72}
            roughness={0.2}
          />
        </mesh>

        <mesh
          position={[
            0,
            0,
            -0.05,
          ]}
        >
          <circleGeometry
            args={[
              0.7,
              48,
            ]}
          />

          <meshBasicMaterial
            color={accent}
            transparent
            opacity={0.035}
            side={
              THREE.DoubleSide
            }
          />
        </mesh>
      </group>

      {/* =====================================
          EXECUTION GATE
      ===================================== */}

      <group
        position={[
          0,
          -0.2,
          -0.28,
        ]}
      >
        <group
          ref={leftGate}
          position={[
            -0.78,
            0,
            0,
          ]}
        >
          <GatePlate />
        </group>

        <group
          ref={rightGate}
          position={[
            0.78,
            0,
            0,
          ]}
        >
          <GatePlate />
        </group>
      </group>

      {/* =====================================
          EXECUTION OUTPUT PATH
      ===================================== */}

      <Line
        points={[
          [
            0,
            -0.1,
            -0.1,
          ],
          [
            1.1,
            -0.45,
            -0.05,
          ],
          [
            2.2,
            -0.7,
            0.05,
          ],
          [
            3,
            -0.55,
            0.1,
          ],
        ]}
        color={accent}
        transparent
        opacity={
          state ===
          "APPROVED"
            ? 0.48
            : 0.06
        }
        lineWidth={1}
        dashed
      />

      <mesh
        position={[
          3,
          -0.55,
          0.1,
        ]}
      >
        <sphereGeometry
          args={[
            0.085,
            20,
            20,
          ]}
        />

        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={
            state ===
            "APPROVED"
              ? 0.65
              : 0.05
          }
          transparent
          opacity={
            state ===
            "APPROVED"
              ? 1
              : 0.2
          }
        />
      </mesh>

      {/* =====================================
          DENIAL BOUNDARY
      ===================================== */}

      {state ===
        "DENIED" && (
        <>
          <Line
            points={[
              [
                -0.5,
                -0.5,
                0.42,
              ],
              [
                0.5,
                0.5,
                0.42,
              ],
            ]}
            color="#bf514c"
            transparent
            opacity={0.72}
            lineWidth={2}
          />

          <Line
            points={[
              [
                -0.5,
                0.5,
                0.42,
              ],
              [
                0.5,
                -0.5,
                0.42,
              ],
            ]}
            color="#bf514c"
            transparent
            opacity={0.72}
            lineWidth={2}
          />
        </>
      )}

      {/* =====================================
          AUTHORITY LOCKED
      ===================================== */}

      {state ===
        "LOCKED" && (
        <mesh
          position={[
            0,
            0,
            0.48,
          ]}
        >
          <ringGeometry
            args={[
              0.4,
              0.5,
              36,
            ]}
          />

          <meshBasicMaterial
            color="#656b62"
            transparent
            opacity={0.3}
            side={
              THREE.DoubleSide
            }
          />
        </mesh>
      )}
    </group>
  );
}

function GatePlate() {
  return (
    <mesh>
      <boxGeometry
        args={[
          1.18,
          2.35,
          0.16,
        ]}
      />

      <meshStandardMaterial
        color="#687067"
        metalness={0.68}
        roughness={0.32}
        transparent
        opacity={0.35}
      />
    </mesh>
  );
}