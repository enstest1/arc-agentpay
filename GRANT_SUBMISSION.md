# Arc Microgrant Submission Draft — Arc AgentPay

## Project name
Arc AgentPay

## One-line description
Non-custodial USDC settlement for humans and autonomous agents with verifiable onchain receipts on Arc.

## What it does
Arc AgentPay lets a human or software agent send USDC to a recipient, attach a unique task/payment identifier, and create a permanent onchain receipt. The registry never holds funds: Arc USDC moves directly from payer to recipient via `transferFrom`, while the contract emits a `PaymentSettled` event containing the payment identity, payer, recipient, amount, memo hash, and timestamp.

The web app handles Arc network switching, allowance checks, approval when required, settlement, and receipt rendering. The machine API returns deterministic transaction calldata so an autonomous agent can enforce its own spending rules and sign from its own wallet without sharing private keys with the application server.

## Why Arc
Arc is purpose-built for real-time money movement and agentic economic activity. USDC as both gas and settlement asset gives agents a single dollar-denominated operating balance instead of requiring a separate gas token. AgentPay is deliberately built around Arc's native USDC model rather than treating Arc as a generic EVM deployment target.

## Arc integration
- Arc Mainnet chain ID: 5042
- Arc Mainnet RPC: https://rpc.mainnet.arc.io
- Native USDC ERC-20 interface: 0x3600000000000000000000000000000000000000
- Solidity settlement registry deployed directly to Arc Mainnet
- Browser and agent flows use standard EVM tooling while settling in USDC

## Current features
- Non-custodial USDC settlement
- Unique task/payment IDs
- Hashed payment memo
- Onchain `PaymentSettled` receipts
- Browser wallet Arc switching
- Automatic balance and allowance checks
- Machine-oriented `POST /api/pay-intent`
- Human-readable receipt pages/API
- No server-held signing keys

## Live demo
https://arc-agentpay.up.railway.app

## Public repository
TO ADD AFTER PUBLIC GITHUB REPOSITORY IS CREATED

## Mainnet contract
TO ADD AFTER WALLET-SIGNED DEPLOYMENT

## Builder
Christopher Tomich / pelpa

## Next milestones
1. Add policy modules for per-payment and daily agent spending limits.
2. Add allowlisted recipients and human approval thresholds.
3. Add reusable SDK/MCP examples for AI agents.
4. Add indexed agent payment history and analytics.
