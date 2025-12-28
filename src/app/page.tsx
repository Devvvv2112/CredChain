import { Suspense } from 'react';
import { Header } from '@/components/credchain/header';
import { Footer } from '@/components/credchain/footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IssuerDashboard } from '@/components/credchain/issuer-dashboard';
import { CandidateDashboard } from '@/components/credchain/candidate-dashboard';
import { VerifierDashboard } from '@/components/credchain/verifier-dashboard';
import { Card, CardContent } from '@/components/ui/card';

function PageContent() {
  return (
    <div className="flex min-h-full flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <Tabs defaultValue="verifier" className="w-full">
            <div className="flex justify-center">
              <TabsList className="grid w-full max-w-md grid-cols-3">
                <TabsTrigger value="issuer">Issuer</TabsTrigger>
                <TabsTrigger value="candidate">Candidate</TabsTrigger>
                <TabsTrigger value="verifier">Verifier</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="issuer" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <IssuerDashboard />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="candidate" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <CandidateDashboard />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="verifier" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <Suspense fallback={<div>Loading...</div>}>
                    <VerifierDashboard />
                  </Suspense>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PageContent />
    </Suspense>
  );
}
