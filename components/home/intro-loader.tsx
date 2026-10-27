"use client"

import { useEffect, useRef, useState } from "react"

import { finishIntro, introMode } from "@/lib/intro"
import { clamp, drawMark, easeInOutCubic, fitCanvas } from "@/lib/wire"

/**
 * Black screen, the wireframe mark draws itself in and turns, then the
 * screen fades to reveal the page. Plays once per browser session.
 */
export function IntroLoader() {
  const ref = useRef<HTMLCanvasElement>(null)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    const mode = introMode()
    if (mode !== "full") {
      // Returning visitor: skip the loader but still play the reveal.
      const id = requestAnimationFrame(() => {
        finishIntro()
        setGone(true)
      })
      return () => cancelAnimationFrame(id)
    }
    const canvas = ref.current
    const g = canvas?.getContext("2d")
    if (!canvas || !g) {
      finishIntro()
      return
    }

    const DRAW = 1100 // edges drawing in
    const HOLD = 1650 // page starts revealing (overlay fades via CSS)
    const END = 2500 // overlay removed
    const start = performance.now()
    let raf = 0
    let revealed = false
    document.documentElement.style.overflow = "hidden"

    const frame = (now: number) => {
      const t = now - start
      const dpr = fitCanvas(canvas)
      const { width: W, height: H } = canvas.getBoundingClientRect()
      g.setTransform(dpr, 0, 0, dpr, 0, 0)
      g.clearRect(0, 0, W, H)

      const progress = easeInOutCubic(clamp(t / DRAW))
      const spin = t / 1000
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
        progress
      )

      if (!revealed && t >= HOLD) {
        revealed = true
        document.documentElement.style.overflow = ""
        finishIntro()
      }
      if (t < END) raf = requestAnimationFrame(frame)
      else setGone(true)
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      document.documentElement.style.overflow = ""
      if (!revealed) finishIntro()
    }
  }, [])

  if (gone) return null

  return (
    <div className="intro-overlay fixed inset-0 z-[100] bg-black" aria-hidden>
      <canvas ref={ref} className="h-full w-full" />
    </div>
  )
}
