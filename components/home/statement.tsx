import { site } from "@/lib/site"
import { WordReveal } from "./word-reveal"

/**
 * Pinned "who I am" statement. It's `sticky`, so it holds in place while the
 * dark work section scrolls up over it.
 */
export function Statement() {
  const { label, lead, body } = site.statement
  const leadWords = lead.split(" ").length
  return (
    <section
      id="about"
      className="sticky top-[var(--header-h)] z-10 flex h-[calc(100svh-var(--header-h))] items-center px-4 md:px-[3.4%]"
    >
      <div className="relative max-w-[68rem]">
        <div className="mb-4 w-28 md:absolute md:top-[0.15em] md:left-0 md:mb-0 md:w-[24%]">
          <span className="block h-px w-full bg-ink/70" />
          <span className="mt-2 block text-[11px] tracking-wide text-ink/70">
            {label}
          </span>
        </div>
        <p className="statement-text text-ink md:indent-[26%]">
          <WordReveal text={lead} />{" "}
          <WordReveal text={body} startIndex={leadWords} />
        </p>
      </div>
    </section>
  )
}
