"use client";

import { useState } from "react";
import { createPublicClient, createWalletClient, custom, formatUnits, getAddress, http, parseUnits } from "viem";
import { arc, ARC_CHAIN_ID, ARC_EXPLORER, ARC_RPC_URL, ARC_USDC } from "@/lib/arc";
import { agentPayAbi, erc20Abi } from "@/lib/abi";
import { toBytes32Text } from "@/lib/payment";

const contract = process.env.NEXT_PUBLIC_AGENTPAY_CONTRACT as `0x${string}` | undefined;

type EthereumProvider = { request(args: { method: string; params?: unknown[] | object }): Promise<unknown> };

declare global { interface Window { ethereum?: EthereumProvider } }

export function PaymentForm() {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("2.50");
  const [paymentId, setPaymentId] = useState("research-1042");
  const [memo, setMemo] = useState("Research report completed");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function ensureArc(provider: EthereumProvider) {
    const hex = `0x${ARC_CHAIN_ID.toString(16)}`;
    try {
      await provider.request({ method: "wallet_switchEthereumChain", params: [{ chainId: hex }] });
    } catch (e: unknown) {
      const code = typeof e === "object" && e && "code" in e ? (e as { code?: number }).code : undefined;
      if (code !== 4902) throw e;
      await provider.request({
        method: "wallet_addEthereumChain",
        params: [{ chainId: hex, chainName: "Arc", nativeCurrency: { name: "USD Coin", symbol: "USDC", decimals: 18 }, rpcUrls: [ARC_RPC_URL], blockExplorerUrls: [ARC_EXPLORER] }],
      });
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setError(""); setStatus("");
    if (!contract) return setError("Contract deployment is not configured yet. Set NEXT_PUBLIC_AGENTPAY_CONTRACT after deployment.");
    if (!window.ethereum) return setError("No EVM wallet detected. Install a browser wallet or use a wallet-enabled browser.");
    if (!paymentId.trim()) return setError("Payment ID is required.");
    try {
      setBusy(true);
      const to = getAddress(recipient);
      const units = parseUnits(amount, 6);
      if (units <= 0n) throw new Error("Amount must be greater than zero.");

      await ensureArc(window.ethereum);
      const wallet = createWalletClient({ chain: arc, transport: custom(window.ethereum) });
      const [account] = await wallet.requestAddresses();
      const publicClient = createPublicClient({ chain: arc, transport: http(ARC_RPC_URL) });

      const balance = await publicClient.readContract({ address: ARC_USDC, abi: erc20Abi, functionName: "balanceOf", args: [account] });
      if (balance < units) throw new Error(`Insufficient USDC. Wallet balance: ${formatUnits(balance, 6)} USDC.`);

      const allowance = await publicClient.readContract({ address: ARC_USDC, abi: erc20Abi, functionName: "allowance", args: [account, contract] });
      if (allowance < units) {
        setStatus("Approval required — confirm USDC allowance in your wallet…");
        const approval = await wallet.writeContract({ account, address: ARC_USDC, abi: erc20Abi, functionName: "approve", args: [contract, units] });
        await publicClient.waitForTransactionReceipt({ hash: approval });
      }

      setStatus("Settle payment — confirm the Arc transaction…");
      const txHash = await wallet.writeContract({
        account,
        address: contract,
        abi: agentPayAbi,
        functionName: "pay",
        args: [to, units, toBytes32Text(paymentId), toBytes32Text(memo)],
      });
      setStatus("Payment submitted. Waiting for Arc finality…");
      await publicClient.waitForTransactionReceipt({ hash: txHash });
      window.location.assign(`/receipt/${txHash}?id=${encodeURIComponent(paymentId)}&memo=${encodeURIComponent(memo)}`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Payment failed.");
    } finally { setBusy(false); }
  }

  return (
    <form className="card form-card" onSubmit={submit}>
      <div className="field"><label>RECIPIENT</label><input required placeholder="0x…" value={recipient} onChange={(e) => setRecipient(e.target.value)} /></div>
      <div className="row">
        <div className="field"><label>AMOUNT (USDC)</label><input required inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} /></div>
        <div className="field"><label>PAYMENT / TASK ID</label><input required value={paymentId} onChange={(e) => setPaymentId(e.target.value)} /></div>
      </div>
      <div className="field"><label>MEMO</label><textarea value={memo} onChange={(e) => setMemo(e.target.value)} /></div>
      <div className="notice"><strong>Non-custodial.</strong> The registry calls Arc&apos;s USDC interface to move funds directly from your wallet to the recipient. Arc AgentPay never takes custody.</div>
      <div style={{height:14}} />
      <button className="button primary" type="submit" disabled={busy}>{busy ? "Working…" : "Pay on Arc"}</button>
      {status && <div className="success">{status}</div>}
      {error && <div className="error">{error}</div>}
    </form>
  );
}
