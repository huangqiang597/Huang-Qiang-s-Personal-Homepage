"use client";

import {
  ArrowLeft, ArrowRight, ArrowUpRight, Camera, ChartNoAxesCombined,
  Database, FlaskConical, Layers3, ScanFace, Search,
  SlidersHorizontal, Smartphone, Sparkles,
} from "lucide-react";
import { lazy, Suspense } from "react";
import "./MagicMirrorCaseStudy.css";

const MagicRings = lazy(() => import("./MagicRings"));

const uiScreens = [
  { src: "/media/magic-mirror-ui-home.jpg", label: "肌肤检测首页", note: "检测入口与当日状态" },
  { src: "/media/magic-mirror-ui-report.jpg", label: "深度分析报告", note: "把专业指标转译为行动建议" },
  { src: "/media/magic-mirror-ui-diary.jpg", label: "肌肤日记", note: "连续记录变化与护理反馈" },
  { src: "/media/magic-mirror-ui-assistant.jpg", label: "魔镜精灵", note: "基于个人档案的 AI 对话" },
];

const workItems = [
  { icon: Layers3, index: "01", title: "产品策略与服务蓝图", text: "梳理设备、微信小程序与 AI Agent 的角色边界，设计从联网绑定、拍摄检测到报告解读与持续护理的完整用户旅程。", tags: ["PRD", "USER JOURNEY", "SERVICE BLUEPRINT"] },
  { icon: Database, index: "02", title: "RAG 专业知识系统", text: "搭建护肤知识的来源、版本与标签体系，围绕用户问题优化切片、召回与重排，让回答既专业又能落到个人行动。", tags: ["KNOWLEDGE BASE", "RAG", "RERANK"] },
  { icon: FlaskConical, index: "03", title: "评估与数据闭环", text: "建立 Golden Query、分层评测集和 Bad Case 回流机制，把模型效果从主观体验转化为可追踪、可回归的产品指标。", tags: ["EVALUATION", "BAD CASE", "DATA LOOP"] },
];

const retrievalSteps = [
  { icon: Search, number: "01", title: "Query Rewrite", text: "识别肤质、问题部位和咨询意图，补全口语省略，并统一成知识库可检索的标准表达。" },
  { icon: Database, number: "02", title: "Hybrid Retrieval", text: "融合语义向量与关键词召回，增加肤质、功效、风险级别等元数据过滤。" },
  { icon: SlidersHorizontal, number: "03", title: "Rerank", text: "对候选片段二次排序，优先保留同时满足相关性、可信来源与可行动性的证据。" },
  { icon: ChartNoAxesCombined, number: "04", title: "Golden Set", text: "按场景分层构建标准题集，每次策略调整都自动回归，把 Bad Case 持续沉淀为新样本。" },
];

export default function MagicMirrorCaseStudy() {
  return (
    <main className="mm-case">
      <header className="mm-topbar">
        <a href="/#projects" className="mm-back"><ArrowLeft size={17} /> BACK TO PROJECTS</a>
        <span className="mm-top-mark">HQ / CASE STUDY 01</span>
        <a href="/projects/star-travel" className="mm-next">NEXT PROJECT <ArrowRight size={17} /></a>
      </header>

      <section className="mm-hero" aria-labelledby="mm-title">
        <div className="mm-hero-grid" aria-hidden="true" />
        <div className="mm-rings"><Suspense fallback={<div className="mm-rings-fallback" />}><MagicRings /></Suspense></div>
        <div className="mm-hero-kicker"><span>AI PRODUCT</span><span>SMART SKINCARE</span></div>
        <h1 id="mm-title" className="mm-hero-title"><span>MAGIC MIRROR</span><span>ON RUN</span></h1>
        <div className="mm-device-visual">
          <span className="mm-scan-line" aria-hidden="true" />
          <img src="/media/magic-mirror-ai-v1.webp" alt="魔镜 on run 智能肌肤检测设备概念视觉" />
          <span className="mm-device-tag"><ScanFace size={14} /> LIVE SKIN ANALYSIS</span>
        </div>
        <div className="mm-hero-meta">
          <p>让一次肌肤检测，变成一段持续、可信、可解释的个人护理关系。</p>
          <dl>
            <div><dt>ROLE</dt><dd>AI 产品经理</dd></div>
            <div><dt>COMPANY</dt><dd>厦门光辰智能</dd></div>
            <div><dt>SCOPE</dt><dd>Agent / RAG / 数据</dd></div>
            <div><dt>STATUS</dt><dd>设计与验证</dd></div>
          </dl>
        </div>
        <a href="#background" className="mm-scroll-cue">SCROLL TO EXPLORE <span>↓</span></a>
      </section>

      <section id="background" className="mm-section mm-background">
        <div className="mm-section-index">01</div>
        <div className="mm-section-head">
          <p className="mm-eyebrow">PROJECT BACKGROUND</p>
          <h2>不只给出一份报告，<br />而是帮助用户理解自己的皮肤。</h2>
          <p className="mm-lead">魔镜 on run 连接智能检测硬件、微信小程序和 AI Agent。设备负责获得稳定、结构化的肌肤数据，小程序承接报告、趋势与档案，Agent 则把复杂指标转译成用户可以理解并执行的护理建议。</p>
        </div>
        <div className="mm-flow" aria-label="产品服务链路">
          <article><Camera size={28} /><span>01</span><h3>DEVICE</h3><p>拍摄与肌肤检测</p></article><ArrowRight className="mm-flow-arrow" />
          <article><Smartphone size={28} /><span>02</span><h3>MINI PROGRAM</h3><p>报告、档案与趋势</p></article><ArrowRight className="mm-flow-arrow" />
          <article><Sparkles size={28} /><span>03</span><h3>AI AGENT</h3><p>解读与持续陪伴</p></article>
        </div>
        <div className="mm-challenge-grid">
          <article><span>CHALLENGE 01</span><h3>数据有了，用户仍然看不懂</h3><p>专业肌肤指标缺少上下文，用户难以判断“这意味着什么”以及下一步该做什么。</p></article>
          <article><span>CHALLENGE 02</span><h3>一次检测无法形成长期价值</h3><p>单点报告缺少连续记录与反馈机制，产品很难进入用户的日常护理决策。</p></article>
          <article><span>CHALLENGE 03</span><h3>生成式回答需要专业边界</h3><p>护肤建议既要贴合个人情况，也要可追溯、可评估，并明确风险与非医疗边界。</p></article>
        </div>
      </section>

      <section className="mm-section mm-ui-section">
        <div className="mm-section-index">02</div>
        <div className="mm-section-head mm-section-head-row">
          <div><p className="mm-eyebrow">MINI PROGRAM UI</p><h2>让复杂检测结果，<br />成为每天都能理解的反馈。</h2></div>
          <p className="mm-lead">界面用清晰的信息层级承接设备检测结果：先回答用户最关心的结论，再逐步展开证据、趋势和建议，避免把专业指标一次性压给用户。</p>
        </div>
        <div className="mm-phone-gallery">
          {uiScreens.map((screen, index) => (
            <figure className={`mm-phone-card mm-phone-card-${index + 1}`} key={screen.src}>
              <div className="mm-phone-shell"><img src={screen.src} alt={`魔镜 on run 小程序：${screen.label}`} loading="lazy" /></div>
              <figcaption><span>0{index + 1}</span><strong>{screen.label}</strong><small>{screen.note}</small></figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="mm-section mm-work-section">
        <div className="mm-section-index">03</div>
        <div className="mm-section-head mm-section-head-row">
          <div><p className="mm-eyebrow">WHAT I DID</p><h2>从产品框架，<br />走到模型效果闭环。</h2></div>
          <p className="mm-lead">我的工作横跨产品定义、知识工程与评估体系。重点不是“加一个聊天入口”，而是让 Agent 真正接入肌肤数据和业务流程，形成可靠的产品能力。</p>
        </div>
        <div className="mm-work-grid">
          {workItems.map(({ icon: Icon, ...item }) => (
            <article key={item.index}>
              <div className="mm-work-top"><span>{item.index}</span><Icon size={30} /></div>
              <h3>{item.title}</h3><p>{item.text}</p>
              <div className="mm-tags">{item.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
            </article>
          ))}
        </div>
      </section>

      <section className="mm-section mm-retrieval-section">
        <div className="mm-section-index">04</div>
        <div className="mm-retrieval-intro">
          <div><p className="mm-eyebrow">RETRIEVAL IMPROVEMENT</p><h2>把“感觉更准”，<br />变成可以复现的提升。</h2></div>
          <div className="mm-recall" aria-label="Recall at 3 从 73% 提升至 90%"><small>RECALL@3</small><strong>73<span>%</span></strong><ArrowRight /><strong>90<span>%</span></strong><p>+17 percentage points</p></div>
        </div>
        <p className="mm-method-note">以下为当前排版阶段的方案文案：通过分层 Golden Query、意图补全、混合召回、元数据过滤与候选重排，定位每一类漏召原因，并让每次调整都能稳定回归。</p>
        <div className="mm-step-grid">
          {retrievalSteps.map(({ icon: Icon, ...step }) => <article key={step.number}><span>{step.number}</span><Icon size={25} /><h3>{step.title}</h3><p>{step.text}</p></article>)}
        </div>
        <div className="mm-eval-panel">
          <div className="mm-eval-copy"><p className="mm-eyebrow">BEFORE / AFTER</p><h3>从统一检索，转向面向场景的检索策略。</h3><p>不只观察总分，还按肌肤问题、成分咨询、护理建议和报告解读拆分评测，避免平均值掩盖关键场景的失败。</p></div>
          <div className="mm-bars" aria-label="检索效果对比示意">
            <div><span>BASELINE</span><i><b style={{ width: "73%" }} /></i><strong>73%</strong></div>
            <div><span>OPTIMIZED</span><i><b style={{ width: "90%" }} /></i><strong>90%</strong></div>
          </div>
        </div>
      </section>

      <section className="mm-section mm-outcome-section">
        <div className="mm-section-index">05</div>
        <p className="mm-eyebrow">OUTCOME & REFLECTION</p>
        <div className="mm-outcome-heading"><h2>产品、知识与评估，<br />最终要指向同一种信任。</h2><p>这次实践让我更确信：AI 产品的核心体验不仅来自生成质量，也来自数据来源、过程解释、交互反馈与边界设计共同形成的可信感。</p></div>
        <div className="mm-metric-grid">
          <article><strong>+17<small>PP</small></strong><span>Recall@3 阶段提升</span></article>
          <article><strong>3<small>层</small></strong><span>设备 · 小程序 · Agent</span></article>
          <article><strong>1<small>套</small></strong><span>可持续评估闭环</span></article>
        </div>
        <div className="mm-learnings">
          <article><span>01</span><h3>先定义“什么是好回答”</h3><p>没有可操作的评价标准，模型优化很容易变成对个别案例的反复调参。</p></article>
          <article><span>02</span><h3>知识工程也是产品设计</h3><p>来源、切片、标签和版本管理会直接影响用户感知到的专业度与一致性。</p></article>
          <article><span>03</span><h3>AI 必须进入完整任务流</h3><p>Agent 的价值不在于能聊，而在于能承接数据、理解场景并推动下一步行动。</p></article>
        </div>
      </section>

      <footer className="mm-footer">
        <a href="/#projects" className="mm-footer-back"><ArrowLeft /> ALL PROJECTS</a>
        <a href="/projects/star-travel" className="mm-footer-next"><span>NEXT CASE STUDY · 02</span><strong>星旅</strong><em>广州省心购科技 <ArrowUpRight /></em></a>
      </footer>
    </main>
  );
}
