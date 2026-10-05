# Arc AgentPay

**Non-custodial USDC settlement for humans and autonomous agents on Arc.**

Arc AgentPay lets a wallet or software agent pay USDC on Arc, attach a task identity, and create a machine-readable onchain receipt. The registry never takes custody: it uses Arc's native USDC ERC-20 interface to move funds directly from payer to recipient and emits a `PaymentSettled` event.

## Why Arc

Arc is built for real-time money movement and agentic economic activity. USDC is the native gas asset, while the ERC-20 USDC interface is available at `0x3600000000000000000000000000000000000000`. Arc Mainnet chain ID is `5042`.

## Features

- Direct USDC settlement on Arc Mainnet
- Non-custodial Solidity registry
- Onchain task/payment identity and memo hash
- Human-friendly receipt pages
- `POST /api/pay-intent` for autonomous agents
- `GET /api/receipt/:txHash` for machine verification
- No server-held private keys
- Browser wallet flow with Arc network switching
- Automatic allowance check and USDC approval when required

## Architecture

```text
Human / Agent
     |
     | payment intent
     v
Arc AgentPay UI/API
     |
     | calldata + user/agent signature
     v
AgentPaymentRegistry
     |
     | transferFrom(payer -> recipient)
     v
Arc USDC predeploy
     |
     +--> PaymentSettled event --> receipt page/API
```

## Mainnet configuration

| Item | Value |
|---|---|
| Chain | Arc Mainnet |
| Chain ID | `5042` |
| RPC | `https://rpc.mainnet.arc.io` |
| Explorer | `https://explorer.arc.io` |
| USDC ERC-20 | `0x3600000000000000000000000000000000000000` |
| USDC decimals | `6` |

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Contract

Compile and test:

```bash
npm run contract:compile
npm run contract:test
```

Deploy to Arc testnet first:

```bash
# Put PRIVATE_KEY in .env locally. Never commit it.
npm run contract:deploy:testnet
```

Then set the deployed address:

```env
NEXT_PUBLIC_AGENTPAY_CONTRACT=0x...
```

After validation, deploy to Arc Mainnet:

```bash
npm run contract:deploy:mainnet
```

## Agent API

`POST /api/pay-intent`

```json
{
  "recipient": "0x...",
  "amount": "2.50",
  "paymentId": "research-1042",
  "memo": "Research report completed"
}
```

The response contains allowance/approval metadata and encoded transaction calldata. The agent signs with its own wallet. This design intentionally keeps signing keys out of the web server.

## Suggested agent-side rules

Before signing, agents should enforce:

- maximum amount per payment
- rolling/daily spend limit
- recipient allowlist
- mandatory unique task ID
- optional human approval above a threshold

## Security model

- Contract does not custody funds.
- No admin withdrawal function exists.
- Duplicate `paymentId` hashes are rejected globally.
- Server never needs a wallet private key for runtime use.
- UI checks balance and allowance before settlement.
- Mainnet use should still be treated as experimental until independent review.

## Grant demo checklist

- [ ] Contract deployed to Arc Mainnet
- [ ] `NEXT_PUBLIC_AGENTPAY_CONTRACT` configured
- [ ] Production website live
- [ ] At least 3 real low-value USDC settlements
- [ ] Public receipt URLs captured
- [ ] Public GitHub repository
- [ ] 30–60 second demo recording
- [ ] Arc Microgrant submission

## License

MIT
