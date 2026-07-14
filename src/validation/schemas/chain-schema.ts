import { z } from "zod";
import {
  chainIdSchema,
  ecosystemSchema,
  httpUrlSchema,
  nonEmptyStringSchema,
  solanaClusterSchema,
} from "./shared.js";

export const rpcUrlSchema = z.object({
  url: httpUrlSchema,
  provider: nonEmptyStringSchema,
  public: z.boolean(),
});

export const rpcUrlsSchema = z
  .array(rpcUrlSchema)
  .min(2)
  .superRefine((rpcUrls, ctx) => {
    if (rpcUrls.filter((rpc) => rpc.public).length < 2) {
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
    rpcUrls: rpcUrlsSchema,
    blockExplorers: z.array(httpUrlSchema),
    faucets: z.array(httpUrlSchema),
    testnet: z.boolean(),
    learn: z.string(),
  })
  .superRefine((chain, ctx) => {
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
