import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";  

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Private Loan DApp - Universal FHEVM SDK Demo",
  description: "Confidential lending with Fully Homomorphic Encryption - No wallet required",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Yellow Header Bar */}
        <div className="bg-yellow-500 border-b border-yellow-600 shadow-sm">
          <div className="container mx-auto px-4 py-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🏦</span>
                <h1 className="text-xl font-bold text-gray-800">Private Loan DApp</h1>
              </div>
              <div className="text-sm text-gray-700 font-medium">
                🔐 FHE Encrypted • 🎮 Demo Mode
              </div>
            </div>
          </div>
        </div>
        
        {/* Main content with subtle background */}
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-50">
          {children}
        </div>
      </body>
    </html>
  );
}
