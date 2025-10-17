#!/bin/bash

echo "🔄 Starting fresh development environment..."
echo "=============================================="

# Kill any running Next.js processes
echo "⏹️  Stopping any running Next.js servers..."
pkill -f "next dev" 2>/dev/null && echo "✅ Stopped running servers" || echo "ℹ️  No servers running"

# Navigate to Next.js directory
cd packages/nextjs

# Clear Next.js cache
echo "🧹 Cleaning Next.js cache..."
rm -rf .next 2>/dev/null && echo "✅ Cache cleared" || echo "ℹ️  No cache to clear"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    pnpm install
else
    echo "✅ Dependencies already installed"
fi

# Build SDK if needed
echo "🔨 Building SDK..."
cd ../..
pnpm sdk:build

# Start development server
echo "🚀 Starting Next.js development server..."
echo "📱 Your app will be available at: http://localhost:3000"
echo "💡 Press Ctrl+C to stop the server"
echo "=============================================="

cd packages/nextjs
pnpm dev
