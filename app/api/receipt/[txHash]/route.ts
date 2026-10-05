import { NextResponse } from "next/server";
import { createPublicClient, decodeEventLog, formatUnits, http } from "viem";
import { arc, ARC_EXPLORER, ARC_RPC_URL } from "@/lib/arc";
import { agentPayAbi } from "@/lib/abi";

export async function GET(_: Request, { params }: { params: Promise<{ txHash: string }> }) {
  try {
    const { txHash } = await params;
    if (!/^0x[a-fA-F0-9]{64}$/.test(txHash)) return NextResponse.json({ error: "Invalid transaction hash" }, { status: 400 });
    const client = createPublicClient({ chain: arc, transport: http(ARC_RPC_URL) });
    const receipt = await client.getTransactionReceipt({ hash: txHash as `0x${string}` });
    const contract = process.env.NEXT_PUBLIC_AGENTPAY_CONTRACT?.toLowerCase();
    let payment = null as null | Record<string, string>;
    for (const log of receipt.logs) {
      if (contract && log.address.toLowerCase() !== contract) continue;
      try {
        const decoded = decodeEventLog({ abi: agentPayAbi, data: log.data, topics: log.topics });
        if (decoded.eventName === "PaymentSettled") {
          const args = decoded.args;
          payment = { paymentId: args.paymentId, payer: args.payer, recipient: args.recipient, amount: formatUnits(args.amount, 6), memoHash: args.memoHash, timestamp: args.timestamp.toString() };
          break;
        }
      } catch { /* ignore non-AgentPay logs */ }
    }
    return NextResponse.json({ status: receipt.status, blockNumber: receipt.blockNumber.toString(), transactionHash: receipt.transactionHash, explorer: `${ARC_EXPLORER}/tx/${receipt.transactionHash}`, payment });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Receipt unavailable" }, { status: 404 });
  }
}
