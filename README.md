# CredChain

CredChain is a blockchain-based credential verification system that allows issuers to issue cryptographically signed credentials, candidates to own them, and verifiers to independently verify their authenticity without storing personal data on-chain.

## Why CredChain
Resumes and credentials are easy to fake and hard to verify.  
CredChain explores how cryptographic signatures and blockchain immutability can reduce trust in credential verification while preserving privacy.

## Project Reality Check
CredChain is an early-stage engineering project. The focus is not polish, but correctness, clear design decisions, and understanding real-world tradeoffs in building trust-minimized systems.

## Core Idea
- Credentials are created and signed off-chain
- Only hashes are stored on-chain
- Verification does not rely on the frontend

## Tech Stack
- Solidity  
- EIP-712 signatures  
- Next.js  
- MetaMask  
- Hardhat / Foundry  

## Status
MVP under active development.

## Disclaimer
CredChain does not replace hiring processes or guarantee the truth of credentials. Trust in issuers remains external to the system.
