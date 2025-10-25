#!/bin/bash
echo "Building for Railway deployment..."

# Build the SDK first
cd ../fhevm-sdk
npm run build

# Go back to nextjs and build
cd ../nextjs
npm run build

echo "Build complete!"
