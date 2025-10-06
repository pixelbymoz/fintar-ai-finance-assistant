"use client";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Receipt, TrendingUp, TrendingDown, Wallet, Edit, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
  const router = useRouter();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Tx | null>(null);
  const [transactionToDelete, setTransactionToDelete] = useState<Tx | null>(null);
  
  // Sort dari yang paling baru ke yang lama
  const sortedItems = [...items].sort((a, b) => {
    const ta = new Date(a.date).getTime();
    const tb = new Date(b.date).getTime();
    return tb - ta; // desc
  });

  const totalPages = Math.ceil(sortedItems.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = sortedItems.slice(startIndex, endIndex);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "income":
        return (
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-muted">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </span>
        );
      case "expense":
        return (
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-muted">
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </span>
        );
      case "asset":
        return (
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-muted">
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </span>
        );
      default:
        return (
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-muted">
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </span>
        );
    }
  };

  const getTypeBadge = (type: string) => {
    const dotClass =
      type === "income"
        ? "bg-emerald-500"
        : type === "expense"
        ? "bg-rose-500"
        : type === "asset"
        ? "bg-sky-500"
        : "bg-muted-foreground";

    const label = type;

    return (
      <Badge variant="outline" className="capitalize gap-1">
        <span className={`h-2 w-2 rounded-full ${dotClass}`} />
        {label}
      </Badge>
    );
  };

  const formatAmount = (amount: number) => {
    const formatted = `Rp ${amount.toLocaleString('id-ID')}`;
    return <span className="font-semibold text-foreground">{formatted}</span>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      timeZone: 'Asia/Jakarta',
    });
  };

  const handleEdit = (transaction: Tx) => {
    setEditingTransaction(transaction);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (transaction: Tx) => {
    setTransactionToDelete(transaction);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingTransaction) return;
    try {
      const response = await fetch(`/api/transactions/${editingTransaction.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingTransaction),
      });
      if (response.ok) {
        toast.success("Transaksi berhasil diperbarui!");
        setIsEditDialogOpen(false);
        setEditingTransaction(null);
        router.refresh();
      } else {
        toast.error("Gagal memperbarui transaksi");
      }
    } catch {
      toast.error("Terjadi kesalahan saat memperbarui transaksi");
    }
  };

  const handleConfirmDelete = async () => {
    if (!transactionToDelete) return;
    try {
      const response = await fetch(`/api/transactions/${transactionToDelete.id}`, { method: 'DELETE' });
      if (response.ok) {
        toast.success("Transaksi berhasil dihapus!");
        setIsDeleteDialogOpen(false);
        setTransactionToDelete(null);
        router.refresh();
      } else {
        toast.error("Gagal menghapus transaksi");
      }
    } catch {
      toast.error("Terjadi kesalahan saat menghapus transaksi");
    }
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
                <TableHead className="font-semibold text-primary text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
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
                      {formatAmount(transaction.amount)}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">
                      {formatDate(transaction.date)}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(transaction)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(transaction)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
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

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Transaksi</DialogTitle>
            <DialogDescription>Ubah detail transaksi di bawah ini</DialogDescription>
          </DialogHeader>
          {editingTransaction && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Tipe</label>
                <Select value={editingTransaction.type} onValueChange={(v: "income"|"expense"|"asset") => setEditingTransaction({ ...editingTransaction, type: v })}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                    <SelectItem value="asset">Asset</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Kategori</label>
                <Input value={editingTransaction.category} onChange={(e) => setEditingTransaction({ ...editingTransaction, category: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium">Deskripsi</label>
                <Input value={editingTransaction.description ?? ""} onChange={(e) => setEditingTransaction({ ...editingTransaction, description: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium">Jumlah</label>
                <Input type="number" value={editingTransaction.amount} onChange={(e) => setEditingTransaction({ ...editingTransaction, amount: Number(e.target.value) })} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Batal</Button>
            <Button onClick={handleSaveEdit}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Transaksi</DialogTitle>
            <DialogDescription>Apakah Anda yakin ingin menghapus transaksi ini?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Batal</Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>Hapus</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}