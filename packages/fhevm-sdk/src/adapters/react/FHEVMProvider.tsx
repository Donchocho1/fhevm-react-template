"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useUniversalFHEVM } from "./useUniversalFHEVM";
import type { FHEVMConfig } from "../../fhevmTypes";

interface FHEVMContextType {
  client: any;
  isInitialized: boolean;
  isInitializing: boolean;
  error: string | null;
  init: () => Promise<void>;
  encrypt: (value: number) => Promise<string>;
}

const FHEVMContext = createContext<FHEVMContextType | undefined>(undefined);

export const FHEVMProvider: React.FC<{
  children: React.ReactNode;
  config: FHEVMConfig;
}> = ({ children, config }) => {
  const fhevm = useUniversalFHEVM(config);

  return (
    <FHEVMContext.Provider value={fhevm}>
      {children}
    </FHEVMContext.Provider>
  );
};

export const useFHEVMContext = () => {
  const context = useContext(FHEVMContext);
  if (context === undefined) {
    throw new Error("useFHEVMContext must be used within a FHEVMProvider");
  }
  return context;
};

// Alias for InMemoryStorageProvider
export const InMemoryStorageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};
