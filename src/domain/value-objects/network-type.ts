export type NetworkType = "mainnet" | "testnet";
export function getNetworkType(testnet: boolean): NetworkType {
  return testnet ? "testnet" : "mainnet";
}
