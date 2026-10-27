// Tiny 3D helpers shared by the ribbon, the logo and the intro loader.

export type Vec3 = [number, number, number]

/** Rotate around X, then Y, then Z (radians). */
export function rotate(v: Vec3, ax: number, ay: number, az: number): Vec3 {
  let [x, y, z] = v
  const cx = Math.cos(ax)
  const sx = Math.sin(ax)
  ;[y, z] = [y * cx - z * sx, y * sx + z * cx]
  const cy = Math.cos(ay)
  const sy = Math.sin(ay)
  ;[x, z] = [x * cy + z * sy, -x * sy + z * cy]
  const cz = Math.cos(az)
  const sz = Math.sin(az)
  ;[x, y] = [x * cz - y * sz, x * sz + y * cz]
  return [x, y, z]
}

/** Perspective factor for a point at depth z, camera at distance d. */
export function persp(z: number, d: number) {
  return d / (d - z)
}

// A slightly stretched octahedron: the site's mark.
export const MARK_VERTS: Vec3[] = [
  [0, -1.25, 0],
  [1, 0, 0],
  [0, 0, 1],
  [-1, 0, 0],
  [0, 0, -1],
  [0, 1.25, 0],
]

export const MARK_EDGES: [number, number][] = [
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 1],
  [5, 1],
  [5, 2],
  [5, 3],
  [5, 4],
]

/**
 * Draw the wireframe mark. `progress` (0..1 per edge, staggered) lets the
 * loader draw the edges in one by one.
 */
export function drawMark(
  g: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  ax: number,
  ay: number,
  az: number,
  progress = 1
) {
  const pts = MARK_VERTS.map((v) => {
    const r = rotate(v, ax, ay, az)
    const f = persp(r[2], 6)
    return [cx + r[0] * size * f, cy + r[1] * size * f] as const
  })
  const n = MARK_EDGES.length
  g.beginPath()
  MARK_EDGES.forEach(([a, b], i) => {
    // Each edge starts a little after the previous one.
    const local = Math.min(1, Math.max(0, progress * (n * 0.5 + 1) - i * 0.5))
    if (local <= 0) return
    const [x1, y1] = pts[a]
    const [x2, y2] = pts[b]
    g.moveTo(x1, y1)
    g.lineTo(x1 + (x2 - x1) * local, y1 + (y2 - y1) * local)
  })
  g.stroke()
}

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t
export const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)
export const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

/** Size a canvas to its CSS box at device pixel ratio. Returns the ratio. */
export function fitCanvas(canvas: HTMLCanvasElement, maxDpr = 2) {
  const dpr = Math.min(window.devicePixelRatio || 1, maxDpr)
  const { width, height } = canvas.getBoundingClientRect()
  const w = Math.round(width * dpr)
  const h = Math.round(height * dpr)
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w
    canvas.height = h
  }
  return dpr
}

export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
}
