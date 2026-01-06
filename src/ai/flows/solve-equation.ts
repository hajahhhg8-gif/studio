'use server';
/**
 * @fileOverview This file defines a Genkit flow for solving mathematical equations.
 *
 * It exports:
 * - `solveEquation`: An async function that takes an equation string and returns the step-by-step solution.
 * - `SolveEquationInput`: The input type for the `solveEquation` function.
 * - `SolveEquationOutput`: The output type for the `solveEquation` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SolveEquationInputSchema = z.object({
  equation: z.string().describe('The mathematical equation to be solved.'),
});
export type SolveEquationInput = z.infer<typeof SolveEquationInputSchema>;

const SolveEquationOutputSchema = z.object({
  solution: z.string().describe('A step-by-step explanation of how to solve the equation, formatted in Markdown with LaTeX for math.'),
});
export type SolveEquationOutput = z.infer<typeof SolveEquationOutputSchema>;

export async function solveEquation(
  input: SolveEquationInput
): Promise<SolveEquationOutput> {
  return solveEquationFlow(input);
}

const solveEquationPrompt = ai.definePrompt({
  name: 'solveEquationPrompt',
  input: {schema: SolveEquationInputSchema},
  output: {schema: SolveEquationOutputSchema},
  prompt: `You are a mathematics expert. You will receive an equation. Your task is to provide a detailed, step-by-step solution. Explain each step clearly. Format the entire response in Markdown, using LaTeX for all mathematical expressions and equations.

Equation: {{{equation}}}

Start your response with "### الحل:" and then provide the steps.`,
});

const solveEquationFlow = ai.defineFlow(
  {
    name: 'solveEquationFlow',
    inputSchema: SolveEquationInputSchema,
    outputSchema: SolveEquationOutputSchema,
  },
  async input => {
    const {output} = await solveEquationPrompt(input);
    return output!;
  }
);
