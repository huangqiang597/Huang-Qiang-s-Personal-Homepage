"use client";

import { Html, PerspectiveCamera, useTexture } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

type HeadSceneProps = {
  reducedMotion: boolean;
  onReady?: () => void;
};

type TargetPointer = {
  x: number;
  y: number;
  active: boolean;
  strength?: number;
};

const DEG = Math.PI / 180;

const hairLocks = [
  { p: [-0.64, 0.84, 0.05], s: [0.34, 0.58, 0.32], r: [0.12, 0.04, 0.5] },
  { p: [-0.35, 1.08, 0.08], s: [0.38, 0.68, 0.36], r: [0.08, 0.03, 0.25] },
  { p: [0.02, 1.18, 0.06], s: [0.38, 0.7, 0.36], r: [-0.02, 0.05, -0.02] },
  { p: [0.38, 1.1, 0.03], s: [0.38, 0.65, 0.34], r: [-0.05, -0.03, -0.24] },
  { p: [0.67, 0.87, -0.01], s: [0.3, 0.56, 0.3], r: [-0.08, -0.06, -0.44] },
  { p: [-0.52, 1.34, -0.18], s: [0.34, 0.61, 0.33], r: [0.2, 0.14, 0.32] },
  { p: [-0.12, 1.48, -0.18], s: [0.4, 0.68, 0.37], r: [0.1, 0.1, 0.05] },
  { p: [0.31, 1.43, -0.2], s: [0.38, 0.65, 0.35], r: [-0.1, -0.06, -0.17] },
  { p: [0.58, 1.21, -0.22], s: [0.3, 0.55, 0.29], r: [-0.12, -0.08, -0.34] },
  { p: [-0.23, 0.89, 0.48], s: [0.23, 0.6, 0.2], r: [0.32, 0.08, 0.22] },
  { p: [0.13, 0.94, 0.5], s: [0.22, 0.57, 0.2], r: [0.3, -0.08, -0.06] },
  { p: [0.43, 0.85, 0.42], s: [0.2, 0.48, 0.18], r: [0.28, -0.1, -0.22] },
] as const;

const freckles = [
  [-0.43, 0.02, 0.77], [-0.32, -0.02, 0.81], [-0.22, 0.0, 0.83],
  [0.2, 0.01, 0.83], [0.31, -0.03, 0.81], [0.41, 0.03, 0.77],
  [-0.13, -0.09, 0.86], [0.08, -0.08, 0.87], [0.0, 0.02, 0.88],
] as const;

function makeFaceGeometry() {
  const geometry = new THREE.SphereGeometry(1, 64, 64);
  const base = geometry.attributes.position;
  const targets = Array.from({ length: 4 }, () => new Float32Array(base.array.length));

  for (let i = 0; i < base.count; i += 1) {
    const x = base.getX(i);
    const y = base.getY(i);
    const z = base.getZ(i);
    const offset = i * 3;

    for (const target of targets) {
      target[offset] = x;
      target[offset + 1] = y;
      target[offset + 2] = z;
    }

    if (z > 0.34 && y > 0.05) targets[2][offset + 1] = y + 0.018;
    if (z > 0.45 && y < -0.16) targets[3][offset + 1] = y + (1 - Math.abs(x)) * 0.022;
  }

  geometry.morphAttributes.position = targets.map(
    (target) => new THREE.Float32BufferAttribute(target, 3),
  );
  geometry.computeVertexNormals();
  return geometry;
}

function ProceduralHead({ reducedMotion }: HeadSceneProps) {
  const rootRef = useRef<THREE.Group>(null);
  const headBone = useRef<THREE.Group>(null);
  const leftEyeBone = useRef<THREE.Group>(null);
  const rightEyeBone = useRef<THREE.Group>(null);
  const leftEyeMesh = useRef<THREE.Mesh>(null);
  const rightEyeMesh = useRef<THREE.Mesh>(null);
  const faceMesh = useRef<THREE.Mesh>(null);
  const leftEarring = useRef<THREE.Group>(null);
  const rightEarring = useRef<THREE.Group>(null);
  const brows = useRef<THREE.Group>(null);
  const mouth = useRef<THREE.Group>(null);
  const pointerTarget = useRef<TargetPointer>({ x: 0, y: 0, active: false });
  const previousHeadY = useRef(0);
  const hoverTarget = useRef(0);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const blink = useRef({ left: 0, right: 0, leftTarget: 0, rightTarget: 0 });
  const faceGeometry = useMemo(makeFaceGeometry, []);
  const lowPerformance = useMemo(
    () => typeof navigator !== "undefined" && (navigator.hardwareConcurrency || 8) <= 4,
    [],
  );

  const runBlink = useCallback((doubleBlink = false) => {
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const close = () => {
      if (cancelled) return;
      blink.current.leftTarget = 1;
      blink.current.rightTarget = 1;
      timers.push(setTimeout(() => {
        blink.current.leftTarget = 0;
        blink.current.rightTarget = 0;
      }, 80));
    };

    close();
    if (doubleBlink) timers.push(setTimeout(close, 260));
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    let stopped = false;
    let timer: ReturnType<typeof setTimeout>;
    let cancelBlink = () => {};

    const schedule = () => {
      timer = setTimeout(() => {
        if (stopped) return;
        cancelBlink = runBlink(Math.random() < 0.18);
        schedule();
      }, 3000 + Math.random() * 4000);
    };

    schedule();
    return () => {
      stopped = true;
      clearTimeout(timer);
      cancelBlink();
    };
  }, [reducedMotion, runBlink]);

  useEffect(() => {
    const reset = () => {
      pointerTarget.current.active = false;
      pointerTarget.current.x = 0;
      pointerTarget.current.y = 0;
    };

    const onPointerMove = (event: PointerEvent) => {
      if (reducedMotion || window.innerWidth < 768) return;
      pointerTarget.current.active = true;
      pointerTarget.current.x = THREE.MathUtils.clamp((event.clientX / window.innerWidth) * 2 - 1, -1, 1);
      pointerTarget.current.y = THREE.MathUtils.clamp((event.clientY / window.innerHeight) * 2 - 1, -1, 1);
    };

    const onOrientation = (event: DeviceOrientationEvent) => {
      if (reducedMotion || window.innerWidth >= 768 || event.gamma == null || event.beta == null) return;
      pointerTarget.current.active = true;
      pointerTarget.current.x = THREE.MathUtils.clamp(event.gamma / 35, -1, 1) * 0.45;
      pointerTarget.current.y = THREE.MathUtils.clamp((event.beta - 45) / 35, -1, 1) * 0.35;
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("deviceorientation", onOrientation, { passive: true });
    window.addEventListener("blur", reset);
    document.documentElement.addEventListener("mouseleave", reset);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("deviceorientation", onOrientation);
      window.removeEventListener("blur", reset);
      document.documentElement.removeEventListener("mouseleave", reset);
    };
  }, [reducedMotion]);

  useEffect(() => {
    if (!faceMesh.current) return;
    faceMesh.current.morphTargetDictionary = {
      BlinkLeft: 0,
      BlinkRight: 1,
      BrowRaise: 2,
      Smile: 3,
    };
    faceMesh.current.morphTargetInfluences = [0, 0, 0, 0];
  }, []);

  useFrame((state, delta) => {
    if (!rootRef.current || !headBone.current || !leftEyeBone.current || !rightEyeBone.current) return;

    const target = reducedMotion ? { x: 0, y: 0 } : pointerTarget.current;
    const headY = target.x * 10 * DEG;
    const headX = target.y * 6 * DEG;
    const eyeY = target.x * 6 * DEG;
    const eyeX = target.y * 4 * DEG;

    headBone.current.rotation.y = THREE.MathUtils.damp(headBone.current.rotation.y, headY, 4.7, delta);
    headBone.current.rotation.x = THREE.MathUtils.damp(headBone.current.rotation.x, headX, 4.7, delta);
    leftEyeBone.current.rotation.y = THREE.MathUtils.damp(leftEyeBone.current.rotation.y, eyeY, 10, delta);
    leftEyeBone.current.rotation.x = THREE.MathUtils.damp(leftEyeBone.current.rotation.x, eyeX, 10, delta);
    rightEyeBone.current.rotation.y = THREE.MathUtils.damp(rightEyeBone.current.rotation.y, eyeY, 10, delta);
    rightEyeBone.current.rotation.x = THREE.MathUtils.damp(rightEyeBone.current.rotation.x, eyeX, 10, delta);

    const floatY = reducedMotion ? 0 : Math.sin(state.clock.elapsedTime * Math.PI * 0.5) * 0.035;
    rootRef.current.position.x = THREE.MathUtils.damp(rootRef.current.position.x, target.x * 0.045, 5, delta);
    rootRef.current.position.y = THREE.MathUtils.damp(rootRef.current.position.y, floatY - target.y * 0.025, 5, delta);
    rootRef.current.position.z = THREE.MathUtils.damp(rootRef.current.position.z, hoverTarget.current * 0.08, 6, delta);
    const targetScale = 1 + hoverTarget.current * 0.03;
    rootRef.current.scale.setScalar(THREE.MathUtils.damp(rootRef.current.scale.x, targetScale, 6, delta));

    blink.current.left = THREE.MathUtils.damp(blink.current.left, blink.current.leftTarget, 24, delta);
    blink.current.right = THREE.MathUtils.damp(blink.current.right, blink.current.rightTarget, 24, delta);
    if (leftEyeMesh.current) leftEyeMesh.current.scale.y = Math.max(0.06, 1 - blink.current.left * 0.94);
    if (rightEyeMesh.current) rightEyeMesh.current.scale.y = Math.max(0.06, 1 - blink.current.right * 0.94);

    const expression = hoverTarget.current;
    if (brows.current) brows.current.position.y = THREE.MathUtils.damp(brows.current.position.y, expression * 0.035, 7, delta);
    if (mouth.current) {
      mouth.current.rotation.z = THREE.MathUtils.damp(mouth.current.rotation.z, expression * -0.025, 7, delta);
      mouth.current.scale.x = THREE.MathUtils.damp(mouth.current.scale.x, 1 + expression * 0.06, 7, delta);
    }

    if (faceMesh.current?.morphTargetInfluences) {
      faceMesh.current.morphTargetInfluences[0] = blink.current.left;
      faceMesh.current.morphTargetInfluences[1] = blink.current.right;
      faceMesh.current.morphTargetInfluences[2] = expression * 0.72;
      faceMesh.current.morphTargetInfluences[3] = expression * 0.52;
    }

    if (!lowPerformance && leftEarring.current && rightEarring.current) {
      const velocity = headBone.current.rotation.y - previousHeadY.current;
      const sway = THREE.MathUtils.clamp(-velocity * 2.4, -0.11, 0.11);
      leftEarring.current.rotation.z = THREE.MathUtils.damp(leftEarring.current.rotation.z, sway, 3.2, delta);
      rightEarring.current.rotation.z = THREE.MathUtils.damp(rightEarring.current.rotation.z, sway, 3.2, delta);
      previousHeadY.current = headBone.current.rotation.y;
    }
  });

  const handlePointerEnter = (event: { stopPropagation: () => void }) => {
    event.stopPropagation();
    if (reducedMotion) return;
    hoverTimer.current = setTimeout(() => {
      hoverTarget.current = 1;
    }, 500);
  };

  const handlePointerLeave = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTarget.current = 0;
  };

  return (
    <group ref={rootRef} position={[0, -0.2, 0]}>
      <group ref={headBone} name="Head" position={[0, -0.42, 0]}>
        <mesh
          position={[0, 0.28, 0]}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
        >
          <sphereGeometry args={[1.45, 32, 32]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>

        <mesh position={[0, -1.02, -0.05]} scale={[0.42, 0.56, 0.4]}>
          <cylinderGeometry args={[0.55, 0.7, 1.15, 40]} />
          <meshPhysicalMaterial color="#b9745f" roughness={0.48} clearcoat={0.08} />
        </mesh>

        <mesh ref={faceMesh} geometry={faceGeometry} scale={[0.82, 1.04, 0.78]} position={[0, 0.06, 0]}>
          <meshPhysicalMaterial
            color="#c88770"
            roughness={0.42}
            clearcoat={0.08}
            sheen={0.22}
            sheenColor={new THREE.Color("#8fa9d6")}
          />
        </mesh>

        <mesh position={[-0.82, 0.1, -0.02]} scale={[0.18, 0.27, 0.12]}>
          <sphereGeometry args={[1, 30, 30]} />
          <meshPhysicalMaterial color="#c37a67" roughness={0.48} />
        </mesh>
        <mesh position={[0.82, 0.1, -0.02]} scale={[0.18, 0.27, 0.12]}>
          <sphereGeometry args={[1, 30, 30]} />
          <meshPhysicalMaterial color="#c37a67" roughness={0.48} />
        </mesh>

        <group ref={leftEyeBone} name="LeftEye" position={[-0.3, 0.22, 0.69]}>
          <mesh ref={leftEyeMesh} scale={[0.22, 0.17, 0.12]}>
            <sphereGeometry args={[1, 36, 36]} />
            <meshPhysicalMaterial color="#f2eee8" roughness={0.22} clearcoat={0.28} />
            <mesh position={[0, -0.01, 0.9]} scale={[0.47, 0.59, 0.18]}>
              <sphereGeometry args={[1, 32, 32]} />
              <meshPhysicalMaterial color="#301a12" roughness={0.2} clearcoat={0.45} />
              <mesh position={[0, 0, 0.72]} scale={[0.42, 0.42, 0.2]}>
                <sphereGeometry args={[1, 24, 24]} />
                <meshBasicMaterial color="#050505" />
              </mesh>
            </mesh>
          </mesh>
        </group>
        <group ref={rightEyeBone} name="RightEye" position={[0.3, 0.22, 0.69]}>
          <mesh ref={rightEyeMesh} scale={[0.22, 0.17, 0.12]}>
            <sphereGeometry args={[1, 36, 36]} />
            <meshPhysicalMaterial color="#f2eee8" roughness={0.22} clearcoat={0.28} />
            <mesh position={[0, -0.01, 0.9]} scale={[0.47, 0.59, 0.18]}>
              <sphereGeometry args={[1, 32, 32]} />
              <meshPhysicalMaterial color="#301a12" roughness={0.2} clearcoat={0.45} />
              <mesh position={[0, 0, 0.72]} scale={[0.42, 0.42, 0.2]}>
                <sphereGeometry args={[1, 24, 24]} />
                <meshBasicMaterial color="#050505" />
              </mesh>
            </mesh>
          </mesh>
        </group>

        <group ref={brows} name="BrowRaise" position={[0, 0, 0]}>
          <mesh position={[-0.3, 0.52, 0.72]} rotation={[0.08, 0.04, -0.08]} scale={[0.31, 0.065, 0.075]}>
            <capsuleGeometry args={[0.5, 1.1, 8, 18]} />
            <meshStandardMaterial color="#11151b" roughness={0.65} />
          </mesh>
          <mesh position={[0.3, 0.52, 0.72]} rotation={[0.08, -0.04, 0.08]} scale={[0.31, 0.065, 0.075]}>
            <capsuleGeometry args={[0.5, 1.1, 8, 18]} />
            <meshStandardMaterial color="#11151b" roughness={0.65} />
          </mesh>
        </group>

        <mesh position={[0, -0.02, 0.83]} scale={[0.12, 0.24, 0.15]} rotation={[0.1, 0, 0]}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshPhysicalMaterial color="#b96f5d" roughness={0.44} />
        </mesh>

        <group ref={mouth} name="Smile" position={[0, -0.44, 0.73]}>
          <mesh scale={[0.28, 0.055, 0.06]}>
            <capsuleGeometry args={[0.5, 1.1, 8, 20]} />
            <meshPhysicalMaterial color="#7c3d3f" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.025, 0.035]} scale={[0.18, 0.018, 0.028]}>
            <capsuleGeometry args={[0.5, 1, 6, 16]} />
            <meshStandardMaterial color="#d58a88" roughness={0.5} />
          </mesh>
        </group>

        {freckles.map((position, index) => (
          <mesh key={index} position={position} scale={0.011 + (index % 3) * 0.003}>
            <sphereGeometry args={[1, 10, 10]} />
            <meshBasicMaterial color="#6b3f35" transparent opacity={0.65} />
          </mesh>
        ))}

        <group name="HairSecondaryMotion">
          {hairLocks.map((lock, index) => (
            <mesh
              key={index}
              position={lock.p}
              scale={lock.s}
              rotation={lock.r}
            >
              <capsuleGeometry args={[0.55, 1.2, 12, 24]} />
              <meshPhysicalMaterial
                color={index % 3 === 0 ? "#121b29" : "#0a0d13"}
                roughness={0.3}
                metalness={0.15}
                clearcoat={0.42}
                clearcoatRoughness={0.25}
              />
            </mesh>
          ))}
        </group>

        <group ref={leftEarring} name="EarringLeft" position={[-0.89, -0.14, 0.05]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.16, 0.018, 12, 40]} />
            <meshPhysicalMaterial color="#d7e2ea" metalness={0.95} roughness={0.18} />
          </mesh>
        </group>
        <group ref={rightEarring} name="EarringRight" position={[0.89, -0.14, 0.05]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.16, 0.018, 12, 40]} />
            <meshPhysicalMaterial color="#d7e2ea" metalness={0.95} roughness={0.18} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

function LoadingFallback() {
  return (
    <Html center>
      <div className="head-loader">LOADING HEAD RIG</div>
    </Html>
  );
}

function AvatarPlane({ reducedMotion }: HeadSceneProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const pointerTarget = useRef<TargetPointer>({ x: 0, y: 0, active: false });
  const hoverTarget = useRef(0);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const texture = useTexture("/images/huang-qiang-avatar-cutout.png");
  const lastAvoidance = useRef({ x: 0, y: -1 });

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    texture.needsUpdate = true;
  }, [texture]);

  useEffect(() => {
    const reset = () => {
      pointerTarget.current.active = false;
      pointerTarget.current.x = 0;
      pointerTarget.current.y = 0;
      pointerTarget.current.strength = 0;
      if (hoverTimer.current) clearTimeout(hoverTimer.current);
      hoverTarget.current = 0;
    };

    const onPointerMove = (event: PointerEvent) => {
      if (reducedMotion || window.innerWidth < 768) return;
      const centerX = window.innerWidth * 0.5;
      const centerY = window.innerHeight * 0.5;
      const deltaX = event.clientX - centerX;
      const deltaY = event.clientY - centerY;
      const distance = Math.hypot(deltaX, deltaY);
      const radius = THREE.MathUtils.clamp(window.innerWidth * 0.25, 280, 440);
      const rawStrength = 1 - THREE.MathUtils.clamp(distance / radius, 0, 1);
      const strength = rawStrength * rawStrength * (3 - 2 * rawStrength);

      if (distance > 1) {
        lastAvoidance.current.x = -deltaX / distance;
        lastAvoidance.current.y = -deltaY / distance;
      }

      pointerTarget.current.active = true;
      pointerTarget.current.x = lastAvoidance.current.x * strength;
      pointerTarget.current.y = lastAvoidance.current.y * strength;
      pointerTarget.current.strength = strength;

      if (strength > 0.56) {
        if (!hoverTimer.current && hoverTarget.current === 0) {
          hoverTimer.current = setTimeout(() => {
            hoverTarget.current = 1;
            hoverTimer.current = null;
          }, 500);
        }
      } else {
        if (hoverTimer.current) clearTimeout(hoverTimer.current);
        hoverTimer.current = null;
        hoverTarget.current = 0;
      }
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("blur", reset);
    document.documentElement.addEventListener("mouseleave", reset);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("blur", reset);
      document.documentElement.removeEventListener("mouseleave", reset);
      if (hoverTimer.current) clearTimeout(hoverTimer.current);
    };
  }, [reducedMotion]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const target = reducedMotion ? { x: 0, y: 0 } : pointerTarget.current;
    const targetRotationY = target.x * 10 * DEG;
    const targetRotationX = target.y * 6 * DEG;
    const floatY = reducedMotion
      ? 0
      : Math.sin(state.clock.elapsedTime * Math.PI * 0.5) * 0.028;
    const response = (pointerTarget.current.strength ?? 0) > 0.02 ? 7.2 : 3.4;

    meshRef.current.rotation.y = THREE.MathUtils.damp(
      meshRef.current.rotation.y,
      targetRotationY,
      response,
      delta,
    );
    meshRef.current.rotation.x = THREE.MathUtils.damp(
      meshRef.current.rotation.x,
      targetRotationX,
      response,
      delta,
    );
    meshRef.current.position.x = THREE.MathUtils.damp(
      meshRef.current.position.x,
      target.x * 0.09,
      response,
      delta,
    );
    meshRef.current.position.y = THREE.MathUtils.damp(
      meshRef.current.position.y,
      floatY + target.y * 0.055,
      response,
      delta,
    );
    meshRef.current.position.z = THREE.MathUtils.damp(
      meshRef.current.position.z,
      hoverTarget.current * 0.08,
      6,
      delta,
    );
    const scale = THREE.MathUtils.damp(
      meshRef.current.scale.x,
      1 + hoverTarget.current * 0.03,
      6,
      delta,
    );
    meshRef.current.scale.setScalar(scale);
  });

  const handlePointerEnter = (event: { stopPropagation: () => void }) => {
    event.stopPropagation();
    if (reducedMotion) return;
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => {
      hoverTarget.current = 1;
    }, 500);
  };

  const handlePointerLeave = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTarget.current = 0;
  };

  return (
    <mesh
      ref={meshRef}
      position={[0, 0, 0]}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      <planeGeometry args={[3.05, 4.575, 1, 1]} />
      <meshBasicMaterial
        map={texture}
        toneMapped={false}
        transparent
        alphaTest={0.02}
        depthWrite={false}
      />
    </mesh>
  );
}

function SceneReady({ onReady }: { onReady?: () => void }) {
  const notified = useRef(false);

  useFrame(() => {
    if (notified.current) return;
    notified.current = true;
    onReady?.();
  });

  return null;
}

export default function HeadScene({ reducedMotion, onReady }: HeadSceneProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const update = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", update);
    update();
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop={visible ? "always" : "never"}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      shadows={false}
    >
      <PerspectiveCamera makeDefault fov={30} position={[0, 0, 9]} />
      <Suspense fallback={<LoadingFallback />}>
        <AvatarPlane reducedMotion={reducedMotion} />
        <SceneReady onReady={onReady} />
      </Suspense>
    </Canvas>
  );
}
