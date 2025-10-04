"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { TrendingUp } from "lucide-react";

type Props = {
  data: { name: string; income: number; expenses: number }[];
};

const chartConfig = {
  income: {
    label: "Pendapatan",
    color: "hsl(var(--chart-1))",
  },
  expenses: {
    label: "Pengeluaran", 
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export default function IncomeExpenseChart({ data }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Pendapatan vs Pengeluaran
        </CardTitle>
        <CardDescription>
          Perbandingan bulanan pendapatan dan pengeluaran Anda
        </CardDescription>
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
                formatter={(value: number, name: string) => [
                  `Rp ${value.toLocaleString('id-ID')}`,
                  name === 'income' ? 'Pendapatan' : 'Pengeluaran'
                ]}
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
                className="fill-destructive"
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}