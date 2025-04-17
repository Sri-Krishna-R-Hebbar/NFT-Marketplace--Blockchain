
import React, { useState, useEffect } from 'react';
import NFTGrid from '@/components/NFTGrid';
import { NFT } from '@/components/NFTCard';
import { useToast } from '@/components/ui/use-toast';
import { fetchMyNFTs } from '@/utils/nftUtils';

const MyNFTs = () => {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadMyNFTs = async () => {
      try {
        setLoading(true);
        // In a real app, we would pass the current wallet address
        const myNFTs = await fetchMyNFTs('0x1234...'); // Dummy address
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
  }, [toast]);

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
