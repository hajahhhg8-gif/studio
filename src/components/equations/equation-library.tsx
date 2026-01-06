"use client";

import { useState } from "react";
import { identifyAndConvertUnits } from "@/ai/flows/identify-and-convert-units";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
        <Card className="text-center py-12">
          <CardHeader>
            <CardTitle>مكتبتك فارغة</CardTitle>
            <CardDescription>ابدأ بإضافة بعض المعادلات لعرضها هنا.</CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <Accordion type="multiple" className="w-full space-y-4">
          {equations.map((eq) => (
            <AccordionItem value={`item-${eq.id}`} key={eq.id} className="bg-card border rounded-lg shadow-sm">
              <AccordionTrigger className="px-6 py-4 text-lg font-semibold hover:no-underline">
                {eq.name}
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-1 text-muted-foreground">كود LaTeX</h4>
                    <p className="p-3 bg-muted rounded-md font-code text-left dir-ltr break-all">{eq.latex}</p>
                  </div>
                  {eq.convertedLatex && (
                    <div>
                      <h4 className="font-semibold mb-1 text-muted-foreground">بعد تحويل الوحدات</h4>
                      <p className="p-3 bg-muted rounded-md font-code text-left dir-ltr break-all">{eq.convertedLatex}</p>
                    </div>
                  )}
                  <div className="flex gap-2 justify-end pt-2 no-print">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleConvert(eq)}
                      disabled={convertingId === eq.id}
                    >
                      {convertingId === eq.id ? (
                        <Loader2 className="animate-spin ms-2 h-4 w-4" />
                      ) : (
                        <Scale className="ms-2 h-4 w-4" />
                      )}
                      تحويل الوحدات
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => onDelete(eq.id)}>
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
