
import { NFT } from '@/components/NFTCard';
import { ethers } from 'ethers';

// In a real application, we would connect to a smart contract
// For this demo, we'll use mock data and localStorage to simulate persistence

// Sample NFT data
const sampleNFTs: NFT[] = [
  {
    id: '1',
    name: 'Cosmic Voyager',
    description: 'A journey through the stars and beyond the limits of human imagination.',
    image: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
    price: ethers.utils.parseEther('0.05').toString(),
    available: true,
    owner: '',
  },
  {
    id: '2',
    name: 'Digital Dreamscape',
    description: 'A surreal landscape created from digital fragments of consciousness.',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1064&q=80',
    price: ethers.utils.parseEther('0.08').toString(),
    available: true,
    owner: '',
  },
  {
    id: '3',
    name: 'Pixel Panther',
    description: 'A fierce digital predator, stalking through the blockchain jungle.',
    image: 'https://images.unsplash.com/photo-1508808703878-f28e5c419319?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1089&q=80',
    price: ethers.utils.parseEther('0.1').toString(),
    available: true,
    owner: '',
  },
];

// In a real app, we'd use a real backend service to store and retrieve data
// For this demo, we'll use localStorage to persist data between sessions
const STORAGE_KEY = 'nft_marketplace_data';

// Initialize localStorage with sample data if it doesn't exist
const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleNFTs));
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
  
  const nfts = getAllNFTs();
  return nfts.filter(nft => nft.owner.toLowerCase() === address.toLowerCase());
};

// Buy an NFT
export const buyNFT = async (id: string): Promise<void> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const nfts = getAllNFTs();
  const updatedNFTs = nfts.map(nft => {
    if (nft.id === id) {
      return {
        ...nft,
        available: false,
        owner: '0x1234...', // This would be the buyer's address in a real app
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

// Note: In a real application, these functions would interact with a smart contract
// and possibly a backend service for data storage and retrieval from an actual CSV file
// or database. This is a simplified version for demonstration purposes.
