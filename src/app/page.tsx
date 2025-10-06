import { MainHeader } from "@/components/main-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BarChart3,
  Check,
  FileSpreadsheet,
  LayoutDashboard,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Users,
  Crown,
} from "lucide-react";

interface Feature {
  title: string;
  description: string;
  detail: string;
  icon: LucideIcon;
}

interface Plan {
  name: string;
  price: string;
  note?: string;
  description: string;
  features: string[];
  highlighted?: boolean;
}

const features: Feature[] = [
  {
    title: "AI Chat Assistant",
    description:
      "Catat transaksi, tanyakan laporan, dan dapatkan insight keuangan melalui percakapan natural.",
    detail:
      '"Fintar, berapa total pengeluaran bulan ini?" AI langsung menampilkan data terkini dan ringkasan singkat.',
    icon: MessageCircle,
  },
  {
    title: "Smart Dashboard",
    description: "Semua data keuangan kamu tampil dengan cara yang mudah dipahami.",
    detail:
      "Grafik yang clean dan informatif membantu melihat arus uang, pengeluaran terbesar, dan perkembangan aset tanpa pusing buka spreadsheet.",
    icon: LayoutDashboard,
  },
  {
    title: "Secure & Private",
    description: "Fintar menjamin keamanan dan privasi data finansial kamu.",
    detail:
      "Semua data terenkripsi dan disimpan dengan keamanan tingkat tinggi sehingga tidak ada yang dibagikan tanpa izin.",
    icon: ShieldCheck,
  },
];

const plans: Plan[] = [
  {
    name: "Free",
    price: "Rp 0 / bulan",
    description: "Mulai dari langkah kecil. Coba Fintar tanpa risiko.",
    features: [
      "Catat hingga 50 transaksi / bulan",
      "Dashboard dasar",
      "10 chat AI Assistant / bulan",
      "Mulai tanpa kartu kredit",
    ],
  },
  {
    name: "Pro",
    price: "Rp 49.000 / bulan",
    note: "Rp 490.000 / tahun - hemat 2 bulan",
    description: "Untuk yang ingin mengatur keuangan pribadi dengan lebih rapi dan terarah.",
    features: [
      "Transaksi tanpa batas",
      "Akses penuh AI Assistant",
      "Dashboard detail & kategori custom",
      "Export laporan ke PDF / Excel",
      "Sinkronisasi multi-device",
    ],
    highlighted: true,
  },
  {
    name: "Business",
    price: "Rp 99.000 / bulan",
    note: "Rp 990.000 / tahun",
    description: "Untuk kamu yang juga menjalankan usaha atau punya sumber penghasilan ganda.",
    features: [
      "Semua fitur Pro",
      "Multi-user (pemilik & tim)",
      "Klasifikasi otomatis pendapatan pribadi & bisnis",
      "Laporan pajak sederhana",
      "Smart insights & cashflow forecast",
      "Dukungan prioritas",
    ],
  },
];

const reasons: string[] = [
  "Mudah digunakan - tanpa perlu paham akuntansi",
  "Aman & private - data terenkripsi sepenuhnya",
  "Asisten AI 24/7 yang selalu siap membantu",
  "Dirancang untuk semua: karyawan, freelancer, dan pemilik usaha di Indonesia",
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <MainHeader />
      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-muted via-white to-accent" />
          <div className="absolute -top-32 -left-32 h-80 w-80 rounded-full bg-secondary/30 blur-3xl" />
          <div className="absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
            <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
              <div className="space-y-6">
                <Badge className="bg-secondary/20 text-secondary-foreground w-fit">
                  <Sparkles className="mr-2 h-4 w-4" /> Fintar - AI Finance Assistant
                </Badge>
                <h1 className="text-4xl sm:text-5xl font-semibold leading-tight text-primary">
                  Uang kamu, teratur. Pikiran kamu, tenang.
                </h1>
                <p className="text-lg text-muted-foreground max-w-xl">
                  Fintar membantu mencatat dan mengelola pendapatan, pengeluaran, serta aset bisnis melalui percakapan cerdas.
                  Tanpa rumus rumit, tanpa tabel yang membingungkan - cukup berbicara dan semuanya tercatat otomatis.
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <Button size="lg" className="gap-2">
                    Coba Gratis Sekarang
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="lg" className="border-primary/20 text-primary">
                    Lihat Cara Kerja
                  </Button>
                </div>
                <div className="flex flex-wrap gap-6 pt-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-secondary" />
                    Catatan otomatis via percakapan
                  </div>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-secondary" />
                    Insight real-time dan mudah dipahami
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-secondary" />
                    Keamanan setara enterprise
                  </div>
                </div>
              </div>
              <Card className="backdrop-blur-xl bg-white/80 border-none shadow-lg shadow-secondary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <MessageCircle className="h-6 w-6 text-secondary" />
                    Percakapan AI yang selalu siap
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-2 rounded-xl border border-dashed border-secondary/40 bg-secondary/10 p-4">
                    <p className="text-sm font-semibold text-primary">Anda</p>
                    <p className="text-sm text-muted-foreground">
                      "Fintar, berapa total pengeluaran bulan ini?"
                    </p>
                  </div>
                  <div className="space-y-2 rounded-xl bg-white p-4 shadow-sm">
                    <p className="text-sm font-semibold text-secondary-foreground flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-secondary" /> Fintar AI
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Total pengeluaran bulan Oktober sebesar Rp 18.450.000, naik 8% dibanding bulan sebelumnya.
                      Pengeluaran terbesar berasal dari kategori Operasional.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-lg bg-muted p-4">
                      <p className="text-xs text-muted-foreground">Pencatatan otomatis</p>
                      <p className="text-lg font-semibold text-primary">98%</p>
                    </div>
                    <div className="rounded-lg bg-muted p-4">
                      <p className="text-xs text-muted-foreground">Waktu hemat / minggu</p>
                      <p className="text-lg font-semibold text-primary">6 jam</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="max-w-3xl space-y-4">
              <h2 className="text-3xl font-semibold text-primary">Kelola Uang Tanpa Stress</h2>
              <p className="text-lg text-muted-foreground">
                Semua data keuangan pribadi maupun bisnismu berada dalam satu platform terpadu.
                Gunakan percakapan alami untuk mencatat transaksi, memantau cashflow, dan memahami keuangan tanpa kebingungan.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {features.map((feature) => (
                <Card key={feature.title} className="h-full border border-primary/10">
                  <CardHeader className="space-y-3">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/15 text-secondary">
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl text-primary">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                    <p className="text-sm font-medium text-secondary-foreground">{feature.detail}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-muted/60">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="space-y-4 max-w-3xl">
                <Badge className="bg-primary/10 text-primary">Harga yang transparan</Badge>
                <h2 className="text-3xl font-semibold text-primary">Pilih paket yang sesuai dengan ritme bisnis Anda</h2>
                <p className="text-lg text-muted-foreground">
                  Dari mencoba secara gratis hingga dukungan untuk tim berkembang - semua paket hadir dengan keahlian AI Fintar yang sama.
                </p>
              </div>
              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <Users className="h-5 w-5 text-secondary" />
                <span>Ribuan pelaku usaha kecil telah merapikan pembukuan harian dengan Fintar.</span>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {plans.map((plan) => (
                <Card
                  key={plan.name}
                  className={`flex h-full flex-col overflow-hidden border ${
                    plan.highlighted
                      ? "border-secondary/80 shadow-xl shadow-secondary/30 ring-1 ring-secondary/40"
                      : "border-primary/10"
                  }`}
                >
                  {plan.highlighted ? (
                    <div className="relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-secondary via-primary to-secondary opacity-90" />
                      <div className="relative flex items-center justify-center gap-2 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground">
                        <Crown className="h-4 w-4" />
                        Paket Terpopuler
                      </div>
                      <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-white/70 to-transparent" />
                    </div>
                  ) : null}
                  <CardHeader className={`space-y-2 ${plan.highlighted ? "bg-gradient-to-b from-secondary/10 to-transparent" : ""}`}>
                    <CardTitle className="text-2xl text-primary">{plan.name}</CardTitle>
                    <p className="text-xl font-semibold text-secondary-foreground">{plan.price}</p>
                    {plan.note ? (
                      <p className="text-xs font-medium text-secondary-foreground/80">{plan.note}</p>
                    ) : null}
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </CardHeader>
                  <CardContent className="mt-auto space-y-3 pb-6">
                    <div className="space-y-2">
                      {plan.features.map((feature) => (
                        <div key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <Check className="mt-0.5 h-4 w-4 text-secondary" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                    <Button className="w-full" variant={plan.highlighted ? "default" : "outline"}>
                      Mulai paket {plan.name}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-10 lg:grid-cols-[0.55fr_0.45fr]">
            <div className="space-y-6">
              <Badge className="bg-secondary/20 text-secondary-foreground w-fit">Kenapa Memilih Fintar</Badge>
              <h2 className="text-3xl font-semibold text-primary">Fintar memadukan kecerdasan AI dengan pengalaman finansial yang humanis.</h2>
              <p className="text-lg text-muted-foreground">
                Dibangun untuk membantu karyawan, freelancer, dan pelaku bisnis mengelola keuangan harian tanpa rasa cemas atau kerumitan.
              </p>
              <div className="space-y-3">
                {reasons.map((reason) => (
                  <div key={reason} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <Check className="mt-0.5 h-5 w-5 text-secondary" />
                    <span>{reason}</span>
                  </div>
                ))}
              </div>
            </div>
            <Card className="border-primary/10 bg-gradient-to-br from-white via-accent/60 to-muted shadow-lg shadow-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-primary">
                  <FileSpreadsheet className="h-5 w-5 text-secondary" />
                  Semua data finansial dalam satu tempat
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <p>
                  Dashboard adaptif Fintar menggabungkan catatan transaksi, arus kas, dan proyeksi dalam tampilan modern.
                  Temukan pola, kontrol pengeluaran, dan buat keputusan cerdas tanpa berpindah aplikasi.
                </p>
                <div className="rounded-lg border border-primary/10 bg-white p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">Health Score</p>
                      <p className="text-2xl font-semibold text-primary">87</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Forecast 30 hari</p>
                      <p className="text-lg font-semibold text-secondary-foreground">+12%</p>
                    </div>
                  </div>
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Operasional</span>
                      <span>Rp 8.900.000</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Marketing</span>
                      <span>Rp 4.150.000</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Team & Payroll</span>
                      <span>Rp 3.780.000</span>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg bg-muted p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Dipercaya oleh</p>
                  <div className="mt-2 flex items-center gap-3 text-sm">
                    <Users className="h-4 w-4 text-secondary" />
                    1.200+ bisnis kecil dan freelancer memercayakan data mereka ke Fintar.
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl border border-primary/10 bg-secondary/10 px-6 py-16 text-center shadow-xl shadow-secondary/20">
              <div className="mx-auto mb-4 h-1 w-16 rounded-full bg-secondary/70" />
              <h2 className="text-3xl sm:text-4xl font-semibold text-primary">
                Saatnya punya asisten keuangan pribadi yang bisa diajak ngobrol.
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Mulai gratis hari ini dan rasakan bagaimana Fintar membantu memahami, mencatat, dan mengelola keuangan dengan lebih cerdas.
              </p>
              <div className="mt-8 flex justify-center">
                <Button size="lg" className="gap-2 px-10 bg-secondary text-primary font-semibold shadow-lg shadow-secondary/40 hover:bg-secondary/90">
                  Coba Gratis Sekarang
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">Tanpa perlu kartu kredit</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-primary/10 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-sm text-muted-foreground flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-primary">Fintar &copy; 2025</p>
            <p>Dibangun untuk membantu bisnis kecil mengelola keuangan dengan lebih cerdas dan sederhana.</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <a className="hover:text-primary" href="#">Privacy Policy</a>
            <a className="hover:text-primary" href="#">Terms</a>
            <a className="hover:text-primary" href="#">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

