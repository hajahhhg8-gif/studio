"use client";

import { useState } from 'react';
import { SidebarProvider, Sidebar, SidebarInset, SidebarTrigger, SidebarContent, SidebarHeader } from '@/components/ui/sidebar';
import EquationInputTabs from '@/components/equations/equation-input-tabs';
import EquationLibrary from '@/components/equations/equation-library';
import type { Equation } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/layout/header';
import { Bot, BrainCircuit, SigmaSquare } from 'lucide-react';
import EquationSolver from '@/components/equations/equation-solver';

const initialEquations: Equation[] = [
  { id: 1, name: 'الصيغة التربيعية', latex: 'x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}' },
  { id: 2, name: 'معادلة أينشتاين للمجال', latex: 'R_{\\mu\\nu} - \\frac{1}{2}g_{\\mu\\nu}R = \\frac{8\\pi G}{c^4}T_{\\mu\\nu}' },
  { id: 3, name: 'تحويل فورييه', latex: '\\hat{f}(\\xi) = \\int_{-\\infty}^{\\infty} f(x) e^{-2\\pi i x \\xi} dx' },
];

export default function Home() {
  const [equations, setEquations] = useState<Equation[]>(initialEquations);
  const { toast } = useToast();
  const [activeView, setActiveView] = useState<'library' | 'solver'>('library');

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
  
  const updateEquation = (id: number, updates: Partial<Omit<Equation, 'id'>>) => {
    setEquations(prev => prev.map(eq => eq.id === id ? { ...eq, ...updates } : eq));
     toast({
      title: "تم التحديث",
      description: "تم تحديث المعادلة بنجاح.",
    });
  }

  const handlePrint = () => {
    window.print();
  };


  return (
    <SidebarProvider>
      <div className="flex flex-col min-h-screen">
        <Sidebar>
          <SidebarContent className="p-0 border-r border-border/50 bg-background/80 backdrop-blur-sm">
             <SidebarHeader className="p-4">
                <a href="/" className="flex items-center space-x-2 rtl:space-x-reverse">
                    <SigmaSquare className="h-8 w-8 text-primary" />
                    <span className="inline-block font-bold font-headline text-2xl">
                    Equation Ace
                    </span>
                </a>
            </SidebarHeader>
            <div className="p-4">
                <EquationInputTabs onSave={addEquation} />
            </div>
          </SidebarContent>
        </Sidebar>

        <SidebarInset>
            <Header onExportPdf={handlePrint} activeView={activeView} setActiveView={setActiveView} />
            <main className="flex-1 container mx-auto p-4 md:p-6 lg:p-8">
                {activeView === 'library' && (
                  <EquationLibrary 
                      equations={equations}
                      onDelete={deleteEquation}
                      onUpdate={updateEquation}
                  />
                )}
                {activeView === 'solver' && <EquationSolver />}
            </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
