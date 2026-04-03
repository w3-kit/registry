export interface Token {
  symbol: string;
  name: string;
  decimals: number;
  chains: { chainId: number; address: string }[];
  logoUrl: string;
  learn: string;
}
