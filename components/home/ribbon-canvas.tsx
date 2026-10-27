"use client"

import { useEffect, useRef } from "react"

import { onIntroReveal } from "@/lib/intro"
import { cn } from "@/lib/utils"
import {
  clamp,
  easeInOutCubic,
  fitCanvas,
  lerp,
  prefersReducedMotion,
} from "@/lib/wire"

/**
 * The "silk ribbon".
 *
 * One square, drawn ~64 times. Each copy is the same square rotated a little
 * further around a single 3D axis, so together they trace a swept sheet and
 * the edges bunch up into dark curved spines.
 *
 * What makes it feel alive is that nothing is fixed:
 *   - the square's own orientation slowly wanders (base)
 *   - the sweep axis wanders too, measured in the square's own frame, so the
 *     sheet morphs between a curled page, a fan of book pages and a petal
 *   - the cursor tilts the whole thing a little and, when it moves, nudges
 *     the morph forward
 *   - scroll grows it, opens the sweep wider and re-centres it
 *   - the intro starts with every copy stacked (one square) and fans it out
 */

type Mat3 = number[]
const DEG = Math.PI / 180
const SQUARE = [
  [-1, -1],
  [1, -1],
  [1, 1],
  [-1, 1],
]

function mul(a: Mat3, b: Mat3): Mat3 {
  const r = new Array(9)
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++)
      r[i * 3 + j] =
        a[i * 3] * b[j] + a[i * 3 + 1] * b[3 + j] + a[i * 3 + 2] * b[6 + j]
  return r
}

function euler(ax: number, ay: number, az: number): Mat3 {
  const cx = Math.cos(ax)
  const sx = Math.sin(ax)
  const cy = Math.cos(ay)
  const sy = Math.sin(ay)
  const cz = Math.cos(az)
  const sz = Math.sin(az)
  const rx = [1, 0, 0, 0, cx, -sx, 0, sx, cx]
  const ry = [cy, 0, sy, 0, 1, 0, -sy, 0, cy]
  const rz = [cz, -sz, 0, sz, cz, 0, 0, 0, 1]
  return mul(rz, mul(ry, rx))
}

/** Rotation by angle `a` around unit axis `u` (Rodrigues). */
function axisAngle(u: number[], a: number): Mat3 {
  const [x, y, z] = u
  const c = Math.cos(a)
  const s = Math.sin(a)
  const t = 1 - c
  return [
    t * x * x + c,
    t * x * y - s * z,
    t * x * z + s * y,
    t * x * y + s * z,
    t * y * y + c,
    t * y * z - s * x,
    t * x * z - s * y,
    t * y * z + s * x,
    t * z * z + c,
  ]
}

/** Shape state at time T (seconds of "morph time"). */
function pose(T: number) {
  const base = euler(
    0.75 * Math.sin(0.11 * T) + 0.3 * Math.sin(0.047 * T + 1),
    0.8 * Math.sin(0.083 * T + 2) + 0.3 * Math.sin(0.031 * T),
    0.09 * T + 0.4 * Math.sin(0.06 * T)
  )
  // Sweep axis in the square's frame: 38°–86° away from its normal.
  // Near the normal you get a petal/fan, near the plane you get page sweeps.
  const tilt = (62 + 24 * Math.sin(0.067 * T + 0.5)) * DEG
  const phi = 0.13 * T + 0.8 * Math.sin(0.05 * T)
  const axis = [
    Math.sin(tilt) * Math.cos(phi),
    Math.sin(tilt) * Math.sin(phi),
    Math.cos(tilt),
  ]
  const sweep = (100 + 15 * Math.sin(0.09 * T)) * DEG
  return { base, axis, sweep }
}

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

    // Intro: 0 = all copies stacked into one square, 1 = fully fanned out.
    let spread = mode === "inline" || reduced ? 1 : 0
    let spreadStart = -1
    const offIntro =
      mode === "hero" && !reduced
        ? onIntroReveal(() => {
            spreadStart = performance.now() + 250
          })
        : () => {}

    // Pointer: position for tilt, speed for nudging the morph.
    let tx = 0
    let ty = 0
    let px = 0
    let py = 0
    let lastX = 0
    let lastY = 0
    let seen = false
    let energy = 0
    const onPointer = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1
      const ny = (e.clientY / window.innerHeight) * 2 - 1
      if (seen) energy += Math.hypot(nx - lastX, ny - lastY)
      seen = true
      lastX = nx
      lastY = ny
      tx = nx
      ty = ny
    }
    window.addEventListener("pointermove", onPointer, { passive: true })

    const mo = new MutationObserver(() => {
      ink = getComputedStyle(canvas).color
    })
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    const work = mode === "hero" ? document.getElementById("work") : null
    // Start on a petal-like pose (hero) / a sheet-like pose (dark section).
    let morph = mode === "hero" ? 15 : 31
    let last = performance.now()
    let scroll = 0

    const frame = (now: number) => {
      if (!running) return
      raf = requestAnimationFrame(frame)
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now

      // Skip drawing while the opaque dark section covers the fixed canvas.
      if (work && work.getBoundingClientRect().top <= 0) return

      const dpr = fitCanvas(canvas)
      const rect = canvas.getBoundingClientRect()
      const W = rect.width
      const H = rect.height
      const vh = window.innerHeight
      const mobile = window.innerWidth < 768

      if (spreadStart >= 0 && spread < 1) {
        spread = easeInOutCubic(clamp((now - spreadStart) / 1500))
      }

      // Time: steady drift, plus a push when the cursor moves.
      energy *= Math.pow(0.04, dt) // decays within ~a second
      if (!reduced) morph += dt * (0.85 + Math.min(energy, 1.5) * 1.6)

      const target =
        mode === "hero" ? window.scrollY / vh : clamp(1 - rect.top / vh, 0, 2)
      scroll = reduced ? target : lerp(scroll, target, 0.1)
      px = lerp(px, tx, 0.035)
      py = lerp(py, ty, 0.035)
      const s = clamp(scroll, 0, 2.2)
      const e = spread

      // Placement
      let cx: number
      let cy: number
      let size: number
      if (mode === "hero") {
        const heroX = mobile ? 0.5 : 0.51
        const heroY = mobile ? 0.32 : 0.53
        cx = W * lerp(heroX, 0.5, clamp(s))
        cy = H * lerp(heroY, 0.5, clamp(s))
        const base = mobile
          ? Math.min(W * 0.24, H * 0.15)
          : Math.min(W * 0.13, H * 0.22)
        const grow =
          1 + easeInOutCubic(clamp(s / 1.4)) * 1.3 + Math.max(0, s - 1.4) * 0.3
        size = base * grow
      } else {
        cx = W * (mobile ? 0.55 : 0.68)
        cy = H * 0.5
        size = Math.min(W, H) * (mobile ? 0.26 : 0.24) * (1 + s * 0.2)
      }

      const { base, axis, sweep } = pose(morph)
      // Cursor tilt (a few degrees toward the pointer) applied in world space.
      const tilt = euler(py * 0.22, -px * 0.28, 0)
      const world = mul(tilt, base)
      const total = (sweep + s * 25 * DEG) * e

      const n = mobile ? 52 : 64
      const d = size * 4 // camera distance relative to size keeps perspective constant
      const fade = mode === "hero" ? lerp(1, 0.6, clamp(s - 1)) : 1

      g.setTransform(dpr, 0, 0, dpr, 0, 0)
      g.clearRect(0, 0, W, H)
      g.strokeStyle = ink
      g.lineWidth = 0.75
      g.lineJoin = "miter"

      for (let i = 0; i < n; i++) {
        const R = mul(world, axisAngle(axis, (total * i) / (n - 1)))
        // While still stacked, show one crisp square instead of 64 on top.
        if (e < 0.04) g.globalAlpha = i === 0 ? 0.85 : 0
        else g.globalAlpha = 0.13 * fade
        g.beginPath()
        for (let k = 0; k < 4; k++) {
          const vx = SQUARE[k][0] * size
          const vy = SQUARE[k][1] * size
          const x = R[0] * vx + R[1] * vy
          const y = R[3] * vx + R[4] * vy
          const z = R[6] * vx + R[7] * vy
          const f = d / (d - z)
          if (k === 0) g.moveTo(cx + x * f, cy + y * f)
          else g.lineTo(cx + x * f, cy + y * f)
        }
        g.closePath()
        g.stroke()
      }
      g.globalAlpha = 1

      if (reduced) running = false // one static frame
    }
    raf = requestAnimationFrame(frame)

    const onResize = () => {
      if (!reduced) return
      running = true
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(frame)
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
