'use server';
/**
 * @fileOverview This file defines a Genkit flow for defining the variables in a mathematical equation.
 *
 * It exports:
 * - `defineEquationVariables`: An async function that takes an equation and returns definitions for its variables.
 * - `DefineEquationVariablesInput`: The input type for the `defineEquationVariables` function.
 * - `DefineEquationVariablesOutput`: The output type for the `defineEquationVariables` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DefineEquationVariablesInputSchema = z.object({
  equation: z.string().describe('The mathematical equation in LaTeX format.'),
});
export type DefineEquationVariablesInput = z.infer<
  typeof DefineEquationVariablesInputSchema
>;

const DefineEquationVariablesOutputSchema = z.object({
  definitions: z
    .string()
    .describe(
      'The definitions of the variables in the equation, formatted in Markdown.'
    ),
});
export type DefineEquationVariablesOutput = z.infer<
  typeof DefineEquationVariablesOutputSchema
>;

export async function defineEquationVariables(
  input: DefineEquationVariablesInput
): Promise<DefineEquationVariablesOutput> {
  return defineEquationVariablesFlow(input);
}

const defineEquationVariablesPrompt = ai.definePrompt({
  name: 'defineEquationVariablesPrompt',
  input: {schema: DefineEquationVariablesInputSchema},
  output: {schema: DefineEquationVariablesOutputSchema},
  prompt: `You are an expert in mathematics and physics. You will receive a mathematical equation in LaTeX format. Your task is to define each variable and symbol in the equation.

Provide the definitions in a clear, concise list, formatted as Markdown.

Equation:
\`\`\`latex
{{{equation}}}
\`\`\`
`,
});

const defineEquationVariablesFlow = ai.defineFlow(
  {
    name: 'defineEquationVariablesFlow',
    inputSchema: DefineEquationVariablesInputSchema,
    outputSchema: DefineEquationVariablesOutputSchema,
  },
  async input => {
    const {output} = await defineEquationVariablesPrompt(input);
    return output!;
  }
);
