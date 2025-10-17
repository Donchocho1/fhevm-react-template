'use client';

import { useState } from 'react';
import { setupPrivateLoanSDK, type LoanApplicationParams } from '@fhevm-sdk';

export function LoanApplication() {
  const [creditScore, setCreditScore] = useState<number>(700);
  const [requestedAmount, setRequestedAmount] = useState<string>('1.0');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [status, setStatus] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log('🏦 Starting loan application...');
      
      const loanSDK = await setupPrivateLoanSDK(11155111);
      
      const application = await loanSDK.submitLoanApplication({
        creditScore,
        requestedAmount: `${requestedAmount} ETH`
      });
      
      setResult(application);
      
      setTimeout(async () => {
        const appStatus = await loanSDK.getApplicationStatus(application.applicationId);
        setStatus(appStatus);
      }, 2000);
      
    } catch (error) {
      console.error('Application failed:', error);
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Private Loan Application</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Credit Score
          </label>
          <input
            type="number"
            min="300"
            max="850"
            value={creditScore}
            onChange={(e) => setCreditScore(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Requested Amount (ETH)
          </label>
          <input
            type="number"
            step="0.1"
            min="0.1"
            value={requestedAmount}
            onChange={(e) => setRequestedAmount(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            placeholder="1.0"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>

      {result && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <h3 className="font-semibold text-lg mb-2 text-blue-800">📋 Application Result</h3>
          {result.error ? (
            <p className="text-red-600">Error: {result.error}</p>
          ) : (
            <div className="space-y-2 text-blue-900">
              <p><strong>Application ID:</strong> <span className="text-blue-700 font-mono">{result.applicationId}</span></p>
              <p><strong>Encrypted Score:</strong> <span className="text-blue-700 font-mono">{result.encryptedScore?.slice(0, 20)}...</span></p>
              <p><strong>Transaction:</strong> <span className="text-blue-700 font-mono">{result.transactionHash?.slice(0, 20)}...</span></p>
            </div>
          )}
        </div>
      )}

      {status && (
        <div className={`mt-4 p-4 border rounded-md ${
          status.status === 'approved' ? 'bg-green-50 border-green-200' :
          status.status === 'rejected' ? 'bg-red-50 border-red-200' :
          'bg-yellow-50 border-yellow-200'
        }`}>
          <h3 className="font-semibold text-lg mb-2">📊 Application Status</h3>
          <div className="space-y-2">
            <p><strong>Status:</strong> 
              <span className={`ml-2 px-2 py-1 rounded text-sm font-bold ${
                status.status === 'approved' ? 'bg-green-500 text-white' :
                status.status === 'rejected' ? 'bg-red-500 text-white' :
                'bg-yellow-500 text-white'
              }`}>
                {status.status.toUpperCase()}
              </span>
            </p>
            <p><strong>Requested:</strong> <span className="font-mono text-gray-800">{status.requestedAmount}</span></p>
            <p><strong>Submitted:</strong> <span className="text-gray-800">{new Date(status.submittedAt).toLocaleString()}</span></p>
          </div>
        </div>
      )}
    </div>
  );
}
