export const agentPayAbi = [
  {
    type: "function",
    name: "pay",
    stateMutability: "nonpayable",
    inputs: [
      { name: "recipient", type: "address" },
      { name: "amount", type: "uint256" },
      { name: "paymentId", type: "bytes32" },
      { name: "memoHash", type: "bytes32" },
    ],
    outputs: [],
  },
  {
    type: "event",
    name: "PaymentSettled",
    anonymous: false,
    inputs: [
      { indexed: true, name: "paymentId", type: "bytes32" },
      { indexed: true, name: "payer", type: "address" },
      { indexed: true, name: "recipient", type: "address" },
      { indexed: false, name: "amount", type: "uint256" },
      { indexed: false, name: "memoHash", type: "bytes32" },
      { indexed: false, name: "timestamp", type: "uint256" },
    ],
  },
] as const;

export const erc20Abi = [
  { type: "function", name: "approve", stateMutability: "nonpayable", inputs: [{ name: "spender", type: "address" }, { name: "amount", type: "uint256" }], outputs: [{ type: "bool" }] },
  { type: "function", name: "allowance", stateMutability: "view", inputs: [{ name: "owner", type: "address" }, { name: "spender", type: "address" }], outputs: [{ type: "uint256" }] },
  { type: "function", name: "balanceOf", stateMutability: "view", inputs: [{ name: "account", type: "address" }], outputs: [{ type: "uint256" }] },
] as const;
