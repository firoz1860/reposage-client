import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { motion, useReducedMotion } from "framer-motion";
import { memo, useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import logo from "../../assets/logo.svg";

function GalaxyPoints() {
  const { camera } = useThree();
  const reducedMotion = useReducedMotion();

  const particles = useMemo(() => {
    const values = [];

    for (let index = 0; index < 500; index += 1) {
      const angle = index * 0.36;
      const radius = 0.08 * index;
      values.push(radius * Math.cos(angle), radius * Math.sin(angle), THREE.MathUtils.randFloatSpread(2));
    }

    return new Float32Array(values);
  }, []);

  useFrame((state) => {
    if (reducedMotion) {
      return;
    }

    camera.position.z = THREE.MathUtils.lerp(camera.position.z, 4, 0.015);
    camera.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.04;
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={particles.length / 3} array={particles} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#00ff88" size={0.05} transparent opacity={0.9} />
    </points>
  );
}

function LoginLoader() {
  const [visibleText, setVisibleText] = useState("");
  const reducedMotion = useReducedMotion();
  const text = "Connecting to GitHub...";

  useEffect(() => {
    let index = 0;
    const intervalId = window.setInterval(() => {
      index += 1;
      setVisibleText(text.slice(0, index));

      if (index >= text.length) {
        window.clearInterval(intervalId);
      }
    }, 60);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <div className="fixed inset-0 z-[90] overflow-hidden bg-[#020711]">
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
          <GalaxyPoints />
        </Canvas>
      </div>

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <motion.img
          src={logo}
          alt="RepoSage"
          initial={reducedMotion ? false : { scale: 0, rotate: -180 }}
          animate={reducedMotion ? { opacity: 1 } : { scale: 1, rotate: 0 }}
          transition={reducedMotion ? { duration: 0 } : { type: "spring", duration: 0.8 }}
          className="h-24 w-24 rounded-3xl"
        />
        <p className="mt-8 font-mono text-xl text-white">{visibleText}</p>
        <div className="mt-8 h-[3px] w-full max-w-sm overflow-hidden rounded-full bg-white/10">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.5, ease: "linear" }}
            className="relative h-full bg-[linear-gradient(90deg,#00ff88,#38bdf8)]"
          >
            <motion.span
              animate={{ x: ["-120%", "180%"] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.1, ease: "linear" }}
              className="absolute inset-y-0 w-12 bg-white/40 blur-md"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default memo(LoginLoader);
