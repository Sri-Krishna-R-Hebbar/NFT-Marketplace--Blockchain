
import { ethers } from 'ethers';
import NFTMarketplaceABI from '../abis/NFTMarketplace.json';

// This should be updated with your deployed contract address
let contractAddress = '';

// Function to set contract address after deployment
export const setContractAddress = (address: string) => {
  contractAddress = address;
};

// Get contract instance
export const getContractInstance = async (withSigner = false) => {
  if (!contractAddress) {
    throw new Error("Contract address not set. Please deploy the contract first.");
  }

  if (!window.ethereum) {
    throw new Error("MetaMask is not installed. Please install MetaMask to use this feature.");
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  
  if (withSigner) {
    const signer = provider.getSigner();
    return new ethers.Contract(contractAddress, NFTMarketplaceABI, signer);
  }

  return new ethers.Contract(contractAddress, NFTMarketplaceABI, provider);
};

// Upload metadata to IPFS (in a real app)
// For this demo, we'll simulate by creating a JSON object
export const createMetadata = (name: string, description: string, image: string) => {
  // In a real app, you would upload this to IPFS and get back an IPFS URI
  return JSON.stringify({
    name,
    description,
    image
  });
};

// Mint NFT function
export const mintNFTOnContract = async (
  name: string,
  description: string,
  image: string,
  price: string
) => {
  try {
    // Get contract with signer
    const contract = await getContractInstance(true);
    
    // Create metadata
    const metadata = createMetadata(name, description, image);
    
    // Convert price to wei
    const priceInWei = ethers.utils.parseEther(price);
    
    // Call the contract's createNFTItem function
    const tx = await contract.createNFTItem(metadata, priceInWei);
    
    // Wait for transaction to be mined
    await tx.wait();
    
    return tx.hash;
  } catch (error) {
    console.error("Error minting NFT on blockchain:", error);
    throw error;
  }
};

// Buy NFT function
export const buyNFTOnContract = async (tokenId: string, price: string) => {
  try {
    // Get contract with signer
    const contract = await getContractInstance(true);
    
    // Convert price to wei
    const priceInWei = ethers.utils.parseEther(price);
    
    // Call the contract's purchaseNFT function
    const tx = await contract.purchaseNFT(tokenId, {
      value: priceInWei
    });
    
    // Wait for transaction to be mined
    await tx.wait();
    
    return tx.hash;
  } catch (error) {
    console.error("Error buying NFT on blockchain:", error);
    throw error;
  }
};

// Get available NFTs
export const getAvailableNFTsFromContract = async () => {
  try {
    const contract = await getContractInstance();
    const items = await contract.fetchMarketItems();
    return items;
  } catch (error) {
    console.error("Error fetching NFTs from contract:", error);
    throw error;
  }
};

// Get my NFTs
export const getMyNFTsFromContract = async () => {
  try {
    const contract = await getContractInstance(true);
    const items = await contract.fetchMyNFTs();
    return items;
  } catch (error) {
    console.error("Error fetching my NFTs from contract:", error);
    throw error;
  }
};
