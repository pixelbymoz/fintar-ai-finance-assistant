'use client';

import { useState } from "react";
import { MainHeader } from "@/components/main-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  CalendarCheck,
  Check,
  LayoutDashboard,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";

interface Feature {
  title: string;
  description: string;
  detail: string;
  icon: LucideIcon;
}

type BillingCycle = "monthly" | "yearly";

interface Plan {
  name: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  pricing: Record<
    BillingCycle,
    {
      price: string;
      note?: string;
      cta: string;
    }
  >;
}

const features: Feature[] = [
  {
    title: "AI Chat Assistant",
    description: "Asisten pribadi yang bisa diajak ngobrol soal uang.",
    detail:
      'Catat pengeluaran harian, tanya saldo tabungan, atau minta ringkasan bulanan cukup dengan percakapan alami. "Fintar, berapa total pengeluaran makan di luar bulan ini?" AI langsung jawab dengan insight singkat dan grafik sederhana.',
    icon: MessageCircle,
  },
  {
    title: "Smart Dashboard",
    description: "Semua data finansial kamu tampil dengan cara yang mudah dipahami.",
    detail:
      "Grafik yang clean dan informatif membantu melihat arus uang, pengeluaran terbesar, serta perkembangan aset tanpa pusing buka spreadsheet.",
    icon: LayoutDashboard,
  },
  {
    title: "Secure & Private",
    description: "Data kamu aman, terenkripsi, dan tidak dibagikan tanpa izin.",
    detail:
      "Fintar menjaga privasi finansial kamu dengan standar keamanan tinggi sehingga kamu bisa fokus pada keputusan keuangan, bukan risiko data.",
    icon: ShieldCheck,
  },
];

const plans: Plan[] = [
  {
    name: "Free",
    description: "Mulai dari langkah kecil. Coba Fintar dan rasakan kemudahannya.",
    features: [
      "Catat hingga 50 transaksi per bulan",
      "Dashboard dasar",
      "10 chat AI Assistant per bulan",
      "Mulai tanpa risiko, tanpa kartu kredit",
    ],
    pricing: {
      monthly: {
        price: "Rp 0 / bulan",
        note: "Cocok untuk coba fitur dasar kapan saja.",
        cta: "Coba Gratis Sekarang",
      },
      yearly: {
        price: "Rp 0 / tahun",
        note: "Tetap gratis selamanya.",
        cta: "Coba Gratis Sekarang",
      },
    },
  },
  {
    name: "Pro",
    description: "Untuk kamu yang ingin mengatur keuangan pribadi dengan lebih rapi dan terarah.",
    features: [
      "Transaksi tanpa batas",
      "AI Assistant full access",
      "Dashboard detail dan kategori custom",
      "Export laporan ke PDF atau Excel",
      "Sinkronisasi multi-device",
    ],
    highlighted: true,
    pricing: {
      monthly: {
        price: "Rp 39.000 / bulan",
        note: "Tagihan bulanan, bisa batal kapan saja.",
        cta: "Mulai Berlangganan",
      },
      yearly: {
        price: "Rp 390.000 / tahun",
        note: "Hemat 2 bulan dibanding paket bulanan.",
        cta: "Mulai Berlangganan",
      },
    },
  },
  {
    name: "Business",
    description: "Untuk kamu yang juga menjalankan usaha atau punya sumber penghasilan ganda.",
    features: [
      "Semua fitur Pro",
      "Klasifikasi otomatis pendapatan pribadi dan bisnis",
      "Laporan pajak sederhana",
      "Insight dan forecast arus kas",
      "Satu aplikasi untuk pribadi dan bisnis kecil",
    ],
    pricing: {
      monthly: {
        price: "Rp 79.000 / bulan",
        note: "Termasuk tool tambahan untuk kelola bisnis kecil.",
        cta: "Mulai Berlangganan",
      },
      yearly: {
        price: "Rp 790.000 / tahun",
        note: "Hemat 2 bulan dibanding paket bulanan.",
        cta: "Mulai Berlangganan",
      },
    },
  },
];

const reasons: string[] = [
  "Mudah digunakan - tanpa perlu paham akuntansi",
  "Aman dan private - data terenkripsi sepenuhnya",
  "Ditenagai AI - cukup chat untuk mencatat dan menganalisis",
  "Dirancang untuk karyawan, freelancer, dan pemilik usaha",
];

export default function Home() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <MainHeader />
      <main className="flex-1">
        <section className="border-b border-border bg-muted/20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
              <div className="space-y-8">
                <Badge className="flex items-center gap-2 bg-secondary/15 text-secondary-foreground px-3 py-1">
                  <Sparkles className="h-4 w-4" />
                  Fintar - AI Finance Assistant
                </Badge>
                <h1 className="text-4xl sm:text-5xl font-semibold leading-tight text-primary">
                  Uang kamu, teratur. Pikiran kamu, tenang.
                </h1>
                <div className="space-y-4 text-lg text-muted-foreground max-w-xl">
                  <p>
                    Fintar membantu mencatat dan memahami arus keuangan pribadi dari pemasukan, pengeluaran, sampai aset
                    melalui percakapan cerdas dengan AI.
                  </p>
                  <p>
                    Tanpa rumus. Tanpa tabel rumit. Hanya obrolan sederhana yang bikin kamu lebih paham keuangan sendiri.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button size="lg" className="gap-2 px-8 font-semibold">
                    Coba Gratis Sekarang
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                
                </div>
                <div className="grid gap-6 sm:grid-cols-2 pt-6">
                  <div className="flex items-start gap-3">
                    <MessageCircle className="mt-1 h-6 w-6 text-secondary" />
                    <div>
                      <p className="font-medium text-primary">Ngobrol, semua tercatat</p>
                      <p className="text-sm text-muted-foreground">
                        Catat pengeluaran harian atau cek saldo tabungan cukup lewat chat.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CalendarCheck className="mt-1 h-6 w-6 text-secondary" />
                    <div>
                      <p className="font-medium text-primary">Ringkasan otomatis</p>
                      <p className="text-sm text-muted-foreground">
                        Dapatkan highlight mingguan dan insight cerdas tanpa perlu susun laporan.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <Card className="border border-primary/20 bg-background shadow-xl">
                <CardHeader className="space-y-2">
                  <CardTitle className="flex items-center gap-2 text-lg text-primary">
                    <Wallet className="h-5 w-5 text-secondary" />
                    Snapshot keuangan pribadi
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Contoh insight yang kamu terima ketika ngobrol dengan Fintar.
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="rounded-xl border border-muted bg-muted/20 p-4 space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MessageCircle className="h-4 w-4 text-secondary" />
                      <span>Kamu</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      &ldquo;Fintar, berapa total pengeluaran makan di luar bulan ini?&rdquo;
                    </p>
                    <div className="rounded-lg border border-border bg-background p-4 shadow-sm">
                      <p className="text-sm font-semibold text-primary">Fintar</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Pengeluaran makan di luar kamu totalnya Rp 1.550.000. Itu 12% dari total pengeluaran bulan ini.
                      </p>
                      <div className="mt-4 space-y-2 text-xs text-muted-foreground">
                        <div className="flex items-center justify-between">
                          <span>Minggu ini</span>
                          <span>Rp 420.000</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Pekan lalu</span>
                          <span>Rp 380.000</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-xl border border-muted bg-background p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">Health Score</p>
                        <p className="text-2xl font-semibold text-primary">87</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Forecast 30 hari</p>
                        <p className="text-lg font-semibold text-secondary">+12%</p>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2 text-xs text-muted-foreground">
                      <div className="flex items-center justify-between">
                        <span>Kebutuhan</span>
                        <span>Rp 6.200.000</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Gaya hidup</span>
                        <span>Rp 2.150.000</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Tabungan & investasi</span>
                        <span>Rp 1.800.000</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="max-w-2xl space-y-4">
              <Badge className="w-fit bg-secondary/15 text-secondary-foreground">Fitur utama</Badge>
              <h2 className="text-3xl font-semibold text-primary">Kelola uang tanpa stres.</h2>
              <p className="text-lg text-muted-foreground">
                Semua data finansial kamu, rapi di satu tempat. Percakapan alami membantu kamu memahami arus uang
                setiap hari.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {features.map((feature) => (
                <Card
                  key={feature.title}
                  className="h-full border border-border bg-background shadow-sm transition-shadow hover:shadow-md"
                >
                  <CardHeader className="space-y-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/15 text-secondary">
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl text-primary">{feature.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">{feature.detail}</CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-border bg-primary/10 py-16 sm:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center space-y-3">
              <Badge className="mx-auto w-fit bg-secondary/15 text-secondary-foreground">Harga pintar</Badge>
              <h2 className="text-3xl font-semibold text-primary">Pilih paket yang paling pas.</h2>
              <p className="text-lg text-muted-foreground">
                Mulai gratis hari ini, upgrade kapan saja saat kamu butuh fitur lebih lanjut.
              </p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="inline-flex items-center gap-1 rounded-full border border-border bg-background p-1">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => setBillingCycle("monthly")}
                  className={cn(
                    "rounded-full px-5 py-2 text-sm font-semibold",
                    billingCycle === "monthly"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-primary"
                  )}
                >
                  Bulanan
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => setBillingCycle("yearly")}
                  className={cn(
                    "rounded-full px-5 py-2 text-sm font-semibold",
                    billingCycle === "yearly"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-primary"
                  )}
                >
                  Tahunan
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                {billingCycle === "monthly"
                  ? "Tagihan lebih fleksibel setiap bulan."
                  : "Bayar setahun sekali dan hemat 2 bulan dibanding bulanan."}
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {plans.map((plan) => {
                const activePricing = plan.pricing[billingCycle];
                const buttonVariant =
                  plan.name === "Free" ? ("outline" as const) : plan.highlighted ? ("default" as const) : ("secondary" as const);

                return (
                  <Card
                    key={plan.name}
                    className={cn(
                      "flex h-full flex-col border border-border bg-background shadow-sm",
                      plan.highlighted && "border-primary shadow-lg shadow-primary/15"
                    )}
                  >
                    <CardHeader className="space-y-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl font-semibold text-primary">{plan.name}</CardTitle>
                        {plan.highlighted ? (
                          <Badge className="bg-primary text-primary-foreground">Terpopuler</Badge>
                        ) : null}
                      </div>
                      <div>
                        <p className="text-xl font-semibold text-secondary-foreground">{activePricing.price}</p>
                        {activePricing.note ? (
                          <p className="text-xs text-muted-foreground mt-1">{activePricing.note}</p>
                        ) : null}
                      </div>
                      <p className="text-sm text-muted-foreground">{plan.description}</p>
                    </CardHeader>
                    <CardContent className="flex-1 space-y-3 border-t border-muted pt-4">
                      {plan.features.map((feature) => (
                        <div key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <Check className="mt-0.5 h-4 w-4 text-secondary" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button variant={buttonVariant} className="w-full font-semibold">
                        {activePricing.cta}
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-5">
              <Badge className="w-fit bg-secondary/15 text-secondary-foreground">Kenapa memilih Fintar</Badge>
              <h2 className="text-3xl font-semibold text-primary">
                Fintar memadukan kecerdasan AI dengan pengalaman finansial yang humanis.
              </h2>
              <p className="text-lg text-muted-foreground">
                Dibangun untuk membantu karyawan, freelancer, dan pelaku usaha mengelola keuangan harian tanpa rasa cemas
                atau kerumitan.
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
            <Card className="border border-primary/15 bg-background shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-primary">
                  <TrendingUp className="h-5 w-5 text-secondary" />
                  Semua data finansial dalam satu tempat
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <p>
                  Dashboard adaptif Fintar menggabungkan catatan transaksi, arus kas, dan proyeksi dalam tampilan
                  modern. Temukan pola, kontrol pengeluaran, dan buat keputusan cerdas tanpa berpindah aplikasi.
                </p>
                <div className="rounded-lg border border-muted bg-muted/20 p-4">
                  <div className="flex items-center justify-between text-xs uppercase tracking-wide text-muted-foreground">
                    <span>Pengeluaran terbesar</span>
                    <span>Rp 2.450.000</span>
                  </div>
                  <div className="mt-3 space-y-2 text-xs text-muted-foreground">
                    <div className="flex items-center justify-between">
                      <span>Transportasi</span>
                      <span>Rp 750.000</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Hiburan</span>
                      <span>Rp 540.000</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Kebutuhan rumah</span>
                      <span>Rp 480.000</span>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border border-muted bg-background p-4">
                  <div className="flex items-center gap-3 text-sm">
                    <Users className="h-5 w-5 text-secondary" />
                    Dipercaya oleh 1.200+ pengguna yang ingin keuangan lebih terstruktur.
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl border border-primary/15 bg-secondary/10 px-6 py-16 text-center shadow-md">
              <Badge className="mx-auto w-fit bg-secondary/20 text-secondary-foreground">Mulai hari ini</Badge>
              <h2 className="mt-4 text-3xl sm:text-4xl font-semibold text-primary">
                Saatnya punya asisten keuangan pribadi yang bisa diajak ngobrol.
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Mulai gratis hari ini dan rasakan bagaimana Fintar membantu memahami, mencatat, dan mengelola keuangan
                dengan lebih cerdas.
              </p>
              <div className="mt-8 flex justify-center">
                <Button size="lg" className="gap-2 px-10 font-semibold">
                  Coba Gratis Sekarang
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">Tanpa kartu kredit, tanpa komitmen.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-sm text-muted-foreground flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-primary">Fintar &copy; 2025</p>
            <p>Dibangun untuk membantu setiap orang mengelola uang dengan lebih cerdas dan tenang.</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <a className="hover:text-primary" href="#">
              Privacy Policy
            </a>
            <a className="hover:text-primary" href="#">
              Terms
            </a>
            <a className="hover:text-primary" href="#">
              Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
