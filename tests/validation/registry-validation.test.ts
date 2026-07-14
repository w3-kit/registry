import { describe, expect, it } from "vitest";
import chainsData from "../../data/chains.json" with { type: "json" };
import solanaProgramsData from "../../data/solana-programs.json" with { type: "json" };
import tokensData from "../../data/tokens.json" with { type: "json" };
import {
  formatValidationIssues,
  validateRegistry,
  validateRegistryData,
} from "../../src/validation/registry-validator.js";

describe("registry validation", () => {
  it("passes for the committed registry data", () => {
    expect(validateRegistry()).toEqual([]);
  });

  it("provides two public RPC fallbacks for every chain", () => {
    chainsData.forEach((chain) => {
      expect(chain.rpcUrls.length, chain.name).toBeGreaterThanOrEqual(2);
      expect(chain.rpcUrls.every((rpc) => rpc.public), chain.name).toBe(true);
      expect(new Set(chain.rpcUrls.map((rpc) => rpc.provider)).size, chain.name).toBe(
        chain.rpcUrls.length,
      );
    });
  });

  it("covers the core stablecoins on EVM mainnets with canonical deployments", () => {
    // zkSync Era has no issuer-published or explorer-confirmed DAI deployment.
    const evmMainnetIds = chainsData
      .filter((chain) => chain.ecosystem === "evm" && !chain.testnet && chain.chainId !== 324)
      .map((chain) => chain.chainId);
    const stablecoins = new Map(
      tokensData
        .filter((token) => ["USDC", "USDT", "DAI"].includes(token.symbol))
        .map((token) => [token.symbol, new Set(token.chains.map((entry) => entry.chainId))]),
    );

    for (const symbol of ["USDC", "USDT", "DAI"]) {
      const tokenChains = stablecoins.get(symbol);
      expect(tokenChains, symbol).toBeDefined();
      expect(evmMainnetIds.every((chainId) => tokenChains?.has(chainId)), symbol).toBe(true);
    }
  });

  it("reports missing required fields", () => {
    const data = cloneRegistryData();
    delete data.chains[0].name;

    const issues = validateRegistryData(data);

    expect(issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          file: "chains.json",
          path: "[0].name",
          severity: "error",
        }),
      ]),
    );
  });

  it("reports duplicate token symbols case-insensitively", () => {
    const data = cloneRegistryData();
    data.tokens.push({
      ...structuredClone(data.tokens[0]),
      symbol: data.tokens[0].symbol.toLowerCase(),
    });

    const issues = validateRegistryData(data);

    expect(issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          file: "tokens.json",
          path: "[0].symbol",
        }),
        expect.objectContaining({
          file: "tokens.json",
          path: `[${data.tokens.length - 1}].symbol`,
        }),
      ]),
    );
  });

  it("reports unknown chain references", () => {
    const data = cloneRegistryData();
    data.tokens[0].chains[0].chainId = 999999;

    const issues = validateRegistryData(data);

    expect(issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          file: "tokens.json",
          path: "[0].chains[0].chainId",
        }),
      ]),
    );
  });

  it("reports invalid ecosystem-specific identifiers", () => {
    const data = cloneRegistryData();
    data.tokens[0].chains[0].address = "not-an-evm-address";

    const issues = validateRegistryData(data);

    expect(formatValidationIssues(issues)).toContain(
      'tokens.json:[0].chains[0].address - Invalid evm token identifier for chainId "1"',
    );
  });

  it("rejects bare addresses for move-based token identifiers", () => {
    const data = cloneRegistryData();
    data.tokens[15].chains[0].address = "0x2";

    const issues = validateRegistryData(data);

    expect(formatValidationIssues(issues)).toContain(
      'tokens.json:[15].chains[0].address - Invalid sui token identifier for chainId "78272106"',
    );
  });
});

function cloneRegistryData() {
  return {
    chains: structuredClone(chainsData),
    solanaPrograms: structuredClone(solanaProgramsData),
    tokens: structuredClone(tokensData),
  };
}
