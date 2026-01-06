"use client";

import { useState } from 'react';
import Header from '@/components/layout/header';
import EquationInputTabs from '@/components/equations/equation-input-tabs';
import EquationLibrary from '@/components/equations/equation-library';
import type { Equation } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

const initialEquations: Equation[] = [
  { id: 1, name: 'الصيغة التربيعية', latex: 'x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}' },
  { id: 2, name: 'معادلة أينشتاين للمجال', latex: 'R_{\\mu\\nu} - \\frac{1}{2}g_{\\mu\\nu}R = \\frac{8\\pi G}{c^4}T_{\\mu\\nu}' },
  { id: 3, name: 'تحويل فورييه', latex: '\\hat{f}(\\xi) = \\int_{-\\infty}^{\\infty} f(x) e^{-2\\pi i x \\xi} dx' },
];

export default function Home() {
  const [equations, setEquations] = useState<Equation[]>(initialEquations);
  const { toast } = useToast();

  const handlePrint = () => {
    window.print();
  };

  const addEquation = (newEquation: Omit<Equation, 'id'>) => {
    setEquations(prev => [...prev, { ...newEquation, id: Date.now() }]);
    toast({
      title: "تم الحفظ بنجاح",
      description: `تمت إضافة المعادلة "${newEquation.name}" إلى مكتبتك.`,
    });
  };

  const deleteEquation = (id: number) => {
    setEquations(prev => prev.filter(eq => eq.id !== id));
    toast({
      title: "تم الحذف",
      description: "تمت إزالة المعادلة من مكتبتك.",
      variant: 'destructive'
    });
  };
  
  const updateEquation = (id: number, updates: Partial<Equation>) => {
    setEquations(prev => prev.map(eq => eq.id === id ? { ...eq, ...updates } : eq));
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background to-slate-900">
      <Header onExportPdf={handlePrint} />
      <main className="flex-1 container mx-auto p-4 md:p-6 lg:p-8">
        <div className="grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <EquationInputTabs onSave={addEquation} />
          </div>
          <div className="lg:col-span-3">
            <EquationLibrary 
              equations={equations}
              onDelete={deleteEquation}
              onUpdate={updateEquation}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
