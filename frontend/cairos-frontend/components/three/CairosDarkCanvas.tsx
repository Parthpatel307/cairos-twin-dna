"use client";

import {
  type ReactNode,
  useState,
} from "react";

import {
  Canvas,
} from "@react-three/fiber";

import {
  PerformanceMonitor,
  Preload,
} from "@react-three/drei";

interface CairosDarkCanvasProps {
  children: ReactNode;
  className?: string;
}

export default function CairosDarkCanvas({
  children,
  className = "",
}: CairosDarkCanvasProps) {
  const [
    dpr,
    setDpr,
  ] =
    useState(1.25);

  return (
    <div
      className={`pointer-events-none absolute inset-0 ${className}`}
    >
      <Canvas
        dpr={[
          1,
          dpr,
        ]}
        camera={{
          position: [
            0,
            0,
            7.8,
          ],

          fov: 36,

          near: 0.1,

          far: 50,
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference:
            "high-performance",
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
        <PerformanceMonitor
          onIncline={() =>
            setDpr(
              1.5
            )
          }
          onDecline={() =>
            setDpr(
              1
            )
          }
        />

        <ambientLight
          intensity={0.58}
          color="#a4bb82"
        />

        <directionalLight
          position={[
            4,
            5,
            7,
          ]}
          intensity={2}
          color="#d9ee9b"
        />

        <directionalLight
          position={[
            -5,
            1,
            4,
          ]}
          intensity={1.1}
          color="#244b2d"
        />

        <pointLight
          position={[
            0,
            2,
            4,
          ]}
          intensity={2.2}
          color="#c9ed52"
          distance={8}
        />

        <pointLight
          position={[
            3,
            -1,
            2,
          ]}
          intensity={1.3}
          color="#7254cd"
          distance={7}
        />

        {children}

        <Preload all />
      </Canvas>
    </div>
  );
}