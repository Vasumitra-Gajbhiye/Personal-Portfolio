// The site mark: a "2.5D" wireframe cube.
//
// It isn't a real 3D cube. It's two identical squares (A = front, B = back),
// each with its own 2D position, rotation and scale, and four lines joining
// corner i of A to corner i of B. Moving the two squares independently fakes
// the cube turning in 3D.
//
// The header logo loops: rest (long hold) → both squares swing together
// into one flat square → depth grows back (near-front cube) → stepped
// tumble → rest … repeat

/** One square's placement. Units are the square's side length. */
type Sq = {
  x: number
  y: number
  /** rotation in degrees */
  r: number
  /** screen-space squash (1 = none), used for "seen from above" moments */
  sx: number
  sy: number
}
type Pose = { a: Sq; b: Sq }

const sq = (x: number, y: number, r: number, sx = 1, sy = 1): Sq => ({
  x,
  y,
  r,
  sx,
  sy,
})

// ---------------------------------------------------------------------------
// Key poses. A = front square, B = back square. y grows downward.

const FLAT: Pose = { a: sq(0, 0, 0), b: sq(0, 0, 0) }
const FRONT: Pose = { a: sq(-0.14, 0.14, 0), b: sq(0.14, -0.14, 0) }
/** Resting arrangement of the mark. */
export const REST: Pose = { a: sq(-0.2, 0.06, 36), b: sq(0.2, -0.06, 8) }

// Stepped tumble from FRONT to REST: [time (s), pose, ease into this pose]
type Ease = (t: number) => number
const linear: Ease = (t) => t
const easeOut: Ease = (t) => 1 - Math.pow(1 - t, 3)
const easeInOut: Ease = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

const TUMBLE_KEYS: [number, Pose, Ease][] = [
  [0, FRONT, linear],
  [0.08, { a: sq(-0.12, 0.13, 14), b: sq(0.12, -0.13, 16) }, easeOut],
  [0.16, { a: sq(-0.16, 0.2, 42), b: sq(0.14, -0.16, 14) }, easeInOut],
  // first stop: the squares pull apart, then drift slowly
  [0.4, { a: sq(-0.24, 0.28, 40), b: sq(0.16, -0.22, -20) }, easeOut],
  [0.62, { a: sq(-0.26, 0.3, 44), b: sq(0.18, -0.24, -16) }, linear],
  // quick turn: front square upright, back square a diamond
  [0.8, { a: sq(-0.2, 0.24, 0), b: sq(0.2, -0.2, 45) }, easeInOut],
  // second stop, seen from above (lightly squashed), drifts slowly
  [
    1.0,
    { a: sq(-0.3, 0.06, 28, 1, 0.72), b: sq(0.26, -0.02, 3, 1, 0.72) },
    easeInOut,
  ],
  [
    1.3,
    { a: sq(-0.32, 0.07, 32, 1, 0.74), b: sq(0.28, -0.03, 6, 1, 0.74) },
    linear,
  ],
  // swing home
  [1.6, { a: sq(-0.12, -0.14, 40), b: sq(0.14, 0.12, 20) }, easeInOut],
  [2.1, REST, easeInOut],
]
const TUMBLE = TUMBLE_KEYS[TUMBLE_KEYS.length - 1][0]

function lerpSq(p: Sq, q: Sq, t: number): Sq {
  return {
    x: p.x + (q.x - p.x) * t,
    y: p.y + (q.y - p.y) * t,
    r: p.r + (q.r - p.r) * t,
    sx: p.sx + (q.sx - p.sx) * t,
    sy: p.sy + (q.sy - p.sy) * t,
  }
}
function lerpPose(p: Pose, q: Pose, t: number): Pose {
  return { a: lerpSq(p.a, q.a, t), b: lerpSq(p.b, q.b, t) }
}
const clamp01 = (t: number) => Math.min(1, Math.max(0, t))

function tumble(t: number): Pose {
  for (let i = 1; i < TUMBLE_KEYS.length; i++) {
    const [t0, p0] = TUMBLE_KEYS[i - 1]
    const [t1, p1, ease] = TUMBLE_KEYS[i]
    if (t <= t1) return lerpPose(p0, p1, ease(clamp01((t - t0) / (t1 - t0))))
  }
  return REST
}

export type CubeFrame = { pose: Pose }

// ---------------------------------------------------------------------------
// Header logo loop (seconds since it started; starts at rest)

const G_REST = 6.6 // hold at rest
const G_SWING = 0.25 // both squares swing into one flat square
const G_SQUARE = 0.6 // flat square holds
const G_EXTRUDE = 0.17 // depth grows back into the near-front cube
const G_FRONT = 0.45 // near-front holds
export const LOGO_PERIOD =
  G_REST + G_SWING + G_SQUARE + G_EXTRUDE + G_FRONT + TUMBLE

export function logoFrame(time: number): CubeFrame {
  let t = time % LOGO_PERIOD
  if (t < G_REST) return { pose: REST }
  t -= G_REST
  if (t < G_SWING) return { pose: lerpPose(REST, FLAT, easeInOut(t / G_SWING)) }
  t -= G_SWING
  if (t < G_SQUARE) return { pose: FLAT }
  t -= G_SQUARE
  if (t < G_EXTRUDE)
    return { pose: lerpPose(FLAT, FRONT, easeOut(t / G_EXTRUDE)) }
  t -= G_EXTRUDE
  if (t < G_FRONT) return { pose: FRONT }
  t -= G_FRONT
  return { pose: tumble(t) }
}

export const restFrame: CubeFrame = { pose: REST }

// ---------------------------------------------------------------------------
// Drawing

// Corners of a unit square, starting top-left, clockwise.
const CORNERS = [
  [-0.5, -0.5],
  [0.5, -0.5],
  [0.5, 0.5],
  [-0.5, 0.5],
]

function corners(s: Sq, cx: number, cy: number, side: number) {
  const c = Math.cos((s.r * Math.PI) / 180)
  const n = Math.sin((s.r * Math.PI) / 180)
  return CORNERS.map(([x, y]) => {
    const rx = (x * c - y * n) * s.sx
    const ry = (x * n + y * c) * s.sy
    return [cx + (rx + s.x) * side, cy + (ry + s.y) * side] as const
  })
}

/**
 * Draws one frame. `side` is the square's side length in px; the drawing is
 * centred on (cx, cy). Stroke colour / width come from the context.
 */
export function drawCube(
  g: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  side: number,
  f: CubeFrame
) {
  const A = corners(f.pose.a, cx, cy, side)
  const B = corners(f.pose.b, cx, cy, side)
  g.lineJoin = "miter"
  g.lineCap = "butt"
  g.beginPath()

  for (const P of [B, A]) {
    P.forEach(([x, y], k) => (k ? g.lineTo(x, y) : g.moveTo(x, y)))
    g.closePath()
  }
  for (let i = 0; i < 4; i++) {
    g.moveTo(A[i][0], A[i][1])
    g.lineTo(B[i][0], B[i][1])
  }
  g.stroke()
}
