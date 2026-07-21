"use client";

import { useState, type CSSProperties, type MouseEvent, type ReactNode } from "react";
import "./Folder.css";

type FolderProps = {
  color?: string;
  items?: ReactNode[];
  className?: string;
  defaultOpen?: boolean;
  label: string;
};

type FolderVariables = CSSProperties & {
  "--folder-color": string;
  "--folder-back-color": string;
};

type PaperVariables = CSSProperties & {
  "--magnet-x"?: string;
  "--magnet-y"?: string;
};

function darkenColor(hex: string, percent: number) {
  const value = hex.replace("#", "").padEnd(6, "0");
  const number = Number.parseInt(value, 16);
  const factor = 1 - percent;
  const red = Math.max(0, Math.min(255, Math.floor(((number >> 16) & 255) * factor)));
  const green = Math.max(0, Math.min(255, Math.floor(((number >> 8) & 255) * factor)));
  const blue = Math.max(0, Math.min(255, Math.floor((number & 255) * factor)));
  return `#${((1 << 24) + (red << 16) + (green << 8) + blue).toString(16).slice(1)}`;
}

export default function Folder({ color = "#5227FF", items = [], className = "", defaultOpen = true, label }: FolderProps) {
  const papers = [...items.slice(0, 3)];
  while (papers.length < 3) papers.push(null);
  const [open, setOpen] = useState(defaultOpen);
  const [paperOffsets, setPaperOffsets] = useState(() => papers.map(() => ({ x: 0, y: 0 })));
  const folderStyle: FolderVariables = {
    "--folder-color": color,
    "--folder-back-color": darkenColor(color, .18),
  };

  const toggle = () => {
    setOpen((current) => !current);
    if (open) setPaperOffsets(papers.map(() => ({ x: 0, y: 0 })));
  };

  const movePaper = (event: MouseEvent<HTMLDivElement>, index: number) => {
    if (!open) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left - rect.width / 2) * .09;
    const y = (event.clientY - rect.top - rect.height / 2) * .09;
    setPaperOffsets((current) => current.map((offset, itemIndex) => itemIndex === index ? { x, y } : offset));
  };

  const resetPaper = (index: number) => {
    setPaperOffsets((current) => current.map((offset, itemIndex) => itemIndex === index ? { x: 0, y: 0 } : offset));
  };

  return (
    <div className={`folder-stage ${className}`}>
      <div
        className={`folder${open ? " open" : ""}`}
        style={folderStyle}
        onClick={toggle}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            toggle();
          }
        }}
        tabIndex={0}
        role="button"
        aria-expanded={open}
        aria-label={`${open ? "收起" : "展开"}${label}`}
      >
        <div className="folder__back">
          {papers.map((item, index) => {
            const paperStyle: PaperVariables = open ? {
              "--magnet-x": `${paperOffsets[index]?.x || 0}px`,
              "--magnet-y": `${paperOffsets[index]?.y || 0}px`,
            } : {};
            return (
              <div
                className={`folder-paper folder-paper-${index + 1}`}
                key={index}
                style={paperStyle}
                onClick={(event) => event.stopPropagation()}
                onMouseMove={(event) => movePaper(event, index)}
                onMouseLeave={() => resetPaper(index)}
              >
                {item}
              </div>
            );
          })}
          <div className="folder__front" />
          <div className="folder__front folder__front--right" />
        </div>
      </div>
    </div>
  );
}
