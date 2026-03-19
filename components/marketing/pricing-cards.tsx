import Link from "next/link"
import { Check, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const plans = [
  {
    name: "Setup Package",
    price: "$149",
    period: "one-time",
    description: "Get your business started and legally compliant",
    badge: null,
    features: [
      "CVOR Application (Ontario)",
      "Federal DOT registration guidance",
      "Document checklist & templates",
      "Step-by-step onboarding",
      "Email support",
      "Dashboard access",
    ],
    cta: "Start Your Application",
    href: "/checkout?plan=setup",
    highlight: false,
  },
  {
    name: "Monthly Compliance",
    price: "$39",
    period: "per month",
    description: "Stay compliant year-round without the headaches",
    badge: "Most Popular",
    features: [
      "Everything in Setup Package",
      "CVOR renewal reminders",
      "IFTA filing assistance",
      "IRP renewal support",
      "Compliance calendar",
      "Priority support",
      "Document storage",
      "Admin portal access",
    ],
    cta: "Start Free With Setup",
    href: "/checkout?plan=setup",
    highlight: true,
  },
]

export function PricingCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
      {plans.map((plan) => (
        <Card
          key={plan.name}
          className={`relative ${plan.highlight ? "border-orange-500 border-2 shadow-lg" : ""}`}
        >
          {plan.badge && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge className="bg-orange-600 text-white px-3 py-1">{plan.badge}</Badge>
            </div>
          )}
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">{plan.name}</CardTitle>
            <CardDescription>{plan.description}</CardDescription>
            <div className="mt-3">
              <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
              <span className="text-gray-500 ml-1 text-sm">/{plan.period}</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm text-gray-700">
                  <Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                  {feature}
                </li>
              ))}
            </ul>
            <Button
              asChild
              className="w-full"
              variant={plan.highlight ? "default" : "navy"}
              size="lg"
            >
              <Link href={plan.href} className="flex items-center justify-center gap-2">
                {plan.cta} <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
