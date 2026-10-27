"use client"

import { useEffect, useRef } from "react"

import { drawCube, logoFrame, restFrame } from "@/lib/cube"
import { onIntroReveal } from "@/lib/intro"
import { fitCanvas, prefersReducedMotion } from "@/lib/wire"

/**
 * The header mark: the same wireframe cube as the intro loader, looping the
 * same animation (rest → flat square → extrude → tumble → rest). The loop
 * starts when the page is revealed, so it picks up exactly where the
 * loader's cube came to rest.
 */
export function WireLogo({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const g = canvas?.getContext("2d")
    if (!canvas || !g) return

    const reduced = prefersReducedMotion()
    let ink = getComputedStyle(canvas).color
    let start = -1
    let raf = 0

    const draw = (now: number) => {
      const dpr = fitCanvas(canvas, 3)
      const { width: W, height: H } = canvas.getBoundingClientRect()
      g.setTransform(dpr, 0, 0, dpr, 0, 0)
      g.clearRect(0, 0, W, H)
      g.strokeStyle = ink
      g.lineWidth = 1.25
      const f =
        reduced || start < 0 ? restFrame : logoFrame((now - start) / 1000)
      drawCube(g, W / 2, H / 2, Math.min(W, H) * 0.47, f)
    }

    const loop = (now: number) => {
      draw(now)
      raf = requestAnimationFrame(loop)
    }

    draw(performance.now())
    const offReveal = reduced
      ? () => {}
      : onIntroReveal(() => {
          start = performance.now()
          raf = requestAnimationFrame(loop)
        })

    // Static (reduced motion) still needs redrawing on theme/size changes.
    const redraw = () => {
      ink = getComputedStyle(canvas).color
      if (reduced) draw(performance.now())
    }
    const mo = new MutationObserver(redraw)
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })
    window.addEventListener("resize", redraw)

    return () => {
      cancelAnimationFrame(raf)
      offReveal()
      mo.disconnect()
      window.removeEventListener("resize", redraw)
    }
  }, [])

  return <canvas ref={ref} aria-hidden className={className} />
}
