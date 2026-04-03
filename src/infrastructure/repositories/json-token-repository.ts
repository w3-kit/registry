import type { Token } from "../../domain/entities/token.js";
import type { TokenRepository } from "../../domain/repositories/token-repository.js";
import tokensData from "../../../data/tokens.json" with { type: "json" };

export class JsonTokenRepository implements TokenRepository {
  private readonly tokens: Token[] = tokensData as Token[];
  private readonly bySymbol = new Map<string, Token>(this.tokens.map((t) => [t.symbol.toUpperCase(), t]));

  getAll(): Token[] { return this.tokens; }
  getBySymbol(symbol: string): Token | undefined { return this.bySymbol.get(symbol.toUpperCase()); }
  getByChain(chainId: number): Token[] { return this.tokens.filter((t) => t.chains.some((c) => c.chainId === chainId)); }
}
