"use client";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { TrendingUp } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Props = {
  data: { name: string; income: number; expenses: number; income_prev?: number; expenses_prev?: number }[];
};

const chartConfig = {
  income: { label: "Pendapatan (minggu ini)", color: "hsl(var(--primary))" },
  expenses: { label: "Pengeluaran (minggu ini)", color: "hsl(var(--secondary))" },
  income_prev: { label: "Pendapatan (minggu lalu)", color: "hsl(var(--primary))" },
  expenses_prev: { label: "Pengeluaran (minggu lalu)", color: "hsl(var(--secondary))" },
} satisfies ChartConfig;

export default function IncomeExpenseChart({ data }: Props) {
  const [compareMode, setCompareMode] = useState<"none" | "prev_week">("none");
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Pendapatan vs Pengeluaran
        </CardTitle>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <CardDescription>
            Data harian minggu ini (Minggu–Sabtu). Tambahkan perbandingan jika perlu.
          </CardDescription>
          <div className="mt-2 sm:mt-0">
            <Select value={compareMode} onValueChange={(v: "none" | "prev_week") => setCompareMode(v)}>
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="Pilih perbandingan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Minggu Ini</SelectItem>
                <SelectItem value="prev_week">Bandingkan dengan minggu lalu</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="name" 
                className="text-sm"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                className="text-sm"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `Rp ${(value / 1000000).toFixed(0)}M`}
              />
              <ChartTooltip 
                content={<ChartTooltipContent />}
                formatter={(value: number, name: string) => {
                  const labelMap: Record<string, string> = {
                    income: 'Pendapatan (minggu ini)',
                    expenses: 'Pengeluaran (minggu ini)',
                    income_prev: 'Pendapatan (minggu lalu)',
                    expenses_prev: 'Pengeluaran (minggu lalu)'
                  };
                  return [
                    `Rp ${value.toLocaleString('id-ID')}`,
                    labelMap[name] || name
                  ];
                }}
              />
              <Bar 
                dataKey="income" 
                fill="var(--color-income)" 
                radius={[4, 4, 0, 0]}
                className="fill-primary"
              />
              <Bar 
                dataKey="expenses" 
                fill="var(--color-expenses)" 
                radius={[4, 4, 0, 0]}
                className="fill-secondary"
              />
              {compareMode === "prev_week" && (
                <>
                  <Bar 
                    dataKey="income_prev" 
                    fill="var(--color-income_prev)" 
                    radius={[4, 4, 0, 0]}
                    className="fill-primary"
                    fillOpacity={0.35}
                  />
                  <Bar 
                    dataKey="expenses_prev" 
                    fill="var(--color-expenses_prev)" 
                    radius={[4, 4, 0, 0]}
                    className="fill-secondary"
                    fillOpacity={0.35}
                  />
                </>
              )}
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}