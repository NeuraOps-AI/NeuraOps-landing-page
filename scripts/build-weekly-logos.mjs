// Build resolution-independent colourways from the supplied NeuraOps artwork.
// Run npm run brand:logos after editing the palettes for days 5, 6, or 7.
import { readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';
import potrace from 'potrace';
import { BRAND_THEMES } from '../app/brand-themes.ts';

const directory = new URL('../public/logos/', import.meta.url);
const source = await readFile(new URL('../logos/1_neuraops.png', import.meta.url));
const { data, info } = await sharp(source).removeAlpha().raw().toBuffer({ resolveWithObject: true });

async function traceRegion(top, bottom, smoothing, tolerance, speckles) {
  const mask = Buffer.alloc(info.width * info.height, 255);
  for (let y = top; y < bottom; y++) for (let x = 0; x < info.width; x++) {
    const pixel = (y * info.width + x) * info.channels;
    const channels = [data[pixel], data[pixel + 1], data[pixel + 2]];
    // Isolate coloured ink, excluding the original white paper and grey shadow.
    if (Math.max(...channels) - Math.min(...channels) > 60) mask[y * info.width + x] = 0;
  }
  const bitmap = await sharp(mask, { raw: { width: info.width, height: info.height, channels: 1 } })
    .blur(smoothing).png().toBuffer();
  const tracer = new potrace.Potrace({ threshold: 128, turdSize: speckles, alphaMax: 1,
    optCurve: true, optTolerance: tolerance });
  await new Promise((resolve, reject) => tracer.loadImage(bitmap, error => error ? reject(error) : resolve()));
  return tracer.getPathTag().match(/d="([^"]+)"/)[1];
}

// Fit the symbol and both lettering sizes separately: the small caption needs
// finer tolerances than the broad curves. No fonts are substituted.
const symbol = await traceRegion(120, 625, .8, .55, 12);
const wordmark = await traceRegion(640, 775, .6, .35, 6);
const caption = await traceRegion(775, 855, .5, .2, 3);

for (let index = 4; index < 7; index++) {
  const theme = BRAND_THEMES[index];
  // Share the left/centre/right colour stops with the neural infinity animation.
  const stops = theme.neurons.map((color, stop) =>
    `<stop offset="${stop * 50}%" stop-color="rgb(${color.join(',')})"/>`).join('');
  const title = `NeuraOps Technologies - ${theme.name.replaceAll('&', '&amp;')}`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="180 128 1190 725" role="img" aria-label="NeuraOps Technologies">
<title>${title}</title>
<desc>Vector paths fitted to the supplied NeuraOps symbol and lettering, with a three-colour gradient.</desc>
<defs>
<linearGradient id="brand-gradient" gradientUnits="userSpaceOnUse" x1="253" y1="0" x2="1294" y2="0" color-interpolation="sRGB">${stops}</linearGradient>
<path id="symbol" d="${symbol}" fill-rule="evenodd"/>
<clipPath id="symbol-clip"><use href="#symbol"/></clipPath>
<linearGradient id="left-fold" gradientUnits="userSpaceOnUse" x1="550" y1="210" x2="490" y2="585"><stop stop-color="#081c32" stop-opacity=".52"/><stop offset=".65" stop-color="#081c32" stop-opacity=".1"/><stop offset="1" stop-color="#081c32" stop-opacity="0"/></linearGradient>
<linearGradient id="right-fold" gradientUnits="userSpaceOnUse" x1="1040" y1="240" x2="1130" y2="590"><stop stop-color="#081c32" stop-opacity=".58"/><stop offset="1" stop-color="#081c32" stop-opacity=".03"/></linearGradient>
<linearGradient id="return-fold" gradientUnits="userSpaceOnUse" x1="940" y1="324" x2="970" y2="492"><stop stop-color="#081c32" stop-opacity="0"/><stop offset="1" stop-color="#081c32" stop-opacity=".48"/></linearGradient>
</defs>
<use href="#symbol" fill="url(#brand-gradient)"/>
<g clip-path="url(#symbol-clip)">
<path d="M837 375 L909 333 C954 306 983 325 989 355 L992 465 C991 492 977 487 956 472 Z" fill="url(#return-fold)"/>
<path d="M253 405 C257 288 326 202 419 216 C517 230 695 415 908 543 C947 573 985 535 991 481 L1010 625 H200 Z" fill="url(#left-fold)"/>
<path d="M849 321 C962 228 1084 219 1147 312 C1234 426 1150 565 1030 589 C1160 538 1155 367 1096 311 C1032 252 949 266 849 321 Z" fill="url(#right-fold)"/>
</g>
<path id="wordmark" d="${wordmark}" fill="url(#brand-gradient)" fill-rule="evenodd"/>
<path id="caption" d="${caption}" fill="url(#brand-gradient)" fill-rule="evenodd"/>
</svg>`;
  // Only paths, gradients and vector clipping ship to the browser: no bitmap
  // masks, embedded pixels, image filters, or external font dependencies.
  await writeFile(new URL(`${index + 1}_neuraops.svg`, directory), svg);
  console.log(`Logo ${index + 1}: ${theme.name} (${Buffer.byteLength(svg)} bytes)`);
}
