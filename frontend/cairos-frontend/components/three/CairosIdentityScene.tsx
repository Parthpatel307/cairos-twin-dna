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

import {
  useReducedMotion,
} from "framer-motion";

import * as THREE from "three";

interface CairosIdentitySceneProps {
  progressRef: {
    current: number;
  };
}

export default function CairosIdentityScene({
  progressRef,
}: CairosIdentitySceneProps) {
  const reduceMotion =
    useReducedMotion();

  const width =
    useThree(
      (
        state
      ) =>
        state.size.width
    );

  const smoothProgress =
    useRef(0);

  const root =
    useRef<THREE.Group | null>(
      null
    );

  const leftPlate =
    useRef<THREE.Group | null>(
      null
    );

  const rightPlate =
    useRef<THREE.Group | null>(
      null
    );

  const core =
    useRef<THREE.Group | null>(
      null
    );

  const governanceBeam =
    useRef<THREE.Mesh | null>(
      null
    );

  const governanceBeamTop =
    useRef<THREE.Mesh | null>(
      null
    );

  const authorityFrame =
    useRef<THREE.Group | null>(
      null
    );

  const dnaGroup =
    useRef<THREE.Group | null>(
      null
    );

  /*
    Responsive 3D composition.

    Mobile:
    smaller + lower + closer to center.

    Laptop/Desktop:
    sculpture stays clearly on right.
  */

  const isMobile =
    width <
    720;

  const isCompact =
    width >=
      720 &&
    width <
      1280;

  const targetRootX =
    isMobile
      ? 0.9
      : isCompact
        ? 1.45
        : 1.85;

  const targetRootY =
    isMobile
      ? -0.8
      : -0.03;

  const targetScale =
    isMobile
      ? 0.64
      : isCompact
        ? 0.82
        : 0.94;

  useFrame(
    (
      frame,
      delta
    ) => {
      const target =
        progressRef.current ??
        0;

      smoothProgress.current =
        THREE.MathUtils.lerp(
          smoothProgress.current,
          target,
          reduceMotion
            ? 1
            : Math.min(
                1,
                delta * 3.5
              )
        );

      const progress =
        smoothProgress.current;

      /*
        Chapter influences.

        They remain broad/smooth so object
        transforms instead of snapping.
      */

      const twin =
        smoothStep(
          0.55,
          1.05,
          progress
        ) *
        (
          1 -
          smoothStep(
            1.65,
            2.05,
            progress
          ) *
            0.28
        );

      const govern =
        smoothStep(
          1.55,
          2.1,
          progress
        );

      const human =
        smoothStep(
          2.55,
          3.1,
          progress
        );

      const dna =
        smoothStep(
          3.45,
          4,
          progress
        );

      const time =
        frame.clock
          .elapsedTime;

      /* =====================================
         RESPONSIVE ROOT
      ===================================== */

      if (root.current) {
        root.current.position.x =
          THREE.MathUtils.lerp(
            root.current.position.x,
            targetRootX,
            Math.min(
              1,
              delta * 4
            )
          );

        root.current.position.y =
          THREE.MathUtils.lerp(
            root.current.position.y,
            targetRootY +
              (
                reduceMotion
                  ? 0
                  : Math.sin(
                      time *
                        0.32
                    ) *
                    0.02
              ),
            Math.min(
              1,
              delta * 4
            )
          );

        const scale =
          THREE.MathUtils.lerp(
            root.current.scale.x,
            targetScale,
            Math.min(
              1,
              delta * 4
            )
          );

        root.current.scale.setScalar(
          scale
        );

        if (
          !reduceMotion
        ) {
          root.current.rotation.y =
            Math.sin(
              time *
                0.1
            ) *
            0.025;
        }
      }

      /* =====================================
         AGENT TWIN

         Central architecture separates into
         mirrored isolated representations.
      ===================================== */

      if (leftPlate.current) {
        leftPlate.current.position.x =
          THREE.MathUtils.lerp(
            -0.32,
            -1.28,
            twin
          );

        leftPlate.current.position.y =
          THREE.MathUtils.lerp(
            0.02,
            0.18,
            twin
          );

        leftPlate.current.rotation.y =
          THREE.MathUtils.lerp(
            -0.02,
            -0.18,
            twin
          );
      }

      if (rightPlate.current) {
        rightPlate.current.position.x =
          THREE.MathUtils.lerp(
            0.32,
            1.28,
            twin
          );

        rightPlate.current.position.y =
          THREE.MathUtils.lerp(
            -0.02,
            -0.18,
            twin
          );

        rightPlate.current.rotation.y =
          THREE.MathUtils.lerp(
            0.02,
            0.18,
            twin
          );
      }

      /* =====================================
         CAIROS CORE
      ===================================== */

      if (core.current) {
        core.current.position.z =
          govern *
          0.2;

        core.current.scale.y =
          1 +
          govern *
            0.08;

        if (
          !reduceMotion
        ) {
          core.current.rotation.z =
            Math.sin(
              time *
                0.18
            ) *
            0.01;
        }
      }

      /* =====================================
         GOVERNANCE BOUNDARY

         Beams expand horizontally.
         No circle / orbit / ring.
      ===================================== */

      if (
        governanceBeam.current
      ) {
        governanceBeam.current.scale.x =
          THREE.MathUtils.lerp(
            0.025,
            1,
            govern
          );

        const material =
          governanceBeam.current
            .material as THREE.MeshStandardMaterial;

        material.opacity =
          0.02 +
          govern *
            0.72;
      }

      if (
        governanceBeamTop.current
      ) {
        governanceBeamTop.current.scale.x =
          THREE.MathUtils.lerp(
            0.025,
            0.7,
            govern
          );

        const material =
          governanceBeamTop.current
            .material as THREE.MeshStandardMaterial;

        material.opacity =
          govern *
          0.28;
      }

      /* =====================================
         HUMAN AUTHORITY

         Square authority frame forms around
         the center instead of an orbit.
      ===================================== */

      if (
        authorityFrame.current
      ) {
        const scale =
          0.04 +
          human *
            0.96;

        authorityFrame.current.scale.setScalar(
          scale
        );

        authorityFrame.current.rotation.z =
          THREE.MathUtils.lerp(
            0,
            Math.PI /
              4,
            human
          );
      }

      /* =====================================
         AGENTDNA

         Causal evidence expands from the core.
      ===================================== */

      if (dnaGroup.current) {
        dnaGroup.current.visible =
          dna >
          0.015;

        const scale =
          0.2 +
          dna *
            0.8;

        dnaGroup.current.scale.setScalar(
          scale
        );

        dnaGroup.current.position.z =
          dna *
          0.14;
      }
    }
  );

  return (
    <group
      ref={root}
      position={[
        targetRootX,
        targetRootY,
        0,
      ]}
      scale={
        targetScale
      }
    >
      {/* =====================================
          LEFT TWIN PLATE
      ===================================== */}

      <group
        ref={
          leftPlate
        }
        position={[
          -0.32,
          0.02,
          0,
        ]}
      >
        <IdentityPlate
          height={
            2.36
          }
          opacity={
            0.44
          }
        />

        <mesh
          position={[
            0,
            0.55,
            0.095,
          ]}
        >
          <boxGeometry
            args={[
              0.18,
              0.035,
              0.018,
            ]}
          />

          <meshBasicMaterial
            color="#8fb52d"
            transparent
            opacity={0.55}
          />
        </mesh>
      </group>

      {/* =====================================
          RIGHT TWIN PLATE
      ===================================== */}

      <group
        ref={
          rightPlate
        }
        position={[
          0.32,
          -0.02,
          0,
        ]}
      >
        <IdentityPlate
          height={
            2.08
          }
          opacity={
            0.36
          }
        />

        <mesh
          position={[
            0,
            -0.47,
            0.095,
          ]}
        >
          <boxGeometry
            args={[
              0.18,
              0.035,
              0.018,
            ]}
          />

          <meshBasicMaterial
            color="#7659d8"
            transparent
            opacity={0.42}
          />
        </mesh>
      </group>

      {/* =====================================
          CENTRAL CAIROS CORE
      ===================================== */}

      <group
        ref={core}
      >
        <mesh>
          <boxGeometry
            args={[
              0.2,
              1.88,
              0.25,
            ]}
          />

          <meshStandardMaterial
            color="#171c16"
            metalness={0.88}
            roughness={0.23}
          />
        </mesh>

        {/* Intelligence signal */}

        <mesh
          position={[
            0,
            0.02,
            0.142,
          ]}
        >
          <boxGeometry
            args={[
              0.036,
              1.04,
              0.018,
            ]}
          />

          <meshStandardMaterial
            color="#9fc83b"
            emissive="#9fc83b"
            emissiveIntensity={0.45}
          />
        </mesh>

        <mesh
          position={[
            0,
            0.7,
            0.17,
          ]}
        >
          <sphereGeometry
            args={[
              0.065,
              18,
              18,
            ]}
          />

          <meshStandardMaterial
            color="#9fc83b"
            emissive="#9fc83b"
            emissiveIntensity={0.7}
          />
        </mesh>

        <mesh
          position={[
            0,
            -0.73,
            0.17,
          ]}
        >
          <sphereGeometry
            args={[
              0.048,
              18,
              18,
            ]}
          />

          <meshStandardMaterial
            color="#7659d8"
            emissive="#7659d8"
            emissiveIntensity={0.5}
          />
        </mesh>
      </group>

      {/* =====================================
          CAIROS GOVERNANCE BOUNDARY
      ===================================== */}

      <mesh
        ref={
          governanceBeam
        }
        position={[
          0,
          -1.42,
          0.08,
        ]}
        scale={[
          0.025,
          1,
          1,
        ]}
      >
        <boxGeometry
          args={[
            4.4,
            0.035,
            0.055,
          ]}
        />

        <meshStandardMaterial
          color="#8fb42f"
          emissive="#8fb42f"
          emissiveIntensity={0.08}
          transparent
          opacity={0.02}
        />
      </mesh>

      <mesh
        ref={
          governanceBeamTop
        }
        position={[
          0,
          1.28,
          -0.05,
        ]}
        scale={[
          0.025,
          1,
          1,
        ]}
      >
        <boxGeometry
          args={[
            3.4,
            0.015,
            0.035,
          ]}
        />

        <meshStandardMaterial
          color="#596158"
          transparent
          opacity={0}
        />
      </mesh>

      {/* =====================================
          HUMAN AUTHORITY FRAME

          Architectural gate.
          No circular orbit.
      ===================================== */}

      <group
        ref={
          authorityFrame
        }
        position={[
          0,
          0,
          0.62,
        ]}
        scale={0.04}
      >
        <AuthorityFrame />
      </group>

      {/* =====================================
          AGENTDNA CAUSAL STRUCTURE
      ===================================== */}

      <group
        ref={
          dnaGroup
        }
        visible={false}
        scale={0.2}
      >
        <Line
          points={[
            [
              0,
              0,
              0.32,
            ],
            [
              -1.65,
              0.9,
              0.2,
            ],
          ]}
          color="#7659d8"
          transparent
          opacity={0.42}
          lineWidth={1}
        />

        <Line
          points={[
            [
              0,
              0,
              0.32,
            ],
            [
              1.65,
              0.82,
              0.16,
            ],
          ]}
          color="#7659d8"
          transparent
          opacity={0.42}
          lineWidth={1}
        />

        <Line
          points={[
            [
              0,
              0,
              0.32,
            ],
            [
              -1.3,
              -1.05,
              0.14,
            ],
          ]}
          color="#8fb52d"
          transparent
          opacity={0.4}
          lineWidth={1}
        />

        <Line
          points={[
            [
              0,
              0,
              0.32,
            ],
            [
              1.42,
              -1.08,
              0.1,
            ],
          ]}
          color="#bf514c"
          transparent
          opacity={0.4}
          lineWidth={1}
        />

        <DNANode
          position={[
            -1.65,
            0.9,
            0.2,
          ]}
          color="#7659d8"
        />

        <DNANode
          position={[
            1.65,
            0.82,
            0.16,
          ]}
          color="#7659d8"
        />

        <DNANode
          position={[
            -1.3,
            -1.05,
            0.14,
          ]}
          color="#8fb52d"
        />

        <DNANode
          position={[
            1.42,
            -1.08,
            0.1,
          ]}
          color="#bf514c"
        />
      </group>

      {/* =====================================
          SMALL ENGINEERING BASELINE
      ===================================== */}

      <Line
        points={[
          [
            -2.8,
            -1.78,
            -0.08,
          ],
          [
            2.8,
            -1.78,
            -0.08,
          ],
        ]}
        color="#5b6358"
        transparent
        opacity={0.09}
        lineWidth={1}
      />
    </group>
  );
}

/* ======================================================
   IDENTITY PLATE
====================================================== */

function IdentityPlate({
  height,
  opacity,
}: {
  height:
    number;

  opacity:
    number;
}) {
  return (
    <mesh>
      <boxGeometry
        args={[
          0.52,
          height,
          0.13,
        ]}
      />

      <meshStandardMaterial
        color="#bdc5bb"
        metalness={0.28}
        roughness={0.32}
        transparent
        opacity={opacity}
      />
    </mesh>
  );
}

/* ======================================================
   AUTHORITY FRAME
====================================================== */

function AuthorityFrame() {
  return (
    <group>
      {/* TOP */}

      <mesh
        position={[
          0,
          0.78,
          0,
        ]}
      >
        <boxGeometry
          args={[
            1.55,
            0.055,
            0.055,
          ]}
        />

        <AuthorityMaterial />
      </mesh>

      {/* BOTTOM */}

      <mesh
        position={[
          0,
          -0.78,
          0,
        ]}
      >
        <boxGeometry
          args={[
            1.55,
            0.055,
            0.055,
          ]}
        />

        <AuthorityMaterial />
      </mesh>

      {/* LEFT */}

      <mesh
        position={[
          -0.75,
          0,
          0,
        ]}
      >
        <boxGeometry
          args={[
            0.055,
            1.6,
            0.055,
          ]}
        />

        <AuthorityMaterial />
      </mesh>

      {/* RIGHT */}

      <mesh
        position={[
          0.75,
          0,
          0,
        ]}
      >
        <boxGeometry
          args={[
            0.055,
            1.6,
            0.055,
          ]}
        />

        <AuthorityMaterial />
      </mesh>

      {/* HUMAN DECISION CORE */}

      <mesh>
        <octahedronGeometry
          args={[
            0.21,
            1,
          ]}
        />

        <meshStandardMaterial
          color="#c5a349"
          emissive="#c5a349"
          emissiveIntensity={0.32}
          metalness={0.68}
          roughness={0.2}
        />
      </mesh>
    </group>
  );
}

function AuthorityMaterial() {
  return (
    <meshStandardMaterial
      color="#c5a349"
      emissive="#c5a349"
      emissiveIntensity={0.1}
      metalness={0.76}
      roughness={0.22}
    />
  );
}

/* ======================================================
   AGENTDNA NODE
====================================================== */

function DNANode({
  position,
  color,
}: {
  position: [
    number,
    number,
    number,
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
      <sphereGeometry
        args={[
          0.085,
          18,
          18,
        ]}
      />

      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.5}
        metalness={0.38}
        roughness={0.2}
      />
    </mesh>
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