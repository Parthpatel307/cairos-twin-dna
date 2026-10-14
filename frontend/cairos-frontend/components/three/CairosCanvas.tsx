"use client";

import {
  Suspense,
  type ReactNode,
} from "react";

import {
  Canvas,
} from "@react-three/fiber";

import {
  AdaptiveDpr,
} from "@react-three/drei";

import SceneEnvironment from "@/components/three/SceneEnvironment";

interface CairosCanvasProps {
  children:
    ReactNode;

  className?:
    string;
}

export default function CairosCanvas({
  children,
  className = "",
}: CairosCanvasProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <Canvas
        dpr={[
          0.75,
          1.05,
        ]}
        shadows={false}
        camera={{
          position: [
            0,
            0.2,
            7.7,
          ],

          fov: 38,

          near: 0.1,

          far: 55,
        }}
        gl={{
          alpha: true,
          antialias: false,
          powerPreference:
            "high-performance",
          stencil: false,
          depth: true,
          precision:
            "mediump",
        }}
        performance={{
          min: 0.55,
          max: 1,
          debounce: 220,
        }}
        onCreated={({
          gl,
        }) => {
          gl.setClearColor(
            "#000000",
            0
          );
        }}
      >
        <AdaptiveDpr
          pixelated={false}
        />

        <Suspense
          fallback={null}
        >
          <SceneEnvironment />

          {children}
        </Suspense>
      </Canvas>
    </div>
  );
}