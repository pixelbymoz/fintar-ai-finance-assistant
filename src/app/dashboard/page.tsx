import { AppSidebar } from "@/components/app-sidebar"
import IncomeExpenseChart from "@/components/IncomeExpenseChart";
import RecentTransactions from "@/components/RecentTransactions";
import { getTotals, getRecent } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Wallet, PiggyBank } from "lucide-react";
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Pendapatan
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                Rp {totals.income.toLocaleString('id-ID')}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                +20.1% dari bulan lalu
              </p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Pengeluaran
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                Rp {totals.expenses.toLocaleString('id-ID')}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                +10.5% dari bulan lalu
              </p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Aset
              </CardTitle>
              <Wallet className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                Rp {totals.assets.toLocaleString('id-ID')}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                +5.2% dari bulan lalu
              </p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Kekayaan Bersih
              </CardTitle>
              <PiggyBank className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                Rp {totals.netWorth.toLocaleString('id-ID')}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                +15.3% dari bulan lalu
              </p>
            </CardContent>
          </Card>
        </div>

        <IncomeExpenseChart data={chartData} />

        <RecentTransactions items={recent as unknown as { id: string; type: "income"|"expense"|"asset"; amount: number; description: string|null; category: string; date: string }[]} />
      </div>
    );
  } catch {
    dashboardContent = (
      <div className="border rounded-lg p-6 bg-red-50 text-red-900">
        Silakan masuk untuk melihat Dashboard Anda.
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 bg-accent border-b border-border transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/">
                    Beranda
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
            <h1 className="text-xl font-semibold">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Pantau pendapatan, pengeluaran, dan aset bisnis Anda secara sekilas.</p>
          </div>
          {dashboardContent}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
