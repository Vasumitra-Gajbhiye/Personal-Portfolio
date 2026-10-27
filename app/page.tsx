import { Hero } from "@/components/home/hero"
import { IntroLoader } from "@/components/home/intro-loader"
import { RibbonCanvas } from "@/components/home/ribbon-canvas"
import { SiteHeader } from "@/components/home/site-header"
import { SmoothScroll } from "@/components/home/smooth-scroll"
import { Statement } from "@/components/home/statement"
import { WorkSection } from "@/components/home/work-section"

export default function Home() {
  return (
    <>
      <IntroLoader />
      <SmoothScroll />
      <RibbonCanvas mode="hero" />
      <SiteHeader />
      <main className="relative pt-[var(--header-h)]">
        <Hero />
        <Statement />
        <WorkSection />
      </main>
    </>
  )
}
