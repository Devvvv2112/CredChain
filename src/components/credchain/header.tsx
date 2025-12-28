'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ShieldHalf, Wallet } from 'lucide-react';
import { useWallet } from '@/hooks/use-wallet';

export function Header() {
  const { isConnected, address, connectWallet, disconnectWallet } = useWallet();

  const handleConnect = () => {
    connectWallet();
  };

  const handleDisconnect = () => {
    disconnectWallet();
  }

  return (
    <header className="bg-card border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <ShieldHalf className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold tracking-tight text-foreground">
              CredChain
            </span>
          </Link>

          {isConnected ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Wallet className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-mono text-muted-foreground hidden md:inline">
                  {`${address.slice(0, 6)}...${address.slice(-4)}`}
                </span>
              </div>
              <Button variant="outline" size="sm" onClick={handleDisconnect}>Disconnect</Button>
            </div>
          ) : (
            <Button onClick={handleConnect}>
              <Wallet className="mr-2 h-4 w-4" />
              Connect Wallet
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
