"use client";

import { useUniversalFHEVM, setupUniversalFHEVM } from "@loan-dapp/sdk";
import { useAccount } from "wagmi";
import { useMemo, useState } from "react";

export const FHECounterDemo = () => {
  const { isConnected, chain } = useAccount();
  const { client, isInitialized, isInitializing, error, init } = useUniversalFHEVM(); // Updated hook usage

  const [demoMessage, setDemoMessage] = useState<string>("");
  const [universalDemo, setUniversalDemo] = useState<any>(null);

  const chainId = chain?.id;

  // Demo universal SDK setup
  const handleUniversalDemo = async () => {
    try {
      setDemoMessage("Setting up Universal FHEVM SDK...");
      
      // This demonstrates the 5-line universal setup
      const universalSDK = await setupUniversalFHEVM(11155111);
      
      // Test encryption with universal SDK
      const encrypted = await universalSDK.encrypt(123);
      const publicKey = await universalSDK.getPublicKey();
      const health = await universalSDK.healthCheck();
      
      setUniversalDemo({
        encrypted: encrypted.ciphertext.substring(0, 30) + '...',
        publicKey: publicKey.substring(0, 20) + '...',
        health
      });
      
      setDemoMessage("✅ Universal SDK demo completed! Check the universal features below.");
    } catch (err) {
      setDemoMessage(`❌ Universal demo failed: ${err instanceof Error ? err.message : "Unknown error"}`);
    }
  };

  const handleDemoEncryption = async () => {
    if (!client || !isInitialized) {
      setDemoMessage("FHEVM not initialized. Please initialize first.");
      return;
    }

    try {
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
        {/* Universal SDK Demo Section */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h4 className="font-semibold text-purple-800 mb-2">🌐 Universal SDK Features</h4>
          <button
            onClick={handleUniversalDemo}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-lg transition-colors mb-3"
          >
            Test Universal SDK Setup
          </button>
          
          {universalDemo && (
            <div className="text-sm text-purple-700 space-y-1">
              <div>✅ Encrypted: {universalDemo.encrypted}</div>
              <div>✅ Public Key: {universalDemo.publicKey}</div>
              <div>✅ Health: {universalDemo.health.message}</div>
            </div>
          )}
        </div>

        {/* Rest of your existing component remains the same */}
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

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-800 text-sm">
              ❌ Error: {error}
            </p>
          </div>
        )}

        {demoMessage && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-blue-800 text-sm">
              {demoMessage}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2">
          {!isInitialized && !isInitializing && (
            <button
              onClick={init} // Use the new init method
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
