"use client"

import { useState, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Upload, X, Loader2, FileText } from "lucide-react"
import { useRouter } from "next/navigation"

interface DocumentUploadProps {
  orgId: string
  userId: string
}

export function DocumentUpload({ orgId, userId }: DocumentUploadProps) {
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setFiles((prev) => [...prev, ...newFiles])
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (!files.length || !orgId) return
    setUploading(true)
    setError(null)
    setSuccess(false)

    const supabase = createClient()

    try {
      for (const file of files) {
        const filePath = `${orgId}/${Date.now()}-${file.name}`

        // Upload to Supabase Storage
        const { error: storageError } = await supabase.storage
          .from("documents")
          .upload(filePath, file)

        if (storageError) throw storageError

        // Create document record
        const { error: dbError } = await supabase
          .from("documents")
          .insert({
            organization_id: orgId,
            uploaded_by: userId,
            name: file.name,
            file_path: filePath,
            file_type: file.type,
            file_size: file.size,
            status: "pending",
          })

        if (dbError) throw dbError
      }

      setFiles([])
      setSuccess(true)
      router.refresh()
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError("Upload failed. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h3 className="font-semibold text-gray-900 mb-4">Upload Documents</h3>

      {/* Drop zone */}
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-colors"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-3" />
        <p className="text-sm text-gray-600 mb-1">
          <span className="text-orange-600 font-medium">Click to upload</span> or drag and drop
        </p>
        <p className="text-xs text-gray-400">PDF, JPG, PNG up to 10MB each</p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        multiple
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={handleFileChange}
      />

      {/* Selected files */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <FileText className="h-4 w-4 text-gray-400 shrink-0" />
              <span className="text-sm text-gray-700 flex-1 truncate">{file.name}</span>
              <span className="text-xs text-gray-400 shrink-0">{(file.size / 1024).toFixed(0)} KB</span>
              <button
                onClick={() => removeFile(index)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600 mt-3">{error}</p>
      )}

      {success && (
        <p className="text-sm text-green-600 mt-3">Documents uploaded successfully!</p>
      )}

      {files.length > 0 && (
        <Button
          onClick={handleUpload}
          disabled={uploading}
          className="mt-4 w-full"
          size="lg"
        >
          {uploading ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Uploading...</>
          ) : (
            `Upload ${files.length} file${files.length > 1 ? "s" : ""}`
          )}
        </Button>
      )}
    </div>
  )
}
