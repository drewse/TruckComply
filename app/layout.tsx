import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "TruckComply — Canadian Trucking Compliance Made Simple",
    template: "%s | TruckComply",
  },
  description:
    "Start and run your trucking company without paperwork headaches. CVOR applications, IFTA, IRP, and compliance management for Canadian carriers.",
  keywords: [
    "CVOR Ontario",
    "trucking compliance Canada",
    "start trucking company Canada",
    "CVOR application",
    "IFTA registration Canada",
    "IRP registration Ontario",
    "trucking license Ontario",
    "commercial vehicle operator registration",
  ],
  openGraph: {
    title: "TruckComply — Canadian Trucking Compliance Made Simple",
    description: "Start and run your trucking company without paperwork headaches.",
    url: "https://truckcomply.ca",
    siteName: "TruckComply",
    locale: "en_CA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TruckComply — Canadian Trucking Compliance Made Simple",
    description: "Start and run your trucking company without paperwork headaches.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-full antialiased`}>{children}</body>
    </html>
  )
}
