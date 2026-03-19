import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SubscriptionStatusBadge } from "@/components/dashboard/status-badge"
import { UpgradeButton } from "./upgrade-button"
import { BillingPortalButton } from "./billing-portal-button"
import { formatDate, formatCurrency } from "@/lib/utils"
import { CreditCard, CheckCircle2, ArrowRight } from "lucide-react"

export default async function BillingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: org } = await supabase
    .from("organizations")
    .select("*, subscriptions(*), invoices(*)")
    .eq("owner_id", user.id)
    .single()

  const subscription = org?.subscriptions?.[0]
  const invoices = org?.invoices || []

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Billing</h1>
        <p className="text-gray-500 mt-1">Manage your subscription and billing history</p>
      </div>

      {/* Current Plan */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
        </CardHeader>
        <CardContent>
          {subscription ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-lg text-gray-900">Monthly Compliance Plan</h3>
                  <SubscriptionStatusBadge status={subscription.status} />
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-1">$39 <span className="text-sm font-normal text-gray-500">/month</span></p>
                <p className="text-sm text-gray-500">
                  Next billing date: {formatDate(subscription.current_period_end)}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <BillingPortalButton />
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-lg text-gray-900">Setup Package</h3>
                <Badge variant="secondary">One-time</Badge>
              </div>
              <p className="text-gray-500 text-sm mb-4">
                You&apos;re on the one-time setup package. Upgrade to Monthly Compliance for ongoing support.
              </p>

              {/* Upgrade section */}
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-6">
                <h4 className="font-bold text-gray-900 mb-2">Upgrade to Monthly — $39/month</h4>
                <div className="grid grid-cols-2 gap-2 mb-5">
                  {[
                    "CVOR renewal reminders",
                    "IFTA quarterly filing",
                    "IRP renewal support",
                    "Compliance calendar",
                    "Priority support",
                    "Document storage",
                  ].map((f) => (
                    <div key={f} className="flex items-center gap-1.5 text-sm text-gray-700">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-600 shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>
                <UpgradeButton orgId={org?.id || ""} email={user.email!} />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Billing history */}
      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
        </CardHeader>
        <CardContent>
          {invoices.length > 0 ? (
            <div className="space-y-3">
              {invoices.map((invoice: {
                id: string;
                created_at: string;
                description: string | null;
                amount: number;
                status: string;
                invoice_url: string | null;
              }) => (
                <div key={invoice.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {invoice.description || "Service payment"}
                    </p>
                    <p className="text-xs text-gray-500">{formatDate(invoice.created_at)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(invoice.amount / 100)}
                    </span>
                    <Badge variant={invoice.status === "paid" ? "success" : "warning"}>
                      {invoice.status}
                    </Badge>
                    {invoice.invoice_url && (
                      <a
                        href={invoice.invoice_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-orange-600 hover:underline"
                      >
                        View
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <CreditCard className="h-8 w-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No billing history yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
