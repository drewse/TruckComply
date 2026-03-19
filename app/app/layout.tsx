import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Sidebar } from "@/components/dashboard/sidebar"

export default async function CustomerDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/app")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*, organizations(*)")
    .eq("id", user.id)
    .single()

  if (profile?.role === "admin") redirect("/admin")
  if (profile?.role === "partner") redirect("/partner")

  const { data: org } = await supabase
    .from("organizations")
    .select("name")
    .eq("owner_id", user.id)
    .single()

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar
        role="customer"
        orgName={org?.name}
        userName={profile?.email || user.email}
      />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
