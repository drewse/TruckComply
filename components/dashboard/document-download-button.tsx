"use client"

import { useState } from "react"
import { Download, Loader2 } from "lucide-react"

interface DocumentDownloadButtonProps {
  filePath: string
  fileName: string
  variant?: "icon" | "button"
}

export function DocumentDownloadButton({ filePath, fileName, variant = "button" }: DocumentDownloadButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDownload = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/documents/signed-url?path=${encodeURIComponent(filePath)}`)
      const data = await res.json()
      if (!res.ok || !data.url) throw new Error(data.error || "Failed to get download URL")

      // Open in new tab — browser will prompt download for PDFs or inline for images
      const a = document.createElement("a")
      a.href = data.url
      a.target = "_blank"
      a.rel = "noopener noreferrer"
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Download failed")
    } finally {
      setLoading(false)
    }
  }

  if (variant === "icon") {
    return (
      <button
        onClick={handleDownload}
        disabled={loading}
        title={error || `Download ${fileName}`}
        className="p-1.5 rounded-md text-gray-400 hover:text-orange-600 hover:bg-orange-50 transition-colors disabled:opacity-50"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
      </button>
    )
  }

  return (
    <div>
      <button
        onClick={handleDownload}
        disabled={loading}
        className="flex items-center gap-1.5 text-xs text-orange-600 hover:underline disabled:opacity-50"
      >
        {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Download className="h-3 w-3" />}
        {loading ? "Getting link…" : "Download"}
      </button>
      {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
    </div>
  )
}
