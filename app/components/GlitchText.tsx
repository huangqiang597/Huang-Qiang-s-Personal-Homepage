import type { CSSProperties } from "react";
import "./GlitchText.css";

type GlitchTextProps = {
  children: string;
  speed?: number;
  enableShadows?: boolean;
  enableOnHover?: boolean;
  className?: string;
};

type GlitchStyle = CSSProperties & {
  "--glitch-after-duration": string;
  "--glitch-before-duration": string;
  "--glitch-after-shadow": string;
  "--glitch-before-shadow": string;
};

export default function GlitchText({
  children,
  speed = 1,
  enableShadows = true,
  enableOnHover = true,
  className = "",
}: GlitchTextProps) {
  const inlineStyles: GlitchStyle = {
    "--glitch-after-duration": `${speed * 3}s`,
    "--glitch-before-duration": `${speed * 2}s`,
    "--glitch-after-shadow": enableShadows ? "-5px 0 #ff4f8b" : "none",
    "--glitch-before-shadow": enableShadows ? "5px 0 #55e7ff" : "none",
  };

  return (
    <span
      className={`glitch-text ${enableOnHover ? "glitch-text-on-hover" : ""} ${className}`.trim()}
      style={inlineStyles}
      data-text={children}
    >
      {children}
    </span>
  );
}
