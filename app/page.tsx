"use client";

import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { ArrowUpRight, Mail, MessageCircle, Phone } from "lucide-react";
import Hero3D from "./components/Hero3D";
import FuzzyText from "./components/FuzzyText";
import GhostCursor from "./components/GhostCursor";
import SideQuests from "./components/SideQuests";
import { ViewportFerrofluid } from "./components/Ferrofluid";

const CONTACT_FLUID_COLORS = ["#6b86ff", "#9c6bdf", "#d7c4ff"];

function ContactSection() {
  const revealRef = useRef<HTMLDivElement>(null);
  const [ghostActive, setGhostActive] = useState(false);

  const moveGhost = (event: ReactPointerEvent<HTMLDivElement>) => {
    const target = revealRef.current;
    if (!target) return;
    const rect = target.getBoundingClientRect();
    target.style.setProperty("--ghost-x", `${event.clientX - rect.left}px`);
    target.style.setProperty("--ghost-y", `${event.clientY - rect.top}px`);
  };

  return (
    <footer className="creator-contact" id="contact">
      <ViewportFerrofluid
        className="contact-ferrofluid"
        colors={CONTACT_FLUID_COLORS}
        speed={.22}
        scale={1.95}
        turbulence={.84}
        fluidity={.18}
        rimWidth={.22}
        sharpness={3.8}
        shimmer={.82}
        glow={2.05}
        flowDirection="down"
        opacity={.42}
        mouseStrength={.82}
        mouseRadius={.28}
        dpr={.72}
        mixBlendMode="screen"
      />
      <p>Have an AI product worth making real?</p>
      <div className="contact-fuzzy-title">
        <FuzzyText
          fontSize="clamp(3.7rem, 9.7vw, 10.5rem)"
          fontWeight={900}
          fontFamily="Kanit, Arial Black, sans-serif"
          baseIntensity={0.1}
          hoverIntensity={0.55}
          fuzzRange={34}
          fps={48}
          transitionDuration={220}
          clickEffect
          glitchMode
          glitchInterval={3400}
          glitchDuration={120}
          gradient={["#e7edf4", "#aab8c9", "#d6c0ff"]}
          letterSpacing={-5}
          className="contact-fuzzy-canvas"
        >
          Welcome to my world
        </FuzzyText>
      </div>

      <div
        ref={revealRef}
        className={`future-reveal${ghostActive ? " is-active" : ""}`}
        onPointerEnter={() => setGhostActive(true)}
        onPointerMove={moveGhost}
        onPointerLeave={() => setGhostActive(false)}
        onFocus={() => setGhostActive(true)}
        onBlur={() => setGhostActive(false)}
        tabIndex={0}
        aria-label="移动光标，显示 I am the future"
      >
        <GhostCursor color="#b79cff" brightness={1.08} trailLength={38} inertia={0.46} fadeDelayMs={180} fadeDurationMs={900} />
        <span className="future-reveal-kicker">MOVE TO REVEAL · 未来正在靠近</span>
        <strong>I am the future</strong>
      </div>

      <div className="contact-channels" aria-label="联系方式">
        <a href="mailto:amcdihq@163.com">
          <i><Mail /></i><span><small>EMAIL</small><strong>amcdihq@163.com</strong></span><ArrowUpRight className="contact-channel-arrow" />
        </a>
        <a href="tel:+8617750290736">
          <i><Phone /></i><span><small>PHONE</small><strong>17750290736</strong></span><ArrowUpRight className="contact-channel-arrow" />
        </a>
        <div>
          <i><MessageCircle /></i><span><small>WECHAT</small><strong>HUANGayo-</strong></span>
        </div>
      </div>
      <div className="contact-footer-row">
        <span>HUANG QIANG · AI PRODUCT MANAGER</span>
        <span>WECHAT · HUANGayo-</span>
        <span>© 2026</span>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <main className="creator-page" id="top">
      <Hero3D />
      <SideQuests />
      <ContactSection />
    </main>
  );
}
