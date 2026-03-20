"use client"

import { useState } from "react"

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
    setLoading(false)
    setSent(true)
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f9fafb", padding: "20px" }}>
      <div style={{ width: "100%", maxWidth: 400, background: "white", borderRadius: 12, padding: "40px 32px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
        {sent ? (
          <div style={{ textAlign: "center" }}>
            <h2 style={{ color: "#111827", marginBottom: 12 }}>Check your email</h2>
            <p style={{ color: "#6b7280", fontSize: 14 }}>
              We sent a password reset link to <strong>{email}</strong>. Click the link to set your password.
            </p>
          </div>
        ) : (
          <>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <h1 style={{ color: "#1a2744", fontSize: 24, fontWeight: 700, margin: "0 0 8px" }}>Reset your password</h1>
              <p style={{ color: "#6b7280", fontSize: 14, margin: 0 }}>Enter your email and we'll send you a reset link.</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: "#374151", marginBottom: 6 }}>
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="you@company.ca"
                  style={{ width: "100%", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14, boxSizing: "border-box" }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{ width: "100%", background: "#ea580c", color: "white", border: "none", borderRadius: 8, padding: "12px", fontSize: 15, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}
              >
                {loading ? "Sending…" : "Send reset link"}
              </button>
            </form>

            <p style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "#6b7280" }}>
              <a href="/auth/login" style={{ color: "#ea580c" }}>Back to login</a>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
