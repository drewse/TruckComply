"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { DocumentDownloadButton } from "@/components/dashboard/document-download-button"
import { Badge } from "@/components/ui/badge"
import { Check, X, FileText } from "lucide-react"

interface Doc {
  id: string
  name: string
  file_path: string
  status: string
  created_at: string
  file_size: number | null
}

export function AdminDocumentActions({ documents }: { documents: Doc[] }) {
  const router = useRouter()
  const supabase = createClient()
  const [updating, setUpdating] = useState<string | null>(null)

  const updateStatus = async (docId: string, status: "approved" | "rejected") => {
    setUpdating(docId)
    await supabase.from("documents").update({ status }).eq("id", docId)
    router.refresh()
    setUpdating(null)
  }

  if (!documents.length) {
    return (
      <div className="text-center py-8 text-gray-400">
        <FileText className="h-8 w-8 mx-auto mb-2 opacity-30" />
        <p className="text-sm">No documents uploaded yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {documents.map((doc) => (
        <div key={doc.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg text-sm">
          <FileText className="h-4 w-4 text-gray-400 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 truncate">{doc.name}</p>
            {doc.file_size && (
              <p className="text-xs text-gray-400">{(doc.file_size / 1024).toFixed(0)} KB</p>
            )}
          </div>
          <Badge variant={
            doc.status === "approved" ? "success" :
            doc.status === "rejected" ? "destructive" : "warning"
          }>
            {doc.status}
          </Badge>
          <DocumentDownloadButton filePath={doc.file_path} fileName={doc.name} variant="icon" />
          {doc.status === "pending" && (
            <>
              <button
                onClick={() => updateStatus(doc.id, "approved")}
                disabled={updating === doc.id}
                title="Approve"
                className="p-1.5 rounded-md text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors disabled:opacity-50"
              >
                <Check className="h-4 w-4" />
              </button>
              <button
                onClick={() => updateStatus(doc.id, "rejected")}
                disabled={updating === doc.id}
                title="Reject"
                className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                <X className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  )
}
