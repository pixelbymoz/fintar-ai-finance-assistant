import { MainHeader } from "@/components/main-header"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <MainHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-primary">
              Welcome to Fintar
            </h1>
            <p className="text-xl text-gray-600">
              Your AI-powered business finance assistant
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
            <h2 className="text-2xl font-semibold text-primary">
              Track Your Business Finances with AI
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Fintar helps you manage your business income, expenses, and assets through an intelligent conversational AI assistant. Get insights, track transactions, and make informed financial decisions with ease.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mx-auto">
                  <span className="text-primary font-bold text-xl">💬</span>
                </div>
                <h3 className="font-semibold text-primary">AI Chat Assistant</h3>
                <p className="text-sm text-gray-600">Log transactions and get insights through natural conversation</p>
              </div>
              
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mx-auto">
                  <span className="text-primary font-bold text-xl">📊</span>
                </div>
                <h3 className="font-semibold text-primary">Smart Dashboard</h3>
                <p className="text-sm text-gray-600">View comprehensive metrics, charts, and recent transactions</p>
              </div>
              
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mx-auto">
                  <span className="text-primary font-bold text-xl">🔒</span>
                </div>
                <h3 className="font-semibold text-primary">Secure & Private</h3>
                <p className="text-sm text-gray-600">Your financial data is protected with enterprise-grade security</p>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-gray-600">
              Ready to get started? Sign up above to begin tracking your business finances with AI.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
