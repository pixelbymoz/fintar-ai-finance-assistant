import { NextResponse } from "next/server";
import { z } from "zod";
import { insertTransaction, getAllTransactions } from "@/lib/db";

const expenseSchema = z.object({
  type: z.literal("expense"),
  amount: z.number().positive(),
  category: z.string().min(1),
  description: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

const incomeSchema = z.object({
  type: z.literal("income"),
  amount: z.number().positive(),
  category: z.string().min(1),
  description: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

const assetSchema = z.object({
  type: z.literal("asset"),
  name: z.string().min(1),
  description: z.string().optional(),
  purchasePrice: z.number().positive(),
  currentValue: z.number().nonnegative().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

const txSchema = z.union([expenseSchema, incomeSchema, assetSchema]);

const SYSTEM_PROMPT = `You are Fintar, a friendly and knowledgeable AI financial assistant that speaks Indonesian naturally. You help users track their finances while providing valuable financial insights and tips.

CORE CAPABILITIES:
1. Parse single or multiple transactions from natural language
2. Provide financial advice, tips, and insights
3. Engage in meaningful financial conversations
4. Analyze spending patterns and give suggestions

TRANSACTION PARSING:
When users mention transactions, extract them and return a JSON response with this structure:
{
  "transactions": [array of transaction objects],
  "message": "engaging response with financial insights",
  "hasTransactions": true
}

For non-transaction conversations, return:
{
  "message": "helpful financial advice or conversation",
  "hasTransactions": false
}

TRANSACTION SCHEMAS:

EXPENSE:
{
  "type": "expense",
  "amount": number,
  "category": "food|transport|shopping|bills|entertainment|health|education|other",
  "description": "string",
  "date": "YYYY-MM-DD"
}

INCOME:
{
  "type": "income", 
  "amount": number,
  "category": "salary|freelance|business|investment|other",
  "description": "string",
  "date": "YYYY-MM-DD"
}

ASSET:
{
  "type": "asset",
  "name": "string",
  "description": "string (optional)",
  "purchasePrice": number,
  "currentValue": number,
  "date": "YYYY-MM-DD"
}

PARSING RULES:
- Today: ${new Date().toISOString().split('T')[0]}
- Yesterday: ${new Date(Date.now() - 86400000).toISOString().split('T')[0]}
- Convert: 25rb=25000, 5jt=5000000, 1.5jt=1500000, 100k=100000
- Auto-categorize intelligently
- Handle multiple transactions in one input

FINANCIAL KNOWLEDGE AREAS:
- Budgeting tips and strategies
- Investment advice for beginners
- Saving techniques
- Debt management
- Financial planning
- Indonesian market insights
- Economic trends
- Personal finance best practices

PERSONALITY:
- Friendly and encouraging
- Use Indonesian naturally
- Provide actionable advice
- Celebrate financial wins
- Offer gentle guidance for overspending
- Share relevant tips and insights

EXAMPLES:

Input: "isi bensin motor 30rb, ganti oli 70rb, makan siang 20rb"
Output: {
  "transactions": [
    {"type":"expense","amount":30000,"category":"transport","description":"isi bensin motor","date":"${new Date().toISOString().split('T')[0]}"},
    {"type":"expense","amount":70000,"category":"transport","description":"ganti oli","date":"${new Date().toISOString().split('T')[0]}"},
    {"type":"expense","amount":20000,"category":"food","description":"makan siang","date":"${new Date().toISOString().split('T')[0]}"}
  ],
  "message": "Wah, hari ini cukup sibuk ya! 🏍️ Total pengeluaran Rp 120.000 untuk maintenance motor dan makan. Btw, rutin ganti oli itu investasi bagus lho untuk menjaga performa motor. Coba deh buat budget bulanan khusus untuk maintenance kendaraan, biasanya sekitar 200-300rb per bulan sudah cukup untuk motor.",
  "hasTransactions": true
}

Input: "gimana cara mulai investasi dengan modal kecil?"
Output: {
  "message": "Bagus banget nih mau mulai investasi! 🚀 Dengan modal kecil, kamu bisa mulai dari:\n\n1. **Reksa Dana** - Mulai dari 10rb aja di aplikasi seperti Bibit atau Bareksa\n2. **Saham Fractional** - Beli saham blue chip dengan modal 100rb di sekuritas online\n3. **Emas Digital** - Nabung emas mulai dari 5rb di Pegadaian Digital\n4. **SBN Ritel** - Obligasi pemerintah, aman dan return stabil\n\n**Tips penting:**\n- Mulai dengan emergency fund dulu (3-6x pengeluaran bulanan)\n- Diversifikasi portofolio\n- Investasi rutin (DCA) lebih baik dari lump sum\n- Pelajari dulu sebelum invest\n\nMau mulai dari mana nih? 😊",
  "hasTransactions": false
}

Always respond in Indonesian with a warm, helpful tone. Provide specific, actionable advice when possible.`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message: string = body?.message ?? "";
    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Early handling: numeric-only or aset definition questions
    const raw = message.trim();
    const lower = raw.toLowerCase();
    const isNumericOnly = /^[\d\s.,]+$/.test(raw);
    if (isNumericOnly) {
      return NextResponse.json({
        message:
          "Apakah ini jumlah transaksi? Jika ya, bantu saya dengan sedikit konteks ya 😊\n\nContoh pengisian:\n• Pengeluaran: 'makan siang 16.25' (atau '16.25k' / '16.25rb')\n• Pemasukan: 'gajian 1.5jt'\n• Aset: 'laptop kantor harga beli 8jt, nilai sekarang 6.5jt, tanggal 2024-07-10'\n\nSaya akan otomatis mengkategorikan dan mencatatnya untuk Anda!"
      });
    }

    // Provide a helpful explanation when users ask about assets
    if (lower.includes("aset") && (lower.includes("apa") || lower.includes("termasuk") || lower.includes("contoh") || lower.includes("mau coba input"))) {
      return NextResponse.json({
        message: `Di Fintar, aset adalah barang/hal bernilai yang Anda miliki untuk bisnis atau pribadi dan punya nilai ekonomi. Contoh: laptop, mesin, kendaraan, inventaris, properti, emas, saham, bahkan perangkat lunak berlisensi.

Saat mencatat aset, sebutkan:
• Nama aset (mis. 'Laptop MacBook Pro')
• Harga beli (mis. 18jt)
• Nilai saat ini (mis. 15jt) — opsional tapi disarankan
• Tanggal beli (format YYYY-MM-DD)
• Deskripsi singkat (opsional)

Contoh input:
"laptop kantor harga beli 8jt, nilai sekarang 6.5jt, tanggal 2024-07-10"

Tips: Update nilai saat ini secara berkala agar analisis kekayaan Anda tetap akurat. Kalau mau, saya juga bisa bantu saran penjadwalan review aset 📈`,
      });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const appName = process.env.NEXT_PUBLIC_APP_NAME || "Fintar";
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing OPENROUTER_API_KEY" }, { status: 500 });
    }

    // Helper: parse amount with Indonesian short units
    const parseAmount = (text: string): number | null => {
      const normalized = text.trim().toLowerCase();
      const unitMatch = normalized.match(/([\d.,]+)\s*(jt|juta|rb|ribu|k)?/);
      if (!unitMatch) return null;
      const raw = unitMatch[1].replace(/\./g, "").replace(/,/g, ".");
      const num = parseFloat(raw);
      if (isNaN(num)) return null;
      const unit = unitMatch[2] || "";
      if (unit === "jt" || unit === "juta") return Math.round(num * 1_000_000);
      if (unit === "rb" || unit === "ribu" || unit === "k") return Math.round(num * 1_000);
      return Math.round(num);
    };

    // NEW: auto-expense toggle + per-message overrides
    const autoExpenseEnv =
      (process.env.NEXT_PUBLIC_ASSET_AUTO_EXPENSE || "").toLowerCase() === "true";

    const shouldAutoExpense = (text: string): boolean => {
      const t = text.toLowerCase();
      // negative overrides
      if (
        t.includes("tanpa expense") ||
        t.includes("tanpa pengeluaran") ||
        t.includes("jangan expense") ||
        t.includes("jangan catat pengeluaran")
      ) {
        return false;
      }
      // positive overrides
      if (
        t.includes("sekalian expense") ||
        t.includes("sekalian pengeluaran") ||
        t.includes("buat expense") ||
        t.includes("buat pengeluaran") ||
        t.includes("catat pengeluaran") ||
        t.includes("ikut catat pengeluaran") ||
        t.includes("auto expense")
      ) {
        return true;
      }
      return autoExpenseEnv;
    };

    // NEW: force asset classification with keywords
    const shouldForceAsset = (text: string): boolean => {
      const t = text.toLowerCase();
      return (
        t.includes("ini aset") ||
        t.includes("sebagai aset") ||
        t.includes("catat sebagai aset")
      );
    };

    // Keywords yang mengindikasikan aset/investasi
    const isAssetKeywordPresent = (text: string): boolean => {
      const t = text.toLowerCase();
      return (
        t.includes("aset") ||
        t.includes("asset") ||
        t.includes("investasi") ||
        t.includes("modal") ||
        t.includes("inventaris")
      );
    };

    // Kata-kata konsumsi/operasional yang tidak boleh diperlakukan sebagai aset
    const isConsumable = (text: string): boolean => {
      const t = text.toLowerCase();
      const consumables = [
        "makan",
        "makanan",
        "minum",
        "kopi",
        "teh",
        "snack",
        "cemilan",
        "cilok",
        "bensin",
        "solar",
        "parkir",
        "tol",
        "pulsa",
        "paket data",
        "listrik",
        "air",
        "sembako",
        "nasi",
        "mie",
        "ayam",
        "gula",
        "beras",
      ];
      return consumables.some((k) => t.includes(k));
    };

    // Nama barang tahan lama/bernilai yang umum dianggap aset
    const isLikelyAssetName = (name: string): boolean => {
      const n = name.toLowerCase();
      const durable = [
        "laptop",
        "komputer",
        "pc",
        "server",
        "printer",
        "kamera",
        "hp",
        "handphone",
        "smartphone",
        "motor",
        "mobil",
        "sepeda",
        "rumah",
        "tanah",
        "mesin",
        "alat",
        "peralatan",
        "furniture",
        "inventaris",
      ];
      return durable.some((k) => n.includes(k));
    };

    // Helper: try simple asset input like "aset laptop 8jt" or "beli laptop 8jt"
    const tryParseSimpleAsset = (text: string) => {
      const t = text.trim().toLowerCase();
      // patterns: allow trailing text after amount
      const patterns = [
        /^aset\s+(.+?)\s+([\d.,]+\s*(?:jt|juta|rb|ribu|k)?)(?:\s+.*)?$/i,
        /^(?:beli\s+aset)\s+(.+?)\s+([\d.,]+\s*(?:jt|juta|rb|ribu|k)?)(?:\s+.*)?$/i,
        /^asset\s+(.+?)\s+([\d.,]+\s*(?:jt|juta|rb|ribu|k)?)(?:\s+.*)?$/i,
        // NOTE: "beli <nama> <nominal>" TIDAK langsung dianggap aset; perlu cek keyword/ambang
        /^(?:beli)\s+(.+?)\s+([\d.,]+\s*(?:jt|juta|rb|ribu|k)?)(?:\s+.*)?$/i,
      ];
      for (const re of patterns) {
        const m = text.match(re);
        if (m) {
          const name = m[1].trim();
          const amt = parseAmount(m[2]);
          if (name && amt && amt > 0) {
            // Hindari aset untuk consumables/operasional
            if (isConsumable(t)) return null;

            // Kriteria kelayakan aset:
            const qualifiesByKeyword = isAssetKeywordPresent(t) || shouldForceAsset(t);
            const qualifiesByNameAndAmount = isLikelyAssetName(name) && amt >= 300_000; // >= 300rb
            const qualifiesByAmountOnly = amt >= 2_000_000; // >= 2jt

            if (qualifiesByKeyword || qualifiesByNameAndAmount || qualifiesByAmountOnly) {
              const today = new Date().toISOString().split("T")[0];
              return {
                type: "asset" as const,
                name,
                purchasePrice: amt,
                currentValue: amt,
                date: today,
              };
            }
          }
        }
      }
      return null;
    };

    const simpleAsset = tryParseSimpleAsset(message);
    if (simpleAsset) {
      await insertTransaction(simpleAsset);

      // NEW: optionally create paired expense
      let extraNote = "";
      if (shouldAutoExpense(message)) {
        await insertTransaction({
          type: "expense",
          amount: simpleAsset.purchasePrice,
          category: "other",
          description: `Pembelian aset: ${simpleAsset.name}`,
          date: simpleAsset.date,
        });
        extraNote = " (pengeluaran otomatis ikut dicatat)";
      }

      const prettyAmt = simpleAsset.purchasePrice.toLocaleString("id-ID");
      return NextResponse.json({
        message: `Berhasil mencatat aset '${simpleAsset.name}' sebesar Rp ${prettyAmt}${extraNote}. Tanggal otomatis: ${simpleAsset.date}. Nilai saat ini diset sama dengan harga beli. 📝`,
      });
    }

    // ADVANCED: handle time-range queries for income/expense/asset summaries
    const lowerMsg = message.toLowerCase();

    const MONTHS_ID: Record<string, number> = {
      januari: 0, january: 0, jan: 0,
      februari: 1, february: 1, feb: 1,
      maret: 2, march: 2, mar: 2,
      april: 3, apr: 3,
      mei: 4, may: 4,
      juni: 5, june: 5, jun: 5,
      juli: 6, july: 6, jul: 6,
      agustus: 7, august: 7, agu: 7, aug: 7,
      september: 8, sep: 8,
      oktober: 9, october: 9, okt: 9, oct: 9,
      november: 10, nov: 10,
      desember: 11, december: 11, des: 11, dec: 11,
    };

    type Range = { start: string; end: string; label: string };
    const pad = (n: number) => String(n).padStart(2, '0');

    const todayJakarta = () => {
      const now = new Date();
      const parts = new Intl.DateTimeFormat('id-ID', { timeZone: 'Asia/Jakarta', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now);
      const y = Number(parts.find(p => p.type === 'year')?.value);
      const m = Number(parts.find(p => p.type === 'month')?.value);
      const d = Number(parts.find(p => p.type === 'day')?.value);
      return { y, m, d };
    };

    const toISODate = (y: number, m1to12: number, d: number) => `${y}-${pad(m1to12)}-${pad(d)}`;

    const monthIndex = (name: string) => {
      const idx = MONTHS_ID[name.toLowerCase() as keyof typeof MONTHS_ID];
      return typeof idx === 'number' ? idx : undefined;
    };

    const parseExplicitRange = (text: string): Range | null => {
      const t = text.toLowerCase();
      // Pattern: "1–15 Januari 2025" or "1-15 Januari 2025"
      const reDash = /\b(\d{1,2})\s*[–-]\s*(\d{1,2})\s+([a-zA-Z]+)\s+(\d{4})\b/;
      const m1 = t.match(reDash);
      if (m1) {
        const d1 = Number(m1[1]);
        const d2 = Number(m1[2]);
        const monName = m1[3];
        const year = Number(m1[4]);
        const midx = monthIndex(monName);
        if (midx !== undefined) {
          const mm = midx + 1;
          const start = toISODate(year, mm, d1);
          const end = toISODate(year, mm, d2);
          return { start, end, label: `${d1}–${d2} ${monName} ${year}` };
        }
      }
      // Pattern: "dari 1 Januari 2025 sampai 15 Januari 2025"
      const reFromTo = /\bdari\s+(\d{1,2})\s+([a-zA-Z]+)\s+(\d{4})\s+(?:sampai|hingga|to)\s+(\d{1,2})(?:\s+([a-zA-Z]+))?(?:\s+(\d{4}))?\b/;
      const m2 = t.match(reFromTo);
      if (m2) {
        const d1 = Number(m2[1]);
        const mon1 = m2[2];
        const y1 = Number(m2[3]);
        const d2 = Number(m2[4]);
        const mon2 = m2[5] || mon1;
        const y2 = Number(m2[6] || y1);
        const midx1 = monthIndex(mon1);
        const midx2 = monthIndex(mon2);
        if (midx1 !== undefined && midx2 !== undefined) {
          const start = toISODate(y1, midx1 + 1, d1);
          const end = toISODate(y2, midx2 + 1, d2);
          return { start, end, label: `dari ${d1} ${mon1} ${y1} sampai ${d2} ${mon2} ${y2}` };
        }
      }
      return null;
    };

    const computeRange = (text: string): Range | null => {
      const t = text.toLowerCase();
      const { y, m, d } = todayJakarta();
      // explicit range first
      const explicit = parseExplicitRange(text);
      if (explicit) return explicit;
      // hari ini
      if (t.includes('hari ini') || t.includes('today')) {
        const day = toISODate(y, m, d);
        return { start: day, end: day, label: 'hari ini' };
      }
      // kemarin/kemaren
      if (t.includes('kemarin') || t.includes('kemaren') || t.includes('yesterday')) {
        const dt = new Date(`${toISODate(y, m, d)}T00:00:00+07:00`);
        dt.setDate(dt.getDate() - 1);
        const ky = dt.getUTCFullYear();
        const km = dt.getUTCMonth() + 1;
        const kd = dt.getUTCDate();
        const day = toISODate(ky, km, kd);
        return { start: day, end: day, label: 'kemarin' };
      }
      // minggu ini / minggu lalu (Minggu-Sabtu; start Minggu)
      if (t.includes('minggu ini') || t.includes('this week')) {
        const base = new Date(`${toISODate(y, m, d)}T00:00:00+07:00`);
        const dow = base.getUTCDay(); // Minggu=0
        const start = new Date(base);
        start.setDate(start.getDate() - dow);
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        const s = toISODate(start.getUTCFullYear(), start.getUTCMonth() + 1, start.getUTCDate());
        const e = toISODate(end.getUTCFullYear(), end.getUTCMonth() + 1, end.getUTCDate());
        return { start: s, end: e, label: 'minggu ini' };
      }
      if (t.includes('minggu lalu') || t.includes('last week')) {
        const base = new Date(`${toISODate(y, m, d)}T00:00:00+07:00`);
        const dow = base.getUTCDay();
        const end = new Date(base);
        end.setDate(end.getDate() - dow - 1);
        const start = new Date(end);
        start.setDate(end.getDate() - 6);
        const s = toISODate(start.getUTCFullYear(), start.getUTCMonth() + 1, start.getUTCDate());
        const e = toISODate(end.getUTCFullYear(), end.getUTCMonth() + 1, end.getUTCDate());
        return { start: s, end: e, label: 'minggu lalu' };
      }
      // bulan ini / bulan <nama>
      if (t.includes('bulan ini') || t.includes('this month')) {
        const s = toISODate(y, m, 1);
        const endDate = new Date(`${toISODate(y, m, 1)}T00:00:00+07:00`);
        endDate.setMonth(endDate.getMonth() + 1);
        endDate.setDate(endDate.getDate() - 1);
        const e = toISODate(endDate.getUTCFullYear(), endDate.getUTCMonth() + 1, endDate.getUTCDate());
        return { start: s, end: e, label: 'bulan ini' };
      }
      for (const [name, idx] of Object.entries(MONTHS_ID)) {
        if (t.includes(`bulan ${name}`) || t.includes(name) && t.includes('bulan')) {
          const yearMatch = t.match(/(20\d{2}|19\d{2})/);
          const yy = yearMatch ? Number(yearMatch[1]) : y;
          const mm = idx + 1;
          const s = toISODate(yy, mm, 1);
          const endDate = new Date(`${toISODate(yy, mm, 1)}T00:00:00+07:00`);
          endDate.setMonth(endDate.getMonth() + 1);
          endDate.setDate(endDate.getDate() - 1);
          const e = toISODate(endDate.getUTCFullYear(), endDate.getUTCMonth() + 1, endDate.getUTCDate());
          return { start: s, end: e, label: `bulan ${name} ${yy}` };
        }
      }
      // tahun ini / tahun lalu / tahun YYYY
      if (t.includes('tahun ini') || t.includes('this year')) {
        const s = toISODate(y, 1, 1);
        const e = toISODate(y, 12, 31);
        return { start: s, end: e, label: 'tahun ini' };
      }
      if (t.includes('tahun lalu') || t.includes('last year')) {
        const s = toISODate(y - 1, 1, 1);
        const e = toISODate(y - 1, 12, 31);
        return { start: s, end: e, label: 'tahun lalu' };
      }
      const yearMatch = t.match(/(20\d{2}|19\d{2})/);
      if (yearMatch && (t.includes('tahun') || t.includes('year'))) {
        const yy = Number(yearMatch[1]);
        return { start: toISODate(yy, 1, 1), end: toISODate(yy, 12, 31), label: `tahun ${yy}` };
      }
      return null;
    };

    const isExpenseQuery = /pengeluaran|expense|keluar/.test(lowerMsg);
    const isIncomeQuery = /pemasukan|pendapatan|income|masuk/.test(lowerMsg);
    const isAssetQuery = /aset|asset/.test(lowerMsg);
    const range = computeRange(lowerMsg);

    if (range && (isExpenseQuery || isIncomeQuery || isAssetQuery)) {
      // Fetch user transactions via helper that sets RLS context
      const all = await getAllTransactions();
      const inRange = all.filter(t => {
        const day = (t.date ?? '').slice(0, 10);
        return day >= range.start && day <= range.end;
      });

      const sum = (type: 'expense'|'income'|'asset') => inRange
        .filter(t => t.type === type)
        .reduce((acc, t) => acc + Number(t.amount || 0), 0);

      // Top categories for expense/income
      const topCategories = (type: 'expense'|'income') => {
        const map = new Map<string, number>();
        for (const t of inRange) {
          if (t.type !== type) continue;
          const key = (t.category || 'other').toLowerCase();
          map.set(key, (map.get(key) || 0) + Number(t.amount || 0));
        }
        return Array.from(map.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([cat, total]) => `${cat}: Rp ${Number(total).toLocaleString('id-ID')}`);
      };

      const totalExpense = isExpenseQuery ? sum('expense') : undefined;
      const totalIncome = isIncomeQuery ? sum('income') : undefined;
      const totalAssetPurchase = isAssetQuery ? sum('asset') : undefined;
      const assetCount = isAssetQuery ? inRange.filter(t => t.type === 'asset').length : undefined;

      const fmt = (n?: number) => n === undefined ? '-' : `Rp ${Number(n).toLocaleString('id-ID')}`;

      // Simple advice
      let advice = '';
      if (totalExpense && totalExpense > 1000000) {
        advice = 'Pengeluaran cukup besar. Pertimbangkan review kategori belanja agar lebih efisien.';
      } else if (totalIncome && totalIncome > 0 && (totalExpense ?? 0) > (totalIncome ?? 0)) {
        advice = 'Pengeluaran melebihi pemasukan. Coba alokasikan anggaran lebih ketat minggu/bulan berikutnya.';
      } else if (isAssetQuery && (assetCount ?? 0) > 0) {
        advice = 'Aset tercatat dengan baik. Update nilai saat ini berkala untuk analisis kekayaan bersih.';
      }

      const lines: string[] = [`Periode: ${range.label}`];
      if (isExpenseQuery) lines.push(`Total pengeluaran: ${fmt(totalExpense)}`);
      if (isIncomeQuery) lines.push(`Total pemasukan: ${fmt(totalIncome)}`);
      if (isAssetQuery) lines.push(`Aset tercatat: ${assetCount} item${(assetCount ?? 0) > 1 ? 's' : ''}, nilai pembelian: ${fmt(totalAssetPurchase)}`);
      if (isExpenseQuery) {
        const top = topCategories('expense');
        if (top.length) lines.push(`Top kategori pengeluaran: ${top.join('; ')}`);
      }
      if (isIncomeQuery) {
        const top = topCategories('income');
        if (top.length) lines.push(`Top kategori pemasukan: ${top.join('; ')}`);
      }
      if (advice) lines.push(`Saran: ${advice}`);

      return NextResponse.json({ message: lines.join('\n') });
    }

    const model = process.env.OPENROUTER_MODEL || "deepseek/deepseek-chat-v3-0324:free";

    const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": siteUrl,
        "X-Title": appName,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: message },
        ],
        temperature: 0,
      }),
    });

    if (!resp.ok) {
      let raw = await resp.text();
      try {
        const err = JSON.parse(raw);
        const msg: string = err?.error?.message || err?.message || raw;
        if (
          resp.status === 404 &&
          typeof msg === "string" &&
          msg.toLowerCase().includes("no endpoints found matching your data policy")
        ) {
          return NextResponse.json(
            {
              error:
                "Konfigurasi privasi OpenRouter Anda memblokir model gratis. Aktifkan opsi publikasi prompt untuk model gratis di halaman privacy (https://openrouter.ai/settings/privacy), atau ganti model lewat env `OPENROUTER_MODEL` ke model non-free/berbayar.",
            },
            { status: 502 }
          );
        }
        return NextResponse.json({ error: `OpenRouter error: ${msg}` }, { status: 502 });
      } catch {
        return NextResponse.json({ error: `OpenRouter error: ${raw}` }, { status: 502 });
      }
    }

    const data = await resp.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content || typeof content !== "string") {
      return NextResponse.json({ error: "Invalid model response" }, { status: 502 });
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(content);
    } catch {
      // try to extract JSON substring
      const match = content.match(/\{[\s\S]*\}/);
      if (!match) {
        // Treat raw content as a conversation message when no JSON is found
        return NextResponse.json({ message: content.trim() });
      }
      try {
        parsed = JSON.parse(match[0]);
      } catch {
        // Fallback to raw content if JSON extraction fails
        return NextResponse.json({ message: content.trim() });
      }
    }

    // Check if it's a conversation response (no transactions)
    if (typeof parsed === 'object' && parsed !== null && 'hasTransactions' in parsed) {
      const response = parsed as { hasTransactions: boolean; message: string; transactions?: unknown[] };
      
      if (!response.hasTransactions) {
        // Pure conversation, no transactions to process
        return NextResponse.json({ message: response.message });
      }
      
      // Has transactions, process them
      if (response.transactions && Array.isArray(response.transactions)) {
        let successCount = 0;
        
        for (const transaction of response.transactions) {
          const result = txSchema.safeParse(transaction);
          if (result.success) {
            type Tx = z.infer<typeof txSchema>;
            const tx: Tx = result.data;
            await insertTransaction(tx);
            successCount++;
          }
        }
        
        if (successCount > 0) {
          return NextResponse.json({ message: response.message });
        } else {
          return NextResponse.json({ 
            message: "Maaf, saya kesulitan memproses transaksi yang Anda sebutkan. Coba dengan format seperti: 'beli makan siang 25rb' atau 'gajian kemarin 5jt' ya! 😊" 
          });
        }
      }
    }

    // Fallback: try to parse as single transaction (backward compatibility)
    const result = txSchema.safeParse(parsed);
    if (!result.success) {
      return NextResponse.json({ 
        message: "Hmm, saya belum bisa memahami transaksi dari pesan Anda. Coba ceritakan seperti: 'beli makan siang 25rb', 'gajian kemarin 5jt', atau tanya tentang tips keuangan! 💰" 
      });
    }

    type Tx = z.infer<typeof txSchema>;
    const tx: Tx = result.data;

    // NEW: force asset if user indicates "ini aset" and parsed type is not asset
    if (shouldForceAsset(message) && tx.type !== "asset") {
      const assetName = tx.type === "expense" ? tx.description : "Aset";
      const assetDate =
        tx.type === "expense" || tx.type === "income" ? tx.date : new Date().toISOString().split("T")[0];
      const amt = tx.amount; // tx.type is expense or income here
      await insertTransaction({
        type: "asset",
        name: assetName,
        purchasePrice: amt,
        currentValue: amt,
        date: assetDate,
      });

      let extraNote = "";
      if (shouldAutoExpense(message)) {
        await insertTransaction({
          type: "expense",
          amount: amt,
          category: "other",
          description: `Pembelian aset: ${assetName}`,
          date: assetDate,
        });
        extraNote = " (pengeluaran otomatis ikut dicatat)";
      }

      const prettyAmt = amt.toLocaleString("id-ID");
      const summary = `Berhasil mencatat aset '${assetName}' sebesar Rp ${prettyAmt}${extraNote}.`;
      return NextResponse.json({ message: summary });
    }

    await insertTransaction(tx);

    // NEW: adjust asset summary and optional auto-expense when type is asset
    let summary = "";
    if (tx.type === "asset") {
      const assetValue = (tx.currentValue ?? tx.purchasePrice).toLocaleString("id-ID");
      let extraNote = "";
      if (shouldAutoExpense(message)) {
        await insertTransaction({
          type: "expense",
          amount: tx.purchasePrice,
          category: "other",
          description: `Pembelian aset: ${tx.name}`,
          date: tx.date ?? new Date().toISOString().split("T")[0],
        });
        extraNote = " (pengeluaran otomatis ikut dicatat)";
      }
      summary = `Berhasil mencatat aset '${tx.name}' senilai Rp ${assetValue}${extraNote}.`;
    } else {
      summary = `Berhasil mencatat ${tx.type === 'income' ? 'pemasukan' : 'pengeluaran'} sebesar Rp ${tx.amount.toLocaleString('id-ID')} untuk '${tx.description}' di kategori ${tx.category}. ${tx.type === 'income' ? 'Mantap! 💪' : 'Tercatat dengan baik! 📝'}`;
    }

    return NextResponse.json({ message: summary });
  } catch (err) {
    console.error(err);
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}