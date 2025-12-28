export type MockCredential = {
  id: string;
  name: string;
  issuer: string;
  issuerName: string;
  issuedAt: string;
  status: 'On-chain' | 'Pending';
  data: string; // JSON string of the full credential
};

const baseCredential1 = {
  candidate: "0x1234567890123456789012345678901234567890", // This will be replaced by connected wallet
  name: "Certified Web3 Developer",
  details: "Completed an intensive 12-week course on Web3 development, covering smart contracts, dApps, and decentralized storage.",
};

const baseCredential2 = {
  candidate: "0x1234567890123456789012345678901234567890",
  name: "Advanced EIP-712 Implementer",
  details: "Demonstrated expert-level ability to implement and secure applications using EIP-712 typed structured data hashing and signing.",
};

export const mockCredentials = (candidateAddress: string): MockCredential[] => [
  {
    id: 'cred_1',
    name: baseCredential1.name,
    issuer: '0x9876543210987654321098765432109876543210',
    issuerName: 'Dev University',
    issuedAt: '2023-10-26T10:00:00Z',
    status: 'On-chain',
    data: JSON.stringify({
      issuer: '0x9876543210987654321098765432109876543210',
      ...baseCredential1,
      candidate: candidateAddress,
      issuedAt: '2023-10-26T10:00:00Z',
    }, null, 2),
  },
  {
    id: 'cred_2',
    name: baseCredential2.name,
    issuer: '0xABCDEF0123456789ABCDEF0123456789ABCDEF01',
    issuerName: 'SecureChain Academy',
    issuedAt: '2024-01-15T14:30:00Z',
    status: 'On-chain',
    data: JSON.stringify({
        issuer: '0xABCDEF0123456789ABCDEF0123456789ABCDEF01',
        ...baseCredential2,
        candidate: candidateAddress,
        issuedAt: '2024-01-15T14:30:00Z',
    }, null, 2)
  },
];
