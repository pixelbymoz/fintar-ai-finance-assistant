import IncomeExpenseChart from "@/components/IncomeExpenseChart";
import RecentTransactions from "@/components/RecentTransactions";
import { getTotals, getRecent } from "@/lib/db";

export default async function DashboardPage() {
  try {
    const totals = await getTotals();
    const recent = await getRecent();

    const chartData = [
      { name: "All", income: totals.income, expenses: totals.expenses },
    ];

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="border rounded p-4">
            <div className="text-sm text-gray-500">Total Income</div>
            <div className="text-2xl font-semibold">Rp {totals.income.toLocaleString('id-ID')}</div>
          </div>
          <div className="border rounded p-4">
            <div className="text-sm text-gray-500">Total Expenses</div>
            <div className="text-2xl font-semibold">Rp {totals.expenses.toLocaleString('id-ID')}</div>
          </div>
          <div className="border rounded p-4">
            <div className="text-sm text-gray-500">Total Assets</div>
            <div className="text-2xl font-semibold">Rp {totals.assets.toLocaleString('id-ID')}</div>
          </div>
          <div className="border rounded p-4">
            <div className="text-sm text-gray-500">Net Worth</div>
            <div className="text-2xl font-semibold">Rp {totals.netWorth.toLocaleString('id-ID')}</div>
          </div>
        </div>

        <IncomeExpenseChart data={chartData} />

        <RecentTransactions items={recent as unknown as { id: string; type: "income"|"expense"|"asset"; amount: number; description: string|null; category: string; date: string }[]} />
      </div>
    );
  } catch {
    return (
      <div className="border rounded p-4 bg-red-50 text-red-900">
        Please sign in to view your dashboard.
      </div>
    );
  }
}