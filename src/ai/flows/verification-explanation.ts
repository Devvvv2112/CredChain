'use server';

/**
 * @fileOverview This file contains the Genkit flow for verifying credential data and providing a human-readable explanation of the verification results.
 *
 * - verifyCredentialAndExplain - A function that verifies the credential and explains the results.
 * - VerificationExplanationInput - The input type for the verifyCredentialAndExplain function.
 * - VerificationExplanationOutput - The return type for the verifyCredentialAndExplain function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VerificationExplanationInputSchema = z.object({
  credentialData: z
    .string()
    .describe('The credential data to be verified, in JSON format.'),
  signature: z.string().describe('The signature of the credential data.'),
  issuerAddress: z.string().describe('The Ethereum address of the credential issuer.'),
  contractAddress: z.string().describe('The Ethereum address of the smart contract.'),
});
export type VerificationExplanationInput = z.infer<
  typeof VerificationExplanationInputSchema
>;

const VerificationExplanationOutputSchema = z.object({
  isValidSignature: z.boolean().describe('Whether the signature is valid.'),
  isIssuerRecognized: z
    .boolean()
    .describe('Whether the issuer is recognized.'),
  isOnChain: z.boolean().describe('Whether the credential hash is registered on-chain.'),
  confidenceScore: z
    .number()
    .describe('A confidence score (0-1) representing the overall verification confidence.'),
  explanation: z
    .string()
    .describe(
      'A human-readable explanation of the verification results, including any potential issues.'
    ),
});

export type VerificationExplanationOutput = z.infer<
  typeof VerificationExplanationOutputSchema
>;

export async function verifyCredentialAndExplain(
  input: VerificationExplanationInput
): Promise<VerificationExplanationOutput> {
  return verificationExplanationFlow(input);
}

const verificationExplanationPrompt = ai.definePrompt({
  name: 'verificationExplanationPrompt',
  input: {schema: VerificationExplanationInputSchema},
  output: {schema: VerificationExplanationOutputSchema},
  prompt: `You are a credential verification expert. Given the following information about a credential, determine if the signature is valid, the issuer is recognized, and the credential hash is registered on-chain.

Credential Data: {{{credentialData}}}
Signature: {{{signature}}}
Issuer Address: {{{issuerAddress}}}
Contract Address: {{{contractAddress}}}

Based on this information, provide the following:

- isValidSignature: true if the signature is valid, false otherwise.
- isIssuerRecognized: true if the issuer is recognized, false otherwise.
- isOnChain: true if the credential hash is registered on-chain, false otherwise.
- confidenceScore: A confidence score (0-1) representing the overall verification confidence.
- explanation: A human-readable explanation of the verification results, including any potential issues, such as a delay in on-chain registration.

Ensure that the explanation is clear, concise, and informative for a verifier.

Please provide the output in JSON format.`,
});

const verificationExplanationFlow = ai.defineFlow(
  {
    name: 'verificationExplanationFlow',
    inputSchema: VerificationExplanationInputSchema,
    outputSchema: VerificationExplanationOutputSchema,
  },
  async input => {
    const {output} = await verificationExplanationPrompt(input);
    return output!;
  }
);
