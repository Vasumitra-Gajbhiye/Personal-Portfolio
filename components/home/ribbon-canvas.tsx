"use client"

import { useEffect, useRef } from "react"

import {
  clamp,
  easeInOutCubic,
  fitCanvas,
  lerp,
  persp,
  prefersReducedMotion,
  rotate,
  type Vec3,
} from "@/lib/wire"
import { introMode, onIntroReveal } from "@/lib/intro"
import { cn } from "@/lib/utils"

/**
 * The "silk ribbon": ~70 outlines of one square, each rotated a little further
 * in 3D than the last. Where the edges bunch up you get the dark curved spine.
 *
 * Inputs that shape it every frame:
 *   spread  0..1  intro: all copies start stacked (one square), then fan out
 *   scroll  0..n  page scroll in viewport heights: grows, twists, re-centres
 *   time          slow idle drift so it never looks frozen
 *   pointer       a few degrees of tilt toward the cursor
 */

const DEG = Math.PI / 180
const SQUARE: Vec3[] = [
  [-1, -1, 0],
  [1, -1, 0],
  [1, 1, 0],
  [-1, 1, 0],
]

type Mode = "hero" | "inline"

export function RibbonCanvas({
  mode = "hero",
  className,
}: {
  mode?: Mode
  className?: string
}) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const g = canvas.getContext("2d")
    if (!g) return

    const reduced = prefersReducedMotion()
    let raf = 0
    let running = true
    let ink = getComputedStyle(canvas).color

    // Intro spread animation.
    let spread = mode === "inline" || reduced ? 1 : 0
    let spreadStart = -1
    const quickIntro = introMode() === "quick"
    const offIntro =
      mode === "hero" && !reduced
        ? onIntroReveal(() => {
            spreadStart = performance.now()
          })
        : () => {}

    // Smoothed scroll + pointer.
    let scroll = 0
    let px = 0
    let py = 0
    let tx = 0
    let ty = 0
    const onPointer = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth) * 2 - 1
      ty = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener("pointermove", onPointer, { passive: true })

    // Re-read the stroke colour when the theme class changes.
    const mo = new MutationObserver(() => {
      ink = getComputedStyle(canvas).color
    })
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    const work = mode === "hero" ? document.getElementById("work") : null
    const t0 = performance.now()

    const frame = (now: number) => {
      if (!running) return
      raf = requestAnimationFrame(frame)

      const vw = window.innerWidth
      const vh = window.innerHeight

      // Skip drawing while an opaque section fully covers the fixed canvas.
      if (work && work.getBoundingClientRect().top <= 0) return

      const dpr = fitCanvas(canvas)
      const rect = canvas.getBoundingClientRect()
      const W = rect.width
      const H = rect.height
      const mobile = vw < 768
      const time = reduced ? 0 : (now - t0) / 1000

      // Intro
      if (spreadStart >= 0 && spread < 1) {
        const dur = quickIntro ? 1100 : 1700
        spread = easeInOutCubic(clamp((now - spreadStart) / dur))
      }

      // Scroll (in viewport heights), eased toward the real value.
      let target: number
      if (mode === "hero") {
        target = window.scrollY / vh
      } else {
        // 0 when the section enters from below, ~1 when it reaches the top.
        target = clamp(1 - rect.top / vh, 0, 2)
      }
      scroll = reduced ? target : lerp(scroll, target, 0.12)
      px = lerp(px, tx, 0.05)
      py = lerp(py, ty, 0.05)

      const s = clamp(scroll, 0, 2.2)
      const e = spread

      // Where the ribbon sits and how big it is.
      let cx: number
      let cy: number
      let size: number
      if (mode === "hero") {
        const heroX = mobile ? 0.5 : 0.52
        const heroY = mobile ? 0.3 : 0.47
        // Before the intro finishes it starts dead centre.
        cx = W * lerp(0.5, lerp(heroX, 0.5, clamp(s)), e)
        cy = H * lerp(0.5, lerp(heroY, 0.52, clamp(s)), e)
        const base = mobile
          ? Math.min(W * 0.26, H * 0.17)
          : Math.min(W * 0.125, H * 0.21)
        const grow =
          1 + easeInOutCubic(clamp(s / 1.4)) * 1.5 + Math.max(0, s - 1.4) * 0.35
        size = base * lerp(0.62, 1, e) * grow
      } else {
        cx = W * (mobile ? 0.5 : 0.7)
        cy = H * 0.5
        size = Math.min(W, H) * (mobile ? 0.3 : 0.26) * (1 + s * 0.25)
      }

      // Shape parameters (degrees). These were tuned against the reference.
      const n = mobile ? 52 : 68
      const twist = 60 + s * 38 // total Z rotation across all copies
      const rx0 = 50 + Math.sin(time * 0.23) * 7 + py * 4
      const rx1 = 5 - s * 20
      const ry0 = 10 + Math.cos(time * 0.19) * 8 + px * 5
      const ry1 = -30 - s * 15 + Math.sin(time * 0.17) * 6
      const rzBase = -8 + time * 1.6 + s * 32 + (mode === "inline" ? 40 : 0)
      const s1 = 1.2 + s * 0.12

      g.setTransform(dpr, 0, 0, dpr, 0, 0)
      g.clearRect(0, 0, W, H)
      g.strokeStyle = ink
      g.lineWidth = mobile ? 0.55 : 0.6
      const fade = mode === "hero" ? lerp(1, 0.55, clamp((s - 1) / 1)) : 1
      const d = 1400

      for (let i = 0; i < n; i++) {
        // e squeezes every copy onto the first one during the intro.
        const t = (i / (n - 1)) * e
        const sc = lerp(1, s1, t) * size
        const ax = lerp(lerp(0, rx0, e), rx1, t) * DEG
        const ay = lerp(lerp(0, ry0, e), ry1, t) * DEG
        const az = (lerp(0, rzBase, e) + t * twist) * DEG
        // Slightly lighter toward the ends of the fan.
        g.globalAlpha =
          0.17 * fade * (0.6 + 0.4 * Math.sin(Math.PI * (i / (n - 1))))
        if (e < 0.05) g.globalAlpha = i === 0 ? 0.9 : 0
        g.beginPath()
        for (let k = 0; k < 4; k++) {
          const v = SQUARE[k]
          const [x, y, z] = rotate([v[0] * sc, v[1] * sc, 0], ax, ay, az)
          const f = persp(z, d)
          const X = cx + x * f
          const Y = cy + y * f
          if (k === 0) g.moveTo(X, Y)
          else g.lineTo(X, Y)
        }
        g.closePath()
        g.stroke()
      }
      g.globalAlpha = 1

      if (reduced && spread >= 1) {
        // One static frame is enough.
        running = false
      }
    }
    raf = requestAnimationFrame(frame)

    const onResize = () => {
      if (reduced) {
        running = true
        cancelAnimationFrame(raf)
        raf = requestAnimationFrame(frame)
      }
    }
    window.addEventListener("resize", onResize)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      offIntro()
      mo.disconnect()
      window.removeEventListener("pointermove", onPointer)
      window.removeEventListener("resize", onResize)
    }
  }, [mode])

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={cn(
        mode === "hero"
          ? "pointer-events-none fixed inset-0 z-0 h-svh w-full text-ribbon"
          : "pointer-events-none absolute inset-0 h-full w-full text-white",
        className
      )}
    />
  )
}
