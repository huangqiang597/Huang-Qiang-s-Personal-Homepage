import assert from "node:assert/strict";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, { headers: { accept: "text/html" } }),
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
  assert.match(html, /\/projects\/magic-mirror/);
  assert.match(html, /\/projects\/star-travel/);
  assert.match(html, /\/projects\/huimu-yinghai/);
});

test("server-renders project routes", async () => {
  const routes = [
    ["/projects/magic-mirror", "魔镜 on run"],
    ["/projects/star-travel", "星旅"],
    ["/projects/huimu-yinghai", "卉木盈海，草色宛墙"],
  ];

  for (const [pathname, title] of routes) {
    const response = await render(pathname);
    assert.equal(response.status, 200);
    assert.match(await response.text(), new RegExp(title));
  }
});

test("server-renders the Magic Mirror case study", async () => {
  const response = await render("/projects/magic-mirror");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /MAGIC MIRROR/);
  assert.match(html, /项目背景/);
  assert.match(html, /Recall@3/);
  assert.match(html, /73/);
  assert.match(html, /90/);
  assert.match(html, /magic-mirror-ui-home\.jpg/);
  assert.match(html, /magic-mirror-ui-report\.jpg/);
  assert.match(html, /magic-mirror-ui-entry\.jpg/);
  assert.match(html, /magic-mirror-ui-auth\.jpg/);
  assert.equal((html.match(/class="mm-phone mm-phone-/g) ?? []).length, 6);
  assert.match(html, /mm-aurora-background/);
  assert.match(html, /border-glow-card/);
  assert.doesNotMatch(html, /mm-next-project/);
});

test("server-renders the transparent interactive avatar foreground", async () => {
  const response = await render();
  const html = await response.text();
  const heroHtml = html.slice(
    html.indexOf('class="interactive-hero"'),
    html.indexOf('class="marquee-section"'),
  );
  assert.match(heroHtml, /hero-projects-layer/i);
  assert.match(heroHtml, /厦门光辰智能/);
  assert.match(heroHtml, /广州省心购科技/);
  assert.match(heroHtml, /卉木盈海，草色宛墙/);
  assert.match(heroHtml, /hero-light-pillar/i);
  assert.match(heroHtml, /huang-qiang-avatar-cutout\.png/i);
  assert.match(heroHtml, /magic-mirror-ai-v1\.webp/i);
  assert.match(heroHtml, /star-travel-ai-v1\.webp/i);
  assert.match(heroHtml, /huimu-ai-v1\.webp/i);
  assert.equal((heroHtml.match(/class="pc-card-wrapper/gi) ?? []).length, 3);
  assert.match(heroHtml, /MOVE · TILT · CLICK TO ENTER/i);
});
