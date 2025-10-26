# 🏆 Universal FHEVM SDK - My Competition Submission

> **Forked from: fhevm-react-template**  
> **Universal FHEVM SDK that works in React, Vue, and Plain JavaScript**

## 🚀 **Quick Start (5 Lines of Code)**

```JavaScript
// Works in any JavaScript environment
import { setupUniversalFHEVM } from '@loan-dapp/sdk';

const sdk = await setupUniversalFHEVM(11155111);
const encrypted = await sdk.encrypt(42);
console.log('🔐 Encrypted:', encrypted.ciphertext);


