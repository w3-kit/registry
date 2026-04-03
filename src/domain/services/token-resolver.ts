import type { Token } from "../entities/token.js";
import type { TokenRepository } from "../repositories/token-repository.js";

export class TokenResolver {
  constructor(private readonly repo: TokenRepository) {}
  resolve(symbol: string): Token | undefined { return this.repo.getBySymbol(symbol); }
  resolveOnChain(symbol: string, chainId: number): Token | undefined {
    const token = this.repo.getBySymbol(symbol);
    if (!token) return undefined;
    return token.chains.some((c) => c.chainId === chainId) ? token : undefined;
  }
}
