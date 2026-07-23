"use client";

import { PointerEvent as ReactPointerEvent, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BellRing,
  Building2,
  Camera,
  CheckCircle2,
  ClipboardList,
  Droplets,
  Factory,
  FlaskConical,
  Gauge,
  History,
  Leaf,
  Recycle,
  Route,
  Sprout,
  Thermometer,
  Trophy,
  Waves,
} from "lucide-react";
import BorderGlow from "./BorderGlow";
import CircularGallery from "./CircularGallery";
import "./HuimuYinghaiCaseStudy.css";

const coverGalleryItems = [
  { image: "/media/huimu-gallery/huimu-gallery-01.webp", text: "红树林幼苗实地培育" },
  { image: "/media/huimu-gallery/huimu-gallery-02.webp", text: "生态基底生长实验" },
  { image: "/media/huimu-gallery/huimu-gallery-03.webp", text: "卉木盈海实体绿植墙" },
  { image: "/media/huimu-gallery/huimu-gallery-04.webp", text: "项目方案路演展示" },
];

const pipeline = [
  { src: "/media/huimu-material-1.webp", label: "市政污泥 / 海泥", caption: "原料回收" },
  { src: "/media/huimu-material-2.webp", label: "轻质陶粒", caption: "资源转化" },
  { src: "/media/huimu-material-3.webp", label: "多孔骨架", caption: "结构成型" },
  { src: "/media/huimu-material-4.webp", label: "植物根系", caption: "根系穿透" },
  { src: "/media/huimu-material-5.webp", label: "生态岸线", caption: "场景落地" },
];

const capabilities = [
  {
    index: "01",
    title: "资源化骨料",
    text: "污泥制陶粒，减少天然石材使用与材料碳排放。",
    icon: Recycle,
  },
  {
    index: "02",
    title: "根系与蓄排水",
    text: "多孔结构承载根系，实现透气、过滤与雨水复用。",
    icon: Sprout,
  },
  {
    index: "03",
    title: "消浪与修复",
    text: "支持红树林适生，形成缓流、增淤、固沙生态屏障。",
    icon: Waves,
  },
];

const uiScreens = [
  { src: "/media/huimu-ui-overview.jpeg", number: "01", title: "生产总览", note: "进度、异常与待办" },
  { src: "/media/huimu-ui-monitor.jpeg", number: "02", title: "监测中心", note: "温湿度与内外温差" },
  { src: "/media/huimu-ui-record.jpeg", number: "03", title: "浇筑记录", note: "方量、坍落度与影像" },
  { src: "/media/huimu-ui-process.jpeg", number: "04", title: "工序管理", note: "节点状态与问题闭环" },
];

const deliverySteps = [
  { index: "01", title: "记录", note: "部位、等级、方量与现场影像", icon: ClipboardList },
  { index: "02", title: "监测", note: "温湿度、温差与结构状态", icon: Gauge },
  { index: "03", title: "预警", note: "异常阈值触发与责任人通知", icon: BellRing },
  { index: "04", title: "验收", note: "对照技术与量产标准完成判断", icon: CheckCircle2 },
  { index: "05", title: "追溯", note: "历史批次、照片和处理结果留档", icon: History },
];

const workItems = [
  {
    index: "01",
    title: "竞品调研与渗透定价",
    text: "调研 10+ 家国内外供应商，识别行业价格 600—800 元/m³；制定 500 元/m³ 渗透价，以约 25% 的价格优势进入政府基建和大型地产供应链。",
    label: "KEY DECISION",
    decision: "用更低的首次采用门槛，换取示范项目与渠道验证。",
    tags: ["10+ 竞品", "500 元/m³", "-25%"],
    icon: Trophy,
  },
  {
    index: "02",
    title: "跨方协作与 MVP 定义",
    text: "连接福州大学研发团队与 OEM 工厂，在“高性能”和“低成本量产”之间建立可执行的验收标准；独立完成混凝土过程监测小程序 UI。",
    label: "MVP ACCEPTANCE",
    decision: "强度 · 坍落度 · 孔隙率 · 透水性 · 浮性 · 抗蚀性",
    tags: ["研发 × OEM", "工程验收", "小程序 UI"],
    icon: FlaskConical,
  },
  {
    index: "03",
    title: "商业化与渠道落地",
    text: "推动晋江洪山文创园项目落地，建立“直销 + OEM”渠道矩阵，连接政府基建、房地产和制造伙伴，并沉淀专利与标准化交付能力。",
    label: "BUSINESS MODEL",
    decision: "实验室 → OEM 工厂 → 示范工程 → 规模化渠道",
    tags: ["工程落地", "直销 + OEM", "发明专利"],
    icon: Route,
  },
];

const outcomes = [
  { value: "银奖", label: "互联网+创新创业项目" },
  { value: "1", label: "晋江洪山文创园落地案例" },
  { value: "1500万", label: "十年模型预计年营收" },
  { value: "550万", label: "十年模型预计年净利润" },
];

export default function HuimuYinghaiCaseStudy() {
  const pageRef = useRef<HTMLElement>(null);

  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    const page = pageRef.current;
    if (!page) return;
    page.style.setProperty("--hy-aurora-x", `${(event.clientX / window.innerWidth) * 100}%`);
    page.style.setProperty("--hy-aurora-y", `${(event.clientY / window.innerHeight) * 100}%`);
  };

  return (
    <main ref={pageRef} onPointerMove={handlePointerMove} className="hy-case">
      <div className="hy-aurora-background" aria-hidden="true" />

      <section className="hy-screen hy-hero" aria-labelledby="hy-title">
        <header className="hy-topbar">
          <Link href="/#projects"><ArrowLeft />返回首页</Link>
          <span><b>03</b> / PROJECT CASE</span>
          <span className="hy-draft-label">PRODUCT × COMMERCIALIZATION</span>
        </header>

        <div className="hy-hero-copy">
          <p>03 / ECOLOGICAL MATERIAL PRODUCT</p>
          <h1 id="hy-title" aria-label="HUIMU YINGHAI"><span>HUIMU</span><span>YINGHAI</span></h1>
          <div className="hy-cn-name">卉木盈海 · 草色宛墙</div>
          <div className="hy-hero-background-copy">
            <small>PROJECT BACKGROUND</small>
            <p>以市政污泥与海泥制备轻质陶粒，构建兼具结构强度、植物适生性与生态修复能力的植生混凝土产品，面向墙面绿化、海岸消浪与城市基础设施场景。</p>
          </div>
        </div>

        <div className="hy-hero-visual">
          <img src="/media/huimu-ai-v1.webp" alt="应用于海岸与墙面绿化的植生混凝土概念场景" />
        </div>

        <div className="hy-cover-gallery">
          <div className="hy-cover-gallery-header">
            <div>
              <small>PROJECT ARCHIVE / 04</small>
              <strong>从实验现场，到真实生长。</strong>
            </div>
            <span><i aria-hidden="true">↔</i> 拖动探索</span>
          </div>
          <CircularGallery
            items={coverGalleryItems}
            bend={1.6}
            borderRadius={0.055}
            scrollSpeed={1.7}
            scrollEase={0.06}
          />
        </div>

        <dl className="hy-hero-meta">
          <div><dt>项目概况</dt><dd>互联网+银奖 · 福州大学 × 晋江南泰建材</dd></div>
          <div><dt>竞品调研</dt><dd><strong>10+</strong><small>家厂商</small></dd></div>
          <div><dt>渗透定价</dt><dd><strong>500</strong><small>元 / m³</small></dd></div>
          <div><dt>价格优势</dt><dd><strong>-25%</strong><small>低于均价</small></dd></div>
        </dl>

        <BorderGlow
          className="hy-product-glow"
          backgroundColor="#08131a"
          borderRadius={26}
          glowRadius={34}
          glowIntensity={0.78}
          fillOpacity={0.18}
          colors={["#5dd6cb", "#758dff", "#ef9a6b"]}
        >
          <div className="hy-product-panel">
            <div className="hy-pipeline-wrap">
              <header><Leaf /><div><small>PRODUCT CAPABILITY</small><h3>从固废到生态基础设施</h3></div></header>
              <div className="hy-pipeline">
                {pipeline.map((item, index) => (
                  <div className="hy-pipeline-pair" key={item.label}>
                    <div className="hy-pipeline-node">
                      <i><img src={item.src} alt="" /></i>
                      <b>{item.label}</b><small>{item.caption}</small>
                    </div>
                    {index < pipeline.length - 1 && <span aria-hidden="true">→</span>}
                  </div>
                ))}
              </div>
            </div>
            <div className="hy-capabilities">
              {capabilities.map(({ icon: Icon, ...item }) => (
                <article key={item.index}>
                  <div className="hy-capability-index"><strong>{item.index}</strong><Icon /></div>
                  <div className="hy-capability-copy"><h3>{item.title}</h3><p>{item.text}</p></div>
                </article>
              ))}
            </div>
          </div>
        </BorderGlow>
      </section>

      <section className="hy-screen hy-ui-section" aria-labelledby="hy-ui-title">
        <header className="hy-section-heading">
          <div className="hy-section-title"><strong>02</strong><div><small>CONCRETE OPS MINI PROGRAM</small><h2 id="hy-ui-title">混凝土监测小程序</h2></div></div>
          <p>将浇筑记录、环境监测、异常预警和工程追溯集中到移动端，让研发标准真正进入 OEM 工厂与施工现场。</p>
        </header>

        <div className="hy-ui-layout">
          <div className="hy-phone-stage">
            {uiScreens.map((screen, index) => (
              <figure className={`hy-phone hy-phone-${index + 1}`} key={screen.src}>
                <BorderGlow
                  className="hy-phone-glow"
                  edgeSensitivity={14}
                  backgroundColor="#05090e"
                  borderRadius={34}
                  glowRadius={26}
                  glowIntensity={0.9}
                  fillOpacity={0.14}
                  colors={["#5aa8ff", "#65d9d0", "#8c82ff"]}
                >
                  <div className="hy-phone-frame"><img src={screen.src} alt={`混凝土监测小程序：${screen.title}`} loading="lazy" /></div>
                </BorderGlow>
                <figcaption><b>{screen.number} / {screen.title}</b><span>{screen.note}</span></figcaption>
              </figure>
            ))}
          </div>

          <BorderGlow
            className="hy-delivery-glow"
            backgroundColor="#09121d"
            borderRadius={24}
            glowRadius={32}
            glowIntensity={0.72}
            colors={["#5aa8ff", "#62d8cf", "#817dff"]}
          >
            <aside className="hy-delivery-panel">
              <header><small>DELIVERY LOOP</small><h3>工程交付闭环</h3><p>从一线记录到质量验收，把每次浇筑变成可判断、可预警、可追溯的数字信号。</p></header>
              <div className="hy-delivery-steps">
                {deliverySteps.map(({ icon: Icon, ...step }) => (
                  <article key={step.index}><i><Icon /></i><div><b>{step.index} / {step.title}</b><span>{step.note}</span></div></article>
                ))}
              </div>
              <div className="hy-feature-block"><div className="hy-feature-title">KEY FEATURES</div>
                <div className="hy-feature-chips">
                  <span><Camera />GPS 水印照片</span><span><Building2 />强度等级</span><span><Droplets />坍落度</span>
                  <span><Thermometer />温湿度曲线</span><span><BellRing />温差预警</span><span><Factory />批次状态</span>
                </div>
              </div>
            </aside>
          </BorderGlow>
        </div>
        <div className="hy-ui-foot" aria-hidden="true">RECORD → MONITOR → ALERT → ACCEPT → TRACE</div>
      </section>

      <section className="hy-screen hy-work-section" aria-labelledby="hy-work-title">
        <header className="hy-section-heading">
          <div className="hy-section-title"><strong>03</strong><div><small>MY WORK · FROM LAB TO MARKET</small><h2 id="hy-work-title">我的主要工作</h2></div></div>
          <p>围绕“技术能不能做、工厂能不能稳定生产、市场愿不愿意买”，完成从竞品、MVP 到商业落地的产品化闭环。</p>
        </header>

        <div className="hy-work-grid">
          {workItems.map(({ icon: Icon, ...item }) => (
            <BorderGlow
              className={`hy-work-glow hy-work-glow-${item.index}`}
              key={item.index}
              backgroundColor="#0a1119"
              borderRadius={24}
              glowRadius={34}
              glowIntensity={0.76}
              fillOpacity={0.17}
              colors={["#5fd4cd", "#817dff", "#ef9a6b"]}
            >
              <article>
                <header><strong>{item.index}</strong><div><i><Icon /></i><h3>{item.title}</h3></div></header>
                <p>{item.text}</p>
                <div className="hy-work-decision"><small>{item.label}</small><b>{item.decision}</b></div>
                <footer>{item.tags.map((tag) => <span key={tag}>{tag}</span>)}</footer>
              </article>
            </BorderGlow>
          ))}
        </div>

        <div className="hy-outcomes">
          <div className="hy-outcomes-intro"><small>PROJECT OUTCOMES</small><strong>成果与工作直接对应，<br />形成完整的产品化证据链。</strong></div>
          {outcomes.map((item, index) => (
            <article key={item.label} className={index % 2 ? "hy-outcome-warm" : ""}><strong>{item.value}</strong><span>{item.label}</span></article>
          ))}
        </div>

        <footer className="hy-end"><h3>FROM SLUDGE TO A LIVING COASTLINE.</h3><p>PROJECT 03 · PRODUCT / MVP / COMMERCIALIZATION</p></footer>
      </section>
    </main>
  );
}
