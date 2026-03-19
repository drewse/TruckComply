import type { Metadata } from "next"
import Link from "next/link"
import { CheckCircle2, ArrowRight, Mail, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Payment Successful — TruckComply",
  robots: { index: false, follow: false },
}

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-20">
      <div className="max-w-lg w-full text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Payment successful!</h1>
        <p className="text-gray-500 text-lg mb-8">
          Welcome to TruckComply. Your account is being set up right now.
        </p>

        <div className="bg-white rounded-xl border border-gray-200 p-6 text-left mb-8 space-y-4">
          <h2 className="font-semibold text-gray-900">What happens next:</h2>
          {[
            {
              icon: Mail,
              step: "Check your email",
              detail: "Your login credentials and onboarding instructions are being sent now.",
            },
            {
              icon: Clock,
              step: "We start your application",
              detail: "Our compliance team begins reviewing your file within 1 business day.",
            },
            {
              icon: CheckCircle2,
              step: "Upload your documents",
              detail: "Log in to your dashboard to upload the required documents.",
            },
          ].map(({ icon: Icon, step, detail }) => (
            <div key={step} className="flex gap-3">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
                <Icon className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">{step}</p>
                <p className="text-gray-500 text-xs mt-0.5">{detail}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <Button asChild size="lg" className="w-full">
            <Link href="/app" className="flex items-center gap-2 justify-center">
              Go to Your Dashboard <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <p className="text-sm text-gray-400">
            Questions? Email{" "}
            <a href="mailto:support@truckcomply.ca" className="text-orange-600 hover:underline">
              support@truckcomply.ca
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
