import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, CheckCircle2, Shield, Clock, FileText, Truck, Star, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { PricingCards } from "@/components/marketing/pricing-cards"

export const metadata: Metadata = {
  title: "TruckComply — Start & Run Your Trucking Company Without Paperwork Headaches",
  description:
    "TruckComply handles your CVOR, IFTA, and IRP applications so you can focus on driving. Ontario trucking compliance made simple. Start for $149.",
}

const trustSignals = [
  { label: "Applications Processed", value: "500+" },
  { label: "Average Completion Time", value: "7 Days" },
  { label: "Customer Satisfaction", value: "98%" },
  { label: "Years of Experience", value: "10+" },
]

const services = [
  {
    icon: Shield,
    title: "CVOR Application",
    description: "Get your Commercial Vehicle Operator's Registration in Ontario. We handle the entire MTO application process.",
    link: "/cvor-ontario",
    badge: "Most Requested",
  },
  {
    icon: FileText,
    title: "IFTA Registration",
    description: "Register for the International Fuel Tax Agreement. Required if you operate in multiple provinces or US states.",
    link: "/start-trucking-canada",
    badge: null,
  },
  {
    icon: Truck,
    title: "IRP Registration",
    description: "International Registration Plan — register your fleet for multi-jurisdictional travel across Canada and the US.",
    link: "/start-trucking-canada",
    badge: null,
  },
]

const steps = [
  {
    step: "01",
    title: "Tell us about your business",
    description: "Fill out our simple intake form. Takes 5 minutes. No legalese.",
  },
  {
    step: "02",
    title: "We handle the paperwork",
    description: "Our compliance team prepares and submits all required applications to the MTO and federal agencies.",
  },
  {
    step: "03",
    title: "Get your approvals",
    description: "Receive your CVOR, IFTA, and IRP credentials. You&apos;re legally ready to haul.",
  },
]

const testimonials = [
  {
    name: "Mike Johnson",
    company: "Speed Freight Inc., Mississauga",
    quote: "Got my CVOR in 8 days. Thought it would take months. TruckComply handled everything — I just uploaded my documents.",
    rating: 5,
  },
  {
    name: "Sara Chen",
    company: "Oak Logistics Ltd., Toronto",
    quote: "As a new owner-operator I had no idea where to start. These guys walked me through every step. Worth every dollar.",
    rating: 5,
  },
  {
    name: "Raj Patel",
    company: "Punjab Trucking Co., Brampton",
    quote: "I&apos;ve tried doing it myself before. Big mistake. TruckComply saved me weeks of confusion and two failed applications.",
    rating: 5,
  },
]

const faqs = [
  {
    q: "How long does CVOR registration take?",
    a: "Typically 5–10 business days after all documents are submitted. We expedite where possible through our MTO relationships.",
  },
  {
    q: "Do I need a CVOR to drive in Ontario?",
    a: "Yes. Any commercial motor vehicle operator in Ontario with vehicles over 4,500 kg GVWR must hold a valid CVOR certificate.",
  },
  {
    q: "What documents do I need?",
    a: "Business registration, proof of insurance ($2M minimum for Ontario), driver abstracts, and vehicle information. We give you the complete checklist.",
  },
  {
    q: "Can you handle IFTA and IRP too?",
    a: "Yes. Our $39/month plan covers ongoing compliance including IFTA filings, IRP renewals, and CVOR maintenance.",
  },
]

export default function HomePage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1a2744] to-[#243359] text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="bg-orange-600/20 text-orange-400 border-orange-600/30 mb-6 px-4 py-1.5">
            Ontario&apos;s #1 Trucking Compliance Service
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Start and run your trucking company{" "}
            <span className="text-orange-400">without paperwork headaches</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            We handle your CVOR, IFTA, IRP applications and ongoing compliance so you can focus on building your business — not fighting bureaucracy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="xl" className="text-base">
              <Link href="/checkout" className="flex items-center gap-2">
                Start Your Application — $149 <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="xl" variant="outline" className="text-base bg-transparent border-white text-white hover:bg-white/10">
              <Link href="/cvor-ontario">Learn About CVOR</Link>
            </Button>
          </div>
          <p className="text-gray-400 text-sm mt-4">One-time fee. No hidden charges. Done in days, not months.</p>
        </div>
      </section>

      {/* Trust signals */}
      <section className="bg-orange-600 py-8">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {trustSignals.map((signal) => (
            <div key={signal.label}>
              <div className="text-3xl font-bold text-white">{signal.value}</div>
              <div className="text-orange-200 text-sm mt-1">{signal.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Get compliant in 3 steps</h2>
            <p className="text-gray-500">From application to approval — we handle every step</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div key={step.step} className="relative text-center">
                <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-orange-600 font-bold text-lg">{step.step}</span>
                </div>
                <h3 className="font-semibold text-gray-900 text-lg mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: step.description }} />
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button asChild size="lg">
              <Link href="/checkout" className="flex items-center gap-2">
                Get Started Today <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="bg-gray-50 py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Everything you need to stay legal</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Whether you&apos;re just starting out or expanding across provinces, we cover the full compliance spectrum.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((service) => {
              const Icon = service.icon
              return (
                <Card key={service.title} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    {service.badge && (
                      <Badge variant="warning" className="mb-3">{service.badge}</Badge>
                    )}
                    <div className="w-10 h-10 bg-[#1a2744] rounded-lg flex items-center justify-center mb-4">
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 text-lg mb-2">{service.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-4">{service.description}</p>
                    <Link href={service.link} className="text-orange-600 text-sm font-medium hover:underline flex items-center gap-1">
                      Learn more <ArrowRight className="h-3 w-3" />
                    </Link>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Trusted by Ontario carriers</h2>
            <p className="text-gray-500">Real results from real trucking companies</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <Card key={t.name}>
                <CardContent className="p-6">
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-orange-400 text-orange-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed mb-4 italic">&ldquo;{t.quote}&rdquo;</p>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-gray-500 text-xs">{t.company}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-gray-50 py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Simple, transparent pricing</h2>
            <p className="text-gray-500">Start with the setup, stay for the compliance management</p>
          </div>
          <PricingCards />
          <p className="text-center text-gray-400 text-sm mt-6">
            All prices in Canadian dollars. HST may apply.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Frequently asked questions</h2>
          </div>
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.q} className="border-b border-gray-200 pb-6">
                <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#1a2744] py-20 px-4">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to get on the road legally?</h2>
          <p className="text-gray-300 mb-8 text-lg">
            Join 500+ Ontario carriers who trust TruckComply for their compliance needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="xl">
              <Link href="/checkout" className="flex items-center gap-2">
                Start Your Application — $149 <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="xl" variant="outline" className="border-white text-white hover:bg-white/10 bg-transparent">
              <a href="tel:+14165550100" className="flex items-center gap-2">
                <Phone className="h-4 w-4" /> Call Us: 416-555-0100
              </a>
            </Button>
          </div>
          <p className="text-gray-400 text-xs mt-6">
            Questions? Email us at{" "}
            <a href="mailto:support@truckcomply.ca" className="text-orange-400 hover:underline">
              support@truckcomply.ca
            </a>
          </p>
        </div>
      </section>
    </div>
  )
}
