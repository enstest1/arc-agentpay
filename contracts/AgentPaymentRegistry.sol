// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IERC20Minimal {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

/// @title Arc AgentPay Registry
/// @notice Non-custodial USDC settlement with machine-readable onchain receipts.
contract AgentPaymentRegistry {
    address public constant USDC = 0x3600000000000000000000000000000000000000;
    uint256 public paymentCount;
    mapping(bytes32 => bool) public usedPaymentIds;

    event PaymentSettled(
        bytes32 indexed paymentId,
        address indexed payer,
        address indexed recipient,
        uint256 amount,
        bytes32 memoHash,
        uint256 timestamp
    );

    error ZeroRecipient();
    error ZeroAmount();
    error PaymentIdAlreadyUsed();
    error TransferFailed();

    function pay(address recipient, uint256 amount, bytes32 paymentId, bytes32 memoHash) external {
        if (recipient == address(0)) revert ZeroRecipient();
        if (amount == 0) revert ZeroAmount();
        if (usedPaymentIds[paymentId]) revert PaymentIdAlreadyUsed();

        usedPaymentIds[paymentId] = true;
        bool ok = IERC20Minimal(USDC).transferFrom(msg.sender, recipient, amount);
        if (!ok) revert TransferFailed();

        unchecked { ++paymentCount; }
        emit PaymentSettled(paymentId, msg.sender, recipient, amount, memoHash, block.timestamp);
    }
}
