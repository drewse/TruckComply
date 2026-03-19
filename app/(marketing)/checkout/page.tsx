import type { Metadata } from "next"
import { CheckoutForm } from "./checkout-form"
import { Shield, Lock, CreditCard, CheckCircle2 } from "lucide-react"

export const metadata: Metadata = {
  title: "Get Started — TruckComply",
  description: "Start your CVOR application today. $149 one-time fee.",
  robots: { index: false, follow: false },
}

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Start your compliance journey</h1>
          <p className="text-gray-500">Complete your order below. You&apos;ll be up and running in minutes.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form */}
          <div className="lg:col-span-3">
            <CheckoutForm />
          </div>

          {/* Order summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sticky top-24">
              <h2 className="font-semibold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">CVOR Setup Package</span>
                  <span className="font-medium text-gray-900">$149.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">HST (13%)</span>
                  <span className="font-medium text-gray-900">$19.37</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between font-semibold">
                  <span className="text-gray-900">Total today</span>
                  <span className="text-gray-900">$168.37 CAD</span>
                </div>
              </div>

              {/* What's included */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">What&apos;s included:</h3>
                <ul className="space-y-2">
                  {[
                    "CVOR application preparation",
                    "Document review & error checking",
                    "MTO submission on your behalf",
                    "Certificate delivery by email",
                    "Dashboard access for tracking",
                    "Email & phone support",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs text-gray-600">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-600 shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Trust badges */}
              <div className="space-y-2 pt-4 border-t border-gray-200">
                {[
                  { icon: Shield, text: "30-day money-back guarantee" },
                  { icon: Lock, text: "256-bit SSL encryption" },
                  { icon: CreditCard, text: "Powered by Stripe — secure checkout" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2 text-xs text-gray-500">
                    <Icon className="h-3.5 w-3.5 text-gray-400" />
                    {text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
