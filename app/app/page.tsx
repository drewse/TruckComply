import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { OrderStatusBadge, TaskStatusBadge } from "@/components/dashboard/status-badge"
import {
  CheckCircle2, AlertCircle, Clock, ArrowRight, Upload,
  FileText, CreditCard, Truck
} from "lucide-react"
import Link from "next/link"
import { formatDate } from "@/lib/utils"

export default async function CustomerOverviewPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email")
    .eq("id", user.id)
    .single()

  const { data: org } = await supabase
    .from("organizations")
    .select("*")
    .eq("owner_id", user.id)
    .single()

  const { data: orders } = await supabase
    .from("service_orders")
    .select("*")
    .eq("organization_id", org?.id || "")
    .order("created_at", { ascending: false })
    .limit(5)

  const { data: tasks } = await supabase
    .from("compliance_tasks")
    .select("*")
    .eq("organization_id", org?.id || "")
    .neq("status", "completed")
    .order("due_date", { ascending: true })
    .limit(5)

  const { data: documents } = await supabase
    .from("documents")
    .select("*")
    .eq("organization_id", org?.id || "")
    .order("created_at", { ascending: false })
    .limit(5)

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("organization_id", org?.id || "")
    .eq("status", "active")
    .single()

  const pendingTasks = tasks?.filter(t => t.status !== "completed").length || 0
  const completedTasks = tasks?.filter(t => t.status === "completed").length || 0
  const activeOrders = orders?.filter(o => !["completed", "cancelled"].includes(o.status)).length || 0

  const firstName = profile?.full_name?.split(" ")[0] || "there"

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Good morning, {firstName}</h1>
        <p className="text-gray-500 mt-1">
          {org?.name || "Your organization"} — Compliance Dashboard
        </p>
      </div>

      {/* No org setup yet */}
      {!org && (
        <Card className="mb-6 border-orange-200 bg-orange-50">
          <CardContent className="p-6 flex items-start gap-4">
            <AlertCircle className="h-5 w-5 text-orange-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">Complete your setup</h3>
              <p className="text-sm text-gray-600 mb-3">
                Your organization profile isn&apos;t fully set up. Add your company details to get started.
              </p>
              <Button asChild size="sm">
                <Link href="/app/settings">Complete Setup</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Active Orders",
            value: activeOrders,
            icon: Truck,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            label: "Pending Tasks",
            value: pendingTasks,
            icon: Clock,
            color: "text-orange-600",
            bg: "bg-orange-50",
          },
          {
            label: "Documents",
            value: documents?.length || 0,
            icon: FileText,
            color: "text-purple-600",
            bg: "bg-purple-50",
          },
          {
            label: "Plan",
            value: subscription ? "Monthly" : "Setup",
            icon: CreditCard,
            color: "text-green-600",
            bg: "bg-green-50",
          },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-full ${stat.bg} flex items-center justify-center`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Service Orders</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/app/services">View all <ArrowRight className="h-3 w-3 ml-1" /></Link>
            </Button>
          </CardHeader>
          <CardContent>
            {orders && orders.length > 0 ? (
              <div className="space-y-3">
                {orders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm text-gray-900 capitalize">
                        {order.service_type.replace(/_/g, " ")}
                      </p>
                      <p className="text-xs text-gray-500">{formatDate(order.created_at)}</p>
                    </div>
                    <OrderStatusBadge status={order.status} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Truck className="h-8 w-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No active orders yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tasks */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Action Required</CardTitle>
            {pendingTasks > 0 && (
              <Badge variant="warning">{pendingTasks} pending</Badge>
            )}
          </CardHeader>
          <CardContent>
            {tasks && tasks.length > 0 ? (
              <div className="space-y-3">
                {tasks.map((task) => (
                  <div key={task.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    {task.status === "completed" ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                    ) : (
                      <Clock className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{task.title}</p>
                      {task.due_date && (
                        <p className="text-xs text-gray-500">Due: {formatDate(task.due_date)}</p>
                      )}
                    </div>
                    <TaskStatusBadge status={task.status} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <CheckCircle2 className="h-8 w-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">All tasks complete!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Documents */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Documents</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/app/documents">
                Upload <Upload className="h-3 w-3 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {documents && documents.length > 0 ? (
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 truncate max-w-[160px]">{doc.name}</p>
                        <p className="text-xs text-gray-500">{formatDate(doc.created_at)}</p>
                      </div>
                    </div>
                    <Badge variant={
                      doc.status === "approved" ? "success" :
                        doc.status === "rejected" ? "destructive" : "warning"
                    }>
                      {doc.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Upload className="h-8 w-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm mb-3">No documents uploaded yet</p>
                <Button asChild size="sm" variant="outline">
                  <Link href="/app/documents">Upload Documents</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upgrade CTA */}
        {!subscription && (
          <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50">
            <CardContent className="p-6">
              <h3 className="font-bold text-gray-900 text-lg mb-2">
                Upgrade to Monthly Compliance
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Get CVOR renewal reminders, IFTA quarterly filings, and ongoing support for just $39/month.
              </p>
              <ul className="space-y-2 mb-5">
                {[
                  "CVOR renewal tracking",
                  "IFTA quarterly filing assistance",
                  "IRP renewal support",
                  "Priority support",
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button asChild size="sm" className="w-full">
                <Link href="/app/billing">Upgrade — $39/month</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
