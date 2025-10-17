import { createFhevmInstance } from "./internal/fhevm";

/**
 * Universal FHEVM setup - works in any JavaScript environment
 * 5-line setup for any framework
 */
export const setupUniversalFHEVM = async (chainId: number = 11155111) => {
  // For universal usage, we need to provide a provider
  // Using a default Sepolia RPC for demo purposes
  const provider = "https://sepolia.infura.io/v3/YOUR_INFURA_KEY";
  
  const instance = await createFhevmInstance({
    provider,
    signal: new AbortController().signal
  });
  
  return {
    /**
     * Create encrypted input for contract calls
     */
    createEncryptedInput: (contractAddress: string, userAddress: string) => {
      return instance.createEncryptedInput(contractAddress, userAddress);
    },
    
    /**
     * Get public key for verification
     */
    getPublicKey: () => instance.getPublicKey(),
    
    /**
     * Get instance for advanced operations
     */
    getInstance: () => instance
  };
};

/**
 * Quick demo function showing the universal API pattern
 */
export const demoUniversalFHEVM = async () => {
  const fhevm = await setupUniversalFHEVM(11155111);
  return {
    publicKey: fhevm.getPublicKey(),
    instance: fhevm.getInstance()
  };
};
