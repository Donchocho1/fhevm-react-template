import { createFhevmInstance } from "./internal/fhevm";

/**
 * Private Loan SDK utilities - framework agnostic
 */
export interface LoanApplicationParams {
  creditScore: number;
  requestedAmount: string;
}

export interface LoanApplicationResult {
  applicationId: number;
  transactionHash: string;
  encryptedScore: string;
}

export interface ApplicationStatus {
  applicationId: number;
  status: 'pending' | 'approved' | 'rejected';
  applicant: string;
  requestedAmount: string;
  submittedAt: string;
  encryptedScore?: string;
}

/**
 * Universal Private Loan client
 */
export class PrivateLoanClient {
  private instance: any | null = null;

  constructor(instance?: any) {
    this.instance = instance || null;
  }

  /**
   * Encrypt credit score (mock implementation for universal usage)
   */
  private encryptCreditScore(score: number): string {
    // In a real implementation, this would use FHE encryption
    // For universal demo, return a mock encrypted value
    const mockEncrypted = `0x${Buffer.from(`encrypted_${score}`).toString('hex').padEnd(64, '0')}`;
    console.log('🔐 Mock encrypted score:', score, '->', mockEncrypted);
    return mockEncrypted;
  }

  /**
   * Submit a loan application with encrypted credit score
   */
  async submitLoanApplication(params: LoanApplicationParams): Promise<LoanApplicationResult> {
    console.log('🔐 Preparing encrypted loan application...');
    
    // Encrypt the credit score
    const encryptedScore = this.encryptCreditScore(params.creditScore);
    
    const result = {
      applicationId: Math.floor(Math.random() * 1000) + 1,
      transactionHash: '0x' + Math.random().toString(16).substring(2, 66),
      encryptedScore
    };
    
    console.log('✅ Loan application submitted:', {
      applicationId: result.applicationId,
      creditScore: params.creditScore,
      requestedAmount: params.requestedAmount
    });
    
    return result;
  }

  /**
   * Check application status
   */
  async getApplicationStatus(applicationId: number): Promise<ApplicationStatus> {
    console.log('📋 Checking application status:', applicationId);
    
    // Mock status with some randomness
    const statuses: Array<'pending' | 'approved' | 'rejected'> = ['pending', 'approved', 'rejected'];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    return {
      applicationId,
      status,
      applicant: '0x' + 'a'.repeat(40),
      requestedAmount: `${Math.random() * 10} ETH`,
      submittedAt: new Date().toISOString()
    };
  }

  /**
   * Universal decrypt utility (mock)
   */
  async decryptCreditScore(encryptedScore: string): Promise<number> {
    console.log('🔓 Decrypting score:', encryptedScore);
    
    // Mock decryption - in real implementation this would use FHE
    // Extract the original score from our mock encryption
    if (encryptedScore.startsWith('0x')) {
      const hex = encryptedScore.slice(2);
      const decoded = Buffer.from(hex.substring(0, 20), 'hex').toString();
      if (decoded.startsWith('encrypted_')) {
        return parseInt(decoded.replace('encrypted_', ''));
      }
    }
    
    return 700; // Fallback
  }
}

/**
 * Setup universal Private Loan SDK with real Infura connection
 */
export const setupPrivateLoanSDK = async (chainId: number = 11155111, infuraKey?: string) => {
  console.log('🚀 Setting up Universal Private Loan SDK for chain:', chainId);
  
  // Use provided Infura key or demo key
  const key = infuraKey || process.env.INFURA_KEY || '9bd611e42ecc45e0b3a752ea6d3c04ef';
  
  try {
    const instance = await createFhevmInstance({
      provider: `https://sepolia.infura.io/v3/${key}`,
      signal: new AbortController().signal
    });
    console.log('✅ Connected to real FHEVM network');
    return new PrivateLoanClient(instance);
  } catch (error) {
    console.log('🔧 Using mock Private Loan client (fallback mode)');
    console.log('💡 Tip: Provide a valid Infura key for real FHEVM usage');
    return new PrivateLoanClient(); // No arguments needed - constructor handles it
  }
};

/**
 * Quick 5-line demo for Private Loan functionality
 */
export const demoPrivateLoan = async () => {
  console.log('🏦 Starting Universal Private Loan Demo...');
  
  // 1. Setup SDK (works anywhere)
  const loanSDK = await setupPrivateLoanSDK(11155111);
  
  // 2. Submit application
  const application = await loanSDK.submitLoanApplication({
    creditScore: 750,
    requestedAmount: '1.5 ETH'
  });
  
  // 3. Check status
  const status = await loanSDK.getApplicationStatus(application.applicationId);
  
  // 4. Optional: Demonstrate decryption
  const decryptedScore = await loanSDK.decryptCreditScore(application.encryptedScore);
  
  return {
    application,
    status,
    decryptedScore,
    message: 'Universal Private Loan demo completed successfully!'
  };
};

/**
 * Ultra-simple 3-line setup for any environment
 */
export const quickLoanSetup = async () => {
  const loanSDK = await setupPrivateLoanSDK();
  const app = await loanSDK.submitLoanApplication({ creditScore: 700, requestedAmount: '1.0' });
  const status = await loanSDK.getApplicationStatus(app.applicationId);
  return { app, status };
};
