"use client";

import { useEffect, useState } from "react";
import { InMemoryStorageProvider, FHEVMProvider } from "@loan-dapp/sdk";
import { RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { useTheme } from "next-themes";
import { Toaster } from "react-hot-toast";
import { WagmiProvider } from "wagmi";
import { Header } from "~~/components/Header";
import { BlockieAvatar } from "~~/components/helper";
import { wagmiConfig } from "~~/services/web3/wagmiConfig";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

// Universal FHEVM configuration - using Sepolia
const fhevmConfig = {
  chainId: 11155111, // Sepolia chain ID
  provider: typeof window !== 'undefined' ? window.ethereum : undefined,
  autoInit: true
};

export const DappWrapperWithProviders = ({ children }: { children: React.ReactNode }) => {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          avatar={BlockieAvatar}
          theme={mounted ? (isDarkMode ? darkTheme() : lightTheme()) : lightTheme()}
        >
          <ProgressBar height="3px" color="#2299dd" />
          {/* Wrap with FHEVMProvider using universal config */}
          <FHEVMProvider config={fhevmConfig}>
            <InMemoryStorageProvider>
              <div className={`flex flex-col min-h-screen`}>
                <Header />
                <main className="relative flex flex-col flex-1">
                  {children}
                </main>
              </div>
            </InMemoryStorageProvider>
          </FHEVMProvider>
          <Toaster />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
