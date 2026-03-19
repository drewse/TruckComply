"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, ArrowRight } from "lucide-react"

interface UpgradeButtonProps {
  orgId: string
  email: string
}

export function UpgradeButton({ orgId, email }: UpgradeButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleUpgrade = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/billing/create-subscription-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orgId, email }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleUpgrade} disabled={loading} className="w-full sm:w-auto">
      {loading ? (
        <><Loader2 className="h-4 w-4 animate-spin" /> Processing...</>
      ) : (
        <>Upgrade Now — $39/month <ArrowRight className="h-4 w-4" /></>
      )}
    </Button>
  )
}
