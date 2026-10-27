"use client"

import { useState } from "react"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"

import { projects, type Project } from "@/lib/site"
import { cn } from "@/lib/utils"

/** The beige "Project" card in the hero: a tiny carousel over `projects`. */
export function ProjectCard({ className }: { className?: string }) {
  const [i, setI] = useState(0)
  const n = projects.length
  const go = (d: number) => setI((v) => (v + d + n) % n)

  return (
    <div
      className={cn("flex min-h-52 bg-panel text-ink", className)}
      aria-roledescription="carousel"
      aria-label="Projects"
    >
      <div className="grid flex-1 grid-cols-[1fr_1.15fr] gap-4 p-4 sm:grid-cols-[0.55fr_1fr_1.15fr] md:p-5">
        <p className="hidden text-base sm:block">Project</p>

        {/* Cover */}
        <div className="relative aspect-[3/2] overflow-hidden">
          {projects.map((p, k) => (
            <Cover key={p.name} project={p} active={k === i} />
          ))}
        </div>

        {/* Title / link / counter */}
        <div className="relative flex flex-col">
          <div className="relative min-h-[3.2em] text-base leading-snug md:text-lg">
            {projects.map((p, k) => (
              <p
                key={p.name}
                aria-hidden={k !== i}
                className={cn(
                  "absolute inset-0 transition-[opacity,translate] duration-500",
                  k === i
                    ? "translate-y-0 opacity-100"
                    : "pointer-events-none translate-y-2 opacity-0"
                )}
              >
                {p.name}
                <span className="block text-sm opacity-55">{p.kind}</span>
              </p>
            ))}
          </div>
          <a
            href={projects[i].href}
            target="_blank"
            rel="noreferrer"
            className="mt-auto inline-flex w-fit items-center gap-2 rounded-full border border-ink/80 px-4 py-1.5 text-sm transition-colors hover:bg-ink hover:text-paper"
          >
            {projects[i].cta}
            <ArrowRight className="size-3.5" strokeWidth={1.5} />
          </a>
          <p className="mt-3 self-end text-xs tabular-nums" aria-live="polite">
            {String(i + 1).padStart(2, "0")}{" "}
            <span className="mx-1.5 opacity-50">/</span>{" "}
            {String(n).padStart(2, "0")}
          </p>
        </div>
      </div>

      {/* Arrows */}
      <div className="flex w-11 flex-col border-l border-line md:w-12">
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next project"
          className="flex flex-1 items-center justify-center border-b border-line transition-colors hover:bg-ink/5"
        >
          <ChevronRight className="size-4" strokeWidth={1.5} />
        </button>
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous project"
          className="flex flex-1 items-center justify-center transition-colors hover:bg-ink/5"
        >
          <ChevronLeft className="size-4" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  )
}

function Cover({ project, active }: { project: Project; active: boolean }) {
  return (
    <div
      aria-hidden={!active}
      className={cn(
        "absolute inset-0 transition-[opacity,scale] duration-700 ease-[cubic-bezier(.2,.7,0,1)]",
        active ? "scale-100 opacity-100" : "scale-[1.04] opacity-0"
      )}
      style={{ background: project.cover.bg, color: project.cover.fg }}
    >
      {project.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={project.image}
          alt=""
          className="h-full w-full object-cover"
        />
      ) : (
        <CoverArt project={project} />
      )}
    </div>
  )
}

/** Placeholder cover until a real screenshot is added to `projects[].image`. */
function CoverArt({ project }: { project: Project }) {
  return (
    <div className="relative flex h-full w-full flex-col justify-between p-3">
      <svg
        viewBox="0 0 100 66"
        className="absolute inset-0 h-full w-full opacity-35"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        {Array.from({ length: 18 }, (_, k) => (
          <rect
            key={k}
            x={58}
            y={8}
            width={34}
            height={34}
            fill="none"
            stroke="currentColor"
            strokeWidth={0.18}
            transform={`rotate(${k * 3.2} 75 25)`}
          />
        ))}
      </svg>
      <span className="relative text-[10px] tracking-wide uppercase opacity-70">
        {project.stack}
      </span>
      <span className="relative text-xl leading-none font-medium tracking-tight md:text-2xl">
        {project.name}
      </span>
    </div>
  )
}
