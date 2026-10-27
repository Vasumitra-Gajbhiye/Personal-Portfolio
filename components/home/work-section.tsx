import { ArrowUpRight } from "lucide-react"

import { projects, site } from "@/lib/site"
import { RibbonCanvas } from "./ribbon-canvas"
import { WordReveal } from "./word-reveal"

/** Dark section that slides up over the pinned statement. */
export function WorkSection() {
  return (
    <section id="work" className="relative z-20 bg-night text-white">
      {/* Intro panel with a white ribbon echoing the hero */}
      <div className="relative min-h-[85svh] overflow-hidden px-4 pt-24 pb-16 md:px-6 md:pt-32">
        <RibbonCanvas mode="inline" />
        <p className="relative text-xs tracking-wide text-white/60">
          Selected work
        </p>
        <h2 className="section-title relative mt-6 max-w-[11ch] font-medium tracking-[-0.04em]">
          <WordReveal text="Things I've built and run." />
        </h2>
      </div>

      {/* Project rows */}
      <ol className="border-t border-white/15">
        {projects.map((p, i) => (
          <li key={p.name} className="border-b border-white/15">
            <a
              href={p.href}
              target="_blank"
              rel="noreferrer"
              className="group grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-x-4 gap-y-2 px-4 py-7 transition-colors hover:bg-white/[0.04] md:grid-cols-[4rem_1.1fr_1.6fr_0.9fr_4rem_2rem] md:px-6 md:py-9"
            >
              <span className="text-xs text-white/50 tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-3xl tracking-tight md:text-[2.6rem] md:leading-none">
                {p.name}
                <span className="mt-2 block text-sm tracking-normal text-white/50">
                  {p.kind}
                </span>
              </span>
              <ArrowUpRight
                className="size-5 self-start transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1 md:order-last"
                strokeWidth={1.25}
              />
              <span className="col-span-2 col-start-2 max-w-[42ch] text-[0.95rem] leading-snug text-white/75 md:col-span-1 md:col-start-auto">
                {p.summary}
              </span>
              <span className="col-start-2 text-xs text-white/50 md:col-start-auto">
                {p.stack}
              </span>
              <span className="hidden text-xs text-white/50 tabular-nums md:block">
                {p.year}
              </span>
            </a>
          </li>
        ))}
      </ol>

      {/* Contact */}
      <div id="contact" className="px-4 pt-28 pb-16 md:px-6 md:pt-40">
        <p className="text-xs tracking-wide text-white/60">Contact</p>
        <h2 className="section-title mt-6 font-medium tracking-[-0.045em]">
          <WordReveal text="Let's build something." />
        </h2>
        <div className="mt-12 flex flex-col gap-6 md:mt-16 md:flex-row md:items-end md:justify-between">
          <a
            href={`mailto:${site.email}`}
            className="w-fit border-b border-white/40 pb-1 text-lg break-all transition-colors hover:border-white md:text-2xl"
          >
            {site.email}
          </a>
          <div className="flex gap-6 text-sm">
            <a
              href={site.links.github}
              target="_blank"
              rel="noreferrer"
              className="hover:underline"
            >
              GitHub
            </a>
            <a
              href={site.links.linkedin}
              target="_blank"
              rel="noreferrer"
              className="hover:underline"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>

      <footer className="flex flex-col gap-2 border-t border-white/15 px-4 py-6 text-xs text-white/50 md:flex-row md:justify-between md:px-6">
        <span>
          © {new Date().getFullYear()} {site.name}
        </span>
        <span>{site.location}</span>
        <a href="#top" className="hover:text-white">
          Back to top ↑
        </a>
      </footer>
    </section>
  )
}
