import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"

// One-time admin bootstrap endpoint.
// Protected by ADMIN_BOOTSTRAP_TOKEN env var.
// Automatically disabled once any admin exists.
export async function POST(request: NextRequest) {
  const token = process.env.ADMIN_BOOTSTRAP_TOKEN
  if (!token) {
    return NextResponse.json({ error: "Bootstrap not enabled" }, { status: 403 })
  }

  const body = await request.json().catch(() => ({}))
  if (body.token !== token) {
    return NextResponse.json({ error: "Invalid token" }, { status: 403 })
  }

  const { email } = body
  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "email required" }, { status: 400 })
  }

  const supabase = await createAdminClient()

  // Safety check: refuse if an admin already exists
  const { count } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("role", "admin")

  if (count && count > 0) {
    return NextResponse.json({ error: "An admin already exists. Remove ADMIN_BOOTSTRAP_TOKEN from env." }, { status: 409 })
  }

  const { data, error } = await supabase
    .from("profiles")
    .update({ role: "admin" })
    .eq("email", email)
    .select("id, email, role")
    .single()

  if (error || !data) {
    return NextResponse.json({ error: `No profile found for ${email}. User must log in first.` }, { status: 404 })
  }

  return NextResponse.json({ ok: true, message: `${email} is now an admin. Remove ADMIN_BOOTSTRAP_TOKEN from env.`, user: data })
}
