import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { OrderStatusBadge } from "@/components/dashboard/status-badge"
import { formatDate, formatCurrency } from "@/lib/utils"
import { ClipboardList, ArrowRight } from "lucide-react"
import Link from "next/link"

export default async function AdminOrdersPage() {
  const supabase = await createClient()

  const { data: orders } = await supabase
    .from("service_orders")
    .select(`
      *,
      organizations(name, province),
      profiles!assigned_partner_id(full_name)
    `)
    .order("created_at", { ascending: false })

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Service Orders</h1>
        <p className="text-gray-500 mt-1">{orders?.length || 0} total orders</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left p-4 font-semibold text-gray-700">Customer</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Service</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Status</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Assigned</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Amount</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Date</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders?.map((order) => {
                  const org = order.organizations as { name: string; province: string } | null
                  const partner = order.profiles as { full_name: string | null } | null

                  return (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-gray-900">{org?.name || "—"}</p>
                          <Badge variant="secondary" className="text-xs mt-0.5">{org?.province}</Badge>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="capitalize text-gray-700">
                          {order.service_type.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="p-4">
                        <OrderStatusBadge status={order.status} />
                      </td>
                      <td className="p-4 text-gray-700">
                        {partner?.full_name || (
                          <span className="text-gray-400 italic">Unassigned</span>
                        )}
                      </td>
                      <td className="p-4 font-medium text-gray-900">
                        {order.amount_paid ? formatCurrency(order.amount_paid / 100) : "—"}
                      </td>
                      <td className="p-4 text-gray-500">
                        {formatDate(order.created_at)}
                      </td>
                      <td className="p-4">
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/admin/orders/${order.id}`}>
                            Manage <ArrowRight className="h-3 w-3 ml-1" />
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {!orders?.length && (
              <div className="text-center py-12 text-gray-400">
                <ClipboardList className="h-8 w-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No orders yet</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
