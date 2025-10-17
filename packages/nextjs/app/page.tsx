import { LoanApplication } from "../components/LoanApplication";
import { LenderDashboard } from "../components/LenderDashboard";
import { DemoMode } from "../components/DemoMode";

export default function Home() {
  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Removed the duplicate header section since it's now in layout.tsx */}
        
        {/* Demo Mode Banner */}
        <DemoMode />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Borrower Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-yellow-200">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">📝 Apply for Loan</h2>
              <p className="text-gray-600">Submit your encrypted credit score</p>
            </div>
            <LoanApplication />
          </div>

          {/* Lender Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-yellow-200">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">🏛️ Lender Dashboard</h2>
              <p className="text-gray-600">Review and manage loan applications</p>
            </div>
            <LenderDashboard />
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-yellow-800 mb-4 text-center">
              🚀 Universal FHEVM SDK Demo
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-semibold text-yellow-700 mb-2">🔐 FHE Features</h4>
                <ul className="text-yellow-600 space-y-1">
                  <li>• Encrypted credit score verification</li>
                  <li>• Confidential data processing</li>
                  <li>• Private loan approval workflow</li>
                  <li>• Framework-agnostic SDK</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-yellow-700 mb-2">🌐 Live Deployment</h4>
                <ul className="text-yellow-600 space-y-1">
                  <li>• Smart Contract: 
                    <a 
                      href="https://sepolia.etherscan.io/address/0x908E2F62E94eF3859cC90AE779836528cb459Ae6" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="ml-1 underline hover:text-yellow-800"
                    >
                      0x908E2F62...cb459Ae6
                    </a>
                  </li>
                  <li>• Network: Sepolia Testnet</li>
                  <li>• Max Loan: 10 ETH</li>
                  <li>• Demo: No wallet required</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
