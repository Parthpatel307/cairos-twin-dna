"use client";

import {
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

interface CairosHeroSceneProps {
  progressRef: {
    current:
      number;
  };

  pointerRef: {
    current: {
      x:
        number;

      y:
        number;
    };
  };

  variant?:
    "hero" |
    "manifesto";
}

const SIGNAL_POINTS: [
  number,
  number,
  number
][] = [
  [
    -0.55,
    0.7,
    0.42,
  ],

  [
    0.25,
    0.52,
    0.58,
  ],

  [
    1.05,
    0.26,
    0.65,
  ],

  [
    1.82,
    -0.02,
    0.58,
  ],

  [
    2.55,
    -0.25,
    0.42,
  ],

  [
    3.15,
    -0.43,
    0.28,
  ],
];

export default function CairosHeroScene({
  progressRef,
  pointerRef,
  variant = "hero",
}: CairosHeroSceneProps) {
  const root =
    useRef<THREE.Group | null>(
      null
    );

  const backLayer =
    useRef<THREE.Group | null>(
      null
    );

  const midLayer =
    useRef<THREE.Group | null>(
      null
    );

  const frontLayer =
    useRef<THREE.Group | null>(
      null
    );

  const leftWing =
    useRef<THREE.Group | null>(
      null
    );

  const rightWing =
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

  const signalA =
    useRef<THREE.Mesh | null>(
      null
    );

  const signalB =
    useRef<THREE.Mesh | null>(
      null
    );

  const signalC =
    useRef<THREE.Mesh | null>(
      null
    );

  const dnaLayer =
    useRef<THREE.Group | null>(
      null
    );

  const scanner =
    useRef<THREE.Mesh | null>(
      null
    );

  const smoothProgress =
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
    variant ===
    "manifesto"
      ? mobile
        ? 0.85
        : compact
          ? 1.42
          : 2.1
      : mobile
        ? 0.92
        : compact
          ? 1.47
          : 2.18;

  const baseY =
    mobile
      ? -0.58
      : variant ===
          "manifesto"
        ? -0.02
        : 0;

  const baseScale =
    mobile
      ? 0.54
      : compact
        ? 0.74
        : variant ===
            "manifesto"
          ? 0.88
          : 0.91;

  useFrame(
    (
      state,
      delta
    ) => {
      smoothProgress.current =
        THREE.MathUtils.lerp(
          smoothProgress.current,
          THREE.MathUtils.clamp(
            progressRef.current,
            0,
            1
          ),
          Math.min(
            1,
            delta *
              3.4
          )
        );

      const progress =
        smoothProgress.current;

      const pointer =
        pointerRef.current;

      const time =
        state.clock.elapsedTime;

      const open =
        smoothStep(
          0.08,
          0.72,
          progress
        );

      const governance =
        smoothStep(
          0.24,
          0.82,
          progress
        );

      const dna =
        smoothStep(
          0.48,
          1,
          progress
        );

      /* =====================================
         ROOT
      ===================================== */

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
          THREE.MathUtils.lerp(
            root.current.position.y,
            baseY +
              Math.sin(
                time *
                  0.25
              ) *
                0.018,
            Math.min(
              1,
              delta *
                4
            )
          );

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
         DEPTH PARALLAX
      ===================================== */

      if (
        backLayer.current
      ) {
        backLayer.current.position.x =
          THREE.MathUtils.lerp(
            backLayer.current.position.x,
            pointer.x *
              0.05,
            Math.min(
              1,
              delta *
                2.8
            )
          );

        backLayer.current.position.y =
          THREE.MathUtils.lerp(
            backLayer.current.position.y,
            pointer.y *
              0.025,
            Math.min(
              1,
              delta *
                2.8
            )
          );
      }

      if (
        midLayer.current
      ) {
        midLayer.current.position.x =
          THREE.MathUtils.lerp(
            midLayer.current.position.x,
            pointer.x *
              0.095,
            Math.min(
              1,
              delta *
                3.1
            )
          );

        midLayer.current.position.y =
          THREE.MathUtils.lerp(
            midLayer.current.position.y,
            pointer.y *
              0.052,
            Math.min(
              1,
              delta *
                3.1
            )
          );

        midLayer.current.rotation.y =
          THREE.MathUtils.lerp(
            midLayer.current.rotation.y,
            pointer.x *
              0.022,
            Math.min(
              1,
              delta *
                2.7
            )
          );
      }

      if (
        frontLayer.current
      ) {
        frontLayer.current.position.x =
          THREE.MathUtils.lerp(
            frontLayer.current.position.x,
            pointer.x *
              0.13,
            Math.min(
              1,
              delta *
                3.3
            )
          );

        frontLayer.current.position.y =
          THREE.MathUtils.lerp(
            frontLayer.current.position.y,
            pointer.y *
              0.07,
            Math.min(
              1,
              delta *
                3.3
            )
          );
      }

      /* =====================================
         TWIN OPEN
      ===================================== */

      if (
        leftWing.current
      ) {
        leftWing.current.position.x =
          THREE.MathUtils.lerp(
            -0.72,
            -1.14,
            open
          );

        leftWing.current.rotation.y =
          THREE.MathUtils.lerp(
            -0.025,
            -0.105,
            open
          );
      }

      if (
        rightWing.current
      ) {
        rightWing.current.position.x =
          THREE.MathUtils.lerp(
            0.72,
            1.14,
            open
          );

        rightWing.current.rotation.y =
          THREE.MathUtils.lerp(
            0.025,
            0.105,
            open
          );
      }

      /* =====================================
         GOVERNANCE CLAMPS
      ===================================== */

      if (
        leftGate.current
      ) {
        leftGate.current.position.x =
          THREE.MathUtils.lerp(
            -2.82,
            -2.15,
            governance
          );
      }

      if (
        rightGate.current
      ) {
        rightGate.current.position.x =
          THREE.MathUtils.lerp(
            2.82,
            2.15,
            governance
          );
      }

      /* =====================================
         SCANNER
      ===================================== */

      if (
        scanner.current
      ) {
        scanner.current.position.y =
          -1.28 +
          (
            (
              Math.sin(
                time *
                  1.25
              ) +
              1
            ) /
            2
          ) *
            2.56;

        const material =
          scanner.current
            .material as THREE.MeshBasicMaterial;

        material.opacity =
          0.035 +
          open *
            0.11;
      }

      /* =====================================
         SIGNALS

         Restricted to machine/right zone.
      ===================================== */

      animateSignal(
        signalA.current,
        time,
        0,
        0.6
      );

      animateSignal(
        signalB.current,
        time,
        0.34,
        0.5
      );

      animateSignal(
        signalC.current,
        time,
        0.68,
        0.4
      );

      /* =====================================
         DNA
      ===================================== */

      if (
        dnaLayer.current
      ) {
        dnaLayer.current.visible =
          dna >
          0.025;

        dnaLayer.current.scale.setScalar(
          0.05 +
            dna *
              0.95
        );

        dnaLayer.current.position.z =
          THREE.MathUtils.lerp(
            -0.05,
            0.32,
            dna
          );
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
          BACK WORLD
      ===================================== */}

      <group
        ref={backLayer}
      >
        <Architecture />

        <RearChassis />
      </group>

      {/* =====================================
          MACHINE
      ===================================== */}

      <group
        ref={midLayer}
      >
        <group
          ref={leftWing}
          position={[
            -0.72,
            0,
            0,
          ]}
        >
          <TwinShell
            side="left"
          />
        </group>

        <group
          ref={rightWing}
          position={[
            0.72,
            0,
            0,
          ]}
        >
          <TwinShell
            side="right"
          />
        </group>

        <AuthorityCore />

        <group
          ref={leftGate}
          position={[
            -2.82,
            0,
            0.18,
          ]}
        >
          <GovernanceClamp
            side="left"
          />
        </group>

        <group
          ref={rightGate}
          position={[
            2.82,
            0,
            0.18,
          ]}
        >
          <GovernanceClamp
            side="right"
          />
        </group>

        <mesh
          ref={scanner}
          position={[
            0,
            -1.28,
            0.84,
          ]}
        >
          <boxGeometry
            args={[
              3.35,
              0.018,
              0.018,
            ]}
          />

          <meshBasicMaterial
            color="#cce849"
            transparent
            opacity={0.05}
          />
        </mesh>
      </group>

      {/* =====================================
          SIGNALS
      ===================================== */}

      <group
        ref={frontLayer}
      >
        <SignalPath />

        <mesh
          ref={signalA}
        >
          <octahedronGeometry
            args={[
              0.07,
              1,
            ]}
          />

          <meshStandardMaterial
            color="#8062dc"
            emissive="#8062dc"
            emissiveIntensity={0.62}
            metalness={0.55}
            roughness={0.14}
          />
        </mesh>

        <mesh
          ref={signalB}
        >
          <octahedronGeometry
            args={[
              0.078,
              1,
            ]}
          />

          <meshStandardMaterial
            color="#d7ec4e"
            emissive="#cce849"
            emissiveIntensity={0.65}
            metalness={0.5}
            roughness={0.12}
          />
        </mesh>

        <mesh
          ref={signalC}
        >
          <octahedronGeometry
            args={[
              0.068,
              1,
            ]}
          />

          <meshStandardMaterial
            color="#c6a248"
            emissive="#c6a248"
            emissiveIntensity={0.5}
            metalness={0.6}
            roughness={0.14}
          />
        </mesh>

        <group
          ref={dnaLayer}
          visible={false}
          scale={0.05}
        >
          <DNAEvidence />
        </group>
      </group>
    </group>
  );
}

/* ======================================================
   BACK ARCHITECTURE
====================================================== */

function Architecture() {
  return (
    <group
      position={[
        0,
        0,
        -1.18,
      ]}
    >
      <ArchitecturePost
        x={-3.08}
        height={4.15}
        width={0.28}
        opacity={0.5}
      />

      <ArchitecturePost
        x={3.12}
        height={4.25}
        width={0.28}
        opacity={0.5}
      />

      <ArchitecturePost
        x={-2.18}
        height={3.15}
        width={0.15}
        opacity={0.17}
      />

      <ArchitecturePost
        x={2.18}
        height={3.25}
        width={0.15}
        opacity={0.17}
      />

      <ArchitecturePost
        x={-1.48}
        height={2.6}
        width={0.08}
        opacity={0.09}
      />

      <ArchitecturePost
        x={1.48}
        height={2.6}
        width={0.08}
        opacity={0.09}
      />

      <Line
        points={[
          [
            -3.45,
            1.73,
            0,
          ],
          [
            3.45,
            1.73,
            0,
          ],
        ]}
        color="#829846"
        transparent
        opacity={0.075}
        lineWidth={1}
      />

      <Line
        points={[
          [
            -3.45,
            -1.7,
            0,
          ],
          [
            3.45,
            -1.7,
            0,
          ],
        ]}
        color="#829846"
        transparent
        opacity={0.11}
        lineWidth={1}
      />

      <Line
        points={[
          [
            -2.72,
            0,
            0,
          ],
          [
            2.72,
            0,
            0,
          ],
        ]}
        color="#52622e"
        transparent
        opacity={0.055}
        lineWidth={1}
      />
    </group>
  );
}

function ArchitecturePost({
  x,
  height,
  width,
  opacity,
}: {
  x:
    number;

  height:
    number;

  width:
    number;

  opacity:
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
          width,
          height,
          0.19,
        ]}
      />

      <meshStandardMaterial
        color="#061009"
        metalness={0.5}
        roughness={0.43}
        transparent
        opacity={opacity}
      />
    </mesh>
  );
}

/* ======================================================
   REAR CHASSIS
====================================================== */

function RearChassis() {
  return (
    <group
      position={[
        0,
        0,
        -0.58,
      ]}
    >
      <mesh>
        <boxGeometry
          args={[
            3.72,
            3.02,
            0.18,
          ]}
        />

        <meshStandardMaterial
          color="#071109"
          metalness={0.66}
          roughness={0.29}
        />
      </mesh>

      <mesh
        position={[
          0,
          0,
          0.11,
        ]}
      >
        <boxGeometry
          args={[
            3.36,
            2.68,
            0.08,
          ]}
        />

        <meshStandardMaterial
          color="#0a170c"
          metalness={0.58}
          roughness={0.34}
        />
      </mesh>

      <mesh
        position={[
          0,
          1.43,
          0.04,
        ]}
      >
        <boxGeometry
          args={[
            4.04,
            0.1,
            0.16,
          ]}
        />

        <meshStandardMaterial
          color="#101b10"
          metalness={0.72}
          roughness={0.22}
        />
      </mesh>

      <mesh
        position={[
          0,
          -1.44,
          0.04,
        ]}
      >
        <boxGeometry
          args={[
            4.04,
            0.1,
            0.16,
          ]}
        />

        <meshStandardMaterial
          color="#101b10"
          metalness={0.72}
          roughness={0.22}
        />
      </mesh>
    </group>
  );
}

/* ======================================================
   TWIN SHELL
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
          -0.17,
        ]}
      >
        <boxGeometry
          args={[
            1.04,
            2.76,
            0.54,
          ]}
        />

        <meshStandardMaterial
          color="#071008"
          metalness={0.8}
          roughness={0.17}
        />
      </mesh>

      <mesh
        position={[
          direction *
            0.04,
          0,
          0.12,
        ]}
      >
        <boxGeometry
          args={[
            0.9,
            2.56,
            0.3,
          ]}
        />

        <meshStandardMaterial
          color="#0b1a0e"
          metalness={0.72}
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
            1.91,
            0.075,
          ]}
        />

        <meshStandardMaterial
          color="#020402"
          metalness={0.33}
          roughness={0.55}
        />
      </mesh>

      <mesh
        position={[
          direction *
            -0.02,
          -0.03,
          0.355,
        ]}
      >
        <boxGeometry
          args={[
            0.4,
            1.6,
            0.04,
          ]}
        />

        <meshStandardMaterial
          color="#050907"
          metalness={0.76}
          roughness={0.16}
        />
      </mesh>

      {/* OUTER SAFETY RAIL */}

      <mesh
        position={[
          direction *
            0.47,
          0,
          0.28,
        ]}
      >
        <boxGeometry
          args={[
            0.052,
            2.22,
            0.075,
          ]}
        />

        <meshStandardMaterial
          color="#93b92e"
          emissive="#769d22"
          emissiveIntensity={0.2}
          metalness={0.42}
          roughness={0.25}
        />
      </mesh>

      {/* ARMOR DETAILS */}

      <mesh
        position={[
          direction *
            -0.03,
          1.1,
          0.36,
        ]}
      >
        <boxGeometry
          args={[
            0.68,
            0.15,
            0.12,
          ]}
        />

        <meshStandardMaterial
          color="#162016"
          metalness={0.72}
          roughness={0.2}
        />
      </mesh>

      <mesh
        position={[
          direction *
            -0.03,
          -1.1,
          0.36,
        ]}
      >
        <boxGeometry
          args={[
            0.68,
            0.15,
            0.12,
          ]}
        />

        <meshStandardMaterial
          color="#11171a"
          metalness={0.72}
          roughness={0.2}
        />
      </mesh>

      <mesh
        position={[
          direction *
            -0.02,
          -0.99,
          0.445,
        ]}
      >
        <boxGeometry
          args={[
            0.43,
            0.038,
            0.03,
          ]}
        />

        <meshBasicMaterial
          color="#8062dc"
          transparent
          opacity={0.42}
        />
      </mesh>

      <mesh
        position={[
          direction *
            0.55,
          0,
          -0.01,
        ]}
      >
        <boxGeometry
          args={[
            0.066,
            2.5,
            0.42,
          ]}
        />

        <meshStandardMaterial
          color="#020502"
          metalness={0.9}
          roughness={0.13}
        />
      </mesh>
    </group>
  );
}

/* ======================================================
   AUTHORITY CORE
====================================================== */

function AuthorityCore() {
  return (
    <group>
      {/* MAIN SPINE */}

      <mesh
        position={[
          0,
          0,
          -0.05,
        ]}
      >
        <boxGeometry
          args={[
            0.54,
            3.08,
            0.62,
          ]}
        />

        <meshStandardMaterial
          color="#020402"
          metalness={0.92}
          roughness={0.12}
        />
      </mesh>

      {/* TOP CAP */}

      <mesh
        position={[
          0,
          1.32,
          0.28,
        ]}
      >
        <boxGeometry
          args={[
            0.62,
            0.17,
            0.28,
          ]}
        />

        <meshStandardMaterial
          color="#0c140a"
          metalness={0.78}
          roughness={0.17}
        />
      </mesh>

      {/* FRONT CHANNEL BODY */}

      <mesh
        position={[
          0,
          -0.05,
          0.34,
        ]}
      >
        <boxGeometry
          args={[
            0.17,
            2,
            0.11,
          ]}
        />

        <meshStandardMaterial
          color="#171d0d"
          metalness={0.7}
          roughness={0.18}
        />
      </mesh>

      {/* AUTHORITY LINE */}

      <mesh
        position={[
          0,
          -0.03,
          0.42,
        ]}
      >
        <boxGeometry
          args={[
            0.058,
            1.55,
            0.045,
          ]}
        />

        <meshStandardMaterial
          color="#d8eb63"
          emissive="#cce849"
          emissiveIntensity={0.65}
          metalness={0.42}
          roughness={0.12}
        />
      </mesh>

      {/* SMALLER AUTHORITY KEY */}

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
            0.145,
            1,
          ]}
        />

        <meshStandardMaterial
          color="#e4ef8a"
          emissive="#cce849"
          emissiveIntensity={0.46}
          metalness={0.54}
          roughness={0.11}
        />
      </mesh>

      {/* AUTHORITY COLLAR */}

      <mesh
        position={[
          0,
          0.87,
          0.39,
        ]}
      >
        <boxGeometry
          args={[
            0.34,
            0.08,
            0.08,
          ]}
        />

        <meshStandardMaterial
          color="#4b5a2c"
          metalness={0.62}
          roughness={0.2}
        />
      </mesh>

      {/* DNA KEY */}

      <mesh
        position={[
          0,
          -1.09,
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
            0.115,
            1,
          ]}
        />

        <meshStandardMaterial
          color="#8062dc"
          emissive="#8062dc"
          emissiveIntensity={0.52}
          metalness={0.56}
          roughness={0.13}
        />
      </mesh>

      {/* SHOULDERS */}

      <mesh
        position={[
          -0.43,
          0.75,
          0.31,
        ]}
      >
        <boxGeometry
          args={[
            0.42,
            0.065,
            0.09,
          ]}
        />

        <meshStandardMaterial
          color="#465234"
          metalness={0.6}
          roughness={0.22}
        />
      </mesh>

      <mesh
        position={[
          0.43,
          0.75,
          0.31,
        ]}
      >
        <boxGeometry
          args={[
            0.42,
            0.065,
            0.09,
          ]}
        />

        <meshStandardMaterial
          color="#465234"
          metalness={0.6}
          roughness={0.22}
        />
      </mesh>
    </group>
  );
}

/* ======================================================
   GOVERNANCE CLAMP
====================================================== */

function GovernanceClamp({
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
            0.15,
            3.55,
            0.3,
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
            0.3,
          1.12,
          0.16,
        ]}
      >
        <boxGeometry
          args={[
            0.66,
            0.075,
            0.09,
          ]}
        />

        <meshStandardMaterial
          color="#6e5a20"
          emissive="#9e7f26"
          emissiveIntensity={0.09}
          metalness={0.62}
          roughness={0.2}
        />
      </mesh>

      <mesh
        position={[
          direction *
            0.49,
          0,
          0.18,
        ]}
      >
        <boxGeometry
          args={[
            1.02,
            0.07,
            0.09,
          ]}
        />

        <meshStandardMaterial
          color="#967b27"
          emissive="#a88a27"
          emissiveIntensity={0.1}
          metalness={0.62}
          roughness={0.18}
        />
      </mesh>

      <mesh
        position={[
          direction *
            0.3,
          -1.12,
          0.16,
        ]}
      >
        <boxGeometry
          args={[
            0.66,
            0.075,
            0.09,
          ]}
        />

        <meshStandardMaterial
          color="#55471e"
          metalness={0.62}
          roughness={0.2}
        />
      </mesh>
    </group>
  );
}

/* ======================================================
   SIGNAL PATH

   Starts at machine, not headline zone.
====================================================== */

function SignalPath() {
  return (
    <>
      <Line
        points={
          SIGNAL_POINTS
        }
        color="#a7bb5d"
        transparent
        opacity={0.16}
        lineWidth={1}
      />

      <Line
        points={[
          [
            -0.6,
            -1.33,
            0.05,
          ],
          [
            2.85,
            -1.33,
            0.05,
          ],
        ]}
        color="#758b3c"
        transparent
        opacity={0.15}
        lineWidth={1}
      />
    </>
  );
}

/* ======================================================
   DNA
====================================================== */

function DNAEvidence() {
  return (
    <group>
      <Line
        points={[
          [
            -0.5,
            -1.08,
            0.22,
          ],
          [
            0.1,
            -1.36,
            0.42,
          ],
          [
            0.72,
            -1.12,
            0.36,
          ],
          [
            1.25,
            -1.38,
            0.18,
          ],
        ]}
        color="#8062dc"
        transparent
        opacity={0.45}
        lineWidth={1}
      />

      <EvidenceNode
        position={[
          -0.5,
          -1.08,
          0.22,
        ]}
        color="#8062dc"
      />

      <EvidenceNode
        position={[
          0.1,
          -1.36,
          0.42,
        ]}
        color="#9a7ce9"
      />

      <EvidenceNode
        position={[
          0.72,
          -1.12,
          0.36,
        ]}
        color="#8062dc"
      />

      <EvidenceNode
        position={[
          1.25,
          -1.38,
          0.18,
        ]}
        color="#c6a248"
      />
    </group>
  );
}

function EvidenceNode({
  position,
  color,
}: {
  position: [
    number,
    number,
    number
  ];

  color:
    string;
}) {
  return (
    <mesh
      position={
        position
      }
    >
      <octahedronGeometry
        args={[
          0.06,
          1,
        ]}
      />

      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.42}
        metalness={0.58}
        roughness={0.15}
      />
    </mesh>
  );
}

/* ======================================================
   SIGNAL ANIMATION
====================================================== */

function animateSignal(
  mesh:
    THREE.Mesh | null,

  time:
    number,

  offset:
    number,

  amplitude:
    number
) {
  if (!mesh) {
    return;
  }

  const t =
    (
      time *
        0.075 +
      offset
    ) %
    1;

  const segment =
    (SIGNAL_POINTS.length -
      1) *
    t;

  const index =
    Math.min(
      SIGNAL_POINTS.length -
        2,
      Math.floor(
        segment
      )
    );

  const localT =
    segment -
    index;

  const from =
    SIGNAL_POINTS[
      index
    ];

  const to =
    SIGNAL_POINTS[
      index +
        1
    ];

  const x =
    THREE.MathUtils.lerp(
      from[0],
      to[0],
      localT
    );

  const y =
    THREE.MathUtils.lerp(
      from[1],
      to[1],
      localT
    ) +
    Math.sin(
      t *
        Math.PI
    ) *
      0.035 *
      amplitude;

  const z =
    THREE.MathUtils.lerp(
      from[2],
      to[2],
      localT
    );

  mesh.position.set(
    x,
    y,
    z
  );

  mesh.rotation.x =
    time *
      0.38;

  mesh.rotation.y =
    time *
      0.58;
}

/* ======================================================
   MATH
====================================================== */

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