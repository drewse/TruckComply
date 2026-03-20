import { NextRequest, NextResponse } from "next/server"
import { createClient, createAdminClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  const filePath = request.nextUrl.searchParams.get("path")
  if (!filePath) {
    return NextResponse.json({ error: "path required" }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Verify the document exists and caller has access
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "admin") {
    // Non-admins: confirm the file belongs to one of their orgs
    const orgId = filePath.split("/")[0]
    const { data: org } = await supabase
      .from("organizations")
      .select("id")
      .eq("id", orgId)
      .eq("owner_id", user.id)
      .single()

    if (!org) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
  }

  // Use admin client to generate signed URL (bypasses storage RLS)
  const admin = await createAdminClient()
  const { data, error } = await admin.storage
    .from("documents")
    .createSignedUrl(filePath, 120) // 2-minute expiry

  if (error || !data?.signedUrl) {
    console.error("Signed URL error:", error)
    return NextResponse.json({ error: "Failed to generate download URL" }, { status: 500 })
  }

  return NextResponse.json({ url: data.signedUrl })
}
