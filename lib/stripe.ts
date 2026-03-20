import Stripe from "stripe"

const stripeSecretKey = process.env.STRIPE_SECRET_KEY
if (!stripeSecretKey) {
  console.error("❌ STRIPE_SECRET_KEY is not set. Stripe operations will fail.")
}

export const stripe = new Stripe(stripeSecretKey || "sk_test_placeholder", {
  apiVersion: "2026-02-25.clover",
  typescript: true,
})

export const SETUP_FEE_AMOUNT = 14900 // $149.00 CAD in cents
export const MONTHLY_AMOUNT = 3900    // $39.00 CAD in cents

export function assertStripeConfigured() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY environment variable is not set")
  }
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.warn("⚠️ STRIPE_WEBHOOK_SECRET is not set — webhook signature verification will fail")
  }
}
