import { FhevmInstance } from '../fhevmTypes';
import { FhevmDecryptionSignature } from '../FhevmDecryptionSignature';
import { GenericStringStorage } from '../storage/GenericStringStorage';
import { JsonRpcProvider, JsonRpcSigner } from 'ethers';

// Fixed version that matches actual FhevmInstance interface
export class FHEVMClient {
  private instance: FhevmInstance | null = null;
  private isInitialized: boolean = false;
  
  constructor(private provider: any) {} // Use any to avoid type issues

  async init(): Promise<void> {
    if (this.isInitialized) return;

    try {
      const { createFhevmInstance } = await import('../internal/fhevm');
      
      const abortController = new AbortController();
      
      this.instance = await createFhevmInstance({
        provider: this.provider,
        signal: abortController.signal,
        onStatusChange: (status) => {
          console.debug(`FHEVM Status: ${status}`);
        }
      });
      
      this.isInitialized = true;
    } catch (error) {
      throw new Error(`FHEVM initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Use the instance's methods directly
  async encrypt(value: number): Promise<string> {
    if (!this.instance || !this.isInitialized) {
      throw new Error('FHEVM client not initialized');
    }
    
    // Use the instance's encrypt method directly
    return await (this.instance as any).encrypt(value);
  }

  async userDecrypt(
    ciphertext: string, 
    contractAddresses: string[],
    signer: JsonRpcSigner,
    storage: GenericStringStorage = this.createDefaultStorage()
  ): Promise<number> {
    if (!this.instance || !this.isInitialized) {
      throw new Error('FHEVM client not initialized');
    }
    
    try {
      const signature = await FhevmDecryptionSignature.loadOrSign(
        this.instance,
        contractAddresses,
        signer,
        storage
      );
      
      if (!signature) {
        throw new Error('Failed to create EIP-712 decryption signature');
      }
      
      return await (this.instance as any).decrypt(ciphertext, signature.privateKey);
    } catch (error) {
      throw new Error(`User decryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async publicDecrypt(ciphertext: string, publicKey: string): Promise<number> {
    throw new Error('Public decryption not yet implemented');
  }

  async callEncryptedMethod(
    contract: any,
    methodName: string,
    encryptedParams: string[]
  ): Promise<any> {
    if (!this.instance || !this.isInitialized) {
      throw new Error('FHEVM client not initialized');
    }
    
    if (typeof contract[methodName] !== 'function') {
      throw new Error(`Contract method '${methodName}' not found`);
    }
    
    return await contract[methodName](...encryptedParams);
  }

  async generateKeypair(): Promise<{ publicKey: string; privateKey: string }> {
    if (!this.instance || !this.isInitialized) {
      throw new Error('FHEVM client not initialized');
    }
    
    if (typeof (this.instance as any).generateKeypair === 'function') {
      return await (this.instance as any).generateKeypair();
    }
    
    throw new Error('Keypair generation not available');
  }

  getInstance(): FhevmInstance | null {
    return this.instance;
  }

  getIsInitialized(): boolean {
    return this.isInitialized;
  }

  static async createQuickSetup(provider: any): Promise<FHEVMClient> {
    const client = new FHEVMClient(provider);
    await client.init();
    return client;
  }

  async encryptBatch(values: number[]): Promise<string[]> {
    const encryptedValues: string[] = [];
    for (const value of values) {
      const encrypted = await this.encrypt(value);
      encryptedValues.push(encrypted);
    }
    return encryptedValues;
  }

  async healthCheck(): Promise<{ healthy: boolean; message: string }> {
    if (!this.isInitialized) {
      return { healthy: false, message: 'FHEVM client not initialized' };
    }
    
    try {
      const encrypted = await this.encrypt(42);
      return { 
        healthy: true, 
        message: `FHEVM client healthy - encrypted: ${encrypted.substring(0, 20)}...` 
      };
    } catch (error) {
      return { 
        healthy: false, 
        message: `FHEVM client unhealthy: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  }

  private createDefaultStorage(): GenericStringStorage {
    const storage = new Map<string, string>();
    return {
      setItem: async (key: string, value: string): Promise<void> => {
        storage.set(key, value);
      },
      getItem: async (key: string): Promise<string | null> => {
        return storage.get(key) || null;
      },
      removeItem: async (key: string): Promise<void> => {
        storage.delete(key);
      }
    };
  }
}

export const createMemoryStorage = (): GenericStringStorage => {
  const storage = new Map<string, string>();
  return {
    setItem: async (key: string, value: string): Promise<void> => {
      storage.set(key, value);
    },
    getItem: async (key: string): Promise<string | null> => {
      return storage.get(key) || null;
    },
    removeItem: async (key: string): Promise<void> => {
      storage.delete(key);
    }
  };
};

export const isValidEncryptedData = (data: string): boolean => {
  return typeof data === 'string' && data.length > 0;
};

export const loanUtilities = {
  encryptCreditScore: async (client: FHEVMClient, creditScore: number): Promise<string> => {
    if (creditScore < 300 || creditScore > 850) {
      throw new Error('Credit score must be between 300 and 850');
    }
    return await client.encrypt(creditScore);
  },
  isValidLoanData: (encryptedData: string): boolean => {
    return isValidEncryptedData(encryptedData);
  }
};
