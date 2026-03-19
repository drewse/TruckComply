import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { OrderStatusBadge } from "@/components/dashboard/status-badge"
import { formatDate, formatCurrency } from "@/lib/utils"
import { Truck, Clock } from "lucide-react"

export default async function ServicesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: org } = await supabase
    .from("organizations")
    .select("id")
    .eq("owner_id", user.id)
    .single()

  const { data: orders } = await supabase
    .from("service_orders")
    .select(`
      *,
      compliance_tasks(id, title, status, due_date),
      partner_assignments(*, profiles!partner_id(full_name))
    `)
    .eq("organization_id", org?.id || "")
    .order("created_at", { ascending: false })

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Services</h1>
        <p className="text-gray-500 mt-1">Track the status of your compliance applications</p>
      </div>

      {orders && orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => {
            const tasks = order.compliance_tasks || []
            const completedTasks = tasks.filter((t: { status: string }) => t.status === "completed").length
            const totalTasks = tasks.length
            const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

            return (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="capitalize">
                      {order.service_type.replace(/_/g, " ")}
                    </CardTitle>
                    <OrderStatusBadge status={order.status} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Order Date</p>
                      <p className="font-medium text-gray-900">{formatDate(order.created_at)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Amount Paid</p>
                      <p className="font-medium text-gray-900">
                        {order.amount_paid ? formatCurrency(order.amount_paid / 100) : "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Assigned To</p>
                      <p className="font-medium text-gray-900">
                        {order.partner_assignments?.[0]?.profiles?.full_name || "Pending assignment"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Completed</p>
                      <p className="font-medium text-gray-900">
                        {order.completed_at ? formatDate(order.completed_at) : "In progress"}
                      </p>
                    </div>
                  </div>

                  {/* Progress */}
                  {totalTasks > 0 && (
                    <div>
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Progress</span>
                        <span>{completedTasks}/{totalTasks} tasks complete</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-orange-600 h-2 rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Tasks */}
                  {tasks.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Tasks</h4>
                      <div className="space-y-2">
                        {tasks.map((task: { id: string; title: string; status: string; due_date: string | null }) => (
                          <div key={task.id} className="flex items-center gap-3 text-sm">
                            <div className={`w-2 h-2 rounded-full shrink-0 ${
                              task.status === "completed" ? "bg-green-500" :
                                task.status === "in_progress" ? "bg-blue-500" :
                                  task.status === "blocked" ? "bg-red-500" : "bg-gray-300"
                            }`} />
                            <span className={task.status === "completed" ? "line-through text-gray-400" : "text-gray-700"}>
                              {task.title}
                            </span>
                            {task.due_date && task.status !== "completed" && (
                              <span className="flex items-center gap-1 text-xs text-gray-400 ml-auto">
                                <Clock className="h-3 w-3" /> {formatDate(task.due_date)}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-400">
          <Truck className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">No services yet</h3>
          <p className="text-sm mb-4">Get started with your CVOR application</p>
        </div>
      )}
    </div>
  )
}
