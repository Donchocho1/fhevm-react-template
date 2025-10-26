# 🏆 Universal FHEVM SDK - My Competition Submission

> **Forked from: fhevm-react-template**  
> **Universal FHEVM SDK that works in React, Vue, and Plain JavaScript**

## 🚀 **Quick Start (5 Lines of Code)**

JavaScript
// Works in any JavaScript environment
import { setupUniversalFHEVM } from '@loan-dapp/sdk';

const sdk = await setupUniversalFHEVM(11155111);
const encrypted = await sdk.encrypt(42);
console.log('🔐 Encrypted:', encrypted.ciphertext);

## 🌐 Live Deployment
|Demo             |Framework	|Status	        |Access|
------------------ ------------ ---------------  -----------------------------------------|
|Loan DApp        |Next.js	|✅ LIVE	|https://fhevm-react-template.onrender.com|
------------------ ------------ --------------- -------------------------------------------|
|Vue.js Demo      |Vue 3	|🔧 Local Only	|Run locally (see below)|
------------------ ------------ --------------- -------------------------------------------|
|Plain JS Demo    |Vanilla JS	|🔧 Local Only	|Run locally (see below)|
