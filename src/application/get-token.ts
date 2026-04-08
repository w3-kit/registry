import type { Token } from "../domain/entities/token.js";
import type { TokenRepository } from "../domain/repositories/token-repository.js";
export function getToken(repo: TokenRepository, symbol: string): Token | undefined {
  return repo.getBySymbol(symbol);
}
