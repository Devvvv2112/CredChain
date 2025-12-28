'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ShieldCheck, ShieldAlert, Loader2, CheckCircle2, XCircle, HelpCircle } from 'lucide-react';
import { runVerification } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { type VerificationExplanationOutput } from '@/ai/flows/verification-explanation';
import { AnimatePresence, motion } from 'framer-motion';

const getOverallStatus = (result: VerificationExplanationOutput) => {
    if (result.isValidSignature && result.isIssuerRecognized && result.isOnChain) {
        return {
            text: "Verified",
            Icon: ShieldCheck,
            color: "text-green-600",
            bgColor: "bg-green-50",
            borderColor: "border-green-600/20"
        };
    }
    if (!result.isValidSignature) {
        return {
            text: "Invalid Signature",
            Icon: ShieldAlert,
            color: "text-red-600",
            bgColor: "bg-red-50",
            borderColor: "border-red-600/20"
        };
    }
    return {
        text: "Not Verified",
        Icon: ShieldAlert,
        color: "text-amber-600",
        bgColor: "bg-amber-50",
        borderColor: "border-amber-600/20"
    };
};

export function VerifierDashboard() {
  const searchParams = useSearchParams();
  const [credentialData, setCredentialData] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<VerificationExplanationOutput | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const dataFromUrl = searchParams.get('data');
    if (dataFromUrl) {
      try {
        const decodedData = decodeURIComponent(dataFromUrl);
        const parsedData = JSON.parse(decodedData);
        setCredentialData(JSON.stringify(parsedData, null, 2));
      } catch (e) {
        toast({
          variant: 'destructive',
          title: 'Invalid Link',
          description: 'The provided verification link contains malformed data.',
        });
      }
    }
  }, [searchParams, toast]);

  const handleVerify = async () => {
    let parsedData;
    try {
      parsedData = JSON.parse(credentialData);
    } catch (e) {
      toast({
        variant: 'destructive',
        title: 'Invalid JSON',
        description: 'The provided data is not valid JSON.',
      });
      return;
    }

    if (!parsedData.credentialData || !parsedData.signature || !parsedData.issuerAddress || !parsedData.contractAddress) {
        toast({
          variant: 'destructive',
          title: 'Missing Required Fields',
          description: 'The JSON data must include credentialData, signature, issuerAddress, and contractAddress.',
        });
        return;
    }

    setIsLoading(true);
    setResult(null);

    const response = await runVerification({
        credentialData: JSON.stringify(parsedData.credentialData),
        signature: parsedData.signature,
        issuerAddress: parsedData.issuerAddress,
        contractAddress: parsedData.contractAddress,
    });

    setIsLoading(false);

    if (response.success && response.data) {
      setResult(response.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Verification Failed',
        description: response.error,
      });
    }
  };

  const overallStatus = result ? getOverallStatus(result) : null;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Verify Credential</h2>
        <p className="text-muted-foreground">
          Paste the credential JSON data below to verify its authenticity.
        </p>
      </div>

      <div className="space-y-4">
        <Textarea
          placeholder='{ "credentialData": { ... }, "signature": "...", ... }'
          value={credentialData}
          onChange={(e) => setCredentialData(e.target.value)}
          rows={10}
        />
        <Button onClick={handleVerify} disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <ShieldCheck className="mr-2 h-4 w-4" />
          )}
          Verify
        </Button>
      </div>

      <AnimatePresence>
      {(isLoading || result) && (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
        <Card>
          <CardHeader>
            <CardTitle>Verification Result</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center gap-4 p-8 text-muted-foreground">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="font-medium">Verifying with AI...</p>
              </div>
            ) : result && overallStatus && (
              <div className="space-y-6">
                <div className={`flex items-center gap-3 rounded-lg border p-4 ${overallStatus.bgColor} ${overallStatus.borderColor}`}>
                    <overallStatus.Icon className={`h-8 w-8 flex-shrink-0 ${overallStatus.color}`} />
                    <div>
                        <h3 className={`text-xl font-bold ${overallStatus.color}`}>{overallStatus.text}</h3>
                        <p className="text-sm text-muted-foreground">Verification completed with AI assistance.</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium">Confidence Score</span>
                            <span className="text-sm font-bold text-primary">{Math.round(result.confidenceScore * 100)}%</span>
                        </div>
                        <Progress value={result.confidenceScore * 100} />
                    </div>

                    <ul className="space-y-3">
                        <li className="flex items-center gap-3">
                            {result.isValidSignature ? <CheckCircle2 className="h-5 w-5 text-green-600" /> : <XCircle className="h-5 w-5 text-red-600" />}
                            <span className="font-medium">EIP-712 Signature is {result.isValidSignature ? 'Valid' : 'Invalid'}</span>
                        </li>
                         <li className="flex items-center gap-3">
                            {result.isIssuerRecognized ? <CheckCircle2 className="h-5 w-5 text-green-600" /> : <XCircle className="h-5 w-5 text-red-600" />}
                            <span className="font-medium">Issuer is {result.isIssuerRecognized ? 'Recognized' : 'Not Recognized'}</span>
                        </li>
                         <li className="flex items-center gap-3">
                            {result.isOnChain ? <CheckCircle2 className="h-5 w-5 text-green-600" /> : <HelpCircle className="h-5 w-5 text-amber-600" />}
                            <span className="font-medium">Credential hash is {result.isOnChain ? 'Registered On-Chain' : 'Not Found On-Chain'}</span>
                        </li>
                    </ul>
                </div>
                
                <Card className="bg-muted/50">
                    <CardHeader>
                        <CardTitle className="text-base">AI-Generated Explanation</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">{result.explanation}</p>
                    </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}
