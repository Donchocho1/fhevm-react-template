import { useState } from "react";
import type { FHEVMConfig } from "../../fhevmTypes";
import { FHEVMClient } from "../../core/client";

/**
 * Universal FHEVM hook for the enhanced SDK
 */
export const useUniversalFHEVM = (config?: FHEVMConfig) => {
  const [client, setClient] = useState<FHEVMClient | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const init = async () => {
    if (!config?.provider) {
      setError("Provider not available");
      return;
    }

    setIsInitializing(true);
    setError(null);

    try {
      const fhevmClient = new FHEVMClient(config.provider);
      await fhevmClient.init();
      setClient(fhevmClient);
      setIsInitialized(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Initialization failed");
    } finally {
      setIsInitializing(false);
    }
  };

  const encrypt = async (value: number): Promise<string> => {
    if (!client || !isInitialized) {
      throw new Error("FHEVM not initialized");
    }
    return await client.encrypt(value);
  };

  return {
    client,
    isInitialized,
    isInitializing,
    error,
    init,
    encrypt,
    initializeWithBrowserProvider: init,
    instance: client?.getInstance() || null,
    refresh: init,
  };
};
