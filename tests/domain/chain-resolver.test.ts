import { describe, it, expect } from "vitest";
import { ChainResolver } from "../../src/domain/services/chain-resolver.js";
import { JsonChainRepository } from "../../src/infrastructure/repositories/json-chain-repository.js";

describe("ChainResolver", () => {
  const resolver = new ChainResolver(new JsonChainRepository());
  it("resolves by chain ID", () => {
    const chain = resolver.resolve(1);
    expect(chain).toBeDefined();
    expect(chain?.name).toBe("Ethereum");
  });
  it("resolves by name (case-insensitive)", () => {
    const chain = resolver.resolve("ethereum");
    expect(chain).toBeDefined();
    expect(chain?.chainId).toBe(1);
  });
  it("returns undefined for unknown chain", () => {
    expect(resolver.resolve(999999)).toBeUndefined();
  });
});
