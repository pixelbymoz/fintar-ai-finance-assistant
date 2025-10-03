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

const SYSTEM_PROMPT = `You are a helpful financial assistant that understands natural language in Indonesian and English. 

Extract transaction information from casual conversation and return ONLY valid JSON.

REQUIRED JSON SCHEMAS:

For EXPENSE:
{
  "type": "expense",
  "amount": number,
  "category": "food|transport|shopping|bills|entertainment|health|education|other",
  "description": "string",
  "date": "YYYY-MM-DD"
}

For INCOME:
{
  "type": "income", 
  "amount": number,
  "category": "salary|freelance|business|investment|other",
  "description": "string",
  "date": "YYYY-MM-DD"
}

For ASSET:
{
  "type": "asset",
  "name": "string",
  "description": "string (optional)",
  "purchasePrice": number,
  "currentValue": number,
  "date": "YYYY-MM-DD"
}

PARSING RULES:
- Use today's date: ${new Date().toISOString().split('T')[0]}
- Parse "kemarin" as yesterday: ${new Date(Date.now() - 86400000).toISOString().split('T')[0]}
- Convert: 25rb=25000, 5jt=5000000, 1.5jt=1500000
- Auto-categorize based on context

EXAMPLES:

Input: "beli makan siang 25rb"
Output: {"type":"expense","amount":25000,"category":"food","description":"makan siang","date":"${new Date().toISOString().split('T')[0]}"}

Input: "gajian kemarin 5jt"  
Output: {"type":"income","amount":5000000,"category":"salary","description":"gajian","date":"${new Date(Date.now() - 86400000).toISOString().split('T')[0]}"}

Input: "beli saham BBCA 2jt"
Output: {"type":"asset","name":"saham BBCA","purchasePrice":2000000,"currentValue":2000000,"date":"${new Date().toISOString().split('T')[0]}"}

Return ONLY the JSON object. No explanations or additional text.`;

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
        return NextResponse.json({ error: "Failed to parse JSON from model response" }, { status: 502 });
      }
      parsed = JSON.parse(match[0]);
    }

    const result = txSchema.safeParse(parsed);
    if (!result.success) {
      const guidance = "Maaf, saya belum bisa memahami transaksi dari pesan Anda. Coba ceritakan seperti: 'beli makan siang 25rb', 'gajian kemarin 5jt', atau 'beli saham BBCA 2jt'.";
      return NextResponse.json({ message: guidance });
    }

    type Tx = z.infer<typeof txSchema>;
    const tx: Tx = result.data;
    await insertTransaction(tx);

    const summary =
      tx.type === "asset"
        ? `Logged asset '${tx.name}' value $${tx.currentValue} purchased on ${tx.date}.`
        : `Logged ${tx.type} of $${tx.amount} for '${tx.description}' in ${tx.category}.`;
    return NextResponse.json({ message: summary });
  } catch (err) {
    console.error(err);
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}