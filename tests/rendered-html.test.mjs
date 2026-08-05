import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the NeuraOps landing page with production SEO", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(
    html,
    /<title>NeuraOps \| AI, Automation &amp; Digital Product Engineering<\/title>/i,
  );
  assert.match(
    html,
    /<meta name="description" content="NeuraOps designs digital products, workflow automation, and AI systems/i,
  );
  assert.match(html, /<link rel="canonical" href="https:\/\/neuraops\.in"/i);
  assert.match(html, /<meta property="og:image" content="https:\/\/neuraops\.in\/og\.png"/i);
  assert.match(html, /<script type="application\/ld\+json">/i);
  assert.match(html, /"@type":"Organization"/i);
  assert.match(html, /Build systems that let your business/);
  assert.match(html, /AI-native digital operations/);
  assert.match(html, /aria-label="Primary navigation"/);
  assert.match(html, /href="mailto:info@neuraops\.in/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
});

test("keeps brand assets and SEO routes in the production surface", async () => {
  const requiredFiles = [
    "../public/media/neuraops-hero.webp",
    "../public/media/intelligent-operations.webp",
    "../public/media/neuraops-horizontal-logo.webp",
    "../public/media/neuraops-footer-logo.webp",
    "../public/media/icon-192.png",
    "../public/media/icon-512.png",
    "../public/og.png",
    "../app/robots.ts",
    "../app/sitemap.ts",
    "../app/manifest.ts",
  ];

  await Promise.all(requiredFiles.map((file) => access(new URL(file, import.meta.url))));

  const [page, layout, css, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(page, /"@context": "https:\/\/schema\.org"/);
  assert.match(page, /loading="lazy"/);
  assert.match(layout, /metadataBase: new URL\("https:\/\/neuraops\.in"\)/);
  assert.match(layout, /summary_large_image/);
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.match(css, /@media \(max-width: 640px\)/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);

  await assert.rejects(access(new URL("../app/_sites-preview", import.meta.url)));
});
