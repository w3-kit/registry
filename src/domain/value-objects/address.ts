const EVM_ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;
const SOLANA_ADDRESS_REGEX = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

export class Address {
  private constructor(public readonly value: string, public readonly type: "evm" | "solana") {}
  static create(address: string): Address {
    if (EVM_ADDRESS_REGEX.test(address)) return new Address(address, "evm");
    if (SOLANA_ADDRESS_REGEX.test(address)) return new Address(address, "solana");
    throw new Error(`Invalid address: ${address}`);
  }
  equals(other: Address): boolean { return this.value.toLowerCase() === other.value.toLowerCase(); }
}
