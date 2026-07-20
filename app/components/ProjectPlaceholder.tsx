import { ArrowLeft, ArrowUpRight } from "lucide-react";

type ProjectPlaceholderProps = {
  number: string;
  title: string;
  category: string;
};

export default function ProjectPlaceholder({
  number,
  title,
  category,
}: ProjectPlaceholderProps) {
  return (
    <main className="project-placeholder">
      <nav className="project-placeholder-nav">
        <a href="/#projects">
          <ArrowLeft size={16} /> Back to projects
        </a>
        <span>HUANG QIANG / CASE {number}</span>
      </nav>
      <section className="project-placeholder-content">
        <span>{category}</span>
        <h1 className="hero-heading">{title}</h1>
        <p>项目详情正在整理中。</p>
        <a href="mailto:amcdihq@163.com">
          Discuss this project <ArrowUpRight size={17} />
        </a>
      </section>
      <div className="project-placeholder-index">{number}</div>
    </main>
  );
}

