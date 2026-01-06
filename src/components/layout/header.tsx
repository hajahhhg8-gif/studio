"use client";

import { Button } from "@/components/ui/button";
import { Sigma, FileDown } from "lucide-react";

interface HeaderProps {
  onExportPdf: () => void;
}

export default function Header({ onExportPdf }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <a href="/" className="flex items-center space-x-2">
            <Sigma className="h-6 w-6 text-primary" />
            <span className="inline-block font-bold font-headline text-lg">
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
