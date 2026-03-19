import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"

export default async function PartnerCompletedPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: completedOrders } = await supabase
    .from("service_orders")
    .select(`
      *,
      organizations(name, province)
    `)
    .eq("assigned_partner_id", user.id)
    .eq("status", "completed")
    .order("completed_at", { ascending: false })

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Completed Jobs</h1>
        <p className="text-gray-500 mt-1">{completedOrders?.length || 0} jobs completed</p>
      </div>

      <div className="space-y-3">
        {completedOrders?.map((order) => {
          const org = order.organizations as { name: string; province: string } | null
          return (
            <Card key={order.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{org?.name}</p>
                    <p className="text-sm text-gray-500 capitalize mt-0.5">
                      {order.service_type.replace(/_/g, " ")} · {org?.province}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Completed: {order.completed_at ? formatDate(order.completed_at) : "—"}
                    </p>
                  </div>
                  <Badge variant="success">Completed</Badge>
                </div>
              </CardContent>
            </Card>
          )
        })}
        {!completedOrders?.length && (
          <p className="text-center text-gray-400 py-12 text-sm">No completed jobs yet</p>
        )}
      </div>
    </div>
  )
}
