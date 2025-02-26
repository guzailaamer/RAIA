import { ReactNode } from "react"
import { SidebarNav } from "@/components/sidebar-nav"

export default function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <SidebarNav />
      <main className="flex-1 bg-gray-50">{children}</main>
    </div>
  )
}

