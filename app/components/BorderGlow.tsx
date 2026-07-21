"use client";

import { CSSProperties, PointerEvent, ReactNode, useCallback, useMemo, useRef } from "react";
import "./BorderGlow.css";

type BorderGlowProps = { children: ReactNode; className?: string; edgeSensitivity?: number; glowColor?: string; backgroundColor?: string; borderRadius?: number; glowRadius?: number; glowIntensity?: number; coneSpread?: number; colors?: string[]; fillOpacity?: number; };
type GlowStyle = CSSProperties & Record<`--${string}`, string | number>;
const positions=["80% 55%","69% 34%","8% 6%","41% 38%","86% 85%","82% 18%","51% 4%"];
const colorMap=[0,1,2,0,1,2,1];

export default function BorderGlow({ children, className="", edgeSensitivity=30, glowColor="218 92 76", backgroundColor="#10141c", borderRadius=6, glowRadius=28, glowIntensity=.7, coneSpread=22, colors=["#7aa2ff","#d38aae","#8c7dff"], fillOpacity=.22 }: BorderGlowProps) {
  const cardRef=useRef<HTMLDivElement>(null);
  const style=useMemo(()=>{
    const match=glowColor.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/); const h=match?.[1]??"218",s=match?.[2]??"92",l=match?.[3]??"76";
    const vars:GlowStyle={"--card-bg":backgroundColor,"--edge-sensitivity":edgeSensitivity,"--border-radius":`${borderRadius}px`,"--glow-padding":`${glowRadius}px`,"--cone-spread":coneSpread,"--fill-opacity":fillOpacity};
    [100,60,50,40,30,20,10].forEach((opacity,index)=>{ const key=index===0?"--glow-color":`--glow-color-${opacity}`; vars[key]=`hsl(${h}deg ${s}% ${l}% / ${Math.min(opacity*glowIntensity,100)}%)`; });
    positions.forEach((position,index)=>{ vars[`--gradient-${index+1}`]=`radial-gradient(at ${position}, ${colors[colorMap[index]%colors.length]} 0px, transparent 50%)`; });
    vars["--gradient-base"]=`linear-gradient(${colors[0]} 0 100%)`; return vars;
  },[backgroundColor,borderRadius,colors,coneSpread,edgeSensitivity,fillOpacity,glowColor,glowIntensity,glowRadius]);
  const handlePointerMove=useCallback((event:PointerEvent<HTMLDivElement>)=>{ const card=cardRef.current;if(!card)return;const rect=card.getBoundingClientRect();const x=event.clientX-rect.left,y=event.clientY-rect.top,cx=rect.width/2,cy=rect.height/2,dx=x-cx,dy=y-cy;const kx=dx===0?Infinity:cx/Math.abs(dx),ky=dy===0?Infinity:cy/Math.abs(dy);const edge=Math.min(Math.max(1/Math.min(kx,ky),0),1);let angle=Math.atan2(dy,dx)*180/Math.PI+90;if(angle<0)angle+=360;card.style.setProperty("--edge-proximity",(edge*100).toFixed(3));card.style.setProperty("--cursor-angle",`${angle.toFixed(3)}deg`);},[]);
  return <div ref={cardRef} onPointerMove={handlePointerMove} className={`border-glow-card ${className}`} style={style}><span className="edge-light" /><div className="border-glow-inner">{children}</div></div>;
}
