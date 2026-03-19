"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-orange-600 rounded-lg p-1.5">
              <Truck className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl text-[#1a2744]">TruckComply</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/cvor-ontario" className="text-sm font-medium text-gray-600 hover:text-orange-600 transition-colors">
              CVOR Ontario
            </Link>
            <Link href="/start-trucking-canada" className="text-sm font-medium text-gray-600 hover:text-orange-600 transition-colors">
              Start a Trucking Co.
            </Link>
            <Link href="/#pricing" className="text-sm font-medium text-gray-600 hover:text-orange-600 transition-colors">
              Pricing
            </Link>
            <Link href="/auth/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Login
            </Link>
            <Button asChild size="sm">
              <Link href="/checkout">Get Started — $149</Link>
            </Button>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-md text-gray-600"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-4 space-y-3">
          <Link href="/cvor-ontario" className="block text-sm font-medium text-gray-700 py-2" onClick={() => setMobileOpen(false)}>
            CVOR Ontario
          </Link>
          <Link href="/start-trucking-canada" className="block text-sm font-medium text-gray-700 py-2" onClick={() => setMobileOpen(false)}>
            Start a Trucking Co.
          </Link>
          <Link href="/#pricing" className="block text-sm font-medium text-gray-700 py-2" onClick={() => setMobileOpen(false)}>
            Pricing
          </Link>
          <Link href="/auth/login" className="block text-sm font-medium text-gray-700 py-2" onClick={() => setMobileOpen(false)}>
            Login
          </Link>
          <Button asChild className="w-full" size="sm">
            <Link href="/checkout">Get Started — $149</Link>
          </Button>
        </div>
      )}
    </nav>
  )
}
