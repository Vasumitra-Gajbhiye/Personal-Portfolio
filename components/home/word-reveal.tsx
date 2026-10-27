"use client"

import {
  Fragment,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react"

import { cn } from "@/lib/utils"

/** Splits text into words that slide up, one after another, when scrolled into view. */
export function WordReveal({
  text,
  className,
  startIndex = 0,
}: {
  text: string
  className?: string
  /** Offset the stagger so several WordReveals can chain. */
  startIndex?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -15% 0px" }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const words = text.split(" ")
  return (
    <span
      ref={ref}
      className={cn("word-reveal", className)}
      data-in={inView || undefined}
    >
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="word">
            <span style={{ "--i": startIndex + i } as CSSProperties}>{w}</span>
          </span>{" "}
        </Fragment>
      ))}
    </span>
  )
}
