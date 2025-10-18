import { FhevmInstance } from '../fhevmTypes';
import { FhevmDecryptionSignature } from '../FhevmDecryptionSignature';
import { GenericStringStorage } from '../storage/GenericStringStorage';

export class FHEVMClient {
  private instance: FhevmInstance | null = null;
  
  constructor(private provider: any) {}

  async init(): Promise<void> {
    // Initialize FHEVM instance using existing createFhevmInstance
    const { createFhevmInstance } = await import('../internal/fhevm');
    this.instance = await createFhevmInstance({
      provider: this.provider,
      signal: new AbortController().signal
    });
  }

  // 🎯  Encryption utilities
  async encrypt(value: number): Promise<string> {
    if (!this.instance) throw new Error('FHEVM not initialized');
    return this.instance.encrypt(value);
  }

  // User decryption with EIP-712 signing
  async userDecrypt(
    ciphertext: string, 
    contractAddresses: string[],
    signer: any, // ethers.JsonRpcSigner
    storage: GenericStringStorage
  ): Promise<number> {
    if (!this.instance) throw new Error('FHEVM not initialized');
    
    const signature = await FhevmDecryptionSignature.loadOrSign(
      this.instance,
      contractAddresses,
      signer,
      storage
    );
    
    if (!signature) throw new Error('Failed to create decryption signature');
    
    return this.instance.decrypt(ciphertext, signature.privateKey);
  }

  // Public decryption
  async publicDecrypt(ciphertext: string, publicKey: string): Promise<number> {
    if (!this.instance) throw new Error('FHEVM not initialized');
    // This needs implementation - public decryption without EIP-712
    throw new Error('Public decryption not yet implemented');
  }

  async callEncryptedMethod(
    contract: any,
    methodName: string,
    encryptedParams: string[]
  ): Promise<any> {
    // Generic encrypted contract call pattern
    return contract[methodName](...encryptedParams);
  }

  getInstance(): FhevmInstance | null {
    return this.instance;
  }
}
