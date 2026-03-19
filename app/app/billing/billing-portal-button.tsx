"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, ExternalLink } from "lucide-react"

export function BillingPortalButton() {
  const [loading, setLoading] = useState(false)

  const handlePortal = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/billing/portal", {
        method: "POST",
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
    <Button variant="outline" onClick={handlePortal} disabled={loading}>
      {loading ? (
        <><Loader2 className="h-4 w-4 animate-spin" /> Loading...</>
      ) : (
        <>Manage Billing <ExternalLink className="h-4 w-4" /></>
      )}
    </Button>
  )
}
