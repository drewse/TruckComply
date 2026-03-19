"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import type { Profile } from "@/types/database"

interface PartnerSettingsFormProps {
  profile: Profile | null
  userId: string
}

export function PartnerSettingsForm({ profile, userId }: PartnerSettingsFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const { register, handleSubmit } = useForm({
    defaultValues: {
      full_name: profile?.full_name || "",
      phone: profile?.phone || "",
    },
  })

  const onSubmit = async (values: { full_name: string; phone: string }) => {
    setLoading(true)
    const supabase = createClient()
    await supabase.from("profiles").update(values).eq("id", userId)
    setSuccess(true)
    setLoading(false)
    router.refresh()
    setTimeout(() => setSuccess(false), 2000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Full name</Label>
            <Input {...register("full_name")} />
          </div>
          <div className="space-y-1.5">
            <Label>Phone</Label>
            <Input {...register("phone")} type="tel" />
          </div>
          <div className="flex items-center gap-3">
            <Button type="submit" size="sm" disabled={loading}>
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : "Save"}
            </Button>
            {success && <span className="text-sm text-green-600">Saved!</span>}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
