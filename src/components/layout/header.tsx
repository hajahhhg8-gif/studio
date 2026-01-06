"use client";

import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bot, BrainCircuit, FileDown, Library, Menu, NotebookText } from "lucide-react";
import { cn } from "@/lib/utils";

type ActiveView = 'library' | 'solver' | 'notes';

interface HeaderProps {
  onExportPdf: () => void;
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
}

export default function Header({ onExportPdf, activeView, setActiveView }: HeaderProps) {
  const navButtons: { view: ActiveView; label: string; icon: React.ElementType }[] = [
    { view: 'library', label: 'المكتبة', icon: Library },
    { view: 'solver', label: 'حلّال المعادلات', icon: Bot },
    { view: 'notes', label: 'ملاحظاتي', icon: NotebookText },
  ];

  return (
    <header className="sticky top-0 z-30 w-full border-b border-border/50 bg-background/80 backdrop-blur-sm no-print">
      <div className="container flex h-16 items-center">
        <div className="flex items-center gap-2 md:hidden">
            <SidebarTrigger className="h-8 w-8">
              <Menu className="h-5 w-5" />
            </SidebarTrigger>
            <span className="font-bold font-headline text-lg flex items-center gap-2">
              <BrainCircuit className="w-6 h-6 text-primary" />
              Equation Note
            </span>
        </div>
        
        <div className="hidden flex-1 items-center justify-center space-x-4 rtl:space-x-reverse md:flex">
            <nav className="flex items-center gap-2 rounded-full bg-secondary/80 p-1 border-border">
                {navButtons.map(({ view, label, icon: Icon }) => (
                    <Button 
                        key={view}
                        variant="ghost" 
                        size="sm"
                        onClick={() => setActiveView(view)}
                        className={cn(
                            "rounded-full transition-all duration-300",
                            activeView === view 
                                ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                                : 'hover:bg-primary/10'
                        )}
                    >
                        <Icon className="ms-2" />
                        {label}
                    </Button>
                ))}
            </nav>
        </div>
         <div className="hidden flex-1 items-center justify-end space-x-4 md:flex">
          <Button onClick={onExportPdf} variant="outline" className="border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground">
            <FileDown className="ms-2 h-4 w-4" />
            تصدير
          </Button>
        </div>
      </div>
    </header>
  );
}
