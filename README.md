Universal FHEVM SDK - Competition Submission

> **Forked from: fhevm-react-template**  
> **Universal FHEVM SDK that works in React, Vue, and Plain JavaScript**

Quick Start (5 Lines of Code)

```JavaScript
// Works in any JavaScript environment
import { setupUniversalFHEVM } from '@loan-dapp/sdk';

const sdk = await setupUniversalFHEVM(11155111);
const encrypted = await sdk.encrypt(42);
console.log('🔐 Encrypted:', encrypted.ciphertext);

Live Deployment
Demo	Framework	Status	Access
Loan DApp	Next.js	✅ LIVE	https://fhevm-react-template.onrender.com
Vue.js Demo	Vue 3	🔧 Local Only	Run locally (see below)
Plain JS Demo	Vanilla JS	🔧 Local Only	Run locally (see below)

Universal & Framework-Agnostic SDK
Core SDK has zero React dependencies - Pure JavaScript

Works across multiple environments: React, Vue, Plain JS

Separate adapters for framework-specific code

Wagmi-like API for familiar developer experience

Multiple Environment Showcases
Environment	Status	Purpose
Next.js	✅ Production Ready	Full confidential Loan DApp
Vue.js	✅ Local Proof	SDK works without React
Plain JavaScript	✅ Local Proof	No framework dependencies

✅ Complete FHEVM Flow
🔐 Encryption: Private data protection

🔓 Decryption: EIP-712 secure access

🏥 Health Checks: System monitoring

📦 Batch Operations: Efficient processing

✅ Quick Setup & Developer Experience
bash
# Install and run in under 10 lines
pnpm install && pnpm sdk:build
cd packages/nextjs && pnpm dev

🏦 Local Development
Main Application (Production Ready)
bash

# Live deployment - no setup required
https://fhevm-react-template.onrender.com

Framework Demos (Local Development)
bash
# 1. Install dependencies
pnpm install

# 2. Build universal SDK
pnpm sdk:build

# 3. Run demos locally:
# Vue.js Demo (Port 3001)
cd packages/vue-demo && python3 -m http.server 3001

# Plain JS Demo (Port 3002)
cd packages/plain-js-demo && python3 -m http.server 3002


🏗️ Architecture
text
packages/
├── fhevm-sdk/           # 🎯 UNIVERSAL CORE
│   ├── src/core/        # Framework-agnostic FHEVM client
│   ├── src/universal.ts # Wagmi-like API
│   └── src/adapters/    # Framework-specific adapters
├── nextjs/              # ✅ LIVE: Loan DApp on Render
├── vue-demo/            # 🔧 LOCAL: Vue.js framework proof
└── plain-js-demo/       # 🔧 LOCAL: Plain JS universal proof


📹 Video Walkthrough
Demonstrating:

Live Loan DApp at https://fhevm-react-template.onrender.com

Local framework proofs running Vue.js and Plain JS

Universal SDK architecture and quick setup

Repository: https://github.com/Donchocho1/fhevm-react-template
Live Application: https://fhevm-react-template.onrender.com

Forked from fhevm-react-template as required by competition guidelines
