import { ArrowRight } from "lucide-react"

import { site } from "@/lib/site"
import { FadeIn, Reveal } from "./reveal"
import { ProjectCard } from "./project-card"

export function Hero() {
  const { primary, secondary } = site.ctas
  return (
    <section
      id="top"
      className="relative z-10 flex min-h-[calc(100svh-var(--header-h))] flex-col justify-end px-4 pt-[34svh] pb-4 md:block md:h-[calc(100svh-var(--header-h))] md:min-h-[34rem] md:p-0"
    >
      <h1 className="hero-title font-medium tracking-[-0.045em] md:absolute md:bottom-[0.25em] md:left-6">
        {site.headline.map((line, i) => (
          <Reveal key={line} delay={250 + i * 90} className="block">
            {line}
          </Reveal>
        ))}
      </h1>

      <div className="mt-6 flex flex-col gap-4 md:absolute md:right-4 md:bottom-4 md:mt-0 md:w-[50.5%] md:gap-5">
        <FadeIn
          delay={650}
          className="grid grid-cols-2 gap-3 md:ml-[19%] md:grid-cols-[1.55fr_1fr] md:gap-5"
        >
          <Cta href={primary.href} label={primary.label} className="bg-navy" />
          <Cta
            href={secondary.href}
            label={secondary.label}
            className="bg-blue"
          />
        </FadeIn>
        <FadeIn delay={800}>
          <ProjectCard />
        </FadeIn>
      </div>
    </section>
  )
}

function Cta({
  href,
  label,
  className,
}: {
  href: string
  label: string
  className?: string
}) {
  return (
    <a
      href={href}
      className={`group relative flex h-24 items-start justify-between overflow-hidden rounded-[3px] p-3 text-base text-white md:h-[6.6rem] md:text-lg ${className}`}
    >
      <span className="relative z-10">{label}</span>
      <ArrowRight
        className="relative z-10 size-4 transition-transform duration-500 group-hover:translate-x-1 md:size-5"
        strokeWidth={1.5}
      />
      {/* hover sheen */}
      <span className="absolute inset-0 origin-bottom scale-y-0 bg-white/10 transition-transform duration-500 ease-[cubic-bezier(.2,.7,0,1)] group-hover:scale-y-100" />
    </a>
  )
}
