import type { Metadata } from "next"
import Link from "next/link"
import {
  ArrowRight, CheckCircle2, AlertTriangle, Clock, FileText,
  Shield, Star, Phone, ChevronDown
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "CVOR Application Ontario — Fast & Done For You | TruckComply",
  description:
    "Apply for your Commercial Vehicle Operator's Registration (CVOR) in Ontario. Done-for-you service, $149 one-time fee. Approved in 5-10 business days. TruckComply handles all MTO paperwork.",
  keywords: [
    "CVOR Ontario",
    "CVOR application Ontario",
    "commercial vehicle operator registration Ontario",
    "MTO CVOR",
    "how to get CVOR Ontario",
    "CVOR certificate Ontario",
    "trucking registration Ontario",
  ],
  openGraph: {
    title: "CVOR Application Ontario — Fast & Done For You",
    description: "We handle your entire CVOR application. $149 flat fee. Approved in days, not months.",
    url: "https://truckcomply.ca/cvor-ontario",
  },
}

const whoNeedsIt = [
  "Owner-operators with vehicles over 4,500 kg GVWR",
  "Trucking companies operating in Ontario",
  "Carriers hauling freight across Ontario highways",
  "Businesses operating commercial buses or heavy equipment",
  "Any commercial motor vehicle operator in the province",
]

const processSteps = [
  {
    step: "1",
    title: "Complete our intake form",
    detail: "Tell us about your business: company name, vehicle types, driver information. Takes 5 minutes.",
    time: "5 min",
  },
  {
    step: "2",
    title: "Upload your documents",
    detail: "Business registration, proof of insurance ($2M minimum), driver abstracts, and vehicle details.",
    time: "10 min",
  },
  {
    step: "3",
    title: "We prepare your application",
    detail: "Our compliance team reviews everything, prepares the MTO Form 0296A, and checks for errors.",
    time: "1 day",
  },
  {
    step: "4",
    title: "Submission to MTO",
    detail: "We submit your completed application to the Ontario Ministry of Transportation on your behalf.",
    time: "Same day",
  },
  {
    step: "5",
    title: "Receive your CVOR certificate",
    detail: "MTO processes the application (5–10 business days). We send you the certificate immediately upon approval.",
    time: "5–10 days",
  },
]

const commonMistakes = [
  {
    mistake: "Insufficient insurance coverage",
    detail: "Ontario requires minimum $2 million third-party liability. Most applicants submit policies that don't meet MTO minimums.",
  },
  {
    mistake: "Missing safety fitness address",
    detail: "The principal place of business must be a physical Ontario address — not a PO box or virtual office.",
  },
  {
    mistake: "Incorrect vehicle GVWR classification",
    detail: "Misclassifying vehicle weight ratings is one of the most common errors that causes rejection.",
  },
  {
    mistake: "Incomplete driver abstracts",
    detail: "All listed drivers must have current Ontario abstracts. Out-of-province licenses require additional documentation.",
  },
  {
    mistake: "Applying without business registration",
    detail: "Your company must be registered in Ontario before you can apply. We can help with this too.",
  },
]

const faqItems = [
  {
    q: "What is a CVOR certificate?",
    a: "A CVOR (Commercial Vehicle Operator's Registration) is a certificate issued by the Ontario Ministry of Transportation. It tracks your safety record and is required for all commercial vehicle operators in Ontario with vehicles over 4,500 kg GVWR.",
  },
  {
    q: "How long does CVOR approval take?",
    a: "After all documents are submitted, the MTO typically processes applications in 5–10 business days. With TruckComply, your application reaches the MTO the same day you upload your documents.",
  },
  {
    q: "How much does a CVOR cost?",
    a: "The MTO charges a $250 application fee. TruckComply charges a $149 service fee to prepare and submit your application correctly. Total cost: $399.",
  },
  {
    q: "Do I need a CVOR to haul in other provinces?",
    a: "Ontario CVOR covers Ontario operations. For cross-border and multi-provincial operations, you'll also need IFTA and IRP registrations — which we also handle.",
  },
  {
    q: "What happens if I operate without a CVOR?",
    a: "Fines start at $310 and can reach $20,000+. Your vehicle can be placed out of service. Operating without a CVOR is a serious offence under the Highway Traffic Act.",
  },
  {
    q: "Can I transfer my CVOR to a new company?",
    a: "No. CVORs are non-transferable. If you incorporate or change your business structure, you need a new CVOR application. We handle this process quickly.",
  },
  {
    q: "What is a CVOR safety rating?",
    a: "Your CVOR tracks your safety performance: collisions, inspections, convictions. New carriers start with a 'Satisfactory-Unaudited' rating. Good performance earns you 'Satisfactory' status.",
  },
  {
    q: "Can TruckComply help if my CVOR was rejected?",
    a: "Yes. We review rejection reasons, correct the issues, and resubmit. Our error-free track record means rejections are rare — but we handle them at no extra charge.",
  },
]

const testimonials = [
  {
    name: "Harpreet Singh",
    company: "HS Freight, Brampton ON",
    quote: "Applied on Monday, had my CVOR certificate by Wednesday the following week. Shockingly fast. TruckComply knows exactly what MTO needs.",
    rating: 5,
  },
  {
    name: "Dave Kowalski",
    company: "K&K Transport, Windsor ON",
    quote: "Failed my first attempt doing it myself — wrong insurance format. TruckComply fixed everything and got me approved first time.",
    rating: 5,
  },
]

export default function CVOROntarioPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1a2744] to-[#243359] text-white py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <Badge className="bg-orange-600/20 text-orange-400 border-orange-600/30 mb-4 px-3 py-1">
            Ontario CVOR — Done For You
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-5">
            CVOR Application Ontario —{" "}
            <span className="text-orange-400">Fast &amp; Done For You</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl">
            We handle your entire CVOR application with the Ontario MTO. Submit today, approved in 5–10 business days. No confusion. No rejection risk.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="xl">
              <Link href="/checkout?service=cvor-ontario" className="flex items-center gap-2">
                Start Your CVOR Application — $149 <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="xl" variant="outline" className="border-white text-white hover:bg-white/10 bg-transparent">
              <a href="#how-it-works" className="flex items-center gap-2">
                See How It Works <ChevronDown className="h-4 w-4" />
              </a>
            </Button>
          </div>
          <div className="flex flex-wrap gap-6 mt-8">
            {[
              "MTO-approved process",
              "5–10 business day approval",
              "$149 flat fee",
              "100% error-free guarantee",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-gray-300">
                <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What is CVOR */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">What is a CVOR certificate?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="text-gray-600 leading-relaxed mb-4">
                A <strong>CVOR (Commercial Vehicle Operator&apos;s Registration)</strong> is a certificate issued by the Ontario Ministry of Transportation (MTO) that every commercial vehicle operator in Ontario must hold.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                It serves as your operating licence for commercial vehicles and tracks your safety record — including collisions, vehicle inspections, and driver convictions.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Your CVOR number is your commercial identity in Ontario. You&apos;ll need it for insurance, permits, and to legally operate on Ontario highways.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-orange-600" /> Key CVOR facts
              </h3>
              <ul className="space-y-3 text-sm text-gray-700">
                {[
                  "Required for vehicles over 4,500 kg GVWR",
                  "Issued by the Ontario Ministry of Transportation",
                  "Tracks your carrier safety score",
                  "Required for all commercial freight operations",
                  "Renewed annually",
                  "Tied to your business, not your vehicle",
                ].map((fact) => (
                  <li key={fact} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                    {fact}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Who needs it */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Who needs a CVOR in Ontario?</h2>
          <p className="text-gray-600 mb-6">Under Ontario&apos;s Highway Traffic Act, a CVOR is required for:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {whoNeedsIt.map((item) => (
              <div key={item} className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg border border-orange-100">
                <CheckCircle2 className="h-5 w-5 text-orange-600 shrink-0 mt-0.5" />
                <span className="text-gray-800 text-sm">{item}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-800">
              <strong>Important:</strong> Operating without a valid CVOR in Ontario is a violation of the Highway Traffic Act. Fines range from $310 to $20,000+.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Block */}
      <section className="py-12 px-4 bg-orange-600">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-2xl font-bold mb-3">Don&apos;t risk fines. Get your CVOR done right.</h2>
          <p className="text-orange-100 mb-6">Join 500+ Ontario carriers who used TruckComply to get approved fast.</p>
          <Button asChild size="xl" variant="outline" className="border-white text-white hover:bg-white/10 bg-transparent">
            <Link href="/checkout?service=cvor-ontario" className="flex items-center gap-2">
              Start Your CVOR Application — $149 <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Process */}
      <section id="how-it-works" className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Step-by-step CVOR process</h2>
          <p className="text-gray-500 mb-10">From application to certificate — here&apos;s exactly what happens</p>
          <div className="space-y-6">
            {processSteps.map((step, idx) => (
              <div key={step.step} className="flex gap-5">
                <div className="shrink-0">
                  <div className="w-10 h-10 rounded-full bg-[#1a2744] text-white flex items-center justify-center font-bold text-sm">
                    {step.step}
                  </div>
                  {idx < processSteps.length - 1 && (
                    <div className="w-0.5 h-8 bg-gray-200 mx-auto mt-1" />
                  )}
                </div>
                <div className="flex-1 pb-2">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold text-gray-900">{step.title}</h3>
                    <Badge variant="secondary" className="text-xs">
                      <Clock className="h-3 w-3 mr-1" /> {step.time}
                    </Badge>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{step.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Expected timeline</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-orange-200">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">Day 1</div>
                <h3 className="font-semibold text-gray-900 mb-2">Application prepared</h3>
                <p className="text-gray-500 text-sm">You upload documents, we prepare and submit your MTO application the same day.</p>
              </CardContent>
            </Card>
            <Card className="border-blue-200">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">Days 2–5</div>
                <h3 className="font-semibold text-gray-900 mb-2">MTO processing</h3>
                <p className="text-gray-500 text-sm">The Ontario MTO reviews and processes your application. We monitor and follow up daily.</p>
              </CardContent>
            </Card>
            <Card className="border-green-200">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">Day 5–10</div>
                <h3 className="font-semibold text-gray-900 mb-2">CVOR approved</h3>
                <p className="text-gray-500 text-sm">You receive your CVOR certificate by email. You&apos;re legally ready to operate in Ontario.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Common mistakes */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Common CVOR application mistakes</h2>
          <p className="text-gray-500 mb-8">
            These are the top reasons MTO rejects CVOR applications. We catch every one of these before submission.
          </p>
          <div className="space-y-4">
            {commonMistakes.map((item) => (
              <div key={item.mistake} className="flex gap-4 p-5 border border-red-100 bg-red-50 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{item.mistake}</h3>
                  <p className="text-gray-600 text-sm">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-5 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
              <Shield className="h-5 w-5" /> TruckComply&apos;s guarantee
            </h3>
            <p className="text-green-700 text-sm">
              We review every application against the current MTO checklist before submission. Our error rate is less than 1%. If your application is rejected due to our error, we resubmit at no charge.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">What Ontario carriers say</h2>
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

      {/* Pricing CTA */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-[#1a2744] rounded-2xl p-8 text-white text-center">
            <Badge className="bg-orange-600/20 text-orange-400 border-orange-600/30 mb-4">
              Flat-fee pricing
            </Badge>
            <h2 className="text-3xl font-bold mb-3">CVOR Application — $149</h2>
            <p className="text-gray-300 mb-6">
              One-time service fee. Includes application preparation, MTO submission, and certificate delivery.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8 text-left">
              {[
                "Application preparation",
                "Document review",
                "MTO form completion",
                "Error checking",
                "MTO submission",
                "Certificate delivery",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-gray-300">
                  <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0" />
                  {item}
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="xl">
                <Link href="/checkout?service=cvor-ontario" className="flex items-center gap-2">
                  Start Your CVOR Application — $149 <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="xl" variant="outline" className="border-white text-white hover:bg-white/10 bg-transparent">
                <a href="tel:+14165550100" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" /> 416-555-0100
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">CVOR FAQ</h2>
          <div className="space-y-6">
            {faqItems.map((faq) => (
              <div key={faq.q} className="border-b border-gray-200 pb-6">
                <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <p className="text-gray-500 mb-4">Still have questions?</p>
            <Button asChild variant="navy" size="lg">
              <Link href="/checkout?service=cvor-ontario">
                Get Started — $149
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
