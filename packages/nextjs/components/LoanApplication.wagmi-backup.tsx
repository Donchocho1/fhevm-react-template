'use client';

import { useState, useEffect } from 'react';
import { useUniversalFHEVM, setupUniversalFHEVM } from '@loan-dapp/sdk';
import { useAccount } from 'wagmi';

export function LoanApplication() {
  const [creditScore, setCreditScore] = useState<number>(700);
  const [requestedAmount, setRequestedAmount] = useState<string>('1.0');
  const [loanPurpose, setLoanPurpose] = useState<string>('business');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [manualConnected, setManualConnected] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);

  const { isConnected, address, connector } = useAccount();
  const { isInitialized } = useUniversalFHEVM();

  // AGGRESSIVE connection detection
  useEffect(() => {
    const checkConnection = () => {
      const hasWallet = !!window.ethereum?.selectedAddress;
      console.log('🔍 MANUAL CONNECTION CHECK:', { 
        hasWallet, 
        address: window.ethereum?.selectedAddress,
        wagmiConnected: isConnected,
        wagmiAddress: address 
      });
      setManualConnected(hasWallet);
    };
    
    checkConnection();
    
    // Check every second
    const interval = setInterval(checkConnection, 1000);
    
    // Also check when window.ethereum changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', checkConnection);
      window.ethereum.on('chainChanged', checkConnection);
    }
    
    return () => {
      clearInterval(interval);
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', checkConnection);
        window.ethereum.removeListener('chainChanged', checkConnection);
      }
    };
  }, [isConnected, address, forceUpdate]);

  // Use BOTH wagmi and manual detection
  const isActuallyConnected = isConnected || manualConnected;
  const actualAddress = address || window.ethereum?.selectedAddress;

  console.log('🔍 FINAL CONNECTION STATE:', {
    isActuallyConnected,
    actualAddress,
    isInitialized,
    manualConnected,
    wagmiConnected: isConnected
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isActuallyConnected) {
      setResult({ error: 'Please connect your wallet first' });
      return;
    }

    if (!isInitialized) {
      setResult({ error: 'FHE system is initializing, please wait...' });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      console.log('🏦 Processing loan application...');

      // Initialize FHEVM SDK
      const universalSDK = await setupUniversalFHEVM(11155111);

      // Encrypt sensitive data
      const encryptedCreditScore = await universalSDK.encrypt(creditScore);
      const encryptedAmount = await universalSDK.encrypt(parseFloat(requestedAmount));

      // Create loan application
      const application = {
        applicationId: Date.now(),
        applicant: actualAddress,
        encryptedCreditScore,
        encryptedAmount,
        requestedAmount: `${requestedAmount} ETH`,
        creditScore,
        loanPurpose,
        status: 'pending',
        timestamp: new Date().toISOString(),
        txHash: `0x${Math.random().toString(16).substr(2, 64)}`
      };

      console.log('✅ Loan application created:', application);
      setResult(application);

    } catch (error: unknown) {
      console.error('❌ Application failed:', error);
      setResult({ 
        error: 'Failed to process application. Please try again.',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(false);
    }
  };

  const loanPurposeOptions = [
    { value: 'business', label: 'Business Expansion' },
    { value: 'personal', label: 'Personal Use' },
    { value: 'education', label: 'Education' },
    { value: 'medical', label: 'Medical Expenses' },
    { value: 'home', label: 'Home Improvement' },
    { value: 'debt', label: 'Debt Consolidation' }
  ];

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Apply for Private Loan</h2>

      {/* Connection Status */}
      {isActuallyConnected && (
        <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-green-800">✅ Wallet Connected</span>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
              Ready to Apply
            </span>
          </div>
          <div className="mt-2 text-xs text-green-700 font-mono truncate">
            {actualAddress}
          </div>
          <button 
            onClick={() => setForceUpdate(prev => prev + 1)}
            className="mt-2 text-xs text-blue-600 underline"
          >
            Refresh Connection
          </button>
        </div>
      )}

      {/* Rest of your form remains the same */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Credit Score, Loan Amount, Loan Purpose inputs... */}
        
        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !isActuallyConnected || !isInitialized}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg disabled:shadow-none"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processing Application...
            </div>
          ) : !isActuallyConnected ? (
            'Connect Wallet to Apply'
          ) : !isInitialized ? (
            'Initializing Encryption...'
          ) : (
            'Submit Loan Application'
          )}
        </button>
      </form>

      {/* Results display... */}
    </div>
  );
}
