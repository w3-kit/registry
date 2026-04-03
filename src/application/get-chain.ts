import type { Chain } from "../domain/entities/chain.js";
import type { ChainRepository } from "../domain/repositories/chain-repository.js";
export function getChain(repo: ChainRepository, chainId: number): Chain | undefined { return repo.getById(chainId); }
