import type { CSSProperties, ReactNode } from "react"

import { cn } from "@/lib/utils"

/**
 * Masked slide-up reveal that plays when the intro finishes
 * (driven by html[data-intro="done"] in globals.css).
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = "span",
}: {
  children: ReactNode
  delay?: number
  className?: string
  as?: "span" | "div"
}) {
  return (
    <Tag className={cn("reveal", className)}>
      <span
        className="reveal-inner"
        style={{ "--d": `${delay}ms` } as CSSProperties}
      >
        {children}
      </span>
    </Tag>
  )
}

/** Fade + lift, same trigger as Reveal. */
export function FadeIn({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  return (
    <div
      className={cn("fade-in", className)}
      style={{ "--d": `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  )
}
