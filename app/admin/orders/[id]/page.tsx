import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { OrderStatusBadge, TaskStatusBadge } from "@/components/dashboard/status-badge"
import { Badge } from "@/components/ui/badge"
import { OrderManagement } from "./order-management"
import { formatDate, formatCurrency } from "@/lib/utils"

interface Props {
  params: Promise<{ id: string }>
}

export default async function AdminOrderDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: order } = await supabase
    .from("service_orders")
    .select(`
      *,
      organizations(*, profiles!owner_id(full_name, email, phone)),
      profiles!assigned_partner_id(full_name, email),
      compliance_tasks(*),
      documents(*),
      notes(*, profiles!author_id(full_name, role))
    `)
    .eq("id", id)
    .single()

  if (!order) notFound()

  const { data: partners } = await supabase
    .from("profiles")
    .select("id, full_name, email")
    .eq("role", "partner")

  const org = order.organizations as { name: string; province: string; city: string; profiles: { full_name: string | null; email: string; phone: string | null } } | null
  const partner = order.profiles as { full_name: string | null; email: string } | null

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {order.service_type.replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase())}
            </h1>
            <p className="text-gray-500 mt-1">Order #{id.slice(0, 8).toUpperCase()}</p>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer info */}
          <Card>
            <CardHeader>
              <CardTitle>Customer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-gray-500">Organization</p>
                  <p className="font-medium text-gray-900">{org?.name}</p>
                </div>
                <div>
                  <p className="text-gray-500">Province</p>
                  <Badge variant="secondary">{org?.province}</Badge>
                </div>
                <div>
                  <p className="text-gray-500">Owner</p>
                  <p className="font-medium text-gray-900">{org?.profiles?.full_name || "—"}</p>
                </div>
                <div>
                  <p className="text-gray-500">Email</p>
                  <p className="font-medium text-gray-900">{org?.profiles?.email}</p>
                </div>
                <div>
                  <p className="text-gray-500">Amount Paid</p>
                  <p className="font-medium text-gray-900">
                    {order.amount_paid ? formatCurrency(order.amount_paid / 100) : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Order Date</p>
                  <p className="font-medium text-gray-900">{formatDate(order.created_at)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tasks */}
          <Card>
            <CardHeader>
              <CardTitle>Compliance Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              {order.compliance_tasks && order.compliance_tasks.length > 0 ? (
                <div className="space-y-3">
                  {(order.compliance_tasks as { id: string; title: string; status: string; description: string | null; due_date: string | null }[]).map((task) => (
                    <div key={task.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-sm text-gray-900">{task.title}</p>
                          <TaskStatusBadge status={task.status as "pending" | "in_progress" | "completed" | "blocked"} />
                        </div>
                        {task.description && (
                          <p className="text-xs text-gray-500">{task.description}</p>
                        )}
                        {task.due_date && (
                          <p className="text-xs text-gray-400 mt-1">Due: {formatDate(task.due_date)}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400">No tasks yet</p>
              )}
            </CardContent>
          </Card>

          {/* Documents */}
          {order.documents && order.documents.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {(order.documents as { id: string; name: string; status: string; created_at: string }[]).map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg text-sm">
                      <span className="text-gray-800">{doc.name}</span>
                      <Badge variant={doc.status === "approved" ? "success" : doc.status === "rejected" ? "destructive" : "warning"}>
                        {doc.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Management panel */}
        <div className="space-y-6">
          <OrderManagement
            order={order}
            partners={partners || []}
            currentPartner={partner}
          />
        </div>
      </div>
    </div>
  )
}
