import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-2 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center justify-between sm:justify-start">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                Melting Pot
              </h1>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <h2 className="text-base sm:text-lg font-semibold text-gray-700">
                Admin Dashboard
              </h2>
              <div className="flex items-center space-x-2 sm:space-x-4">
                <a 
                  href="/admin" 
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Dashboard
                </a>
                <a 
                  href="/admin/clothing" 
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Clothing
                </a>
                <a 
                  href="/admin/accessories" 
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Accessories
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        {children}
      </main>
    </div>
  );
} 