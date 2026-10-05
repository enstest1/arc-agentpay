import { defineChain } from "viem";

export const ARC_CHAIN_ID = 5042;
export const ARC_RPC_URL = process.env.NEXT_PUBLIC_ARC_RPC_URL || "https://rpc.mainnet.arc.io";
export const ARC_EXPLORER = "https://explorer.arc.io";
export const ARC_USDC = "0x3600000000000000000000000000000000000000" as const;

export const arc = defineChain({
  id: ARC_CHAIN_ID,
  name: "Arc",
  nativeCurrency: { name: "USD Coin", symbol: "USDC", decimals: 18 },
  rpcUrls: { default: { http: [ARC_RPC_URL] } },
  blockExplorers: { default: { name: "Arc Explorer", url: ARC_EXPLORER } },
});
