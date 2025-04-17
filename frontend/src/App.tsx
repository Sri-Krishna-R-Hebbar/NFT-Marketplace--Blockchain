
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Marketplace from "./pages/Marketplace";
import MintNFT from "./pages/MintNFT";
import MyNFTs from "./pages/MyNFTs";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import { loadContractConfig } from "./utils/configLoader";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Load the contract config on app startup
    loadContractConfig().then(success => {
      if (!success) {
        console.warn("Contract configuration not found. Some features may not work correctly.");
      }
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Marketplace />} />
                <Route path="/mint" element={<MintNFT />} />
                <Route path="/my-nfts" element={<MyNFTs />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
