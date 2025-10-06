"use client"

import Link from "next/link"
import { TrendingUp } from "lucide-react"
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs"

export function MainHeader() {
  const { isSignedIn } = useUser()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary/10 bg-background/80 shadow-sm backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center gap-2">
            <TrendingUp className="h-8 w-8 text-secondary" />
            <span className="text-2xl font-bold text-primary">Fintar</span>
          </div>

          {/* Authentication Section */}
          <div className="flex items-center gap-4">
            {isSignedIn ? (
              <div className="flex items-center gap-4">
                <Link href="/dashboard" prefetch={true}>
                  <button className="px-4 py-2 bg-secondary text-primary rounded-lg font-medium hover:bg-opacity-80 transition-colors cursor-pointer">
                    Dashboard
                  </button>
                </Link>
                <UserButton afterSignOutUrl="/" />
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <SignInButton mode="modal">
                  <button className="px-4 py-2 text-primary border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors cursor-pointer">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="px-4 py-2 bg-secondary text-primary rounded-lg font-medium hover:bg-opacity-80 transition-colors cursor-pointer">
                    Sign Up
                  </button>
                </SignUpButton>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}