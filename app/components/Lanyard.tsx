/* eslint-disable react/no-unknown-property */
"use client";

import { Environment, Lightformer, useGLTF, useTexture } from "@react-three/drei";
import { Canvas, extend, useFrame, type ThreeElement, type ThreeEvent } from "@react-three/fiber";
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
  type RapierRigidBody,
  type RigidBodyProps,
} from "@react-three/rapier";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import "./Lanyard.css";

extend({ MeshLineGeometry, MeshLineMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    meshLineGeometry: ThreeElement<typeof MeshLineGeometry>;
    meshLineMaterial: ThreeElement<typeof MeshLineMaterial>;
  }
}

const CARD_MODEL = "/models/lanyard/card.glb";
const DEFAULT_BAND = "/models/lanyard/lanyard.png";
const BLANK_PIXEL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

const FRONT_UV_RECT = { x: 0, y: 0, w: 0.5, h: 0.755 };
const BACK_UV_RECT = { x: 0.5, y: 0, w: 0.5, h: 0.757 };

type LanyardProps = {
  position?: [number, number, number];
  gravity?: [number, number, number];
  fov?: number;
  transparent?: boolean;
  frontImage?: string | null;
  backImage?: string | null;
  imageFit?: "cover" | "contain";
  lanyardImage?: string | null;
  lanyardWidth?: number;
  href: string;
  initialRotation?: number;
  ariaLabel: string;
  cardNumber?: string;
  cardCategory?: string;
  cardTitle?: string;
  cardSubtitle?: string;
  cardAccent?: string;
};

export default function Lanyard({
  position = [0, 0, 30],
  gravity = [0, -40, 0],
  fov = 20,
  transparent = true,
  frontImage = null,
  backImage = null,
  imageFit = "cover",
  lanyardImage = null,
  lanyardWidth = 1,
  href,
  initialRotation = 0,
  ariaLabel,
  cardNumber,
  cardCategory,
  cardTitle,
  cardSubtitle,
  cardAccent = "#78a8ff",
}: LanyardProps) {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 768,
  );
  const [pageVisible, setPageVisible] = useState(
    () => typeof document === "undefined" || !document.hidden,
  );
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    const handleVisibility = () => setPageVisible(!document.hidden);
    const handleMotion = () => setReducedMotion(media.matches);

    handleMotion();
    window.addEventListener("resize", handleResize, { passive: true });
    document.addEventListener("visibilitychange", handleVisibility);
    media.addEventListener("change", handleMotion);
    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibility);
      media.removeEventListener("change", handleMotion);
    };
  }, []);

  return (
    <div
      className="lanyard-wrapper"
      role="link"
      tabIndex={0}
      aria-label={ariaLabel}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          window.location.assign(href);
        }
      }}
    >
      <Canvas
        camera={{ position, fov }}
        dpr={[1, isMobile ? 1.15 : 1.4]}
        frameloop={pageVisible ? "always" : "never"}
        gl={{ alpha: transparent, antialias: !isMobile, powerPreference: "high-performance" }}
        onCreated={({ gl }) =>
          gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)
        }
      >
        <ambientLight intensity={Math.PI * 0.85} />
        <Suspense fallback={null}>
          <Physics
            gravity={gravity}
            timeStep={isMobile ? 1 / 30 : 1 / 60}
            paused={reducedMotion || !pageVisible}
          >
            <Band
              isMobile={isMobile}
              frontImage={frontImage}
              backImage={backImage}
              imageFit={imageFit}
              lanyardImage={lanyardImage}
              lanyardWidth={lanyardWidth}
              href={href}
              initialRotation={initialRotation}
              cardNumber={cardNumber}
              cardCategory={cardCategory}
              cardTitle={cardTitle}
              cardSubtitle={cardSubtitle}
              cardAccent={cardAccent}
            />
          </Physics>
          <Environment blur={0.72}>
            <Lightformer
              intensity={2.2}
              color="#dceaff"
              position={[0, -1, 5]}
              rotation={[0, 0, Math.PI / 3]}
              scale={[100, 0.1, 1]}
            />
            <Lightformer
              intensity={3.4}
              color="#a076ff"
              position={[-1, -1, 1]}
              rotation={[0, 0, Math.PI / 3]}
              scale={[100, 0.1, 1]}
            />
            <Lightformer
              intensity={3}
              color="#6aa8ff"
              position={[1, 1, 1]}
              rotation={[0, 0, Math.PI / 3]}
              scale={[100, 0.1, 1]}
            />
            <Lightformer
              intensity={9}
              color="white"
              position={[-10, 0, 14]}
              rotation={[0, Math.PI / 2, Math.PI / 3]}
              scale={[100, 10, 1]}
            />
          </Environment>
        </Suspense>
      </Canvas>
    </div>
  );
}

type BandProps = {
  maxSpeed?: number;
  minSpeed?: number;
  isMobile?: boolean;
  frontImage?: string | null;
  backImage?: string | null;
  imageFit?: "cover" | "contain";
  lanyardImage?: string | null;
  lanyardWidth?: number;
  href: string;
  initialRotation: number;
  cardNumber?: string;
  cardCategory?: string;
  cardTitle?: string;
  cardSubtitle?: string;
  cardAccent: string;
};

type LanyardRigidBody = RapierRigidBody & { lerped?: THREE.Vector3 };

function Band({
  maxSpeed = 50,
  minSpeed = 0,
  isMobile = false,
  frontImage = null,
  backImage = null,
  imageFit = "cover",
  lanyardImage = null,
  lanyardWidth = 1,
  href,
  initialRotation,
  cardNumber,
  cardCategory,
  cardTitle,
  cardSubtitle,
  cardAccent,
}: BandProps) {
  const band = useRef<
    THREE.Mesh<InstanceType<typeof MeshLineGeometry>, InstanceType<typeof MeshLineMaterial>>
  >(null!);
  const fixed = useRef<RapierRigidBody>(null!);
  const j1 = useRef<LanyardRigidBody>(null!);
  const j2 = useRef<LanyardRigidBody>(null!);
  const j3 = useRef<RapierRigidBody>(null!);
  const card = useRef<RapierRigidBody>(null!);

  const vec = useMemo(() => new THREE.Vector3(), []);
  const ang = useMemo(() => new THREE.Vector3(), []);
  const rot = useMemo(() => new THREE.Vector3(), []);
  const dir = useMemo(() => new THREE.Vector3(), []);
  const segmentProps: RigidBodyProps = {
    type: "dynamic",
    canSleep: true,
    colliders: false,
    angularDamping: 4,
    linearDamping: 4,
  };

  const { nodes, materials } = useGLTF(CARD_MODEL) as any;
  const texture = useTexture(lanyardImage || DEFAULT_BAND);
  const frontTexture = useTexture(frontImage || BLANK_PIXEL);
  const backTexture = useTexture(backImage || BLANK_PIXEL);

  const cardMap = useMemo(() => {
    const baseMap = materials.base.map as THREE.Texture;
    if (!frontImage && !backImage) return baseMap;

    const baseImage = baseMap.image as CanvasImageSource & { width: number; height: number };
    const canvas = document.createElement("canvas");
    canvas.width = baseImage.width;
    canvas.height = baseImage.height;
    const context = canvas.getContext("2d");
    if (!context) return baseMap;
    context.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

    const drawFitted = (
      image: CanvasImageSource & { width: number; height: number },
      rect: typeof FRONT_UV_RECT,
    ) => {
      const x = rect.x * canvas.width;
      const y = rect.y * canvas.height;
      const width = rect.w * canvas.width;
      const height = rect.h * canvas.height;
      const pickScale = imageFit === "contain" ? Math.min : Math.max;
      const scale = pickScale(width / image.width, height / image.height);
      const drawWidth = image.width * scale;
      const drawHeight = image.height * scale;
      context.save();
      context.beginPath();
      context.rect(x, y, width, height);
      context.clip();
      context.drawImage(
        image,
        x + (width - drawWidth) / 2,
        y + (height - drawHeight) / 2,
        drawWidth,
        drawHeight,
      );
      context.restore();
    };

    const hasCardCopy = Boolean(cardNumber || cardCategory || cardTitle || cardSubtitle);
    if (frontImage && frontTexture.image) {
      drawFitted(
        frontTexture.image as CanvasImageSource & { width: number; height: number },
        hasCardCopy ? { x: 0, y: 0, w: 0.5, h: 0.49 } : FRONT_UV_RECT,
      );
    }
    if (backImage && backTexture.image) {
      drawFitted(
        backTexture.image as CanvasImageSource & { width: number; height: number },
        BACK_UV_RECT,
      );
    }

    if (hasCardCopy) {
      const x = FRONT_UV_RECT.x * canvas.width;
      const y = 0.49 * canvas.height;
      const width = FRONT_UV_RECT.w * canvas.width;
      const height = (FRONT_UV_RECT.h - 0.49) * canvas.height;
      const padding = width * 0.065;
      const accent = cardAccent;

      context.fillStyle = "#090d14";
      context.fillRect(x, y, width, height);
      const sheen = context.createLinearGradient(x, y, x + width, y + height);
      sheen.addColorStop(0, "rgba(70, 101, 158, .18)");
      sheen.addColorStop(0.5, "rgba(13, 17, 25, 0)");
      sheen.addColorStop(1, "rgba(4, 6, 10, .68)");
      context.fillStyle = sheen;
      context.fillRect(x, y, width, height);
      context.strokeStyle = "rgba(194, 215, 235, .2)";
      context.lineWidth = Math.max(2, width * 0.0025);
      context.beginPath();
      context.moveTo(x + padding, y + height * 0.35);
      context.lineTo(x + width - padding, y + height * 0.35);
      context.stroke();

      context.textBaseline = "top";
      context.fillStyle = accent;
      context.font = `700 ${Math.round(width * 0.064)}px "Kanit", "Arial Black", sans-serif`;
      context.fillText(cardNumber || "", x + padding, y + height * 0.09);

      context.textAlign = "right";
      context.fillStyle = "rgba(181, 201, 220, .72)";
      context.font = `500 ${Math.round(width * 0.026)}px "Kanit", sans-serif`;
      context.fillText(cardCategory || "", x + width - padding, y + height * 0.14);

      context.textAlign = "left";
      context.fillStyle = "#e1e8ee";
      const titleSize = cardTitle && cardTitle.length > 9 ? width * 0.047 : width * 0.057;
      context.font = `600 ${Math.round(titleSize)}px "Kanit", "Microsoft YaHei", sans-serif`;
      const titleMaxWidth = width * 0.76;
      const titleChars = Array.from(cardTitle || "");
      const titleLines: string[] = [];
      let line = "";
      for (const character of titleChars) {
        const candidate = line + character;
        if (context.measureText(candidate).width > titleMaxWidth && line) {
          titleLines.push(line);
          line = character;
        } else {
          line = candidate;
        }
      }
      if (line) titleLines.push(line);
      titleLines.slice(0, 2).forEach((titleLine, index) => {
        context.fillText(titleLine, x + padding, y + height * 0.42 + index * titleSize * 1.05);
      });

      context.fillStyle = "rgba(202, 215, 226, .76)";
      context.font = `400 ${Math.round(width * 0.032)}px "Kanit", "Microsoft YaHei", sans-serif`;
      context.fillText(cardSubtitle || "", x + padding, y + height * 0.79);

      const arrowX = x + width - padding - width * 0.045;
      const arrowY = y + height * 0.84;
      const radius = width * 0.043;
      context.strokeStyle = accent;
      context.lineWidth = Math.max(2, width * 0.003);
      context.beginPath();
      context.arc(arrowX, arrowY, radius, 0, Math.PI * 2);
      context.stroke();
      context.beginPath();
      context.moveTo(arrowX - radius * 0.32, arrowY);
      context.lineTo(arrowX + radius * 0.28, arrowY);
      context.lineTo(arrowX + radius * 0.02, arrowY - radius * 0.26);
      context.moveTo(arrowX + radius * 0.28, arrowY);
      context.lineTo(arrowX + radius * 0.02, arrowY + radius * 0.26);
      context.stroke();
      context.textAlign = "left";
    }

    const composite = new THREE.CanvasTexture(canvas);
    composite.colorSpace = THREE.SRGBColorSpace;
    composite.flipY = baseMap.flipY;
    composite.anisotropy = isMobile ? 4 : 12;
    composite.needsUpdate = true;
    return composite;
  }, [
    backImage,
    backTexture,
    cardAccent,
    cardCategory,
    cardNumber,
    cardSubtitle,
    cardTitle,
    frontImage,
    frontTexture,
    imageFit,
    isMobile,
    materials.base.map,
  ]);

  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
      ]),
  );
  const [dragged, setDragged] = useState<false | THREE.Vector3>(false);
  const [hovered, setHovered] = useState(false);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, 1.45, 0],
  ]);

  useEffect(() => {
    if (!hovered) return;
    document.body.style.cursor = dragged ? "grabbing" : "grab";
    return () => {
      document.body.style.cursor = "auto";
    };
  }, [dragged, hovered]);

  const getLerped = (body: LanyardRigidBody) => {
    if (!body.lerped) body.lerped = new THREE.Vector3().copy(body.translation());
    return body.lerped;
  };

  useFrame((state, delta) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((body) => body.current?.wakeUp());
      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z,
      });
    }

    if (!fixed.current || !j1.current || !j2.current || !j3.current || !card.current) return;
    [j1, j2].forEach((bodyRef) => {
      const lerped = getLerped(bodyRef.current);
      const distance = Math.max(0.1, Math.min(1, lerped.distanceTo(bodyRef.current.translation())));
      lerped.lerp(
        bodyRef.current.translation(),
        delta * (minSpeed + distance * (maxSpeed - minSpeed)),
      );
    });

    curve.points[0].copy(j3.current.translation());
    curve.points[1].copy(getLerped(j2.current));
    curve.points[2].copy(getLerped(j1.current));
    curve.points[3].copy(fixed.current.translation());
    band.current.geometry.setPoints(curve.getPoints(isMobile ? 16 : 32));
    ang.copy(card.current.angvel());
    rot.copy(card.current.rotation());
    card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z }, true);
  });

  curve.curveType = "chordal";
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps} type="dynamic">
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps} type="dynamic">
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps} type="dynamic">
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[2, 0, 0]}
          rotation={[0, 0, initialRotation]}
          ref={card}
          {...segmentProps}
          type={dragged ? "kinematicPosition" : "dynamic"}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            onPointerUp={(event: ThreeEvent<PointerEvent>) => {
              (event.target as Element).releasePointerCapture(event.pointerId);
              setDragged(false);
            }}
            onPointerDown={(event: ThreeEvent<PointerEvent>) => {
              (event.target as Element).setPointerCapture(event.pointerId);
              setDragged(
                new THREE.Vector3().copy(event.point).sub(vec.copy(card.current.translation())),
              );
            }}
            onClick={(event: ThreeEvent<MouseEvent>) => {
              event.stopPropagation();
              if (event.delta <= 5) window.location.assign(href);
            }}
          >
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial
                map={cardMap}
                map-anisotropy={isMobile ? 4 : 12}
                clearcoat={isMobile ? 0.25 : 1}
                clearcoatRoughness={0.16}
                roughness={0.82}
                metalness={0.72}
              />
            </mesh>
            <mesh
              geometry={nodes.clip.geometry}
              material={materials.metal}
              material-roughness={0.26}
            />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={isMobile ? [750, 1200] : [1200, 900]}
          useMap
          map={texture}
          repeat={[-4, 1]}
          lineWidth={lanyardWidth}
        />
      </mesh>
    </>
  );
}

useGLTF.preload(CARD_MODEL);
