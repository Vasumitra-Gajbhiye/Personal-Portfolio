# vasumitragajbhiye.com

Next.js 16 · Tailwind css 4 · shadcn/ui · Lenis

```bash
npm install
npm run dev
```

## Home page

| What | Where |
| --- | --- |
| All copy, links and projects | `lib/site.ts` |
| Line-ribbon (hero + dark section) | `components/home/ribbon-canvas.tsx` |
| Intro loader (black screen, wireframe mark) | `components/home/intro-loader.tsx` |
| Header + menu + animated cube mark | `components/home/site-header.tsx`, `wire-logo.tsx` |
| Cube mark animation (loader + logo) | `lib/cube.ts` |
| Hero, CTA tiles, project card | `components/home/hero.tsx`, `project-card.tsx` |
| Pinned "Who I am" statement | `components/home/statement.tsx` |
| Dark work / contact / footer | `components/home/work-section.tsx` |
| Colours, type sizes, reveal animations | bottom of `app/globals.css` |

### Tweaking the ribbon

It's one square drawn ~64 times, each copy rotated a bit further around a
single 3D axis, so the copies trace a swept sheet. Both the square's
orientation and that axis wander slowly over time (`pose()` in
`ribbon-canvas.tsx`), which is what makes it morph between a curled page, a
fan of pages and a petal. The cursor tilts it slightly and moving the cursor
speeds up the morph. Knobs: `n` (line count), `sweep` (how far the copies
fan), the `tilt` range (petal ↔ page-sweep), `globalAlpha` (line darkness),
`base` (size).

### Project screenshots

Drop an image in `public/projects/` and set `image: "/projects/name.png"` on
that project in `lib/site.ts`. Without one, a generated cover is shown.

### Intro and the cube mark

The mark is a "2.5D" wireframe cube: two identical squares, each with its own
position, rotation and squash, plus four lines joining their corners. One
timeline in `lib/cube.ts` drives both:

- **Loader** (black screen, every page load): corner brackets and depth lines
  draw in → the cube snaps whole → stepped tumble → rest → the screen fades.
  It always runs to the end (~3.3s) and waits for fonts. With reduced motion it
  shows the cube still.
- **Header logo**: the same cube, looping rest → flat square → extrude →
  tumble → rest (~10s). It starts when the loader finishes, so it picks up
  where the loader's cube came to rest.

`REST` is the resting arrangement; `TUMBLE_KEYS` are the tumble keyframes.
Press `d` to toggle dark mode.

### Header

The header is fixed. Once the dark "Selected work" section reaches it, it
shrinks and the "Projects" / "Say hello" links fade out; scrolling back up
restores it.
