"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard, FileText, Upload, CreditCard, Settings,
  Truck, Users, ClipboardList, BarChart3, LogOut, ChevronRight
} from "lucide-react"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface SidebarItem {
  label: string
  href: string
  icon: React.ElementType
}

interface SidebarProps {
  role: "customer" | "admin" | "partner"
  orgName?: string
  userName?: string
}

const customerNav: SidebarItem[] = [
  { label: "Overview", href: "/app", icon: LayoutDashboard },
  { label: "My Services", href: "/app/services", icon: Truck },
  { label: "Documents", href: "/app/documents", icon: Upload },
  { label: "Billing", href: "/app/billing", icon: CreditCard },
  { label: "Settings", href: "/app/settings", icon: Settings },
]

const adminNav: SidebarItem[] = [
  { label: "Overview", href: "/admin", icon: BarChart3 },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Orders", href: "/admin/orders", icon: ClipboardList },
  { label: "Tasks", href: "/admin/tasks", icon: FileText },
  { label: "Partners", href: "/admin/partners", icon: Users },
  { label: "Billing", href: "/admin/billing", icon: CreditCard },
]

const partnerNav: SidebarItem[] = [
  { label: "My Jobs", href: "/partner", icon: ClipboardList },
  { label: "Completed", href: "/partner/completed", icon: FileText },
  { label: "Settings", href: "/partner/settings", icon: Settings },
]

export function Sidebar({ role, orgName, userName }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const navItems = role === "admin" ? adminNav : role === "partner" ? partnerNav : customerNav

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <div className="flex flex-col h-full bg-[#1a2744] text-white w-64 shrink-0">
      {/* Brand */}
      <div className="p-6 border-b border-[#243359]">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-orange-600 rounded-lg p-1.5">
            <Truck className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-base">TruckComply</span>
        </Link>
        {orgName && (
          <div className="mt-3">
            <p className="text-xs text-gray-400">Organization</p>
            <p className="text-sm font-medium text-white truncate">{orgName}</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = item.href === "/app" || item.href === "/admin" || item.href === "/partner"
            ? pathname === item.href
            : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-orange-600 text-white"
                  : "text-gray-300 hover:bg-[#243359] hover:text-white"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
              {isActive && <ChevronRight className="h-3 w-3 ml-auto" />}
            </Link>
          )
        })}
      </nav>

      {/* User + logout */}
      <div className="p-4 border-t border-[#243359]">
        {userName && (
          <p className="text-xs text-gray-400 mb-3 truncate">{userName}</p>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-[#243359] w-full transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </div>
  )
}
