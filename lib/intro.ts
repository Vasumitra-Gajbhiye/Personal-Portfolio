// Coordinates the intro sequence between the loader, the ribbon and the
// hero text, via attributes on <html>:
//   data-intro       "play" until the page is revealed, then "done"
//   data-intro-mode  "full"  first visit this session: black loader plays
//                    "quick" returning visitor: no loader, short reveal
//                    "none"  reduced motion: everything visible at once

export const INTRO_EVENT = "intro:done"
export const INTRO_SEEN_KEY = "vg-intro-seen"

/**
 * Runs before first paint (inlined in <head>) so returning visitors never
 * see a flash of the black loader.
 */
export const introBootScript = `(function(){var d=document.documentElement;try{var r=window.matchMedia('(prefers-reduced-motion: reduce)').matches;var s=sessionStorage.getItem('${INTRO_SEEN_KEY}');if(r){d.dataset.introMode='none';d.dataset.intro='done';return;}d.dataset.introMode=s?'quick':'full';d.dataset.intro='play';if(!s){history.scrollRestoration='manual';window.scrollTo(0,0);}}catch(e){d.dataset.introMode='none';d.dataset.intro='done';}})();`

export type IntroMode = "full" | "quick" | "none"

export function introMode(): IntroMode {
  return (document.documentElement.dataset.introMode as IntroMode) ?? "none"
}

export function isRevealed() {
  return document.documentElement.dataset.intro === "done"
}

export function finishIntro() {
  if (isRevealed()) return
  document.documentElement.dataset.intro = "done"
  try {
    sessionStorage.setItem(INTRO_SEEN_KEY, "1")
  } catch {}
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
