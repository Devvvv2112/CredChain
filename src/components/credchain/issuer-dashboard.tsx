'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FilePlus, FileSignature, Loader2, Link as LinkIcon, AlertCircle } from 'lucide-react';
import { useWallet } from '@/hooks/use-wallet';
import { AnimatePresence, motion } from 'framer-motion';

const formSchema = z.object({
  candidateAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address'),
  credentialName: z.string().min(3, 'Credential name must be at least 3 characters'),
  credentialDetails: z.string().min(10, 'Details must be at least 10 characters'),
});

type CredentialOutput = {
  credentialData: string;
  signature: string;
  hash: string;
  isRegistered: boolean;
};

export function IssuerDashboard() {
  const { isConnected, address: issuerAddress } = useWallet();
  const [credential, setCredential] = useState<CredentialOutput | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      candidateAddress: '',
      credentialName: '',
      credentialDetails: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Simulate off-chain signing (EIP-712)
    const credentialData = {
      issuer: issuerAddress,
      candidate: values.candidateAddress,
      name: values.credentialName,
      details: values.credentialDetails,
      issuedAt: new Date().toISOString(),
    };

    // Mock signature and hash generation
    const hash = '0x' + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
    const signature = '0x' + Array(130).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
    
    setCredential({
        credentialData: JSON.stringify(credentialData, null, 2),
        signature,
        hash,
        isRegistered: false,
    });
  }

  const handleRegister = () => {
    setIsRegistering(true);
    setTimeout(() => {
      if (credential) {
        setCredential({ ...credential, isRegistered: true });
      }
      setIsRegistering(false);
    }, 2000);
  };

  if (!isConnected) {
    return (
      <div className="text-center text-muted-foreground p-8 flex flex-col items-center gap-4">
        <AlertCircle className="w-12 h-12 text-destructive" />
        <h3 className="text-xl font-semibold text-foreground">Wallet Not Connected</h3>
        <p>Please connect your wallet to issue credentials.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Issue New Credential</h2>
        <p className="text-muted-foreground">Create and sign a new credential for a candidate.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="candidateAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Candidate Address</FormLabel>
                <FormControl>
                  <Input placeholder="0x..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="credentialName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Credential Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Solidity Expert Certificate" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="credentialDetails"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Credential Details</FormLabel>
                <FormControl>
                  <Textarea placeholder="Describe the credential, achievements, etc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">
            <FileSignature className="mr-2 h-4 w-4" />
            Create & Sign Credential
          </Button>
        </form>
      </Form>
      
      <AnimatePresence>
      {credential && (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
        <Card>
          <CardHeader>
            <CardTitle>Signed Credential Ready</CardTitle>
            <CardDescription>
                This credential has been signed off-chain. Register its hash to finalize.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
                <label className="text-sm font-medium">Credential Hash</label>
                <p className="font-mono text-sm p-3 bg-muted rounded-md break-all">{credential.hash}</p>
            </div>
             <div className="space-y-2">
                <label className="text-sm font-medium">Full Credential Data (for sharing)</label>
                <pre className="text-sm p-3 bg-muted rounded-md max-h-48 overflow-auto">{credential.credentialData}</pre>
            </div>

            {credential.isRegistered ? (
                <div className="flex items-center gap-2 text-green-600 font-medium p-3 border-green-600/20 bg-green-50 rounded-md">
                    <LinkIcon className="h-5 w-5"/>
                    <span>Hash successfully registered on-chain.</span>
                </div>
            ) : (
                <Button onClick={handleRegister} disabled={isRegistering}>
              {isRegistering ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <LinkIcon className="mr-2 h-4 w-4" />
              )}
              Register Hash On-Chain
            </Button>
            )}
          </CardContent>
        </Card>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}
