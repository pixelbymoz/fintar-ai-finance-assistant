import { AppSidebar } from "@/components/app-sidebar"
import { TransactionHistory } from "@/components/TransactionHistory"
import { getAllTransactions } from "@/lib/db"
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

type Transaction = {
  id: string;
  type: "income" | "expense" | "asset";
  amount: number;
  description: string | null;
  category: string;
  date: string;
};

export default async function HistoryPage() {
  let transactions: Transaction[];
  
  try {
    transactions = await getAllTransactions() as Transaction[];
  } catch (error) {
    console.error("Error fetching transactions:", error);
    transactions = [];
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
                  <BreadcrumbLink href="/dashboard">
                    Dasbor
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Riwayat Transaksi</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
            <div className="p-6">
              <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Riwayat Transaksi</h1>
                <p className="text-muted-foreground">
                  Kelola dan lihat semua transaksi keuangan Anda
                </p>
              </div>
              <TransactionHistory transactions={transactions} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}