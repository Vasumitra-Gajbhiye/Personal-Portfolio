"use client"

import { useEffect, useRef } from "react"

import { drawMark, fitCanvas } from "@/lib/wire"

/** The header mark: a static wireframe octahedron, drawn crisp at any DPR. */
export function WireLogo({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const g = canvas?.getContext("2d")
    if (!canvas || !g) return

    const draw = () => {
      const dpr = fitCanvas(canvas, 3)
      const { width: W, height: H } = canvas.getBoundingClientRect()
      g.setTransform(dpr, 0, 0, dpr, 0, 0)
      g.clearRect(0, 0, W, H)
      g.strokeStyle = getComputedStyle(canvas).color
      g.lineWidth = 1
      g.lineJoin = "round"
      drawMark(g, W / 2, H / 2, Math.min(W, H) * 0.34, 0.62, 0.55, 0.3)
    }
    draw()

    // Redraw only when the theme or size changes.
    const mo = new MutationObserver(draw)
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })
    window.addEventListener("resize", draw)
    return () => {
      mo.disconnect()
      window.removeEventListener("resize", draw)
    }
  }, [])

  return <canvas ref={ref} aria-hidden className={className} />
}
