export interface Equation {
  id: number;
  name: string;
  latex: string;
  convertedLatex?: string;
}

export interface Note {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
}
