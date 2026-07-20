import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the interactive AI product manager portfolio", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>黄强 — AI 产品经理<\/title>/i);
  assert.match(html, /Hi, i/);
  assert.match(html, /Huang Qiang/);
  assert.match(html, /Interactive Digital Human/i);
  assert.match(html, /Capabilities/i);
  assert.match(html, /魔镜 on run/);
});

test("server-renders the avatar fallback and mounts Three.js only on the client", async () => {
  const response = await render();
  const html = await response.text();
  const heroHtml = html.slice(
    html.indexOf('class="interactive-hero"'),
    html.indexOf('class="marquee-section"'),
  );
  assert.match(heroHtml, /huang-qiang-3d-avatar\.png/i);
  assert.doesNotMatch(heroHtml, /<canvas/i);
});
