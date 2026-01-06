"use client";

import { useState } from "react";
import Latex from "react-latex-next";
import { identifyAndConvertUnits } from "@/ai/flows/identify-and-convert-units";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import type { Equation } from "@/lib/types";
import { Clipboard, Copy, Edit, EllipsisVertical, Library, Loader2, Replace, Trash2 } from "lucide-react";
import EquationEditor from "./equation-editor";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

interface EquationLibraryProps {
  equations: Equation[];
  onDelete: (id: number) => void;
  onUpdate: (id: number, updates: Partial<Omit<Equation, 'id'>>) => void;
}

export default function EquationLibrary({ equations, onDelete, onUpdate }: EquationLibraryProps) {
  const [convertingId, setConvertingId] = useState<number | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const { toast } = useToast();

  const handleConvert = async (equation: Equation) => {
    setConvertingId(equation.id);
    try {
      const result = await identifyAndConvertUnits({ equation: equation.latex });
      if (result && result.convertedEquation) {
        onUpdate(equation.id, { convertedLatex: result.convertedEquation });
        toast({
          title: "تم التحويل بنجاح",
          description: "تم تحويل الوحدات في المعادلة إلى وحدات SI الأساسية.",
          className: 'bg-secondary border-primary/50 text-foreground'
        });
      } else {
        throw new Error("Invalid response from conversion flow.");
      }
    } catch (error) {
      console.error("Unit conversion failed:", error);
      toast({
        variant: "destructive",
        title: "فشل التحويل",
        description: "حدث خطأ أثناء محاولة تحويل الوحدات. قد تكون المعادلة لا تحتوي على وحدات قابلة للتحويل.",
      });
    } finally {
      setConvertingId(null);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "تم النسخ",
      description: `تم نسخ ${type} إلى الحافظة.`,
      className: 'bg-secondary border-primary/50 text-foreground'
    });
  };

  const openEditDialog = (id: number) => {
    setEditingId(id);
    setIsEditDialogOpen(true);
  }

  const closeEditDialog = () => {
    // A small delay to allow the dialog to close before resetting the ID
    setTimeout(() => {
        setEditingId(null);
    }, 150);
    setIsEditDialogOpen(false);
  }


  return (
    <div className="printable-area space-y-8 animate-in fade-in-50">
      <div className="flex items-center gap-4 mb-6">
        <Library className="w-10 h-10 text-primary" />
        <h1 className="text-3xl font-bold font-headline md:text-4xl bg-gradient-to-r from-primary to-foreground text-transparent bg-clip-text">مكتبة المعادلات</h1>
      </div>

      {equations.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-20 bg-card/50 rounded-xl border-2 border-dashed border-border">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 ring-4 ring-primary/20">
             <Library className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold font-headline">مكتبتك فارغة حاليًا</h2>
          <p className="text-muted-foreground mt-2 max-w-sm">
            ابدأ بإضافة بعض المعادلات من الشريط الجانبي لعرضها هنا والتحكم فيها.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {equations.map((eq) => (
            <Card key={eq.id} className="flex flex-col bg-card/80 backdrop-blur-sm border-border/80 hover:border-primary/50 transition-all duration-300 shadow-lg hover:shadow-primary/10">
              <CardHeader className="flex-row items-start justify-between">
                <CardTitle className="font-headline text-xl flex-1 text-foreground">{eq.name}</CardTitle>
                <Dialog open={isEditDialogOpen && editingId === eq.id} onOpenChange={setIsEditDialogOpen}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 no-print text-muted-foreground hover:text-primary hover:bg-primary/10">
                        <EllipsisVertical className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-secondary border-border/60">
                      <DropdownMenuItem onSelect={() => openEditDialog(eq.id)}>
                          <Edit className="ms-2" />
                          تعديل
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => copyToClipboard(eq.latex, 'كود LaTeX')}>
                        <Clipboard className="ms-2" />
                        نسخ كود LaTeX
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => copyToClipboard(`$$${eq.latex}$$`, 'المعادلة')}>
                        <Copy className="ms-2" />
                        نسخ المعادلة
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-border/50" />
                      <DropdownMenuItem onClick={() => onDelete(eq.id)} className="text-destructive focus:text-destructive">
                        <Trash2 className="ms-2" />
                        حذف
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DialogContent onOpenAutoFocus={(e) => e.preventDefault()} className="bg-background border-primary/50">
                    <DialogHeader>
                      <DialogTitle>تعديل المعادلة</DialogTitle>
                    </DialogHeader>
                    <EquationEditor 
                      onSave={(updates) => onUpdate(eq.id, updates)} 
                      initialData={eq} 
                      onFinished={closeEditDialog}
                    />
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                 <div>
                    <div className="p-4 bg-black/30 rounded-md text-lg text-center dir-ltr text-foreground overflow-x-auto border border-border shadow-inner min-h-[80px] flex items-center justify-center">
                      <Latex>{`$$${eq.latex}$$`}</Latex>
                    </div>
                  </div>

                  {eq.convertedLatex && (
                    <div>
                      <h4 className="font-semibold mb-2 text-primary text-sm flex items-center gap-2">بعد تحويل الوحدات (SI) <Replace size={16}/></h4>
                       <div className="p-4 bg-black/30 rounded-md text-lg text-center dir-ltr text-foreground font-code overflow-x-auto border border-border shadow-inner">
                        <Latex>{`$$${eq.convertedLatex}$$`}</Latex>
                      </div>
                    </div>
                  )}

              </CardContent>
              <CardFooter className="no-print pt-4">
                 <Button
                      variant="outline"
                      className="w-full bg-secondary/80 border-border hover:bg-secondary hover:text-primary"
                      onClick={() => handleConvert(eq)}
                      disabled={convertingId === eq.id}
                    >
                      {convertingId === eq.id ? (
                        <Loader2 className="animate-spin ms-2 h-4 w-4" />
                      ) : (
                        <Replace className="ms-2 h-4 w-4" />
                      )}
                      تحويل الوحدات
                    </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
