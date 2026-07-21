"use client";

import { lazy, PointerEvent as ReactPointerEvent, Suspense, useRef } from "react";
import {
  ArrowLeft, ArrowRight, BrainCircuit, Camera,
  Database, FlaskConical, Search, SlidersHorizontal, Smartphone, Sparkles,
} from "lucide-react";
import BorderGlow from "./BorderGlow";
import "./MagicMirrorCaseStudy.css";

const MagicRings = lazy(() => import("./MagicRings"));
const SoftAurora = lazy(() => import("./SoftAurora"));

const uiScreens = [
  { src: "/media/magic-mirror-ui-entry.jpg", number: "01", title: "进入页面", note: "建立品牌认知并引导进入服务" },
  { src: "/media/magic-mirror-ui-auth.jpg", number: "02", title: "授权页面", note: "完成授权并连接个人肌肤档案" },
  { src: "/media/magic-mirror-ui-home.jpg", number: "03", title: "首页 / 检测", note: "连接设备，查看当日肌肤状态" },
  { src: "/media/magic-mirror-ui-report.jpg", number: "04", title: "深度报告", note: "把指标翻译成可理解的洞察" },
  { src: "/media/magic-mirror-ui-diary.jpg", number: "05", title: "肌肤日记", note: "记录每日状态和护理变化" },
  { src: "/media/magic-mirror-ui-assistant.jpg", number: "06", title: "魔镜精灵", note: "获得个性化建议与日常陪伴" },
];

const workItems = [
  { index: "01", title: "RAG 与专业知识体系", text: "搭建护肤知识库结构、知识源分级、切片与检索策略，形成可追溯、可持续更新的专业知识底座。", outcome: "Recall@3 从 73% 提升至 90%" },
  { index: "02", title: "模型分层与评测迭代", text: "按任务复杂度设计模型分层路由，建立黄金问题集、离线评测与问题案例回归机制。", outcome: "兼顾效果、成本与稳定性" },
  { index: "03", title: "自动化与数据闭环", text: "打通数据采集、质量评测、反馈回流与看板追踪，让真实使用数据持续推动产品和模型迭代。", outcome: "从发现问题到验证修复形成闭环" },
];

const steps = [
  { index: "1", icon: Search, title: "查询改写", text: "扩展口语表达并补全用户意图" },
  { index: "2", icon: Database, title: "混合召回", text: "融合向量与 BM25 扩大召回范围" },
  { index: "3", icon: SlidersHorizontal, title: "候选重排", text: "按照相关性与可信度二次排序" },
  { index: "4", icon: Sparkles, title: "黄金评测集", text: "沉淀高质量题集并持续回归" },
];

export default function MagicMirrorCaseStudy() {
  const pageRef = useRef<HTMLElement>(null);
  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    const page = pageRef.current;
    if (!page) return;
    page.style.setProperty("--aurora-x", `${(event.clientX / window.innerWidth) * 100}%`);
    page.style.setProperty("--aurora-y", `${(event.clientY / window.innerHeight) * 100}%`);
  };

  return (
    <main ref={pageRef} onPointerMove={handlePointerMove} className="mm-case">
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
              <article><div className="mm-work-number"><span>MODULE</span><strong>{item.index}</strong></div><div className="mm-work-copy"><h3>{item.title}</h3><p>{item.text}</p><footer><span>关键结果</span>{item.outcome}</footer></div></article>
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
