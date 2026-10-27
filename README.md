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
| Header + menu + rotating mark | `components/home/site-header.tsx`, `wire-logo.tsx` |
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

### Intro

The black loader plays on every page load and stays up for at least ~1.9s
(and until fonts are ready), however fast the page loads. With reduced
motion it shows a still mark instead of the animation. Press `d` to toggle
dark mode.

### Header

The header is fixed. Once the dark "Selected work" section reaches it, it
shrinks and the "Projects" / "Say hello" links fade out; scrolling back up
restores it.
