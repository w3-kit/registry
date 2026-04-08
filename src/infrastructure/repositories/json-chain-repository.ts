import type { Chain } from "../../domain/entities/chain.js";
import type { ChainRepository } from "../../domain/repositories/chain-repository.js";
import chainsData from "../../../data/chains.json" with { type: "json" };

export class JsonChainRepository implements ChainRepository {
  private readonly chains: Chain[] = chainsData as Chain[];
  private readonly byId = new Map<number, Chain>(this.chains.map((c) => [c.chainId, c]));

  getAll(): Chain[] {
    return this.chains;
  }
  getById(chainId: number): Chain | undefined {
    return this.byId.get(chainId);
  }
  getByEcosystem(ecosystem: Chain["ecosystem"]): Chain[] {
    return this.chains.filter((c) => c.ecosystem === ecosystem);
  }
  getByNetworkType(testnet: boolean): Chain[] {
    return this.chains.filter((c) => c.testnet === testnet);
  }
}
