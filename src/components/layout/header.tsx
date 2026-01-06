"use client";

import { Button } from "@/components/ui/button";
import { BrainCircuit, FileDown } from "lucide-react";

interface HeaderProps {
  onExportPdf: () => void;
}

export default function Header({ onExportPdf }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/50 backdrop-blur-sm">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <a href="/" className="flex items-center space-x-2">
            <BrainCircuit className="h-7 w-7 text-primary" />
            <span className="inline-block font-bold font-headline text-xl">
              معادلة ايس
            </span>
          </a>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <Button onClick={onExportPdf} className="no-print">
            <FileDown className="ms-2 h-4 w-4" />
            تصدير إلى PDF
          </Button>
        </div>
      </div>
    </header>
  );
}
