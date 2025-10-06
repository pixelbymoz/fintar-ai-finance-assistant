"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Send, Bot, User, Sparkles, HelpCircle, X } from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

export default function Chat() {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Halo! Saya Fintar, asisten keuangan AI Anda! 👋\n\nSaya bisa membantu Anda:\n• Mencatat transaksi (tunggal atau multiple)\n• Memberikan tips keuangan\n• Analisis pengeluaran\n• Saran investasi\n\nCoba ceritakan transaksi Anda atau tanya tentang keuangan!",
      sender: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const stopStreamRef = useRef<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load persisted messages and draft
  useEffect(() => {
    try {
      const raw = localStorage.getItem('fintar_chat_messages');
      const draft = localStorage.getItem('fintar_chat_draft');
      if (raw) {
        const parsed = JSON.parse(raw) as Message[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed.map(m => ({ ...m, timestamp: new Date(m.timestamp) })));
        }
      }
      if (draft) setInput(draft);
    } catch {}
  }, []);

  // Persist messages and draft
  useEffect(() => {
    try {
      localStorage.setItem('fintar_chat_messages', JSON.stringify(messages));
    } catch {}
  }, [messages]);

  useEffect(() => {
    try {
      localStorage.setItem('fintar_chat_draft', input);
    } catch {}
  }, [input]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isEditable = !!target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);
      if (!isEditable && e.key === '/') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        formRef.current?.requestSubmit();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [loading, streaming]);

  const simulateStreaming = async (fullText: string) => {
    setStreaming(true);
    stopStreamRef.current = false;
    const id = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id, content: "", sender: 'assistant', timestamp: new Date() }]);
    const parts = fullText.split(/(\s+)/);
    let acc = "";
    for (let i = 0; i < parts.length; i++) {
      if (stopStreamRef.current) break;
      acc += parts[i];
      setMessages(prev => prev.map(m => m.id === id ? { ...m, content: acc } : m));
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      await new Promise(res => setTimeout(res, 20));
    }
    setStreaming(false);
    setLoading(false);
  };

  const stopStreaming = () => {
    stopStreamRef.current = true;
    setStreaming(false);
    setLoading(false);
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const content = input.trim();
    if (!content || loading || streaming) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ message: content }),
      });
      const data = await res.json();
      const reply = data.message || data.error || "Maaf, terjadi kesalahan. Coba lagi ya! 😊";
      await simulateStreaming(reply);
      // Setelah respon sukses, refresh route agar kartu & tabel ter-update
      if (res.ok) {
        router.refresh();
      }
    } catch {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Ups! Sepertinya ada masalah koneksi. Coba lagi dalam beberapa saat ya! 🔄",
        sender: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      if (!streaming) setLoading(false);
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const examplePrompts = [
    "isi bensin 30rb, makan siang 20rb",
    "gimana cara mulai investasi?",
    "tips hemat pengeluaran bulanan",
    "gajian kemarin 5jt"
  ];

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Fintar AI Assistant</h3>
          <p className="text-sm text-gray-600">Asisten Keuangan Pintar Anda</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.sender === 'assistant' && (
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}
            
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.sender === 'user'
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {message.content}
              </div>
              <div
                className={`text-xs mt-1 ${
                  message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}
              >
                {formatTime(message.timestamp)}
              </div>
            </div>

            {message.sender === 'user' && (
              <div className="flex items-center justify-center w-8 h-8 bg-gray-600 rounded-full flex-shrink-0">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        ))}
        
        {(loading || streaming) && (
          <div className="flex gap-3 justify-start">
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-gray-100 rounded-lg px-4 py-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Example prompts */}
      {messages.length === 1 && (
        <div className="px-4 py-2 border-t bg-gray-50">
          <p className="text-xs text-gray-600 mb-2">Contoh yang bisa Anda coba:</p>
          <div className="flex flex-wrap gap-2">
            {examplePrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => setInput(prompt)}
                className="text-xs px-3 py-1 bg-white border rounded-full hover:bg-blue-50 hover:border-blue-200 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <form ref={formRef} onSubmit={onSubmit} className="p-4 border-t bg-white relative">
        {showHelp && (
          <div className="absolute bottom-16 right-4 w-[360px] bg-white border rounded-lg shadow-xl p-4 text-sm z-10">
            <button
              type="button"
              className="absolute top-2 right-2 p-1 rounded hover:bg-gray-100"
              aria-label="Tutup bantuan"
              onClick={() => setShowHelp(false)}
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
            <div className="flex items-center gap-2 mb-2">
              <HelpCircle className="w-4 h-4 text-blue-600" />
              <div className="font-medium text-gray-900">Tips Input Transaksi</div>
            </div>
            <div className="space-y-2 text-gray-700">
              <div>
                <div className="font-medium">Aset + Pengeluaran</div>
                <div className="mt-1">Contoh: <span className="font-mono">beli motor 10jt sekalian pengeluaran</span></div>
              </div>
              <div>
                <div className="font-medium">Hanya Aset</div>
                <div className="mt-1">Contoh: <span className="font-mono">beli motor 10jt</span> atau <span className="font-mono">aset motor 10jt</span></div>
              </div>
              <div>
                <div className="font-medium">Tanpa Pengeluaran</div>
                <div className="mt-1">Contoh: <span className="font-mono">beli motor 10jt tanpa pengeluaran</span></div>
              </div>
              <div>
                <div className="font-medium">Paksa Dianggap Aset</div>
                <div className="mt-1">Gunakan: <span className="font-mono">ini aset</span> atau <span className="font-mono">catat sebagai aset</span></div>
              </div>
              <div className="text-xs text-gray-500">Gunakan satuan: <span className="font-mono">rb</span>, <span className="font-mono">jt</span> (mis. <span className="font-mono">25rb</span>, <span className="font-mono">1.5jt</span>).</div>
            </div>
          </div>
        )}
        <div className="flex gap-2">
          <input
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            ref={inputRef}
            placeholder="Ketik pesan Anda... (misal: 'isi bensin 30rb, makan 20rb' atau 'tips investasi')"
            disabled={loading}
          />
          <button
            type="button"
            className="px-3 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all duration-200 flex items-center gap-2"
            aria-label="Bantuan input"
            onClick={() => setShowHelp((v) => !v)}
          >
            <HelpCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Bantuan</span>
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
            disabled={loading || !input.trim()}
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Kirim</span>
          </button>
          {(loading || streaming) && (
            <button
              type="button"
              className="px-3 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all duration-200"
              onClick={stopStreaming}
            >
              Stop
            </button>
          )}
        </div>
      </form>
    </div>
  );
}