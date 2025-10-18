// Core framework-agnostic exports
export * from "./core/index";
export * from "./storage/index";
export * from "./fhevmTypes";
export type { FhevmDecryptionSignature } from "./FhevmDecryptionSignature";

// Universal SDK enhancements
export { setupUniversalFHEVM, demoUniversalFHEVM } from "./universal";

// Private Loan SDK enhancements
export { setupPrivateLoanSDK, demoPrivateLoan, PrivateLoanClient } from "./privateLoan";
export type { LoanApplicationParams, LoanApplicationResult } from "./privateLoan";

// React adapter
export { useFHEVM, FHEVMProvider, InMemoryStorageProvider } from "./adapters/react";
export { useFHEDecrypt, useFHEEncryption, useFHEVMClient, useInMemoryStorage } from "./adapters/react";

// Encryption utilities
export { buildParamsFromAbi, getEncryptionMethod } from "./adapters/react/useFHEEncryption";

// Core client and utilities
export { FHEVMClient, createMemoryStorage, isValidEncryptedData, loanUtilities } from "./core/client";

// Legacy alias
export { useFHEVM as useFhevm } from "./adapters/react";
export type { FhevmInstance } from "./fhevmTypes";
