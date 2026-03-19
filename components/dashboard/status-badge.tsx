import { Badge } from "@/components/ui/badge"
import type { ServiceOrderStatus, TaskStatus, DocumentStatus, SubscriptionStatus } from "@/types/database"

export function OrderStatusBadge({ status }: { status: ServiceOrderStatus }) {
  const config: Record<ServiceOrderStatus, { label: string; variant: "default" | "secondary" | "destructive" | "success" | "warning" | "info" | "outline" }> = {
    pending_payment: { label: "Pending Payment", variant: "warning" },
    paid: { label: "Paid", variant: "info" },
    in_progress: { label: "In Progress", variant: "default" },
    waiting_documents: { label: "Waiting Docs", variant: "warning" },
    submitted: { label: "Submitted to MTO", variant: "info" },
    completed: { label: "Completed", variant: "success" },
    cancelled: { label: "Cancelled", variant: "destructive" },
  }

  const { label, variant } = config[status]
  return <Badge variant={variant}>{label}</Badge>
}

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  const config: Record<TaskStatus, { label: string; variant: "default" | "secondary" | "destructive" | "success" | "warning" | "info" | "outline" }> = {
    pending: { label: "Pending", variant: "secondary" },
    in_progress: { label: "In Progress", variant: "info" },
    completed: { label: "Completed", variant: "success" },
    blocked: { label: "Blocked", variant: "destructive" },
  }

  const { label, variant } = config[status]
  return <Badge variant={variant}>{label}</Badge>
}

export function DocumentStatusBadge({ status }: { status: DocumentStatus }) {
  const config: Record<DocumentStatus, { label: string; variant: "default" | "secondary" | "destructive" | "success" | "warning" | "info" | "outline" }> = {
    pending: { label: "Pending Review", variant: "warning" },
    approved: { label: "Approved", variant: "success" },
    rejected: { label: "Rejected", variant: "destructive" },
  }

  const { label, variant } = config[status]
  return <Badge variant={variant}>{label}</Badge>
}

export function SubscriptionStatusBadge({ status }: { status: SubscriptionStatus }) {
  const config: Record<SubscriptionStatus, { label: string; variant: "default" | "secondary" | "destructive" | "success" | "warning" | "info" | "outline" }> = {
    active: { label: "Active", variant: "success" },
    past_due: { label: "Past Due", variant: "warning" },
    cancelled: { label: "Cancelled", variant: "destructive" },
    trialing: { label: "Trial", variant: "info" },
    incomplete: { label: "Incomplete", variant: "warning" },
  }

  const { label, variant } = config[status]
  return <Badge variant={variant}>{label}</Badge>
}
