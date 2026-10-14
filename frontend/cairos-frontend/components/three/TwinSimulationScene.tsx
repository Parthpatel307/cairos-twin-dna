"use client";

import {
  useMemo,
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

import type {
  Decision,
  RiskLevel,
} from "@/types";

interface TwinSimulationSceneProps {
  loading?: boolean;
  decision?: Decision;
  riskScore?: number;
  riskLevel?: RiskLevel;
}

export default function TwinSimulationScene({
  loading = false,
  decision,
  riskScore,
  riskLevel,
}: TwinSimulationSceneProps) {
  const root =
    useRef<THREE.Group | null>(
      null
    );

  const outerRing =
    useRef<THREE.Mesh | null>(
      null
    );

  const innerRing =
    useRef<THREE.Mesh | null>(
      null
    );

  const verticalRing =
    useRef<THREE.Mesh | null>(
      null
    );

  const scanPlane =
    useRef<THREE.Mesh | null>(
      null
    );

  const packet =
    useRef<THREE.Mesh | null>(
      null
    );

  const core =
    useRef<THREE.Mesh | null>(
      null
    );

  const hasResult =
    typeof riskScore ===
    "number";

  const accent =
    decision === "BLOCK"
      ? "#ff7c7c"
      : decision === "ASK"
        ? "#ffe56b"
        : "#d6ff4f";

  const riskAccent =
    riskLevel ===
    "CRITICAL"
      ? "#ff6b6b"
      : riskLevel ===
          "HIGH"
        ? "#ffe56b"
        : "#d6ff4f";

  const blastVisible =
    hasResult;

  const packetCurve =
    useMemo(
      () =>
        new THREE.CatmullRomCurve3([
          new THREE.Vector3(
            -3.1,
            0.8,
            0.2
          ),

          new THREE.Vector3(
            -1.9,
            1.05,
            0.25
          ),

          new THREE.Vector3(
            -0.8,
            0.55,
            0.15
          ),

          new THREE.Vector3(
            0,
            0.1,
            0
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
          ) * 0.08;
      }

      if (
        outerRing.current
      ) {
        outerRing.current.rotation.z +=
          delta *
          (
            loading
              ? 0.8
              : hasResult
                ? 0.18
                : 0.08
          );
      }

      if (
        innerRing.current
      ) {
        innerRing.current.rotation.z -=
          delta *
          (
            loading
              ? 1.15
              : 0.15
          );
      }

      if (
        verticalRing.current
      ) {
        verticalRing.current.rotation.y +=
          delta *
          (
            loading
              ? 0.55
              : 0.09
          );
      }

      if (
        scanPlane.current
      ) {
        if (loading) {
          scanPlane.current.visible =
            true;

          scanPlane.current.position.y =
            Math.sin(
              time * 2.2
            ) * 1.75;
        } else {
          scanPlane.current.visible =
            false;
        }
      }

      if (
        packet.current
      ) {
        packet.current.visible =
          loading;

        if (loading) {
          const t =
            (
              time *
              0.28
            ) %
            1;

          const point =
            packetCurve.getPoint(
              t
            );

          packet.current.position.copy(
            point
          );
        }
      }

      if (core.current) {
        const scale =
          loading
            ? 1 +
              Math.sin(
                time *
                  3
              ) *
                0.035
            : 1 +
              Math.sin(
                time *
                  1.3
              ) *
                0.012;

        core.current.scale.setScalar(
          scale
        );
      }
    }
  );

  return (
    <group
      ref={root}
      position={[
        0,
        0.05,
        0,
      ]}
    >
      {/* =====================================
          ENVIRONMENT ATMOSPHERE
      ===================================== */}

      <Sparkles
        count={
          loading
            ? 80
            : 45
        }
        scale={[
          8,
          5,
          5,
        ]}
        size={
          loading
            ? 1.5
            : 0.9
        }
        speed={
          loading
            ? 0.65
            : 0.16
        }
        opacity={0.25}
        color="#d6ff4f"
      />

      {/* =====================================
          DIGITAL FLOOR
      ===================================== */}

      <group
        position={[
          0,
          -2.15,
          0,
        ]}
      >
        <mesh
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
            color="#d6ff4f"
            transparent
            opacity={0.015}
            side={
              THREE.DoubleSide
            }
          />
        </mesh>

        <mesh
          rotation={[
            -Math.PI /
              2,
            0,
            0,
          ]}
        >
          <ringGeometry
            args={[
              2.4,
              2.42,
              96,
            ]}
          />

          <meshBasicMaterial
            color={accent}
            transparent
            opacity={0.16}
            side={
              THREE.DoubleSide
            }
          />
        </mesh>

        <mesh
          rotation={[
            -Math.PI /
              2,
            0,
            0,
          ]}
        >
          <ringGeometry
            args={[
              3.2,
              3.21,
              96,
            ]}
          />

          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.05}
            side={
              THREE.DoubleSide
            }
          />
        </mesh>
      </group>

      {/* =====================================
          ORBITS
      ===================================== */}

      <mesh
        ref={outerRing}
        rotation={[
          1.15,
          0.15,
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
            loading
              ? 0.42
              : 0.2
          }
        />
      </mesh>

      <mesh
        ref={innerRing}
        rotation={[
          1.3,
          0.55,
          0.15,
        ]}
      >
        <torusGeometry
          args={[
            1.95,
            0.01,
            12,
            220,
          ]}
        />

        <meshBasicMaterial
          color="#d6b3ff"
          transparent
          opacity={
            loading
              ? 0.28
              : 0.12
          }
        />
      </mesh>

      <mesh
        ref={
          verticalRing
        }
        rotation={[
          0.12,
          1.25,
          0.15,
        ]}
      >
        <torusGeometry
          args={[
            2.15,
            0.009,
            12,
            220,
          ]}
        />

        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.08}
        />
      </mesh>

      {/* =====================================
          CORE
      ===================================== */}

      <Float
        speed={
          loading
            ? 2
            : 1
        }
        rotationIntensity={
          loading
            ? 0.15
            : 0.04
        }
        floatIntensity={
          loading
            ? 0.22
            : 0.09
        }
      >
        <group>
          <mesh
            ref={core}
          >
            <dodecahedronGeometry
              args={[
                0.92,
                2,
              ]}
            />

            <meshStandardMaterial
              color="#10160d"
              emissive={accent}
              emissiveIntensity={
                loading
                  ? 0.85
                  : hasResult
                    ? 0.58
                    : 0.3
              }
              metalness={0.92}
              roughness={0.22}
            />
          </mesh>

          <mesh
            scale={1.045}
          >
            <dodecahedronGeometry
              args={[
                0.92,
                1,
              ]}
            />

            <meshBasicMaterial
              color={accent}
              wireframe
              transparent
              opacity={
                loading
                  ? 0.4
                  : 0.2
              }
            />
          </mesh>

          <mesh
            scale={0.58}
          >
            <icosahedronGeometry
              args={[
                1,
                2,
              ]}
            />

            <meshStandardMaterial
              color={accent}
              emissive={accent}
              emissiveIntensity={2.2}
              transparent
              opacity={0.1}
            />
          </mesh>
        </group>
      </Float>

      {/* =====================================
          SCAN PLANE
      ===================================== */}

      <mesh
        ref={scanPlane}
        position={[
          0,
          0,
          0.7,
        ]}
      >
        <planeGeometry
          args={[
            4.4,
            0.025,
          ]}
        />

        <meshBasicMaterial
          color="#d6ff4f"
          transparent
          opacity={0.8}
          side={
            THREE.DoubleSide
          }
        />
      </mesh>

      {/* =====================================
          AGENT DATA PACKET
      ===================================== */}

      <mesh
        ref={packet}
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
          emissiveIntensity={3}
        />
      </mesh>

      {/* =====================================
          CONNECTION PATH
      ===================================== */}

      <Line
        points={[
          [
            -3.1,
            0.8,
            0.2,
          ],

          [
            -1.9,
            1.05,
            0.25,
          ],

          [
            -0.8,
            0.55,
            0.15,
          ],

          [
            0,
            0.1,
            0,
          ],
        ]}
        color="#d6ff4f"
        transparent
        opacity={
          loading
            ? 0.42
            : 0.1
        }
        lineWidth={1}
        dashed
        dashSize={0.08}
        gapSize={0.09}
      />

      {/* =====================================
          AGENT NODE
      ===================================== */}

      <TwinNode
        position={[
          -3.1,
          0.8,
          0.2,
        ]}
        color="#d6ff4f"
        active={
          loading ||
          hasResult
        }
      />

      {/* TARGET NODE */}

      <TwinNode
        position={[
          3.1,
          0.75,
          -0.1,
        ]}
        color="#ffffff"
        active={false}
      />

      {/* STATE NODE */}

      <TwinNode
        position={[
          -2.1,
          -1.65,
          0.1,
        ]}
        color="#d6ff4f"
        active={
          loading ||
          hasResult
        }
      />

      {/* BLAST NODE */}

      <TwinNode
        position={[
          2.2,
          -1.6,
          0,
        ]}
        color={
          blastVisible
            ? riskAccent
            : "#ffffff"
        }
        active={
          blastVisible
        }
      />

      {/* =====================================
          CONNECTIONS
      ===================================== */}

      <Line
        points={[
          [
            0.6,
            0,
            0,
          ],

          [
            1.8,
            0.35,
            0,
          ],

          [
            3.1,
            0.75,
            -0.1,
          ],
        ]}
        color="#d6ff4f"
        transparent
        opacity={
          loading ||
          hasResult
            ? 0.24
            : 0.06
        }
        lineWidth={1}
        dashed
      />

      <Line
        points={[
          [
            -0.45,
            -0.65,
            0,
          ],

          [
            -1.3,
            -1.15,
            0,
          ],

          [
            -2.1,
            -1.65,
            0.1,
          ],
        ]}
        color="#d6ff4f"
        transparent
        opacity={
          loading ||
          hasResult
            ? 0.26
            : 0.06
        }
        lineWidth={1}
        dashed
      />

      <Line
        points={[
          [
            0.45,
            -0.65,
            0,
          ],

          [
            1.35,
            -1.1,
            0,
          ],

          [
            2.2,
            -1.6,
            0,
          ],
        ]}
        color={
          blastVisible
            ? riskAccent
            : "#ffffff"
        }
        transparent
        opacity={
          blastVisible
            ? 0.36
            : 0.05
        }
        lineWidth={1}
        dashed
      />

      {/* =====================================
          BLAST PULSES
      ===================================== */}

      {blastVisible && (
        <>
          <BlastRing
            color={
              riskAccent
            }
            scale={1.55}
            speed={1.4}
          />

          <BlastRing
            color={
              riskAccent
            }
            scale={2.05}
            speed={1.8}
          />

          <BlastRing
            color={
              riskAccent
            }
            scale={2.55}
            speed={2.2}
          />
        </>
      )}
    </group>
  );
}

function TwinNode({
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
            active
              ? 0.13
              : 0.095,
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
              : 0.3
          }
          metalness={0.5}
          roughness={0.2}
        />
      </mesh>

      {active && (
        <mesh
          scale={2.6}
        >
          <sphereGeometry
            args={[
              0.13,
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

function BlastRing({
  color,
  scale,
  speed,
}: {
  color: string;
  scale: number;
  speed: number;
}) {
  const ring =
    useRef<THREE.Mesh | null>(
      null
    );

  useFrame(
    (
      state
    ) => {
      if (!ring.current) {
        return;
      }

      const pulse =
        1 +
        Math.sin(
          state.clock
            .elapsedTime *
            speed
        ) *
          0.05;

      ring.current.scale.setScalar(
        scale *
          pulse
      );
    }
  );

  return (
    <mesh
      ref={ring}
      rotation={[
        Math.PI /
          2,
        0,
        0,
      ]}
    >
      <torusGeometry
        args={[
          1,
          0.008,
          8,
          160,
        ]}
      />

      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.08}
      />
    </mesh>
  );
}