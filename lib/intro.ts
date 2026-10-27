// Coordinates the intro sequence between the loader, the ribbon and the
// hero text, via attributes on <html>:
//   data-intro       "play" while the black loader is up, then "done"
//   data-intro-mode  "full"    normal: animated loader on every page load
//                    "reduced" prefers-reduced-motion: still loader, no motion

export const INTRO_EVENT = "intro:done"

/**
 * Runs before first paint (inlined in <head>): always start on the loader
 * and at the top of the page, however fast the page loaded.
 */
export const introBootScript = `(function(){var d=document.documentElement;var r=false;try{r=window.matchMedia('(prefers-reduced-motion: reduce)').matches;}catch(e){}d.dataset.introMode=r?'reduced':'full';d.dataset.intro='play';try{history.scrollRestoration='manual';}catch(e){}window.scrollTo(0,0);})();`

export type IntroMode = "full" | "reduced"

export function introMode(): IntroMode {
  return document.documentElement.dataset.introMode === "reduced"
    ? "reduced"
    : "full"
}

export function isRevealed() {
  return document.documentElement.dataset.intro === "done"
}

export function finishIntro() {
  if (isRevealed()) return
  document.documentElement.dataset.intro = "done"
  window.dispatchEvent(new Event(INTRO_EVENT))
}

/** Calls `cb` once the page is revealed (immediately if already revealed). */
export function onIntroReveal(cb: () => void) {
  if (isRevealed()) {
    cb()
    return () => {}
  }
  window.addEventListener(INTRO_EVENT, cb, { once: true })
  return () => window.removeEventListener(INTRO_EVENT, cb)
}
