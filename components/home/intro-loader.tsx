"use client"

import { useEffect, useRef, useState } from "react"

import { finishIntro, introMode } from "@/lib/intro"
import { clamp, drawMark, easeInOutCubic, fitCanvas } from "@/lib/wire"

/**
 * Black screen, the wireframe mark draws itself in and turns, then the
 * screen fades to reveal the page. Plays on every page load and always runs
 * for at least MIN_SHOW ms, even when the page is already loaded. It also
 * waits for fonts so the reveal never happens half-styled.
 */
const DRAW = 1100 // edges drawing in
const MIN_SHOW = 1900 // earliest moment the page can reveal
const MAX_WAIT = 4500 // reveal anyway if fonts hang
const FADE = 800 // overlay fade-out (matches CSS)

export function IntroLoader() {
  const ref = useRef<HTMLCanvasElement>(null)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    const canvas = ref.current
    const g = canvas?.getContext("2d")
    if (!canvas || !g) {
      finishIntro()
      return
    }
    const still = introMode() === "reduced"
    const start = performance.now()
    let raf = 0
    let revealAt = -1
    let fontsReady = false
    document.fonts?.ready.then(() => (fontsReady = true))
    if (!document.fonts) fontsReady = true
    document.documentElement.style.overflow = "hidden"

    const frame = (now: number) => {
      const t = now - start
      const dpr = fitCanvas(canvas)
      const { width: W, height: H } = canvas.getBoundingClientRect()
      g.setTransform(dpr, 0, 0, dpr, 0, 0)
      g.clearRect(0, 0, W, H)

      const spin = still ? 0.6 : t / 1000
      g.strokeStyle = "rgba(255,255,255,0.95)"
      g.lineWidth = 1.25
      g.lineJoin = "round"
      drawMark(
        g,
        W / 2,
        H / 2,
        Math.max(18, Math.min(W, H) * 0.035),
        0.5 + spin * 0.9,
        spin * 1.6,
        0.25 + spin * 0.4,
        still ? 1 : easeInOutCubic(clamp(t / DRAW))
      )

      if (revealAt < 0 && t >= MIN_SHOW && (fontsReady || t >= MAX_WAIT)) {
        revealAt = t
        document.documentElement.style.overflow = ""
        finishIntro()
      }
      if (revealAt >= 0 && t > revealAt + FADE + 100) {
        setGone(true)
        return
      }
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      document.documentElement.style.overflow = ""
      finishIntro()
    }
  }, [])

  if (gone) return null

  return (
    <div className="intro-overlay fixed inset-0 z-[100] bg-black" aria-hidden>
      <canvas ref={ref} className="h-full w-full" />
    </div>
  )
}
