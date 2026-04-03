export class ChainId {
  private constructor(public readonly value: number) {}
  static create(id: number): ChainId {
    if (!Number.isInteger(id) || id < 0) throw new Error(`Invalid chain ID: ${id}`);
    return new ChainId(id);
  }
  equals(other: ChainId): boolean { return this.value === other.value; }
}
