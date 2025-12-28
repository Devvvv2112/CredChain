'use client';

import { useWallet } from '@/hooks/use-wallet';
import { mockCredentials, type MockCredential } from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, Share2, AlertCircle, Award } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export function CandidateDashboard() {
  const { isConnected, address } = useWallet();
  const { toast } = useToast();
  const credentials = isConnected ? mockCredentials(address) : [];

  const handleCopyData = (credential: MockCredential) => {
    // We need to generate a mock signature to make the data verifiable
    const fullData = {
        credentialData: JSON.parse(credential.data),
        signature: "0x" + Array(130).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
        issuerAddress: credential.issuer,
        contractAddress: "0x0000000000000000000000000000000000000000" // A mock contract address
    }
    navigator.clipboard.writeText(JSON.stringify(fullData, null, 2));
    toast({
      title: 'Copied to Clipboard',
      description: 'Credential data has been copied.',
    });
  };

  const handleCopyLink = (credential: MockCredential) => {
    const fullData = {
        credentialData: JSON.parse(credential.data),
        signature: "0x" + Array(130).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
        issuerAddress: credential.issuer,
        contractAddress: "0x0000000000000000000000000000000000000000"
    }
    const encodedData = encodeURIComponent(JSON.stringify(fullData));
    const url = `${window.location.origin}/?tab=verifier&data=${encodedData}`;
    navigator.clipboard.writeText(url);
    toast({
      title: 'Link Copied',
      description: 'Verification link has been copied to your clipboard.',
    });
  };

  if (!isConnected) {
    return (
      <div className="text-center text-muted-foreground p-8 flex flex-col items-center gap-4">
        <AlertCircle className="w-12 h-12 text-destructive" />
        <h3 className="text-xl font-semibold text-foreground">Wallet Not Connected</h3>
        <p>Please connect your wallet to view your credentials.</p>
      </div>
    );
  }

  if (credentials.length === 0) {
     return (
      <div className="text-center text-muted-foreground p-8 flex flex-col items-center gap-4">
        <Award className="w-12 h-12 text-primary" />
        <h3 className="text-xl font-semibold text-foreground">No Credentials Found</h3>
        <p>You have not been issued any credentials to this wallet address yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
       <div>
        <h2 className="text-2xl font-bold tracking-tight">My Credentials</h2>
        <p className="text-muted-foreground">Here are the credentials that have been issued to you.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {credentials.map((cred) => (
          <Card key={cred.id} className="flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{cred.name}</CardTitle>
                <Badge variant={cred.status === 'On-chain' ? 'default' : 'secondary'} className={cred.status === 'On-chain' ? 'bg-green-600 text-white' : ''}>
                  {cred.status}
                </Badge>
              </div>
              <CardDescription>
                Issued by: {cred.issuerName} <br />
                On: {format(new Date(cred.issuedAt), "MMMM d, yyyy")}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground">
                {JSON.parse(cred.data).details}
              </p>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handleCopyData(cred)}>
                <Copy className="mr-2 h-4 w-4" />
                Copy Data
              </Button>
              <Button size="sm" onClick={() => handleCopyLink(cred)}>
                <Share2 className="mr-2 h-4 w-4" />
                Share Link
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
