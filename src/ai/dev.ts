import { config } from 'dotenv';
config();

import '@/ai/flows/recognize-handwritten-formula.ts';
import '@/ai/flows/identify-and-convert-units.ts';
import '@/ai/flows/solve-equation.ts';
import '@/ai/flows/define-equation-variables.ts';
import '@/ai/flows/plot-function.ts';
import '@/ai/flows/scientific-assistant.ts';
