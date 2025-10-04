import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"

export default function Loading() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/">
                    Home
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Chatbot</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="min-h-[100vh] max-w-2xl mx-auto w-full animate-pulse">
            {/* Loading skeleton for chat interface */}
            <div className="space-y-4">
              {/* Welcome message skeleton */}
              <div className="flex justify-start">
                <div className="max-w-xs lg:max-w-md">
                  <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                  <div className="bg-gray-200 rounded-lg p-3">
                    <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
              
              {/* Sample conversation skeleton */}
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-4">
                  {/* User message skeleton */}
                  <div className="flex justify-end">
                    <div className="max-w-xs lg:max-w-md">
                      <div className="bg-gray-200 rounded-lg p-3">
                        <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                        <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* AI response skeleton */}
                  <div className="flex justify-start">
                    <div className="max-w-xs lg:max-w-md">
                      <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
                      <div className="bg-gray-200 rounded-lg p-3">
                        <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                        <div className="h-4 bg-gray-300 rounded w-5/6 mb-2"></div>
                        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Input area skeleton */}
            <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4">
              <div className="max-w-2xl mx-auto">
                <div className="flex gap-2">
                  <div className="flex-1 h-10 bg-gray-200 rounded-md"></div>
                  <div className="h-10 w-10 bg-gray-200 rounded-md"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}