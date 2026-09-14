import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import sharp from "sharp";
import { BRAND_CYCLE_DAYS, logoForDate, millisecondsUntilBrandChange } from "../app/brand-schedule.ts";
import { BRAND_THEMES, themeForLogo } from "../app/brand-themes.ts";

test("uses seven India calendar-day identities and repeats every Monday", () => {
  assert.equal(BRAND_CYCLE_DAYS, 7);
  for (let day = -7; day < 21; day++) {
    assert.equal(logoForDate(new Date(Date.UTC(2026, 8, 7 + day))), (day % 7 + 7) % 7 + 1);
  }
  assert.equal(logoForDate(new Date("2026-09-07T18:29:59.999Z")), 1);
  assert.equal(logoForDate(new Date("2026-09-07T18:30:00Z")), 2);
  assert.equal(millisecondsUntilBrandChange(new Date("2026-09-07T18:29:59.999Z")), 1);
  assert.equal(millisecondsUntilBrandChange(new Date("2026-09-07T18:30:00Z")), 86_400_000);
  // All transitions, including the added days and Sunday-to-Monday rollover.
  for (let day = 0; day < 7; day++) {
    const midnight = Date.UTC(2026, 8, 7 + day, 18, 30);
    assert.equal(logoForDate(new Date(midnight - 1)), day + 1);
    assert.equal(logoForDate(new Date(midnight)), (day + 1) % 7 + 1);
    assert.equal(millisecondsUntilBrandChange(new Date(midnight - 1)), 1);
  }
});

test("keeps the cycle continuous across month and year boundaries", () => {
  for (const date of ["2026-09-30T18:29:59.999Z", "2026-12-31T18:29:59.999Z"]) {
    const before = new Date(date);
    assert.equal(logoForDate(new Date(before.getTime() + 1)), logoForDate(before) % 7 + 1);
  }
});

test("every daily logo selects a distinct, complete page and neuron palette", () => {
  assert.equal(BRAND_THEMES.length, BRAND_CYCLE_DAYS);
  const accents = new Set();
  const signals = new Set();
  for (let day = 0; day < BRAND_CYCLE_DAYS; day++) {
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
  assert.equal(accents.size, 7);
  assert.equal(signals.size, 7);
});

test("daily palettes keep button and badge text readable", () => {
  const luminance = hex => {
    const channels = hex.slice(1).match(/../g).map(channel => parseInt(channel, 16) / 255)
      .map(channel => channel <= .04045 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4);
    return channels[0] * .2126 + channels[1] * .7152 + channels[2] * .0722;
  };
  const contrast = (a, b) => (Math.max(luminance(a), luminance(b)) + .05) / (Math.min(luminance(a), luminance(b)) + .05);
  for (const theme of BRAND_THEMES) {
    assert.ok(contrast(theme.accent, '#ffffff') >= 4.5, `${theme.name}: white button text`);
    assert.ok(contrast(theme.accentDark, theme.soft) >= 4.5, `${theme.name}: badge text`);
  }
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

test("new colourways are scalable vectors faithful to the original symbol and lettering", async () => {
  const original = await sharp(await readFile(new URL('../logos/1_neuraops.png', import.meta.url)))
    .removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const variants = new Set();
  for (let n = 5; n <= 7; n++) {
    const svg = await readFile(new URL(`../public/logos/${n}_neuraops.svg`, import.meta.url), 'utf8');
    assert.doesNotMatch(svg, /<image\b|<mask\b|<filter\b|<text\b|data:image/,
      'Scalable logos must not depend on bitmap masks, image filters, or substitute fonts');
    assert.ok(Buffer.byteLength(svg) < 50_000, 'Vector assets should remain lightweight');
    assert.match(svg, /viewBox="180 128 1190 725"/);
    const gradient = svg.match(/<linearGradient\b[^>]*>([\s\S]*?)<\/linearGradient>/);
    assert.ok(gradient, `Logo ${n} must have a gradient`);
    variants.add(gradient[1]);
    // Compare rendered ink against the supplied art. Check lettering separately
    // so its loss cannot be hidden by the much larger infinity symbol.
    const rendered = await sharp(Buffer.from(svg)).resize(1190, 725).ensureAlpha().raw().toBuffer();
    assert.equal(rendered[3], 0, 'Background must remain transparent');
    for (const [name, top, bottom, minimum] of [['symbol', 0, 497, .99], ['wordmark', 512, 647, .98], ['caption', 647, 725, .95]]) {
      let intersection = 0, union = 0;
      for (let y = top; y < bottom; y++) for (let x = 0; x < 1190; x++) {
        const offset = ((y + 128) * original.info.width + x + 180) * original.info.channels;
        const [r, g, b] = original.data.subarray(offset, offset + 3);
        const sourceInk = Math.max(r, g, b) - Math.min(r, g, b) > 60;
        const vectorInk = rendered[(y * 1190 + x) * 4 + 3] > 128;
        if (sourceInk || vectorInk) union++;
        if (sourceInk && vectorInk) intersection++;
      }
      assert.ok(intersection / union > minimum, `Logo ${n} ${name} must follow the supplied artwork`);
    }
  }
  assert.equal(variants.size, 3);
});
