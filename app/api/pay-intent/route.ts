import { NextRequest, NextResponse } from "next/server";
import { getAddress } from "viem";
import { ARC_CHAIN_ID, ARC_USDC } from "@/lib/arc";
import { makePaymentCall } from "@/lib/payment";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const contract = process.env.NEXT_PUBLIC_AGENTPAY_CONTRACT as `0x${string}` | undefined;
    if (!contract) return NextResponse.json({ error: "Contract not configured" }, { status: 503 });
    const amount = String(body.amount || "");
    const paymentId = String(body.paymentId || "").trim();
    const memo = String(body.memo || "");
    if (!paymentId) return NextResponse.json({ error: "paymentId is required" }, { status: 400 });
    if (!/^\d+(\.\d{1,6})?$/.test(amount) || Number(amount) <= 0) return NextResponse.json({ error: "amount must be a positive USDC amount with up to 6 decimals" }, { status: 400 });
    const recipient = getAddress(String(body.recipient));
    const call = makePaymentCall({ contract, recipient, amount, paymentId, memo });
    return NextResponse.json({
      status: "ready_to_sign",
      chainId: ARC_CHAIN_ID,
      token: { symbol: "USDC", address: ARC_USDC, decimals: 6 },
      approval: { token: ARC_USDC, spender: contract, amount: call.amount.toString() },
      transaction: { to: call.to, data: call.data, value: "0" },
      receiptIdentity: { paymentId: call.paymentId, memoHash: call.memoHash },
      note: "The caller must check allowance, approve USDC if required, then sign/broadcast transaction with its own Arc wallet.",
    });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Invalid request" }, { status: 400 });
  }
}
