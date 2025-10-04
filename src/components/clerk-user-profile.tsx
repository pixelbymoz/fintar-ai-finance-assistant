"use client"

import { useUser, SignedIn, SignedOut, SignInButton, useClerk } from "@clerk/nextjs"
import { User, LogOut, Settings } from "lucide-react"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function ClerkUserProfile() {
  const { user, isLoaded } = useUser()
  const { signOut, openUserProfile } = useClerk()

  if (!isLoaded) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
              <div className="flex flex-col gap-1">
                <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
                <div className="h-2 w-16 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SignedIn>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton size="lg" className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer">
                <div className="flex items-center gap-3 w-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.imageUrl} alt={user?.fullName || "User"} />
                    <AvatarFallback>
                      {user?.firstName?.charAt(0) || user?.fullName?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">
                      {user?.fullName || user?.firstName || "User"}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {user?.primaryEmailAddress?.emailAddress || "No email"}
                    </span>
                  </div>
                  <User className="h-4 w-4 opacity-50" />
                </div>
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="start" className="w-56">
              <DropdownMenuItem onClick={() => openUserProfile()}>
                <Settings className="mr-2 h-4 w-4" />
                <span>User Profile</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SignedIn>
        <SignedOut>
          <SidebarMenuButton asChild>
            <SignInButton mode="modal">
              <div className="flex items-center gap-2 cursor-pointer">
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-xs">?</span>
                </div>
                <span className="text-sm">Sign In</span>
              </div>
            </SignInButton>
          </SidebarMenuButton>
        </SignedOut>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}