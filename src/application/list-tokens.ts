import type { Token } from "../domain/entities/token.js";
import type { TokenRepository } from "../domain/repositories/token-repository.js";
export interface TokenFilter { chainId?: number; }
export function listTokens(repo: TokenRepository, filter?: TokenFilter): Token[] {
  if (filter?.chainId !== undefined) return repo.getByChain(filter.chainId);
  return repo.getAll();
}
