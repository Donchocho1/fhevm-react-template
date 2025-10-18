"use client";

import { useFHEVM } from "@loan-dapp/sdk";
import { useAccount } from "wagmi";
import { useMemo, useState } from "react";

export const FHECounterDemo = () => {
  const { isConnected, chain } = useAccount();
  const { client, isInitialized, isInitializing, error, initializeWithBrowserProvider } = useFHEVM();
  
  const [demoMessage, setDemoMessage] = useState<string>("");

  const chainId = chain?.id;

  const handleInitialize = async () => {
    if (!isInitialized) {
      try {
        await initializeWithBrowserProvider();
        setDemoMessage("FHEVM initialized successfully! You can now use encrypted operations.");
      } catch (err) {
        setDemoMessage(`Failed to initialize FHEVM: ${err instanceof Error ? err.message : "Unknown error"}`);
      }
    }
  };

  const handleDemoEncryption = async () => {
    if (!client || !isInitialized) {
      setDemoMessage("FHEVM not initialized. Please initialize first.");
      return;
    }

    try {
      // Demo: Encrypt a simple value
      const testValue = 42;
      const encrypted = await client.encrypt(testValue);
      setDemoMessage(`✅ Successfully encrypted value ${testValue}: ${encrypted.substring(0, 30)}...`);
    } catch (err) {
      setDemoMessage(`❌ Encryption failed: ${err instanceof Error ? err.message : "Unknown error"}`);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border border-blue-200">
      <h3 className="text-xl font-bold text-gray-800 mb-4">🔐 FHEVM Universal SDK Demo</h3>
      
      <div className="space-y-4">
        {/* Connection Status */}
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Wallet Connection:</span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            isConnected 
              ? "bg-green-100 text-green-800" 
              : "bg-red-100 text-red-800"
          }`}>
            {isConnected ? "Connected" : "Disconnected"}
          </span>
        </div>

        {/* FHEVM Status */}
        <div className="flex items-center justify-between">
          <span className="text-gray-600">FHEVM Status:</span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            isInitialized 
              ? "bg-green-100 text-green-800" 
              : isInitializing
              ? "bg-yellow-100 text-yellow-800"
              : "bg-gray-100 text-gray-800"
          }`}>
            {isInitialized ? "Initialized" : isInitializing ? "Initializing..." : "Not Initialized"}
          </span>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-800 text-sm">
              ❌ Error: {error.message}
            </p>
          </div>
        )}

        {/* Demo Message */}
        {demoMessage && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-blue-800 text-sm">
              {demoMessage}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2">
          {!isInitialized && !isInitializing && (
            <button
              onClick={handleInitialize}
              disabled={!isConnected}
              className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Initialize FHEVM
            </button>
          )}

          {isInitialized && (
            <button
              onClick={handleDemoEncryption}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Test Encryption
            </button>
          )}

          {!isConnected && (
            <button
              disabled
              className="flex-1 bg-gray-300 text-gray-500 font-medium py-2 px-4 rounded-lg cursor-not-allowed"
            >
              Connect Wallet First
            </button>
          )}
        </div>

        {/* Info */}
        {isInitialized && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-green-800 text-sm">
              ✅ FHEVM Universal SDK is ready! The loan application can now use encrypted operations.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
