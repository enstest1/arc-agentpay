import { encodeFunctionData, keccak256, parseUnits, stringToHex } from "viem";
import { agentPayAbi } from "./abi";

export function toBytes32Text(value: string) {
  return keccak256(stringToHex(value.trim()));
}

export function makePaymentCall(input: { contract: `0x${string}`; recipient: `0x${string}`; amount: string; paymentId: string; memo?: string }) {
  const amount = parseUnits(input.amount, 6);
  const paymentId = toBytes32Text(input.paymentId);
  const memoHash = toBytes32Text(input.memo || "");
  return {
    to: input.contract,
    value: 0n,
    data: encodeFunctionData({ abi: agentPayAbi, functionName: "pay", args: [input.recipient, amount, paymentId, memoHash] }),
    amount,
    paymentId,
    memoHash,
  };
}
