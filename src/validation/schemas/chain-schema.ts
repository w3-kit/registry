import { z } from "zod";
import {
  chainIdSchema,
  ecosystemSchema,
  httpUrlSchema,
  nonEmptyStringSchema,
  solanaClusterSchema,
} from "./shared.js";

export const rpcEndpointSchema = z.object({
  url: httpUrlSchema,
  provider: nonEmptyStringSchema,
  public: z.boolean(),
});

export const rpcEndpointsSchema = z
  .array(rpcEndpointSchema)
  .min(2)
  .superRefine((rpcEndpoints, ctx) => {
    if (rpcEndpoints.filter((rpc) => rpc.public).length < 2) {
      ctx.addIssue({
        code: "custom",
        message: "At least two public RPC URLs are required",
      });
    }
  });

export const chainSchema = z
  .object({
    chainId: chainIdSchema,
    name: nonEmptyStringSchema,
    shortName: nonEmptyStringSchema,
    ecosystem: ecosystemSchema,
    cluster: solanaClusterSchema.optional(),
    nativeCurrency: z.object({
      name: nonEmptyStringSchema,
      symbol: nonEmptyStringSchema,
      decimals: z.number().int().nonnegative(),
    }),
    rpcUrls: z.array(httpUrlSchema),
    rpcEndpoints: rpcEndpointsSchema,
    blockExplorers: z.array(httpUrlSchema),
    faucets: z.array(httpUrlSchema),
    testnet: z.boolean(),
    learn: z.string(),
  })
  .superRefine((chain, ctx) => {
    if (
      chain.rpcUrls.length !== chain.rpcEndpoints.length ||
      chain.rpcUrls.some((url, index) => url !== chain.rpcEndpoints[index].url)
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["rpcEndpoints"],
        message: '"rpcUrls" must match the URLs in "rpcEndpoints" in the same order',
      });
    }

    if (chain.ecosystem === "solana" && !chain.cluster) {
      ctx.addIssue({
        code: "custom",
        path: ["cluster"],
        message: 'Solana chains must declare a cluster ("mainnet-beta" or "devnet")',
      });
    }

    if (chain.ecosystem !== "solana" && chain.cluster) {
      ctx.addIssue({
        code: "custom",
        path: ["cluster"],
        message: 'Only Solana chains may declare a "cluster" field',
      });
    }
  });
