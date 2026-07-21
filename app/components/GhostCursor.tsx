"use client";

import { useEffect, useRef, type CSSProperties } from "react";

type TrailPoint = { x: number; y: number; life: number; size: number; drift: number };

type GhostCursorProps = {
  className?: string;
  style?: CSSProperties;
  color?: string;
  brightness?: number;
  trailLength?: number;
  inertia?: number;
  fadeDelayMs?: number;
  fadeDurationMs?: number;
  zIndex?: number;
};

export default function GhostCursor({
  className = "",
  style,
  color = "#B497CF",
  brightness = 1,
  trailLength = 42,
  inertia = .5,
  fadeDelayMs = 240,
  fadeDurationMs = 950,
  zIndex = 1,
}: GhostCursorProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    const parent = host?.parentElement;
    const context = canvas?.getContext("2d");
    if (!host || !canvas || !parent || !context) return;

    let width = 1;
    let height = 1;
    let frame = 0;
    let active = false;
    let lastMove = performance.now();
    let mouse = { x: 0, y: 0 };
    let smoothed = { x: 0, y: 0 };
    const points: TrailPoint[] = [];
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const hex = color.replace("#", "");
    const value = Number.parseInt(hex.length === 3 ? hex.split("").map((part) => part + part).join("") : hex, 16);
    const rgb = { r: (value >> 16) & 255, g: (value >> 8) & 255, b: value & 255 };

    const render = () => {
      context.clearRect(0, 0, width, height);
      const idle = performance.now() - lastMove;
      const idleFade = idle <= fadeDelayMs ? 1 : Math.max(0, 1 - (idle - fadeDelayMs) / fadeDurationMs);

      for (let index = points.length - 1; index >= 0; index -= 1) {
        const point = points[index];
        point.life -= active ? .018 : .032;
        point.y += point.drift;
        if (point.life <= 0) {
          points.splice(index, 1);
          continue;
        }
        const alpha = point.life * idleFade * .54 * brightness;
        const radius = point.size * (1.25 - point.life * .25);
        const gradient = context.createRadialGradient(point.x, point.y, 0, point.x, point.y, radius);
        gradient.addColorStop(0, `rgba(${rgb.r + Math.min(30, 255 - rgb.r)},${rgb.g + Math.min(28, 255 - rgb.g)},255,${alpha})`);
        gradient.addColorStop(.26, `rgba(${rgb.r},${rgb.g},${rgb.b},${alpha * .72})`);
        gradient.addColorStop(.7, `rgba(92,116,255,${alpha * .2})`);
        gradient.addColorStop(1, "rgba(0,0,0,0)");
        context.fillStyle = gradient;
        context.beginPath();
        context.arc(point.x, point.y, radius, 0, Math.PI * 2);
        context.fill();
      }

      if (points.length || active) frame = requestAnimationFrame(render);
    };

    const ensureFrame = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(render);
    };
    const move = (event: PointerEvent) => {
      if (reduceMotion) return;
      const rect = parent.getBoundingClientRect();
      mouse = { x: event.clientX - rect.left, y: event.clientY - rect.top };
      smoothed.x += (mouse.x - smoothed.x) * (1 - inertia * .72);
      smoothed.y += (mouse.y - smoothed.y) * (1 - inertia * .72);
      lastMove = performance.now();
      active = true;
      points.unshift({ x: smoothed.x, y: smoothed.y, life: 1, size: 70 + Math.random() * 54, drift: (Math.random() - .65) * .28 });
      if (points.length > trailLength) points.length = trailLength;
      ensureFrame();
    };
    const enter = (event: PointerEvent) => {
      const rect = parent.getBoundingClientRect();
      smoothed = { x: event.clientX - rect.left, y: event.clientY - rect.top };
      active = true;
      move(event);
    };
    const leave = () => { active = false; lastMove = performance.now(); ensureFrame(); };

    const observer = new ResizeObserver(resize);
    resize();
    observer.observe(parent);
    parent.addEventListener("pointermove", move, { passive: true });
    parent.addEventListener("pointerenter", enter, { passive: true });
    parent.addEventListener("pointerleave", leave, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      parent.removeEventListener("pointermove", move);
      parent.removeEventListener("pointerenter", enter);
      parent.removeEventListener("pointerleave", leave);
    };
  }, [brightness, color, fadeDelayMs, fadeDurationMs, inertia, trailLength]);

  return (
    <div ref={hostRef} className={`ghost-cursor ${className}`} style={{ zIndex, ...style }} aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}
