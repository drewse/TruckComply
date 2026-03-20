"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(false)
  const [linkExpired, setLinkExpired] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const hash = window.location.hash
    const query = new URLSearchParams(window.location.search)

    // Error in hash (expired/invalid link)
    if (hash.includes("error=")) {
      setLinkExpired(true)
      return
    }

    // Implicit flow: access_token is in the hash — extract and set session manually
    if (hash.includes("access_token=")) {
      const hashParams = new URLSearchParams(hash.substring(1))
      const access_token = hashParams.get("access_token")
      const refresh_token = hashParams.get("refresh_token") ?? ""
      if (access_token) {
        supabase.auth.setSession({ access_token, refresh_token }).then(({ error }) => {
          if (error) setLinkExpired(true)
          else setReady(true)
        })
        return
      }
    }

    // PKCE flow: code is in query string
    const code = query.get("code")
    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        if (error) setLinkExpired(true)
        else setReady(true)
      })
      return
    }

    // Already signed in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true)
      else setLinkExpired(true)
    })
  }, [supabase])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (password.length < 8) {
      setError("Password must be at least 8 characters.")
      return
    }
    if (password !== confirm) {
      setError("Passwords do not match.")
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)

    if (error) {
      setError(error.message)
    } else {
      router.push("/app")
    }
  }

  if (linkExpired) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f9fafb", padding: "20px" }}>
        <div style={{ width: "100%", maxWidth: 400, background: "white", borderRadius: 12, padding: "40px 32px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", textAlign: "center" }}>
          <h2 style={{ color: "#111827", marginBottom: 12 }}>Link expired</h2>
          <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 24 }}>
            This password setup link has already been used or expired. Use the button below to get a new one.
          </p>
          <a
            href="/auth/login"
            style={{ display: "inline-block", background: "#ea580c", color: "white", padding: "12px 24px", borderRadius: 8, textDecoration: "none", fontWeight: 600, fontSize: 14 }}
          >
            Go to login / reset password
          </a>
        </div>
      </div>
    )
  }

  if (!ready) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f9fafb" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "#6b7280", fontSize: 16 }}>Verifying your link…</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f9fafb", padding: "20px" }}>
      <div style={{ width: "100%", maxWidth: 400, background: "white", borderRadius: 12, padding: "40px 32px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h1 style={{ color: "#1a2744", fontSize: 24, fontWeight: 700, margin: "0 0 8px" }}>Set your password</h1>
          <p style={{ color: "#6b7280", fontSize: 14, margin: 0 }}>Choose a password to access your TruckComply account.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: "#374151", marginBottom: 6 }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={8}
              placeholder="At least 8 characters"
              style={{ width: "100%", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14, boxSizing: "border-box" }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: "#374151", marginBottom: 6 }}>
              Confirm password
            </label>
            <input
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
              placeholder="Repeat your password"
              style={{ width: "100%", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14, boxSizing: "border-box" }}
            />
          </div>

          {error && (
            <p style={{ color: "#dc2626", fontSize: 13, marginBottom: 16 }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ width: "100%", background: "#ea580c", color: "white", border: "none", borderRadius: 8, padding: "12px", fontSize: 15, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Saving…" : "Set password & go to dashboard →"}
          </button>
        </form>
      </div>
    </div>
  )
}
