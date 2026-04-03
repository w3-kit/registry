import type { Token } from "../entities/token.js";
export interface TokenRepository {
  getAll(): Token[];
  getBySymbol(symbol: string): Token | undefined;
  getByChain(chainId: number): Token[];
}
