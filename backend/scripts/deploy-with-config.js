
const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Starting deployment process...");
  
  // Get the contract factory
  const NFTMarketplace = await hre.ethers.getContractFactory("NFTMarketplace");
  console.log("Contract factory created...");

  // Deploy the contract
  const nftMarketplace = await NFTMarketplace.deploy();
  console.log("Deploying contract...");

  // Wait for deployment to finish
  await nftMarketplace.deployed();
  
  console.log("Contract deployed to:", nftMarketplace.address);

  // Create a configuration file with the contract address
  const config = {
    contractAddress: nftMarketplace.address,
    network: hre.network.name,
    timestamp: new Date().toISOString()
  };

  // Write the contract address to a file (that will be used by the frontend)
  const configDir = path.join(__dirname, '../../frontend/src/contract-config');
  const configPath = path.join(configDir, 'config.json');
  
  // Make sure the directory exists
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }
  
  fs.writeFileSync(
    configPath,
    JSON.stringify(config, null, 2)
  );
  
  console.log("Contract configuration saved to:", configPath);
  console.log("Remember to add this contract address to your frontend configuration!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
