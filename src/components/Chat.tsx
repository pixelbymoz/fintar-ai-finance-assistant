"use client";
import { useState } from "react";

export default function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const content = input.trim();
    if (!content) return;
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ message: content }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessages((prev) => [
          ...prev,
          `You: ${content}`,
          `Assistant: ${data.message}`,
        ]);
        setInput("");
      } else {
        setMessages((prev) => [
          ...prev,
          `You: ${content}`,
          `Error: ${data.error ?? "Unknown error"}`,
        ]);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setMessages((prev) => [...prev, `Error: ${msg}`]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={onSubmit} className="flex gap-2">
        <input
          className="flex-1 border rounded px-3 py-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ceritakan transaksi Anda, misal: 'beli makan siang 25rb' atau 'gajian kemarin 5jt'"
        />
        <button
          className="px-4 py-2 rounded bg-black text-white"
          disabled={loading}
        >
          {loading ? "Logging…" : "Log"}
        </button>
      </form>

      <div className="space-y-2">
        {messages.map((m, i) => (
          <div key={i} className="text-sm border rounded px-3 py-2">
            {m}
          </div>
        ))}
      </div>
    </div>
  );
}