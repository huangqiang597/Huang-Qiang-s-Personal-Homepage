"use client";

import { type CSSProperties } from "react";
import ProfileCard from "./ProfileCard";

const heroProjects = [
  {
    number: "01",
    category: "AGENT / INTERNSHIP",
    title: "魔镜 on run",
    subtitle: "厦门光辰智能",
    image: "/media/magic-mirror.jpg",
    href: "/projects/magic-mirror",
    accent: "#7ca7ff",
  },
  {
    number: "02",
    category: "AGENT / ENTERPRISE",
    title: "星旅",
    subtitle: "广州省心购科技",
    image: "/media/star-travel.png",
    href: "/projects/star-travel",
    accent: "#9b79ff",
  },
  {
    number: "03",
    category: "PRODUCT / BUSINESS",
    title: "卉木盈海，草色宛墙",
    subtitle: "互联网+ 省银奖",
    image: "/media/concrete-ui.jpg",
    href: "/projects/huimu-yinghai",
    accent: "#72d8be",
  },
];

export default function HeroProjectCards() {
  return (
    <section className="hero-projects-layer" id="projects" aria-label="精选项目">
      <div className="hero-projects-grid">
        {heroProjects.map((project, index) => (
          <div
            className={`hero-project-card hero-project-card--${index + 1}`}
            key={project.number}
            style={{ "--card-accent": project.accent } as CSSProperties}
          >
            <ProfileCard
              imageUrl={project.image}
              href={project.href}
              number={project.number}
              category={project.category}
              name={project.title}
              title={project.subtitle}
              accent={project.accent}
              enableTilt
              behindGlowEnabled
            />
          </div>
        ))}
      </div>
      <p className="hero-projects-hint">MOVE · TILT · CLICK TO ENTER</p>
    </section>
  );
}
