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

It's ~70 outlines of one square, each rotated a little further in 3D than the
last. The look is controlled by the "Shape parameters" block in
`ribbon-canvas.tsx`: `n` (line count), `twist`, `rx0/rx1/ry0/ry1` (tilt at
each end of the fan), `globalAlpha` (line darkness) and `base` (size).

### Project screenshots

Drop an image in `public/projects/` and set `image: "/projects/name.png"` on
that project in `lib/site.ts`. Without one, a generated cover is shown.

### Intro

The black loader plays once per browser session. Clear session storage (or
open a new tab) to see it again. Users with reduced motion get a static page.
Press `d` to toggle dark mode.
