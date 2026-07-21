"use client";

import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { ArrowUpRight } from "lucide-react";
import "./ProfileCard.css";

const DEFAULT_INNER_GRADIENT =
  "linear-gradient(145deg, rgba(34, 49, 78, .82) 0%, rgba(15, 12, 29, .96) 100%)";

const ANIMATION_CONFIG = {
  INITIAL_DURATION: 1200,
  INITIAL_X_OFFSET: 70,
  INITIAL_Y_OFFSET: 60,
  ENTER_TRANSITION_MS: 180,
};

const clamp = (value: number, min = 0, max = 100) =>
  Math.min(Math.max(value, min), max);
const round = (value: number, precision = 3) =>
  Number.parseFloat(value.toFixed(precision));
const adjust = (
  value: number,
  fromMin: number,
  fromMax: number,
  toMin: number,
  toMax: number,
) =>
  round(
    toMin +
      ((toMax - toMin) * (value - fromMin)) / (fromMax - fromMin),
  );

type ProfileCardProps = {
  imageUrl: string;
  href: string;
  number: string;
  category: string;
  name: string;
  title: string;
  accent: string;
  className?: string;
  enableTilt?: boolean;
  behindGlowEnabled?: boolean;
  behindGlowColor?: string;
  behindGlowSize?: string;
  innerGradient?: string;
};

function ProfileCardComponent({
  imageUrl,
  href,
  number,
  category,
  name,
  title,
  accent,
  className = "",
  enableTilt = true,
  behindGlowEnabled = true,
  behindGlowColor,
  behindGlowSize,
  innerGradient,
}: ProfileCardProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const shellRef = useRef<HTMLAnchorElement>(null);
  const enterTimerRef = useRef<number | null>(null);
  const leaveRafRef = useRef<number | null>(null);

  const tiltEngine = useMemo(() => {
    if (!enableTilt) return null;

    let rafId: number | null = null;
    let running = false;
    let lastTimestamp = 0;
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;
    let initialUntil = 0;

    const setVariables = (x: number, y: number) => {
      const shell = shellRef.current;
      const wrap = wrapRef.current;
      if (!shell || !wrap) return;

      const width = shell.clientWidth || 1;
      const height = shell.clientHeight || 1;
      const percentX = clamp((100 / width) * x);
      const percentY = clamp((100 / height) * y);
      const centerX = percentX - 50;
      const centerY = percentY - 50;
      const variables = {
        "--pointer-x": `${percentX}%`,
        "--pointer-y": `${percentY}%`,
        "--background-x": `${adjust(percentX, 0, 100, 35, 65)}%`,
        "--background-y": `${adjust(percentY, 0, 100, 35, 65)}%`,
        "--pointer-from-center": `${clamp(
          Math.hypot(percentY - 50, percentX - 50) / 50,
          0,
          1,
        )}`,
        "--pointer-from-top": `${percentY / 100}`,
        "--pointer-from-left": `${percentX / 100}`,
        "--rotate-x": `${round(-(centerX / 6.5))}deg`,
        "--rotate-y": `${round(centerY / 5.25)}deg`,
      };

      for (const [property, value] of Object.entries(variables)) {
        wrap.style.setProperty(property, value);
      }
    };

    const step = (timestamp: number) => {
      if (!running) return;
      if (lastTimestamp === 0) lastTimestamp = timestamp;
      const delta = (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;
      const tau = timestamp < initialUntil ? 0.6 : 0.14;
      const damping = 1 - Math.exp(-delta / tau);

      currentX += (targetX - currentX) * damping;
      currentY += (targetY - currentY) * damping;
      setVariables(currentX, currentY);

      const unsettled =
        Math.abs(targetX - currentX) > 0.05 ||
        Math.abs(targetY - currentY) > 0.05;
      if (unsettled) {
        rafId = requestAnimationFrame(step);
      } else {
        running = false;
        lastTimestamp = 0;
        rafId = null;
      }
    };

    const start = () => {
      if (running) return;
      running = true;
      lastTimestamp = 0;
      rafId = requestAnimationFrame(step);
    };

    return {
      setImmediate(x: number, y: number) {
        currentX = x;
        currentY = y;
        setVariables(x, y);
      },
      setTarget(x: number, y: number) {
        targetX = x;
        targetY = y;
        start();
      },
      toCenter() {
        const shell = shellRef.current;
        if (shell) this.setTarget(shell.clientWidth / 2, shell.clientHeight / 2);
      },
      beginInitial(duration: number) {
        initialUntil = performance.now() + duration;
        start();
      },
      getCurrent() {
        return { x: currentX, y: currentY, targetX, targetY };
      },
      cancel() {
        if (rafId !== null) cancelAnimationFrame(rafId);
        rafId = null;
        running = false;
        lastTimestamp = 0;
      },
    };
  }, [enableTilt]);

  const getOffsets = (
    event: PointerEvent | ReactPointerEvent,
    element: HTMLElement,
  ) => {
    const rect = element.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  const handlePointerMove = useCallback(
    (event: PointerEvent) => {
      const shell = shellRef.current;
      if (!shell || !tiltEngine) return;
      const { x, y } = getOffsets(event, shell);
      tiltEngine.setTarget(x, y);
    },
    [tiltEngine],
  );

  const handlePointerEnter = useCallback(
    (event: PointerEvent) => {
      const shell = shellRef.current;
      const wrap = wrapRef.current;
      if (!shell || !wrap || !tiltEngine) return;
      shell.classList.add("active", "entering");
      wrap.classList.add("active");
      if (enterTimerRef.current !== null) {
        window.clearTimeout(enterTimerRef.current);
      }
      enterTimerRef.current = window.setTimeout(
        () => shell.classList.remove("entering"),
        ANIMATION_CONFIG.ENTER_TRANSITION_MS,
      );
      const { x, y } = getOffsets(event, shell);
      tiltEngine.setTarget(x, y);
    },
    [tiltEngine],
  );

  const handlePointerLeave = useCallback(() => {
    const shell = shellRef.current;
    const wrap = wrapRef.current;
    if (!shell || !wrap || !tiltEngine) return;
    tiltEngine.toCenter();

    const checkSettle = () => {
      const { x, y, targetX, targetY } = tiltEngine.getCurrent();
      if (Math.hypot(targetX - x, targetY - y) < 0.6) {
        shell.classList.remove("active");
        wrap.classList.remove("active");
        leaveRafRef.current = null;
      } else {
        leaveRafRef.current = requestAnimationFrame(checkSettle);
      }
    };
    if (leaveRafRef.current !== null) cancelAnimationFrame(leaveRafRef.current);
    leaveRafRef.current = requestAnimationFrame(checkSettle);
  }, [tiltEngine]);

  useEffect(() => {
    if (!enableTilt || !tiltEngine) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const shell = shellRef.current;
    if (!shell) return;

    shell.addEventListener("pointerenter", handlePointerEnter);
    shell.addEventListener("pointermove", handlePointerMove);
    shell.addEventListener("pointerleave", handlePointerLeave);
    tiltEngine.setImmediate(
      Math.max(0, shell.clientWidth - ANIMATION_CONFIG.INITIAL_X_OFFSET),
      ANIMATION_CONFIG.INITIAL_Y_OFFSET,
    );
    tiltEngine.toCenter();
    tiltEngine.beginInitial(ANIMATION_CONFIG.INITIAL_DURATION);

    return () => {
      shell.removeEventListener("pointerenter", handlePointerEnter);
      shell.removeEventListener("pointermove", handlePointerMove);
      shell.removeEventListener("pointerleave", handlePointerLeave);
      if (enterTimerRef.current !== null) {
        window.clearTimeout(enterTimerRef.current);
      }
      if (leaveRafRef.current !== null) {
        cancelAnimationFrame(leaveRafRef.current);
      }
      tiltEngine.cancel();
    };
  }, [
    enableTilt,
    tiltEngine,
    handlePointerEnter,
    handlePointerMove,
    handlePointerLeave,
  ]);

  const cardStyle = {
    "--inner-gradient": innerGradient ?? DEFAULT_INNER_GRADIENT,
    "--behind-glow-color":
      behindGlowColor ?? `color-mix(in srgb, ${accent} 72%, transparent)`,
    "--behind-glow-size": behindGlowSize ?? "62%",
    "--project-accent": accent,
  } as CSSProperties;

  return (
    <div
      ref={wrapRef}
      className={`pc-card-wrapper ${className}`.trim()}
      style={cardStyle}
    >
      {behindGlowEnabled && <div className="pc-behind" aria-hidden="true" />}
      <a
        ref={shellRef}
        className="pc-card-shell"
        href={href}
        aria-label={`打开 ${name} 项目`}
      >
        <article className="pc-card">
          <div className="pc-inside">
            <img className="pc-project-image" src={imageUrl} alt="" loading="lazy" />
            <div className="pc-image-shade" />
            <div className="pc-shine" aria-hidden="true" />
            <div className="pc-glare" aria-hidden="true" />

            <header className="pc-project-head">
              <span>{number}</span>
              <small>{category}</small>
            </header>

            <div className="pc-project-copy">
              <h3>{name}</h3>
              <p>{title}</p>
            </div>

            <footer className="pc-project-action">
              <span>VIEW PROJECT</span>
              <span className="pc-project-arrow" aria-hidden="true">
                <ArrowUpRight size={18} strokeWidth={1.6} />
              </span>
            </footer>
          </div>
        </article>
      </a>
    </div>
  );
}

const ProfileCard = memo(ProfileCardComponent);
export default ProfileCard;
