import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { SettingsForm } from "./settings-form"

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  const { data: org } = await supabase
    .from("organizations")
    .select("*")
    .eq("owner_id", user.id)
    .single()

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your profile and organization details</p>
      </div>
      <SettingsForm profile={profile} org={org} userId={user.id} />
    </div>
  )
}
