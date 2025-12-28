import { ShieldHalf } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <ShieldHalf className="h-6 w-6 text-primary" />
            <span className="font-semibold">CredChain</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} CredChain. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
