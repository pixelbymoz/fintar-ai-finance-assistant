"use client"

import * as React from "react"
import Link from "next/link"
import {
  BarChart3,
  MessageSquare,
  Settings2,
  TrendingUp,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { ClerkUserProfile } from "@/components/clerk-user-profile"
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
        <Link href="/chatbot" prefetch={true}>
          <button className="w-full flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer" style={{backgroundColor: '#eec1a0', color: '#010B13'}} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e6b894'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#eec1a0'}>
            <MessageSquare className="h-5 w-5" />
            Chat with Fintar
          </button>
        </Link>
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
