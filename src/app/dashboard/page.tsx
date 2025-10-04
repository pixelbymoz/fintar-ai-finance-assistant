import { AppSidebar } from "@/components/app-sidebar"
import dynamic from "next/dynamic";
import { getTotals, getRecent } from "@/lib/db";

const IncomeExpenseChart = dynamic(() => import("@/components/IncomeExpenseChart"), {
  loading: () => (
    <div className="border rounded-lg p-6 bg-card animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-40 mb-4"></div>
      <div className="h-64 bg-gray-200 rounded"></div>
    </div>
  ),
});

const RecentTransactions = dynamic(() => import("@/components/RecentTransactions"), {
  loading: () => (
    <div className="border rounded-lg p-6 bg-card animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-40 mb-4"></div>
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
              <div>
                <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </div>
        ))}
      </div>
    </div>
  ),
});
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

export default async function Page() {
  let dashboardContent;
  
  try {
    const totals = await getTotals();
    const recent = await getRecent();

    const chartData = [
      { name: "All", income: totals.income, expenses: totals.expenses },
    ];

    dashboardContent = (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="border rounded-lg p-6 bg-card">
            <div className="text-sm text-muted-foreground">Total Income</div>
            <div className="text-2xl font-semibold text-green-600">Rp {totals.income.toLocaleString('id-ID')}</div>
          </div>
          <div className="border rounded-lg p-6 bg-card">
            <div className="text-sm text-muted-foreground">Total Expenses</div>
            <div className="text-2xl font-semibold text-red-600">Rp {totals.expenses.toLocaleString('id-ID')}</div>
          </div>
          <div className="border rounded-lg p-6 bg-card">
            <div className="text-sm text-muted-foreground">Total Assets</div>
            <div className="text-2xl font-semibold text-blue-600">Rp {totals.assets.toLocaleString('id-ID')}</div>
          </div>
          <div className="border rounded-lg p-6 bg-card">
            <div className="text-sm text-muted-foreground">Net Worth</div>
            <div className="text-2xl font-semibold text-purple-600">Rp {totals.netWorth.toLocaleString('id-ID')}</div>
          </div>
        </div>

        <IncomeExpenseChart data={chartData} />

        <RecentTransactions items={recent as unknown as { id: string; type: "income"|"expense"|"asset"; amount: number; description: string|null; category: string; date: string }[]} />
      </div>
    );
  } catch {
    dashboardContent = (
      <div className="border rounded-lg p-6 bg-red-50 text-red-900">
        Please sign in to view your dashboard.
      </div>
    );
  }

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
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="space-y-4 mb-4">
            <h1 className="text-xl font-semibold">Financial Dashboard</h1>
            <p className="text-sm text-gray-600">Monitor your business income, expenses, and assets at a glance.</p>
          </div>
          {dashboardContent}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
