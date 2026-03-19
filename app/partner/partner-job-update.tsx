"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import type { ServiceOrderStatus } from "@/types/database"

interface Task {
  id: string
  title: string
  status: string
}

interface PartnerJobUpdateProps {
  orderId: string
  currentStatus: ServiceOrderStatus
  tasks: Task[]
}

export function PartnerJobUpdate({ orderId, currentStatus, tasks }: PartnerJobUpdateProps) {
  const router = useRouter()
  const [status, setStatus] = useState(currentStatus)
  const [taskStatuses, setTaskStatuses] = useState<Record<string, string>>(
    Object.fromEntries(tasks.map(t => [t.id, t.status]))
  )
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    const supabase = createClient()

    // Update order status
    await supabase
      .from("service_orders")
      .update({
        status,
        ...(status === "completed" ? { completed_at: new Date().toISOString() } : {}),
      })
      .eq("id", orderId)

    // Update task statuses
    for (const [taskId, taskStatus] of Object.entries(taskStatuses)) {
      await supabase
        .from("compliance_tasks")
        .update({
          status: taskStatus,
          ...(taskStatus === "completed" ? { completed_at: new Date().toISOString() } : {}),
        })
        .eq("id", taskId)
    }

    setSuccess(true)
    setLoading(false)
    router.refresh()
    setTimeout(() => setSuccess(false), 2000)
  }

  return (
    <div className="border-t border-gray-200 pt-4 space-y-3">
      <h4 className="text-sm font-semibold text-gray-700">Update Status</h4>

      <div className="space-y-1.5">
        <Label className="text-xs">Order Status</Label>
        <Select value={status} onValueChange={(v) => setStatus(v as ServiceOrderStatus)}>
          <SelectTrigger className="h-8 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[
              { value: "in_progress", label: "In Progress" },
              { value: "waiting_documents", label: "Waiting Documents" },
              { value: "submitted", label: "Submitted to MTO" },
              { value: "completed", label: "Completed" },
            ].map(opt => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {tasks.length > 0 && (
        <div className="space-y-2">
          <Label className="text-xs">Update Tasks</Label>
          {tasks.map((task) => (
            <div key={task.id} className="flex items-center gap-2">
              <span className="text-xs text-gray-600 flex-1 truncate">{task.title}</span>
              <Select
                value={taskStatuses[task.id] || task.status}
                onValueChange={(v) => setTaskStatuses(prev => ({ ...prev, [task.id]: v }))}
              >
                <SelectTrigger className="h-7 text-xs w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["pending", "in_progress", "completed", "blocked"].map(s => (
                    <SelectItem key={s} value={s} className="text-xs capitalize">{s.replace("_", " ")}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-3">
        <Button onClick={handleSave} disabled={loading} size="sm">
          {loading ? <><Loader2 className="h-3 w-3 animate-spin" /> Saving...</> : "Save Update"}
        </Button>
        {success && <span className="text-xs text-green-600">Saved!</span>}
      </div>
    </div>
  )
}
