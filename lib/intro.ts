// Starts the page's entrance (masked text reveals, ribbon fan-out, header
// logo loop) via an attribute on <html>:
//   data-intro  "play" on first paint (everything in its start state),
//               then "done" a frame later so the CSS transitions run

export const INTRO_EVENT = "intro:done"

/**
 * Runs before first paint (inlined in <head>): paint the start state once,
 * then flip to "done" so the entrance animates in straight away.
 */
export const introBootScript = `(function(){var d=document.documentElement;d.dataset.intro='play';requestAnimationFrame(function(){requestAnimationFrame(function(){d.dataset.intro='done';window.dispatchEvent(new Event('${INTRO_EVENT}'));});});})();`

export function isRevealed() {
  return document.documentElement.dataset.intro === "done"
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
