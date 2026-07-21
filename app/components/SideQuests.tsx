"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  ArrowUpRight,
  BookOpen,
  Camera,
  CircleDot,
  Dumbbell,
  Gamepad2,
  Images,
  Mountain,
  Trophy,
  X,
  type LucideIcon,
} from "lucide-react";
import Folder from "./Folder";
import { ViewportFerrofluid } from "./Ferrofluid";
import "./SideQuests.css";

const SIDE_FLUID_COLORS = ["#5f9bff", "#925dff", "#ff6f91"];

type HobbyType = "football" | "cinema" | "gaming" | "badminton" | "hiking";

type GalleryItem = {
  title: string;
  eyebrow: string;
  src?: string;
  hobby?: HobbyType;
};

type FolderData = {
  number: string;
  title: string;
  english: string;
  color: string;
  icon: LucideIcon;
  gallery: GalleryItem[];
  preview: ReactNode[];
};

function ImagePaper({ src, title, eyebrow, className = "" }: { src: string; title: string; eyebrow: string; className?: string }) {
  return (
    <article className={`side-paper side-paper--image ${className}`}>
      <img src={src} alt={title} loading="lazy" />
      <div><small>{eyebrow}</small><strong>{title}</strong></div>
    </article>
  );
}

const hobbyLabels: Record<HobbyType, { title: string; english: string; kicker: string }> = {
  football: { title: "足球", english: "FOOTBALL", kicker: "PASS · MOVE · CREATE" },
  cinema: { title: "电影", english: "CINEMA", kicker: "STORIES ON SCREEN" },
  gaming: { title: "游戏", english: "GAMING", kicker: "PLAYER ONE" },
  badminton: { title: "羽毛球", english: "BADMINTON", kicker: "SERVE · SMASH · RESET" },
  hiking: { title: "爬山", english: "HIKING", kicker: "HIGHER THAN YESTERDAY" },
};

function HobbyPaper({ type }: { type: HobbyType }) {
  const label = hobbyLabels[type];
  return (
    <article className={`side-paper hobby-paper hobby-${type}`}>
      {type === "football" && <span className="football-field" />}
      {type === "cinema" && <span className="film-perforation" />}
      {type === "gaming" && <Gamepad2 />}
      {type === "badminton" && <Dumbbell />}
      {type === "hiking" && <Mountain />}
      <small>{label.kicker}</small>
      <strong>{label.title}<br /><b>{label.english}</b></strong>
      {type === "cinema" && <em>ADMIT ONE · H7</em>}
    </article>
  );
}

const hobbies: GalleryItem[] = (Object.keys(hobbyLabels) as HobbyType[]).map((hobby) => ({
  hobby,
  title: hobbyLabels[hobby].title,
  eyebrow: hobbyLabels[hobby].english,
}));

const honors: GalleryItem[] = [
  { src: "/media/personal/honor-01.jpg", title: "全国船舶工业 CAE 大赛二等奖", eyebrow: "NATIONAL · 2024" },
  { src: "/media/personal/honor-02.jpg", title: "挑战杯优秀台湾创业青年项目", eyebrow: "CHALLENGE CUP" },
  { src: "/media/personal/honor-03.jpg", title: "挑战杯福建省银奖", eyebrow: "ENTREPRENEURSHIP" },
  { src: "/media/personal/honor-04.jpg", title: "学业奖学金", eyebrow: "SCHOLARSHIP" },
  { src: "/media/personal/honor-05.jpg", title: "全国海洋航行器设计大赛一等奖", eyebrow: "NATIONAL · FIRST PRIZE" },
  { src: "/media/personal/honor-06.png", title: "足球赛二等奖", eyebrow: "FOOTBALL · TEAM" },
];

const otherSkills: GalleryItem[] = [
  { src: "/media/personal/skill-social.png", title: "自媒体运营", eyebrow: "2.2 万粉丝 · 16.7 万互动" },
  { src: "/media/personal/photo-01.jpg", title: "粉沙来客", eyebrow: "WILDLIFE · PHOTOGRAPHY" },
  { src: "/media/personal/photo-02.jpg", title: "落日海岸", eyebrow: "GOLDEN HOUR" },
  { src: "/media/personal/photo-03.jpg", title: "粉色海湾", eyebrow: "LANDSCAPE · STORY" },
  { src: "/media/personal/photo-04.jpg", title: "海边剪影", eyebrow: "LIGHT · TIME · MEMORY" },
  { src: "/media/personal/photo-05.jpg", title: "暮色泊船", eyebrow: "QUIET FRAME" },
  { src: "/media/personal/photo-06.jpg", title: "水光与蜥蜴", eyebrow: "DETAILS IN NATURE" },
  { src: "/media/personal/photo-07.png", title: "海滩小鹿", eyebrow: "WILDLIFE PORTRAIT" },
  { src: "/media/personal/photo-08.jpg", title: "远山与鹿", eyebrow: "TELEPHOTO MOMENT" },
  { src: "/media/personal/photo-09.jpg", title: "掌心的粉色海岸", eyebrow: "VISUAL STORYTELLING" },
];

const personalPhotos: GalleryItem[] = [
  { src: "/media/personal/life-01.jpg", title: "红发时刻", eyebrow: "LIFE CUT · 01" },
  { src: "/media/personal/life-02.jpg", title: "朋友们的拍立得", eyebrow: "WITH FRIENDS" },
  { src: "/media/personal/life-03.jpg", title: "冬日光线", eyebrow: "SLOW AFTERNOON" },
  { src: "/media/personal/life-04.jpg", title: "散落的生活切片", eyebrow: "POLAROID MEMORY" },
  { src: "/media/personal/life-05.png", title: "海边的我", eyebrow: "COASTLINE" },
  { src: "/media/personal/life-06.jpg", title: "水族馆剪影", eyebrow: "BLUE HOUR" },
];

const research: GalleryItem[] = [
  { src: "/media/personal/research-01.png", title: "海洋工程 SCI 论文", eyebrow: "ELSEVIER · RESEARCH" },
  { src: "/media/personal/research-02.png", title: "浮式光伏 FPV2 研究", eyebrow: "RESEARCH PAPER" },
  { src: "/media/personal/research-03.png", title: "滑动型抗风浪海上光伏—波浪能集成", eyebrow: "INVENTION PATENT" },
  { src: "/media/personal/research-04.png", title: "摆式波浪能浮式风机集成装置", eyebrow: "INVENTION PATENT" },
  { src: "/media/personal/research-05.png", title: "防波堤—半潜式光伏—波浪能系统", eyebrow: "INVENTION PATENT" },
];

const makePreview = (items: GalleryItem[], prefix: string) => items.map((item, index) => (
  item.hobby
    ? <HobbyPaper key={`${prefix}-${index}`} type={item.hobby} />
    : <ImagePaper key={`${prefix}-${index}`} src={item.src!} title={item.title} eyebrow={item.eyebrow} />
));

const folders: FolderData[] = [
  { number: "01", title: "兴趣爱好", english: "HOBBIES", color: "#1555a9", icon: CircleDot, gallery: hobbies, preview: makePreview(hobbies, "hobby") },
  { number: "02", title: "荣誉", english: "HONORS", color: "#5631af", icon: Trophy, gallery: honors, preview: makePreview(honors, "honor") },
  { number: "03", title: "其他能力", english: "OTHER SKILLS", color: "#a64e49", icon: Camera, gallery: otherSkills, preview: makePreview(otherSkills, "skill") },
  { number: "04", title: "个人照片", english: "LIFE FRAMES", color: "#176b71", icon: Images, gallery: personalPhotos, preview: makePreview(personalPhotos, "life") },
  { number: "05", title: "科研经历", english: "RESEARCH", color: "#765123", icon: BookOpen, gallery: research, preview: makePreview(research, "research") },
];

export default function SideQuests() {
  const [activeFolder, setActiveFolder] = useState<FolderData | null>(null);

  useEffect(() => {
    if (!activeFolder) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveFolder(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [activeFolder]);

  return (
    <section className="side-quests" id="about" aria-labelledby="side-quests-title">
      <ViewportFerrofluid
        className="side-ferrofluid"
        colors={SIDE_FLUID_COLORS}
        speed={.26}
        scale={1.72}
        turbulence={.88}
        fluidity={.18}
        rimWidth={.24}
        sharpness={3.7}
        shimmer={.92}
        glow={2.25}
        flowDirection="right"
        opacity={.53}
        mouseStrength={.88}
        mouseRadius={.29}
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
        <p className="side-interaction-hint">CLICK A FOLDER TO OPEN <i /> MOVE TO EXPLORE</p>
      </header>

      <div className="side-folder-grid">
        {folders.map(({ icon: Icon, ...folder }) => (
          <article className="side-folder-entry" key={folder.number}>
            <Folder color={folder.color} items={folder.preview} label={folder.title} defaultOpen />
            <div className="side-folder-label">
              <span>{folder.number}</span><i><Icon /></i>
              <strong>{folder.title} <small>/ {folder.english}</small></strong>
              <b aria-hidden="true">→</b>
            </div>
            <button className="side-folder-open" type="button" onClick={() => setActiveFolder({ icon: Icon, ...folder })}>
              查看全部 {String(folder.gallery.length).padStart(2, "0")} FILES <ArrowUpRight />
            </button>
          </article>
        ))}
      </div>

      <footer className="side-moments">
        <div className="side-signature">Huang</div>
        <p>Football. Cinema. Games. Images. Stories.<span>在产品之外，继续收集真实世界的灵感。</span></p>
      </footer>

      {activeFolder && (
        <div className="side-archive" role="dialog" aria-modal="true" aria-label={`${activeFolder.title}完整文件夹`} onMouseDown={(event) => {
          if (event.target === event.currentTarget) setActiveFolder(null);
        }}>
          <div className="side-archive-panel">
            <header>
              <div><small>FOLDER / {activeFolder.number}</small><h3>{activeFolder.title}</h3><p>{activeFolder.english} · {activeFolder.gallery.length} FILES</p></div>
              <button type="button" onClick={() => setActiveFolder(null)} aria-label="关闭文件夹"><X /></button>
            </header>
            <div className="side-archive-grid">
              {activeFolder.gallery.map((item, index) => (
                <article className={`side-archive-card${item.hobby ? " is-hobby" : ""}`} key={`${activeFolder.number}-${index}`}>
                  {item.hobby ? <HobbyPaper type={item.hobby} /> : <img src={item.src} alt={item.title} loading="lazy" />}
                  <div className="side-archive-meta"><small>{String(index + 1).padStart(2, "0")} · {item.eyebrow}</small><strong>{item.title}</strong></div>
                </article>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
