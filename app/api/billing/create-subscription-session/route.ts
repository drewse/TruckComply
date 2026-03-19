import { NextRequest, NextResponse } from "next/server"
import { stripe, MONTHLY_AMOUNT } from "@/lib/stripe"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { orgId } = body

    const { data: org } = await supabase
      .from("organizations")
      .select("stripe_customer_id, name")
      .eq("id", orgId)
      .single()

    if (!org) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 })
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

    // Get or create Stripe customer
    let customerId = org.stripe_customer_id
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: org.name,
        metadata: { organization_id: orgId, user_id: user.id },
      })
      customerId = customer.id

      await supabase
        .from("organizations")
        .update({ stripe_customer_id: customerId })
        .eq("id", orgId)
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [
        {
          price_data: {
            currency: "cad",
            product_data: {
              name: "TruckComply — Monthly Compliance Plan",
              description: "CVOR renewal tracking, IFTA filing assistance, IRP support, and priority compliance team access.",
            },
            unit_amount: MONTHLY_AMOUNT,
            recurring: { interval: "month" },
            tax_behavior: "exclusive",
          },
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/app/billing?upgraded=true`,
      cancel_url: `${appUrl}/app/billing`,
      metadata: {
        organization_id: orgId,
        user_id: user.id,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Subscription session error:", error)
    return NextResponse.json({ error: "Failed to create subscription session" }, { status: 500 })
  }
}
