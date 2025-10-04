"use client";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Receipt, TrendingUp, TrendingDown, Wallet } from "lucide-react";

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

const ITEMS_PER_PAGE = 5;

export default function RecentTransactions({ items }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = items.slice(startIndex, endIndex);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "income":
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "expense":
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      case "asset":
        return <Wallet className="h-4 w-4 text-blue-600" />;
      default:
        return <Receipt className="h-4 w-4" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const variants = {
      income: "default",
      expense: "destructive", 
      asset: "secondary"
    } as const;
    
    return (
      <Badge variant={variants[type as keyof typeof variants] || "outline"} className="capitalize">
        {type}
      </Badge>
    );
  };

  const formatAmount = (amount: number, type: string) => {
    const formatted = `Rp ${amount.toLocaleString('id-ID')}`;
    const colorClass = type === 'income' ? 'text-green-600' : type === 'expense' ? 'text-red-600' : 'text-blue-600';
    return <span className={`font-medium ${colorClass}`}>{formatted}</span>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt className="h-5 w-5" />
          Transaksi Terbaru
        </CardTitle>
        <CardDescription>
          Transaksi dan aktivitas keuangan terbaru Anda
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-primary/5 hover:bg-primary/10">
                <TableHead className="font-semibold text-primary">
                  <div className="flex items-center gap-2">
                    Tipe
                  </div>
                </TableHead>
                <TableHead className="font-semibold text-primary hidden sm:table-cell">Kategori</TableHead>
                <TableHead className="font-semibold text-primary hidden md:table-cell">Deskripsi</TableHead>
                <TableHead className="font-semibold text-primary text-right">Jumlah</TableHead>
                <TableHead className="font-semibold text-primary hidden sm:table-cell">Tanggal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Tidak ada transaksi ditemukan
                  </TableCell>
                </TableRow>
              ) : (
                currentItems.map((transaction) => (
                  <TableRow key={transaction.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(transaction.type)}
                        <div className="sm:hidden">
                          {getTypeBadge(transaction.type)}
                        </div>
                        <div className="hidden sm:block">
                          {getTypeBadge(transaction.type)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell font-medium">
                      {transaction.category}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="max-w-[200px] truncate">
                        {transaction.description || "—"}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatAmount(transaction.amount, transaction.type)}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">
                      {formatDate(transaction.date)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        {totalPages > 1 && (
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="text-sm text-muted-foreground">
              Menampilkan {startIndex + 1} hingga {Math.min(endIndex, items.length)} dari {items.length} transaksi
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Sebelumnya
              </Button>
              <div className="flex items-center space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="w-8 h-8 p-0"
                  >
                    {page}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Selanjutnya
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}