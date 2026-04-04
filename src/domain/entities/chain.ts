export interface Chain {
  chainId: number;
  name: string;
  shortName: string;
  ecosystem: "evm" | "solana" | "bitcoin" | "sui" | "aptos";
  nativeCurrency: { name: string; symbol: string; decimals: number };
  rpcUrls: string[];
  blockExplorers: string[];
  faucets: string[];
  testnet: boolean;
  learn: string;
}
