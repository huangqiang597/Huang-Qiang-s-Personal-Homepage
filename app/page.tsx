"use client";

import { useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { ArrowUpRight, Mail } from "lucide-react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import Hero3D from "./components/Hero3D";
import FuzzyText from "./components/FuzzyText";
import GhostCursor from "./components/GhostCursor";

const marqueeImages = [
  "/media/magic-mirror.jpg",
  "/media/star-travel.png",
  "/media/concrete-ui.jpg",
  "/media/huangqiang-lifestyle.jpg",
  "/media/huangqiang-cafe.jpg",
];

const capabilities = [
  {
    number: "01",
    name: "Agent Product Design",
    description:
      "从竞品调研、需求收敛到 PRD 与原型，将复杂业务拆成可验证的 Agent 产品路径。",
  },
  {
    number: "02",
    name: "RAG & Knowledge",
    description:
      "设计知识体系、查询改写与检索评估，让回答有据可依，并持续改善召回与上下文效率。",
  },
  {
    number: "03",
    name: "Tools & Function Call",
    description:
      "围绕真实任务定义 Tools、Schema、权限与二次确认，让模型安全连接业务系统。",
  },
  {
    number: "04",
    name: "Evaluation & Data",
    description:
      "以 Golden Query、离线评测、Bad Case、埋点与看板构建可复用的数据闭环。",
  },
  {
    number: "05",
    name: "0→1 Commercialization",
    description:
      "在效果、时延、成本与商业价值之间做取舍，把产品从概念推向内测与真实落地。",
  },
];

function FadeIn({
  children,
  delay = 0,
  x = 0,
  y = 30,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  x?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "50px", amount: 0 }}
      transition={{ delay, duration: 0.75, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}

function ContactButton() {
  return (
    <a className="contact-button" href="mailto:amcdihq@163.com">
      Contact me <ArrowUpRight size={18} strokeWidth={1.8} />
    </a>
  );
}

function MarqueeSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const rowOneX = useTransform(scrollYProgress, [0, 1], ["-28%", "3%"]);
  const rowTwoX = useTransform(scrollYProgress, [0, 1], ["2%", "-31%"]);
  const rowOne = [...marqueeImages, ...marqueeImages, ...marqueeImages];
  const rowTwo = [
    ...marqueeImages.slice().reverse(),
    ...marqueeImages.slice().reverse(),
    ...marqueeImages.slice().reverse(),
  ];

  return (
    <section className="marquee-section" ref={sectionRef} aria-label="作品预览">
      <motion.div className="marquee-row" style={{ x: rowOneX }}>
        {rowOne.map((src, index) => (
          <img key={`one-${index}`} src={src} alt="" loading="lazy" />
        ))}
      </motion.div>
      <motion.div className="marquee-row" style={{ x: rowTwoX }}>
        {rowTwo.map((src, index) => (
          <img key={`two-${index}`} src={src} alt="" loading="lazy" />
        ))}
      </motion.div>
    </section>
  );
}

function AnimatedCharacter({
  children,
  progress,
  range,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.18, 1]);
  return <motion.span style={{ opacity }}>{children}</motion.span>;
}

function AnimatedText({ text }: { text: string }) {
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: paragraphRef,
    offset: ["start 0.8", "end 0.2"],
  });
  const characters = Array.from(text);

  return (
    <p className="animated-copy" ref={paragraphRef}>
      {characters.map((character, index) => {
        const start = index / characters.length;
        return (
          <AnimatedCharacter
            key={`${character}-${index}`}
            progress={scrollYProgress}
            range={[start, Math.min(start + 0.12, 1)]}
          >
            {character}
          </AnimatedCharacter>
        );
      })}
    </p>
  );
}

function AboutSection() {
  return (
    <section className="creator-about" id="about">
      <FadeIn delay={0.1} x={-80} y={0} className="about-float about-float--left">
        <img src="/media/huangqiang-lifestyle.jpg" alt="黄强在湖边旅行的生活照" />
      </FadeIn>
      <FadeIn delay={0.15} x={80} y={0} className="about-float about-float--right">
        <img src="/media/star-travel.png" alt="星旅 Agent 架构设计" />
      </FadeIn>
      <div className="about-signal signal-one">RAG<br /><strong>90%</strong></div>
      <div className="about-signal signal-two">TOOLS<br /><strong>96%</strong></div>

      <div className="about-center">
        <FadeIn y={40}>
          <h2 className="hero-heading section-display">About me</h2>
        </FadeIn>
        <AnimatedText text="华南理工大学硕士在读，专注 AI Agent、RAG 与多模态产品。我喜欢把模糊问题拆成可验证的 MVP，在模型效果、系统成本和真实用户价值之间找到平衡，并与算法、研发、硬件及业务团队一起把产品推向落地。" />
        <ContactButton />
      </div>
    </section>
  );
}

function CapabilitiesSection() {
  return (
    <section className="capabilities" id="capabilities">
      <FadeIn y={40}>
        <h2 className="section-display section-display--dark">Capabilities</h2>
      </FadeIn>
      <div className="capability-list">
        {capabilities.map((item, index) => (
          <FadeIn key={item.number} delay={index * 0.08} y={24}>
            <article className="capability-item">
              <div className="capability-number">{item.number}</div>
              <div>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
              </div>
            </article>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

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

      <a className="contact-mail" href="mailto:amcdihq@163.com">
        <Mail size={22} /> amcdihq@163.com <ArrowUpRight size={22} />
      </a>
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
    <main className="creator-page">
      <Hero3D />
      <MarqueeSection />
      <AboutSection />
      <CapabilitiesSection />
      <ContactSection />
    </main>
  );
}
