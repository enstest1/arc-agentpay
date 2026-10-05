"use client";

import { useEffect, useState } from "react";

type ReceiptData = {
  status: string;
  blockNumber: string;
  transactionHash: string;
  explorer: string;
  payment: null | { paymentId: string; payer: string; recipient: string; amount: string; memoHash: string; timestamp: string };
};

export function ReceiptView({ txHash }: { txHash: string }) {
  const [data, setData] = useState<ReceiptData | null>(null);
  const [error, setError] = useState("");
  const [human, setHuman] = useState({ id: "", memo: "" });

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    setHuman({ id: q.get("id") || "", memo: q.get("memo") || "" });
    fetch(`/api/receipt/${txHash}`).then(async r => {
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Receipt unavailable");
      setData(j);
    }).catch(e => setError(e.message));
  }, [txHash]);

  if (error) return <div className="card receipt"><div className="error">{error}</div></div>;
  if (!data) return <div className="card receipt"><span className="status-pill"><span className="dot" />Reading Arc receipt…</span></div>;

  const timestamp = data.payment ? new Date(Number(data.payment.timestamp) * 1000).toLocaleString() : "—";
  return (
    <article className="card receipt">
      <div className="receipt-top">
        <div><span className="kicker">PAYMENT VERIFIED</span><div className="receipt-amount">{data.payment?.amount || "—"} USDC</div></div>
        <span className="status-pill"><span className="dot" />{data.status}</span>
      </div>
      <dl className="receipt-grid">
        <dt>Task</dt><dd>{human.id || data.payment?.paymentId || "—"}</dd>
        <dt>Memo</dt><dd>{human.memo || "Stored as hash"}</dd>
        <dt>From</dt><dd className="mono">{data.payment?.payer || "—"}</dd>
        <dt>To</dt><dd className="mono">{data.payment?.recipient || "—"}</dd>
        <dt>Network</dt><dd>Arc Mainnet · Chain 5042</dd>
        <dt>Timestamp</dt><dd>{timestamp}</dd>
        <dt>Block</dt><dd>{data.blockNumber}</dd>
        <dt>Transaction</dt><dd className="mono">{data.transactionHash}</dd>
        <dt>Memo hash</dt><dd className="mono">{data.payment?.memoHash || "—"}</dd>
      </dl>
      <div style={{height:24}} />
      <a className="button secondary" href={data.explorer} target="_blank" rel="noreferrer">View on Arc Explorer</a>
    </article>
  );
}
