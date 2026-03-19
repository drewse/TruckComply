import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { OrderStatusBadge } from "@/components/dashboard/status-badge"
import { PartnerJobUpdate } from "./partner-job-update"
import { formatDate, formatCurrency } from "@/lib/utils"
import { ClipboardList, ArrowRight } from "lucide-react"

export default async function PartnerDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single()

  const { data: assignedOrders } = await supabase
    .from("service_orders")
    .select(`
      *,
      organizations(name, province, city),
      compliance_tasks(*),
      documents(*)
    `)
    .eq("assigned_partner_id", user.id)
    .not("status", "in", "(completed,cancelled)")
    .order("created_at", { ascending: false })

  const firstName = profile?.full_name?.split(" ")[0] || "Partner"

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Jobs, {firstName}</h1>
        <p className="text-gray-500 mt-1">
          {assignedOrders?.length || 0} active assignments
        </p>
      </div>

      {assignedOrders && assignedOrders.length > 0 ? (
        <div className="space-y-6">
          {assignedOrders.map((order) => {
            const org = order.organizations as { name: string; province: string; city: string } | null
            const tasks = (order.compliance_tasks as { id: string; title: string; status: string; description: string | null }[]) || []
            const docs = (order.documents as { id: string; name: string; status: string }[]) || []
            const completedTasks = tasks.filter(t => t.status === "completed").length
            const progress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0

            return (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                      <CardTitle className="text-lg">{org?.name}</CardTitle>
                      <p className="text-sm text-gray-500 mt-0.5 capitalize">
                        {order.service_type.replace(/_/g, " ")} · {org?.city}, {org?.province}
                      </p>
                    </div>
                    <OrderStatusBadge status={order.status} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-5">
                  {/* Order info */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Received</p>
                      <p className="font-medium text-gray-900">{formatDate(order.created_at)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Documents</p>
                      <p className="font-medium text-gray-900">{docs.length} uploaded</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Tasks</p>
                      <p className="font-medium text-gray-900">{completedTasks}/{tasks.length} done</p>
                    </div>
                  </div>

                  {/* Progress */}
                  <div>
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Overall Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-orange-600 h-2 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Tasks */}
                  {tasks.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Tasks</h4>
                      <div className="space-y-2">
                        {tasks.map((task) => (
                          <div key={task.id} className="flex items-center gap-2 text-sm">
                            <div className={`w-2 h-2 rounded-full ${
                              task.status === "completed" ? "bg-green-500" :
                                task.status === "in_progress" ? "bg-blue-500" : "bg-gray-300"
                            }`} />
                            <span className={task.status === "completed" ? "line-through text-gray-400" : "text-gray-700"}>
                              {task.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Documents */}
                  {docs.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Customer Documents</h4>
                      <div className="space-y-1">
                        {docs.map((doc) => (
                          <div key={doc.id} className="flex items-center justify-between text-sm">
                            <span className="text-gray-700 truncate">{doc.name}</span>
                            <Badge variant={doc.status === "approved" ? "success" : doc.status === "rejected" ? "destructive" : "warning"} className="ml-2">
                              {doc.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Status update */}
                  <PartnerJobUpdate orderId={order.id} currentStatus={order.status} tasks={tasks} />
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-400">
          <ClipboardList className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">No active assignments</h3>
          <p className="text-sm">When an admin assigns an order to you, it will appear here.</p>
        </div>
      )}
    </div>
  )
}
