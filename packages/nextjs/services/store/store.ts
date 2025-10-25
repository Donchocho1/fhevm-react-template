import { create } from "zustand";

export type TargetNetwork = {
  id: number;
  name: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: {
    default: {
      http: string[];
    };
  };
  blockExplorers?: {
    default: {
      name: string;
      url: string;
    };
  };
};

export type GlobalState = {
  nativeCurrency: {
    price: number;
    isFetching: boolean;
  };
  targetNetwork: TargetNetwork;
  setNativeCurrencyPrice: (newValue: number) => void;
  setIsNativeCurrencyFetching: (newValue: boolean) => void;
  setTargetNetwork: (newValue: TargetNetwork) => void;
};

// Use Sepolia as default target network - HARDCODED VERSION
const defaultTargetNetwork: TargetNetwork = {
  id: 11155111, // Sepolia chain ID
  name: "Sepolia",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH", 
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://sepolia.infura.io/v3/9bd611e42ecc45e0b3a752ea6d3c04ef"],
    },
  },
  blockExplorers: {
    default: {
      name: "Etherscan",
      url: "https://sepolia.etherscan.io",
    },
  },
};

export const useGlobalState = create<GlobalState>((set) => ({
  nativeCurrency: {
    price: 0,
    isFetching: false,
  },
  targetNetwork: defaultTargetNetwork,
  setNativeCurrencyPrice: (newValue: number): void =>
    set((state) => ({ nativeCurrency: { ...state.nativeCurrency, price: newValue } })),
  setIsNativeCurrencyFetching: (newValue: boolean): void =>
    set((state) => ({ nativeCurrency: { ...state.nativeCurrency, isFetching: newValue } })),
  setTargetNetwork: (newValue: TargetNetwork): void =>
    set(() => ({ targetNetwork: newValue })),
}));    
