import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

test("keeps NeuraOps search metadata, favicon, and brand signals in the Next.js app", async () => {
  const [page, layout, robots, sitemap] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/robots.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/sitemap.ts", import.meta.url), "utf8"),
  ]);

  assert.match(layout, /metadataBase: new URL\("https:\/\/neuraops\.in"\)/);
  assert.match(layout, /NeuraOps \| AI, Automation & Digital Product Engineering/);
  assert.match(layout, /"NeuraOps"/);
  assert.match(layout, /url: "\/favicon\.ico"/);
  assert.match(layout, /shortcut: \["\/favicon\.ico"\]/);
  assert.match(page, /alternateName: \["NeuraOps", "Neura Ops"\]/);
  assert.match(page, /email: "info@neuraops\.in"/);
  assert.match(robots, /https:\/\/neuraops\.in\/sitemap\.xml/);
  assert.match(sitemap, /https:\/\/neuraops\.in/);
});

test("ships the required favicon, brand assets, and SEO routes", async () => {
  const requiredFiles = [
    "../public/favicon.ico",
    "../public/media/icon-192.png",
    "../public/media/icon-512.png",
    "../public/media/neuraops-horizontal-logo.webp",
    "../public/media/neuraops-footer-logo.webp",
    "../public/og.png",
    "../app/robots.ts",
    "../app/sitemap.ts",
    "../app/manifest.ts",
  ];

  await Promise.all(requiredFiles.map((file) => access(new URL(file, import.meta.url))));
  await assert.rejects(access(new URL("../app/_sites-preview", import.meta.url)));
});
