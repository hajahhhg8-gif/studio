"use client";

import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bot, FileDown, Library, Menu, SigmaSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onExportPdf: () => void;
  activeView: 'library' | 'solver';
  setActiveView: (view: 'library' | 'solver') => void;
}

export default function Header({ onExportPdf, activeView, setActiveView }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-border/50 bg-background/50 backdrop-blur-sm no-print">
      <div className="container flex h-16 items-center">
        <div className="flex items-center gap-2 md:hidden">
            <SidebarTrigger className="h-8 w-8">
              <Menu className="h-5 w-5" />
            </SidebarTrigger>
            <span className="font-bold font-headline text-lg flex items-center gap-2">
              <SigmaSquare className="w-6 h-6 text-primary" />
              Equation Ace
            </span>
        </div>
        
        <div className="hidden flex-1 items-center justify-center space-x-4 md:flex">
            <nav className="flex items-center gap-2 rounded-full bg-secondary/80 p-1 border-border">
                <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setActiveView('library')}
                    className={cn(
                        "rounded-full",
                        activeView === 'library' && 'bg-primary/20 text-primary hover:bg-primary/30'
                    )}
                >
                    <Library className="ms-2" />
                    المكتبة
                </Button>
                <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setActiveView('solver')}
                    className={cn(
                        "rounded-full",
                        activeView === 'solver' && 'bg-primary/20 text-primary hover:bg-primary/30'
                    )}
                >
                    <Bot className="ms-2" />
                    حلّال المعادلات
                </Button>
            </nav>
        </div>
         <div className="hidden flex-1 items-center justify-end space-x-4 md:flex">
          <Button onClick={onExportPdf} variant="ghost">
            <FileDown className="ms-2 h-4 w-4" />
            تصدير إلى PDF
          </Button>
        </div>
      </div>
    </header>
  );
}
