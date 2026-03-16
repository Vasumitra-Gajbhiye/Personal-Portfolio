import { Button } from "@/components/ui/button"
import { Github, Linkedin, Globe } from "lucide-react"

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-3xl space-y-6 text-center">
        {/* Name */}
        <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
          Vasumitra Gajbhiye
        </h1>

        {/* Subtitle */}
        <p className="text-xl text-muted-foreground">
          Founder of <span className="font-semibold">BrillPrep</span> ·
          Full-Stack Developer · Building tools for better learning
        </p>

        {/* Description */}
        <p className="mx-auto max-w-xl text-muted-foreground">
          I build technology that helps students learn more effectively.
          Currently working on BrillPrep — an interactive exam practice platform
          designed to help students identify weak topics and improve through
          analytics-driven learning.
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Button asChild>
            <a href="https://brillprep.com" target="_blank">
              <Globe className="mr-2 h-4 w-4" />
              BrillPrep
            </a>
          </Button>

          <Button variant="outline" asChild>
            <a href="https://github.com/Vasumitra-Gajbhiye" target="_blank">
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </a>
          </Button>

          <Button variant="outline" asChild>
            <a href="https://linkedin.com/in/vasumitragajbhiye" target="_blank">
              <Linkedin className="mr-2 h-4 w-4" />
              LinkedIn
            </a>
          </Button>
        </div>
      </div>
    </main>
  )
}
