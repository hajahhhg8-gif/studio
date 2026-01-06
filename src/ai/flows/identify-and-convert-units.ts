'use server';
/**
 * @fileOverview This file defines a Genkit flow for identifying and converting units within an equation.
 *
 * It exports:
 * - `identifyAndConvertUnits`: An async function that takes an equation string as input and returns the equation with converted units.
 * - `IdentifyAndConvertUnitsInput`: The input type for the `identifyAndConvertUnits` function.
 * - `IdentifyAndConvertUnitsOutput`: The output type for the `identifyAndConvertUnits` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IdentifyAndConvertUnitsInputSchema = z.object({
  equation: z
    .string()
    .describe('The equation to identify and convert units in.'),
});
export type IdentifyAndConvertUnitsInput = z.infer<
  typeof IdentifyAndConvertUnitsInputSchema
>;

const IdentifyAndConvertUnitsOutputSchema = z.object({
  convertedEquation: z
    .string()
    .describe('The equation with identified and converted units.'),
});
export type IdentifyAndConvertUnitsOutput = z.infer<
  typeof IdentifyAndConvertUnitsOutputSchema
>;

export async function identifyAndConvertUnits(
  input: IdentifyAndConvertUnitsInput
): Promise<IdentifyAndConvertUnitsOutput> {
  return identifyAndConvertUnitsFlow(input);
}

const identifyAndConvertUnitsPrompt = ai.definePrompt({
  name: 'identifyAndConvertUnitsPrompt',
  input: {schema: IdentifyAndConvertUnitsInputSchema},
  output: {schema: IdentifyAndConvertUnitsOutputSchema},
  prompt: `You are a unit conversion expert. You will receive an equation as a string. Your task is to identify all the units present in the equation and convert them to base SI units (meter, kilogram, second, ampere, kelvin, mole, candela). If a unit is already in base SI, leave it as is. Return the equation with the converted units. If no units are present return the original equation.

Equation: {{{equation}}}`,
});

const identifyAndConvertUnitsFlow = ai.defineFlow(
  {
    name: 'identifyAndConvertUnitsFlow',
    inputSchema: IdentifyAndConvertUnitsInputSchema,
    outputSchema: IdentifyAndConvertUnitsOutputSchema,
  },
  async input => {
    const {output} = await identifyAndConvertUnitsPrompt(input);
    return output!;
  }
);
