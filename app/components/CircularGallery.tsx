"use client";

// OGL has no complete TypeScript declarations for the scene primitives used here.
// @ts-nocheck
import { Camera, Mesh, Plane, Program, Renderer, Texture, Transform } from "ogl";
import { useEffect, useRef } from "react";
import "./CircularGallery.css";

type GalleryItem = { image: string; text: string };
type CircularGalleryProps = {
  items: GalleryItem[];
  bend?: number;
  textColor?: string;
  borderRadius?: number;
  font?: string;
  scrollSpeed?: number;
  scrollEase?: number;
};

const lerp = (from: number, to: number, amount: number) => from + (to - from) * amount;

function createTextTexture(gl: WebGLRenderingContext, text: string, font: string, color: string) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d")!;
  context.font = font;
  const size = Number(font.match(/(\d+)px/)?.[1] || 32);
  canvas.width = Math.ceil(context.measureText(text).width) + 44;
  canvas.height = Math.ceil(size * 1.35) + 24;
  context.font = font;
  context.fillStyle = color;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(text, canvas.width / 2, canvas.height / 2);
  const texture = new Texture(gl, { generateMipmaps: false });
  texture.image = canvas;
  return { texture, width: canvas.width, height: canvas.height };
}

class GalleryTitle {
  mesh: Mesh;

  constructor(gl: WebGLRenderingContext, plane: Mesh, text: string, font: string, color: string) {
    const { texture, width, height } = createTextTexture(gl, text, font, color);
    const program = new Program(gl, {
      transparent: true,
      vertex: `
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform sampler2D tMap;
        varying vec2 vUv;
        void main() {
          vec4 color = texture2D(tMap, vUv);
          if (color.a < .08) discard;
          gl_FragColor = color;
        }
      `,
      uniforms: { tMap: { value: texture } },
    });
    this.mesh = new Mesh(gl, { geometry: new Plane(gl), program });
    const titleHeight = plane.scale.y * 0.16;
    this.mesh.scale.set(titleHeight * (width / height), titleHeight, 1);
    this.mesh.position.y = -plane.scale.y * 0.5 - titleHeight * 0.58;
    this.mesh.setParent(plane);
  }
}

class GalleryMedia {
  extra = 0;
  width = 0;
  widthTotal = 0;
  x = 0;
  plane: Mesh;
  program: Program;
  bend: number;
  viewport: { width: number; height: number };
  length: number;
  index: number;
  title?: GalleryTitle;

  constructor(options: any) {
    const {
      gl, geometry, scene, image, text, index, length, screen, viewport,
      bend, textColor, borderRadius, font,
    } = options;
    const texture = new Texture(gl, { generateMipmaps: true });
    this.program = new Program(gl, {
      depthTest: false,
      depthWrite: false,
      transparent: true,
      vertex: `
        precision highp float;
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform float uTime;
        uniform float uSpeed;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec3 p = position;
          p.z = (sin(p.x * 4.0 + uTime) + cos(p.y * 2.0 + uTime)) * (.06 + uSpeed * .32);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform vec2 uImageSizes;
        uniform vec2 uPlaneSizes;
        uniform sampler2D tMap;
        uniform float uBorderRadius;
        varying vec2 vUv;
        float roundedBox(vec2 p, vec2 b, float r) {
          vec2 d = abs(p) - b;
          return length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0) - r;
        }
        void main() {
          vec2 ratio = vec2(
            min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
            min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
          );
          vec2 uv = vec2(
            vUv.x * ratio.x + (1.0 - ratio.x) * .5,
            vUv.y * ratio.y + (1.0 - ratio.y) * .5
          );
          vec4 color = texture2D(tMap, uv);
          float d = roundedBox(vUv - .5, vec2(.5 - uBorderRadius), uBorderRadius);
          float alpha = 1.0 - smoothstep(-.003, .003, d);
          gl_FragColor = vec4(color.rgb, color.a * alpha);
        }
      `,
      uniforms: {
        tMap: { value: texture },
        uImageSizes: { value: [1, 1] },
        uPlaneSizes: { value: [1, 1] },
        uBorderRadius: { value: borderRadius },
        uTime: { value: Math.random() * 100 },
        uSpeed: { value: 0 },
      },
    });
    this.plane = new Mesh(gl, { geometry, program: this.program });
    this.plane.setParent(scene);
    this.bend = bend;
    this.viewport = viewport;
    this.length = length;
    this.index = index;

    const imageElement = new Image();
    imageElement.src = image;
    imageElement.onload = () => {
      texture.image = imageElement;
      this.program.uniforms.uImageSizes.value = [imageElement.naturalWidth, imageElement.naturalHeight];
    };

    this.resize(screen, viewport, length, index);
    this.title = new GalleryTitle(gl, this.plane, text, font, textColor);
  }

  resize(screen: any, viewport: any, length = this.length, index = this.index) {
    this.viewport = viewport;
    const scale = screen.height / 760;
    this.plane.scale.y = (viewport.height * (420 * scale)) / screen.height;
    this.plane.scale.x = (viewport.width * (540 * scale)) / screen.width;
    this.program.uniforms.uPlaneSizes.value = [this.plane.scale.x, this.plane.scale.y];
    this.width = this.plane.scale.x + 1.15;
    this.widthTotal = this.width * length;
    this.x = this.width * index;
  }

  update(scroll: any, direction: string) {
    this.plane.position.x = this.x - scroll.current - this.extra;
    const x = this.plane.position.x;
    const halfViewport = this.viewport.width / 2;
    if (this.bend) {
      const bend = Math.abs(this.bend);
      const radius = (halfViewport * halfViewport + bend * bend) / (2 * bend);
      const effectiveX = Math.min(Math.abs(x), halfViewport);
      const arc = radius - Math.sqrt(radius * radius - effectiveX * effectiveX);
      this.plane.position.y = this.bend > 0 ? -arc : arc;
      this.plane.rotation.z =
        (this.bend > 0 ? -1 : 1) * Math.sign(x) * Math.asin(effectiveX / radius);
    }
    const speed = scroll.current - scroll.last;
    this.program.uniforms.uTime.value += 0.035;
    this.program.uniforms.uSpeed.value = speed;
    const planeOffset = this.plane.scale.x / 2;
    if (direction === "right" && this.plane.position.x + planeOffset < -halfViewport) {
      this.extra -= this.widthTotal;
    }
    if (direction === "left" && this.plane.position.x - planeOffset > halfViewport) {
      this.extra += this.widthTotal;
    }
  }
}

class GalleryApp {
  container: HTMLDivElement;
  renderer: Renderer;
  gl: WebGLRenderingContext;
  camera: Camera;
  scene: Transform;
  geometry: Plane;
  medias: GalleryMedia[] = [];
  scroll = { ease: 0.055, current: 0, target: 0, last: 0, position: 0 };
  screen = { width: 1, height: 1 };
  viewport = { width: 1, height: 1 };
  isDown = false;
  start = 0;
  raf = 0;
  wheelTimer = 0;
  scrollSpeed = 2;
  resizeObserver: ResizeObserver;

  constructor(container: HTMLDivElement, options: any) {
    this.container = container;
    this.scroll.ease = options.scrollEase;
    this.scrollSpeed = options.scrollSpeed;
    this.renderer = new Renderer({
      alpha: true,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio || 1, 1.5),
    });
    this.gl = this.renderer.gl;
    this.gl.clearColor(0, 0, 0, 0);
    this.container.appendChild(this.gl.canvas);
    this.camera = new Camera(this.gl);
    this.camera.fov = 45;
    this.camera.position.z = 20;
    this.scene = new Transform();
    this.geometry = new Plane(this.gl, { heightSegments: 32, widthSegments: 64 });
    this.resize();

    const repeated = options.items.concat(options.items);
    this.medias = repeated.map(
      (item: GalleryItem, index: number) =>
        new GalleryMedia({
          gl: this.gl,
          geometry: this.geometry,
          scene: this.scene,
          image: item.image,
          text: item.text,
          index,
          length: repeated.length,
          screen: this.screen,
          viewport: this.viewport,
          bend: options.bend,
          textColor: options.textColor,
          borderRadius: options.borderRadius,
          font: options.font,
        }),
    );

    this.resizeObserver = new ResizeObserver(this.resize);
    this.resizeObserver.observe(container);
    container.addEventListener("pointerdown", this.pointerDown);
    container.addEventListener("pointermove", this.pointerMove);
    container.addEventListener("pointerup", this.pointerUp);
    container.addEventListener("pointercancel", this.pointerUp);
    container.addEventListener("wheel", this.wheel, { passive: false });
    container.addEventListener("keydown", this.keyDown);
    this.update();
  }

  resize = () => {
    this.screen = {
      width: Math.max(this.container.clientWidth, 1),
      height: Math.max(this.container.clientHeight, 1),
    };
    this.renderer.setSize(this.screen.width, this.screen.height);
    this.camera.perspective({ aspect: this.screen.width / this.screen.height });
    const fov = (this.camera.fov * Math.PI) / 180;
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    this.viewport = { width: height * this.camera.aspect, height };
    this.medias.forEach((media, index) =>
      media.resize(this.screen, this.viewport, this.medias.length, index),
    );
  };

  pointerDown = (event: PointerEvent) => {
    this.isDown = true;
    this.scroll.position = this.scroll.current;
    this.start = event.clientX;
    this.container.setPointerCapture(event.pointerId);
  };

  pointerMove = (event: PointerEvent) => {
    if (!this.isDown) return;
    this.scroll.target = this.scroll.position + (this.start - event.clientX) * 0.022 * this.scrollSpeed;
  };

  pointerUp = () => {
    this.isDown = false;
    this.snap();
  };

  wheel = (event: WheelEvent) => {
    event.preventDefault();
    const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
    this.scroll.target += delta * 0.012 * this.scrollSpeed;
    window.clearTimeout(this.wheelTimer);
    this.wheelTimer = window.setTimeout(this.snap, 140);
  };

  keyDown = (event: KeyboardEvent) => {
    if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    this.scroll.target += event.key === "ArrowRight" ? this.scrollSpeed * 3 : -this.scrollSpeed * 3;
    this.snap();
  };

  snap = () => {
    if (!this.medias[0]) return;
    const width = this.medias[0].width;
    this.scroll.target = Math.round(this.scroll.target / width) * width;
  };

  update = () => {
    this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.ease);
    const direction = this.scroll.current > this.scroll.last ? "right" : "left";
    this.medias.forEach((media) => media.update(this.scroll, direction));
    if (!document.hidden) this.renderer.render({ scene: this.scene, camera: this.camera });
    this.scroll.last = this.scroll.current;
    this.raf = requestAnimationFrame(this.update);
  };

  destroy() {
    cancelAnimationFrame(this.raf);
    window.clearTimeout(this.wheelTimer);
    this.resizeObserver.disconnect();
    this.container.removeEventListener("pointerdown", this.pointerDown);
    this.container.removeEventListener("pointermove", this.pointerMove);
    this.container.removeEventListener("pointerup", this.pointerUp);
    this.container.removeEventListener("pointercancel", this.pointerUp);
    this.container.removeEventListener("wheel", this.wheel);
    this.container.removeEventListener("keydown", this.keyDown);
    this.gl.canvas.remove();
  }
}

export default function CircularGallery({
  items,
  bend = 2.2,
  textColor = "#edf8f8",
  borderRadius = 0.055,
  font = '700 34px "Noto Sans SC", sans-serif',
  scrollSpeed = 2,
  scrollEase = 0.055,
}: CircularGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !items.length) return;
    const app = new GalleryApp(containerRef.current, {
      items, bend, textColor, borderRadius, font, scrollSpeed, scrollEase,
    });
    return () => app.destroy();
  }, [items, bend, textColor, borderRadius, font, scrollSpeed, scrollEase]);

  return (
    <div
      className="circular-gallery"
      ref={containerRef}
      tabIndex={0}
      role="region"
      aria-label="卉木盈海项目图片集。左右拖动、滚轮或方向键均可浏览。"
    />
  );
}
