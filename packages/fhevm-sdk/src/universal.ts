import { FHEVMClient } from "./core/client";
import type { FHEVMConfig, EncryptedData, DecryptionRequest } from "./fhevmTypes";

export interface FHEVMSDK {
  // Core instance
  client: FHEVMClient;
  
  // State
  isInitialized: boolean;
  isInitializing: boolean;
  error: string | null;
  
  // Core methods
  init: () => Promise<void>;
  encrypt: (data: any) => Promise<EncryptedData>;
  decrypt: (request: DecryptionRequest) => Promise<any>;
  getPublicKey: () => Promise<string>;
  
  // Utility methods
  healthCheck: () => Promise<{ healthy: boolean; message: string }>;
  encryptBatch: (values: number[]) => Promise<string[]>;
}

export interface CreateFHEVMConfig {
  chainId: number;
  provider: any;
  contractAddress?: string;
  autoInit?: boolean;
}

/**
 * Wagmi-like configuration creator - THE CORE OF THE UNIVERSAL SDK
 */
export const createFHEVMConfig = (config: CreateFHEVMConfig): FHEVMSDK => {
  const client = new FHEVMClient(config.provider);
  let isInitialized = false;
  let isInitializing = false;
  let error: string | null = null;

  const init = async (): Promise<void> => {
    if (isInitialized || isInitializing) return;
    
    isInitializing = true;
    error = null;
    
    try {
      await client.init();
      isInitialized = true;
    } catch (err) {
      error = err instanceof Error ? err.message : 'Unknown initialization error';
      throw new Error(error);
    } finally {
      isInitializing = false;
    }
  };

  const encrypt = async (data: any): Promise<EncryptedData> => {
    if (!isInitialized) {
      throw new Error('FHEVM not initialized. Call init() first.');
    }

    const ciphertext = await client.encrypt(data);
    const publicKey = await getPublicKey();
    
    return {
      ciphertext,
      publicKey,
      signature: undefined // Can be added with EIP-712 signing
    };
  };

  const decrypt = async (request: DecryptionRequest): Promise<any> => {
    if (!isInitialized) {
      throw new Error('FHEVM not initialized. Call init() first.');
    }

    // This would use your FhevmDecryptionSignature for EIP-712 signing
    return await client.userDecrypt(
      request.encryptedData.ciphertext,
      [request.contractAddress],
      request.signer
    );
  };

  const getPublicKey = async (): Promise<string> => {
    if (!isInitialized) {
      throw new Error('FHEVM not initialized. Call init() first.');
    }
    
    const kp = await client.generateKeypair();
    return kp.publicKey;
  };

  const healthCheck = async (): Promise<{ healthy: boolean; message: string }> => {
    if (!isInitialized) {
      return { healthy: false, message: 'FHEVM not initialized' };
    }
    return await client.healthCheck();
  };

  const encryptBatch = async (values: number[]): Promise<string[]> => {
    if (!isInitialized) {
      throw new Error('FHEVM not initialized. Call init() first.');
    }
    return await client.encryptBatch(values);
  };

  // Auto-init if enabled
  if (config.autoInit) {
    init().catch(err => {
      error = err.message;
    });
  }

  return {
    client,
    isInitialized,
    isInitializing,
    error,
    init,
    encrypt,
    decrypt,
    getPublicKey,
    healthCheck,
    encryptBatch
  };
};

/**
 * Universal FHEVM setup - works in any JavaScript environment
 * 5-line setup for any framework
 */
export const setupUniversalFHEVM = async (chainId: number = 11155111): Promise<FHEVMSDK> => {
  const provider = "https://sepolia.infura.io/v3/YOUR_INFURA_KEY";

  const sdk = createFHEVMConfig({
    chainId,
    provider,
    autoInit: true
  });

  await sdk.init();
  return sdk;
};

/**
 * Quick demo function showing the universal API pattern
 */
export const demoUniversalFHEVM = async () => {
  const sdk = await setupUniversalFHEVM(11155111);
  
  // Demo encryption
  const encrypted = await sdk.encrypt(42);
  
  // Demo health check
  const health = await sdk.healthCheck();
  
  return {
    sdk,
    encrypted,
    health,
    publicKey: await sdk.getPublicKey()
  };
};

/**
 * Wagmi-like setup utilities for different environments
 */
export const setupFHEVM = {
  // Universal setup
  universal: setupUniversalFHEVM,
  
  // Config creation (wagmi-like pattern)
  createConfig: createFHEVMConfig,
  
  // Quick start with auto-init
  quickStart: async (chainId: number = 11155111) => {
    const sdk = await setupUniversalFHEVM(chainId);
    return sdk;
  },
  
  // Framework-specific helpers
  forReact: (config: CreateFHEVMConfig) => createFHEVMConfig(config),
  forVue: (config: CreateFHEVMConfig) => createFHEVMConfig(config),
  forNode: (config: CreateFHEVMConfig) => createFHEVMConfig(config),
};

/**
 * Utility functions for common FHEVM patterns
 */
export const fhevmUtils = {
  // Validate encrypted data
  isValidEncryptedData: (data: string): boolean => {
    return typeof data === 'string' && data.length > 0 && data.startsWith('0x');
  },
  
  // Create decryption request
  createDecryptionRequest: (
    ciphertext: string, 
    contractAddress: string, 
    signer: any
  ): DecryptionRequest => {
    return {
      encryptedData: { ciphertext },
      contractAddress,
      signer
    };
  },
  
  // Batch encryption helper
  encryptValues: async (sdk: FHEVMSDK, values: number[]): Promise<EncryptedData[]> => {
    const results: EncryptedData[] = [];
    for (const value of values) {
      results.push(await sdk.encrypt(value));
    }
    return results;
  }
};
