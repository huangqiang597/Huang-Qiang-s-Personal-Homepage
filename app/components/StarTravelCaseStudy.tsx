"use client";

import {
  CSSProperties,
  PointerEvent as ReactPointerEvent,
  WheelEvent as ReactWheelEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  CircleDollarSign,
  Database,
  FileCheck2,
  FileSearch,
  GitBranch,
  Hotel,
  LockKeyhole,
  Network,
  Plane,
  ReceiptText,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  WalletCards,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import BorderGlow from "./BorderGlow";
import "./StarTravelCaseStudy.css";

const uiScreens = [
  {
    src: "/media/star-ui-policy.png",
    number: "01",
    title: "差旅政策问答",
    note: "以制度原文回答，展示适用条件、例外规则与引用来源。",
  },
  {
    src: "/media/star-ui-compare.png",
    number: "02",
    title: "智能方案比价",
    note: "同时比较价格、效率、政策与个人偏好，而不是只给最低价。",
  },
  {
    src: "/media/star-ui-confirm.png",
    number: "03",
    title: "预订二次确认",
    note: "模型只生成订单草稿，后端确认后才可执行真实写操作。",
  },
  {
    src: "/media/star-ui-ticket.png",
    number: "04",
    title: "出票与状态同步",
    note: "订单回调、企业月结与行程同步形成可追溯的结果链路。",
  },
  {
    src: "/media/star-ui-expense.png",
    number: "05",
    title: "费用归集与报销",
    note: "自动关联订单、发票与补贴标准，生成可核验的报销草稿。",
  },
];

const dimensions = [
  "供给",
  "政策",
  "审批/费控",
  "Agent",
  "RAG透明",
  "中立聚合",
  "治理审计",
  "部署/模型",
];

const competitors = [
  {
    name: "携程商旅",
    type: "TMC / OTA",
    scores: [5, 5, 5, 5, 3, 4, 4, 4],
    summary: "供给与履约能力最强，AI 与七大 Agent 已覆盖差旅全流程；更适合作为星旅的上游履约底座。",
  },
  {
    name: "同程商旅",
    type: "TMC",
    scores: [5, 4, 4, 2, 2, 2, 3, 3],
    summary: "全品类供应链与 OA / ERP / 费控集成成熟，传统商旅服务能力强，但 Agent 与中立聚合相对有限。",
  },
  {
    name: "分贝通",
    type: "AI 支出管理",
    scores: [4, 5, 5, 5, 3, 3, 4, 3],
    summary: "审批、消费、报销和对账闭环完整，Agent 已进入真实费用流程，是星旅在流程闭环上的直接压力。",
  },
  {
    name: "汇联易",
    type: "财务 Agent",
    scores: [3, 5, 5, 5, 4, 4, 5, 4],
    summary: "费用治理、审计与财务 Agent 能力突出，企业 SOP 和交易数据沉淀深，治理能力最接近星旅目标。",
  },
  {
    name: "滴滴企业版",
    type: "高频场景入口",
    scores: [3, 4, 4, 4, 2, 2, 4, 3],
    summary: "用车入口与组织账户优势明显，已扩展机酒火和大模型差旅助手，但跨供应商治理仍依赖合作生态。",
  },
  {
    name: "星旅目标态",
    type: "编排与治理层",
    scores: [2, 5, 4, 5, 5, 5, 5, 5],
    summary: "不自建库存，而是用企业政策证据、供应商中立编排、权限确认、幂等交易与审计治理建立差异化。",
  },
];

const tools = [
  {
    name: "search_travel_policy",
    label: "制度检索",
    category: "query",
    risk: "低",
    detail: "RAG 检索企业制度并返回来源；按文档 ACL 过滤，不查询实时价格。",
    icon: FileSearch,
  },
  {
    name: "search_flights",
    label: "航班查询",
    category: "query",
    risk: "低",
    detail: "查询航班、含税价格与余票；只读，不执行预订。",
    icon: Plane,
  },
  {
    name: "search_hotels",
    label: "酒店查询",
    category: "query",
    risk: "低",
    detail: "查询酒店、房态和总价；只读，不执行下单。",
    icon: Hotel,
  },
  {
    name: "update_travel_preference",
    label: "偏好更新",
    category: "governance",
    risk: "中",
    detail: "只写入用户明确表达或确认的稳定偏好，拒绝敏感和一次性信息。",
    icon: Database,
  },
  {
    name: "book_flight",
    label: "机票预订",
    category: "write",
    risk: "高",
    detail: "需要有效出差申请和一次性 confirmation_id；模型不能自动选择并下单。",
    icon: Plane,
  },
  {
    name: "book_hotel",
    label: "酒店预订",
    category: "write",
    risk: "高",
    detail: "先生成合规预览，超标时必须进入例外审批，确认后才能执行。",
    icon: Hotel,
  },
  {
    name: "get_trip_expenses",
    label: "费用查询",
    category: "query",
    risk: "中",
    detail: "只查询本人行程费用，user_id 由后端注入，不接受模型或用户改写。",
    icon: WalletCards,
  },
  {
    name: "submit_reimbursement",
    label: "提交报销",
    category: "write",
    risk: "高",
    detail: "首次调用只生成费用预览；二次确认后才创建真实报销单。",
    icon: ReceiptText,
  },
  {
    name: "get_approval_status",
    label: "审批状态",
    category: "query",
    risk: "中",
    detail: "查询本人报销进度，不代替审批人做决定，也不代查他人信息。",
    icon: FileCheck2,
  },
  {
    name: "cancel_booking",
    label: "取消订单",
    category: "write",
    risk: "极高",
    detail: "先展示退改费、预计退款和规则；幂等校验与二次确认后执行。",
    icon: RotateCcw,
  },
];

const evaluationGroups = [
  {
    label: "MODEL / RAG",
    title: "模型与检索",
    icon: BrainCircuit,
    metrics: [
      ["工具选择准确率", "≥95%"],
      ["参数完全匹配", "≥92%"],
      ["RAG Recall@3", "≥90%"],
      ["有据回答率", "≥95%"],
      ["确认绕过", "0"],
    ],
  },
  {
    label: "USER",
    title: "用户任务",
    icon: CheckCircle2,
    metrics: [
      ["端到端成功率", "≥75%"],
      ["首次任务成功率", "≥70%"],
      ["平均完成时长", "-50%"],
      ["平均澄清轮数", "≤1.5"],
      ["CSAT", "≥4.3"],
    ],
  },
  {
    label: "BUSINESS",
    title: "业务结果",
    icon: CircleDollarSign,
    metrics: [
      ["行政咨询量", "-30%"],
      ["报销退回率", "-25%"],
      ["合规预订率", "≥98%"],
      ["报销周期", "-20%"],
      ["ROI", "灰度 3 个月"],
    ],
  },
];

const graphGroups = [
  {
    key: "rag",
    number: "03A",
    title: "简单 RAG 路径",
    subtitle: "POLICY QA",
    nodes: [
      ["制度问答路径", "可信知识边界"],
      ["存在口语、指代或低置信度？", "判断"],
      ["查询改写 / 问题向量化", "Qwen3.5-Flash + Embedding"],
      ["向量库召回 Top K", "Tool"],
      ["是否需要 Rerank？", "判断"],
      ["制度答案生成", "Qwen3-Rerank + Qwen3.5-Flash"],
    ],
  },
  {
    key: "memory",
    number: "03B",
    title: "仅记忆路径",
    subtitle: "PREFERENCE",
    nodes: [
      ["提取稳定偏好", "Qwen3.5-Flash"],
      ["明确、稳定、非敏感？", "判断"],
      ["写入 / 不写入长期记忆", "Store Tool"],
      ["模板确认", "已记住该偏好"],
      ["进入输出校验", "可撤回、可过期"],
    ],
  },
  {
    key: "context",
    number: "03C",
    title: "上下文与记忆准备",
    subtitle: "STATE",
    nodes: [
      ["组装 Agent State", "代码"],
      ["加载线程短期记忆", "LangGraph Checkpointer"],
      ["召回相关长期偏好", "LangGraph Store"],
      ["Token 是否超过阈值？", "判断"],
      ["上下文压缩", "Qwen3.5-Flash"],
      ["ID / 金额 / 日期 / 确认状态完整？", "校验"],
    ],
  },
];

function FlowNode({
  title,
  note,
  tone = "",
}: {
  title: string;
  note?: string;
  tone?: string;
}) {
  return (
    <div className={`st-flow-node ${tone}`}>
      <strong>{title}</strong>
      {note && <small>{note}</small>}
    </div>
  );
}

function StarLangGraph() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.72);
  const [position, setPosition] = useState({ x: 0, y: 14 });
  const dragRef = useRef({ active: false, x: 0, y: 0 });

  const fitGraph = () => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const next = Math.min((viewport.clientWidth - 34) / 1760, (viewport.clientHeight - 34) / 1160);
    setScale(next);
    setPosition({ x: (viewport.clientWidth - 1760 * next) / 2, y: 16 });
  };

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const frame = window.requestAnimationFrame(fitGraph);
    const observer = new ResizeObserver(fitGraph);
    observer.observe(viewport);

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  const zoomGraph = (direction: number) => {
    setScale((current) => Math.max(0.55, Math.min(1.2, current + direction * 0.1)));
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    dragRef.current = { active: true, x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active) return;
    const dx = event.clientX - dragRef.current.x;
    const dy = event.clientY - dragRef.current.y;
    dragRef.current.x = event.clientX;
    dragRef.current.y = event.clientY;
    setPosition((current) => ({ x: current.x + dx, y: current.y + dy }));
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    dragRef.current.active = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handleWheel = (event: ReactWheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    setScale((current) =>
      Math.max(0.55, Math.min(1.2, current * (event.deltaY > 0 ? 0.93 : 1.07))),
    );
  };

  return (
    <div className="st-graph-shell">
      <header className="st-graph-toolbar">
        <div className="st-graph-status">
          <i />
          <strong>STAR TRAVEL / LANGGRAPH MAP</strong>
          <span>完整任务链路</span>
        </div>
        <div className="st-graph-legend">
          <span className="rag">政策 RAG</span>
          <span className="memory">偏好记忆</span>
          <span className="context">上下文准备</span>
          <span className="agent">主 Agent Loop</span>
        </div>
        <div className="st-graph-actions">
          <button type="button" onClick={() => zoomGraph(-1)} aria-label="缩小流程图">
            <ZoomOut />
          </button>
          <button type="button" onClick={fitGraph}>
            全景
          </button>
          <button type="button" onClick={() => zoomGraph(1)} aria-label="放大流程图">
            <ZoomIn />
          </button>
        </div>
      </header>

      <div
        ref={viewportRef}
        className="st-graph-viewport"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onWheel={handleWheel}
      >
        <div
          className="st-graph-board"
          style={{ transform: `translate(${position.x}px, ${position.y}px) scale(${scale})` }}
        >
          <div className="st-laser-trace" aria-hidden="true" />

          <div className="st-access-flow">
            <FlowNode title="用户发送问题" tone="start" />
            <FlowNode title="接入层" note="登录 · tenant_id · user_id · session_id" />
            <FlowNode title="权限、敏感信息、越权检查" note="不通过 → 固定拒绝，不升级模型" tone="decision" />
            <FlowNode title="任务路由器" note="规则优先，低置信度再用小模型" tone="router" />
          </div>

          <div className="st-reject-branch">
            <FlowNode title="固定拒绝提示" note="不泄露工具与数据细节" tone="danger" />
            <FlowNode title="返回用户" tone="start" />
          </div>

          <div className="st-route-trunk" aria-hidden="true">
            <i /><i /><i /><i />
          </div>

          <div className="st-graph-groups">
            {graphGroups.map((group) => (
              <section className={`st-graph-group ${group.key}`} key={group.key}>
                <header>
                  <b>{group.number}</b>
                  <div>
                    <h4>{group.title}</h4>
                    <span>{group.subtitle}</span>
                  </div>
                </header>
                <div className="st-node-stack">
                  {group.nodes.map(([title, note], index) => (
                    <FlowNode
                      key={title}
                      title={title}
                      note={note}
                      tone={index === 1 || index === 4 ? "decision" : ""}
                    />
                  ))}
                </div>
              </section>
            ))}

            <section className="st-graph-group agent">
              <header>
                <b>04</b>
                <div>
                  <h4>LangGraph 主 Agent 循环</h4>
                  <span>DECIDE → TOOL → OBSERVE</span>
                </div>
              </header>
              <div className="st-agent-top">
                <FlowNode title="主 Agent" note="DeepSeek-V4-Flash" />
                <FlowNode title="策略冲突 / 低置信度 / 连续失败？" note="判断是否升级" tone="decision" />
                <FlowNode title="复杂任务升级" note="DeepSeek-V4-Pro" tone="model" />
                <FlowNode title="Agent 下一步决策" note="只决定下一步，不直接执行" tone="decision" />
              </div>
              <div className="st-agent-branches">
                {[
                  ["缺少参数", "最少必要追问", "query"],
                  ["可以回答", "生成候选答案", "answer"],
                  ["查询制度", "search_travel_policy", "tool"],
                  ["查询业务", "机酒 / 费用 / 审批 Tools", "tool"],
                  ["写操作", "预订 / 取消 / 提交报销", "danger"],
                ].map(([title, action, tone]) => (
                  <article key={title}>
                    <FlowNode title={title} tone={tone === "danger" ? "danger" : ""} />
                    <FlowNode
                      title={action}
                      note={tone === "danger" ? "首次仅生成预览" : ""}
                      tone={tone === "tool" ? "tool" : tone === "danger" ? "danger" : ""}
                    />
                  </article>
                ))}
              </div>
              <div className="st-agent-bottom">
                <FlowNode title="Tool Result 写入 Agent State" note="观察结果并回到主 Agent" tone="model" />
                <FlowNode title="用户是否确认？" note="高风险操作必须二次确认" tone="decision" />
                <div className="st-confirm-pair">
                  <FlowNode title="取消" note="业务状态不变" tone="danger" />
                  <FlowNode title="签发一次性 confirmation_id" note="幂等执行业务 API" tone="memory" />
                </div>
              </div>
            </section>
          </div>

          <div className="st-output-flow">
            <FlowNode title="输出校验" note="引用 · 金额 · ID · 工具状态 · 越权结果" tone="decision" />
            <FlowNode title="本轮包含新的稳定偏好？" note="只保存授权、稳定、非敏感信息" tone="decision" />
            <div className="st-output-pair">
              <FlowNode title="写入长期记忆" note="Qwen3.5-Flash + Store" tone="memory" />
              <FlowNode title="保存短期状态与摘要" note="LangGraph Checkpointer" />
            </div>
            <FlowNode title="Trace：模型 · Token · Tool · 成本 · 延迟" note="返回用户" tone="start" />
          </div>
        </div>
      </div>
      <footer className="st-graph-hint">
        <span>↔ 拖动探索</span>
        <span>滚轮缩放</span>
        <span>悬停节点查看层级</span>
      </footer>
    </div>
  );
}

export default function StarTravelCaseStudy() {
  const pageRef = useRef<HTMLElement>(null);
  const uiTrackRef = useRef<HTMLDivElement>(null);
  const [activeCompetitor, setActiveCompetitor] = useState(5);
  const [toolFilter, setToolFilter] = useState("all");
  const [activeTool, setActiveTool] = useState(0);

  const filteredTools = useMemo(
    () => tools.filter((tool) => toolFilter === "all" || tool.category === toolFilter),
    [toolFilter],
  );

  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    const page = pageRef.current;
    if (!page) return;
    page.style.setProperty("--st-mx", `${(event.clientX / window.innerWidth) * 100}%`);
    page.style.setProperty("--st-my", `${(event.clientY / window.innerHeight) * 100}%`);
  };

  const moveUiTrack = (direction: number) => {
    uiTrackRef.current?.scrollBy({ left: direction * 430, behavior: "smooth" });
  };

  const selectedTool = filteredTools[activeTool] ?? filteredTools[0] ?? tools[0];

  return (
    <main ref={pageRef} onPointerMove={handlePointerMove} className="st-case">
      <div className="st-ambient" aria-hidden="true" />

      <section className="st-hero" aria-labelledby="st-title">
        <header className="st-topbar">
          <Link href="/#projects">
            <ArrowLeft /> 返回首页
          </Link>
          <span>
            <b>02</b> / PROJECT CASE
          </span>
          <span>AGENT × ENTERPRISE TRAVEL</span>
        </header>

        <div className="st-hero-copy">
          <p>02 / ENTERPRISE TRAVEL AGENT</p>
          <h1 id="st-title">
            <span>STAR</span>
            <span>TRAVEL</span>
          </h1>
          <h2>星旅 · 企业智能差旅助手</h2>
          <div className="st-hero-description">
            <small>PROJECT BACKGROUND</small>
            <p>针对企业差旅中政策查询分散、跨平台预订和审批费控割裂的问题，设计一套以国产大模型为推理核心、连接企业知识与外部差旅供应商的智能编排与治理方案。</p>
          </div>
        </div>

        <div className="st-hero-visual">
          <img src="/media/star-travel-ai-v1.webp" alt="星旅企业智能差旅编排概念场景" />
          <div className="st-hero-laser" aria-hidden="true" />
          <div className="st-route-card">
            <span>ACTIVE TRIP / SHA → SZX</span>
            <strong>从一句话，编排一次合规差旅。</strong>
            <div>
              <i>问政策</i>
              <b />
              <i>比方案</i>
              <b />
              <i>做确认</i>
              <b />
              <i>去执行</i>
            </div>
          </div>
        </div>

        <dl className="st-hero-meta">
          <div>
            <dt>项目定位</dt>
            <dd>企业侧智能编排与治理层</dd>
          </div>
          <div>
            <dt>MVP 收敛</dt>
            <dd>
              <strong>12 → 5</strong>
              <small>范围 -58%</small>
            </dd>
          </div>
          <div>
            <dt>模型成本</dt>
            <dd>
              <strong>-32%</strong>
              <small>三级路由</small>
            </dd>
          </div>
          <div>
            <dt>工具准确率</dt>
            <dd>
              <strong>96%</strong>
              <small>10+ Tools</small>
            </dd>
          </div>
        </dl>
      </section>

      <section className="st-ui-section" aria-labelledby="st-ui-title">
        <header className="st-section-heading">
          <div className="st-section-title">
            <strong>01</strong>
            <div>
              <small>PRODUCT UI / INTENT TO ACTION</small>
              <h2 id="st-ui-title">产品 UI 设计</h2>
            </div>
          </div>
          <p>界面不替代 Agent，而是把比较、引用和高风险确认放在最适合阅读与决策的地方。</p>
          <div className="st-carousel-actions">
            <button type="button" onClick={() => moveUiTrack(-1)} aria-label="查看上一组界面">
              <ArrowLeft />
            </button>
            <button type="button" onClick={() => moveUiTrack(1)} aria-label="查看下一组界面">
              <ArrowRight />
            </button>
          </div>
        </header>

        <div ref={uiTrackRef} className="st-ui-track">
          {uiScreens.map((screen) => (
            <figure className="st-phone-card" key={screen.src}>
              <BorderGlow
                className="st-phone-glow"
                edgeSensitivity={14}
                backgroundColor="#07101e"
                borderRadius={34}
                glowRadius={30}
                glowIntensity={0.86}
                fillOpacity={0.15}
                colors={["#56e0df", "#4f7dff", "#9a78ff"]}
              >
                <div className="st-phone-frame">
                  <img src={screen.src} alt={`星旅产品界面：${screen.title}`} loading="lazy" />
                </div>
              </BorderGlow>
              <figcaption>
                <span>{screen.number}</span>
                <div>
                  <b>{screen.title}</b>
                  <p>{screen.note}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="st-work-intro">
        <span>MY WORK / PRODUCT × AGENT × GOVERNANCE</span>
        <h2>我的主要工作</h2>
        <p>星旅是一套面向企业差旅场景的智能助手方案，覆盖制度问答、方案比较、预订确认、报销与审批查询。我负责从市场与需求收敛，到 Agent 编排、Tools 权限治理和评测闭环的整体产品设计。</p>
        <div className="st-work-index" aria-label="三项主要工作">
          <div><b>01</b><span>竞品调研与需求收敛</span></div>
          <div><b>02</b><span>LangGraph Agent 架构</span></div>
          <div><b>03</b><span>Tools 与评估闭环</span></div>
        </div>
      </section>

      <section className="st-competitor-section" aria-labelledby="st-competitor-title">
        <header className="st-section-heading">
          <div className="st-section-title">
            <strong>01</strong>
            <div>
              <small>MARKET / 5 DIRECT COMPETITORS</small>
              <h2 id="st-competitor-title">竞品调研与需求收敛</h2>
            </div>
          </div>
          <p>项目先从企业差旅的供给、政策、审批费控与系统治理切入，通过八维能力矩阵识别现有产品的边界，再把候选需求收敛为可验证的 MVP。</p>
        </header>

        <BorderGlow
          className="st-matrix-glow"
          backgroundColor="#07111d"
          borderRadius={26}
          glowRadius={38}
          glowIntensity={0.72}
          fillOpacity={0.12}
          colors={["#5ddbd7", "#587cff", "#9f78ff"]}
        >
          <div className="st-matrix-panel">
            <div className="st-matrix-header">
              <div>
                <span>8-DIMENSION CAPABILITY MATRIX</span>
                <h3>5 家直接竞品 × 星旅目标态</h3>
              </div>
              <p>基于公开产品、API 与官方能力描述的相对评分；5 分代表该维度能力更完整。</p>
            </div>

            <div className="st-matrix-scroll">
              <div className="st-matrix" role="table" aria-label="企业差旅八维竞品矩阵">
                <div className="st-matrix-row head" role="row">
                  <div role="columnheader">产品 / 定位</div>
                  {dimensions.map((dimension) => (
                    <div role="columnheader" key={dimension}>
                      {dimension}
                    </div>
                  ))}
                </div>
                {competitors.map((competitor, rowIndex) => (
                  <button
                    type="button"
                    className={`st-matrix-row ${activeCompetitor === rowIndex ? "active" : ""}`}
                    onClick={() => setActiveCompetitor(rowIndex)}
                    role="row"
                    key={competitor.name}
                  >
                    <div role="cell">
                      <strong>{competitor.name}</strong>
                      <small>{competitor.type}</small>
                    </div>
                    {competitor.scores.map((score, scoreIndex) => (
                      <div role="cell" key={`${competitor.name}-${dimensions[scoreIndex]}`}>
                        <i data-score={score}>{score}</i>
                      </div>
                    ))}
                  </button>
                ))}
              </div>
            </div>

            <div className="st-matrix-insight">
              <span>SELECTED / {String(activeCompetitor + 1).padStart(2, "0")}</span>
              <h4>{competitors[activeCompetitor].name}</h4>
              <p>{competitors[activeCompetitor].summary}</p>
              <div>
                <strong>定位结论</strong>
                <p>不再造一个 OTA，而是在企业侧连接多个供给、内部制度、审批与财务系统，形成供应商中立、证据可追溯、写操作可管控的 AI 编排层。</p>
              </div>
            </div>
          </div>
        </BorderGlow>

        <div className="st-rice-row">
          <article>
            <span>RESEARCH</span>
            <strong>5 + 1</strong>
            <p>5 家直接竞品与 1 家相邻竞品</p>
          </article>
          <article>
            <span>FRAMEWORK</span>
            <strong>8</strong>
            <p>维能力矩阵</p>
          </article>
          <article>
            <span>RICE</span>
            <strong>12 → 5</strong>
            <p>候选需求收敛为 MVP</p>
          </article>
          <article>
            <span>SCOPE</span>
            <strong>-58%</strong>
            <p>先验证真正差异化的高风险链路</p>
          </article>
        </div>
      </section>

      <section className="st-architecture-section" aria-labelledby="st-architecture-title">
        <header className="st-section-heading">
          <div className="st-section-title">
            <strong>02</strong>
            <div>
              <small>SYSTEM / LANGGRAPH FULL BLUEPRINT</small>
              <h2 id="st-architecture-title">Agent 架构与技术取舍</h2>
            </div>
          </div>
          <p>这套 LangGraph 蓝图承接制度问答、偏好记忆、上下文准备与复杂任务执行；模型负责理解和决策，真实权限、交易与审计仍由可信后端控制。</p>
        </header>

        <StarLangGraph />

        <div className="st-architecture-results">
          <article>
            <GitBranch />
            <div>
              <span>三级路由</span>
              <strong>确定性规则 → 轻量模型 → 主 Agent</strong>
            </div>
          </article>
          <article>
            <Activity />
            <div>
              <span>成本结果</span>
              <strong>平均模型成本 -32%</strong>
            </div>
          </article>
          <article>
            <LockKeyhole />
            <div>
              <span>安全边界</span>
              <strong>写操作必须后端二次确认</strong>
            </div>
          </article>
        </div>
      </section>

      <section className="st-tools-section" aria-labelledby="st-tools-title">
        <header className="st-section-heading">
          <div className="st-section-title">
            <strong>03</strong>
            <div>
              <small>TOOLS / EVALUATION / TELEMETRY</small>
              <h2 id="st-tools-title">Tools 与评估闭环</h2>
            </div>
          </div>
          <p>产品通过 10 个单一职责 Tools 连接查询、预订、报销与审批系统，并用分级确认、全链路埋点和三层指标验证每次调用是否准确、可控且真正完成业务任务。</p>
        </header>

        <div className="st-tool-layout">
          <BorderGlow
            className="st-tool-catalog-glow"
            backgroundColor="#07111d"
            borderRadius={24}
            glowRadius={34}
            glowIntensity={0.72}
            colors={["#55ded9", "#6a8cff", "#a476ff"]}
          >
            <div className="st-tool-catalog">
              <header>
                <div>
                  <span>TOOL CATALOG / 10</span>
                  <h3>单一职责、显式权限、分级风险</h3>
                </div>
                <div className="st-tool-filters">
                  {[
                    ["all", "全部"],
                    ["query", "只读查询"],
                    ["write", "写操作"],
                    ["governance", "治理"],
                  ].map(([key, label]) => (
                    <button
                      type="button"
                      className={toolFilter === key ? "active" : ""}
                      onClick={() => {
                        setToolFilter(key);
                        setActiveTool(0);
                      }}
                      key={key}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </header>

              <div className="st-tool-grid">
                {filteredTools.map(({ icon: Icon, ...tool }, index) => (
                  <button
                    type="button"
                    className={`${activeTool === index ? "active" : ""} risk-${tool.risk}`}
                    onClick={() => setActiveTool(index)}
                    key={tool.name}
                  >
                    <Icon />
                    <span>
                      <b>{tool.label}</b>
                      <small>{tool.name}</small>
                    </span>
                    <em>{tool.risk}风险</em>
                  </button>
                ))}
              </div>

              <aside className="st-tool-detail">
                <div>
                  <span>ACTIVE TOOL</span>
                  <h4>{selectedTool.name}</h4>
                  <p>{selectedTool.detail}</p>
                </div>
                <div className="st-confirm-loop">
                  <span>01 生成预览</span>
                  <i />
                  <span>02 用户确认</span>
                  <i />
                  <span>03 后端凭证</span>
                  <i />
                  <span>04 幂等执行</span>
                </div>
              </aside>
            </div>
          </BorderGlow>

          <div className="st-event-stream">
            <span>OBSERVABILITY / EVENT STREAM</span>
            <h3>从调用到业务结果，全部留痕</h3>
            <div>
              {[
                "intent_classified",
                "tool_call_requested",
                "approval_card_shown",
                "approval_decided",
                "tool_call_completed",
                "task_completed",
              ].map((eventName, index) => (
                <article key={eventName}>
                  <i>{String(index + 1).padStart(2, "0")}</i>
                  <b>{eventName}</b>
                  <small>{index < 2 ? "MODEL" : index < 5 ? "SYSTEM" : "BUSINESS"}</small>
                </article>
              ))}
            </div>
          </div>
        </div>

        <div className="st-evaluation-heading">
          <div>
            <span>EVALUATION SCOREBOARD</span>
            <h3>三层指标回答：准不准、好不好用、值不值得做</h3>
          </div>
          <p>300 条离线评估集覆盖缺参、口语、多意图、跨轮指代、越权、注入、超时、重复确认、制度冲突与长对话。</p>
        </div>

        <div className="st-evaluation-grid">
          {evaluationGroups.map(({ icon: Icon, ...group }, groupIndex) => (
            <BorderGlow
              className="st-evaluation-glow"
              backgroundColor="#08121e"
              borderRadius={22}
              glowRadius={30}
              glowIntensity={0.66}
              colors={
                groupIndex === 0
                  ? ["#5cded9", "#5b8cff", "#9978ff"]
                  : groupIndex === 1
                    ? ["#63b8ff", "#697bff", "#bd79ff"]
                    : ["#6ce4bd", "#48bbd5", "#6b88ff"]
              }
              key={group.label}
            >
              <article className="st-evaluation-card">
                <header>
                  <i>
                    <Icon />
                  </i>
                  <div>
                    <span>{group.label}</span>
                    <h4>{group.title}</h4>
                  </div>
                </header>
                <div>
                  {group.metrics.map(([label, value], index) => (
                    <div className="st-evaluation-metric" key={label}>
                      <span>{label}</span>
                      <b>{value}</b>
                      <i style={{ "--metric": `${88 - index * 7}%` } as CSSProperties} />
                    </div>
                  ))}
                </div>
              </article>
            </BorderGlow>
          ))}
        </div>

        <div className="st-final-result">
          <div>
            <Sparkles />
            <span>KEY RESULT</span>
          </div>
          <strong>工具调用准确率 96%</strong>
          <p>把模型能力变成可测量、可回归、可审计的企业任务系统。</p>
        </div>
      </section>

      <footer className="st-footer">
        <div>
          <span>PROJECT 02 / STAR TRAVEL</span>
          <strong>
            FROM POLICY
            <br />
            TO ACTION.
          </strong>
        </div>
        <Link href="/#projects">
          返回项目列表 <ArrowRight />
        </Link>
      </footer>
    </main>
  );
}
