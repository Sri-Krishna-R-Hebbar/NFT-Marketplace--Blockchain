
import React from 'react';
import { Link } from 'react-router-dom';
import { Wallet, Plus, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  // In a real app, we would check if wallet is connected
  const [walletConnected, setWalletConnected] = React.useState(false);

  const connectWallet = () => {
    // This would connect to the actual wallet in a real implementation
    setWalletConnected(true);
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
          <span>{walletConnected ? '0x1a2...3b4c' : 'Connect Wallet'}</span>
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
