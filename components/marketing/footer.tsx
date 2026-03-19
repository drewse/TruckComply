import Link from "next/link"
import { Truck } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-[#1a2744] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-orange-600 rounded-lg p-1.5">
                <Truck className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl">TruckComply</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Canada&apos;s trusted trucking compliance platform. We handle the paperwork so you can focus on the road.
            </p>
            <p className="text-gray-500 text-xs mt-4">
              Serving Ontario, with Canada-wide expansion coming in 2026.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-sm mb-3 text-gray-300">Services</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/cvor-ontario" className="hover:text-white transition-colors">CVOR Application</Link></li>
              <li><Link href="/start-trucking-canada" className="hover:text-white transition-colors">Start a Trucking Co.</Link></li>
              <li><Link href="/#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/checkout" className="hover:text-white transition-colors">Get Started</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-sm mb-3 text-gray-300">Company</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/auth/login" className="hover:text-white transition-colors">Login</Link></li>
              <li><Link href="/auth/signup" className="hover:text-white transition-colors">Sign Up</Link></li>
              <li><a href="mailto:support@truckcomply.ca" className="hover:text-white transition-colors">support@truckcomply.ca</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs">
            &copy; {new Date().getFullYear()} TruckComply Inc. All rights reserved.
          </p>
          <p className="text-gray-500 text-xs">
            Ontario, Canada
          </p>
        </div>
      </div>
    </footer>
  )
}
