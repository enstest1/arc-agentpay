import { Nav } from "@/components/Nav";
import { ReceiptView } from "@/components/ReceiptView";

export default async function ReceiptPage({ params }: { params: Promise<{ txHash: string }> }) {
  const { txHash } = await params;
  return <main><Nav /><section className="container page"><div className="page-head"><span className="kicker">ONCHAIN RECEIPT</span><h1>Settlement proof.</h1><p>Decoded directly from the Arc transaction receipt and AgentPay event.</p></div><ReceiptView txHash={txHash} /></section></main>;
}
