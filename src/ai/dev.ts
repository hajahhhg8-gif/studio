import { config } from 'dotenv';
config();

import '@/ai/flows/recognize-handwritten-formula.ts';
import '@/ai/flows/identify-and-convert-units.ts';
import '@/ai/flows/solve-equation.ts';
