import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DocumentStatusBadge } from "@/components/dashboard/status-badge"
import { Button } from "@/components/ui/button"
import { DocumentUpload } from "./document-upload"
import { formatDate } from "@/lib/utils"
import { FileText, Download } from "lucide-react"

export default async function DocumentsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: org } = await supabase
    .from("organizations")
    .select("id")
    .eq("owner_id", user.id)
    .single()

  const { data: documents } = await supabase
    .from("documents")
    .select("*")
    .eq("organization_id", org?.id || "")
    .order("created_at", { ascending: false })

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
          <p className="text-gray-500 mt-1">Upload and manage your compliance documents</p>
        </div>
      </div>

      {/* Upload Component */}
      <DocumentUpload orgId={org?.id || ""} userId={user.id} />

      {/* Documents list */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Uploaded Documents</CardTitle>
        </CardHeader>
        <CardContent>
          {documents && documents.length > 0 ? (
            <div className="space-y-3">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                    <FileText className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">{doc.name}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-gray-400">{formatDate(doc.created_at)}</span>
                      {doc.file_size && (
                        <span className="text-xs text-gray-400">
                          {(doc.file_size / 1024).toFixed(0)} KB
                        </span>
                      )}
                    </div>
                    {doc.notes && (
                      <p className="text-xs text-orange-600 mt-1">{doc.notes}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <DocumentStatusBadge status={doc.status} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <FileText className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm text-gray-500 mb-2">No documents uploaded yet</p>
              <p className="text-xs text-gray-400">
                Upload your business registration, insurance, and other required documents above.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Required docs checklist */}
      <Card className="mt-6 border-blue-100 bg-blue-50">
        <CardContent className="p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Required documents for CVOR</h3>
          <div className="space-y-2">
            {[
              "Ontario Business Registration Certificate",
              "Commercial vehicle insurance certificate ($2M+ liability)",
              "Vehicle registration and title",
              "Driver's licence abstract for all drivers",
              "Proof of Ontario business address",
            ].map((doc) => {
              const uploaded = documents?.some(d => d.name.toLowerCase().includes(doc.toLowerCase().split(" ")[0]))
              return (
                <div key={doc} className="flex items-center gap-2 text-sm">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center ${uploaded ? "bg-green-500" : "bg-gray-300"}`}>
                    {uploaded && <span className="text-white text-xs">✓</span>}
                  </div>
                  <span className={uploaded ? "line-through text-gray-400" : "text-gray-700"}>{doc}</span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
