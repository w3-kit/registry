# @w3-kit/registry

Chain, token, and ABI registry for web3 development.

## Install

```bash
npm install @w3-kit/registry
```

## Usage

```ts
import { getChain, getToken, getAllChains, getChainsByEcosystem } from "@w3-kit/registry";

// Get a chain by ID
const ethereum = getChain(1);

// Get all EVM chains
const evmChains = getChainsByEcosystem("evm");

// Get a token by symbol
const usdc = getToken("USDC");
```

## API

| Function | Description |
|----------|-------------|
| `getAllChains()` | Get all chains |
| `getChain(chainId)` | Get chain by ID |
| `getChainsByEcosystem(eco)` | Filter chains by ecosystem |
| `getAllTokens()` | Get all tokens |
| `getToken(symbol)` | Get token by symbol |
| `getTokensByChain(chainId)` | Get tokens on a chain |

## Types

```ts
import type { Chain, Token, ChainId, Address } from "@w3-kit/registry";
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
