import type { Metadata, Viewport } from "next"
import { GeistMono } from "geist/font/mono"
import { GeistSans } from "geist/font/sans"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { introBootScript } from "@/lib/intro"
import { site } from "@/lib/site"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  metadataBase: new URL("https://vasumitragajbhiye.com"),
  title: `${site.name}: developer & founder`,
  description:
    "Full-stack developer, founder of BrillPrep and community lead of r/alevel. Data science at IIM Bangalore.",
  openGraph: {
    title: site.name,
    description: "Building the tools I wished I had.",
    url: "https://vasumitragajbhiye.com",
    type: "website",
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f7f5" },
    { media: "(prefers-color-scheme: dark)", color: "#0e0e0f" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "font-sans antialiased",
        GeistSans.variable,
        GeistMono.variable
      )}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: introBootScript }} />
        <noscript>
          <style>{`.intro-overlay{display:none!important}.reveal-inner,.fade-in,.word>span{transform:none!important;opacity:1!important}`}</style>
        </noscript>
      </head>
      <body>
        <ThemeProvider defaultTheme="light">{children}</ThemeProvider>
      </body>
    </html>
  )
}
