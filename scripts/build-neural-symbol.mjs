// Derive the hero's neuron positions from the supplied artwork, without changing it.
// Run from the repository root: node scripts/build-neural-symbol.mjs
import sharp from 'sharp';
import fs from 'node:fs/promises';

const source = 'logos/1_neuraops.png';
const { data, info } = await sharp(source).removeAlpha().raw().toBuffer({ resolveWithObject: true });
function inside(x, y) {
  if (x < 0 || x >= info.width || y < 0 || y >= 625) return false;
  const offset = (Math.round(y) * info.width + Math.round(x)) * info.channels;
  const r = data[offset], g = data[offset + 1], b = data[offset + 2];
  return Math.max(r, g, b) - Math.min(r, g, b) > 38;
}
let left = info.width, right = 0, top = info.height, bottom = 0;
for (let y = 0; y < 625; y++) for (let x = 0; x < info.width; x++) {
  if (!inside(x, y)) continue;
  left = Math.min(left, x); right = Math.max(right, x);
  top = Math.min(top, y); bottom = Math.max(bottom, y);
}
const symbolWidth = right - left, symbolHeight = bottom - top;

const step = symbolWidth / 68;
const rawPoints = [];
let seed = 21;
const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
for (let row = 0, y = top + step / 3; y < bottom; y += step * .86, row++) {
  for (let x = left + step / 3 + (row % 2) * step / 2; x < right; x += step) {
    const px = x + (random() - .5) * step * .5;
    const py = y + (random() - .5) * step * .5;
    if (inside(px, py)) rawPoints.push([px, py]);
  }
}
const edges = [];
for (let i = 0; i < rawPoints.length; i++) {
  const a = rawPoints[i];
  for (let j = i + 1; j < rawPoints.length; j++) {
    const b = rawPoints[j];
    if (Math.hypot(a[0] - b[0], a[1] - b[1]) > step * 1.42) continue;
    // No synapse may cut across the white openings of the original symbol.
    if (![.2, .4, .6, .8].every(t => inside(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t))) continue;
    edges.push([i, j]);
  }
}
const nodes = rawPoints.map(([x, y]) => {
  const offset = (Math.round(y) * info.width + Math.round(x)) * info.channels;
  return [
    Number(((x - left - symbolWidth / 2) / symbolWidth).toFixed(5)),
    Number(((y - top - symbolHeight / 2) / symbolWidth).toFixed(5)),
    Number((data[offset + 1] / 255 * .06).toFixed(5)),
  ];
});
const geometry = { source, crop: [left, top, symbolWidth, symbolHeight], nodes, edges };
await fs.writeFile('app/neural-symbol.json', JSON.stringify(geometry));
console.log(`NeuraOps symbol: ${nodes.length} neurons, ${edges.length} synapses; source crop ${geometry.crop.join(', ')}`);
