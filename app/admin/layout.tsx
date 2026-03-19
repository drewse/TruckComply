import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Sidebar } from "@/components/dashboard/sidebar"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/admin")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, email")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "admin") {
    redirect("/app")
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar
        role="admin"
        userName={profile?.email || user.email}
      />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
