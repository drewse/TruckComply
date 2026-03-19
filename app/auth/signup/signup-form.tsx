"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

const schema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Valid email is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  company: z.string().min(2, "Company name is required"),
})

type FormValues = z.infer<typeof schema>

export function SignupForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = async (values: FormValues) => {
    setLoading(true)
    setError(null)
    const supabase = createClient()

    const { error: authError } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: {
          full_name: values.fullName,
          company: values.company,
        },
        emailRedirectTo: `${window.location.origin}/app`,
      },
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="text-center py-4">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">✓</span>
        </div>
        <h3 className="font-semibold text-gray-900 mb-2">Check your email!</h3>
        <p className="text-gray-500 text-sm">
          We&apos;ve sent a confirmation link to your email address. Click it to activate your account.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="fullName">Full name</Label>
        <Input id="fullName" placeholder="John Smith" {...register("fullName")} />
        {errors.fullName && <p className="text-xs text-red-500">{errors.fullName.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="company">Company name</Label>
        <Input id="company" placeholder="Smith Freight Inc." {...register("company")} />
        {errors.company && <p className="text-xs text-red-500">{errors.company.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">Email address</Label>
        <Input id="email" type="email" placeholder="john@company.ca" {...register("email")} />
        {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" placeholder="••••••••" {...register("password")} />
        {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
        <p className="text-xs text-gray-400">Minimum 8 characters</p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>
      )}

      <Button type="submit" className="w-full" size="lg" disabled={loading}>
        {loading ? (
          <><Loader2 className="h-4 w-4 animate-spin" /> Creating account...</>
        ) : (
          "Create Account"
        )}
      </Button>

      <p className="text-xs text-gray-400 text-center">
        By creating an account, you agree to our Terms of Service and Privacy Policy.
      </p>
    </form>
  )
}
