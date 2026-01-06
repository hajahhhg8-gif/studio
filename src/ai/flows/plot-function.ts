"use server";
/**
 * @fileOverview This file defines a Genkit flow for plotting mathematical functions.
 *
 * It exports:
 * - `plotFunction`: An async function that takes a mathematical expression and a range, and returns a set of points to be plotted.
 * - `PlotFunctionInput`: The input type for the `plotFunction` function.
 * - `PlotFunctionOutput`: The output type for the `plotFunction` function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { parse, evaluate } from 'mathjs';

// Define Zod schemas for input and output
const PlotFunctionInputSchema = z.object({
  expression: z.string().describe('The mathematical function to plot, e.g., "x^2" or "sin(x)".'),
  min: z.number().describe('The minimum value of x for the plot.'),
  max: z.number().describe('The maximum value of x for the plot.'),
  steps: z.number().int().positive().describe('The number of points to calculate.'),
});
export type PlotFunctionInput = z.infer<typeof PlotFunctionInputSchema>;

const PointSchema = z.object({
  x: z.number(),
  y: z.number(),
});

const PlotFunctionOutputSchema = z.object({
  points: z.array(PointSchema).describe('An array of {x, y} points representing the function plot.'),
});
export type PlotFunctionOutput = z.infer<typeof PlotFunctionOutputSchema>;


/**
 * A flow that evaluates a mathematical expression over a given range
 * and returns the points for plotting. This flow does NOT use an LLM.
 * It uses the mathjs library for safe expression evaluation.
 * @param input The function expression and plotting range.
 * @returns An array of points.
 */
export const plotFunction = ai.defineFlow(
  {
    name: 'plotFunctionFlow',
    inputSchema: PlotFunctionInputSchema,
    outputSchema: PlotFunctionOutputSchema,
  },
  async (input) => {
    const { expression, min, max, steps } = input;
    const points: { x: number; y: number }[] = [];

    try {
      // Compile the expression once for efficiency
      const node = parse(expression);
      const code = node.compile();

      const stepSize = (max - min) / (steps - 1);

      for (let i = 0; i < steps; i++) {
        const x = min + i * stepSize;
        const y = code.evaluate({ x });

        // Ensure y is a finite number
        if (Number.isFinite(y)) {
          points.push({ x: parseFloat(x.toFixed(4)), y: parseFloat(y.toFixed(4)) });
        }
      }
      
      if (points.length === 0) {
           throw new Error("لم يتمكن من حساب أي نقاط صالحة. تحقق من تعبير الدالة والنطاق.");
      }

      return { points };
    } catch (error: any) {
      console.error(`Error evaluating expression "${expression}":`, error);
      // Provide a more user-friendly error message
      throw new Error(`تعبير الدالة غير صالح: "${expression}". يرجى التحقق من الصيغة. الخطأ الأصلي: ${error.message}`);
    }
  }
);
