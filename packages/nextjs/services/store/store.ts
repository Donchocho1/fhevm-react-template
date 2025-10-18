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

// Default target network (you can customize this)
const defaultTargetNetwork: TargetNetwork = {
  id: 31337, // Hardhat local network
  name: "Hardhat",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["http://localhost:8545"],
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
