"use client";

export default function SceneEnvironment() {
  return (
    <>
      <fog
        attach="fog"
        args={[
          "#e5e9e2",
          18,
          34,
        ]}
      />

      <ambientLight
        intensity={0.72}
      />

      <hemisphereLight
        intensity={0.8}
        color="#ffffff"
        groundColor="#899184"
      />

      <directionalLight
        position={[
          5,
          7,
          6,
        ]}
        intensity={1.45}
        color="#ffffff"
      />

      <directionalLight
        position={[
          -4,
          1,
          5,
        ]}
        intensity={0.3}
        color="#cfe78f"
      />

      <pointLight
        position={[
          4,
          2,
          3,
        ]}
        intensity={2.2}
        distance={8}
        color="#9f8ee7"
      />

      <pointLight
        position={[
          -3,
          -1,
          4,
        ]}
        intensity={2.5}
        distance={8}
        color="#a5ca45"
      />
    </>
  );
}