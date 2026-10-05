import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Arc AgentPay — USDC settlement for autonomous agents",
  description: "Non-custodial USDC payments on Arc with verifiable onchain receipts and machine-ready payment intents.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
