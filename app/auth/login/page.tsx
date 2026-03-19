import type { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"
import { LoginForm } from "./login-form"
import { Truck } from "lucide-react"

export const metadata: Metadata = {
  title: "Login — TruckComply",
  robots: { index: false, follow: false },
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="bg-orange-600 rounded-lg p-2">
              <Truck className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-2xl text-[#1a2744]">TruckComply</span>
          </Link>
          <h1 className="mt-6 text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-gray-500 mt-1">Sign in to your compliance dashboard</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
          <Suspense fallback={<div className="animate-pulse h-48 bg-gray-100 rounded-lg" />}>
            <LoginForm />
          </Suspense>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/checkout" className="text-orange-600 font-medium hover:underline">
            Get started — $149
          </Link>
        </p>
      </div>
    </div>
  )
}
