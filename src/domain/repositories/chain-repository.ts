import type { Chain } from "../entities/chain.js";
export interface ChainRepository {
  getAll(): Chain[];
  getById(chainId: number): Chain | undefined;
  getByEcosystem(ecosystem: Chain["ecosystem"]): Chain[];
  getByNetworkType(testnet: boolean): Chain[];
}
