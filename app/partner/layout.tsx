import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Sidebar } from "@/components/dashboard/sidebar"

export default async function PartnerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/partner")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, email, full_name")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "partner") {
    redirect("/app")
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar
        role="partner"
        userName={profile?.full_name || profile?.email || user.email}
      />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
