import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { TaskStatusBadge } from "@/components/dashboard/status-badge"
import { formatDate } from "@/lib/utils"
import { FileText } from "lucide-react"

export default async function AdminTasksPage() {
  const supabase = await createClient()

  const { data: tasks } = await supabase
    .from("compliance_tasks")
    .select(`
      *,
      organizations(name),
      profiles!assigned_to(full_name)
    `)
    .order("due_date", { ascending: true, nullsFirst: false })

  const pending = tasks?.filter(t => t.status !== "completed") || []
  const completed = tasks?.filter(t => t.status === "completed") || []

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Compliance Tasks</h1>
        <p className="text-gray-500 mt-1">
          {pending.length} pending · {completed.length} completed
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left p-4 font-semibold text-gray-700">Task</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Customer</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Status</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Assigned</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Due Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {tasks?.map((task) => {
                  const org = task.organizations as { name: string } | null
                  const assigned = task.profiles as { full_name: string | null } | null
                  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== "completed"

                  return (
                    <tr key={task.id} className={`hover:bg-gray-50 ${isOverdue ? "bg-red-50" : ""}`}>
                      <td className="p-4">
                        <p className="font-medium text-gray-900">{task.title}</p>
                        {task.description && (
                          <p className="text-xs text-gray-500 truncate max-w-[200px]">{task.description}</p>
                        )}
                      </td>
                      <td className="p-4 text-gray-700">{org?.name || "—"}</td>
                      <td className="p-4">
                        <TaskStatusBadge status={task.status} />
                      </td>
                      <td className="p-4 text-gray-700">
                        {assigned?.full_name || <span className="text-gray-400 italic">Unassigned</span>}
                      </td>
                      <td className="p-4">
                        {task.due_date ? (
                          <span className={isOverdue ? "text-red-600 font-medium" : "text-gray-600"}>
                            {formatDate(task.due_date)}
                            {isOverdue && " ⚠"}
                          </span>
                        ) : "—"}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {!tasks?.length && (
              <div className="text-center py-12 text-gray-400">
                <FileText className="h-8 w-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No tasks found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
