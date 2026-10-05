import { Nav } from "@/components/Nav";

export default function DocsPage() {
  return (
    <main><Nav /><section className="container page docs">
      <div className="page-head"><span className="kicker">AGENT API</span><h1>Machine-ready settlement.</h1><p>The API creates a validated Arc transaction intent. Your agent keeps custody of its signing key and broadcasts the transaction itself.</p></div>
      <h2>1. Create an intent</h2>
      <pre className="code">{`curl -X POST https://YOUR-DOMAIN/api/pay-intent \\\n  -H "content-type: application/json" \\\n  -d '{\n    "recipient":"0x...",\n    "amount":"2.50",\n    "paymentId":"research-1042",\n    "memo":"Research report completed"\n  }'`}</pre>
      <h2>2. Response</h2>
      <pre className="code">{`{\n  "status": "ready_to_sign",\n  "chainId": 5042,\n  "token": { "symbol": "USDC", "decimals": 6 },\n  "approval": { "spender": "0xREGISTRY...", "amount": "2500000" },\n  "transaction": { "to": "0xREGISTRY...", "data": "0x...", "value": "0" }\n}`}</pre>
      <h2>3. Agent policy</h2>
      <p className="muted">The reference integration should enforce limits before calling the API: maximum per payment, daily allowance, recipient allowlist and mandatory task IDs. AgentPay deliberately does not store or receive private keys.</p>
      <h2>4. Verify a receipt</h2>
      <pre className="code">{`GET /api/receipt/0xTRANSACTION_HASH`}</pre>
      <p className="muted">The receipt endpoint reads Arc directly and decodes the <span className="mono">PaymentSettled</span> event. No private indexer is required for verification.</p>
    </section></main>
  );
}
