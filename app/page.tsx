const projects = [
  {
    index: "01",
    title: "魔镜 on run",
    english: "Multimodal Skincare Agent",
    role: "Agent 产品经理 · 厦门光辰智能",
    period: "2026.04 — 2026.07",
    summary:
      "以智能镜为入口，将肤况检测、肌肤日记、深度报告与护肤建议编排成持续可执行的个性化服务。",
    image: "/media/magic-mirror.jpg",
    imageClass: "project-image--portrait",
    metrics: ["Recall@3 73% → 90%", "有据回答率 68% → 88%", "Token -37%"],
    tags: ["RAG", "模型评测", "多模态", "数据闭环"],
  },
  {
    index: "02",
    title: "星旅",
    english: "Enterprise Travel Agent",
    role: "Agent 产品经理 · 广州省心购科技",
    period: "2026.07 — 至今",
    summary:
      "供应商中立的企业差旅编排与治理层，覆盖政策问答、方案查询、预订、报销与审批完整闭环。",
    image: "/media/star-travel.png",
    imageClass: "project-image--diagram",
    metrics: ["12 → 5 项 MVP", "10+ Tools", "工具准确率 96%"],
    tags: ["LangGraph", "Function Call", "RICE", "成本路由"],
  },
  {
    index: "03",
    title: "卉木盈海",
    english: "Living Concrete Commercialization",
    role: "产品 / 商业化负责人 · 互联网+省银奖",
    period: "2022.03 — 2023.09",
    summary:
      "把实验室自研植生混凝土推向墙体绿化与河岸护坡，从竞品定价、MVP 定义走到工程落地。",
    image: "/media/concrete-ui.jpg",
    imageClass: "project-image--ui",
    metrics: ["10+ 家竞品调研", "定价低于均价约 25%", "工程项目落地"],
    tags: ["0→1", "MVP", "供应链协同", "商业化"],
  },
];

const strengths = [
  {
    number: "01",
    title: "Agent 产品全链路",
    text: "从竞品与需求收敛，到 PRD、原型、RAG、Function Call、模型评测、埋点和内测，能把 AI 能力落到真实任务。",
    foot: "2 段 Agent 产品实习",
  },
  {
    number: "02",
    title: "数据驱动的验证",
    text: "习惯先定义可观测目标，再用 Golden Query、离线评估、Bad Case 与线上指标持续校正体验和成本。",
    foot: "50 名种子用户内测",
  },
  {
    number: "03",
    title: "技术理解与取舍",
    text: "可以与算法、研发和硬件团队讨论模型路由、Schema、权限、时延与 Token 成本，并做出产品层 trade-off。",
    foot: "2 项发明专利 · 1 篇 EI",
  },
  {
    number: "04",
    title: "用户与增长直觉",
    text: "长期做内容和电商运营，对注意力、转化与真实用户反馈有一线体感，也能把复杂概念表达得更清楚。",
    foot: "小红书 2.3w 粉丝",
  },
];

export default function Home() {
  return (
    <main>
      <section className="hero" id="home">
        <img
          className="hero-photo"
          src="/media/huangqiang-lifestyle.jpg"
          alt="黄强在湖边旅行的生活照"
        />
        <div className="hero-scrim" />
        <nav className="nav shell" aria-label="主导航">
          <a className="brand" href="#home" aria-label="返回首页">
            HQ<span className="brand-dot">.</span>
          </a>
          <div className="nav-links">
            <a href="#about">关于</a>
            <a href="#work">作品</a>
            <a href="#strengths">优势</a>
          </div>
          <a className="nav-contact" href="mailto:amcdihq@163.com">
            联系我 <span>↗</span>
          </a>
        </nav>

        <div className="hero-content shell">
          <div className="availability"><span /> AI PRODUCT MANAGER · GUANGZHOU</div>
          <h1>
            把复杂的 AI，
            <br />做成<span className="hero-em">可验证的产品</span>。
          </h1>
          <div className="hero-bottom">
            <p>黄强 · AI 产品经理</p>
            <p className="hero-intro">专注 Agent、RAG 与多模态产品，<br />在效果、成本与商业价值之间找到最优解。</p>
          </div>
        </div>
        <a className="scroll-cue" href="#about" aria-label="向下查看">
          <span>SCROLL TO EXPLORE</span><i />
        </a>
      </section>

      <section className="about section" id="about">
        <div className="shell">
          <div className="section-kicker"><span>01</span> ABOUT / 个人经历</div>
          <div className="about-grid">
            <div className="about-photo-wrap">
              <img className="about-photo" src="/media/huangqiang-cafe.jpg" alt="黄强在咖啡店中的生活照" />
              <span className="photo-note">OUTSIDE THE SCREEN<br />DAILY MOMENTS</span>
            </div>
            <div className="about-copy">
              <h2>既理解模型边界，<br />也在意<span>人的真实感受。</span></h2>
              <p className="about-lead">
                我是黄强，华南理工大学硕士在读。做过智能护肤镜和企业差旅 Agent，也把一项实验室材料项目从产品定义推到了工程落地。
              </p>
              <p>
                我擅长把模糊问题拆成可验证的 MVP：先找到最关键的用户任务，再围绕数据、模型和业务系统建立可量化的闭环。对我来说，AI 产品不是模型能力的陈列，而是一个用户愿意持续使用、团队能够稳定交付的完整系统。
              </p>
              <div className="about-meta">
                <div><span>当前</span><strong>华南理工大学 · 硕士</strong></div>
                <div><span>方向</span><strong>AI Agent / RAG / 多模态</strong></div>
                <div><span>坐标</span><strong>广州，中国</strong></div>
              </div>
              <div className="about-actions">
                <a href="mailto:amcdihq@163.com">amcdihq@163.com ↗</a>
                <a href="tel:17750290736">177 5029 0736</a>
              </div>
            </div>
          </div>
          <div className="timeline" aria-label="教育与经历时间线">
            <div><span>2020 — 2024</span><strong>福州大学</strong><small>GPA 3.62 / 4.0 · 专业第 2</small></div>
            <div><span>2022 — 2023</span><strong>卉木盈海</strong><small>互联网+省银奖 · 商业化落地</small></div>
            <div><span>2024 — 2027</span><strong>华南理工大学</strong><small>硕士 · EI 论文 / 发明专利</small></div>
            <div><span>2026 — NOW</span><strong>Agent 产品实践</strong><small>魔镜 on run / 星旅</small></div>
          </div>
        </div>
      </section>

      <section className="work section" id="work">
        <div className="shell">
          <div className="section-head">
            <div className="section-kicker"><span>02</span> SELECTED WORK / 精选项目</div>
            <p>从用户问题出发，穿过模型、系统与业务，<br />最终回到可观测的产品结果。</p>
          </div>
          <div className="projects">
            {projects.map((project) => (
              <article className="project-card" key={project.index}>
                <div className="project-visual">
                  <img className={project.imageClass} src={project.image} alt={`${project.title} 项目图`} />
                  <div className="project-index">{project.index}</div>
                  <div className="visual-label">CASE STUDY · {project.period}</div>
                </div>
                <div className="project-body">
                  <div className="project-role">{project.role}</div>
                  <h3>{project.title}</h3>
                  <p className="project-en">{project.english}</p>
                  <p className="project-summary">{project.summary}</p>
                  <div className="metric-row">
                    {project.metrics.map((metric) => <span key={metric}>{metric}</span>)}
                  </div>
                  <div className="tag-row">
                    {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="strengths section" id="strengths">
        <div className="shell">
          <div className="section-head">
            <div className="section-kicker"><span>03</span> EDGE / 个人优势</div>
            <h2>我带来的，<br />不只是<span>一份 PRD。</span></h2>
          </div>
          <div className="strength-grid">
            {strengths.map((item) => (
              <article className="strength-card" key={item.number}>
                <div className="strength-number">{item.number}</div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <div className="strength-foot">{item.foot}<span>↗</span></div>
              </article>
            ))}
          </div>
          <div className="recognition">
            <div className="recognition-title">SELECTED RECOGNITION</div>
            <div className="recognition-list">
              <span>宏平长青奖学金 · 2025</span>
              <span>全国海洋航行器设计与制作大赛 · 2025</span>
              <span>CAE 软件应用大赛 · 2024</span>
              <span>挑战杯福建省大学生创业计划 · 2022</span>
            </div>
          </div>
          <div className="off-work">
            <span>OFF WORK</span>
            <p>足球校队 / 云顶之弈全服前 1000 / 视频剪辑 / 主持 / 自媒体运营</p>
          </div>
        </div>
      </section>

      <footer className="contact" id="contact">
        <div className="contact-orb" />
        <div className="shell contact-inner">
          <div className="section-kicker"><span>04</span> CONTACT / 保持联系</div>
          <p className="contact-pre">有新的 AI 产品、Agent 或 0→1 机会？</p>
          <h2>LET&apos;S BUILD<br /><span>SOMETHING REAL.</span></h2>
          <a className="contact-email" href="mailto:amcdihq@163.com">
            <span>amcdihq@163.com</span><i>↗</i>
          </a>
          <div className="contact-bottom">
            <span>HUANG QIANG · AI PRODUCT MANAGER</span>
            <span>WECHAT · HUANGayo-</span>
            <span>© 2026</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
