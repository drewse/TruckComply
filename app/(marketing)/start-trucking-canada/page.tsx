import type { Metadata } from "next"
import Link from "next/link"
import {
  ArrowRight, CheckCircle2, AlertTriangle, Clock,
  DollarSign, FileText, Shield, Building2, Truck, Star
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "How to Start a Trucking Company in Canada (2026 Guide) | TruckComply",
  description:
    "Complete step-by-step guide to starting a trucking company in Canada in 2026. CVOR, IFTA, IRP, insurance costs, licences, and timeline. Ontario-focused.",
  keywords: [
    "how to start a trucking company in Canada",
    "start trucking company Ontario 2026",
    "trucking business Canada requirements",
    "CVOR IFTA IRP Canada",
    "owner operator Canada startup",
    "trucking licence Canada",
    "commercial carrier registration Canada",
  ],
  openGraph: {
    title: "How to Start a Trucking Company in Canada (2026 Guide)",
    description: "Skip the paperwork — complete guide to starting a Canadian trucking company.",
    url: "https://truckcomply.ca/start-trucking-canada",
  },
}

const steps = [
  {
    number: "01",
    title: "Register your business",
    description:
      "Incorporate federally (Canada Business Corporations Act) or provincially (Ontario Business Corporations Act). You can also operate as a sole proprietor, but incorporation limits personal liability.",
    cost: "$300–$800",
    time: "1–3 days",
    required: true,
    tips: [
      "Choose a name that doesn't conflict with existing carriers",
      "Ontario incorporation: ~$360 + legal fees",
      "Federal incorporation: ~$200 + legal fees",
      "You'll need this before applying for CVOR",
    ],
  },
  {
    number: "02",
    title: "Get your CVOR certificate",
    description:
      "Apply for your Commercial Vehicle Operator's Registration with the Ontario Ministry of Transportation. Required for all commercial vehicles over 4,500 kg GVWR operating in Ontario.",
    cost: "$250 (MTO fee) + $149 (TruckComply service)",
    time: "5–10 business days",
    required: true,
    tips: [
      "Requires minimum $2M liability insurance",
      "You need your Ontario business registration first",
      "Safety rating starts as 'Satisfactory-Unaudited'",
      "TruckComply handles the entire application process",
    ],
  },
  {
    number: "03",
    title: "Get commercial truck insurance",
    description:
      "Commercial truck insurance is mandatory before you can operate. Premiums depend on your experience, cargo type, and vehicle weight. Budget $8,000–$20,000 per year for a single truck.",
    cost: "$8,000–$20,000/year",
    time: "3–7 days",
    required: true,
    tips: [
      "Shop at least 3 brokers — rates vary dramatically",
      "Bobtail insurance for owner-operators without cargo",
      "Cargo insurance is separate (required by most shippers)",
      "New carriers pay highest rates — improve over 3 years",
    ],
  },
  {
    number: "04",
    title: "Register for IFTA (if multi-jurisdictional)",
    description:
      "The International Fuel Tax Agreement is required if you'll operate in multiple provinces or US states. IFTA simplifies fuel tax reporting for carriers crossing borders.",
    cost: "$0 (free registration) + quarterly filing fees",
    time: "2–5 business days",
    required: false,
    tips: [
      "Required if you cross provincial or US borders",
      "Quarterly fuel tax returns required",
      "Track all fuel purchases and mileage by jurisdiction",
      "TruckComply handles IFTA registration and quarterly filings",
    ],
  },
  {
    number: "05",
    title: "Register for IRP (for multi-province fleet)",
    description:
      "The International Registration Plan allows you to register your fleet for travel in multiple provinces and US states with one licence plate and cab card.",
    cost: "Based on fleet weight and jurisdictions",
    time: "5–10 business days",
    required: false,
    tips: [
      "Required for vehicles operating across multiple jurisdictions",
      "Annual apportioned registration based on distance traveled",
      "Ontario IRP processed through MTO ServiceOntario",
      "Complex calculation — let TruckComply handle it",
    ],
  },
  {
    number: "06",
    title: "Get your WSIB coverage",
    description:
      "Workplace Safety and Insurance Board (WSIB) coverage is required in Ontario for all employees. Owner-operators may opt in voluntarily.",
    cost: "$1.47 per $100 of insurable earnings (approx.)",
    time: "1–2 days",
    required: true,
    tips: [
      "Required if you hire any employees",
      "Register within 10 days of first hire",
      "Owner-operators: highly recommended for self-coverage",
    ],
  },
  {
    number: "07",
    title: "Hire drivers & complete safety compliance",
    description:
      "If hiring drivers, verify licences, run abstracts, and set up your internal safety management system. Ontario carriers must maintain logs under the NSC Safety Fitness Certificate requirements.",
    cost: "Varies",
    time: "Ongoing",
    required: true,
    tips: [
      "All drivers need valid licences for vehicle class",
      "Run abstract checks before hiring",
      "Hours of Service logs required (federally)",
      "ELD (Electronic Logging Device) mandate in effect",
    ],
  },
]

const costBreakdown = [
  { item: "Business incorporation", cost: "$300–$800", type: "one-time" },
  { item: "CVOR application (MTO fee)", cost: "$250", type: "one-time" },
  { item: "TruckComply setup service", cost: "$149", type: "one-time" },
  { item: "Commercial truck insurance", cost: "$8,000–$20,000", type: "annual" },
  { item: "Truck purchase/lease", cost: "$50,000–$180,000", type: "one-time" },
  { item: "WSIB premiums", cost: "~$1.47/$100 earnings", type: "ongoing" },
  { item: "IFTA quarterly filing", cost: "$0–$200/quarter", type: "quarterly" },
  { item: "Fuel (diesel)", cost: "~$0.55–$0.75/km", type: "variable" },
]

const requiredDocuments = [
  { doc: "Ontario Business Registration Certificate", when: "Before CVOR application" },
  { doc: "Articles of Incorporation (if incorporated)", when: "Before CVOR application" },
  { doc: "Commercial vehicle insurance certificate ($2M+)", when: "Before CVOR application" },
  { doc: "Vehicle registration and title", when: "For IRP and CVOR" },
  { doc: "Driver's licence and abstract for all drivers", when: "For CVOR application" },
  { doc: "Proof of Ontario address (physical, not PO Box)", when: "For CVOR" },
  { doc: "WSIB account number (if applicable)", when: "Within 10 days of first hire" },
  { doc: "IFTA licence (if multi-jurisdictional)", when: "Before crossing borders" },
]

const mistakes = [
  {
    title: "Starting without the right insurance",
    detail: "Many new carriers buy insurance that doesn't meet MTO minimums. This delays your CVOR and can result in fines. Get your policy reviewed before applying.",
  },
  {
    title: "Incorporating without a trucking-specific structure",
    detail: "How you structure your company affects taxes and liability significantly. A generic incorporation without trucking considerations can cost you thousands annually.",
  },
  {
    title: "Ignoring IFTA from day one",
    detail: "If you ever cross into Quebec, Manitoba, or the US, you need IFTA. Setting it up after the fact is harder. Register early even if you don't cross borders immediately.",
  },
  {
    title: "Not tracking Hours of Service from day 1",
    detail: "Federal HOS regulations apply immediately. Starting bad logging habits is a major liability. Get your ELD set up before your first load.",
  },
  {
    title: "Underestimating insurance costs",
    detail: "New carriers face premiums 2–3x higher than experienced operators. Budget $15,000–$20,000/year minimum and improve your rating to reduce costs over 3 years.",
  },
]

const testimonials = [
  {
    name: "Tony Bianchi",
    company: "New owner-operator, Hamilton ON",
    quote: "Spent 3 months trying to figure out what I needed. TruckComply gave me a clear checklist, handled my CVOR, and I was running loads within 6 weeks of calling them.",
    rating: 5,
  },
  {
    name: "Maria Santos",
    company: "Santos Freight Ltd., London ON",
    quote: "Starting a trucking company is overwhelming. TruckComply made it manageable. They knew every single thing MTO needed. Zero rejection.",
    rating: 5,
  },
]

export default function StartTruckingCanadaPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1a2744] to-[#243359] text-white py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <Badge className="bg-orange-600/20 text-orange-400 border-orange-600/30 mb-4 px-3 py-1">
            2026 Complete Guide
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-5">
            How to Start a Trucking Company in Canada{" "}
            <span className="text-orange-400">(2026 Guide)</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl">
            A step-by-step guide to legally launching your trucking business in Ontario. Covers CVOR, IFTA, IRP, insurance, costs, and timeline.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Button asChild size="xl">
              <Link href="/checkout" className="flex items-center gap-2">
                Skip the paperwork — we&apos;ll handle everything <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
          <div className="flex flex-wrap gap-5 text-sm text-gray-300">
            {["7 required steps", "Full cost breakdown", "Document checklist", "Ontario-specific"].map((tag) => (
              <div key={tag} className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-green-400" /> {tag}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Overview Box */}
      <section className="py-12 px-4 bg-orange-50 border-b border-orange-100">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            {[
              { label: "Steps required", value: "7" },
              { label: "Minimum startup cost", value: "$9,000+" },
              { label: "Days to get CVOR", value: "5–10" },
              { label: "TruckComply setup fee", value: "$149" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-bold text-orange-600 mb-1">{stat.value}</div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Step by step */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Step-by-step guide</h2>
          <p className="text-gray-500 mb-10">Follow these steps in order. Each builds on the last.</p>
          <div className="space-y-10">
            {steps.map((step) => (
              <div key={step.number} className="border border-gray-200 rounded-xl overflow-hidden">
                <div className={`p-6 ${step.required ? "bg-white" : "bg-gray-50"}`}>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#1a2744] text-white flex items-center justify-center font-bold text-lg shrink-0">
                      {step.number}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
                        {step.required ? (
                          <Badge variant="destructive" className="text-xs">Required</Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs">Conditional</Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                        <span className="flex items-center gap-1.5">
                          <DollarSign className="h-4 w-4" /> {step.cost}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4" /> {step.time}
                        </span>
                      </div>
                      <p className="text-gray-600 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </div>
                <div className="px-6 pb-6 pt-0 bg-white border-t border-gray-100">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 mt-4">Key tips:</h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {step.tips.map((tip) => (
                      <li key={tip} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skip the paperwork CTA */}
      <section className="py-16 px-4 bg-orange-600">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Skip the paperwork — we&apos;ll handle everything</h2>
          <p className="text-orange-100 mb-6 text-lg">
            Our done-for-you service handles CVOR, IFTA, and IRP registration so you can focus on getting your first load.
          </p>
          <Button asChild size="xl" variant="outline" className="border-white text-white hover:bg-white/10 bg-transparent">
            <Link href="/checkout" className="flex items-center gap-2">
              Get Started — $149 Setup Fee <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Cost breakdown */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Startup costs breakdown</h2>
          <p className="text-gray-500 mb-8">Real costs for starting a trucking company in Ontario in 2026</p>
          <div className="overflow-hidden rounded-xl border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left p-4 font-semibold text-gray-700">Item</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Estimated Cost</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Frequency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {costBreakdown.map((row) => (
                  <tr key={row.item} className="hover:bg-gray-50">
                    <td className="p-4 text-gray-800">{row.item}</td>
                    <td className="p-4 font-medium text-gray-900">{row.cost}</td>
                    <td className="p-4">
                      <Badge variant={row.type === "one-time" ? "secondary" : row.type === "annual" ? "info" : "warning"} className="text-xs capitalize">
                        {row.type}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-gray-500 text-xs mt-3">
            * Costs are estimates for Ontario-based carriers. Actual costs vary based on vehicle type, cargo, and business structure.
          </p>
        </div>
      </section>

      {/* Required documents */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Required documents</h2>
          <p className="text-gray-500 mb-8">Prepare these before you apply. Missing documents = delays.</p>
          <div className="space-y-3">
            {requiredDocuments.map((item) => (
              <div key={item.doc} className="flex items-start gap-4 p-4 bg-white border border-gray-200 rounded-lg">
                <FileText className="h-5 w-5 text-[#1a2744] shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900 text-sm">{item.doc}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{item.when}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mistakes to avoid */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Mistakes to avoid</h2>
          <p className="text-gray-500 mb-8">The most expensive errors new carriers make — and how to avoid them</p>
          <div className="space-y-4">
            {mistakes.map((item) => (
              <div key={item.title} className="flex gap-4 p-5 border border-amber-100 bg-amber-50 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">From new carriers who made it</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

      {/* Final CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-[#1a2744] rounded-2xl p-10 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to launch your trucking business?</h2>
            <p className="text-gray-300 mb-8 text-lg">
              Don&apos;t spend weeks figuring out the paperwork. Let TruckComply handle the compliance so you can focus on building your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
              <Button asChild size="xl">
                <Link href="/checkout" className="flex items-center gap-2">
                  Get Started — $149 <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="xl" variant="outline" className="border-white text-white hover:bg-white/10 bg-transparent">
                <Link href="/cvor-ontario">
                  Learn About CVOR First
                </Link>
              </Button>
            </div>
            <p className="text-gray-400 text-sm">
              One-time setup fee. Monthly compliance plan available at $39/month.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
