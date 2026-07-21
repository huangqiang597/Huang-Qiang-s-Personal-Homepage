"use client";

import { lazy, Suspense } from "react";
import {
  ArrowLeft, ArrowRight, BrainCircuit, Camera,
  Database, FlaskConical, Search, SlidersHorizontal, Smartphone, Sparkles,
} from "lucide-react";
import BorderGlow from "./BorderGlow";
import "./MagicMirrorCaseStudy.css";

const MagicRings = lazy(() => import("./MagicRings"));
const SoftAurora = lazy(() => import("./SoftAurora"));

const uiScreens = [
  { src: "/media/magic-mirror-ui-home.jpg", number: "01", title: "首页 / 检测", note: "连接设备，查看当日肌肤状态" },
  { src: "/media/magic-mirror-ui-report.jpg", number: "02", title: "深度报告", note: "把指标翻译成可理解的洞察" },
  { src: "/media/magic-mirror-ui-diary.jpg", number: "03", title: "肌肤日记", note: "记录每日状态和护理变化" },
  { src: "/media/magic-mirror-ui-assistant.jpg", number: "04", title: "魔镜精灵", note: "获得个性化建议与日常陪伴" },
];

const workItems = [
  { index: "01", title: "产品策略与需求设计", text: "定义产品愿景、用户分层与核心价值，输出需求文档、路线图和跨团队协作方案。", outcome: "清晰的产品路线与一致执行" },
  { index: "02", title: "RAG 专业知识系统", text: "设计护肤知识结构，搭建检索增强生成链路，并围绕准确率与覆盖率优化检索。", outcome: "可追溯、可更新的专业知识库" },
  { index: "03", title: "评估体系与数据闭环", text: "建立离线评测集、核心指标和数据埋点，让每次迭代都有量化依据。", outcome: "稳定评估与持续数据迭代" },
];

const steps = [
  { index: "1", icon: Search, title: "查询改写", text: "扩展口语表达并补全用户意图" },
  { index: "2", icon: Database, title: "混合召回", text: "融合向量与 BM25 扩大召回范围" },
  { index: "3", icon: SlidersHorizontal, title: "候选重排", text: "按照相关性与可信度二次排序" },
  { index: "4", icon: Sparkles, title: "黄金评测集", text: "沉淀高质量题集并持续回归" },
];

export default function MagicMirrorCaseStudy() {
  return (
    <main className="mm-case">
      <div className="mm-aurora-background"><Suspense fallback={null}><SoftAurora /></Suspense></div>
      <section className="mm-hero" aria-labelledby="mm-title">
        <header className="mm-topbar">
          <a href="/#projects"><ArrowLeft /> 返回首页</a>
          <a href="/projects/star-travel">下一个项目 <ArrowRight /></a>
        </header>
        <div className="mm-rings"><Suspense fallback={null}><MagicRings opacity={0.22} speed={0.22} mouseInfluence={0.05} /></Suspense></div>
        <div className="mm-hero-copy">
          <p>01 / 智能体产品</p>
          <h1 id="mm-title">MAGIC MIRROR<br />ON RUN</h1>
        </div>
        <div className="mm-mirror-visual"><img src="/media/magic-mirror-ai-v1.webp" alt="魔镜 on run 智能肌肤检测镜" /></div>
        <dl className="mm-meta">
          <div><dt>担任角色</dt><dd>AI 产品经理</dd></div>
          <div><dt>所属公司</dt><dd>厦门光辰智能</dd></div>
          <div><dt>项目阶段</dt><dd>设计与验证</dd></div>
          <div><dt>负责范围</dt><dd>产品策略 · AI · 数据</dd></div>
        </dl>
      </section>

      <section className="mm-background">
        <div className="mm-background-copy">
          <div className="mm-section-title"><strong>01</strong><h2>项目背景</h2></div>
          <p>护肤用户往往难以持续记录肌肤状态，也很难在需要时获得可靠、个性化的建议。</p>
          <p>魔镜项目是一款 AI 智能护肤镜，将硬件检测、微信小程序和智能体连接起来，为用户提供完整的肌肤洞察和可执行的护理建议。</p>
        </div>
        <div className="mm-background-system">
          <div className="mm-system-flow">
            <article><i><Camera /></i><strong>智能设备</strong><span>获取多模态肌肤数据</span></article><ArrowRight />
            <article><i><Smartphone /></i><strong>微信小程序</strong><span>集中报告、趋势与日常</span></article><ArrowRight />
            <article><i><BrainCircuit /></i><strong>AI 智能体</strong><span>理解状态并给出个性建议</span></article>
          </div>
          <div className="mm-problems">
            <article><span>01</span><h3>记录分散</h3><p>数据散落在不同工具中，难以形成完整的肌肤历史。</p></article>
            <article><span>02</span><h3>报告难懂</h3><p>专业指标缺少解释，用户无法把洞察转化为行动。</p></article>
            <article><span>03</span><h3>建议泛化</h3><p>一次性建议无法反映个人状态与持续变化。</p></article>
          </div>
        </div>
      </section>

      <section className="mm-ui-section">
        <div className="mm-section-title mm-ui-title"><strong>02</strong><h2>/ 小程序界面</h2></div>
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
        <div className="mm-section-title mm-dark-title"><strong>03</strong><h2>/ 我的工作</h2></div>
        <div className="mm-work-grid">
          {workItems.map((item) => (
            <BorderGlow key={item.index} className="mm-work-glow" backgroundColor="#0e131b" borderRadius={7} glowRadius={26} colors={["#719dff", "#d58ba9", "#8c82ff"]}>
              <article><strong>{item.index}</strong><div><h3>{item.title}</h3><p>{item.text}</p><footer><span>工作产出</span>{item.outcome}</footer></div></article>
            </BorderGlow>
          ))}
        </div>
      </section>

      <section className="mm-retrieval">
        <div className="mm-retrieval-top">
          <div className="mm-recall-block">
            <div className="mm-section-title"><strong>04</strong><h2>/ 检索效果提升</h2></div>
            <p>前三条召回率 Recall@3</p>
            <div className="mm-recall-numbers"><strong>73%</strong><ArrowRight /><strong>90%</strong></div>
            <div className="mm-recall-labels"><span>优化前</span><span>优化后</span></div>
          </div>
          <div className="mm-process">
            <p>优化过程</p>
            <div className="mm-step-row">
              {steps.map(({ icon: Icon, ...step }, index) => (
                <div className="mm-step-pair" key={step.index}>
                  <BorderGlow className="mm-step-glow" backgroundColor="#0d1219" borderRadius={5} glowRadius={20} glowIntensity={.55} colors={["#6e9cff", "#d58ca9", "#8b7fff"]}>
                    <article><span>{step.index}</span><Icon /><h3>{step.title}</h3><p>{step.text}</p></article>
                  </BorderGlow>
                  {index < steps.length - 1 && <ArrowRight className="mm-step-arrow" />}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mm-evidence">
          <div className="mm-chart">
            <p>前三条召回率变化趋势</p>
            <div className="mm-chart-box">
              <i className="mm-chart-line mm-chart-before" /><i className="mm-chart-line mm-chart-after" />
              <span>12月</span><span>1月</span><span>2月</span><span>3月</span><span>4月</span><span>5月</span>
            </div>
          </div>
          <div className="mm-table-wrap">
            <p>优化前后对比</p>
            <table><thead><tr><th>评估指标</th><th>优化前</th><th>优化后</th><th>提升幅度</th></tr></thead><tbody>
              <tr><td>前三条召回率</td><td>73%</td><td>90%</td><td>+17 个百分点</td></tr>
              <tr><td>平均倒数排名</td><td>61%</td><td>77%</td><td>+16 个百分点</td></tr>
              <tr><td>归一化排序质量</td><td>65%</td><td>82%</td><td>+17 个百分点</td></tr>
              <tr><td>答案命中率</td><td>68%</td><td>87%</td><td>+19 个百分点</td></tr>
            </tbody></table>
          </div>
        </div>
      </section>

      <section className="mm-outcome">
        <div className="mm-outcome-main">
          <div className="mm-section-title"><strong>05</strong><h2>/ 项目成果</h2></div>
          <div className="mm-metrics">
            <article><span>◎</span><strong>+17<small>个百分点</small></strong><p>Recall@3 阶段提升</p></article>
            <article><span>◉</span><strong>3<small>层</small></strong><p>设备 · 小程序 · 智能体</p></article>
            <article><span>◇</span><strong>1<small>套</small></strong><p>可持续评估闭环</p></article>
          </div>
        </div>
        <aside><h3>项目复盘</h3><ul><li>高质量知识与评估体系是可靠 AI 产品的基础。</li><li>检索质量会直接影响用户信任与产品体验。</li><li>真实使用数据才能驱动可衡量的持续迭代。</li></ul></aside>
      </section>

    </main>
  );
}
