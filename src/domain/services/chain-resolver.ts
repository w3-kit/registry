import type { Chain } from "../entities/chain.js";
import type { ChainRepository } from "../repositories/chain-repository.js";

export class ChainResolver {
  constructor(private readonly repo: ChainRepository) {}
  resolve(query: string | number): Chain | undefined {
    if (typeof query === "number") return this.repo.getById(query);
    const all = this.repo.getAll();
    const lower = query.toLowerCase();
    return all.find((c) => c.name.toLowerCase() === lower || c.shortName.toLowerCase() === lower);
  }
}
