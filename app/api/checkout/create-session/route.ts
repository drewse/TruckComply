import { NextRequest, NextResponse } from "next/server"
import { stripe, SETUP_FEE_AMOUNT, assertStripeConfigured } from "@/lib/stripe"
import { z } from "zod"

const schema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  company: z.string().min(1),
  phone: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    assertStripeConfigured()
    const body = await request.json()
    const data = schema.parse(body)

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: data.email,
      metadata: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        company: data.company,
        phone: data.phone || "",
      },
      line_items: [
        {
          price_data: {
            currency: "cad",
            product_data: {
              name: "TruckComply — CVOR Setup Package",
              description: "Done-for-you CVOR application for Ontario. Includes application preparation, MTO submission, and certificate delivery.",
              images: [],
            },
            unit_amount: SETUP_FEE_AMOUNT,
            tax_behavior: "exclusive",
          },
          quantity: 1,
        },
      ],
      automatic_tax: { enabled: false },
      success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/checkout?cancelled=true`,
      billing_address_collection: "required",
      phone_number_collection: { enabled: true },
      custom_text: {
        submit: {
          message: "After payment, your account will be created and our team will contact you within 1 business day.",
        },
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Checkout session error:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid form data" }, { status: 400 })
    }
    return NextResponse.json(
      { error: "Failed to create checkout session. Please try again." },
      { status: 500 }
    )
  }
}
