import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { createAdminClient } from "@/lib/supabase/server"
import { sendWelcomeEmail, sendAdminNewOrderNotification } from "@/lib/email"
import type Stripe from "stripe"

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get("stripe-signature")!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error("Webhook signature verification failed:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  const supabase = await createAdminClient()

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session, supabase)
        break
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        await handleSubscriptionUpsert(event.data.object as Stripe.Subscription, supabase)
        break
      }

      case "customer.subscription.deleted": {
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription, supabase)
        break
      }

      case "invoice.paid": {
        await handleInvoicePaid(event.data.object as Stripe.Invoice, supabase)
        break
      }

      case "invoice.payment_failed": {
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice, supabase)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }
  } catch (err) {
    console.error(`Error handling event ${event.type}:`, err)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}

// ============================================================
// CHECKOUT COMPLETED — Create user, org, service order
// ============================================================
async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session,
  supabase: Awaited<ReturnType<typeof createAdminClient>>
) {
  const metadata = session.metadata || {}
  const { email, firstName, lastName, company, phone } = metadata

  if (!email) {
    console.error("No email in checkout session metadata")
    return
  }

  // Check if user already exists
  const { data: existingUsers } = await supabase.auth.admin.listUsers()
  const existingUser = existingUsers?.users?.find(u => u.email === email)

  let userId: string

  if (existingUser) {
    userId = existingUser.id
  } else {
    // Create Supabase user
    const tempPassword = Math.random().toString(36).slice(-16) + "A1!"
    const { data: newUser, error: userError } = await supabase.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: {
        full_name: `${firstName} ${lastName}`,
        role: "customer",
      },
    })

    if (userError || !newUser.user) {
      console.error("Failed to create user:", userError)
      return
    }

    userId = newUser.user.id

    // Generate a password-setup link and email it to the customer
    const { data: linkData } = await supabase.auth.admin.generateLink({
      type: "recovery",
      email,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/app`,
      },
    })

    const loginLink = linkData?.properties?.action_link || `${process.env.NEXT_PUBLIC_APP_URL}/auth/login`

    await sendWelcomeEmail({
      email,
      firstName: firstName || "there",
      company: company || "your company",
      loginLink,
    }).catch(err => console.error("Welcome email failed:", err))
  }

  // Update profile
  await supabase
    .from("profiles")
    .upsert({
      id: userId,
      email,
      full_name: `${firstName} ${lastName}`,
      phone: phone || null,
      role: "customer",
    })

  // Create or find organization
  let orgId: string
  const { data: existingOrg } = await supabase
    .from("organizations")
    .select("id")
    .eq("owner_id", userId)
    .single()

  if (existingOrg) {
    orgId = existingOrg.id
  } else {
    const { data: newOrg, error: orgError } = await supabase
      .from("organizations")
      .insert({
        name: company,
        owner_id: userId,
        province: "ON",
        stripe_customer_id: session.customer as string || null,
      })
      .select("id")
      .single()

    if (orgError || !newOrg) {
      console.error("Failed to create organization:", orgError)
      return
    }
    orgId = newOrg.id
  }

  // Update stripe customer id if not set
  if (session.customer) {
    await supabase
      .from("organizations")
      .update({ stripe_customer_id: session.customer as string })
      .eq("id", orgId)
  }

  // Create service order
  const { data: order } = await supabase
    .from("service_orders")
    .insert({
      organization_id: orgId,
      service_type: "cvor_ontario",
      status: "paid",
      stripe_session_id: session.id,
      amount_paid: session.amount_total || 14900,
    })
    .select("id")
    .single()

  // Create initial compliance tasks
  if (order) {
    const tasks = [
      {
        organization_id: orgId,
        service_order_id: order.id,
        title: "Upload business registration",
        description: "Ontario Business Registry certificate or federal incorporation documents",
        status: "pending",
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      },
      {
        organization_id: orgId,
        service_order_id: order.id,
        title: "Upload proof of insurance",
        description: "Commercial vehicle insurance certificate — minimum $2M liability required",
        status: "pending",
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      },
      {
        organization_id: orgId,
        service_order_id: order.id,
        title: "Upload driver abstracts",
        description: "Current Ontario driver abstracts for all listed drivers",
        status: "pending",
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      },
      {
        organization_id: orgId,
        service_order_id: order.id,
        title: "Application review by TruckComply",
        description: "Our compliance team reviews all documents and prepares MTO application",
        status: "pending",
        due_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      },
      {
        organization_id: orgId,
        service_order_id: order.id,
        title: "Submit application to MTO",
        description: "Submit completed CVOR application to the Ontario Ministry of Transportation",
        status: "pending",
        due_date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      },
      {
        organization_id: orgId,
        service_order_id: order.id,
        title: "Receive CVOR certificate",
        description: "MTO processes application (5-10 business days) and issues CVOR certificate",
        status: "pending",
        due_date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      },
    ]

    await supabase.from("compliance_tasks").insert(tasks)
  }

  // Create invoice record
  await supabase.from("invoices").insert({
    organization_id: orgId,
    stripe_invoice_id: `pi_${session.payment_intent}` || `cs_${session.id}`,
    amount: session.amount_total || 14900,
    currency: session.currency || "cad",
    status: "paid",
    description: "CVOR Ontario Setup Package",
    paid_at: new Date().toISOString(),
  })

  // Activity log
  await supabase.from("activity_log").insert({
    organization_id: orgId,
    user_id: userId,
    action: "checkout_completed",
    entity_type: "service_order",
    entity_id: order?.id,
    metadata: { session_id: session.id, amount: session.amount_total },
  })

  // Notify admin of new order
  if (order) {
    await sendAdminNewOrderNotification({
      customerEmail: email,
      company: company || "Unknown",
      orderId: order.id,
    }).catch(err => console.error("Admin notification email failed:", err))
  }

  console.log(`✅ Created account for ${email}, org: ${orgId}`)
}

// ============================================================
// SUBSCRIPTION CREATED/UPDATED
// ============================================================
async function handleSubscriptionUpsert(
  subscription: Stripe.Subscription,
  supabase: Awaited<ReturnType<typeof createAdminClient>>
) {
  const customerId = subscription.customer as string

  const { data: org } = await supabase
    .from("organizations")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .single()

  if (!org) {
    console.error(`No org found for Stripe customer: ${customerId}`)
    return
  }

  await supabase
    .from("subscriptions")
    .upsert(
      {
        organization_id: org.id,
        stripe_subscription_id: subscription.id,
        stripe_customer_id: customerId,
        status: subscription.status as string,
        price_id: subscription.items.data[0]?.price.id || "",
        current_period_start: new Date((subscription.items.data[0]?.current_period_start ?? Date.now() / 1000) * 1000).toISOString(),
        current_period_end: new Date((subscription.items.data[0]?.current_period_end ?? Date.now() / 1000 + 2592000) * 1000).toISOString(),
        cancel_at_period_end: subscription.cancel_at_period_end,
      },
      { onConflict: "stripe_subscription_id" }
    )

  console.log(`✅ Upserted subscription ${subscription.id} for org ${org.id}`)
}

// ============================================================
// SUBSCRIPTION DELETED
// ============================================================
async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription,
  supabase: Awaited<ReturnType<typeof createAdminClient>>
) {
  await supabase
    .from("subscriptions")
    .update({ status: "cancelled" })
    .eq("stripe_subscription_id", subscription.id)

  console.log(`✅ Cancelled subscription ${subscription.id}`)
}

// ============================================================
// INVOICE PAID
// ============================================================
async function handleInvoicePaid(
  invoice: Stripe.Invoice,
  supabase: Awaited<ReturnType<typeof createAdminClient>>
) {
  const customerId = invoice.customer as string
  if (!customerId) return

  const { data: org } = await supabase
    .from("organizations")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .single()

  if (!org) return

  await supabase.from("invoices").upsert(
    {
      organization_id: org.id,
      stripe_invoice_id: invoice.id,
      amount: invoice.amount_paid,
      currency: invoice.currency,
      status: "paid",
      description: invoice.description || "Monthly compliance plan",
      invoice_url: invoice.hosted_invoice_url,
      paid_at: new Date().toISOString(),
    },
    { onConflict: "stripe_invoice_id" }
  )

  console.log(`✅ Invoice paid ${invoice.id}`)
}

// ============================================================
// INVOICE PAYMENT FAILED
// ============================================================
async function handleInvoicePaymentFailed(
  invoice: Stripe.Invoice,
  supabase: Awaited<ReturnType<typeof createAdminClient>>
) {
  const customerId = invoice.customer as string
  if (!customerId) return

  const { data: org } = await supabase
    .from("organizations")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .single()

  if (!org) return

  // Update subscription status to past_due
  await supabase
    .from("subscriptions")
    .update({ status: "past_due" })
    .eq("organization_id", org.id)
    .eq("status", "active")

  await supabase.from("invoices").upsert(
    {
      organization_id: org.id,
      stripe_invoice_id: invoice.id,
      amount: invoice.amount_due,
      currency: invoice.currency,
      status: "open",
      description: "Failed payment — monthly compliance plan",
      invoice_url: invoice.hosted_invoice_url,
    },
    { onConflict: "stripe_invoice_id" }
  )

  console.log(`⚠️ Invoice payment failed ${invoice.id}`)
}
