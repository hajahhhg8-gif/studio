"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FilePenLine, ScanSearch } from "lucide-react";
import EquationEditor from "./equation-editor";
import FormulaRecognizer from "./formula-recognizer";
import type { Equation } from "@/lib/types";

interface EquationInputTabsProps {
    onSave: (equation: Omit<Equation, 'id'>) => void;
}

export default function EquationInputTabs({ onSave }: EquationInputTabsProps) {
  return (
    <div className="w-full space-y-6">
      <h2 className="text-xl font-bold font-headline text-center text-primary">إضافة معادلة جديدة</h2>
      <Tabs defaultValue="manual" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-secondary/50">
          <TabsTrigger value="manual">
            <FilePenLine className="ms-2 h-4 w-4" />
            إدخال يدوي
          </TabsTrigger>
          <TabsTrigger value="image">
            <ScanSearch className="ms-2 h-4 w-4" />
            تعرف من صورة
          </TabsTrigger>
        </TabsList>
        <TabsContent value="manual" className="mt-6">
          <EquationEditor onSave={onSave} />
        </TabsContent>
        <TabsContent value="image" className="mt-6">
          <FormulaRecognizer onSave={onSave} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
