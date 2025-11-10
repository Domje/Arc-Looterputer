import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Looter Shooter Puter'",
  description: "Search for Arc Raiders items",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className="bg-[#120817] text-[#eae1d1]"
        style={{ fontFamily: '"Century Gothic", "URW Gothic", "Avant Garde", system-ui, sans-serif' }}
      >
        {children}
      </body>
    </html>
  )
}
