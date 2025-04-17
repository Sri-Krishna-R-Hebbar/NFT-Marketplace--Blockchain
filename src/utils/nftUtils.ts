
import { NFT } from '@/components/NFTCard';
import { ethers } from 'ethers';

// In a real application, we would connect to a smart contract
// For this demo, we'll use localStorage to simulate persistence

// Storage key for the NFT data
const STORAGE_KEY = 'nft_marketplace_data';

// Initialize localStorage with empty array if it doesn't exist
const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  }
};

// Get all NFTs from storage
const getAllNFTs = (): NFT[] => {
  initializeStorage();
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

// Save NFTs to storage
const saveNFTs = (nfts: NFT[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nfts));
};

// Fetch available NFTs for the marketplace
export const fetchAvailableNFTs = async (): Promise<NFT[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const nfts = getAllNFTs();
  return nfts.filter(nft => nft.available);
};

// Fetch NFTs owned by a specific address
export const fetchMyNFTs = async (address: string): Promise<NFT[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (!address) {
    return [];
  }
  
  const nfts = getAllNFTs();
  return nfts.filter(nft => nft.owner.toLowerCase() === address.toLowerCase());
};

// Buy an NFT
export const buyNFT = async (id: string, buyerAddress: string): Promise<void> => {
  if (!buyerAddress) {
    throw new Error('Wallet not connected');
  }
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const nfts = getAllNFTs();
  const updatedNFTs = nfts.map(nft => {
    if (nft.id === id) {
      return {
        ...nft,
        available: false,
        owner: buyerAddress,
      };
    }
    return nft;
  });
  
  saveNFTs(updatedNFTs);
};

// Mint a new NFT
export interface MintNFTParams {
  name: string;
  description: string;
  image: string;
  price: string;
}

export const mintNFT = async (params: MintNFTParams): Promise<void> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const nfts = getAllNFTs();
  const newId = (nfts.length + 1).toString();
  
  const newNFT: NFT = {
    id: newId,
    name: params.name,
    description: params.description,
    image: params.image,
    price: ethers.utils.parseEther(params.price).toString(),
    available: true,
    owner: '', // Initial owner is empty (not yet purchased)
  };
  
  saveNFTs([...nfts, newNFT]);
};

// Get current connected wallet address
export const getCurrentWalletAddress = async (): Promise<string> => {
  const { ethereum } = window as any;
  if (!ethereum) {
    return '';
  }
  
  try {
    const accounts = await ethereum.request({ method: 'eth_accounts' });
    if (accounts.length > 0) {
      return accounts[0];
    }
    return '';
  } catch (error) {
    console.error('Error getting wallet address:', error);
    return '';
  }
};
