
import React, { useState, useEffect } from 'react';
import NFTGrid from '@/components/NFTGrid';
import { NFT } from '@/components/NFTCard';
import { useToast } from '@/components/ui/use-toast';
import { fetchAvailableNFTs, buyNFT } from '@/utils/nftUtils';

const Marketplace = () => {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadNFTs = async () => {
      try {
        setLoading(true);
        const availableNFTs = await fetchAvailableNFTs();
        setNfts(availableNFTs);
      } catch (error) {
        console.error("Failed to load NFTs:", error);
        toast({
          title: "Error",
          description: "Failed to load NFTs. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadNFTs();
  }, [toast]);

  const handleBuyNFT = async (id: string) => {
    try {
      // In a real app, this would connect to the blockchain
      await buyNFT(id);
      
      // Update the local state to reflect the purchase
      setNfts(prevNfts => prevNfts.filter(nft => nft.id !== id));
      
      toast({
        title: "Success!",
        description: "You've successfully purchased the NFT!",
      });
    } catch (error) {
      console.error("Failed to buy NFT:", error);
      toast({
        title: "Transaction Failed",
        description: "Unable to complete the purchase. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        <span className="text-nft-primary">NFT</span> Marketplace
      </h1>
      
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-16 h-16 border-4 border-nft-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <NFTGrid 
          nfts={nfts} 
          onBuyNFT={handleBuyNFT}
          emptyMessage="No NFTs available in the marketplace. Be the first to mint one!"
        />
      )}
    </div>
  );
};

export default Marketplace;
