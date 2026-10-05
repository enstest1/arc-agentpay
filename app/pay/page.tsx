import { Nav } from "@/components/Nav";
import { PaymentForm } from "@/components/PaymentForm";

export default function PayPage() {
  return <main><Nav /><section className="container page"><div className="page-head"><span className="kicker">SETTLE ON ARC</span><h1>Send a verified payment.</h1><p>Attach a task identity and memo to a USDC settlement. The recipient receives USDC directly; the registry emits the proof.</p></div><PaymentForm /></section></main>;
}
