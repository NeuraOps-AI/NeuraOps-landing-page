# NeuraOps design direction

Reviewed 8 September 2026. The current design focuses on AI applications, CloudOps, and solving business problems through software engineering.

## Reference research

| Region | Primary source | Useful observation |
| --- | --- | --- |
| USA | [Mercor](https://www.mercor.com/) | A clear statement of purpose, with separate routes for different visitors. |
| UK | [Synthesia](https://www.synthesia.io/) | Product examples make the value of AI tangible before asking visitors to commit. Its [London headquarters announcement](https://www.synthesia.io/post/introducing-our-new-london-headquarters) confirms the regional reference. |
| India | [Sarvam](https://www.sarvam.ai/) | Positioning and applications give the company a specific identity rather than a generic AI pitch. |
| UAE | [qeen](https://www.qeen.ai/en) | The business problem and practical examples lead the page. Its footer identifies the company in Dubai. |
| Singapore | [Pand.ai](https://www.pand.ai/) | Business context, enterprise integration, and human control explain the offering. Its footer confirms Singapore. |

These are information-architecture and messaging observations from the official pages. External browser screenshot capture was blocked by the local network; no claim is made to have visually audited their current animations. The visual direction below is an original design for NeuraOps, not a reproduction of any source.

## Resulting design

- Warm white backgrounds, locally hosted Manrope, restrained colours, and generous spacing.
- The original NeuraOps infinity silhouette formed as an open neural mesh with the original lighter gradient. Twelve branching neuron bodies, including a brighter lead neuron, travel around a continuous infinity circuit with fading trails. The full symbol revolves in 3D with perspective and a recessed mesh providing depth. Interactive AI applications, CloudOps, and software engineering badges orbit the symbol and pause their orbit on hover or focus.
- A large featured AI service, followed by software and automation services in complementary layouts.
- Three interactive business examples, explicitly labelled as simulations.
- A short company introduction, accessible FAQs, and working email/phone contact links.
- The moving banner, glass sculpture, and pinned numbered storyline are removed from the rendered page.

## Original brand and daily colour

The original PNGs in `logos/` remain intact. SVG logos 1–4 embed their original PNGs and remove the white paper with an alpha filter. Logos 5–7 are resolution-independent vector artwork: smooth paths fitted to the supplied infinity symbol, wordmark, and caption, with vector gradients and fold shading. They contain no embedded bitmap, raster mask, image filter, or external font. Their spatial gradients share the three colour stops of the neural animation. Run `npm.cmd run brand:logos` to regenerate them using the development-only Potrace tracer and Sharp. The generated SVG assets are served as static files; no tracing runs in the browser or production server.

All logo instances, page colours, and animated neurons share the same daily identity. `app/brand-themes.ts` is the single source of palettes for CSS, canvas, and the three new logo colourways. The seven-day cycle is anchored to Monday, 7 September 2026 and changes at midnight Asia/Kolkata. Sunday returns to Monday's identity. A visitor who keeps the page open receives the next identity at midnight; returning to a background tab also resynchronizes it. No rebuild, refresh, or administrator action is needed for the daily switch.

| Day | Logo | Palette |
| --- | --- | --- |
| Monday | 1 | Cyan & blue |
| Tuesday | 2 | Magenta & electric blue |
| Wednesday | 3 | Steel blue & navy |
| Thursday | 4 | Cyan & violet |
| Friday | 5 | Emerald & sapphire, through turquoise |
| Saturday | 6 | Coral & violet, through pink |
| Sunday | 7 | Amber & teal, through jade |

## Motion and verification

Updated 13 September 2026. The neural symbol is drawn with Canvas 2D from `app/neural-symbol.json`, sampled directly from the symbol in the supplied `logos/1_neuraops.png`. The source artwork remains intact. `node scripts/build-neural-symbol.mjs` regenerates the nodes and connections using Sharp (provided by Next.js). The open mesh follows the original silhouette and colour areas, with a recessed copy and short depth connections providing volume during rotation. The original lighter palettes and mesh opacity are restored. `app/neural-motion.ts` defines a smooth closed circuit following both lobes, with recessed synapses bridging the open tips. Arc-length sampling maintains steady travel through the curves. Palettes follow the active daily logo through `useDailyTheme`.

At normal speed, every large neuron completes the whole circuit in 30 seconds, and the entire symbol completes a 360-degree revolution in 60 seconds. Tilt and roll follow this slower rotation. Rotation lingers at full-face views and moves faster through edge-on views. Small mesh nodes form the supporting structure; large neuron bodies and their dendrites travel continuously. Clicking or tapping the symbol or a badge sends an activation wave and adds a gentle, brief speed boost (up to 35% for the flow and 10% for rotation), then smoothly returns to normal speed. Badges also update the service caption. Native buttons support Enter and Space. Badge orbits hold on hover/focus to make selection easier. All canvas motion and badge orbits pause offscreen or in hidden tabs, and pixel density is capped at 1.5. The footer pause control and `prefers-reduced-motion` stop continuous motion; activation gives static highlighting in these modes, and the daily palette still updates.

`tests/neural-motion.test.mjs` verifies complete lobe traversal, smooth loop closure, a monotonic full revolution, and acceleration/pause behaviour. Brand checks cover all seven midnight transitions, weekly repetition, month/year boundaries, text contrast, original assets 1–4, and vector-only output for logos 5–7. Rendered vector silhouettes are compared to the supplied symbol, wordmark, and caption separately to guard their fidelity. Browser checks additionally inspect all moving neuron bodies, front/edge/reverse/return poses, actual mobile taps, keyboard input, daily palettes, and offscreen/reduced-motion pausing.

Run `npm.cmd run dev` for local development, `npm.cmd run lint` for linting, and `npm.cmd test` for a production build plus the brand/metadata checks.

### Preview the daily themes from the UI

In local development, open the **Theme preview** control at the bottom right. Choose any of **Logo 1** through **Logo 7** to update both logo instances, page colours, and the neural animation together. Choose **Auto** to return to today's scheduled identity. The preview is temporary and resets on refresh; the automatic schedule continues running underneath it. Production builds do not show the panel and always use the automatic daily identity.
