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

interface CairosRunSceneProps {
  pointerRef: {
    current: {
      x: number;
      y: number;
    };
  };

  activeRef: {
    current: boolean;
  };
}

export default function CairosRunScene({
  pointerRef,
  activeRef,
}: CairosRunSceneProps) {
  const root =
    useRef<THREE.Group | null>(
      null
    );

  const back =
    useRef<THREE.Group | null>(
      null
    );

  const machine =
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

  const token =
    useRef<THREE.Mesh | null>(
      null
    );

  const scan =
    useRef<THREE.Mesh | null>(
      null
    );

  const output =
    useRef<THREE.Mesh | null>(
      null
    );

  const interaction =
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
    width >= 760 &&
    width < 1200;

  const baseX =
    mobile
      ? 0.9
      : compact
        ? 1.65
        : 2.15;

  const baseY =
    mobile
      ? -0.9
      : -0.05;

  const baseScale =
    mobile
      ? 0.6
      : compact
        ? 0.82
        : 1;

  const requestCurve =
    useMemo(
      () =>
        new THREE.CatmullRomCurve3(
          [
            new THREE.Vector3(
              -4.2,
              0.75,
              0
            ),

            new THREE.Vector3(
              -3.1,
              0.6,
              0.08
            ),

            new THREE.Vector3(
              -2,
              0.36,
              0.15
            ),

            new THREE.Vector3(
              -0.9,
              0.16,
              0.35
            ),

            new THREE.Vector3(
              0,
              0,
              0.66
            ),
          ]
        ),
      []
    );

  useFrame(
    (
      state,
      delta
    ) => {
      const time =
        state.clock.elapsedTime;

      interaction.current =
        THREE.MathUtils.lerp(
          interaction.current,
          activeRef.current
            ? 1
            : 0,
          Math.min(
            1,
            delta * 4
          )
        );

      const active =
        interaction.current;

      const pointerX =
        mobile
          ? 0
          : pointerRef.current.x;

      const pointerY =
        mobile
          ? 0
          : pointerRef.current.y;

      if (root.current) {
        root.current.position.x =
          THREE.MathUtils.lerp(
            root.current.position.x,
            baseX +
              pointerX *
                0.11,
            Math.min(
              1,
              delta * 3.6
            )
          );

        root.current.position.y =
          THREE.MathUtils.lerp(
            root.current.position.y,
            baseY -
              pointerY *
                0.06 +
              Math.sin(
                time * 0.27
              ) *
                0.022,
            Math.min(
              1,
              delta * 3.6
            )
          );

        root.current.rotation.y =
          THREE.MathUtils.lerp(
            root.current.rotation.y,
            pointerX *
              0.055,
            Math.min(
              1,
              delta * 3
            )
          );

        root.current.rotation.x =
          THREE.MathUtils.lerp(
            root.current.rotation.x,
            pointerY *
              -0.025,
            Math.min(
              1,
              delta * 3
            )
          );

        const targetScale =
          baseScale *
          (
            1 +
            active *
              0.035
          );

        const nextScale =
          THREE.MathUtils.lerp(
            root.current.scale.x,
            targetScale,
            Math.min(
              1,
              delta * 3.7
            )
          );

        root.current.scale.setScalar(
          nextScale
        );
      }

      if (back.current) {
        back.current.position.x =
          THREE.MathUtils.lerp(
            back.current.position.x,
            pointerX *
              -0.08,
            Math.min(
              1,
              delta * 2.5
            )
          );
      }

      if (machine.current) {
        machine.current.position.x =
          THREE.MathUtils.lerp(
            machine.current.position.x,
            pointerX *
              0.035,
            Math.min(
              1,
              delta * 3
            )
          );
      }

      const open =
        0.22 +
        active *
          0.78;

      if (leftWing.current) {
        leftWing.current.position.x =
          THREE.MathUtils.lerp(
            -0.48,
            -1.18,
            open
          );

        leftWing.current.rotation.y =
          THREE.MathUtils.lerp(
            -0.03,
            -0.16,
            open
          );
      }

      if (rightWing.current) {
        rightWing.current.position.x =
          THREE.MathUtils.lerp(
            0.48,
            1.18,
            open
          );

        rightWing.current.rotation.y =
          THREE.MathUtils.lerp(
            0.03,
            0.16,
            open
          );
      }

      if (token.current) {
        const speed =
          activeRef.current
            ? 0.19
            : 0.095;

        const travel =
          (
            time *
            speed
          ) %
          1;

        const point =
          requestCurve.getPointAt(
            travel
          );

        token.current.position.copy(
          point
        );

        token.current.rotation.x +=
          delta * 0.6;

        token.current.rotation.y +=
          delta * 0.85;

        token.current.scale.setScalar(
          0.92 +
            active *
              0.22
        );
      }

      if (scan.current) {
        scan.current.position.y =
          -1.25 +
          (
            (
              Math.sin(
                time *
                  (
                    activeRef.current
                      ? 2.2
                      : 1.35
                  )
              ) +
              1
            ) /
            2
          ) *
            2.5;

        const material =
          scan.current
            .material as THREE.MeshBasicMaterial;

        material.opacity =
          0.08 +
          active *
            0.2;
      }

      if (output.current) {
        const outputTravel =
          (
            time *
              0.11 +
            0.35
          ) %
          1;

        output.current.position.x =
          0.9 +
          outputTravel *
            2.6;

        output.current.position.y =
          -0.15 +
          Math.sin(
            outputTravel *
              Math.PI
          ) *
            0.22;

        output.current.visible =
          active >
          0.12;
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
      <group
        ref={back}
        position={[
          0,
          0,
          -1.1,
        ]}
      >
        <Architecture
          x={-2.8}
          y={0.1}
          width={0.34}
          height={3.65}
          opacity={0.45}
        />

        <Architecture
          x={2.85}
          y={-0.1}
          width={0.3}
          height={3.85}
          opacity={0.46}
        />

        <Architecture
          x={-1.95}
          y={-0.2}
          width={0.68}
          height={2.45}
          opacity={0.16}
        />

        <Architecture
          x={1.9}
          y={0.3}
          width={0.62}
          height={2.65}
          opacity={0.14}
        />

        <Line
          points={[
            [
              -3.45,
              1.72,
              0,
            ],
            [
              3.5,
              1.72,
              0,
            ],
          ]}
          color="#819b50"
          transparent
          opacity={0.08}
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
              3.5,
              -1.7,
              0,
            ],
          ]}
          color="#819b50"
          transparent
          opacity={0.12}
          lineWidth={1}
        />
      </group>

      <Line
        points={
          requestCurve.getPoints(
            80
          )
        }
        color="#c8e64a"
        transparent
        opacity={0.22}
        lineWidth={1}
        dashed
        dashSize={0.09}
        gapSize={0.075}
      />

      <mesh ref={token}>
        <octahedronGeometry
          args={[
            0.105,
            1,
          ]}
        />

        <meshStandardMaterial
          color="#d1ed54"
          emissive="#d1ed54"
          emissiveIntensity={0.76}
          metalness={0.45}
          roughness={0.16}
        />
      </mesh>

      <group ref={machine}>
        <group
          ref={leftWing}
          position={[
            -0.48,
            0,
            0,
          ]}
        >
          <RunWing
            side="left"
          />
        </group>

        <group
          ref={rightWing}
          position={[
            0.48,
            0,
            0,
          ]}
        >
          <RunWing
            side="right"
          />
        </group>

        <mesh
          position={[
            0,
            0,
            0.16,
          ]}
        >
          <boxGeometry
            args={[
              0.34,
              2.75,
              0.42,
            ]}
          />

          <meshStandardMaterial
            color="#050805"
            metalness={0.92}
            roughness={0.12}
          />
        </mesh>

        <mesh
          position={[
            0,
            0.05,
            0.39,
          ]}
        >
          <boxGeometry
            args={[
              0.052,
              1.5,
              0.02,
            ]}
          />

          <meshStandardMaterial
            color="#d0ec52"
            emissive="#d0ec52"
            emissiveIntensity={0.88}
          />
        </mesh>

        <mesh
          position={[
            0,
            1.06,
            0.42,
          ]}
        >
          <sphereGeometry
            args={[
              0.1,
              20,
              20,
            ]}
          />

          <meshStandardMaterial
            color="#daee84"
            emissive="#cce64e"
            emissiveIntensity={0.78}
          />
        </mesh>

        <mesh
          position={[
            0,
            -1.08,
            0.42,
          ]}
        >
          <sphereGeometry
            args={[
              0.064,
              18,
              18,
            ]}
          />

          <meshStandardMaterial
            color="#8164da"
            emissive="#8164da"
            emissiveIntensity={0.65}
          />
        </mesh>

        <mesh
          ref={scan}
          position={[
            0,
            -1.2,
            0.65,
          ]}
        >
          <boxGeometry
            args={[
              3.35,
              0.025,
              0.025,
            ]}
          />

          <meshBasicMaterial
            color="#cce849"
            transparent
            opacity={0.1}
          />
        </mesh>

        <mesh
          position={[
            0,
            -1.65,
            -0.05,
          ]}
        >
          <boxGeometry
            args={[
              5.8,
              0.035,
              0.05,
            ]}
          />

          <meshBasicMaterial
            color="#91a94b"
            transparent
            opacity={0.3}
          />
        </mesh>
      </group>

      <Line
        points={[
          [
            0.75,
            -0.15,
            0.52,
          ],
          [
            1.65,
            -0.02,
            0.38,
          ],
          [
            2.55,
            -0.18,
            0.2,
          ],
          [
            3.55,
            -0.12,
            0.08,
          ],
        ]}
        color="#cce849"
        transparent
        opacity={0.15}
        lineWidth={1}
      />

      <mesh
        ref={output}
        visible={false}
        position={[
          0.9,
          -0.15,
          0.5,
        ]}
      >
        <octahedronGeometry
          args={[
            0.07,
            1,
          ]}
        />

        <meshStandardMaterial
          color="#cce849"
          emissive="#cce849"
          emissiveIntensity={0.7}
        />
      </mesh>
    </group>
  );
}

function Architecture({
  x,
  y,
  width,
  height,
  opacity,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  opacity: number;
}) {
  return (
    <mesh
      position={[
        x,
        y,
        0,
      ]}
    >
      <boxGeometry
        args={[
          width,
          height,
          0.14,
        ]}
      />

      <meshStandardMaterial
        color="#0a160d"
        metalness={0.42}
        roughness={0.48}
        transparent
        opacity={opacity}
      />
    </mesh>
  );
}

function RunWing({
  side,
}: {
  side:
    | "left"
    | "right";
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
          direction *
            0.07,
          0,
          -0.18,
        ]}
      >
        <boxGeometry
          args={[
            0.92,
            2.72,
            0.16,
          ]}
        />

        <meshStandardMaterial
          color="#0c1c10"
          metalness={0.48}
          roughness={0.3}
        />
      </mesh>

      <mesh>
        <boxGeometry
          args={[
            0.72,
            2.52,
            0.23,
          ]}
        />

        <meshStandardMaterial
          color="#112717"
          metalness={0.65}
          roughness={0.21}
        />
      </mesh>

      <mesh
        position={[
          direction *
            0.405,
          0,
          0,
        ]}
      >
        <boxGeometry
          args={[
            0.045,
            2.18,
            0.12,
          ]}
        />

        <meshStandardMaterial
          color="#88a633"
          emissive="#668122"
          emissiveIntensity={0.12}
        />
      </mesh>

      <mesh
        position={[
          direction *
            -0.08,
          0,
          0.15,
        ]}
      >
        <boxGeometry
          args={[
            0.22,
            1.58,
            0.15,
          ]}
        />

        <meshStandardMaterial
          color="#071008"
          metalness={0.78}
          roughness={0.18}
        />
      </mesh>

      <mesh
        position={[
          0,
          0.88,
          0.13,
        ]}
      >
        <boxGeometry
          args={[
            0.42,
            0.04,
            0.02,
          ]}
        />

        <meshBasicMaterial
          color="#a9ba6c"
          transparent
          opacity={0.25}
        />
      </mesh>

      <mesh
        position={[
          0,
          -0.9,
          0.13,
        ]}
      >
        <boxGeometry
          args={[
            0.42,
            0.04,
            0.02,
          ]}
        />

        <meshBasicMaterial
          color="#8062d5"
          transparent
          opacity={0.19}
        />
      </mesh>
    </group>
  );
}