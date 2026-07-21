"use client";

import { Mesh, Program, Renderer, Triangle } from "ogl";
import { useEffect, useRef } from "react";
import "./SoftAurora.css";

type SoftAuroraProps = {
  speed?: number; scale?: number; brightness?: number; color1?: string; color2?: string;
  noiseFrequency?: number; noiseAmplitude?: number; bandHeight?: number; bandSpread?: number;
  octaveDecay?: number; layerOffset?: number; colorSpeed?: number;
  enableMouseInteraction?: boolean; mouseInfluence?: number;
};

function hexToVec3(hex: string) {
  const value = hex.replace("#", "");
  return [parseInt(value.slice(0, 2), 16) / 255, parseInt(value.slice(2, 4), 16) / 255, parseInt(value.slice(4, 6), 16) / 255];
}

const vertexShader = `
attribute vec2 uv; attribute vec2 position; varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position, 0, 1); }
`;

const fragmentShader = `
precision highp float;
uniform float uTime, uSpeed, uScale, uBrightness, uNoiseFreq, uNoiseAmp, uBandHeight, uBandSpread, uOctaveDecay, uLayerOffset, uColorSpeed, uMouseInfluence;
uniform vec3 uResolution, uColor1, uColor2; uniform vec2 uMouse; uniform bool uEnableMouse;
#define TAU 6.28318
vec3 gradientHash(vec3 p) {
  p = vec3(dot(p, vec3(127.1,311.7,234.6)), dot(p, vec3(269.5,183.3,198.3)), dot(p, vec3(169.5,283.3,156.9)));
  vec3 h = fract(sin(p) * 43758.5453123); float phi = acos(2.0 * h.x - 1.0); float theta = TAU * h.y;
  return vec3(cos(theta) * sin(phi), sin(theta) * cos(phi), cos(phi));
}
float quinticSmooth(float t) { float t2=t*t; float t3=t*t2; return 6.0*t3*t2-15.0*t2*t2+10.0*t3; }
vec3 cosineGradient(float t, vec3 a, vec3 b, vec3 c, vec3 d) { return a + b * cos(TAU * (c * t + d)); }
float perlin3D(float amplitude, float frequency, float px, float py, float pz) {
  float x=px*frequency, y=py*frequency; float fx=floor(x), fy=floor(y), fz=floor(pz); float cx=ceil(x), cy=ceil(y), cz=ceil(pz);
  vec3 g000=gradientHash(vec3(fx,fy,fz)), g100=gradientHash(vec3(cx,fy,fz)), g010=gradientHash(vec3(fx,cy,fz)), g110=gradientHash(vec3(cx,cy,fz));
  vec3 g001=gradientHash(vec3(fx,fy,cz)), g101=gradientHash(vec3(cx,fy,cz)), g011=gradientHash(vec3(fx,cy,cz)), g111=gradientHash(vec3(cx,cy,cz));
  float d000=dot(g000,vec3(x-fx,y-fy,pz-fz)), d100=dot(g100,vec3(x-cx,y-fy,pz-fz));
  float d010=dot(g010,vec3(x-fx,y-cy,pz-fz)), d110=dot(g110,vec3(x-cx,y-cy,pz-fz));
  float d001=dot(g001,vec3(x-fx,y-fy,pz-cz)), d101=dot(g101,vec3(x-cx,y-fy,pz-cz));
  float d011=dot(g011,vec3(x-fx,y-cy,pz-cz)), d111=dot(g111,vec3(x-cx,y-cy,pz-cz));
  float sx=quinticSmooth(x-fx), sy=quinticSmooth(y-fy), sz=quinticSmooth(pz-fz);
  return amplitude * mix(mix(mix(d000,d100,sx),mix(d010,d110,sx),sy), mix(mix(d001,d101,sx),mix(d011,d111,sx),sy), sz);
}
float auroraGlow(float t, vec2 shift) {
  vec2 uv=gl_FragCoord.xy/uResolution.y; uv+=shift; float noiseVal=0.0, freq=uNoiseFreq, amp=uNoiseAmp; vec2 samplePos=uv*uScale;
  for(float i=0.0;i<3.0;i+=1.0){ noiseVal+=perlin3D(amp,freq,samplePos.x,samplePos.y,t); amp*=uOctaveDecay; freq*=2.0; }
  float yBand=uv.y*10.0-uBandHeight*10.0; return 0.3*max(exp(uBandSpread*(1.0-1.1*abs(noiseVal+yBand))),0.0);
}
void main(){
  vec2 uv=gl_FragCoord.xy/uResolution.xy; float t=uSpeed*0.4*uTime; vec2 shift=vec2(0.0); if(uEnableMouse){shift=(uMouse-0.5)*uMouseInfluence;}
  vec3 col=vec3(0.0);
  col+=0.99*auroraGlow(t,shift)*cosineGradient(uv.x+uTime*uSpeed*0.2*uColorSpeed,vec3(0.5),vec3(0.5),vec3(1.0),vec3(0.3,0.20,0.20))*uColor1;
  col+=0.99*auroraGlow(t+uLayerOffset,shift)*cosineGradient(uv.x+uTime*uSpeed*0.1*uColorSpeed,vec3(0.5),vec3(0.5),vec3(2.0,1.0,0.0),vec3(0.5,0.20,0.25))*uColor2;
  col*=uBrightness; gl_FragColor=vec4(col,clamp(length(col),0.0,1.0));
}`;

export default function SoftAurora({
  speed=.32, scale=1.35, brightness=.52, color1="#668cff", color2="#d28ba5",
  noiseFrequency=2.2, noiseAmplitude=.9, bandHeight=.52, bandSpread=.9, octaveDecay=.12,
  layerOffset=.3, colorSpeed=.7, enableMouseInteraction=true, mouseInfluence=.1,
}: SoftAuroraProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = containerRef.current;
    if (!container || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const renderer = new Renderer({ alpha: true, premultipliedAlpha: false, dpr: Math.min(window.devicePixelRatio || 1, 1.35) });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    let currentMouse = [0.5, 0.5]; let targetMouse = [0.5, 0.5]; let visible = true;
    const geometry = new Triangle(gl);
    const program = new Program(gl, { vertex: vertexShader, fragment: fragmentShader, uniforms: {
      uTime:{value:0},uResolution:{value:[1,1,1]},uSpeed:{value:speed},uScale:{value:scale},uBrightness:{value:brightness},
      uColor1:{value:hexToVec3(color1)},uColor2:{value:hexToVec3(color2)},uNoiseFreq:{value:noiseFrequency},uNoiseAmp:{value:noiseAmplitude},
      uBandHeight:{value:bandHeight},uBandSpread:{value:bandSpread},uOctaveDecay:{value:octaveDecay},uLayerOffset:{value:layerOffset},
      uColorSpeed:{value:colorSpeed},uMouse:{value:new Float32Array([.5,.5])},uMouseInfluence:{value:mouseInfluence},uEnableMouse:{value:enableMouseInteraction},
    }});
    const mesh = new Mesh(gl, { geometry, program });
    container.appendChild(gl.canvas);
    const resize = () => { renderer.setSize(container.offsetWidth, container.offsetHeight); program.uniforms.uResolution.value=[gl.canvas.width,gl.canvas.height,gl.canvas.width/gl.canvas.height]; };
    const move = (event: PointerEvent) => { targetMouse=[event.clientX/window.innerWidth,1-event.clientY/window.innerHeight]; };
    const leave = () => { targetMouse=[.5,.5]; };
    const observer = new IntersectionObserver(([entry]) => { visible=entry.isIntersecting; }); observer.observe(container);
    const resizeObserver = new ResizeObserver(resize); resizeObserver.observe(container); resize();
    if(enableMouseInteraction){ window.addEventListener("pointermove",move,{passive:true}); document.documentElement.addEventListener("mouseleave",leave); }
    let frame=0;
    const update=(time:number)=>{ frame=requestAnimationFrame(update); if(!visible||document.hidden)return; program.uniforms.uTime.value=time*.001; currentMouse[0]+=.05*(targetMouse[0]-currentMouse[0]); currentMouse[1]+=.05*(targetMouse[1]-currentMouse[1]); program.uniforms.uMouse.value[0]=currentMouse[0]; program.uniforms.uMouse.value[1]=currentMouse[1]; renderer.render({scene:mesh}); };
    frame=requestAnimationFrame(update);
    return()=>{ cancelAnimationFrame(frame); observer.disconnect(); resizeObserver.disconnect(); window.removeEventListener("pointermove",move); document.documentElement.removeEventListener("mouseleave",leave); gl.canvas.remove(); gl.getExtension("WEBGL_lose_context")?.loseContext(); };
  },[speed,scale,brightness,color1,color2,noiseFrequency,noiseAmplitude,bandHeight,bandSpread,octaveDecay,layerOffset,colorSpeed,enableMouseInteraction,mouseInfluence]);
  return <div ref={containerRef} className="soft-aurora-container" aria-hidden="true" />;
}
