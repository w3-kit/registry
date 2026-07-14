# @w3-kit/registry

[![CI](https://github.com/w3-kit/registry/actions/workflows/ci.yml/badge.svg)](https://github.com/w3-kit/registry/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/@w3-kit/registry)](https://www.npmjs.com/package/@w3-kit/registry)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

Chain, token, Solana program, and ABI registry for web3 development.

## Install

```bash
npm install @w3-kit/registry
```

## Usage

```ts
import {
  getChain,
  getToken,
  getAllChains,
  getChainsByEcosystem,
  getSolanaProgram,
  getSolanaProgramByAddress,
} from "@w3-kit/registry";

// Get a chain by ID
const ethereum = getChain(1);

// Get all EVM chains
const evmChains = getChainsByEcosystem("evm");

// Get a token by symbol
const usdc = getToken("USDC");

// Get a Solana program by key
const splTokenProgram = getSolanaProgram("spl-token");

// Reverse lookup a Solana program deployment
const raydium = getSolanaProgramByAddress(
  "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8",
  "mainnet-beta",
);
```

## Validation

Registry data is validated in CI before merge. Run the validation gate locally with:

```bash
npm run validate
```

The validator checks schema shape, URLs, chain references, duplicate identifiers, and ecosystem-specific token identifiers.

## RPC fallbacks

Each chain exposes at least two RPC entries. Every entry includes the endpoint URL, provider name, and a `public` flag so consumers can select public fallbacks explicitly:

```ts
const chain = getChain(1);
const publicRpcs = chain?.rpcUrls.filter((rpc) => rpc.public) ?? [];
```

These endpoints are best-effort public services for development, examples, and fallback access. They may be rate-limited or unavailable and should not be treated as production infrastructure. Applications should provide their own managed RPC endpoint for production traffic.

## Stablecoin addresses

USDC, USDT, and DAI entries use the issuer's native deployment when one is published for a supported chain, or the canonical contract recorded by that chain's block explorer. Testnet addresses are for testing only. A token is not added to a chain when the issuer does not publish a deployment there; the registry does not use placeholder or guessed addresses.

Primary sources:

- [Circle USDC contract addresses](https://developers.circle.com/stablecoins/usdc-contract-addresses)
- [Tether supported protocols](https://tether.to/en/supported-protocols)
- [Sky Protocol DAI documentation](https://developers.sky.money/protocol/tokens/dai) and [Maker deployment directory](https://chainlog.makerdao.com/)

## API

| Function                                        | Description                                |
| ----------------------------------------------- | ------------------------------------------ |
| `getAllChains()`                                | Get all chains                             |
| `getChain(chainId)`                             | Get chain by ID                            |
| `getChainsByEcosystem(eco)`                     | Filter chains by ecosystem                 |
| `getAllTokens()`                                | Get all tokens                             |
| `getToken(symbol)`                              | Get token by symbol                        |
| `getTokensByChain(chainId)`                     | Get tokens on a chain                      |
| `getAllSolanaPrograms()`                        | Get all registered Solana programs         |
| `getSolanaProgram(key)`                         | Get Solana program by stable key           |
| `getSolanaProgramsByCluster(cluster)`           | Filter Solana programs by cluster          |
| `getSolanaProgramByAddress(programId, cluster)` | Reverse lookup a Solana program deployment |

## Types

```ts
import type {
  Chain,
  Token,
  SolanaProgram,
  SolanaCluster,
  ChainId,
  Address,
} from "@w3-kit/registry";
```

## Architecture

Uses Domain-Driven Design (DDD) with domain, application, and infrastructure layers. See [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

## Part of the w3-kit ecosystem

- [w3-kit/ui](https://github.com/w3-kit/ui) — Component library
- [w3-kit/cli](https://github.com/w3-kit/cli) — CLI tool
- [w3-kit/learn](https://github.com/w3-kit/learn) — Recipes and guides
- [w3-kit/website](https://github.com/w3-kit/website) — w3-kit.com

## License

MIT
