import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-12 gap-6">
      <aside className="col-span-3 lg:col-span-2 border rounded p-4">
        <div className="font-semibold mb-2">Dashboard</div>
        <ul className="space-y-2 text-sm">
          <li><a href="/dashboard" className="underline">Overview</a></li>
          <li><a href="/chatbot" className="underline">Chatbot</a></li>
        </ul>
      </aside>
      <section className="col-span-9 lg:col-span-10">{children}</section>
    </div>
  );
}