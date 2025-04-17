
import { setContractAddress } from './contractUtils';

// Try to load the contract config
export const loadContractConfig = async () => {
  try {
    // Import the contract config
    const config = await import('../contract-config/config.json');
    
    if (config.contractAddress) {
      console.log('Contract address loaded:', config.contractAddress);
      setContractAddress(config.contractAddress);
      return true;
    } else {
      console.error('No contract address found in config');
      return false;
    }
  } catch (error) {
    console.error('Failed to load contract config:', error);
    return false;
  }
};
