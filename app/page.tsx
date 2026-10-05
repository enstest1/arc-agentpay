import Link from "next/link";
import { Nav } from "@/components/Nav";
import { StatusPill } from "@/components/StatusPill";

export default function Home() {
  return (
    <main>
      <Nav />
      <section className="hero container">
        <div className="eyebrow"><StatusPill>Built for Arc Mainnet</StatusPill></div>
        <h1>USDC settlement<br />for autonomous agents.</h1>
        <p className="hero-copy">Arc AgentPay gives humans and software agents a clean way to settle USDC, attach a task identity, and produce a permanent machine-readable receipt on Arc.</p>
        <div className="actions">
          <Link className="button primary" href="/pay">Launch app</Link>
          <Link className="button secondary" href="/docs">Read the API</Link>
        </div>
        <div className="metrics">
          <div><strong>5042</strong><span>Arc chain ID</span></div>
          <div><strong>USDC</strong><span>Settlement + gas</span></div>
          <div><strong>Non-custodial</strong><span>Funds never sit with us</span></div>
        </div>
      </section>

      <section className="container grid three">
        <article className="card feature"><span className="kicker">01 / SETTLE</span><h2>One payment primitive</h2><p>Approve once, then settle USDC directly from payer to recipient through a purpose-built Arc contract.</p></article>
        <article className="card feature"><span className="kicker">02 / PROVE</span><h2>Verifiable receipts</h2><p>Every payment emits task ID, payer, recipient, amount, memo hash and timestamp for durable onchain proof.</p></article>
        <article className="card feature"><span className="kicker">03 / AUTOMATE</span><h2>Agent-ready API</h2><p>Software agents request validated calldata from the API and sign from their own wallet under explicit spending rules.</p></article>
      </section>

      <section className="container split section-pad">
        <div>
          <span className="kicker">DESIGNED FOR MACHINES</span>
          <h2 className="section-title">A receipt your agent can understand.</h2>
          <p className="muted">No proprietary database is required to prove settlement. The transaction and payment event are the source of truth.</p>
        </div>
        <div className="terminal card">
          <div className="terminal-head"><span /> <span /> <span /></div>
          <pre>{`POST /api/pay-intent\n\n{\n  "recipient": "0x42...19F",\n  "amount": "2.50",\n  "paymentId": "research-1042",\n  "memo": "report complete"\n}\n\n→ chainId: 5042\n→ token: USDC\n→ status: ready_to_sign`}</pre>
        </div>
      </section>

      <footer className="container footer">Arc AgentPay · Built on Arc · No custody · No token</footer>
    </main>
  );
}
