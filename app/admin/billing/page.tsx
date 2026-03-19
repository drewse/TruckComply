import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SubscriptionStatusBadge } from "@/components/dashboard/status-badge"
import { formatDate, formatCurrency } from "@/lib/utils"
import { DollarSign } from "lucide-react"

export default async function AdminBillingPage() {
  const supabase = await createClient()

  const [{ data: invoices }, { data: subscriptions }] = await Promise.all([
    supabase
      .from("invoices")
      .select("*, organizations(name)")
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("subscriptions")
      .select("*, organizations(name)")
      .order("created_at", { ascending: false }),
  ])

  const totalRevenue = invoices?.filter(i => i.status === "paid").reduce((sum, i) => sum + i.amount, 0) || 0
  const activeSubscriptions = subscriptions?.filter(s => s.status === "active").length || 0
  const mrr = activeSubscriptions * 3900

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Billing Overview</h1>
        <p className="text-gray-500 mt-1">Revenue and subscription management</p>
      </div>

      {/* Revenue stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total Revenue", value: formatCurrency(totalRevenue / 100), note: "All time" },
          { label: "Active Subscriptions", value: activeSubscriptions, note: "$39/month each" },
          { label: "MRR", value: formatCurrency(mrr / 100), note: "Monthly recurring" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <DollarSign className="h-4 w-4 text-green-600" />
                </div>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-400 mt-1">{stat.note}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subscriptions */}
        <Card>
          <CardHeader>
            <CardTitle>Active Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {subscriptions?.map((sub) => {
                const org = sub.organizations as { name: string } | null
                return (
                  <div key={sub.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm">
                    <div>
                      <p className="font-medium text-gray-900">{org?.name || "—"}</p>
                      <p className="text-xs text-gray-500">
                        Renews {formatDate(sub.current_period_end)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">$39/mo</span>
                      <SubscriptionStatusBadge status={sub.status} />
                    </div>
                  </div>
                )
              })}
              {!subscriptions?.length && (
                <p className="text-sm text-gray-400 text-center py-4">No subscriptions yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent invoices */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {invoices?.slice(0, 10).map((invoice) => {
                const org = invoice.organizations as { name: string } | null
                return (
                  <div key={invoice.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm">
                    <div>
                      <p className="font-medium text-gray-900">{org?.name || "—"}</p>
                      <p className="text-xs text-gray-500">
                        {invoice.description || "Payment"} · {formatDate(invoice.created_at)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(invoice.amount / 100)}
                      </span>
                      <Badge variant={invoice.status === "paid" ? "success" : "warning"}>
                        {invoice.status}
                      </Badge>
                    </div>
                  </div>
                )
              })}
              {!invoices?.length && (
                <p className="text-sm text-gray-400 text-center py-4">No invoices yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
