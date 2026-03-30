import { Float, Line, Text } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { memo, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useTheme } from "../../context/ThemeContext";
import { canRenderThree } from "../../utils/performance";

const CODE_FRAGMENTS = [
  "const sage =",
  "await index()",
  "embeddings.query()",
  "vector.similarity()",
  "repo.clone()",
  "RAG.chain()",
  "gemini.generate()",
  "chroma.search()",
  "langchain.pipe()",
  "useFrame(() => {})",
  "cache.hit(userId)",
  "chunk.metadata.repoId",
  "asyncHandler(route)",
  "theme.toggle()",
  "stream: true"
];

function CameraRig() {
  const { camera, pointer } = useThree();

  useFrame(() => {
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 0.5, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, pointer.y * -0.3, 0.05);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function SceneContent() {
  const { isDark } = useTheme();
  const particleMaterialRef = useRef();
  const dodecahedronMaterialRef = useRef();
  const fragmentsRef = useRef([]);
  const groupRef = useRef();

  const particles = useMemo(
    () =>
      Array.from({ length: 300 }, () => [
        THREE.MathUtils.randFloatSpread(40),
        THREE.MathUtils.randFloatSpread(40),
        THREE.MathUtils.randFloatSpread(40)
      ]),
    []
  );

  const connections = useMemo(() => {
    const lines = [];

    for (let index = 0; index < particles.length; index += 1) {
      for (let next = index + 1; next < particles.length; next += 1) {
        const first = new THREE.Vector3(...particles[index]);
        const second = new THREE.Vector3(...particles[next]);
        const distance = first.distanceTo(second);

        if (distance <= 3.5 && lines.length < 420) {
          lines.push({
            points: [particles[index], particles[next]],
            opacity: THREE.MathUtils.clamp(1 - distance / 3.5, 0.12, 0.65)
          });
        }
      }
    }

    return lines;
  }, [particles]);

  const fragmentPositions = useMemo(
    () =>
      CODE_FRAGMENTS.map((label, index) => ({
        label,
        position: [
          THREE.MathUtils.randFloatSpread(18),
          THREE.MathUtils.randFloatSpread(12),
          THREE.MathUtils.randFloatSpread(12)
        ],
        speed: 0.15 + index * 0.01
      })),
    []
  );

  useEffect(
    () => () => {
      particleMaterialRef.current?.dispose?.();
      dodecahedronMaterialRef.current?.dispose?.();
    },
    []
  );

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0015;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.12) * 0.4;
    }

    if (particleMaterialRef.current) {
      particleMaterialRef.current.color.lerp(new THREE.Color(isDark ? "#00ff88" : "#6366f1"), 0.05);
    }

    if (dodecahedronMaterialRef.current) {
      dodecahedronMaterialRef.current.color.lerp(new THREE.Color(isDark ? "#00ff88" : "#6366f1"), 0.05);
      dodecahedronMaterialRef.current.emissive.lerp(new THREE.Color(isDark ? "#003322" : "#e0e7ff"), 0.05);
    }

    fragmentsRef.current.forEach((fragment, index) => {
      if (!fragment) {
        return;
      }

      fragment.rotation.y += 0.001 * (index + 1);
    });
  });

  return (
    <group ref={groupRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particles.length}
            array={new Float32Array(particles.flat())}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial ref={particleMaterialRef} size={0.05} color={isDark ? "#00ff88" : "#6366f1"} transparent opacity={0.9} />
      </points>

      {connections.map((connection, index) => (
        <Line
          key={`${connection.points[0].join("-")}-${index}`}
          points={connection.points}
          color={isDark ? "#1a3a2a" : "#e0e7ff"}
          transparent
          opacity={connection.opacity}
          lineWidth={0.5}
        />
      ))}

      {fragmentPositions.map((fragment, index) => (
        <Float key={fragment.label} speed={fragment.speed} rotationIntensity={0.2} floatIntensity={0.35}>
          <Text
            ref={(element) => {
              fragmentsRef.current[index] = element;
            }}
            position={fragment.position}
            fontSize={0.18}
            color={isDark ? "#00ff88" : "#4f46e5"}
            fillOpacity={0.15}
            anchorX="center"
            anchorY="middle"
          >
            {fragment.label}
          </Text>
        </Float>
      ))}

      <mesh position={[0, -4.5, 0]}>
        <dodecahedronGeometry args={[2.5, 0]} />
        <meshStandardMaterial
          ref={dodecahedronMaterialRef}
          wireframe
          color={isDark ? "#00ff88" : "#6366f1"}
          emissive={isDark ? "#003322" : "#e0e7ff"}
        />
      </mesh>
    </group>
  );
}

function ParticleField() {
  const { isDark } = useTheme();

  if (!canRenderThree()) {
    return (
      <div
        className={`pointer-events-none fixed inset-0 -z-10 animate-ambient-gradient ${
          isDark
            ? "bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.2),transparent_28%),linear-gradient(180deg,rgba(3,7,18,0.92),rgba(3,7,18,1))]"
            : "bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.14),transparent_28%),linear-gradient(180deg,rgba(248,250,252,0.8),rgba(248,250,252,1))]"
        }`}
      />
    );
  }

  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 12], fov: 55 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[8, 8, 8]} intensity={1.1} />
        <CameraRig />
        <SceneContent />
      </Canvas>
    </div>
  );
}

export default memo(ParticleField);
