import { AppSidebar } from "@/components/app-sidebar"
import IncomeExpenseChart from "@/components/IncomeExpenseChart";
import RecentTransactions from "@/components/RecentTransactions";
import { getTotals, getRecent, getAllTransactions } from "@/lib/db";
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
import { currentUser } from "@clerk/nextjs/server";

export default async function Page() {
  let dashboardContent;
  const user = await currentUser();
  const hasName = !!(user?.firstName || user?.lastName);
  const greeting = hasName ? `Hello ${user?.firstName ?? ""}`.trim() : "Hello";

  try {
    const totals = await getTotals();
    const recent = await getRecent();

    // Ambil semua transaksi dan agregasi per-hari untuk minggu berjalan dan minggu sebelumnya (minggu dimulai Minggu)
    const all = await getAllTransactions();

    const today = new Date();
    const dayIdx = today.getDay(); // 0=Minggu
    const startCurrent = new Date(today.getFullYear(), today.getMonth(), today.getDate() - dayIdx);
    const endCurrent = new Date(startCurrent.getFullYear(), startCurrent.getMonth(), startCurrent.getDate() + 6);
    const startPrev = new Date(startCurrent.getFullYear(), startCurrent.getMonth(), startCurrent.getDate() - 7);
    const endPrev = new Date(startPrev.getFullYear(), startPrev.getMonth(), startPrev.getDate() + 6);

    const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const currentTotals = Array.from({ length: 7 }, () => ({ income: 0, expenses: 0 }));
    const prevTotals = Array.from({ length: 7 }, () => ({ income: 0, expenses: 0 }));

    const normalize = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const inRange = (d: Date, start: Date, end: Date) => d >= start && d <= end;

    for (const tx of all as unknown as { type: "income"|"expense"|"asset"; amount: number; date: string }[]) {
      if (tx.type === "asset") continue;
      const d = normalize(new Date(tx.date));
      if (inRange(d, startCurrent, endCurrent)) {
        const idx = Math.round((d.getTime() - startCurrent.getTime()) / 86400000);
        if (tx.type === "income") currentTotals[idx].income += Number(tx.amount || 0);
        if (tx.type === "expense") currentTotals[idx].expenses += Number(tx.amount || 0);
      } else if (inRange(d, startPrev, endPrev)) {
        const idx = Math.round((d.getTime() - startPrev.getTime()) / 86400000);
        if (tx.type === "income") prevTotals[idx].income += Number(tx.amount || 0);
        if (tx.type === "expense") prevTotals[idx].expenses += Number(tx.amount || 0);
      }
    }

    const chartData = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startCurrent.getFullYear(), startCurrent.getMonth(), startCurrent.getDate() + i);
      const label = `${dayNames[date.getDay()]} ${date.getDate()}`;
      return {
        name: label,
        income: currentTotals[i].income,
        expenses: currentTotals[i].expenses,
        income_prev: prevTotals[i].income,
        expenses_prev: prevTotals[i].expenses,
      };
    });

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
        <header className="flex h-16 shrink-0 items-center gap-2 bg-white border-b border-border transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
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
          <div className="min-h-[100vh] flex-1 rounded-xl bg-[#fafcff] md:min-h-min">
            <div className="p-6">
              <div className="space-y-2 mb-6">
                <h1 className="text-3xl font-bold tracking-tight">{greeting} <span role="img" aria-label="wave">👋</span></h1>
                <p className="text-muted-foreground">Lihat pendapatan, pengeluaran, dan aset bisnis Anda secara instan, tanpa ribet.</p>
              </div>
              {dashboardContent}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
