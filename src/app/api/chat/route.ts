import { NextResponse } from "next/server";
import { z } from "zod";
import { insertTransaction } from "@/lib/db";

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
  currentValue: z.number().nonnegative(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
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

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const appName = process.env.NEXT_PUBLIC_APP_NAME || "Fintar";
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing OPENROUTER_API_KEY" }, { status: 500 });
    }

    const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": siteUrl,
        "X-Title": appName,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat-v3.1:free",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: message },
        ],
        temperature: 0,
      }),
    });

    if (!resp.ok) {
      const text = await resp.text();
      return NextResponse.json({ error: `OpenRouter error: ${text}` }, { status: 502 });
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
        return NextResponse.json({ 
          message: "Maaf, saya mengalami kesulitan memproses pesan Anda. Coba ulangi dengan format yang lebih jelas ya! 😊" 
        });
      }
      try {
        parsed = JSON.parse(match[0]);
      } catch {
        return NextResponse.json({ 
          message: "Hmm, sepertinya ada masalah teknis. Bisa coba lagi? Atau mungkin tanya sesuatu tentang keuangan? 💡" 
        });
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
        let totalAmount = 0;
        
        for (const transaction of response.transactions) {
          const result = txSchema.safeParse(transaction);
          if (result.success) {
            type Tx = z.infer<typeof txSchema>;
            const tx: Tx = result.data;
            await insertTransaction(tx);
            successCount++;
            if (tx.type !== 'asset') {
              totalAmount += tx.amount;
            }
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
    await insertTransaction(tx);

    const summary = tx.type === "asset"
      ? `Berhasil mencatat aset '${tx.name}' senilai Rp ${tx.currentValue.toLocaleString('id-ID')} yang dibeli pada ${tx.date}. Bagus! Investasi adalah kunci kekayaan jangka panjang. 📈`
      : `Berhasil mencatat ${tx.type === 'income' ? 'pemasukan' : 'pengeluaran'} sebesar Rp ${tx.amount.toLocaleString('id-ID')} untuk '${tx.description}' di kategori ${tx.category}. ${tx.type === 'income' ? 'Mantap! 💪' : 'Tercatat dengan baik! 📝'}`;
    
    return NextResponse.json({ message: summary });
  } catch (err) {
    console.error(err);
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}