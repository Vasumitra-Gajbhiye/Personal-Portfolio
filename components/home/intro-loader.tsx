"use client"

import { useEffect, useRef, useState } from "react"

import { drawCube, LOADER_REST_AT, loaderFrame, restFrame } from "@/lib/cube"
import { finishIntro, introMode } from "@/lib/intro"
import { fitCanvas } from "@/lib/wire"

/**
 * Black screen: the wireframe cube draws itself in (corner brackets + depth
 * lines), snaps whole, tumbles and comes to rest, then the screen fades to
 * reveal the page. Plays on every page load and always runs to the end, even
 * when the page is already loaded. It also waits for fonts so the reveal
 * never happens half-styled.
 */
const MIN_SHOW = LOADER_REST_AT * 1000 + 150 // cube settles, brief beat
const STILL_SHOW = 1400 // reduced motion: still cube on black
const MAX_WAIT = 6000 // reveal anyway if fonts hang
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
    const minShow = still ? STILL_SHOW : MIN_SHOW
    const start = performance.now()
    let raf = 0
    let revealAt = -1
    let fontsReady = !document.fonts
    document.fonts?.ready.then(() => (fontsReady = true))
    document.documentElement.style.overflow = "hidden"

    const frame = (now: number) => {
      const t = now - start
      const dpr = fitCanvas(canvas)
      const { width: W, height: H } = canvas.getBoundingClientRect()
      g.setTransform(dpr, 0, 0, dpr, 0, 0)
      g.clearRect(0, 0, W, H)

      const side = Math.min(64, Math.max(40, Math.min(W, H) * 0.058))
      const f = still ? restFrame : loaderFrame(t / 1000)
      // Like the reference, the cube drops out as soon as the screen
      // starts fading, so only the ribbon's square shows through the grey.
      const cubeAlpha = revealAt < 0 ? 1 : 1 - Math.min(1, (t - revealAt) / 120)
      if (f && cubeAlpha > 0) {
        g.globalAlpha = cubeAlpha
        g.strokeStyle = "#fff"
        g.lineWidth = Math.max(2, side * 0.048)
        drawCube(g, W / 2, H / 2, side, f)
        g.globalAlpha = 1
      }

      if (revealAt < 0 && t >= minShow && (fontsReady || t >= MAX_WAIT)) {
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
