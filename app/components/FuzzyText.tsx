"use client";

import { useEffect, useRef } from "react";

type FuzzyTextProps = {
  children: string;
  fontSize?: number | string;
  fontWeight?: number | string;
  fontFamily?: string;
  color?: string;
  enableHover?: boolean;
  baseIntensity?: number;
  hoverIntensity?: number;
  fuzzRange?: number;
  fps?: number;
  direction?: "horizontal" | "vertical" | "both";
  transitionDuration?: number;
  clickEffect?: boolean;
  glitchMode?: boolean;
  glitchInterval?: number;
  glitchDuration?: number;
  gradient?: string[] | null;
  letterSpacing?: number;
  className?: string;
};

export default function FuzzyText({
  children,
  fontSize = "clamp(3.4rem, 10vw, 10rem)",
  fontWeight = 900,
  fontFamily = "inherit",
  color = "#d7e2ea",
  enableHover = true,
  baseIntensity = 0.12,
  hoverIntensity = 0.48,
  fuzzRange = 28,
  fps = 48,
  direction = "horizontal",
  transitionDuration = 180,
  clickEffect = true,
  glitchMode = false,
  glitchInterval = 2600,
  glitchDuration = 150,
  gradient = null,
  letterSpacing = -3,
  className = "",
}: FuzzyTextProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    let frame = 0;
    let cancelled = false;
    let hovering = false;
    let clicking = false;
    let glitching = false;
    let glitchStart = 0;
    let lastFrame = 0;
    let currentIntensity = baseIntensity;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const frameDuration = 1000 / Math.max(12, fps);
    const dpr = Math.min(window.devicePixelRatio || 1, 1.35);
    const computedFamily = fontFamily === "inherit"
      ? window.getComputedStyle(canvas).fontFamily || "sans-serif"
      : fontFamily;

    const resolveFontSize = () => {
      if (typeof fontSize === "number") return fontSize;
      const probe = document.createElement("span");
      probe.style.cssText = `position:absolute;visibility:hidden;font-size:${fontSize}`;
      document.body.appendChild(probe);
      const value = parseFloat(window.getComputedStyle(probe).fontSize);
      probe.remove();
      return value;
    };

    const numericFontSize = resolveFontSize();
    const offscreen = document.createElement("canvas");
    const off = offscreen.getContext("2d");
    if (!off) return;
    const font = `${fontWeight} ${numericFontSize}px ${computedFamily}`;
    off.font = font;
    off.textBaseline = "alphabetic";

    let textWidth = 0;
    for (const character of children) textWidth += off.measureText(character).width + letterSpacing;
    textWidth = Math.max(1, textWidth - letterSpacing);
    const metrics = off.measureText(children);
    const ascent = metrics.actualBoundingBoxAscent || numericFontSize * .8;
    const descent = metrics.actualBoundingBoxDescent || numericFontSize * .22;
    const textHeight = Math.ceil(ascent + descent);
    const horizontalMargin = fuzzRange + 24;

    offscreen.width = Math.ceil((textWidth + 12) * dpr);
    offscreen.height = Math.ceil(textHeight * dpr);
    off.scale(dpr, dpr);
    off.font = font;
    off.textBaseline = "alphabetic";
    if (gradient && gradient.length > 1) {
      const fill = off.createLinearGradient(0, 0, textWidth, 0);
      gradient.forEach((stop, index) => fill.addColorStop(index / (gradient.length - 1), stop));
      off.fillStyle = fill;
    } else {
      off.fillStyle = color;
    }
    let cursor = 6;
    for (const character of children) {
      off.fillText(character, cursor, ascent);
      cursor += off.measureText(character).width + letterSpacing;
    }

    const cssWidth = Math.ceil(textWidth + 12 + horizontalMargin * 2);
    const cssHeight = Math.ceil(textHeight + 8);
    canvas.width = Math.ceil(cssWidth * dpr);
    canvas.height = Math.ceil(cssHeight * dpr);
    canvas.style.width = `${cssWidth}px`;
    canvas.style.height = `${cssHeight}px`;
    context.scale(dpr, dpr);

    const draw = (timestamp: number) => {
      if (cancelled) return;
      if (timestamp - lastFrame < frameDuration) {
        frame = requestAnimationFrame(draw);
        return;
      }
      lastFrame = timestamp;
      if (glitchMode && timestamp - glitchStart > glitchInterval) {
        glitching = true;
        glitchStart = timestamp;
      }
      if (glitching && timestamp - glitchStart > glitchDuration) glitching = false;

      const target = reduceMotion ? 0 : clicking || glitching ? 1 : hovering ? hoverIntensity : baseIntensity;
      const easing = transitionDuration > 0 ? Math.min(1, frameDuration / transitionDuration) : 1;
      currentIntensity += (target - currentIntensity) * easing;
      context.clearRect(0, 0, cssWidth, cssHeight);

      const sourceWidth = offscreen.width / dpr;
      const sourceHeight = offscreen.height / dpr;
      const destinationX = horizontalMargin;
      const slice = reduceMotion ? sourceHeight : 2;
      for (let y = 0; y < sourceHeight; y += slice) {
        const displacement = (Math.random() - .5) * fuzzRange * currentIntensity;
        const dx = direction === "vertical" ? 0 : displacement;
        const dy = direction === "horizontal" ? 0 : displacement * .28;
        context.drawImage(
          offscreen,
          0, y * dpr, offscreen.width, Math.min(slice * dpr, offscreen.height - y * dpr),
          destinationX + dx, 4 + y + dy, sourceWidth, Math.min(slice, sourceHeight - y),
        );
      }
      frame = requestAnimationFrame(draw);
    };

    const setHover = (event: PointerEvent) => {
      if (!enableHover) return;
      const rect = canvas.getBoundingClientRect();
      hovering = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
    };
    const leave = () => { hovering = false; };
    const click = () => {
      if (!clickEffect) return;
      clicking = true;
      window.setTimeout(() => { clicking = false; }, 170);
    };

    canvas.addEventListener("pointermove", setHover);
    canvas.addEventListener("pointerleave", leave);
    canvas.addEventListener("click", click);
    frame = requestAnimationFrame(draw);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      canvas.removeEventListener("pointermove", setHover);
      canvas.removeEventListener("pointerleave", leave);
      canvas.removeEventListener("click", click);
    };
  }, [baseIntensity, children, clickEffect, color, direction, enableHover, fontFamily, fontSize, fontWeight, fps, fuzzRange, glitchDuration, glitchInterval, glitchMode, gradient, hoverIntensity, letterSpacing, transitionDuration]);

  return <canvas ref={canvasRef} className={className} aria-label={children} role="img" />;
}
