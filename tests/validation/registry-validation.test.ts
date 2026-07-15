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
      expect(chain.rpcEndpoints.length, chain.name).toBeGreaterThanOrEqual(2);
      expect(
        chain.rpcEndpoints.filter((rpc) => rpc.public).length,
        chain.name,
      ).toBeGreaterThanOrEqual(2);
      expect(chain.rpcUrls).toEqual(chain.rpcEndpoints.map((rpc) => rpc.url));
    });
  });

  it("rejects chains without two public RPC fallbacks", () => {
    const data = cloneRegistryData();
    data.chains[0].rpcEndpoints = data.chains[0].rpcEndpoints.map((rpc) => ({
      ...rpc,
      public: false,
    }));

    const issues = validateRegistryData(data);

    expect(formatValidationIssues(issues)).toContain(
      "chains.json:[0].rpcEndpoints - At least two public RPC URLs are required",
    );
  });

  it("rejects mismatched legacy and structured RPC URLs", () => {
    const data = cloneRegistryData();
    data.chains[0].rpcUrls[0] = "https://different.example.com";

    const issues = validateRegistryData(data);

    expect(formatValidationIssues(issues)).toContain(
      'chains.json:[0].rpcEndpoints - "rpcUrls" must match the URLs in "rpcEndpoints" in the same order',
    );
  });

  it("keeps stablecoin coverage limited to canonical deployments", () => {
    const expectedCoverage = {
      USDC: [1, 10, 137, 42161, 43114, 8453, 101, 103, 324, 78272106, 27, 11155111],
      USDT: [1, 10, 56, 137, 42161, 43114, 8453, 101, 324, 78272106, 27, 11155111],
      DAI: [1, 10, 137, 42161, 8453, 101, 324, 11155111],
    };

    for (const [symbol, chainIds] of Object.entries(expectedCoverage)) {
      const token = tokensData.find((entry) => entry.symbol === symbol);
      expect(token, symbol).toBeDefined();
      expect(token?.chains.map((entry) => entry.chainId).sort((a, b) => a - b)).toEqual(
        chainIds.sort((a, b) => a - b),
      );
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
