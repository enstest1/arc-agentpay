import Link from "next/link";

export function Nav() {
  return (
    <header className="nav-wrap">
      <nav className="nav container">
        <Link className="brand" href="/">
          <span className="mark">A</span>
          <span>Arc AgentPay</span>
        </Link>
        <div className="nav-links">
          <Link href="/pay">Pay</Link>
          <Link href="/docs">API</Link>
          <a href="https://explorer.arc.io" target="_blank" rel="noreferrer">Explorer</a>
        </div>
      </nav>
    </header>
  );
}
