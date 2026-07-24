# 黄强 · AI 产品经理作品集

一个面向求职展示的沉浸式个人作品集网站，集中呈现 AI 产品实践、项目方法论与个人经历。

<p align="center">
  <a href="https://huangqiang-ai-pm.ogizoteni06.chatgpt.site"><strong>在线访问作品集 →</strong></a>
</p>

## 项目概览

网站包含首页与三个完整的项目案例：

| 项目 | 方向 | 页面 |
| --- | --- | --- |
| 魔镜 On Run | 多模态 AI 护肤、RAG、Agent、评测与数据闭环 | `/projects/magic-mirror` |
| 星旅 | 企业差旅 Agent、LangGraph、多工具调用与治理 | `/projects/star-travel` |
| 卉木盈海 | 生态材料产品、混凝土监测与商业化探索 | `/projects/huimu-yinghai` |

此外，首页还包含教育背景、个人兴趣与能力档案、联系方式等内容。

## 技术栈

- React 19 + TypeScript
- Next.js 16 + vinext + Vite
- React Three Fiber / Three.js / drei
- Framer Motion
- Tailwind CSS
- OGL 与自定义 WebGL / CSS 交互效果

## 本地运行

### 环境要求

- Node.js `>= 22.13.0`
- npm

### 启动项目

```bash
git clone https://github.com/YOUR_USERNAME/huangqiang-ai-pm-portfolio.git
cd huangqiang-ai-pm-portfolio
npm ci
npm run dev
```

根据终端显示的本地地址在浏览器中打开网站。

### 构建检查

```bash
npm run build
```

## 主要目录

```text
app/
├─ components/                 # 首页、交互组件与三个项目案例
├─ projects/
│  ├─ magic-mirror/            # 魔镜 On Run
│  ├─ star-travel/             # 星旅
│  └─ huimu-yinghai/           # 卉木盈海
├─ globals.css                 # 首页全局视觉样式
├─ layout.tsx
└─ page.tsx

public/
├─ images/                     # 头像与人物视觉素材
├─ media/                      # 项目图片、UI 图与个人档案素材
└─ models/                     # 3D 模型资源
```

## GitHub 使用说明

首次上传前，在 GitHub 创建一个空仓库，然后执行：

```bash
git remote add origin https://github.com/YOUR_USERNAME/huangqiang-ai-pm-portfolio.git
git push -u origin main
```

后续更新只需要：

```bash
git add .
git commit -m "描述本次修改"
git push
```

## 内容与版权

本仓库包含个人照片、项目设计、研究成果与作品集素材，仅用于黄强的个人展示。未经许可，请勿复制、再发布或用于商业用途。
