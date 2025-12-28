'use server';

import { 
  verifyCredentialAndExplain, 
  type VerificationExplanationInput 
} from '@/ai/flows/verification-explanation';

export async function runVerification(input: VerificationExplanationInput) {
  try {
    // In a real app, you would perform actual on-chain checks and cryptographic verification here.
    // For this demo, we rely on the GenAI flow to simulate the entire verification logic.
    const result = await verifyCredentialAndExplain(input);
    return { success: true, data: result };
  } catch (error) {
    console.error("Verification Error:", error);
    // It's possible the AI model output doesn't match the schema.
    if (error instanceof Error && error.message.includes('Output validation failed')) {
      return { success: false, error: 'Verification failed due to an invalid response from the AI model. Please check the data format.' };
    }
    return { success: false, error: 'An unexpected error occurred during verification.' };
  }
}
