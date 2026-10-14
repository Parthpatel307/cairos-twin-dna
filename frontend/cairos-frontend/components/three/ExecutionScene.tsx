"use client";

import {
  useMemo,
  useRef,
} from "react";

import {
  Line,
  Sparkles,
} from "@react-three/drei";

import {
  useFrame,
} from "@react-three/fiber";

import * as THREE from "three";

export type ExecutionSceneState =
  | "READY"
  | "RUNNING"
  | "FAILED";

interface ExecutionSceneProps {
  state: ExecutionSceneState;
  activeStage: number;
}

export default function ExecutionScene({
  state,
  activeStage,
}: ExecutionSceneProps) {
  const tunnel =
    useRef<THREE.Group | null>(
      null
    );

  const packet =
    useRef<THREE.Mesh | null>(
      null
    );

  const mutationCore =
    useRef<THREE.Mesh | null>(
      null
    );

  const progress =
    useRef(0.04);

  const failed =
    state === "FAILED";

  const running =
    state === "RUNNING";

  const path =
    useMemo(
      () =>
        new THREE.CatmullRomCurve3([
          new THREE.Vector3(
            0,
            0.15,
            3
          ),

          new THREE.Vector3(
            -0.25,
            0.12,
            1.8
          ),

          new THREE.Vector3(
            0.2,
            0.05,
            0.6
          ),

          new THREE.Vector3(
            0,
            0,
            -1
          ),

          new THREE.Vector3(
            0.1,
            -0.05,
            -2.2
          ),

          new THREE.Vector3(
            0,
            0,
            -3.6
          ),
        ]),
      []
    );

  const targetProgress =
    failed
      ? 0.98
      : !running
        ? 0.04
        : activeStage <= 0
          ? 0.18
          : activeStage === 1
            ? 0.42
            : activeStage === 2
              ? 0.68
              : 0.92;

  useFrame(
    (
      frame,
      delta
    ) => {
      const time =
        frame.clock
          .elapsedTime;

      if (tunnel.current) {
        tunnel.current.rotation.z +=
          delta *
          (
            running
              ? 0.075
              : failed
                ? 0.025
                : 0.015
          );
      }

      progress.current =
        THREE.MathUtils.lerp(
          progress.current,
          targetProgress,
          Math.min(
            1,
            delta * 1.8
          )
        );

      if (packet.current) {
        const point =
          path.getPoint(
            progress.current
          );

        packet.current.position.copy(
          point
        );

        const pulse =
          1 +
          Math.sin(
            time * 5
          ) *
            (
              running
                ? 0.16
                : 0.05
            );

        packet.current.scale.setScalar(
          pulse
        );
      }

      if (
        mutationCore.current
      ) {
        mutationCore.current.rotation.x +=
          delta *
          (
            running
              ? 0.45
              : 0.12
          );

        mutationCore.current.rotation.y +=
          delta *
          (
            running
              ? 0.7
              : 0.18
          );

        const pulse =
          failed
            ? 1.12 +
              Math.sin(
                time * 4
              ) *
                0.06
            : activeStage >= 2
              ? 1 +
                Math.sin(
                  time * 3
                ) *
                  0.045
              : 1;

        mutationCore.current.scale.setScalar(
          pulse
        );
      }
    }
  );

  return (
    <group>
      {/* =====================================
          ATMOSPHERE
      ===================================== */}

      <pointLight
        position={[
          0,
          1,
          3,
        ]}
        intensity={
          running
            ? 22
            : 12
        }
        distance={8}
        color="#d6ff4f"
      />

      <pointLight
        position={[
          0,
          0,
          -1,
        ]}
        intensity={
          failed
            ? 38
            : activeStage >= 2
              ? 18
              : 8
        }
        distance={7}
        color={
          failed
            ? "#ff6969"
            : "#ffe56b"
        }
      />

      <pointLight
        position={[
          2.8,
          1,
          -3,
        ]}
        intensity={
          failed
            ? 20
            : 7
        }
        distance={6}
        color={
          failed
            ? "#ff7474"
            : "#d6b3ff"
        }
      />

      <Sparkles
        count={
          failed
            ? 100
            : running
              ? 75
              : 35
        }
        scale={[
          7,
          4,
          9,
        ]}
        size={
          running
            ? 1.3
            : 0.9
        }
        speed={
          failed
            ? 0.6
            : running
              ? 0.42
              : 0.12
        }
        opacity={0.24}
        color={
          failed
            ? "#ff8c8c"
            : "#d6ff4f"
        }
      />

      {/* =====================================
          EXECUTION TUNNEL
      ===================================== */}

      <group ref={tunnel}>
        {Array.from({
          length: 14,
        }).map(
          (
            _,
            index
          ) => {
            const z =
              3.2 -
              index *
                0.52;

            const size =
              2.35 -
              index *
                0.045;

            const important =
              index === 7 ||
              index === 8;

            return (
              <mesh
                key={
                  index
                }
                position={[
                  0,
                  0,
                  z,
                ]}
                rotation={[
                  0,
                  0,
                  index *
                    0.12,
                ]}
              >
                <torusGeometry
                  args={[
                    size,
                    important
                      ? 0.018
                      : 0.009,
                    8,
                    90,
                  ]}
                />

                <meshBasicMaterial
                  color={
                    failed &&
                    index >=
                      7
                      ? "#ff7777"
                      : important
                        ? "#ffe56b"
                        : "#d6ff4f"
                  }
                  transparent
                  opacity={
                    important
                      ? 0.28
                      : 0.07 +
                        index *
                          0.004
                  }
                />
              </mesh>
            );
          }
        )}
      </group>

      {/* =====================================
          PATH
      ===================================== */}

      <Line
        points={[
          [
            0,
            0.15,
            3,
          ],
          [
            -0.25,
            0.12,
            1.8,
          ],
          [
            0.2,
            0.05,
            0.6,
          ],
          [
            0,
            0,
            -1,
          ],
          [
            0.1,
            -0.05,
            -2.2,
          ],
          [
            0,
            0,
            -3.6,
          ],
        ]}
        color={
          failed
            ? "#ff8a8a"
            : "#d6ff4f"
        }
        transparent
        opacity={
          running ||
          failed
            ? 0.42
            : 0.12
        }
        lineWidth={1}
        dashed
        dashSize={0.08}
        gapSize={0.08}
      />

      {/* =====================================
          AUTHORIZATION ENTRY GATE
      ===================================== */}

      <ExecutionNode
        position={[
          0,
          0.15,
          3,
        ]}
        color="#d6ff4f"
        active
      />

      {/* =====================================
          ENVIRONMENT GATE
      ===================================== */}

      <ExecutionNode
        position={[
          -0.25,
          0.12,
          1.25,
        ]}
        color="#d6ff4f"
        active={
          activeStage >=
            1 ||
          failed
        }
      />

      {/* =====================================
          MUTATION CORE
      ===================================== */}

      <group
        position={[
          0,
          0,
          -1,
        ]}
      >
        <mesh
          ref={
            mutationCore
          }
        >
          <octahedronGeometry
            args={[
              0.43,
              2,
            ]}
          />

          <meshStandardMaterial
            color={
              failed
                ? "#2a0f0f"
                : "#17160c"
            }
            emissive={
              failed
                ? "#ff6262"
                : "#ffe56b"
            }
            emissiveIntensity={
              failed
                ? 2
                : activeStage >=
                    2
                  ? 1.1
                  : 0.3
            }
            metalness={0.92}
            roughness={0.18}
          />
        </mesh>

        <mesh
          scale={1.08}
        >
          <octahedronGeometry
            args={[
              0.43,
              1,
            ]}
          />

          <meshBasicMaterial
            color={
              failed
                ? "#ff7d7d"
                : "#ffe56b"
            }
            wireframe
            transparent
            opacity={
              failed
                ? 0.5
                : activeStage >=
                    2
                  ? 0.35
                  : 0.12
            }
          />
        </mesh>
      </group>

      {/* =====================================
          EXECUTION PACKET
      ===================================== */}

      <mesh ref={packet}>
        <sphereGeometry
          args={[
            0.105,
            24,
            24,
          ]}
        />

        <meshStandardMaterial
          color={
            failed
              ? "#ff8585"
              : "#d6ff4f"
          }
          emissive={
            failed
              ? "#ff6b6b"
              : "#d6ff4f"
          }
          emissiveIntensity={3.5}
          metalness={0.3}
          roughness={0.15}
        />
      </mesh>

      {/* =====================================
          DOWNSTREAM BRANCHES
      ===================================== */}

      <Line
        points={[
          [
            0,
            0,
            -1,
          ],
          [
            -1,
            0.45,
            -2,
          ],
          [
            -2.4,
            0.8,
            -3.15,
          ],
        ]}
        color={
          failed
            ? "#ff7d7d"
            : "#ffffff"
        }
        transparent
        opacity={
          failed
            ? 0.52
            : 0.08
        }
        lineWidth={1}
        dashed
      />

      <Line
        points={[
          [
            0,
            0,
            -1,
          ],
          [
            0,
            -0.55,
            -2,
          ],
          [
            0,
            -1,
            -3.3,
          ],
        ]}
        color={
          failed
            ? "#ff7d7d"
            : "#ffffff"
        }
        transparent
        opacity={
          failed
            ? 0.52
            : 0.08
        }
        lineWidth={1}
        dashed
      />

      <Line
        points={[
          [
            0,
            0,
            -1,
          ],
          [
            1,
            0.45,
            -2,
          ],
          [
            2.4,
            0.8,
            -3.15,
          ],
        ]}
        color={
          failed
            ? "#ff7d7d"
            : "#ffffff"
        }
        transparent
        opacity={
          failed
            ? 0.52
            : 0.08
        }
        lineWidth={1}
        dashed
      />

      {/* =====================================
          DOWNSTREAM NODES
      ===================================== */}

      <ExecutionNode
        position={[
          -2.4,
          0.8,
          -3.15,
        ]}
        color={
          failed
            ? "#ff7777"
            : "#8f9a88"
        }
        active={failed}
      />

      <ExecutionNode
        position={[
          0,
          -1,
          -3.3,
        ]}
        color={
          failed
            ? "#ff7777"
            : "#8f9a88"
        }
        active={failed}
      />

      <ExecutionNode
        position={[
          2.4,
          0.8,
          -3.15,
        ]}
        color={
          failed
            ? "#ff7777"
            : "#8f9a88"
        }
        active={failed}
      />

      {/* =====================================
          FAILURE SHOCKWAVE
      ===================================== */}

      {failed && (
        <>
          <FailureShockwave
            delay={0}
          />

          <FailureShockwave
            delay={0.33}
          />

          <FailureShockwave
            delay={0.66}
          />
        </>
      )}
    </group>
  );
}

function ExecutionNode({
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
              : 0.09,
            24,
            24,
          ]}
        />

        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={
            active
              ? 2.8
              : 0.3
          }
          metalness={0.5}
          roughness={0.18}
        />
      </mesh>

      {active && (
        <mesh
          scale={2.8}
        >
          <sphereGeometry
            args={[
              0.13,
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

function FailureShockwave({
  delay,
}: {
  delay: number;
}) {
  const mesh =
    useRef<THREE.Mesh | null>(
      null
    );

  const material =
    useRef<THREE.MeshBasicMaterial | null>(
      null
    );

  useFrame(
    (
      frame
    ) => {
      if (
        !mesh.current ||
        !material.current
      ) {
        return;
      }

      const progress =
        (
          frame.clock
            .elapsedTime *
            0.42 +
          delay
        ) %
        1;

      const scale =
        0.6 +
        progress *
          3.6;

      mesh.current.scale.setScalar(
        scale
      );

      material.current.opacity =
        (
          1 -
          progress
        ) *
        0.18;
    }
  );

  return (
    <mesh
      ref={mesh}
      position={[
        0,
        0,
        -1,
      ]}
    >
      <torusGeometry
        args={[
          0.75,
          0.014,
          8,
          160,
        ]}
      />

      <meshBasicMaterial
        ref={material}
        color="#ff7474"
        transparent
        opacity={0.15}
      />
    </mesh>
  );
}