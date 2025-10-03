import Chat from "@/components/Chat";

export default function ChatbotPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">AI Finance Assistant</h1>
      <p className="text-sm text-gray-600">Log income, expenses, and assets conversationally.</p>
      <Chat />
    </div>
  );
}