"use client";

import { useEffect, useRef, useState } from "react";
import { Mesh, Program, Renderer, Triangle } from "ogl";
import "./Ferrofluid.css";

const MAX_COLORS = 8;

export type FerrofluidProps = {
  className?: string;
  dpr?: number;
  colors?: string[];
  speed?: number;
  scale?: number;
  turbulence?: number;
  fluidity?: number;
  rimWidth?: number;
  sharpness?: number;
  shimmer?: number;
  glow?: number;
  flowDirection?: "up" | "down" | "left" | "right";
  opacity?: number;
  mouseInteraction?: boolean;
  mouseStrength?: number;
  mouseRadius?: number;
  mouseDampening?: number;
  mixBlendMode?: string;
};

const hexToRGB = (hex: string) => {
  const color = hex.replace("#", "").padEnd(6, "0");
  return [
    Number.parseInt(color.slice(0, 2), 16) / 255,
    Number.parseInt(color.slice(2, 4), 16) / 255,
    Number.parseInt(color.slice(4, 6), 16) / 255,
  ];
};

const prepColors = (input: string[]) => {
  const base = (input.length ? input : ["#4F46E5", "#06B6D4", "#E0F2FE"]).slice(0, MAX_COLORS);
  const values = Array.from({ length: MAX_COLORS }, (_, index) => hexToRGB(base[Math.min(index, base.length - 1)]));
  return { values, count: base.length };
};

const flowVec = (direction: FerrofluidProps["flowDirection"]) => {
  if (direction === "up") return [0, 1];
  if (direction === "left") return [-1, 0];
  if (direction === "right") return [1, 0];
  return [0, -1];
};

const vertex = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main(){vUv=uv;gl_Position=vec4(position,0.0,1.0);}
`;

const fragment = `
precision highp float;
uniform vec3 iResolution; uniform vec2 iMouse; uniform float iTime;
uniform vec3 uColor0; uniform vec3 uColor1; uniform vec3 uColor2; uniform vec3 uColor3;
uniform vec3 uColor4; uniform vec3 uColor5; uniform vec3 uColor6; uniform vec3 uColor7;
uniform int uColorCount; uniform vec2 uFlow; uniform float uSpeed; uniform float uScale;
uniform float uTurbulence; uniform float uFluidity; uniform float uRimWidth; uniform float uSharpness;
uniform float uShimmer; uniform float uGlow; uniform float uOpacity; uniform float uMouseEnabled;
uniform float uMouseStrength; uniform float uMouseRadius; varying vec2 vUv;
#define PI 3.14159265
vec3 palette(float h){
  int count=uColorCount; if(count<1)count=1; int idx=int(floor(clamp(h,0.0,0.999999)*float(count)));
  if(idx<=0)return uColor0; if(idx==1)return uColor1; if(idx==2)return uColor2; if(idx==3)return uColor3;
  if(idx==4)return uColor4; if(idx==5)return uColor5; if(idx==6)return uColor6; return uColor7;
}
float hash(vec3 p3){p3=fract(p3*0.1031);p3+=dot(p3,p3.zyx+33.33);return fract((p3.x+p3.y)*p3.z);}
float smin(float a,float b,float k){float r=exp2(-a/k)+exp2(-b/k);return -k*log2(r);}
float sinlerp(float a,float b,float w){return mix(a,b,(sin(w*PI-PI/2.0)+1.0)/2.0);}
float vn(vec2 p,float s,float seed){
  vec2 cellp=floor(p/s);vec2 relp=mod(p,s);float g1=hash(vec3(cellp,seed));
  float g2=hash(vec3(cellp.x+1.0,cellp.y,seed));float g3=hash(vec3(cellp.x+1.0,cellp.y+1.0,seed));
  float g4=hash(vec3(cellp.x,cellp.y+1.0,seed));float bx=sinlerp(g1,g2,relp.x/s);float tx=sinlerp(g4,g3,relp.x/s);
  return sinlerp(bx,tx,relp.y/s);
}
float dbn(vec2 p,float s,float seed){
  float o=s/2.0;float n0=vn(p,s,seed);float n1=vn(p+vec2(o,o),s,seed+0.1);
  float n2=vn(p+vec2(-o,o),s,seed+0.2);float n3=vn(p+vec2(o,-o),s,seed+0.3);
  float n4=vn(p+vec2(-o,-o),s,seed+0.4);return(2.0*n0+1.5*n1+1.25*n2+1.125*n3+n4)/7.0;
}
void main(){
  vec2 fragCoord=vUv*iResolution.xy;float ref=700.0/max(uScale,0.05);vec2 p=fragCoord/iResolution.y*ref;
  float spd=200.0*uSpeed;float t=iTime;vec2 dir=uFlow;vec2 perp=vec2(-dir.y,dir.x);
  float distort1=vn(p+perp*(t*spd),60.0,10.0)*50.0*uTurbulence;
  float distort2=vn(p-perp*(t*spd),120.0,15.0)*100.0*uTurbulence;
  float peaks=dbn(p+distort1+dir*(t*spd*0.5),40.0,1.0);
  float peaks2=dbn(p+distort2-dir*(t*spd*0.5),40.0,0.0);
  float merged=smin(peaks,peaks2,max(uFluidity,0.001));float mGlow=0.0;
  if(uMouseEnabled>0.5){vec2 mp=iMouse/iResolution.y*ref;float md=length(p-mp)/ref;float rr=max(uMouseRadius,0.02);mGlow=exp(-md*md/(rr*rr))*uMouseStrength;}
  float band=(uRimWidth-abs((merged-0.4)*2.0))*5.0;
  float light=clamp(band-vn(p+dir*(t*spd*0.5),60.0,12.0)*uShimmer,0.0,1.0);
  light=pow(light,uSharpness)*uGlow;light*=clamp(1.0-mGlow,0.0,1.0);
  float h=clamp(0.5+(peaks-peaks2)*0.8,0.0,1.0);vec3 outc=palette(h)*light;
  float alpha=clamp(max(outc.r,max(outc.g,outc.b)),0.0,1.0);gl_FragColor=vec4(outc,alpha*uOpacity);
}
`;

export default function Ferrofluid({
  className = "", dpr, colors = ["#ffffff", "#ffffff", "#ffffff"], speed = .5,
  scale = 1.6, turbulence = 1, fluidity = .1, rimWidth = .2, sharpness = 2.5,
  shimmer = 1.5, glow = 2, flowDirection = "down", opacity = 1, mouseInteraction = true,
  mouseStrength = 1, mouseRadius = .35, mouseDampening = .15, mixBlendMode,
}: FerrofluidProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const colorsKey = colors.join("|");

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let renderer: Renderer;
    try {
      renderer = new Renderer({ dpr: dpr ?? Math.min(window.devicePixelRatio || 1, 1.05), alpha: true, antialias: false });
    } catch {
      container.classList.add("ferrofluid-container--fallback");
      return;
    }
    const gl = renderer.gl;
    const canvas = gl.canvas as HTMLCanvasElement;
    gl.clearColor(0, 0, 0, 0);
    canvas.style.cssText = `width:100%;height:100%;display:block;${mixBlendMode ? `mix-blend-mode:${mixBlendMode}` : ""}`;
    container.appendChild(canvas);
    const { values, count } = prepColors(colorsKey.split("|"));
    const uniforms = {
      iResolution: { value: [gl.drawingBufferWidth, gl.drawingBufferHeight, 1] }, iMouse: { value: [0, 0] }, iTime: { value: 0 },
      uColor0: { value: values[0] }, uColor1: { value: values[1] }, uColor2: { value: values[2] }, uColor3: { value: values[3] },
      uColor4: { value: values[4] }, uColor5: { value: values[5] }, uColor6: { value: values[6] }, uColor7: { value: values[7] },
      uColorCount: { value: count }, uFlow: { value: flowVec(flowDirection) }, uSpeed: { value: speed }, uScale: { value: scale },
      uTurbulence: { value: turbulence }, uFluidity: { value: fluidity }, uRimWidth: { value: rimWidth }, uSharpness: { value: sharpness },
      uShimmer: { value: shimmer }, uGlow: { value: glow }, uOpacity: { value: opacity }, uMouseEnabled: { value: mouseInteraction ? 1 : 0 },
      uMouseStrength: { value: mouseStrength }, uMouseRadius: { value: mouseRadius },
    };
    const program = new Program(gl, { vertex, fragment, uniforms });
    const geometry = new Triangle(gl);
    const mesh = new Mesh(gl, { geometry, program });
    let raf = 0;
    let lastTime = 0;
    let target = [0, 0];
    let pageVisible = !document.hidden;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      renderer.setSize(Math.max(1, rect.width), Math.max(1, rect.height));
      uniforms.iResolution.value = [gl.drawingBufferWidth, gl.drawingBufferHeight, 1];
    };
    const move = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) return;
      const scaleFactor = renderer.dpr || 1;
      target = [(event.clientX - rect.left) * scaleFactor, (rect.height - (event.clientY - rect.top)) * scaleFactor];
    };
    const visibility = () => { pageVisible = !document.hidden; };
    const loop = (time: number) => {
      raf = requestAnimationFrame(loop);
      if (!pageVisible) return;
      uniforms.iTime.value = time * .001;
      const delta = lastTime ? (time - lastTime) / 1000 : 0;
      lastTime = time;
      const factor = mouseDampening <= 0 ? 1 : Math.min(1, 1 - Math.exp(-delta / Math.max(.0001, mouseDampening)));
      const current = uniforms.iMouse.value;
      current[0] += (target[0] - current[0]) * factor;
      current[1] += (target[1] - current[1]) * factor;
      renderer.render({ scene: mesh });
    };

    const observer = new ResizeObserver(resize);
    observer.observe(container);
    resize();
    if (mouseInteraction) window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("visibilitychange", visibility);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("pointermove", move);
      document.removeEventListener("visibilitychange", visibility);
      if (canvas.parentElement === container) container.removeChild(canvas);
      (program as unknown as { remove?: () => void }).remove?.();
      (geometry as unknown as { remove?: () => void }).remove?.();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [colorsKey, dpr, flowDirection, fluidity, glow, mixBlendMode, mouseDampening, mouseInteraction, mouseRadius, mouseStrength, opacity, rimWidth, scale, sharpness, shimmer, speed, turbulence]);

  return <div ref={containerRef} className={`ferrofluid-container ${className}`} aria-hidden="true" />;
}

export function ViewportFerrofluid({ className = "", ...props }: FerrofluidProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(() => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  useEffect(() => {
    const element = wrapperRef.current;
    if (!element) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const observer = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), { rootMargin: "100px", threshold: .02 });
    observer.observe(element);
    const updateMotion = () => setReducedMotion(media.matches);
    media.addEventListener("change", updateMotion);
    return () => { observer.disconnect(); media.removeEventListener("change", updateMotion); };
  }, []);

  return (
    <div ref={wrapperRef} className={`ferrofluid-viewport ${className}`} aria-hidden="true">
      {active && !reducedMotion ? <Ferrofluid {...props} /> : <div className="ferrofluid-static" />}
    </div>
  );
}
