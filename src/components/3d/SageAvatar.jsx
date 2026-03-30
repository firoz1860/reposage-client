import { Canvas, useFrame } from "@react-three/fiber";
import { memo, useEffect, useRef } from "react";
import * as THREE from "three";
import { a, useSpring } from "@react-spring/three";
import { useTheme } from "../../context/ThemeContext";
import { canRenderThree } from "../../utils/performance";

function AvatarMesh({ avatarState, isDark }) {
  const meshRef = useRef();
  const materialRef = useRef();
  const lightRef = useRef();

  const spring = useSpring({
    scale: avatarState === "done" ? 1.3 : 1,
    config: { tension: 280, friction: 18 }
  });

  useEffect(
    () => () => {
      meshRef.current?.geometry?.dispose?.();
      materialRef.current?.dispose?.();
    },
    []
  );

  useFrame((state) => {
    if (!meshRef.current || !materialRef.current) {
      return;
    }

    const elapsed = state.clock.elapsedTime;
    const isThinking = avatarState === "thinking";
    const baseRotation = isThinking ? 0.04 : 0.005;

    meshRef.current.rotation.x += baseRotation;
    meshRef.current.rotation.y += baseRotation;

    if (isThinking) {
      const pulse = 1 + Math.sin(elapsed * 4) * 0.15;
      meshRef.current.scale.setScalar(pulse);
      lightRef.current.position.set(Math.sin(elapsed * 2) * 2.2, Math.cos(elapsed * 2) * 2.2, 2);
    } else {
      meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.12);
      lightRef.current.position.set(0, 0, 2);
    }

    const targetColor = avatarState === "thinking" ? "#ffaa00" : isDark ? "#00ff88" : "#6366f1";
    materialRef.current.color.lerp(new THREE.Color(targetColor), 0.08);
    materialRef.current.emissive.lerp(new THREE.Color(isDark ? "#04281a" : "#dbeafe"), 0.08);
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight ref={lightRef} intensity={1.4} color={avatarState === "thinking" ? "#ffaa00" : "#ffffff"} position={[0, 0, 2]} />
      <a.mesh ref={meshRef} scale={spring.scale}>
        <icosahedronGeometry args={[1, 1]} />
        <meshPhongMaterial ref={materialRef} color={isDark ? "#00ff88" : "#6366f1"} emissive={isDark ? "#04281a" : "#dbeafe"} shininess={80} />
      </a.mesh>
    </>
  );
}

function SageAvatar({ avatarState = "idle" }) {
  const { isDark } = useTheme();

  if (!canRenderThree()) {
    return (
      <div className="flex h-[120px] w-[120px] items-center justify-center rounded-3xl border border-emerald-400/20 bg-emerald-400/10 text-xs uppercase tracking-[0.25em] text-emerald-300">
        Sage
      </div>
    );
  }

  return (
    <div className="h-[120px] w-[120px] overflow-hidden rounded-3xl border border-white/10 bg-[#050816]">
      <Canvas camera={{ position: [0, 0, 3.5], fov: 45 }}>
        <AvatarMesh avatarState={avatarState} isDark={isDark} />
      </Canvas>
    </div>
  );
}

export default memo(SageAvatar);
