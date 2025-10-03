export default function Home() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Fintar</h1>
      <p className="text-gray-700">
        Track income, expenses, and assets through a conversational AI assistant.
      </p>
      <ul className="list-disc pl-6 text-sm space-y-2">
        <li>Sign in using the header controls.</li>
        <li>Visit Dashboard to see metrics, charts, and recent transactions.</li>
        <li>Use the Chatbot to log new transactions quickly.</li>
      </ul>
    </div>
  );
}
