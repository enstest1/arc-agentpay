const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AgentPaymentRegistry", function () {
  it("deploys with zero payments", async function () {
    const Factory = await ethers.getContractFactory("AgentPaymentRegistry");
    const registry = await Factory.deploy();
    expect(await registry.paymentCount()).to.equal(0n);
  });
  it("rejects zero recipient before touching USDC", async function () {
    const Factory = await ethers.getContractFactory("AgentPaymentRegistry");
    const registry = await Factory.deploy();
    await expect(registry.pay(ethers.ZeroAddress, 1n, ethers.id("x"), ethers.id("m"))).to.be.revertedWithCustomError(registry, "ZeroRecipient");
  });
});
