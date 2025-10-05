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
              Your AI finance tracking assistant
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
            <h2 className="text-2xl font-semibold text-primary">
              Lacak Keuangan Bisnis Anda dengan AI
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Fintar membantu Anda mengelola pendapatan, pengeluaran, dan aset bisnis melalui asisten AI percakapan yang cerdas. Dapatkan wawasan, lacak transaksi, dan buat keputusan keuangan yang tepat dengan mudah.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mx-auto">
                  <span className="text-primary font-bold text-xl">💬</span>
                </div>
                <h3 className="font-semibold text-primary">Asisten Chat AI</h3>
                <p className="text-sm text-gray-600">Catat transaksi dan dapatkan wawasan melalui percakapan alami</p>
              </div>
              
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mx-auto">
                  <span className="text-primary font-bold text-xl">📊</span>
                </div>
                <h3 className="font-semibold text-primary">Dashboard Cerdas</h3>
                <p className="text-sm text-gray-600">Lihat metrik komprehensif, grafik, dan transaksi terbaru</p>
              </div>
              
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mx-auto">
                  <span className="text-primary font-bold text-xl">🔒</span>
                </div>
                <h3 className="font-semibold text-primary">Aman & Privat</h3>
                <p className="text-sm text-gray-600">Data keuangan Anda dilindungi dengan keamanan tingkat enterprise</p>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-gray-600">
              Siap untuk memulai? Daftar di atas untuk mulai melacak keuangan bisnis Anda dengan AI.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
