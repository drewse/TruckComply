import type { Metadata } from "next"
import Link from "next/link"
import { SignupForm } from "./signup-form"
import { Truck } from "lucide-react"

export const metadata: Metadata = {
  title: "Create Account — TruckComply",
  robots: { index: false, follow: false },
}

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="bg-orange-600 rounded-lg p-2">
              <Truck className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-2xl text-[#1a2744]">TruckComply</span>
          </Link>
          <h1 className="mt-6 text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="text-gray-500 mt-1">Start your 30-day compliance journey</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
          <SignupForm />
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-orange-600 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
