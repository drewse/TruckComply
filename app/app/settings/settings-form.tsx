"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import type { Profile, Organization } from "@/types/database"

const profileSchema = z.object({
  full_name: z.string().min(2, "Name is required"),
  phone: z.string().optional(),
})

const orgSchema = z.object({
  name: z.string().min(2, "Company name is required"),
  address: z.string().optional(),
  city: z.string().optional(),
  postal_code: z.string().optional(),
  cvor_number: z.string().optional(),
  dot_number: z.string().optional(),
})

type ProfileValues = z.infer<typeof profileSchema>
type OrgValues = z.infer<typeof orgSchema>

interface SettingsFormProps {
  profile: Profile | null
  org: Organization | null
  userId: string
}

export function SettingsForm({ profile, org, userId }: SettingsFormProps) {
  const router = useRouter()
  const [profileLoading, setProfileLoading] = useState(false)
  const [orgLoading, setOrgLoading] = useState(false)
  const [profileSuccess, setProfileSuccess] = useState(false)
  const [orgSuccess, setOrgSuccess] = useState(false)

  const profileForm = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: profile?.full_name || "",
      phone: profile?.phone || "",
    },
  })

  const orgForm = useForm<OrgValues>({
    resolver: zodResolver(orgSchema),
    defaultValues: {
      name: org?.name || "",
      address: org?.address || "",
      city: org?.city || "",
      postal_code: org?.postal_code || "",
      cvor_number: org?.cvor_number || "",
      dot_number: org?.dot_number || "",
    },
  })

  const onProfileSubmit = async (values: ProfileValues) => {
    setProfileLoading(true)
    const supabase = createClient()
    await supabase.from("profiles").update(values).eq("id", userId)
    setProfileSuccess(true)
    setProfileLoading(false)
    router.refresh()
    setTimeout(() => setProfileSuccess(false), 2000)
  }

  const onOrgSubmit = async (values: OrgValues) => {
    setOrgLoading(true)
    const supabase = createClient()
    if (org) {
      await supabase.from("organizations").update(values).eq("id", org.id)
    } else {
      await supabase.from("organizations").insert({ ...values, owner_id: userId, province: "ON" })
    }
    setOrgSuccess(true)
    setOrgLoading(false)
    router.refresh()
    setTimeout(() => setOrgSuccess(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Full name</Label>
              <Input {...profileForm.register("full_name")} />
            </div>
            <div className="space-y-1.5">
              <Label>Phone</Label>
              <Input {...profileForm.register("phone")} type="tel" placeholder="416-555-0100" />
            </div>
            <div className="flex items-center gap-3">
              <Button type="submit" size="sm" disabled={profileLoading}>
                {profileLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : "Save Profile"}
              </Button>
              {profileSuccess && <span className="text-sm text-green-600">Saved!</span>}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Organization */}
      <Card>
        <CardHeader>
          <CardTitle>Organization</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={orgForm.handleSubmit(onOrgSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Company name</Label>
              <Input {...orgForm.register("name")} placeholder="Smith Freight Inc." />
              {orgForm.formState.errors.name && (
                <p className="text-xs text-red-500">{orgForm.formState.errors.name.message}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>City</Label>
                <Input {...orgForm.register("city")} placeholder="Toronto" />
              </div>
              <div className="space-y-1.5">
                <Label>Postal Code</Label>
                <Input {...orgForm.register("postal_code")} placeholder="M5V 1A1" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Street address</Label>
              <Input {...orgForm.register("address")} placeholder="123 Main St" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>CVOR Number (if issued)</Label>
                <Input {...orgForm.register("cvor_number")} placeholder="eg. 1234567" />
              </div>
              <div className="space-y-1.5">
                <Label>DOT Number (if applicable)</Label>
                <Input {...orgForm.register("dot_number")} placeholder="eg. US-1234567" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button type="submit" size="sm" disabled={orgLoading}>
                {orgLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : "Save Organization"}
              </Button>
              {orgSuccess && <span className="text-sm text-green-600">Saved!</span>}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
