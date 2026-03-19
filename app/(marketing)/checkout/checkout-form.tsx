"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight, Loader2 } from "lucide-react"

const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  company: z.string().min(1, "Company name is required"),
  phone: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export function CheckoutForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (values: FormValues) => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/checkout/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to create checkout session")
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <h2 className="font-semibold text-gray-900 mb-6">Your information</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="firstName">First name</Label>
            <Input
              id="firstName"
              placeholder="John"
              {...register("firstName")}
            />
            {errors.firstName && (
              <p className="text-xs text-red-500">{errors.firstName.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="lastName">Last name</Label>
            <Input
              id="lastName"
              placeholder="Smith"
              {...register("lastName")}
            />
            {errors.lastName && (
              <p className="text-xs text-red-500">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            placeholder="john@mytrucking.ca"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email.message}</p>
          )}
          <p className="text-xs text-gray-400">We&apos;ll send your login credentials here after payment.</p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="company">Company name</Label>
          <Input
            id="company"
            placeholder="Smith Freight Inc."
            {...register("company")}
          />
          {errors.company && (
            <p className="text-xs text-red-500">{errors.company.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone number (optional)</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="416-555-0100"
            {...register("phone")}
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Redirecting to payment...
            </>
          ) : (
            <>
              Continue to Payment — $149 <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>

        <p className="text-xs text-gray-400 text-center">
          You&apos;ll be redirected to Stripe&apos;s secure checkout. Your card details are never stored on our servers.
        </p>
      </form>
    </div>
  )
}
