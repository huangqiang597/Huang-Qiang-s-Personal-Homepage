"use client";

import { PointerEvent as ReactPointerEvent, useEffect, useRef, useState } from "react";
import {
  Activity, ArrowLeft, ArrowRight, BarChart3, BrainCircuit, Camera,
  CircleGauge, Database, FlaskConical, Layers3, Network, ShieldAlert,
  Smartphone, Sparkles, UserRound,
} from "lucide-react";
import BorderGlow from "./BorderGlow";
import "./MagicMirrorCaseStudy.css";

const uiScreens = [
  { src: "/media/magic-mirror-ui-entry.jpg", number: "01", title: "进入页面", note: "建立品牌认知并引导进入服务" },
  { src: "/media/magic-mirror-ui-auth.jpg", number: "02", title: "授权页面", note: "完成授权并连接个人肌肤档案" },
  { src: "/media/magic-mirror-ui-home.jpg", number: "03", title: "首页 / 检测", note: "连接设备，查看当日肌肤状态" },
  { src: "/media/magic-mirror-ui-report.jpg", number: "04", title: "深度报告", note: "把指标翻译成可理解的洞察" },
  { src: "/media/magic-mirror-ui-diary.jpg", number: "05", title: "肌肤日记", note: "记录每日状态和护理变化" },
  { src: "/media/magic-mirror-ui-assistant.jpg", number: "06", title: "魔镜精灵", note: "获得个性化建议与日常陪伴" },
];

const workItems = [
  {
    index: "01",
    title: "RAG 与专业知识体系",
    text: "参照临床诊断路径搭建「问题定位→生理层级→内外因归因→方案推导」护肤知识库（7大问题类×9层生理结构×7大成分功能族）；通过查询改写、Top-K 重排，使标注的60条 Golden Query 的 Recall@3 由73%提升至90%、有据回答率68%→88%，平均上下文 Token 下降37%。",
    stats: ["7×9×7 知识体系", "Recall@3 73%→90%", "Token -37%"],
  },
  {
    index: "02",
    title: "模型分层与评测迭代",
    text: "从效果、时延、稳定性、成本四维评估 Kimi、Seed、GPT 等模型，制定 Pro/Lite 分层路由；设计27组新手期场景评测集与6维加权评分卡（含6条P0红线），经阶段化 Prompt 与 Bad Case 迭代，意图触发准确率73%→89%、核心路径 pass@1 67%→85%、pass³ 41%→70%。",
    stats: ["27组场景评测", "意图 73%→89%", "pass³ 41%→70%"],
  },
  {
    index: "03",
    title: "自动化与数据闭环",
    text: "Vibe Coding 搭建场景化自动化测试工具，支持多轮回归复测；设计硬件/软件/Agent 三生命周期的12张 DWD 表、400+字段埋点与内测看板，沉淀自动化评测等5+个 Skills，支撑50名种子用户内测与数据回收。",
    stats: ["12张 DWD 表", "400+ 字段埋点", "50名种子用户"],
  },
];

const knowledgeSteps = [
  { icon: CircleGauge, title: "问题定位", note: "症状识别 · 证据采集", meta: "7 大问题类" },
  { icon: Layers3, title: "生理层级", note: "真皮层 · 表皮层", meta: "9 层生理结构" },
  { icon: Network, title: "内外因归因", note: "内因 / 外因交叉分析", meta: "动态因果映射" },
  { icon: FlaskConical, title: "方案推导", note: "成分策略 · 护理建议", meta: "7 大成分功能族" },
];

const loopSteps = [
  { index: "1", title: "用户触发", text: "拍照、提问、查报告、记反馈", icon: UserRound },
  { index: "2", title: "会话与证据接入", text: "识别意图并汇集历史与环境信息", icon: BrainCircuit },
  { index: "3", title: "输入处理", text: "图像快模型与结构化证据链", icon: Camera },
  { index: "4", title: "诊断层", text: "形成并验证工作性判断", icon: Activity },
  { index: "5", title: "方案生成", text: "策略筛选、产品编排与结构化输出", icon: Sparkles },
  { index: "6", title: "长期反馈闭环", text: "保存证据并进行下一轮诊断比较", icon: Database },
];

const scoreDimensions = [
  ["效果", "30%"], ["时延", "20%"], ["安全性", "15%"],
  ["成本", "10%"], ["稳定性", "15%"], ["可用性", "10%"],
];

const redLines = [
  "禁止虚构成分宣称", "禁止功效绝对化表述", "禁止健康人群误导",
  "禁止医疗诊断替代", "禁止用户隐私泄露", "禁止不合规内容输出",
];

export default function MagicMirrorCaseStudy() {
  const pageRef = useRef<HTMLElement>(null);
  const [architectureOpen, setArchitectureOpen] = useState(false);

  useEffect(() => {
    if (!architectureOpen) return;
    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setArchitectureOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [architectureOpen]);

  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    const page = pageRef.current;
    if (!page) return;
    page.style.setProperty("--aurora-x", `${(event.clientX / window.innerWidth) * 100}%`);
    page.style.setProperty("--aurora-y", `${(event.clientY / window.innerHeight) * 100}%`);
  };

  return (
    <main ref={pageRef} onPointerMove={handlePointerMove} className="mm-case">
      <div className="mm-aurora-background" aria-hidden="true" />
      <section className="mm-hero" aria-labelledby="mm-title">
        <header className="mm-topbar">
          <a href="/#projects"><ArrowLeft /> 返回首页</a>
          <a href="/projects/star-travel">下一个项目 <ArrowRight /></a>
        </header>
        <div className="mm-rings mm-rings-css" aria-hidden="true"><i /><i /><i /></div>
        <div className="mm-hero-copy">
          <p>01 / 智能体产品</p>
          <h1 id="mm-title">MAGIC MIRROR<br />ON RUN</h1>
        </div>
        <div className="mm-mirror-visual"><img src="/media/magic-mirror-ai-v1.webp" alt="魔镜 on run 智能肌肤检测镜" /></div>
        <dl className="mm-meta">
          <div><dt>担任角色</dt><dd>AI 产品经理</dd></div>
          <div><dt>所属公司</dt><dd>厦门光辰智能</dd></div>
          <div><dt>项目阶段</dt><dd>正式上线</dd></div>
          <div><dt>负责范围</dt><dd>0-1产品上线 · 数据分析迭代</dd></div>
        </dl>
      </section>

      <section className="mm-background">
        <div className="mm-background-copy">
          <div className="mm-section-title"><strong>01</strong><h2>项目背景</h2></div>
          <p>一款面向日常护肤场景的软硬件一体化多模态 AI 产品，以智能镜端语音与视觉交互为入口，通过 Agent 统一编排肤况检测、肌肤日记、深度报告及护肤柜等能力，为用户提供持续、个性化且可执行的护肤决策。</p>
          <blockquote>“Beauty, in its own gentle rhythm”</blockquote>
        </div>
        <div className="mm-background-system">
          <div className="mm-system-flow">
            <article><i><Camera /></i><strong>硬件智能设备</strong><span>以语音与视觉交互感知真实肤况</span></article><ArrowRight />
            <article><i><Smartphone /></i><strong>微信小程序 / App</strong><span>承接报告、档案、日记与护肤柜</span></article><ArrowRight />
            <article><i><BrainCircuit /></i><strong>Agent 智能体</strong><span>统一编排能力并生成个性化决策</span></article>
          </div>
          <div className="mm-problems">
            <article><i aria-hidden="true">LOOP</i><span>01 / 核心护城河</span><h3>自研 Agent Loop</h3><p>以感知、规划、执行与反馈为主循环，把检测、档案和建议编排为连续体验。</p></article>
            <article><i aria-hidden="true">PRO</i><span>02 / 核心护城河</span><h3>护肤专业知识体系框架与评估标准</h3><p>从知识结构、来源分级到黄金问题集，让专业性可追溯、可度量、可回归。</p></article>
            <article><i aria-hidden="true">DATA</i><span>03 / 核心护城河</span><h3>数据飞轮体系</h3><p>让真实使用、问题案例和效果指标持续反哺产品与模型，形成越用越准的闭环。</p></article>
          </div>
        </div>
      </section>

      <section className="mm-ui-section">
        <div className="mm-section-title mm-ui-title"><strong>02</strong><h2>/ 小程序界面</h2></div>
        <div className="mm-phone-stage">
          {uiScreens.map((screen, index) => (
            <figure className={`mm-phone mm-phone-${index + 1}`} key={screen.src}>
              <BorderGlow className="mm-phone-glow" edgeSensitivity={14} glowColor="218 96 78" backgroundColor="#090d14" borderRadius={32} glowRadius={26} glowIntensity={.9} fillOpacity={.16} colors={["#75a0ff", "#e08cae", "#8c82ff"]}>
                <div className="mm-phone-frame"><img src={screen.src} alt={`魔镜小程序：${screen.title}`} loading="lazy" /></div>
              </BorderGlow>
              <figcaption><b>{screen.number} / {screen.title}</b><span>{screen.note}</span></figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="mm-work-section">
        <div className="mm-section-title mm-dark-title"><strong>03</strong><h2>/ 我的工作</h2></div>
        <div className="mm-work-grid">
          {workItems.map((item) => (
            <BorderGlow key={item.index} className="mm-work-glow" backgroundColor="#0e131b" borderRadius={22} glowRadius={30} colors={["#719dff", "#d58ba9", "#8c82ff"]}>
              <article>
                <div className="mm-work-heading">
                  <div className="mm-work-number"><span>MODULE</span><strong>{item.index}</strong></div>
                  <h3>{item.title}</h3>
                </div>
                <p>{item.text}</p>
                <footer>{item.stats.map((stat) => <span key={stat}>{stat}</span>)}</footer>
              </article>
            </BorderGlow>
          ))}
        </div>
      </section>

      <section className="mm-results-section">
        <header className="mm-results-heading">
          <div className="mm-section-title mm-dark-title"><strong>04</strong><h2>/ 成果图谱</h2></div>
          <p>从知识到智能，从评测到数据，把复杂系统变成清晰、可验证的产品能力。</p>
        </header>

        <div className="mm-results-grid">
          <BorderGlow className="mm-result-card mm-knowledge-card" backgroundColor="#0b1018" borderRadius={24} glowRadius={36} glowIntensity={.78} colors={["#5ca8ff", "#d97fb2", "#8775ff"]}>
            <article>
              <header className="mm-result-card-heading">
                <span>成果 01</span>
                <div><h3>专业护肤知识体系</h3><p>一条从症状证据到可执行方案的临床式推导路径</p></div>
              </header>
              <div className="mm-knowledge-flow">
                {knowledgeSteps.map(({ icon: Icon, ...step }, index) => (
                  <div className="mm-knowledge-step-wrap" key={step.title}>
                    <div className="mm-knowledge-step">
                      <i><Icon /></i><strong>{step.title}</strong><small>{step.note}</small><b>{step.meta}</b>
                    </div>
                    {index < knowledgeSteps.length - 1 && <ArrowRight />}
                  </div>
                ))}
              </div>
              <div className="mm-knowledge-matrix"><strong>7</strong><span>大问题类</span><i>×</i><strong>9</strong><span>层生理结构</span><i>×</i><strong>7</strong><span>大成分功能族</span></div>
              <button className="mm-architecture-thumb" type="button" onClick={() => setArchitectureOpen(true)} aria-haspopup="dialog">
                <span className="mm-architecture-preview"><img src="/media/agent-loop-architecture.png" alt="护肤 Agent 完整业务架构图缩略图" loading="lazy" /></span>
                <span className="mm-architecture-copy"><small>ORIGINAL MAP</small><strong>查看完整业务架构图</strong><em>点击放大 · 支持查看诊断、方案与长期反馈闭环</em></span>
                <span className="mm-architecture-expand" aria-hidden="true">↗</span>
              </button>
            </article>
          </BorderGlow>

          <BorderGlow className="mm-result-card mm-loop-card" backgroundColor="#0b1018" borderRadius={24} glowRadius={36} glowIntensity={.78} colors={["#e17fb2", "#6b9eff", "#8d78ff"]}>
            <article>
              <header className="mm-result-card-heading">
                <span>成果 02</span>
                <div><h3>自研 Agent Loop 框架</h3><p>让证据、判断、行动和反馈在同一条链路里持续生长</p></div>
              </header>
              <div className="mm-loop-visual">
                <div className="mm-loop-ring" />
                <div className="mm-loop-arcs" aria-hidden="true"><i /><i /><i /><i /></div>
                <span className="mm-loop-marker mm-loop-marker-1" aria-hidden="true">01</span>
                <span className="mm-loop-marker mm-loop-marker-2" aria-hidden="true">✦</span>
                <span className="mm-loop-marker mm-loop-marker-3" aria-hidden="true">03</span>
                <span className="mm-loop-marker mm-loop-marker-4" aria-hidden="true">↺</span>
                <div className="mm-loop-center"><b>∞</b><span>AGENT LOOP</span></div>
                {loopSteps.map(({ icon: Icon, ...step }) => (
                  <div className={`mm-loop-node mm-loop-node-${step.index}`} key={step.index}>
                    <i><Icon /></i><div><b>{step.index}</b><strong>{step.title}</strong><small>{step.text}</small></div>
                  </div>
                ))}
              </div>
            </article>
          </BorderGlow>

          <BorderGlow className="mm-result-card mm-evaluation-card" backgroundColor="#0b1018" borderRadius={24} glowRadius={36} glowIntensity={.75} colors={["#6b9eff", "#d97fb2", "#8d78ff"]}>
            <article>
              <header className="mm-result-card-heading">
                <span>成果 03</span>
                <div><h3>专业性评估指标</h3><p>把“感觉更好”变成可以复测、可以比较、可以决策的标准</p></div>
              </header>
              <div className="mm-evaluation-grid">
                <div className="mm-eval-panel mm-radar-panel">
                  <h4>四维模型评估</h4>
                  <div className="mm-radar"><i /><i /><i /><span>效果</span><span>时延</span><span>稳定性</span><span>成本</span></div>
                  <footer><span><i />Pro 路由</span><span><i />Lite 路由</span></footer>
                </div>
                <div className="mm-eval-panel mm-routing-panel">
                  <h4>分层路由策略</h4>
                  <div><b>Pro 路由</b><span>复杂场景 / 高风险 / 深度分析</span></div>
                  <i><BrainCircuit /></i>
                  <div><b>Lite 路由</b><span>常规场景 / 轻量 / 低成本</span></div>
                </div>
                <div className="mm-eval-panel mm-delta-panel">
                  <h4>关键指标跃迁</h4>
                  <p><span>意图触发准确率</span><b>73%</b><ArrowRight /><strong>89%</strong><em>+16pp</em></p>
                  <p><span>核心路径 pass@1</span><b>67%</b><ArrowRight /><strong>85%</strong><em>+18pp</em></p>
                  <p><span>核心路径 pass³</span><b>41%</b><ArrowRight /><strong>70%</strong><em>+29pp</em></p>
                </div>
                <div className="mm-eval-panel mm-score-panel">
                  <h4>6 维加权评分卡</h4>
                  <div>{scoreDimensions.map(([label, score]) => <span key={label}><b>{label}</b><small>{score}</small></span>)}</div>
                </div>
                <div className="mm-eval-panel mm-redline-panel">
                  <h4><ShieldAlert /> 6 条 P0 红线</h4>
                  <ul>{redLines.map((line) => <li key={line}><span>!</span>{line}</li>)}</ul>
                </div>
              </div>
            </article>
          </BorderGlow>

          <BorderGlow className="mm-result-card mm-dashboard-card" backgroundColor="#0b1018" borderRadius={24} glowRadius={40} glowIntensity={.9} colors={["#61a4ff", "#e27caf", "#8878ff"]}>
            <article>
              <header className="mm-result-card-heading">
                <span>成果 04</span>
                <div><h3>魔镜数据台</h3><p>从硬件、软件到 Agent 的三生命周期数据回收与内测观测</p></div>
              </header>
              <div className="mm-dashboard-browser">
                <div className="mm-browser-bar"><i /><i /><i /><span>MOJING INSIGHTS · AGENT ANALYTICS</span></div>
                <img src="/media/magic-mirror-dashboard.png" alt="魔镜数据台 Agent 工具使用与用户洞察看板" loading="lazy" />
              </div>
            </article>
          </BorderGlow>
        </div>
        <footer className="mm-results-footer"><Sparkles /><span>知识让我们理解世界，数据让我们持续进化。</span></footer>
      </section>

      {architectureOpen && (
        <div className="mm-lightbox" role="dialog" aria-modal="true" aria-label="完整业务架构图" onClick={() => setArchitectureOpen(false)}>
          <div className="mm-lightbox-panel" onClick={(event) => event.stopPropagation()}>
            <header><div><span>成果 01 / 原始架构图</span><strong>护肤 Agent 完整业务架构</strong></div><button type="button" onClick={() => setArchitectureOpen(false)} aria-label="关闭大图">×</button></header>
            <div className="mm-lightbox-scroll"><img src="/media/agent-loop-architecture.png" alt="从用户触发、证据接入、诊断、方案生成到长期反馈闭环的完整架构图" /></div>
            <footer>滚动查看完整流程 · 按 ESC 关闭</footer>
          </div>
        </div>
      )}

    </main>
  );
}
