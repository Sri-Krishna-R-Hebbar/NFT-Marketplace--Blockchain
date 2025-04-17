
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Wallet, Plus, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const Navbar = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    // Check if MetaMask is already connected
    checkIfWalletIsConnected();
  }, []);

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window as any;
      if (!ethereum) {
        return;
      }

      // Check if we're authorized to access the user's wallet
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      
      if (accounts.length !== 0) {
        setWalletConnected(true);
        setWalletAddress(accounts[0]);
      }
    } catch (error) {
      console.error('Error checking if wallet is connected:', error);
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window as any;
      if (!ethereum) {
        toast({
          title: "MetaMask not installed",
          description: "Please install MetaMask to use this feature",
          variant: "destructive",
        });
        return;
      }

      // Request account access
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      
      setWalletConnected(true);
      setWalletAddress(accounts[0]);
      
      toast({
        title: "Wallet connected",
        description: "Your wallet has been successfully connected!",
      });
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast({
        title: "Connection failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Format address for display (0x1234...5678)
  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <nav className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
      <div className="container flex items-center justify-between py-4 mx-auto">
        {/* Logo and site name */}
        <Link to="/" className="flex items-center space-x-2">
          <ShoppingBag className="w-8 h-8 text-nft-primary" />
          <span className="text-xl font-bold text-nft-text">NFT Marketplace</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden space-x-6 md:flex">
          <Link to="/" className="text-nft-text hover:text-nft-primary transition-colors">
            Marketplace
          </Link>
          <Link to="/mint" className="text-nft-text hover:text-nft-primary transition-colors">
            Mint NFT
          </Link>
          <Link to="/my-nfts" className="text-nft-text hover:text-nft-primary transition-colors">
            My NFTs
          </Link>
        </div>

        {/* Wallet Connection Button */}
        <Button 
          variant="outline" 
          className={`flex items-center space-x-2 ${walletConnected ? 'border-green-500 text-green-500' : 'border-nft-primary text-nft-primary'}`}
          onClick={connectWallet}
        >
          <Wallet className="w-4 h-4" />
          <span>{walletConnected ? formatAddress(walletAddress) : 'Connect Wallet'}</span>
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
