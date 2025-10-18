export { useFHEVMClient } from './useFHEVMClient';
export { useFHEEncryption } from './useFHEEncryption';
export { useFHEDecrypt } from './useFHEDecrypt';
export { useInMemoryStorage, InMemoryStorageProvider } from './useInMemoryStorage';
export { FHEVMProvider, useFHEVM } from './FHEVMProvider';

// Re-export core types and utilities for convenience
export { FHEVMClient, createMemoryStorage, isValidEncryptedData, loanUtilities } from '../../core/client';
export type { FhevmInstance } from '../../fhevmTypes';
