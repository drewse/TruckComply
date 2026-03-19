"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { X, ArrowRight } from "lucide-react"

export function StickyCTA() {
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400 && !dismissed) {
        setVisible(true)
      } else if (window.scrollY <= 400) {
        setVisible(false)
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [dismissed])

  if (!visible || dismissed) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#1a2744] text-white py-3 px-4 shadow-2xl border-t border-[#243359]">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm sm:text-base truncate">
            Ready to get your CVOR? We handle everything.
          </p>
          <p className="text-xs text-gray-400 hidden sm:block">One-time setup fee. Stress-free compliance.</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Button asChild size="sm" className="whitespace-nowrap">
            <Link href="/checkout" className="flex items-center gap-1.5">
              Start Now — $149 <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <button
            onClick={() => { setDismissed(true); setVisible(false) }}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
