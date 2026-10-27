"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowUpRight, Plus } from "lucide-react"

import { projects, site } from "@/lib/site"
import { cn } from "@/lib/utils"
import { WireLogo } from "./wire-logo"
import { Reveal } from "./reveal"

const menuLinks = [
  { label: "Home", href: "#top" },
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Contact", href: "#contact" },
]

const external = [
  { label: "GitHub", href: site.links.github },
  { label: "LinkedIn", href: site.links.linkedin },
  { label: "Email", href: `mailto:${site.email}` },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const compact = useCompact()
  const panel = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    const onDown = (e: PointerEvent) => {
      if (panel.current && !panel.current.contains(e.target as Node))
        setOpen(false)
    }
    window.addEventListener("keydown", onKey)
    window.addEventListener("pointerdown", onDown)
    return () => {
      window.removeEventListener("keydown", onKey)
      window.removeEventListener("pointerdown", onDown)
    }
  }, [open])

  return (
    <header
      data-compact={compact || undefined}
      className="site-header group/header fixed inset-x-0 top-0 z-40 border-b border-line bg-paper text-ink"
    >
      <div className="flex h-full">
        {/* Mark + name + tagline */}
        <a
          href="#top"
          className="header-pad flex shrink-0 items-start gap-3 px-4 pt-4 group-data-[compact]/header:pt-2.5 md:w-[9.5%] md:px-6 md:pt-5 md:group-data-[compact]/header:pt-3"
          aria-label={`${site.name}, home`}
        >
          <WireLogo className="-mt-1 size-10 text-ink md:-mt-1.5 md:size-12" />
        </a>
        <div className="header-pad flex flex-1 items-start pt-4 group-data-[compact]/header:pt-2.5 md:pt-5 md:group-data-[compact]/header:pt-3">
          <p className="w-40 text-[0.95rem] leading-[1.05] tracking-tight md:w-[19%] md:text-lg">
            {site.nameLines.map((l, i) => (
              <Reveal key={l} delay={80 + i * 70} className="block">
                {l}
              </Reveal>
            ))}
          </p>
          <p className="hidden text-sm leading-tight lg:block">
            {site.tagline.map((l, i) => (
              <Reveal key={l} delay={160 + i * 70} className="block">
                {l}
              </Reveal>
            ))}
          </p>
        </div>

        {/* Projects / About */}
        <div className="relative hidden w-[24.6%] flex-col justify-end border-l border-line px-5 pb-4 md:flex">
          <a
            href="#work"
            tabIndex={compact ? -1 : 0}
            className="header-fade group absolute top-5 left-5 flex gap-5 text-sm"
          >
            <span className="tabular-nums">
              {String(projects.length).padStart(4, "0")}
            </span>
            <span className="opacity-40">/</span>
            <span className="group-hover:underline">Projects</span>
          </a>
          <a href="#about" className="group flex items-center gap-3 text-lg">
            <Plus
              className="size-4 transition-transform duration-500 group-hover:rotate-90"
              strokeWidth={1.5}
            />
            <span>About me</span>
          </a>
        </div>

        {/* Contact / Menu */}
        <div ref={panel} className="relative w-auto md:w-[20%]">
          <div
            className={cn(
              "relative flex h-full flex-col justify-end px-4 pb-3 transition-colors md:border-l md:border-line md:px-5 md:pb-4",
              open && "bg-panel"
            )}
          >
            <a
              href={`mailto:${site.email}`}
              tabIndex={compact ? -1 : 0}
              className="header-fade absolute top-5 left-5 hidden text-sm hover:underline md:block"
            >
              Say hello
            </a>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="site-menu"
              className="flex w-fit items-center gap-3 text-base md:text-lg"
            >
              <Plus
                className={cn(
                  "size-4 transition-transform duration-500",
                  open && "rotate-45"
                )}
                strokeWidth={1.5}
              />
              <span>Menu</span>
            </button>
          </div>
          <nav
            id="site-menu"
            className={cn(
              "absolute top-full right-0 w-[min(20rem,100vw)] origin-top bg-panel px-5 pt-4 pb-6 text-ink transition-[clip-path] duration-500 ease-[cubic-bezier(.2,.7,0,1)] md:w-full",
              open
                ? "[clip-path:inset(0_0_0_0)]"
                : "pointer-events-none [clip-path:inset(0_0_100%_0)]"
            )}
            aria-hidden={!open}
          >
            <ul className="space-y-1 text-2xl tracking-tight">
              {menuLinks.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    tabIndex={open ? 0 : -1}
                    className="hover:opacity-60"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <ul className="mt-6 space-y-1 border-t border-line pt-4 text-sm">
              {external.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    target={l.href.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                    tabIndex={open ? 0 : -1}
                    className="flex items-center justify-between hover:opacity-60"
                  >
                    {l.label}
                    <ArrowUpRight className="size-3.5" strokeWidth={1.5} />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="header-pad hidden w-[7%] items-start justify-end px-5 pt-5 text-xs group-data-[compact]/header:pt-3 xl:flex">
          <LocalTime />
        </div>
      </div>
    </header>
  )
}

/**
 * True once the dark "Selected work" section has scrolled up to the header,
 * false again when you scroll back above it.
 */
function useCompact() {
  const [compact, setCompact] = useState(false)
  useEffect(() => {
    const work = document.getElementById("work")
    if (!work) return
    let raf = 0
    const check = () => {
      raf = 0
      const full = parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--header-h"
        )
      )
      const px =
        full * parseFloat(getComputedStyle(document.documentElement).fontSize)
      setCompact(work.getBoundingClientRect().top <= px + 1)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check)
    }
    check()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [])
  return compact
}

function LocalTime() {
  const [now, setNow] = useState<string | null>(null)
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: site.timeZone,
    })
    const tick = () => setNow(fmt.format(new Date()))
    tick()
    const id = setInterval(tick, 15_000)
    return () => clearInterval(id)
  }, [])
  return (
    <span className="text-right leading-tight tabular-nums">
      IN
      <br />
      <span className="opacity-60">{now ?? "--:--"}</span>
    </span>
  )
}
