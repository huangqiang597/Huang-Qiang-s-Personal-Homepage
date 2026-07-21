"use client";

import { lazy, Suspense } from "react";
import {
  ArrowLeft, ArrowRight, ArrowUpRight, BrainCircuit, Camera,
  Database, FlaskConical, Search, SlidersHorizontal, Smartphone, Sparkles,
} from "lucide-react";
import "./MagicMirrorCaseStudy.css";

const MagicRings = lazy(() => import("./MagicRings"));

const uiScreens = [
  { src: "/media/magic-mirror-ui-home.jpg", number: "01", title: "首页 / 检测", note: "连接设备，查看当日肌肤状态" },
  { src: "/media/magic-mirror-ui-report.jpg", number: "02", title: "深度报告", note: "把指标翻译成可理解的洞察" },
  { src: "/media/magic-mirror-ui-diary.jpg", number: "03", title: "肌肤日记", note: "记录每日状态和护理变化" },
  { src: "/media/magic-mirror-ui-assistant.jpg", number: "04", title: "魔镜精灵", note: "获得个性化建议与日常陪伴" },
];

const workItems = [
  { index: "01", title: "PRODUCT STRATEGY & PRD", text: "定义产品愿景、用户分层与核心价值，输出 PRD、路线图和跨团队协作方案。", outcome: "清晰的产品路线与一致执行" },
  { index: "02", title: "RAG KNOWLEDGE SYSTEM", text: "设计护肤知识结构，搭建 RAG 链路并围绕准确率与覆盖率优化检索。", outcome: "可追溯、可更新的专业知识库" },
  { index: "03", title: "EVALUATION & DATA", text: "建立离线评测集、核心指标和数据埋点，让每次迭代都有量化依据。", outcome: "稳定评估与持续数据迭代" },
];

const steps = [
  { index: "1", icon: Search, title: "QUERY REWRITE", text: "扩展口语表达并补全用户意图" },
  { index: "2", icon: Database, title: "HYBRID RETRIEVAL", text: "融合向量与 BM25 扩大召回" },
  { index: "3", icon: SlidersHorizontal, title: "RERANK", text: "按相关性与可信度二次排序" },
  { index: "4", icon: Sparkles, title: "GOLDEN SET", text: "沉淀高质量题集持续回归" },
];

export default function MagicMirrorCaseStudy() {
  return (
    <main className="mm-case">
      <section className="mm-hero" aria-labelledby="mm-title">
        <header className="mm-topbar">
          <a href="/#projects"><ArrowLeft /> BACK TO HOME</a>
          <a href="/projects/star-travel">NEXT PROJECT <ArrowRight /></a>
        </header>
        <div className="mm-rings"><Suspense fallback={null}><MagicRings opacity={0.22} speed={0.22} mouseInfluence={0.05} /></Suspense></div>
        <div className="mm-hero-copy">
          <p>01 / AGENT PRODUCT</p>
          <h1 id="mm-title">MAGIC MIRROR<br />ON RUN</h1>
        </div>
        <div className="mm-mirror-visual"><img src="/media/magic-mirror-ai-v1.webp" alt="魔镜 on run 智能肌肤检测镜" /></div>
        <dl className="mm-meta">
          <div><dt>ROLE</dt><dd>AI Product Manager</dd></div>
          <div><dt>COMPANY</dt><dd>厦门光辰智能</dd></div>
          <div><dt>PERIOD</dt><dd>项目实践</dd></div>
          <div><dt>SCOPE</dt><dd>Strategy · AI · Product · Data</dd></div>
        </dl>
      </section>

      <section className="mm-background">
        <div className="mm-background-copy">
          <div className="mm-section-title"><strong>01</strong><h2>PROJECT BACKGROUND</h2></div>
          <p>护肤用户往往难以持续记录肌肤状态，也很难在需要时获得可靠、个性化的建议。</p>
          <p>魔镜 on run 是一款 AI 智能护肤镜，将硬件检测、微信小程序和智能体连接起来，为用户提供完整的肌肤洞察和可执行的护理建议。</p>
        </div>
        <div className="mm-background-system">
          <div className="mm-system-flow">
            <article><i><Camera /></i><strong>DEVICE</strong><span>获取多模态肌肤数据</span></article><ArrowRight />
            <article><i><Smartphone /></i><strong>MINI PROGRAM</strong><span>集中报告、趋势与日常</span></article><ArrowRight />
            <article><i><BrainCircuit /></i><strong>AI AGENT</strong><span>理解状态并给出个性建议</span></article>
          </div>
          <div className="mm-problems">
            <article><span>01</span><h3>记录分散</h3><p>数据散落在不同工具中，难以形成完整的肌肤历史。</p></article>
            <article><span>02</span><h3>报告难懂</h3><p>专业指标缺少解释，用户无法把洞察转化为行动。</p></article>
            <article><span>03</span><h3>建议泛化</h3><p>一次性建议无法反映个人状态与持续变化。</p></article>
          </div>
        </div>
      </section>

      <section className="mm-ui-section">
        <div className="mm-section-title mm-ui-title"><strong>02</strong><h2>/ MINI PROGRAM UI</h2></div>
        <div className="mm-phone-stage">
          {uiScreens.map((screen, index) => (
            <figure className={`mm-phone mm-phone-${index + 1}`} key={screen.src}>
              <div className="mm-phone-frame"><img src={screen.src} alt={`魔镜小程序：${screen.title}`} loading="lazy" /></div>
              <figcaption><b>{screen.number} / {screen.title}</b><span>{screen.note}</span></figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="mm-work-section">
        <div className="mm-section-title mm-dark-title"><strong>03</strong><h2>/ WHAT I DID</h2></div>
        <div className="mm-work-grid">
          {workItems.map((item) => (
            <article key={item.index}>
              <strong>{item.index}</strong><div><h3>{item.title}</h3><p>{item.text}</p><footer><span>Outcome</span>{item.outcome}</footer></div>
            </article>
          ))}
        </div>
      </section>

      <section className="mm-retrieval">
        <div className="mm-retrieval-top">
          <div className="mm-recall-block">
            <div className="mm-section-title"><strong>04</strong><h2>/ RETRIEVAL IMPROVEMENT</h2></div>
            <p>Recall@3</p>
            <div className="mm-recall-numbers"><strong>73%</strong><ArrowRight /><strong>90%</strong></div>
            <div className="mm-recall-labels"><span>BEFORE</span><span>AFTER</span></div>
          </div>
          <div className="mm-process">
            <p>IMPROVEMENT PROCESS</p>
            <div className="mm-step-row">
              {steps.map(({ icon: Icon, ...step }, index) => (
                <div className="mm-step-pair" key={step.index}>
                  <article><span>{step.index}</span><Icon /><h3>{step.title}</h3><p>{step.text}</p></article>
                  {index < steps.length - 1 && <ArrowRight className="mm-step-arrow" />}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mm-evidence">
          <div className="mm-chart">
            <p>RECALL@3 OVER TIME</p>
            <div className="mm-chart-box">
              <i className="mm-chart-line mm-chart-before" /><i className="mm-chart-line mm-chart-after" />
              <span>DEC</span><span>JAN</span><span>FEB</span><span>MAR</span><span>APR</span><span>MAY</span>
            </div>
          </div>
          <div className="mm-table-wrap">
            <p>BEFORE / AFTER COMPARISON</p>
            <table><thead><tr><th>Metric</th><th>Before</th><th>After</th><th>Gain</th></tr></thead><tbody>
              <tr><td>Recall@3</td><td>73%</td><td>90%</td><td>+17pp</td></tr>
              <tr><td>MRR@10</td><td>61%</td><td>77%</td><td>+16pp</td></tr>
              <tr><td>NDCG@10</td><td>65%</td><td>82%</td><td>+17pp</td></tr>
              <tr><td>Answer Hit Rate</td><td>68%</td><td>87%</td><td>+19pp</td></tr>
            </tbody></table>
          </div>
        </div>
      </section>

      <section className="mm-outcome">
        <div className="mm-outcome-main">
          <div className="mm-section-title"><strong>05</strong><h2>/ OUTCOME</h2></div>
          <div className="mm-metrics">
            <article><span>◎</span><strong>+17<small>pp</small></strong><p>RECALL@3 IMPROVEMENT</p></article>
            <article><span>◉</span><strong>3<small>层</small></strong><p>DEVICE · APP · AGENT</p></article>
            <article><span>◇</span><strong>1<small>套</small></strong><p>EVALUATION LOOP</p></article>
          </div>
        </div>
        <aside><h3>LESSONS LEARNED</h3><ul><li>高质量知识与评估体系是可靠 AI 产品的基础。</li><li>检索质量会直接影响用户信任与产品体验。</li><li>真实使用数据才能驱动可衡量的持续迭代。</li></ul></aside>
      </section>

      <a href="/projects/star-travel" className="mm-next-project"><span>NEXT / STAR TRAVEL</span><ArrowUpRight /></a>
    </main>
  );
}
