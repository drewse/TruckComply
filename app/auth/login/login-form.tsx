"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

const schema = z.object({
  email: z.string().email("Valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type FormValues = z.infer<typeof schema>

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") || "/app"
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = async (values: FormValues) => {
    setLoading(true)
    setError(null)
    const supabase = createClient()

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    })

    if (authError) {
      setError("Invalid email or password. Please try again.")
      setLoading(false)
      return
    }

    // Route based on role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single()

    const role = profile?.role
    if (role === "admin") {
      router.push("/admin")
    } else if (role === "partner") {
      router.push("/partner")
    } else {
      router.push(redirect)
    }
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@company.ca"
          autoComplete="email"
          {...register("email")}
        />
        {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <Label htmlFor="password">Password</Label>
          <a href="/auth/reset-password" className="text-xs text-orange-600 hover:underline">
            Forgot password?
          </a>
        </div>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          {...register("password")}
        />
        {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      <Button type="submit" className="w-full" size="lg" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Signing in...
          </>
        ) : (
          "Sign In"
        )}
      </Button>
    </form>
  )
}
