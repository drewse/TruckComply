import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = "TruckComply <onboarding@truckcomply.ca>"
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://truckcomply.ca"

export async function sendWelcomeEmail({
  email,
  firstName,
  company,
  loginLink,
}: {
  email: string
  firstName: string
  company: string
  loginLink: string
}) {
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: "Welcome to TruckComply — Set up your password",
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f9fafb; margin: 0; padding: 40px 20px;">
  <div style="max-width: 560px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">

    <!-- Header -->
    <div style="background: #1a2744; padding: 32px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 24px;">TruckComply</h1>
      <p style="color: #94a3b8; margin: 8px 0 0; font-size: 14px;">Canadian Trucking Compliance</p>
    </div>

    <!-- Body -->
    <div style="padding: 40px 32px;">
      <h2 style="color: #111827; margin: 0 0 8px;">Welcome, ${firstName}!</h2>
      <p style="color: #6b7280; margin: 0 0 24px; font-size: 15px;">
        Your payment was successful and your TruckComply account for <strong>${company}</strong> is ready.
      </p>

      <p style="color: #374151; font-size: 15px; margin: 0 0 8px;">
        <strong>Step 1:</strong> Set your password by clicking the button below:
      </p>

      <a href="${loginLink}"
        style="display: inline-block; background: #ea580c; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px; margin: 16px 0 32px;">
        Set Your Password &rarr;
      </a>

      <p style="color: #6b7280; font-size: 13px; margin: 0 0 24px;">
        This link expires in 24 hours. If it expires, use <a href="${APP_URL}/auth/login" style="color: #ea580c;">Forgot Password</a> to get a new one.
      </p>

      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">

      <h3 style="color: #111827; margin: 0 0 16px; font-size: 16px;">What happens next:</h3>
      <div style="background: #f9fafb; border-radius: 8px; padding: 20px;">
        <div style="margin-bottom: 14px; display: flex; align-items: flex-start; gap: 12px;">
          <span style="background: #ea580c; color: white; width: 22px; height: 22px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; flex-shrink: 0;">1</span>
          <div>
            <strong style="color: #111827; font-size: 14px;">Log in and upload your documents</strong>
            <p style="color: #6b7280; font-size: 13px; margin: 2px 0 0;">Business registration, insurance certificate, and driver abstracts</p>
          </div>
        </div>
        <div style="margin-bottom: 14px; display: flex; align-items: flex-start; gap: 12px;">
          <span style="background: #ea580c; color: white; width: 22px; height: 22px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; flex-shrink: 0;">2</span>
          <div>
            <strong style="color: #111827; font-size: 14px;">We prepare your CVOR application</strong>
            <p style="color: #6b7280; font-size: 13px; margin: 2px 0 0;">Our team reviews and submits to the Ontario MTO within 1 business day</p>
          </div>
        </div>
        <div style="display: flex; align-items: flex-start; gap: 12px;">
          <span style="background: #ea580c; color: white; width: 22px; height: 22px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; flex-shrink: 0;">3</span>
          <div>
            <strong style="color: #111827; font-size: 14px;">Receive your CVOR certificate</strong>
            <p style="color: #6b7280; font-size: 13px; margin: 2px 0 0;">MTO approves in 5–10 business days. We notify you immediately.</p>
          </div>
        </div>
      </div>

      <div style="margin-top: 32px; padding: 16px; background: #fff7ed; border: 1px solid #fed7aa; border-radius: 8px;">
        <p style="color: #9a3412; font-size: 13px; margin: 0;">
          <strong>Questions?</strong> Reply to this email or contact us at
          <a href="mailto:support@truckcomply.ca" style="color: #ea580c;">support@truckcomply.ca</a>
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="background: #f9fafb; padding: 20px 32px; text-align: center; border-top: 1px solid #e5e7eb;">
      <p style="color: #9ca3af; font-size: 12px; margin: 0;">
        TruckComply Inc. &bull; Ontario, Canada<br>
        You received this because you purchased a service at truckcomply.ca
      </p>
    </div>
  </div>
</body>
</html>
    `.trim(),
  })
}

export async function sendAdminNewOrderNotification({
  customerEmail,
  company,
  orderId,
}: {
  customerEmail: string
  company: string
  orderId: string
}) {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@truckcomply.ca"

  await resend.emails.send({
    from: FROM,
    to: adminEmail,
    subject: `New order — ${company}`,
    html: `
      <p>A new CVOR order has been placed.</p>
      <ul>
        <li><strong>Company:</strong> ${company}</li>
        <li><strong>Customer:</strong> ${customerEmail}</li>
        <li><strong>Order ID:</strong> ${orderId}</li>
      </ul>
      <p><a href="${APP_URL}/admin/orders/${orderId}">View order in admin →</a></p>
    `,
  })
}
