"use client";

import { Camera, CircleDot, Gamepad2, Trophy, UserRound } from "lucide-react";
import Folder from "./Folder";
import { ViewportFerrofluid } from "./Ferrofluid";
import "./SideQuests.css";

const SIDE_FLUID_COLORS = ["#5d91ff", "#8269ff", "#e67676"];

function ImagePaper({ src, title, eyebrow, className = "" }: { src: string; title: string; eyebrow: string; className?: string }) {
  return (
    <article className={`side-paper side-paper--image ${className}`}>
      <img src={src} alt={title} loading="lazy" />
      <div><small>{eyebrow}</small><strong>{title}</strong></div>
    </article>
  );
}

function HobbyPaper({ type }: { type: "football" | "cinema" | "gaming" }) {
  if (type === "football") {
    return <article className="side-paper hobby-paper hobby-football"><span className="football-field" /><small>PASS · MOVE · CREATE</small><strong>足球<br /><b>FOOTBALL</b></strong></article>;
  }
  if (type === "cinema") {
    return <article className="side-paper hobby-paper hobby-cinema"><span className="film-perforation" /><small>STORIES ON SCREEN</small><strong>电影<br /><b>CINEMA</b></strong><em>ADMIT ONE · H7</em></article>;
  }
  return <article className="side-paper hobby-paper hobby-gaming"><Gamepad2 /><small>PLAYER ONE</small><strong>游戏<br /><b>GAMING</b></strong></article>;
}

const folders = [
  {
    number: "01", title: "兴趣爱好", english: "HOBBIES", color: "#1555a9", icon: CircleDot,
    items: [<HobbyPaper type="football" key="football" />, <HobbyPaper type="cinema" key="cinema" />, <HobbyPaper type="gaming" key="gaming" />],
  },
  {
    number: "02", title: "荣誉", english: "HONORS", color: "#5631af", icon: Trophy,
    items: [
      <ImagePaper key="national-second" src="/media/personal/award-national-second.jpg" title="全国二等奖" eyebrow="CAE · 2024" />,
      <ImagePaper key="national-first" src="/media/personal/award-national-first.jpg" title="全国一等奖" eyebrow="CMVC · 2025" />,
      <ImagePaper key="challenge" src="/media/personal/award-challenge-cup.jpg" title="挑战杯银奖" eyebrow="CHALLENGE CUP" />,
    ],
  },
  {
    number: "03", title: "其他能力", english: "OTHER SKILLS", color: "#a64e49", icon: Camera,
    items: [
      <ImagePaper key="photo" src="/media/personal/sunset.jpg" title="摄影 PHOTOGRAPHY" eyebrow="LIGHT · TIME · MEMORY" />,
      <ImagePaper key="social" src="/media/personal/social-media.png" title="自媒体运营" eyebrow="2.2万粉丝 · 16.7万互动" className="side-paper--social" />,
      <ImagePaper key="beach" src="/media/personal/pink-beach.jpg" title="影像叙事" eyebrow="VISUAL STORYTELLING" />,
    ],
  },
];

export default function SideQuests() {
  return (
    <section className="side-quests" id="about" aria-labelledby="side-quests-title">
      <ViewportFerrofluid
        className="side-ferrofluid"
        colors={SIDE_FLUID_COLORS}
        speed={.22}
        scale={1.9}
        turbulence={.75}
        fluidity={.16}
        rimWidth={.17}
        sharpness={3.4}
        shimmer={.7}
        glow={1.35}
        flowDirection="right"
        opacity={.25}
        mouseStrength={.78}
        mouseRadius={.26}
        dpr={.78}
        mixBlendMode="screen"
      />
      <div className="side-grid-lines" aria-hidden="true" />

      <nav className="side-nav" aria-label="页面章节">
        <a href="#top"><span>01</span> HOME</a>
        <a className="is-active" href="#about"><span>02</span> MY SIDE QUESTS</a>
        <a href="#contact"><span>03</span> CONTACT</a>
      </nav>

      <header className="side-heading">
        <div>
          <p>BEYOND THE PRODUCT · HUANG QIANG</p>
          <h2 id="side-quests-title">MY SIDE QUESTS</h2>
          <strong>生活不止产品。</strong>
        </div>
        <aside className="side-profile-card">
          <img src="/media/personal/portrait.jpg" alt="黄强生活照" loading="lazy" />
          <div><small>PROFILE / 00</small><b>HUANG QIANG</b><span><UserRound /> AI 产品经理</span><span><CircleDot /> 热爱生活的创造者</span></div>
        </aside>
        <p className="side-interaction-hint">CLICK A FOLDER TO OPEN <i /> MOVE TO EXPLORE</p>
      </header>

      <div className="side-folder-grid">
        {folders.map(({ icon: Icon, ...folder }) => (
          <article className="side-folder-entry" key={folder.number}>
            <Folder color={folder.color} items={folder.items} label={folder.title} defaultOpen />
            <div className="side-folder-label">
              <span>{folder.number}</span><i><Icon /></i>
              <strong>{folder.title} <small>/ {folder.english}</small></strong>
              <b aria-hidden="true">→</b>
            </div>
          </article>
        ))}
      </div>

      <footer className="side-moments">
        <div className="side-filmstrip">
          <figure><img src="/media/personal/portrait.jpg" alt="生活瞬间" loading="lazy" /></figure>
          <figure><img src="/media/personal/sunset.jpg" alt="海边日落摄影" loading="lazy" /></figure>
          <figure><img src="/media/personal/pink-beach.jpg" alt="粉色海滩摄影" loading="lazy" /></figure>
        </div>
        <div className="side-signature">Huang</div>
        <p>Football. Cinema. Games. Images. Stories.<span>在产品之外，继续收集真实世界的灵感。</span></p>
      </footer>
    </section>
  );
}
