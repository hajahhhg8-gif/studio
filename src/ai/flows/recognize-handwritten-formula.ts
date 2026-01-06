//RecognizeHandwrittenFormula story implementation
'use server';
/**
 * @fileOverview Recognizes handwritten formulas from images and converts them into LaTeX format.
 *
 * - recognizeHandwrittenFormula - A function that handles the recognition of handwritten formulas.
 * - RecognizeHandwrittenFormulaInput - The input type for the recognizeHandwrittenFormula function.
 * - RecognizeHandwrittenFormulaOutput - The return type for the recognizeHandwrittenFormula function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecognizeHandwrittenFormulaInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a handwritten equation, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type RecognizeHandwrittenFormulaInput = z.infer<typeof RecognizeHandwrittenFormulaInputSchema>;

const RecognizeHandwrittenFormulaOutputSchema = z.object({
  latexFormula: z.string().describe('The LaTeX representation of the handwritten formula.'),
});
export type RecognizeHandwrittenFormulaOutput = z.infer<typeof RecognizeHandwrittenFormulaOutputSchema>;

export async function recognizeHandwrittenFormula(input: RecognizeHandwrittenFormulaInput): Promise<RecognizeHandwrittenFormulaOutput> {
  return recognizeHandwrittenFormulaFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recognizeHandwrittenFormulaPrompt',
  input: {schema: RecognizeHandwrittenFormulaInputSchema},
  output: {schema: RecognizeHandwrittenFormulaOutputSchema},
  prompt: `You are an expert in recognizing handwritten mathematical formulas and converting them into LaTeX format.

  Please convert the following handwritten formula into its LaTeX representation. Ensure the LaTeX code is accurate and properly formatted.

  Handwritten Formula: {{media url=photoDataUri}}
  `,
});

const recognizeHandwrittenFormulaFlow = ai.defineFlow(
  {
    name: 'recognizeHandwrittenFormulaFlow',
    inputSchema: RecognizeHandwrittenFormulaInputSchema,
    outputSchema: RecognizeHandwrittenFormulaOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
