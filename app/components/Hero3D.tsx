"use client";

import { ArrowUpRight } from "lucide-react";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import HeroProjectCards from "./HeroProjectCards";

const LightPillar = lazy(() => import("./LightPillar"));
const MagicRings = lazy(() => import("./MagicRings"));

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
  const titleFitRef = useRef(1);
  const avatarRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotionPreference();

  useEffect(() => {
    const fitTitle = () => {
      if (!titleRef.current) return;
      const naturalWidth = titleRef.current.scrollWidth;
      const availableWidth = Math.max(320, window.innerWidth - 32);
      titleFitRef.current = naturalWidth > 0 ? availableWidth / naturalWidth : 1;

      if (reducedMotion) {
        titleRef.current.style.transform = `translateX(-50%) scaleX(${titleFitRef.current}) scaleY(var(--hero-title-stretch))`;
      }
    };

    fitTitle();
    const observer = new ResizeObserver(fitTitle);
    if (titleRef.current) observer.observe(titleRef.current);
    void document.fonts?.ready.then(fitTitle);
    window.addEventListener("resize", fitTitle, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", fitTitle);
    };
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion || !titleRef.current || !avatarRef.current) return;

    let frame = 0;
    let titleTargetX = 0;
    let titleTargetY = 0;
    let titleX = 0;
    let titleY = 0;
    let avatarTargetX = 0;
    let avatarTargetY = 0;
    let avatarTargetRotateX = 0;
    let avatarTargetRotateY = 0;
    let avatarTargetScale = 1;
    let avatarX = 0;
    let avatarY = 0;
    let avatarRotateX = 0;
    let avatarRotateY = 0;
    let avatarScale = 1;
    let lastAwayX = 0;
    let lastAwayY = -1;

    const render = () => {
      titleX += (titleTargetX - titleX) * 0.075;
      titleY += (titleTargetY - titleY) * 0.075;
      avatarX += (avatarTargetX - avatarX) * 0.12;
      avatarY += (avatarTargetY - avatarY) * 0.12;
      avatarRotateX += (avatarTargetRotateX - avatarRotateX) * 0.1;
      avatarRotateY += (avatarTargetRotateY - avatarRotateY) * 0.1;
      avatarScale += (avatarTargetScale - avatarScale) * 0.1;

      if (titleRef.current) {
        titleRef.current.style.transform = `translateX(-50%) translate3d(${titleX}px, ${titleY}px, 0) scaleX(${titleFitRef.current}) scaleY(var(--hero-title-stretch))`;
      }
      if (avatarRef.current) {
        avatarRef.current.style.transform = `translate3d(${avatarX}px, ${avatarY}px, 0) rotateX(${avatarRotateX}deg) rotateY(${avatarRotateY}deg) scale(${avatarScale})`;
      }
      frame = requestAnimationFrame(render);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (window.innerWidth < 768) return;
      const normalizedX = (event.clientX / window.innerWidth) * 2 - 1;
      const normalizedY = (event.clientY / window.innerHeight) * 2 - 1;
      titleTargetX = normalizedX * 15;
      titleTargetY = normalizedY * 9;

      const deltaX = event.clientX - window.innerWidth * 0.5;
      const deltaY = event.clientY - window.innerHeight * 0.5;
      const distance = Math.hypot(deltaX, deltaY);
      const radius = Math.min(440, Math.max(280, window.innerWidth * 0.25));
      const rawStrength = 1 - Math.min(1, distance / radius);
      const strength = rawStrength * rawStrength * (3 - 2 * rawStrength);

      if (distance > 1) {
        lastAwayX = -deltaX / distance;
        lastAwayY = -deltaY / distance;
      }

      avatarTargetX = lastAwayX * strength * 28;
      avatarTargetY = lastAwayY * strength * 18;
      avatarTargetRotateY = lastAwayX * strength * 9;
      avatarTargetRotateX = -lastAwayY * strength * 5;
      avatarTargetScale = 1 + strength * 0.03;
    };

    const reset = () => {
      titleTargetX = 0;
      titleTargetY = 0;
      avatarTargetX = 0;
      avatarTargetY = 0;
      avatarTargetRotateX = 0;
      avatarTargetRotateY = 0;
      avatarTargetScale = 1;
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
        <a href="#home">Home</a>
        <a href="#projects">Projects</a>
        <a href="#about">About me</a>
        <a href="#contact">Contact</a>
      </nav>

      <div className="hero-tech-label">
        <span>R3F / THREE.JS</span>
        <span>INTERACTIVE DIGITAL HUMAN</span>
      </div>

      <div className="hero-light-pillar" aria-hidden="true">
        <Suspense fallback={<div className="light-pillar-fallback" />}>
          <LightPillar
            topColor="#4f8dff"
            bottomColor="#8d4dff"
            intensity={0.72}
            rotationSpeed={0.18}
            glowAmount={0.0035}
            pillarWidth={2.65}
            pillarHeight={0.55}
            noiseIntensity={0.18}
            pillarRotation={0}
            interactive={false}
            mixBlendMode="screen"
            quality="medium"
          />
        </Suspense>
      </div>

      <h1 className="interactive-title hero-heading" ref={titleRef}>
        Hi, i&apos;m <span>Huang Qiang</span>
      </h1>

      <div className="hero-education-layer" aria-label="教育背景">
        <article className="hero-education-card hero-education-card--undergraduate">
          <div className="hero-education-copy">
            <div className="hero-education-kicker">
              <span>EDUCATION / 01</span>
              <i />
            </div>
            <h2>福州大学</h2>
            <p>FUZHOU UNIVERSITY</p>
            <div className="hero-education-meta">
              <strong>本科</strong>
              <time dateTime="2020/2024">2020 — 2024</time>
            </div>
          </div>
          <div className="hero-education-rings" aria-hidden="true">
            <Suspense fallback={<span className="hero-education-ring-fallback" />}>
              <MagicRings
                color="#5ea8ff"
                colorTwo="#62f0df"
                ringCount={5}
                speed={0.42}
                attenuation={15}
                lineThickness={1.25}
                baseRadius={0.2}
                radiusStep={0.075}
                scaleRate={0.055}
                opacity={0.68}
                blur={0.2}
                noiseAmount={0.018}
                rotation={-18}
                ringGap={1.28}
                fadeIn={0.85}
                fadeOut={1.9}
                followMouse
                mouseInfluence={0.1}
                hoverScale={1.08}
                parallax={0.022}
                clickBurst={false}
              />
            </Suspense>
          </div>
        </article>

        <article className="hero-education-card hero-education-card--postgraduate">
          <div className="hero-education-rings" aria-hidden="true">
            <Suspense fallback={<span className="hero-education-ring-fallback" />}>
              <MagicRings
                color="#a177ff"
                colorTwo="#58cfff"
                ringCount={5}
                speed={0.38}
                attenuation={15}
                lineThickness={1.25}
                baseRadius={0.2}
                radiusStep={0.075}
                scaleRate={0.055}
                opacity={0.68}
                blur={0.2}
                noiseAmount={0.018}
                rotation={18}
                ringGap={1.28}
                fadeIn={0.85}
                fadeOut={1.9}
                followMouse
                mouseInfluence={0.1}
                hoverScale={1.08}
                parallax={0.022}
                clickBurst={false}
              />
            </Suspense>
          </div>
          <div className="hero-education-copy">
            <div className="hero-education-kicker">
              <i />
              <span>EDUCATION / 02</span>
            </div>
            <h2>华南理工大学</h2>
            <p>SOUTH CHINA UNIVERSITY OF TECHNOLOGY</p>
            <div className="hero-education-meta">
              <strong>硕士</strong>
              <time dateTime="2024/2027">2024 — 2027</time>
            </div>
          </div>
        </article>
      </div>

      <div className="hero-avatar-layer" aria-label="可交互的黄强 3D 动漫数字人头部">
        <div className="hero-avatar-motion" ref={avatarRef}>
          <img
            className="hero-avatar-image"
            src="/images/huang-qiang-avatar-cutout.png"
            alt=""
            width="1023"
            height="1537"
            decoding="async"
            fetchPriority="high"
          />
        </div>
      </div>

      <HeroProjectCards />

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
