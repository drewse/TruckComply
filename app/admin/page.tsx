import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { OrderStatusBadge } from "@/components/dashboard/status-badge"
import { Button } from "@/components/ui/button"
import { formatDate, formatCurrency } from "@/lib/utils"
import { Users, ClipboardList, DollarSign, TrendingUp, ArrowRight } from "lucide-react"
import Link from "next/link"

export default async function AdminOverviewPage() {
  const supabase = await createClient()

  // Get stats
  const [
    { count: totalCustomers },
    { count: totalOrders },
    { count: activeOrders },
    { data: recentOrders },
    { data: recentInvoices },
  ] = await Promise.all([
    supabase.from("organizations").select("*", { count: "exact", head: true }),
    supabase.from("service_orders").select("*", { count: "exact", head: true }),
    supabase
      .from("service_orders")
      .select("*", { count: "exact", head: true })
      .not("status", "in", "(completed,cancelled)"),
    supabase
      .from("service_orders")
      .select(`
        *,
        organizations(name)
      `)
      .order("created_at", { ascending: false })
      .limit(10),
    supabase
      .from("invoices")
      .select("*")
      .eq("status", "paid")
      .order("paid_at", { ascending: false })
      .limit(5),
  ])

  const totalRevenue = recentInvoices?.reduce((sum, inv) => sum + inv.amount, 0) || 0

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">TruckComply operations overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Customers", value: totalCustomers || 0, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Total Orders", value: totalOrders || 0, icon: ClipboardList, color: "text-purple-600", bg: "bg-purple-50" },
          { label: "Active Orders", value: activeOrders || 0, icon: TrendingUp, color: "text-orange-600", bg: "bg-orange-50" },
          { label: "Recent Revenue", value: formatCurrency(totalRevenue / 100), icon: DollarSign, color: "text-green-600", bg: "bg-green-50" },
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
        {/* Recent orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Orders</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/orders">View all <ArrowRight className="h-3 w-3 ml-1" /></Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentOrders?.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm text-gray-900">
                      {(order.organizations as { name: string } | null)?.name || "Unknown org"}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {order.service_type.replace(/_/g, " ")} · {formatDate(order.created_at)}
                    </p>
                  </div>
                  <OrderStatusBadge status={order.status} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent revenue */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentInvoices?.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm text-gray-900">
                      {invoice.description || "Payment"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {invoice.paid_at ? formatDate(invoice.paid_at) : "—"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900 text-sm">
                      {formatCurrency(invoice.amount / 100)}
                    </span>
                    <Badge variant="success">paid</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
