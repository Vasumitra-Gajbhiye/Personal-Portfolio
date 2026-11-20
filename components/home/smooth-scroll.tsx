"use client"

import { useEffect } from "react"
import Lenis from "lenis"

import { prefersReducedMotion } from "@/lib/wire"

/** Lenis smooth scrolling (off for reduced motion). Anchor links are eased too. */
export function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return
    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.09,
      anchors: { offset: 0 },
    })
    return () => lenis.destroy()
  }, [])
  return null
}
