
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { getCurrentWalletAddress } from '@/utils/nftUtils';
import { mintNFTOnContract } from '@/utils/contractUtils';

const MintNFT = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [price, setPrice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const getAddress = async () => {
      const address = await getCurrentWalletAddress();
      setWalletAddress(address);
    };
    
    getAddress();
    
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!walletAddress) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to mint an NFT",
        variant: "destructive",
      });
      return;
    }
    
    if (!name || !description || !image || !price) {
      toast({
        title: "Missing fields",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Call contract to mint NFT
      const txHash = await mintNFTOnContract(name, description, image, price);
      
      toast({
        title: "Success!",
        description: `Your NFT has been minted successfully! Transaction hash: ${txHash.substring(0, 10)}...`,
      });
      
      // Redirect to marketplace
      navigate('/');
    } catch (error) {
      console.error("Failed to mint NFT:", error);
      toast({
        title: "Minting Failed",
        description: "Unable to mint your NFT. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!walletAddress) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">
          <span className="text-nft-primary">Mint</span> NFT
        </h1>
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-xl text-nft-muted mb-4">Please connect your wallet to mint an NFT</p>
          <p className="text-sm text-nft-muted">Click on "Connect Wallet" in the navigation bar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        <span className="text-nft-primary">Mint</span> NFT
      </h1>
      
      <div className="max-w-md mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">NFT Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Awesome NFT"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your NFT..."
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="image">Image URL</Label>
            <Input
              id="image"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://example.com/my-nft-image.png"
              required
            />
            
            {image && (
              <div className="mt-2 aspect-square max-h-48 overflow-hidden rounded-lg">
                <img 
                  src={image} 
                  alt="NFT Preview" 
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/400x400?text=Invalid+Image+URL';
                  }}
                />
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="price">Price (ETH)</Label>
            <Input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.05"
              step="0.0001"
              min="0.0001"
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin mr-2">⚙️</span>
                Minting...
              </>
            ) : (
              'Mint NFT'
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default MintNFT;
