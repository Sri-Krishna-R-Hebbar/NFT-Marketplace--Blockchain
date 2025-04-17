
import React from 'react';
import NFTCard, { NFT } from './NFTCard';

interface NFTGridProps {
  nfts: NFT[];
  onBuyNFT?: (id: string) => void;
  showBuyButton?: boolean;
  emptyMessage?: string;
}

const NFTGrid: React.FC<NFTGridProps> = ({ 
  nfts, 
  onBuyNFT, 
  showBuyButton = true,
  emptyMessage = "No NFTs found" 
}) => {
  if (nfts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-xl text-nft-muted">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {nfts.map((nft) => (
        <NFTCard 
          key={nft.id} 
          nft={nft} 
          onBuy={onBuyNFT}
          showBuyButton={showBuyButton}
        />
      ))}
    </div>
  );
};

export default NFTGrid;
