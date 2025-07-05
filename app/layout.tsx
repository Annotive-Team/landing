import type React from "react"
import "./globals.css"
import { poppins, bricolageGrotesque } from "./fonts"

export const metadata = {
  title: "Phrals - Turn Waste Into Wealth",
  description: "Join our team of eco warriors and help us create a better world",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${bricolageGrotesque.variable} font-poppins`}>{children}</body>
    </html>
  )
}
