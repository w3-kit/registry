import type { Chain } from "../entities/chain.js";
export interface ChainRepository {
  getAll(): Chain[];
  getById(chainId: number): Chain | undefined;
  getByEcosystem(ecosystem: "evm" | "solana" | "bitcoin"): Chain[];
  getByNetworkType(testnet: boolean): Chain[];
}
