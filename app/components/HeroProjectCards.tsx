"use client";

import { lazy, Suspense, type CSSProperties } from "react";

const Lanyard = lazy(() => import("./Lanyard"));

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
          <article
            className={`hero-project-card hero-project-card--${index + 1}`}
            key={project.number}
            style={{ "--card-accent": project.accent } as CSSProperties}
          >
            <Suspense
              fallback={
                <div className="hero-project-fallback">
                  <img src={project.image} alt="" />
                  <span>{project.number}</span>
                  <strong>{project.title}</strong>
                  <small>{project.subtitle}</small>
                </div>
              }
            >
              <Lanyard
                position={[0, 0, 25]}
                gravity={[0, -34, 0]}
                fov={22}
                frontImage={project.image}
                backImage={project.image}
                imageFit="cover"
                lanyardImage="/models/lanyard/lanyard.png"
                lanyardWidth={0.66}
                href={project.href}
                initialRotation={(index - 1) * 0.07}
                ariaLabel={`打开 ${project.title} 项目`}
                cardNumber={project.number}
                cardCategory={project.category}
                cardTitle={project.title}
                cardSubtitle={project.subtitle}
                cardAccent={project.accent}
              />
            </Suspense>
            <a className="hero-project-sr-link" href={project.href}>
              打开 {project.title} 项目 · {project.subtitle}
            </a>
          </article>
        ))}
      </div>
      <p className="hero-projects-hint">DRAG · SWING · CLICK TO ENTER</p>
    </section>
  );
}
