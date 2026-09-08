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
- A rotating 3D neural spiral with branching neuron bodies, connected synapses, and travelling signals. Its labels identify AI applications, CloudOps, and software engineering. No company logo is placed inside the animation.
- A large featured AI service, followed by software and automation services in complementary layouts.
- Three interactive business examples, explicitly labelled as simulations.
- A short company introduction, accessible FAQs, and working email/phone contact links.
- The moving banner, glass sculpture, and pinned numbered storyline are removed from the rendered page.

## Original brand and daily colour

The original PNGs in `logos/` remain intact. `public/logos/*_neuraops.svg` contains the original PNG artwork in a tightly framed SVG, with an alpha filter removing its white paper background. The symbol and caption are retained. These are SVG containers for the supplied artwork, not newly traced vector logos.

All logo instances, page colours, and animated neurons share the same daily identity. `app/brand-themes.ts` is the single source of palettes for both CSS and canvas. The cycle is 1 → 2 → 3 → 4, anchored to 7 September 2026 and changing at midnight Asia/Kolkata. A visitor who keeps the page open receives the next identity at midnight; returning to a background tab also resynchronizes it. No rebuild, refresh, or administrator action is needed.

1. Cyan and blue
2. Orchid, magenta, and blue
3. Steel blue and navy
4. Violet and cyan

## Motion and verification

The neural sculpture is drawn with Canvas 2D using projected 3D geometry. It responds to pointer movement, pauses offscreen and in hidden tabs, and limits resolution and point counts on smaller screens. The footer pause control and `prefers-reduced-motion` stop motion while allowing the daily palette to update. Navigation, use-case tabs, and FAQs support the keyboard.

Run `npm.cmd run dev` for local development, `npm.cmd run lint` for linting, and `npm.cmd test` for a production build plus the brand/metadata checks.

### Preview the daily themes from the UI

In local development, open the **Theme preview** control at the bottom right. Choose **Logo 1**, **Logo 2**, **Logo 3**, or **Logo 4** to update both logo instances, page colours, and the neural animation together. Choose **Auto** to return to today's scheduled identity. The preview is temporary and resets on refresh; the automatic schedule continues running underneath it. Production builds do not show the panel and always use the automatic daily identity.
