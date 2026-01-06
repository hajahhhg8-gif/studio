"use client";

import { useState } from 'react';
import { SidebarProvider, Sidebar, SidebarInset, SidebarTrigger, SidebarContent, SidebarHeader } from '@/components/ui/sidebar';
import EquationInputTabs from '@/components/equations/equation-input-tabs';
import EquationLibrary from '@/components/equations/equation-library';
import type { Equation, Note } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/layout/header';
import { Bot, BrainCircuit, NotebookText, FunctionSquare, Library } from 'lucide-react';
import EquationSolver from '@/components/equations/equation-solver';
import NotesManager from '@/components/notes/notes-manager';
import FunctionPlotter from '@/components/tools/function-plotter';

const initialEquations: Equation[] = [
  { id: 1, name: 'الصيغة التربيعية', latex: 'x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}' },
  { id: 2, name: 'معادلة أينشتاين للمجال', latex: 'R_{\\mu\\nu} - \\frac{1}{2}g_{\\mu\\nu}R = \\frac{8\\pi G}{c^4}T_{\\mu\\nu}' },
  { id: 3, name: 'تحويل فورييه', latex: '\\hat{f}(\\xi) = \\int_{-\\infty}^{\\infty} f(x) e^{-2\\pi i x \\xi} dx' },
];

const initialNotes: Note[] = [
  { id: 1, title: 'ملاحظات الأسبوع الأول', content: '# مقدمة في الجبر الخطي\n\nهذا الأسبوع، تعلمنا عن **المتجهات** و**المصفوفات**.\n\n- المتجه هو كائن رياضي له مقدار واتجاه.\n- المصفوفة هي ترتيب مستطيل من الأرقام.', createdAt: new Date() },
  { id: 2, title: 'ملخص التفاضل والتكامل', content: '## المفاهيم الأساسية\n\n1.  **النهايات (Limits):** أساس التفاضل.\n2.  **المشتقات (Derivatives):** تقيس معدل التغير.\n3.  **التكامل (Integrals):** يحسب المساحة تحت المنحنى.', createdAt: new Date() }
]

export type ActiveView = 'library' | 'solver' | 'notes' | 'plotter';

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

  const renderActiveView = () => {
    switch (activeView) {
      case 'library':
        return <EquationLibrary 
                  equations={equations}
                  onDelete={deleteEquation}
                  onUpdate={updateEquation}
                />;
      case 'solver':
        return <EquationSolver />;
      case 'notes':
        return <NotesManager 
                  notes={notes}
                  onAdd={addNote}
                  onUpdate={updateNote}
                  onDelete={deleteNote}
                />;
      case 'plotter':
        return <FunctionPlotter />;
      default:
        return <EquationLibrary 
                  equations={equations}
                  onDelete={deleteEquation}
                  onUpdate={updateEquation}
                />;
    }
  }

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full bg-background -z-10 overflow-hidden">
          {/* Stars background */}
          <div id="stars" className="absolute inset-0"></div>
          <div id="stars2" className="absolute inset-0"></div>
          <div id="stars3" className="absolute inset-0"></div>
          {/* Gradient glows */}
          <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/20 rounded-full mix-blend-screen filter blur-3xl animate-blob opacity-30"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-secondary/30 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-2000 opacity-30"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-primary/20 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-4000 opacity-30"></div>
          <style jsx>{`
            @keyframes animate-blob {
              0% { transform: scale(1) translateY(0px) rotate(0deg); }
              33% { transform: scale(1.1) translateY(-20px) rotate(40deg); }
              66% { transform: scale(0.9) translateY(20px) rotate(-40deg); }
              100% { transform: scale(1) translateY(0px) rotate(0deg); }
            }
            .animate-blob {
              animation: animate-blob 15s infinite ease-in-out;
            }
            .animation-delay-2000 { animation-delay: 2s; }
            .animation-delay-4000 { animation-delay: 4s; }

            // Starry background effect
            // https://codepen.io/WebCodeFlow/pen/NWgWdPe
            @function random_range($min, $max) {
              $rand: random();
              $random_range: $min + floor($rand * ($max - $min + 1));
              @return $random_range;
            }

            #stars {
              width: 1px;
              height: 1px;
              background: transparent;
              box-shadow: 25vw 38vh #FFF, 9vw 7vh #FFF, 88vw 1vh #FFF, 22vw 36vh #FFF, 89vw 9vh #FFF, 82vw 45vh #FFF, 3vw 6vh #FFF, 31vw 77vh #FFF, 53vw 3vh #FFF, 9vw 99vh #FFF, 24vw 89vh #FFF, 81vw 90vh #FFF, 5vw 41vh #FFF, 70vw 2vh #FFF, 4vw 9vh #FFF, 9vw 84vh #FFF, 54vw 2vh #FFF, 9vw 65vh #FFF, 8vw 27vh #FFF, 2vw 50vh #FFF;
              animation: animStar 50s linear infinite;
            }

            #stars2 {
              width: 2px;
              height: 2px;
              background: transparent;
              box-shadow: 25vw 38vh #FFF, 9vw 7vh #FFF, 88vw 1vh #FFF, 22vw 36vh #FFF, 89vw 9vh #FFF, 82vw 45vh #FFF, 3vw 6vh #FFF, 31vw 77vh #FFF, 53vw 3vh #FFF, 9vw 99vh #FFF, 24vw 89vh #FFF, 81vw 90vh #FFF, 5vw 41vh #FFF, 70vw 2vh #FFF, 4vw 9vh #FFF, 9vw 84vh #FFF, 54vw 2vh #FFF, 9vw 65vh #FFF, 8vw 27vh #FFF, 2vw 50vh #FFF;
              animation: animStar 100s linear infinite;
            }

            #stars3 {
              width: 3px;
              height: 3px;
              background: transparent;
              box-shadow: 25vw 38vh #FFF, 9vw 7vh #FFF, 88vw 1vh #FFF, 22vw 36vh #FFF, 89vw 9vh #FFF, 82vw 45vh #FFF, 3vw 6vh #FFF, 31vw 77vh #FFF, 53vw 3vh #FFF, 9vw 99vh #FFF, 24vw 89vh #FFF, 81vw 90vh #FFF, 5vw 41vh #FFF, 70vw 2vh #FFF, 4vw 9vh #FFF, 9vw 84vh #FFF, 54vw 2vh #FFF, 9vw 65vh #FFF, 8vw 27vh #FFF, 2vw 50vh #FFF;
              animation: animStar 150s linear infinite;
            }

            @keyframes animStar {
              from {
                transform: translateY(0px);
              }
              to {
                transform: translateY(-2000px);
              }
            }
          `}</style>
      </div>
      <SidebarProvider>
        <div className="flex flex-col min-h-screen">
          <Sidebar>
            <SidebarContent className="p-0 border-r border-border/50 bg-sidebar/95 backdrop-blur-sm">
               <SidebarHeader className="p-4 border-b border-border/50">
                  <a href="/" className="flex items-center space-x-2 rtl:space-x-reverse">
                      <BrainCircuit className="h-8 w-8 text-primary" />
                      <span className="inline-block font-bold font-headline text-2xl bg-gradient-to-r from-primary to-primary-foreground/80 text-transparent bg-clip-text">
                        Equation Note
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
                  {renderActiveView()}
              </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </>
  );
}
