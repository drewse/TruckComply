import Stripe from "stripe"

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
  typescript: true,
})

export const STRIPE_PRICES = {
  setupFee: process.env.STRIPE_SETUP_FEE_PRICE_ID!,
  monthly: process.env.STRIPE_MONTHLY_PRICE_ID!,
}

export const SETUP_FEE_AMOUNT = 14900 // $149.00 CAD in cents
export const MONTHLY_AMOUNT = 3900    // $39.00 CAD in cents
