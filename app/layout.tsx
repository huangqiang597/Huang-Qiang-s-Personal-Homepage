import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "黄强 · AI 产品经理",
  description: "AI 产品经理黄强的个人作品集，聚焦 Agent、RAG、多模态产品与 0 到 1 产品实践。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
