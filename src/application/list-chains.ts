import type { Chain } from "../domain/entities/chain.js";
import type { ChainRepository } from "../domain/repositories/chain-repository.js";
export interface ChainFilter { ecosystem?: "evm" | "solana" | "bitcoin"; testnet?: boolean; }
export function listChains(repo: ChainRepository, filter?: ChainFilter): Chain[] {
  let chains = repo.getAll();
  if (filter?.ecosystem) chains = chains.filter((c) => c.ecosystem === filter.ecosystem);
  if (filter?.testnet !== undefined) chains = chains.filter((c) => c.testnet === filter.testnet);
  return chains;
}
