import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { logoForDate, millisecondsUntilBrandChange } from "../app/brand-schedule.ts";
import { BRAND_THEMES, themeForLogo } from "../app/brand-themes.ts";

test("uses one identity per India calendar day and cycles through all four originals", () => {
  for (let day = 0; day < 8; day++) {
    assert.equal(logoForDate(new Date(Date.UTC(2026, 8, 7 + day))), day % 4 + 1);
  }
  assert.equal(logoForDate(new Date("2026-09-07T18:29:59.999Z")), 1);
  assert.equal(logoForDate(new Date("2026-09-07T18:30:00Z")), 2);
  assert.equal(millisecondsUntilBrandChange(new Date("2026-09-07T18:29:59.999Z")), 1);
  assert.equal(millisecondsUntilBrandChange(new Date("2026-09-07T18:30:00Z")), 86_400_000);
});

test("keeps the cycle continuous across month and year boundaries", () => {
  for (const date of ["2026-09-30T18:29:59.999Z", "2026-12-31T18:29:59.999Z"]) {
    const before = new Date(date);
    assert.equal(logoForDate(new Date(before.getTime() + 1)), logoForDate(before) % 4 + 1);
  }
});

test("every daily logo selects a distinct, complete page and neuron palette", () => {
  assert.equal(BRAND_THEMES.length, 4);
  const accents = new Set();
  const signals = new Set();
  for (let day = 0; day < 4; day++) {
    const logo = logoForDate(new Date(Date.UTC(2026, 8, 7 + day)));
    const theme = themeForLogo(logo);
    assert.equal(theme, BRAND_THEMES[day]);
    for (const color of [theme.accent, theme.accentDark, theme.secondary, theme.soft, theme.tint, theme.strong, theme.closing]) {
      assert.match(color, /^#[0-9a-f]{6}$/i);
    }
    assert.equal(theme.neurons.length, 3);
    for (const color of theme.neurons) {
      assert.equal(color.length, 3);
      for (const channel of color) assert.ok(Number.isInteger(channel) && channel >= 0 && channel <= 255);
    }
    accents.add(theme.accent);
    signals.add(JSON.stringify(theme.neurons));
  }
  assert.equal(accents.size, 4);
  assert.equal(signals.size, 4);
});

test("the served logo artwork is byte-for-byte identical to the supplied originals", async () => {
  for (let n = 1; n <= 4; n++) {
    const [original, served] = await Promise.all([
      readFile(new URL(`../logos/${n}_neuraops.png`, import.meta.url)),
      readFile(new URL(`../public/logos/${n}_neuraops.png`, import.meta.url)),
    ]);
    assert.deepEqual(served, original);
  }
});

test("transparent SVG logos embed the supplied symbol and caption without redrawing them", async () => {
  for (let n = 1; n <= 4; n++) {
    const [original, svg] = await Promise.all([
      readFile(new URL(`../logos/${n}_neuraops.png`, import.meta.url)),
      readFile(new URL(`../public/logos/${n}_neuraops.svg`, import.meta.url), "utf8"),
    ]);
    const embedded = svg.match(/data:image\/png;base64,([A-Za-z0-9+/=]+)/);
    assert.ok(embedded, `Logo ${n} must contain its original artwork`);
    assert.deepEqual(Buffer.from(embedded[1], "base64"), original);
    assert.match(svg, /<feComposite in="SourceGraphic" in2="alpha" operator="in"/);
  }
});
