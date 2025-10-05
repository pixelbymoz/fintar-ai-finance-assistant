"use client"

import * as React from "react"
import Link from "next/link"
import {
  BarChart3,
  History,
  MessageSquare,
  TrendingUp,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { ClerkUserProfile } from "@/components/clerk-user-profile"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// Simplified navigation data
const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: BarChart3,
      isActive: true,
    },
    {
      title: "Riwayat Transaksi",
      url: "/dashboard/history",
      icon: History,
    },
   /* {
      title: "Settings",
      url: "/settings",
      icon: Settings2,
      items: [
        {
          title: "Profile",
          url: "/settings/profile",
        },
        {
          title: "Preferences",
          url: "/settings/preferences",
        },
        {
          title: "Security",
          url: "/settings/security",
        },
      ],
    },*/
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <TrendingUp className="h-6 w-6 text-secondary" />
          <span className="text-lg font-semibold text-secondary">Fintar</span>
        </div>
      </SidebarHeader>
      
      {/* Chat with Fintar Button */}
      <div className="px-4 pb-4">
        <Button asChild className="w-full bg-secondary text-primary hover:bg-secondary/90 shadow-sm">
          <Link href="/chatbot" prefetch={true} className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Chat dengan Fintar
          </Link>
        </Button>
      </div>
      
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <ClerkUserProfile />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
