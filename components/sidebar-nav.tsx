"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, LogOut, MessageSquare, Upload, User } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const sidebarLinks = [
  {
    title: "Home",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Profile",
    href: "/profile",
    icon: User,
  },
]

export function SidebarNav() {
  const pathname = usePathname()

  return (
    <div className="flex w-64 flex-col border-r bg-card">
      <div className="p-6">
        <h2 className="text-lg font-semibold">Interview-AI</h2>
      </div>
      <nav className="flex-1 space-y-1 p-2">
        {sidebarLinks.map((link) => {
          const Icon = link.icon
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
                pathname === link.href
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {link.title}
            </Link>
          )
        })}
        <Link href="/interview/setup">
          <Button className="w-full justify-start gap-2">
            <MessageSquare className="h-4 w-4" />
            Start Interview
          </Button>
        </Link>
        
      </nav>
      <div className="p-4">
        <Button variant="ghost" className="w-full justify-start gap-2">
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}

