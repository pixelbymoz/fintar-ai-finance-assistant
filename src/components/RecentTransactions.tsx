type Tx = {
  id: string;
  type: "income" | "expense" | "asset";
  amount: number;
  description: string | null;
  category: string;
  date: string;
};

type Props = {
  items: Tx[];
};

export default function RecentTransactions({ items }: Props) {
  return (
    <div className="border rounded">
      <div className="p-3 font-medium border-b">Recent Transactions</div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left">
            <th className="p-3">Type</th>
            <th className="p-3">Category</th>
            <th className="p-3">Description</th>
            <th className="p-3">Amount</th>
            <th className="p-3">Date</th>
          </tr>
        </thead>
        <tbody>
          {items.map((t) => (
            <tr key={t.id} className="border-t">
              <td className="p-3 capitalize">{t.type}</td>
              <td className="p-3">{t.category}</td>
              <td className="p-3">{t.description ?? "—"}</td>
              <td className="p-3">${t.amount.toFixed(2)}</td>
              <td className="p-3">{t.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}