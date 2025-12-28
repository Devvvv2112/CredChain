'use client';

import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';

interface WalletContextType {
  isConnected: boolean;
  address: string;
  connectWallet: () => void;
  disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState('');

  const connectWallet = useCallback(() => {
    // This is a mock wallet connection
    const mockAddress = `0x${Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
    setAddress(mockAddress);
    setIsConnected(true);
    localStorage.setItem('credchain-wallet-connected', 'true');
    localStorage.setItem('credchain-wallet-address', mockAddress);
  }, []);

  const disconnectWallet = useCallback(() => {
    setIsConnected(false);
    setAddress('');
    localStorage.removeItem('credchain-wallet-connected');
    localStorage.removeItem('credchain-wallet-address');
  }, []);

  useEffect(() => {
    const wasConnected = localStorage.getItem('credchain-wallet-connected') === 'true';
    const savedAddress = localStorage.getItem('credchain-wallet-address');
    if (wasConnected && savedAddress) {
      setIsConnected(true);
      setAddress(savedAddress);
    }
  }, []);

  const value = { isConnected, address, connectWallet, disconnectWallet };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
