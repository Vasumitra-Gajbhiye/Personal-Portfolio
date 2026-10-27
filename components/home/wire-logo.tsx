"use client"

import { useEffect, useRef } from "react"

import { drawMark, fitCanvas, lerp, prefersReducedMotion } from "@/lib/wire"

/** The header mark: a small wireframe octahedron that turns with time and scroll. */
export function WireLogo({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const g = canvas?.getContext("2d")
    if (!canvas || !g) return
    const reduced = prefersReducedMotion()
    let raf = 0
    let scroll = 0
    let ink = getComputedStyle(canvas).color
    const mo = new MutationObserver(() => {
      ink = getComputedStyle(canvas).color
    })
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })
    const t0 = performance.now()

    const frame = (now: number) => {
      const dpr = fitCanvas(canvas, 3)
      const { width: W, height: H } = canvas.getBoundingClientRect()
      g.setTransform(dpr, 0, 0, dpr, 0, 0)
      g.clearRect(0, 0, W, H)
      scroll = lerp(scroll, window.scrollY / 400, 0.1)
      const t = reduced ? 0 : (now - t0) / 1000
      g.strokeStyle = ink
      g.lineWidth = 1
      g.lineJoin = "round"
      drawMark(
        g,
        W / 2,
        H / 2,
        Math.min(W, H) * 0.34,
        0.45 + t * 0.35,
        t * 0.6 + scroll,
        0.3
      )
      if (!reduced) raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => {
      cancelAnimationFrame(raf)
      mo.disconnect()
    }
  }, [])

  return <canvas ref={ref} aria-hidden className={className} />
}
