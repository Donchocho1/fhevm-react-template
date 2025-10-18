import React, { createContext, useContext, ReactNode } from 'react';
import { JsonRpcProvider } from 'ethers';
import { useFHEVMClient } from './useFHEVMClient';

// Add window.ethereum type declaration
declare global {
  interface Window {
    ethereum?: any;
  }
}

interface FHEVMContextType {
  client: any | null;
  isInitializing: boolean;
  error: Error | null;
  isInitialized: boolean;
  initialize: (provider?: JsonRpcProvider | string) => Promise<void>;
  initializeWithBrowserProvider: () => Promise<void>;
  encrypt: (value: number) => Promise<string>;
  userDecrypt: (ciphertext: string, contractAddresses: string[], signer: any) => Promise<number>;
  healthCheck: () => Promise<{ healthy: boolean; message: string }>;
}

const FHEVMContext = createContext<FHEVMContextType | undefined>(undefined);

interface FHEVMProviderProps {
  children: ReactNode;
  provider?: JsonRpcProvider | string;
  autoInitialize?: boolean;
}

export const FHEVMProvider: React.FC<FHEVMProviderProps> = ({
  children,
  provider,
  autoInitialize = true,
}) => {
  const fhevm = useFHEVMClient(provider);

  React.useEffect(() => {
    if (autoInitialize && provider && !fhevm.client && !fhevm.isInitializing) {
      fhevm.initialize();
    }
  }, [autoInitialize, provider, fhevm]);

  return (
    <FHEVMContext.Provider value={fhevm}>
      {children}
    </FHEVMContext.Provider>
  );
};

export const useFHEVM = (): FHEVMContextType => {
  const context = useContext(FHEVMContext);
  if (context === undefined) {
    throw new Error('useFHEVM must be used within a FHEVMProvider');
  }
  return context;
};
