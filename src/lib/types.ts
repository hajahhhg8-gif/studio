import { z } from 'zod';

export const EquationSchema = z.object({
  id: z.number(),
  name: z.string(),
  latex: z.string(),
  convertedLatex: z.string().optional(),
});

export type Equation = z.infer<typeof EquationSchema>;

export const NoteSchema = z.object({
  id: z.number(),
  title: z.string(),
  content: z.string(),
  createdAt: z.date(),
});

export type Note = z.infer<typeof NoteSchema>;
