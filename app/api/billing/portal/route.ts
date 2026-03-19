import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { createClient } from "@/lib/supabase/server"

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { data: org } = await supabase
      .from("organizations")
      .select("stripe_customer_id")
      .eq("owner_id", user.id)
      .single()

    if (!org?.stripe_customer_id) {
      return NextResponse.json({ error: "No billing account found" }, { status: 404 })
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

    const session = await stripe.billingPortal.sessions.create({
      customer: org.stripe_customer_id,
      return_url: `${appUrl}/app/billing`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Billing portal error:", error)
    return NextResponse.json({ error: "Failed to create billing portal session" }, { status: 500 })
  }
}
