"use client";

import { useState } from "react";
import Latex from "react-latex-next";
import { identifyAndConvertUnits } from "@/ai/flows/identify-and-convert-units";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { Equation } from "@/lib/types";
import { Library, Loader2, Scale, Trash2 } from "lucide-react";

interface EquationLibraryProps {
  equations: Equation[];
  onDelete: (id: number) => void;
  onUpdate: (id: number, updates: Partial<Equation>) => void;
}

export default function EquationLibrary({ equations, onDelete, onUpdate }: EquationLibraryProps) {
  const [convertingId, setConvertingId] = useState<number | null>(null);
  const { toast } = useToast();

  const handleConvert = async (equation: Equation) => {
    setConvertingId(equation.id);
    try {
      const result = await identifyAndConvertUnits({ equation: equation.latex });
      onUpdate(equation.id, { convertedLatex: result.convertedEquation });
      toast({
        title: "تم التحويل بنجاح",
        description: "تم تحويل الوحدات في المعادلة إلى وحدات SI الأساسية.",
      });
    } catch (error) {
      console.error("Unit conversion failed:", error);
      toast({
        variant: "destructive",
        title: "فشل التحويل",
        description: "حدث خطأ أثناء محاولة تحويل الوحدات.",
      });
    } finally {
      setConvertingId(null);
    }
  };

  return (
    <div className="printable-area">
      <div className="flex items-center gap-4 mb-4">
        <Library className="w-8 h-8 text-primary" />
        <h2 className="text-2xl font-bold font-headline">مكتبة المعادلات</h2>
      </div>

      {equations.length === 0 ? (
        <Card className="text-center py-12 bg-card/50">
          <CardHeader>
            <CardTitle>مكتبتك فارغة</CardTitle>
            <CardDescription>ابدأ بإضافة بعض المعادلات لعرضها هنا.</CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <Accordion type="multiple" className="w-full space-y-4">
          {equations.map((eq) => (
            <AccordionItem value={`item-${eq.id}`} key={eq.id} className="bg-card/70 border-border/50 rounded-lg shadow-md backdrop-blur-sm">
              <AccordionTrigger className="px-6 py-4 text-lg font-semibold hover:no-underline text-foreground">
                {eq.name}
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <div className="space-y-6">
                  {/* Original Equation */}
                  <div>
                    <h4 className="font-semibold mb-2 text-muted-foreground">المعادلة الأصلية</h4>
                    <div className="p-4 bg-background/50 rounded-md text-lg text-center dir-ltr text-foreground">
                      <Latex>{`$$${eq.latex}$$`}</Latex>
                    </div>
                    <p className="mt-2 p-3 bg-slate-900/80 text-cyan-300 rounded-md font-code text-sm text-left dir-ltr break-all">{eq.latex}</p>
                  </div>

                  {/* Converted Equation */}
                  {eq.convertedLatex && (
                    <div>
                      <h4 className="font-semibold mb-2 text-muted-foreground">بعد تحويل الوحدات (SI)</h4>
                       <div className="p-4 bg-background/50 rounded-md text-lg text-center dir-ltr text-foreground">
                        <Latex>{`$$${eq.convertedLatex}$$`}</Latex>
                      </div>
                      <p className="mt-2 p-3 bg-slate-900/80 text-cyan-300 rounded-md font-code text-sm text-left dir-ltr break-all">{eq.convertedLatex}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 justify-end pt-2 no-print">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleConvert(eq)}
                      disabled={convertingId === eq.id}
                      className="bg-secondary/50 border-secondary-foreground/20 hover:bg-secondary/80"
                    >
                      {convertingId === eq.id ? (
                        <Loader2 className="animate-spin ms-2 h-4 w-4" />
                      ) : (
                        <Scale className="ms-2 h-4 w-4" />
                      )}
                      تحويل الوحدات
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => onDelete(eq.id)} className="bg-red-500/20 border border-red-500/50 hover:bg-red-500/40 text-red-300">
                      <Trash2 className="ms-2 h-4 w-4" />
                      حذف
                    </Button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
}
