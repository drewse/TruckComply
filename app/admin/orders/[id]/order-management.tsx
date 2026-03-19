"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import type { ServiceOrderStatus } from "@/types/database"

const STATUS_OPTIONS: { value: ServiceOrderStatus; label: string }[] = [
  { value: "pending_payment", label: "Pending Payment" },
  { value: "paid", label: "Paid" },
  { value: "in_progress", label: "In Progress" },
  { value: "waiting_documents", label: "Waiting Documents" },
  { value: "submitted", label: "Submitted to MTO" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
]

interface OrderManagementProps {
  order: { id: string; status: ServiceOrderStatus; organization_id: string; assigned_partner_id: string | null }
  partners: { id: string; full_name: string | null; email: string }[]
  currentPartner: { full_name: string | null; email: string } | null
}

export function OrderManagement({ order, partners, currentPartner }: OrderManagementProps) {
  const router = useRouter()
  const [status, setStatus] = useState(order.status)
  const [partnerId, setPartnerId] = useState(order.assigned_partner_id || "")
  const [note, setNote] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    const supabase = createClient()

    const updates: Record<string, unknown> = { status }
    if (partnerId) updates.assigned_partner_id = partnerId
    if (status === "completed") updates.completed_at = new Date().toISOString()

    await supabase.from("service_orders").update(updates).eq("id", order.id)

    if (note.trim()) {
      await supabase.from("notes").insert({
        organization_id: order.organization_id,
        service_order_id: order.id,
        author_id: (await supabase.auth.getUser()).data.user!.id,
        content: note,
        is_internal: true,
      })
      setNote("")
    }

    setSuccess(true)
    setLoading(false)
    router.refresh()
    setTimeout(() => setSuccess(false), 2000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Order</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status */}
        <div className="space-y-1.5">
          <Label>Status</Label>
          <Select value={status} onValueChange={(v) => setStatus(v as ServiceOrderStatus)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Partner assignment */}
        <div className="space-y-1.5">
          <Label>Assign Partner</Label>
          <Select value={partnerId} onValueChange={setPartnerId}>
            <SelectTrigger>
              <SelectValue placeholder="Select partner..." />
            </SelectTrigger>
            <SelectContent>
              {partners.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.full_name || p.email}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {currentPartner && (
            <p className="text-xs text-gray-400">
              Currently: {currentPartner.full_name || currentPartner.email}
            </p>
          )}
        </div>

        {/* Internal note */}
        <div className="space-y-1.5">
          <Label>Add Internal Note</Label>
          <Textarea
            placeholder="Add a note for the team..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
          />
        </div>

        <Button onClick={handleSave} disabled={loading} className="w-full">
          {loading ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</>
          ) : (
            "Save Changes"
          )}
        </Button>
        {success && <p className="text-sm text-green-600 text-center">Saved!</p>}
      </CardContent>
    </Card>
  )
}
