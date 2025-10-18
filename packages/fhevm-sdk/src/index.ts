// Core framework-agnostic exports
export * from "./core/index";
export * from "./storage/index";
export * from "./fhevmTypes";
export type { FhevmDecryptionSignature } from "./FhevmDecryptionSignature";

// Universal SDK enhancements - wagmi-like pattern
export { 
  setupUniversalFHEVM, 
  demoUniversalFHEVM,
  createFHEVMConfig,
  setupFHEVM 
} from "./universal";
export type { FHEVMSDK } from "./universal";

// Private Loan SDK enhancements
export { setupPrivateLoanSDK, demoPrivateLoan, PrivateLoanClient } from "./privateLoan";
export type { LoanApplicationParams, LoanApplicationResult } from "./privateLoan";

// React adapter with new hook name
export { useUniversalFHEVM, FHEVMProvider, InMemoryStorageProvider } from "./adapters/react";
export { useFHEDecrypt, useFHEEncryption, useFHEVMClient, useInMemoryStorage } from "./adapters/react";

// Encryption utilities
export { buildParamsFromAbi, getEncryptionMethod } from "./adapters/react/useFHEEncryption";

// Core client and utilities
export { FHEVMClient, createMemoryStorage, isValidEncryptedData, loanUtilities } from "./core/client";

// Legacy alias - use the new hook name
export { useUniversalFHEVM as useFhevm } from "./adapters/react";
export type { FhevmInstance } from "./fhevmTypes";

// Re-export commonly used types
export type { FHEVMConfig, EncryptedData, DecryptionRequest } from "./fhevmTypes";
