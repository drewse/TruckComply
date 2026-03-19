import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import { Users } from "lucide-react"

export default async function AdminPartnersPage() {
  const supabase = await createClient()

  const { data: partners } = await supabase
    .from("profiles")
    .select(`
      *,
      service_orders!assigned_partner_id(id, status)
    `)
    .eq("role", "partner")
    .order("created_at", { ascending: false })

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Partners</h1>
        <p className="text-gray-500 mt-1">{partners?.length || 0} partners</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left p-4 font-semibold text-gray-700">Partner</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Email</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Phone</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Active Jobs</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Total Jobs</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {partners?.map((partner) => {
                  const orders = (partner.service_orders as { id: string; status: string }[]) || []
                  const activeJobs = orders.filter(o => !["completed", "cancelled"].includes(o.status)).length

                  return (
                    <tr key={partner.id} className="hover:bg-gray-50">
                      <td className="p-4">
                        <p className="font-medium text-gray-900">{partner.full_name || "—"}</p>
                      </td>
                      <td className="p-4 text-gray-600">{partner.email}</td>
                      <td className="p-4 text-gray-600">{partner.phone || "—"}</td>
                      <td className="p-4">
                        <Badge variant={activeJobs > 0 ? "info" : "secondary"}>
                          {activeJobs}
                        </Badge>
                      </td>
                      <td className="p-4 text-gray-600">{orders.length}</td>
                      <td className="p-4 text-gray-500">{formatDate(partner.created_at)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {!partners?.length && (
              <div className="text-center py-12 text-gray-400">
                <Users className="h-8 w-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No partners yet</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
