import type { SolanaCluster } from "../value-objects/solana-cluster.js";

export interface RpcUrl {
  url: string;
  provider: string;
  public: boolean;
}

export interface Chain {
  chainId: number;
  name: string;
  shortName: string;
  ecosystem: "evm" | "solana" | "bitcoin" | "sui" | "aptos";
  cluster?: SolanaCluster;
  nativeCurrency: { name: string; symbol: string; decimals: number };
  rpcUrls: RpcUrl[];
  blockExplorers: string[];
  faucets: string[];
  testnet: boolean;
  learn: string;
}
