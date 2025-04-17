
import React from 'react';
import { Button } from '@/components/ui/button';
import { ethers } from 'ethers';

export interface NFT {
  id: string;
  name: string;
  description: string;
  image: string;
  price: string;
  available: boolean;
  owner: string;
}

interface NFTCardProps {
  nft: NFT;
  onBuy?: (id: string) => void;
  showBuyButton?: boolean;
}

const NFTCard: React.FC<NFTCardProps> = ({ nft, onBuy, showBuyButton = true }) => {
  return (
    <div className="nft-card flex flex-col h-full">
      {/* NFT Image */}
      <div className="relative aspect-square overflow-hidden">
        <img 
          src={nft.image} 
          alt={nft.name} 
          className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://via.placeholder.com/400x400?text=NFT+Image';
          }}
        />
      </div>

      {/* NFT Details */}
      <div className="flex flex-col flex-grow p-4">
        <h3 className="text-lg font-semibold truncate">{nft.name}</h3>
        <p className="text-sm text-nft-muted line-clamp-2 mb-4 flex-grow">{nft.description}</p>
        
        <div className="flex items-center justify-between mt-auto">
          <div className="text-nft-primary font-bold">
            {ethers.utils.formatEther(nft.price)} ETH
          </div>
          
          {showBuyButton && nft.available ? (
            <Button 
              className="nft-button"
              onClick={() => onBuy && onBuy(nft.id)}
            >
              Buy Now
            </Button>
          ) : showBuyButton ? (
            <Button disabled className="nft-button bg-gray-400">
              Sold
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default NFTCard;
