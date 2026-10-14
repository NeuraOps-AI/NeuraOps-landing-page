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

### Full-width neural hero — 14 October 2026

The hero now uses the original neural infinity as an interactive background, with the headline, description, and calls to action layered above it. A soft radial veil keeps text readable without changing the approved mesh gradients. The content wrapper passes pointer events through to the canvas; CTA links remain independently clickable. Mobile and tablet layouts move the badge orbit below the main message. The existing 30-second neuron circuit, 60-second revolution, activation waves, pause controls, and weekly brand schedule remain in place.

Copy now explains the relationship between AI applications, custom product engineering, and CloudOps. A four-step delivery section describes discovery, prototyping, implementation, and post-launch planning. Examples remain labelled as illustrative; no customer claims or performance statistics were added.

QA: inspected desktop (1440px), tablet (820px), and mobile (390px and 320px) layouts. Checked background pointer activation, keyboard/service activation, animation pause, mobile navigation, workflow completion, FAQ expansion, and all seven logo/palette mappings. No console warnings/errors were captured. All 12 existing automated tests passed. Production build passed with `npm.cmd run build -- --webpack`; default Turbopack failed while starting its CSS worker in this environment, including outside the sandbox. Screenshots are in the ignored `outputs` folder.

### Supporting motion and growth story — 14 October 2026

Research references: https://dribbble.com/tags/landing-page-animation (including the SwiftSupport product-interface concept), https://www.landing.love/ and its AI category, and https://lottiefiles.com/free-animations/landing-page. The useful direction is functional product illustration, contrasting section surfaces, compact service modules, and small vector animations. Some reference gallery videos did not play in the browser, so research used accessible previews and descriptions. No third-party artwork or animation files were copied or downloaded.

Following the owner's clarification, NeuraOps is positioned as an end-to-end services partner helping businesses scale through software development, AI integration, analytics/dashboards, and CloudOps. Four service cards now use original CSS/SVG illustrations. A selectable solution studio provides four illustrative business scenarios, keyboard-accessible tabs, three clickable workflow stages, and contextual contact links. These are solution examples rather than claims about shipped client projects. Data-driven scenario definitions allow future services/examples to be added without rewriting the presentation.

The approved hero neural mesh, its geometry, colours, speed, badges, and interactions were not edited in this supporting-motion pass. Spacing was reduced below the hero, and the oversized introduction became a compact challenge selector. The new motions use existing daily-theme variables, obey the site pause control and reduced-motion preference, and pause offscreen where continuously animated. No new animation runtime was added.

Validation for the supporting-motion pass: Webpack production build and TypeScript passed; all 12 existing tests passed. Browser QA covered the four scenarios, workflow completion, Home/End keyboard navigation, changing scenarios with motion paused, desktop and 390px mobile layouts, and all seven daily palettes. The new dark studio and service illustrations correctly follow each palette, with no horizontal overflow at 390px. The local preview is retained at http://localhost:3000/.

### Product motion redesign — 15 October 2026

Replaced the rejected node-flow blueprint with four original layered product scenes: knowledge-grounded AI responses, a dimensional cloud stack and release checklist, a web/mobile workspace assembling in stages, and a dashboard with a drawn trend and contextual insight. Direction informed by the supplied Dribbble/SwiftSupport interface animation reference, Landing.love AI gallery (including Antimetal), and LottieFiles landing-page animation gallery. No reference artwork was copied. Uses CSS/SVG and React rather than another animation dependency.

Scenes use the daily palette variables, subtle pointer perspective, three selectable chapters, local pause/resume, global pause, reduced-motion handling, visibility and offscreen suspension. Reduced-motion users can still select chapters manually. The approved neural hero was not edited in this pass.

Validation: TypeScript and Webpack production build passed; all 12 existing tests passed. Browser checked four tabs, manual chapter selection, pause/resume and automatic chapter progression, desktop and 390px mobile. No mobile horizontal overflow or browser errors/warnings observed. Saved screenshots in outputs/product-scenes-final.jpg and outputs/product-scenes-mobile.jpg. These are illustrative product experiences, not claims about client projects.

### Centered background and visitor themes — 15 October 2026
Moved the neural infinity into a fixed viewport backdrop, centered its projection and reduced its scale to keep both lobes visible. Removed the broad white hero mask; foreground sections scroll above the canvas on readable surfaces. Existing neuron motion and activation remain available. Replaced the development-only floating preview with a public footer picker containing seven palettes and Daily theme. Visitor choices persist in localStorage; Daily theme clears the override and resumes the existing IST schedule. Validated saved selection across reload, return to daily mode, desktop alignment, mobile footer wrapping and no horizontal overflow. TypeScript and 12 existing tests passed; Webpack production build passed.

### Continuous neural canvas and scroll motion — 15 October 2026
Removed section-wide white and dark backgrounds across every main section and footer. All use the same daily-logo-derived light canvas, with translucent local reading surfaces and matching accent controls. Product scenes retain their own readable mockups. Orbit badges fade away as the visitor leaves the hero while the neural mesh stays fixed and visible.

Scrolling adds a gently smoothed turn to the neural symbol, reveals service illustrations and delivery cards using native view timelines where supported, and advances the selected product scene through its three chapters. Scroll control suspends timed chapter advancement so the two do not compete. Manual chapter selection pauses progression. Reduced motion and the existing pause controls remain supported.

Verified computed backgrounds are transparent across all eight main sections; desktop and 390px mobile views retain the mesh with no horizontal overflow. Confirmed scroll-driven scene reaches phase 2, TypeScript passed, 12 existing tests passed, and Webpack build passed. Screenshot: outputs/continuous-neural-theme.jpg.

### Gap interaction and compact footer — 15 October 2026
Empty section layout areas now pass pointer input to the neural canvas, while text, cards, and controls retain their normal interaction. Verified a physical pointer click in the gap above the footer increments the mesh activation counter. Replaced theme swatches with a labelled native select containing Daily theme and seven palettes. Tightened footer grids, logo sizing, row padding and type contrast. Verified dropdown updates the active theme and returns to daily scheduling.

Visual QA at 1440x1000, 1920x1080 desktop, 820x1180 tablet, and 390x844 mobile: mesh stays within the viewport and centred; no horizontal overflow; footer uses compact responsive rows. TypeScript, all 12 tests, and production Webpack build pass. Screenshots saved in outputs/footer-compact-desktop.jpg, outputs/footer-compact-mobile.jpg, and outputs/mesh-tablet.jpg.
