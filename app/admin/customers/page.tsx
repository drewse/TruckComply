import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"
import { Users, ArrowRight } from "lucide-react"
import Link from "next/link"

export default async function AdminCustomersPage() {
  const supabase = await createClient()

  const { data: organizations } = await supabase
    .from("organizations")
    .select(`
      *,
      profiles!owner_id(full_name, email, phone),
      service_orders(id, status),
      subscriptions(id, status)
    `)
    .order("created_at", { ascending: false })

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
        <p className="text-gray-500 mt-1">{organizations?.length || 0} organizations</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left p-4 font-semibold text-gray-700">Organization</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Owner</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Province</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Orders</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Plan</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Joined</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {organizations?.map((org) => {
                  const owner = org.profiles as { full_name: string | null; email: string; phone: string | null } | null
                  const activeOrders = (org.service_orders as { status: string }[])?.filter(
                    o => !["completed", "cancelled"].includes(o.status)
                  ).length || 0
                  const subscription = (org.subscriptions as { status: string }[])?.[0]

                  return (
                    <tr key={org.id} className="hover:bg-gray-50">
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-gray-900">{org.name}</p>
                          {org.cvor_number && (
                            <p className="text-xs text-gray-400">CVOR: {org.cvor_number}</p>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-gray-900">{owner?.full_name || "—"}</p>
                          <p className="text-xs text-gray-500">{owner?.email}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="secondary">{org.province}</Badge>
                      </td>
                      <td className="p-4">
                        <span className="font-medium text-gray-900">
                          {(org.service_orders as unknown[])?.length || 0} total
                        </span>
                        {activeOrders > 0 && (
                          <span className="ml-1 text-orange-600 text-xs">({activeOrders} active)</span>
                        )}
                      </td>
                      <td className="p-4">
                        {subscription?.status === "active" ? (
                          <Badge variant="success">Monthly $39</Badge>
                        ) : (
                          <Badge variant="secondary">Setup only</Badge>
                        )}
                      </td>
                      <td className="p-4 text-gray-500">
                        {formatDate(org.created_at)}
                      </td>
                      <td className="p-4">
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/admin/customers/${org.id}`}>
                            View <ArrowRight className="h-3 w-3 ml-1" />
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {!organizations?.length && (
              <div className="text-center py-12 text-gray-400">
                <Users className="h-8 w-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No customers yet</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
