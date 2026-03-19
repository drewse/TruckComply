import { Navbar } from "@/components/marketing/navbar"
import { Footer } from "@/components/marketing/footer"
import { StickyCTA } from "@/components/marketing/sticky-cta"

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <StickyCTA />
    </>
  )
}
