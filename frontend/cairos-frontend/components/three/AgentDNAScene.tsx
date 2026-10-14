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

interface AgentDNASceneProps {
  activeStep: number;
  replaying: boolean;
  replayComplete: boolean;
  rootCauseStep?: number;
}

export default function AgentDNAScene({
  activeStep,
  replaying,
  replayComplete,
  rootCauseStep = 3,
}: AgentDNASceneProps) {
  const root =
    useRef<THREE.Group | null>(
      null
    );

  const packet =
    useRef<THREE.Mesh | null>(
      null
    );

  const rootCore =
    useRef<THREE.Mesh | null>(
      null
    );

  const forensicRingOne =
    useRef<THREE.Mesh | null>(
      null
    );

  const forensicRingTwo =
    useRef<THREE.Mesh | null>(
      null
    );

  const packetProgress =
    useRef(0);

  const causalPath =
    useMemo(
      () =>
        new THREE.CatmullRomCurve3([
          new THREE.Vector3(
            -3.25,
            1.45,
            0.8
          ),

          new THREE.Vector3(
            -1.9,
            1,
            0.45
          ),

          new THREE.Vector3(
            0,
            0.25,
            0
          ),

          new THREE.Vector3(
            1.55,
            -0.45,
            -0.2
          ),

          new THREE.Vector3(
            2.85,
            -1.15,
            -0.7
          ),

          new THREE.Vector3(
            0.9,
            -2.05,
            -1.1
          ),
        ]),
      []
    );

  const safePath =
    useMemo(
      () =>
        new THREE.CatmullRomCurve3([
          new THREE.Vector3(
            0,
            0.25,
            0
          ),

          new THREE.Vector3(
            -0.4,
            -0.6,
            0.2
          ),

          new THREE.Vector3(
            -1.4,
            -1.35,
            0.3
          ),

          new THREE.Vector3(
            -2.65,
            -2.05,
            0.2
          ),
        ]),
      []
    );

  const targetProgress =
    activeStep <= 0
      ? 0
      : Math.min(
          1,
          activeStep /
            6
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
            time *
              0.16
          ) *
          0.07;

        root.current.rotation.x =
          Math.sin(
            time *
              0.11
          ) *
          0.018;
      }

      packetProgress.current =
        THREE.MathUtils.lerp(
          packetProgress.current,
          targetProgress,
          Math.min(
            1,
            delta *
              2
          )
        );

      if (packet.current) {
        const point =
          causalPath.getPoint(
            packetProgress.current
          );

        packet.current.position.copy(
          point
        );

        packet.current.visible =
          activeStep >
          0;

        const pulse =
          1 +
          Math.sin(
            time *
              5.5
          ) *
            0.14;

        packet.current.scale.setScalar(
          pulse
        );
      }

      if (rootCore.current) {
        rootCore.current.rotation.x +=
          delta *
          (
            activeStep >=
            rootCauseStep
              ? 0.4
              : 0.08
          );

        rootCore.current.rotation.y +=
          delta *
          (
            activeStep >=
            rootCauseStep
              ? 0.65
              : 0.12
          );

        const pulse =
          activeStep >=
          rootCauseStep
            ? 1 +
              Math.sin(
                time *
                  3.2
              ) *
                0.06
            : 1;

        rootCore.current.scale.setScalar(
          pulse
        );
      }

      if (
        forensicRingOne.current
      ) {
        forensicRingOne.current.rotation.z +=
          delta *
          (
            replaying
              ? 0.55
              : 0.12
          );
      }

      if (
        forensicRingTwo.current
      ) {
        forensicRingTwo.current.rotation.z -=
          delta *
          (
            replaying
              ? 0.78
              : 0.16
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
          FORENSIC ATMOSPHERE
      ===================================== */}

      <pointLight
        position={[
          0,
          1,
          3,
        ]}
        intensity={18}
        distance={8}
        color="#c89cff"
      />

      <pointLight
        position={[
          2.5,
          -1,
          -1,
        ]}
        intensity={
          activeStep >=
          5
            ? 24
            : 7
        }
        distance={7}
        color="#ff7474"
      />

      <pointLight
        position={[
          -2.5,
          -1.5,
          0,
        ]}
        intensity={
          replayComplete
            ? 18
            : 5
        }
        distance={6}
        color="#d6ff4f"
      />

      <Sparkles
        count={
          replaying
            ? 110
            : 65
        }
        scale={[
          8,
          5,
          6,
        ]}
        size={
          replaying
            ? 1.25
            : 0.9
        }
        speed={
          replaying
            ? 0.42
            : 0.14
        }
        opacity={0.24}
        color="#c89cff"
      />

      {/* =====================================
          FORENSIC ORBITS
      ===================================== */}

      <mesh
        ref={
          forensicRingOne
        }
        rotation={[
          1.15,
          0.08,
          0,
        ]}
      >
        <torusGeometry
          args={[
            2.4,
            0.01,
            10,
            220,
          ]}
        />

        <meshBasicMaterial
          color="#c89cff"
          transparent
          opacity={
            replaying
              ? 0.25
              : 0.11
          }
        />
      </mesh>

      <mesh
        ref={
          forensicRingTwo
        }
        rotation={[
          1.27,
          0.4,
          0.22,
        ]}
      >
        <torusGeometry
          args={[
            3.15,
            0.008,
            10,
            220,
          ]}
        />

        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.05}
        />
      </mesh>

      {/* =====================================
          OBSERVED CAUSAL PATH
      ===================================== */}

      <Line
        points={[
          [
            -3.25,
            1.45,
            0.8,
          ],

          [
            -1.9,
            1,
            0.45,
          ],

          [
            0,
            0.25,
            0,
          ],

          [
            1.55,
            -0.45,
            -0.2,
          ],

          [
            2.85,
            -1.15,
            -0.7,
          ],

          [
            0.9,
            -2.05,
            -1.1,
          ],
        ]}
        color="#c89cff"
        transparent
        opacity={0.3}
        lineWidth={1.15}
        dashed
        dashSize={0.08}
        gapSize={0.075}
      />

      {/* INTENT */}

      <ForensicNode
        position={[
          -3.25,
          1.45,
          0.8,
        ]}
        color="#d6ff4f"
        active={
          activeStep >=
          1
        }
        size={0.12}
      />

      {/* PLAN */}

      <ForensicNode
        position={[
          -1.9,
          1,
          0.45,
        ]}
        color="#d6ff4f"
        active={
          activeStep >=
          2
        }
        size={0.12}
      />

      {/* =====================================
          ROOT CAUSE CORE
      ===================================== */}

      <Float
        speed={1.1}
        rotationIntensity={0.05}
        floatIntensity={0.08}
      >
        <group
          position={[
            0,
            0.25,
            0,
          ]}
        >
          <mesh
            ref={
              rootCore
            }
          >
            <icosahedronGeometry
              args={[
                0.48,
                3,
              ]}
            />

            <meshStandardMaterial
              color="#17101d"
              emissive="#c89cff"
              emissiveIntensity={
                activeStep >=
                rootCauseStep
                  ? 1.7
                  : 0.45
              }
              metalness={0.88}
              roughness={0.18}
            />
          </mesh>

          <mesh
            scale={1.08}
          >
            <icosahedronGeometry
              args={[
                0.48,
                1,
              ]}
            />

            <meshBasicMaterial
              color="#d6b3ff"
              wireframe
              transparent
              opacity={
                activeStep >=
                rootCauseStep
                  ? 0.55
                  : 0.18
              }
            />
          </mesh>

          {activeStep >=
            rootCauseStep && (
            <>
              <RootPulse
                delay={0}
              />

              <RootPulse
                delay={0.45}
              />
            </>
          )}
        </group>
      </Float>

      {/* APPROVAL */}

      <ForensicNode
        position={[
          1.55,
          -0.45,
          -0.2,
        ]}
        color="#ffe56b"
        active={
          activeStep >=
          4
        }
        size={0.13}
      />

      {/* DELETE */}

      <ForensicNode
        position={[
          2.85,
          -1.15,
          -0.7,
        ]}
        color="#ff8a8a"
        active={
          activeStep >=
          5
        }
        size={0.13}
      />

      {/* FAILURE */}

      <ForensicNode
        position={[
          0.9,
          -2.05,
          -1.1,
        ]}
        color="#ff6969"
        active={
          activeStep >=
          6
        }
        size={0.17}
      />

      {/* =====================================
          REPLAY PACKET
      ===================================== */}

      <mesh ref={packet}>
        <sphereGeometry
          args={[
            0.085,
            24,
            24,
          ]}
        />

        <meshStandardMaterial
          color="#ffffff"
          emissive="#c89cff"
          emissiveIntensity={4}
          metalness={0.2}
          roughness={0.1}
        />
      </mesh>

      {/* =====================================
          COUNTERFACTUAL BRANCH
      ===================================== */}

      <Line
        points={[
          [
            0,
            0.25,
            0,
          ],

          [
            -0.4,
            -0.6,
            0.2,
          ],

          [
            -1.4,
            -1.35,
            0.3,
          ],

          [
            -2.65,
            -2.05,
            0.2,
          ],
        ]}
        color="#d6ff4f"
        transparent
        opacity={
          replayComplete
            ? 0.42
            : 0.035
        }
        lineWidth={1.2}
        dashed
      />

      <ForensicNode
        position={[
          -2.65,
          -2.05,
          0.2,
        ]}
        color="#d6ff4f"
        active={
          replayComplete
        }
        size={0.16}
      />

      {replayComplete && (
        <CounterfactualPacket
          curve={
            safePath
          }
        />
      )}
    </group>
  );
}

/* ======================================================
   NODES
====================================================== */

function ForensicNode({
  position,
  color,
  active,
  size,
}: {
  position: [
    number,
    number,
    number,
  ];

  color: string;

  active: boolean;

  size: number;
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
              ? size
              : size *
                0.78,
            24,
            24,
          ]}
        />

        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={
            active
              ? 3
              : 0.25
          }
          metalness={0.5}
          roughness={0.16}
        />
      </mesh>

      {active && (
        <mesh
          scale={2.7}
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
            opacity={0.045}
          />
        </mesh>
      )}
    </group>
  );
}

/* ======================================================
   ROOT CAUSE PULSE
====================================================== */

function RootPulse({
  delay,
}: {
  delay: number;
}) {
  const ring =
    useRef<THREE.Mesh | null>(
      null
    );

  const material =
    useRef<THREE.MeshBasicMaterial | null>(
      null
    );

  useFrame(
    (
      state
    ) => {
      if (
        !ring.current ||
        !material.current
      ) {
        return;
      }

      const progress =
        (
          state.clock
            .elapsedTime *
            0.34 +
          delay
        ) %
        1;

      const scale =
        0.8 +
        progress *
          2.5;

      ring.current.scale.setScalar(
        scale
      );

      material.current.opacity =
        (
          1 -
          progress
        ) *
        0.22;
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
          0.58,
          0.012,
          8,
          150,
        ]}
      />

      <meshBasicMaterial
        ref={
          material
        }
        color="#c89cff"
        transparent
        opacity={0.18}
      />
    </mesh>
  );
}

/* ======================================================
   COUNTERFACTUAL SIGNAL
====================================================== */

function CounterfactualPacket({
  curve,
}: {
  curve:
    THREE.CatmullRomCurve3;
}) {
  const packet =
    useRef<THREE.Mesh | null>(
      null
    );

  useFrame(
    (
      state
    ) => {
      if (!packet.current) {
        return;
      }

      const progress =
        (
          state.clock
            .elapsedTime *
            0.22
        ) %
        1;

      packet.current.position.copy(
        curve.getPoint(
          progress
        )
      );
    }
  );

  return (
    <mesh ref={packet}>
      <sphereGeometry
        args={[
          0.075,
          20,
          20,
        ]}
      />

      <meshStandardMaterial
        color="#d6ff4f"
        emissive="#d6ff4f"
        emissiveIntensity={4}
      />
    </mesh>
  );
}