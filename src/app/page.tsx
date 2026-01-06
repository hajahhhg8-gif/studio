"use client";

import { useState } from 'react';
import { SidebarProvider, Sidebar, SidebarInset, SidebarTrigger, SidebarContent, SidebarHeader } from '@/components/ui/sidebar';
import EquationInputTabs from '@/components/equations/equation-input-tabs';
import EquationLibrary from '@/components/equations/equation-library';
import type { Equation, Note } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/layout/header';
import { Bot, BrainCircuit, NotebookText, SigmaSquare } from 'lucide-react';
import EquationSolver from '@/components/equations/equation-solver';
import NotesManager from '@/components/notes/notes-manager';

const initialEquations: Equation[] = [
  { id: 1, name: 'الصيغة التربيعية', latex: 'x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}' },
  { id: 2, name: 'معادلة أينشتاين للمجال', latex: 'R_{\\mu\\nu} - \\frac{1}{2}g_{\\mu\\nu}R = \\frac{8\\pi G}{c^4}T_{\\mu\\nu}' },
  { id: 3, name: 'تحويل فورييه', latex: '\\hat{f}(\\xi) = \\int_{-\\infty}^{\\infty} f(x) e^{-2\\pi i x \\xi} dx' },
];

const initialNotes: Note[] = [
  { id: 1, title: 'ملاحظات الأسبوع الأول', content: '# مقدمة في الجبر الخطي\n\nهذا الأسبوع، تعلمنا عن **المتجهات** و**المصفوفات**.\n\n- المتجه هو كائن رياضي له مقدار واتجاه.\n- المصفوفة هي ترتيب مستطيل من الأرقام.', createdAt: new Date() },
  { id: 2, title: 'ملخص التفاضل والتكامل', content: '## المفاهيم الأساسية\n\n1.  **النهايات (Limits):** أساس التفاضل.\n2.  **المشتقات (Derivatives):** تقيس معدل التغير.\n3.  **التكامل (Integrals):** يحسب المساحة تحت المنحنى.', createdAt: new Date() }
]

type ActiveView = 'library' | 'solver' | 'notes';

export default function Home() {
  const [equations, setEquations] = useState<Equation[]>(initialEquations);
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const { toast } = useToast();
  const [activeView, setActiveView] = useState<ActiveView>('library');

  const addEquation = (newEquation: Omit<Equation, 'id'>) => {
    setEquations(prev => [...prev, { ...newEquation, id: Date.now() }]);
    toast({
      title: "تم الحفظ بنجاح",
      description: `تمت إضافة المعادلة "${newEquation.name}" إلى مكتبتك.`,
      className: 'bg-secondary border-primary/50 text-foreground'
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
      className: 'bg-secondary border-primary/50 text-foreground'
    });
  }

  const addNote = (newNote: Omit<Note, 'id'>) => {
    setNotes(prev => [...prev, { ...newNote, id: Date.now() }]);
    toast({
      title: "تم حفظ الملاحظة",
      description: `تمت إضافة ملاحظة "${newNote.title}" بنجاح.`,
      className: 'bg-secondary border-primary/50 text-foreground'
    });
  }

  const updateNote = (id: number, updates: Partial<Omit<Note, 'id'>>) => {
    setNotes(prev => prev.map(note => note.id === id ? { ...note, ...updates } : note));
    toast({
      title: "تم تحديث الملاحظة",
      description: "تم تحديث ملاحظتك بنجاح.",
      className: 'bg-secondary border-primary/50 text-foreground'
    });
  }

  const deleteNote = (id: number) => {
    setNotes(prev => prev.filter(note => note.id !== id));
    toast({
      title: "تم حذف الملاحظة",
      variant: "destructive"
    });
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <SidebarProvider>
      <div className="flex flex-col min-h-screen">
        <Sidebar>
          <SidebarContent className="p-0 border-r border-border/50 bg-sidebar/95 backdrop-blur-sm">
             <SidebarHeader className="p-4 border-b border-border/50">
                <a href="/" className="flex items-center space-x-2 rtl:space-x-reverse">
                    <SigmaSquare className="h-8 w-8 text-primary" />
                    <span className="inline-block font-bold font-headline text-2xl bg-gradient-to-r from-primary to-primary-foreground/80 text-transparent bg-clip-text">
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
                {activeView === 'notes' && (
                  <NotesManager 
                    notes={notes}
                    onAdd={addNote}
                    onUpdate={updateNote}
                    onDelete={deleteNote}
                  />
                )}
            </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
