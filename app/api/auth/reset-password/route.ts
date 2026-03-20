import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://truckcomply.ca"

export async function POST(request: NextRequest) {
  const { email } = await request.json()
  if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 })

  const supabase = await createAdminClient()

  const { data, error } = await supabase.auth.admin.generateLink({
    type: "recovery",
    email,
    options: { redirectTo: `${APP_URL}/auth/update-password` },
  })

  if (error || !data?.properties?.action_link) {
    // Don't expose whether the email exists — always return success
    return NextResponse.json({ ok: true })
  }

  const resetLink = data.properties.action_link

  await resend.emails.send({
    from: "TruckComply <onboarding@truckcomply.ca>",
    to: email,
    subject: "Reset your TruckComply password",
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f9fafb; margin: 0; padding: 40px 20px;">
  <div style="max-width: 520px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
    <div style="background: #1a2744; padding: 28px 32px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 22px;">TruckComply</h1>
    </div>
    <div style="padding: 40px 32px;">
      <h2 style="color: #111827; margin: 0 0 12px;">Reset your password</h2>
      <p style="color: #6b7280; font-size: 15px; margin: 0 0 28px;">
        Click the button below to set a new password for your account. This link expires in 24 hours.
      </p>
      <a href="${resetLink}"
        style="display: inline-block; background: #ea580c; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px;">
        Reset Password &rarr;
      </a>
      <p style="color: #9ca3af; font-size: 13px; margin: 28px 0 0;">
        If you didn't request this, you can safely ignore this email.
      </p>
    </div>
  </div>
</body>
</html>
    `.trim(),
  })

  return NextResponse.json({ ok: true })
}
