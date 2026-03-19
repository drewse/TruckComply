import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { PartnerSettingsForm } from "./partner-settings-form"

export default async function PartnerSettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>
      <PartnerSettingsForm profile={profile} userId={user.id} />
    </div>
  )
}
