import { useCallback, useEffect, useState } from 'react';
import { JsonRpcProvider } from 'ethers';
import { FHEVMClient, createMemoryStorage } from '../../core/client';

// Add window.ethereum type declaration
declare global {
  interface Window {
    ethereum?: any;
  }
}

export const useFHEVMClient = (provider?: JsonRpcProvider | string) => {
  const [client, setClient] = useState<FHEVMClient | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const initialize = useCallback(async (customProvider?: JsonRpcProvider | string) => {
    const targetProvider = customProvider || provider;
    if (!targetProvider) {
      setError(new Error('No provider available for FHEVM initialization'));
      return;
    }

    setIsInitializing(true);
    setError(null);

    try {
      const fhevmClient = new FHEVMClient(targetProvider);
      await fhevmClient.init();
      setClient(fhevmClient);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to initialize FHEVM client'));
    } finally {
      setIsInitializing(false);
    }
  }, [provider]);

  const initializeWithBrowserProvider = useCallback(async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      const ethersProvider = new JsonRpcProvider(window.ethereum);
      await initialize(ethersProvider);
    } else {
      setError(new Error('No Ethereum provider found (e.g., MetaMask)'));
    }
  }, [initialize]);

  useEffect(() => {
    if (provider && !client && !isInitializing) {
      initialize();
    }
  }, [provider, client, isInitializing, initialize]);

  const encrypt = useCallback(async (value: number): Promise<string> => {
    if (!client) {
      throw new Error('FHEVM client not initialized');
    }
    return await client.encrypt(value);
  }, [client]);

  const userDecrypt = useCallback(async (
    ciphertext: string,
    contractAddresses: string[],
    signer: any
  ): Promise<number> => {
    if (!client) {
      throw new Error('FHEVM client not initialized');
    }
    
    const memoryStorage = createMemoryStorage();
    return await client.userDecrypt(ciphertext, contractAddresses, signer, memoryStorage);
  }, [client]);

  const healthCheck = useCallback(async () => {
    if (!client) {
      return { healthy: false, message: 'FHEVM client not initialized' };
    }
    return await client.healthCheck();
  }, [client]);

  return {
    client,
    isInitializing,
    error,
    isInitialized: !!client,
    initialize,
    initializeWithBrowserProvider,
    encrypt,
    userDecrypt,
    healthCheck,
    createMemoryStorage,
  };
};
