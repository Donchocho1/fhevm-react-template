'use client';

import { useState } from 'react';
import { useUniversalFHEVM, setupUniversalFHEVM } from '@loan-dapp/sdk'; // Use universal SDK
import { useAccount } from 'wagmi';

export function LoanApplication() {
  const [creditScore, setCreditScore] = useState<number>(700);
  const [requestedAmount, setRequestedAmount] = useState<string>('1.0');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [status, setStatus] = useState<any>(null);
  
  const { isConnected } = useAccount();
  const { client, isInitialized, encrypt } = useUniversalFHEVM(); // Use the universal hook

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      setResult({ error: 'Please connect your wallet first' });
      return;
    }

    if (!isInitialized) {
      setResult({ error: 'FHEVM not initialized. Please wait...' });
      return;
    }

    setLoading(true);

    try {
      console.log('🏦 Starting loan application with Universal SDK...');

      // Use the universal SDK directly for demo purposes
      const universalSDK = await setupUniversalFHEVM(11155111);
      
      // Demo: Encrypt credit score using the universal SDK
      const encryptedCreditScore = await universalSDK.encrypt(creditScore);
      
      console.log('✅ Credit score encrypted:', encryptedCreditScore);

      // For demo purposes, simulate loan application
      const application = {
        applicationId: Math.floor(Math.random() * 1000) + 1,
        encryptedCreditScore,
        requestedAmount: `${requestedAmount} ETH`,
        status: 'pending',
        timestamp: new Date().toISOString()
      };

      setResult(application);

      // Simulate status check
      setTimeout(async () => {
        const appStatus = {
          ...application,
          status: 'under_review',
          reviewedAt: new Date().toISOString()
        };
        setStatus(appStatus);
      }, 2000);

    } catch (error: unknown) {
      console.error('Application failed:', error);
      setResult({ error: error instanceof Error ? error.message : String(error) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Private Loan Application</h2>

      {/* Connection Status */}
      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-sm text-blue-700">FHEVM Status:</span>
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            isInitialized ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}>
            {isInitialized ? 'Ready' : 'Initializing...'}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Credit Score
          </label>
          <input
            type="range"
            min="300"
            max="850"
            value={creditScore}
            onChange={(e) => setCreditScore(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>300</span>
            <span className="font-medium">Current: {creditScore}</span>
            <span>850</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Loan Amount (ETH)
          </label>
          <input
            type="number"
            step="0.1"
            min="0.1"
            max="10"
            value={requestedAmount}
            onChange={(e) => setRequestedAmount(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter amount in ETH"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !isConnected || !isInitialized}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          {loading ? 'Processing...' : !isConnected ? 'Connect Wallet' : 'Submit Encrypted Application'}
        </button>
      </form>

      {/* Results */}
      {result && (
        <div className={`mt-6 p-4 rounded-lg ${
          result.error ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'
        }`}>
          <h3 className="font-semibold mb-2">
            {result.error ? '❌ Error' : '✅ Application Submitted'}
          </h3>
          <pre className="text-sm whitespace-pre-wrap">
            {result.error ? result.error : JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      {status && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="font-semibold text-yellow-800 mb-2">🔄 Status Update</h3>
          <pre className="text-sm whitespace-pre-wrap">
            {JSON.stringify(status, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
