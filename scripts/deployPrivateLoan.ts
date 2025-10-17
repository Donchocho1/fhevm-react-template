import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Deploying PrivateLoan contract to Sepolia...");
  
  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  
  // Deploy with minimum credit score of 650 and max loan of 10 ETH
  const PrivateLoan = await ethers.getContractFactory("PrivateLoan");
  const privateLoan = await PrivateLoan.deploy(650, ethers.parseEther("10"));
  
  await privateLoan.waitForDeployment();
  const address = await privateLoan.getAddress();
  
  console.log("🎉 PrivateLoan successfully deployed!");
  console.log("📋 Contract Details:");
  console.log("   - Address:", address);
  console.log("   - Minimum Credit Score: 650");
  console.log("   - Maximum Loan Amount: 10 ETH");
  console.log("   - Lender:", await privateLoan.lender());
  console.log("   - Deployer:", deployer.address);
  
  // Verify on Etherscan (optional)
  console.log("\n🔍 To verify on Etherscan, run:");
  console.log(`npx hardhat verify --network sepolia ${address} 650 ${ethers.parseEther("10").toString()}`);
  
  return address;
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});
