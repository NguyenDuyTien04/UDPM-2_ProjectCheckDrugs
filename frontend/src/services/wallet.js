export const connectWallet = async () => {
    if (window.solana) {
      const wallet = await window.solana.connect();
      return wallet.publicKey.toString();
    }
    throw new Error("Phantom Wallet chưa được cài đặt!");
  };
  
  export const disconnectWallet = () => {
    if (window.solana) {
      window.solana.disconnect();
    }
  };
  
  export const getWalletAddress = () => {
    if (window.solana && window.solana.isConnected) {
      return window.solana.publicKey.toString();
    }
    return null;
  };
  