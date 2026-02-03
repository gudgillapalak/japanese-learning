import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useMemo, useRef, Suspense, useEffect } from "react";
import gsap from "gsap";

import petalTexture from "./assets/petal.png"; // ✅ IMPORT FROM SRC

function Petals() {
  const texture = useTexture(petalTexture); // ✅ SAFE
  const group = useRef();
  const wind = useRef({ strength: 0 });
  const mouse = useRef({ x: 0, y: 0 });

  /* ================= MOUSE + WIND ================= */
  useEffect(() => {
    const onMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener("mousemove", onMove);

    const gust = () => {
      gsap.fromTo(
        wind.current,
        { strength: 0 },
        {
          strength: THREE.MathUtils.randFloat(1.5, 3),
          duration: 1,
          yoyo: true,
          repeat: 1,
        }
      );
    };

    gust();
    const i = setInterval(gust, 6000);

    return () => {
      window.removeEventListener("mousemove", onMove);
      clearInterval(i);
    };
  }, []);

  /* ================= PETAL DATA ================= */
  const petals = useMemo(
    () =>
      Array.from({ length: 120 }).map(() => ({
        x: THREE.MathUtils.randFloatSpread(18),
        y: THREE.MathUtils.randFloat(6, 14),
        z: THREE.MathUtils.randFloat(-6, 2),
        fall: THREE.MathUtils.randFloat(0.8, 1.6),
        sway: THREE.MathUtils.randFloat(0.4, 1),
        rot: THREE.MathUtils.randFloat(0.4, 1.2),
        size: THREE.MathUtils.randFloat(0.12, 0.24),
        opacity: THREE.MathUtils.randFloat(0.5, 0.9),
      })),
    []
  );

  /* ================= ANIMATION ================= */
  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    group.current.children.forEach((p, i) => {
      const d = petals[i];
      p.position.y -= d.fall * delta;
      p.position.x +=
        (Math.sin(t + i) * d.sway + wind.current.strength) * delta;
      p.position.x += mouse.current.x * 0.002;
      p.position.y += mouse.current.y * 0.002;
      p.rotation.z += d.rot * delta;
      if (p.position.y < -8) p.position.y = 12;
    });
  });

  return (
    <group ref={group}>
      {petals.map((p, i) => (
        <sprite
          key={i}
          position={[p.x, p.y, p.z]}
          scale={[p.size, p.size, p.size]}
        >
          <spriteMaterial
            map={texture}
            transparent
            opacity={p.opacity}
            depthWrite={false}
          />
        </sprite>
      ))}
    </group>
  );
}

export default function SakuraScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 55 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1,
        pointerEvents: "none",
      }}
      gl={{ alpha: true }}
    >
      <ambientLight intensity={1.2} />
      <Suspense fallback={null}>
        <Petals />
      </Suspense>
    </Canvas>
  );
}
