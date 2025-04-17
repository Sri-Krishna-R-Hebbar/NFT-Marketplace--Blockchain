
import React, { useState, useEffect } from 'react';
import NFTGrid from '@/components/NFTGrid';
import { NFT } from '@/components/NFTCard';
import { useToast } from '@/components/ui/use-toast';
import { fetchMyNFTs, getCurrentWalletAddress } from '@/utils/nftUtils';

const MyNFTs = () => {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [walletAddress, setWalletAddress] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const initWallet = async () => {
      const address = await getCurrentWalletAddress();
      setWalletAddress(address);
    };
    
    initWallet();
    
    // Listen for account changes
    const handleAccountsChanged = (accounts: string[]) => {
      setWalletAddress(accounts.length > 0 ? accounts[0] : '');
    };
    
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }
    
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  useEffect(() => {
    const loadMyNFTs = async () => {
      if (!walletAddress) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const myNFTs = await fetchMyNFTs(walletAddress);
        setNfts(myNFTs);
      } catch (error) {
        console.error("Failed to load NFTs:", error);
        toast({
          title: "Error",
          description: "Failed to load your NFTs. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadMyNFTs();
  }, [walletAddress, toast]);

  if (!walletAddress) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">
          <span className="text-nft-primary">My</span> NFTs
        </h1>
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-xl text-nft-muted mb-4">Please connect your wallet to view your NFTs</p>
          <p className="text-sm text-nft-muted">Click on "Connect Wallet" in the navigation bar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        <span className="text-nft-primary">My</span> NFTs
      </h1>
      
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-16 h-16 border-4 border-nft-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <NFTGrid 
          nfts={nfts}
          showBuyButton={false}
          emptyMessage="You don't own any NFTs yet. Buy some from the marketplace!"
        />
      )}
    </div>
  );
};

export default MyNFTs;
