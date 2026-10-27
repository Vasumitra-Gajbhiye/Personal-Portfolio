// All copy and links for the home page live here, so you can edit content
// without touching the components.

export const site = {
  name: "Vasumitra Gajbhiye",
  nameLines: ["Vasumitra", "Gajbhiye"],
  tagline: ["Building the tools", "I wished I had."],
  email: "vasumitragajbhiye20@gmail.com",
  location: "Nagpur · Bengaluru",
  timeZone: "Asia/Kolkata",
  links: {
    github: "https://github.com/Vasumitra-Gajbhiye",
    linkedin: "https://linkedin.com/in/vasumitragajbhiye",
  },
  // Each entry is one line of the giant hero headline.
  headline: ["I build", "the tools", "I wished", "I had."],
  ctas: {
    primary: {
      label: "Work with me",
      href: "mailto:vasumitragajbhiye20@gmail.com",
    },
    secondary: { label: "About me", href: "#about" },
  },
  statement: {
    label: "Who I am",
    lead: "Developer, founder and data science student at IIM Bangalore,",
    body: "I build products for students: BrillPrep, an AI exam-prep platform for Cambridge learners, and the tools behind r/alevel, a community of 185,000+ A-Level students I've led since 2023.",
  },
} as const

export type Project = {
  name: string
  kind: string
  summary: string
  stack: string
  year: string
  href: string
  cta: string
  /** Optional screenshot in /public, e.g. "/projects/brillprep.png" */
  image?: string
  /** Fallback cover colours when there's no image yet */
  cover: { bg: string; fg: string }
}

export const projects: Project[] = [
  {
    name: "BrillPrep",
    kind: "Founder",
    summary:
      "AI-powered exam prep for Cambridge IGCSE and A-Level students: past papers, instant marking and topic analytics.",
    stack: "Next.js · Postgres · Gemini",
    year: "2026",
    href: "https://brillprep.com",
    cta: "Visit",
    cover: { bg: "#111111", fg: "#f5f5f4" },
  },
  {
    name: "r/alevel",
    kind: "Community lead",
    summary:
      "Running one of the largest student communities online, with a 40-person team across Reddit, Discord and ralevel.com.",
    stack: "Community · Turborepo · Coolify",
    year: "2023–",
    href: "https://ralevel.com",
    cta: "Visit",
    cover: { bg: "#e8e4dc", fg: "#1b1b1b" },
  },
  {
    name: "r/alevel bot",
    kind: "Builder",
    summary:
      "A Discord moderation bot with AI moderation, FAQ routing and a staff dashboard, so the server runs without me.",
    stack: "Discord.js · Docker · LLMs",
    year: "2026",
    href: "https://github.com/Vasumitra-Gajbhiye/Ralevel-Discord-Bot",
    cta: "Code",
    cover: { bg: "#1d2bd6", fg: "#ffffff" },
  },
]
