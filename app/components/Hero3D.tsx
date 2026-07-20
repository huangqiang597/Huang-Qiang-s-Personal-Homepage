"use client";

import dynamic from "next/dynamic";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const HeadScene = dynamic(() => import("./HeadScene"), {
  ssr: false,
  loading: () => <div className="head-scene-loading">INITIALIZING DIGITAL HUMAN</div>,
});

function useReducedMotionPreference() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reduced;
}

export default function Hero3D() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const reducedMotion = useReducedMotionPreference();

  useEffect(() => {
    if (reducedMotion || !titleRef.current) return;

    let frame = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const render = () => {
      currentX += (targetX - currentX) * 0.075;
      currentY += (targetY - currentY) * 0.075;
      if (titleRef.current) {
        titleRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      }
      frame = requestAnimationFrame(render);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (window.innerWidth < 768) return;
      const normalizedX = (event.clientX / window.innerWidth) * 2 - 1;
      const normalizedY = (event.clientY / window.innerHeight) * 2 - 1;
      targetX = -normalizedX * 15;
      targetY = -normalizedY * 9;
    };

    const reset = () => {
      targetX = 0;
      targetY = 0;
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", reset);
    window.addEventListener("blur", reset);
    frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("mouseleave", reset);
      window.removeEventListener("blur", reset);
    };
  }, [reducedMotion]);

  return (
    <section className="interactive-hero" id="home" ref={sectionRef}>
      <nav className="interactive-nav" aria-label="主导航">
        <a href="#about">About</a>
        <a href="#capabilities">Experience</a>
        <a href="#projects">Projects</a>
        <a href="#contact">Contact</a>
      </nav>

      <div className="hero-tech-label">
        <span>R3F / THREE.JS</span>
        <span>INTERACTIVE DIGITAL HUMAN</span>
      </div>

      <h1 className="interactive-title hero-heading" ref={titleRef}>
        Hi, i&apos;m <span>Huang Qiang</span>
      </h1>

      <div className="head-canvas-shell" aria-label="可交互的黄强 3D 动漫数字人头部">
        <HeadScene reducedMotion={reducedMotion} />
      </div>

      <div className="interactive-hero-bottom">
        <p>
          AN AI PRODUCT MANAGER CRAFTING USEFUL,
          <br />MEASURABLE AGENT EXPERIENCES
        </p>
        <div className="interaction-hint">
          <span className="interaction-dot" /> MOVE YOUR CURSOR
        </div>
        <a href="mailto:amcdihq@163.com" className="interactive-contact">
          Contact me <ArrowUpRight size={16} />
        </a>
      </div>
    </section>
  );
}
