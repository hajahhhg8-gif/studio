"use client";

import { useState } from "react";
import Latex from "react-latex-next";
import ReactMarkdown from "react-markdown";
import { identifyAndConvertUnits } from "@/ai/flows/identify-and-convert-units";
import { defineEquationVariables } from "@/ai/flows/define-equation-variables";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import type { Equation } from "@/lib/types";
import { Clipboard, Copy, Edit, EllipsisVertical, Library, Loader2, Replace, Trash2, BookText, Info } from "lucide-react";
import EquationEditor from "./equation-editor";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Input } from "../ui/input";

interface EquationLibraryProps {
  equations: Equation[];
  onDelete: (id: number) => void;
  onUpdate: (id: number, updates: Partial<Omit<Equation, 'id'>>) => void;
}

export default function EquationLibrary({ equations, onDelete, onUpdate }: EquationLibraryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [convertingId, setConvertingId] = useState<number | null>(null);
  const [definingId, setDefiningId] = useState<number | null>(null);
  const [definitions, setDefinitions] = useState<string | null>(null);
  const [isDefinitionsOpen, setIsDefinitionsOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [noUnitsMessageId, setNoUnitsMessageId] = useState<number | null>(null);
  const { toast } = useToast();

  const handleConvert = async (equation: Equation) => {
    setConvertingId(equation.id);
    setNoUnitsMessageId(null);
    try {
      const result = await identifyAndConvertUnits({ equation: equation.latex });
      if (result && result.convertedEquation && result.convertedEquation !== equation.latex) {
        onUpdate(equation.id, { convertedLatex: result.convertedEquation });
        toast({
          title: "تم التحويل بنجاح",
          description: "تم تحويل الوحدات في المعادلة إلى وحدات SI الأساسية.",
          className: 'bg-secondary border-primary/50 text-foreground'
        });
      } else {
        // If the equation is the same, it means no units were found to convert.
        setNoUnitsMessageId(equation.id);
        // Clear message after a few seconds
        setTimeout(() => setNoUnitsMessageId(null), 5000);
      }
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

  const handleDefine = async (equation: Equation) => {
    setDefiningId(equation.id);
    setDefinitions(null);
    setIsDefinitionsOpen(true); // Open dialog immediately
    try {
      const result = await defineEquationVariables({ equation: equation.latex });
      if (result && result.definitions) {
        setDefinitions(result.definitions);
      } else {
         throw new Error("Invalid response from definition flow.");
      }
    } catch (error) {
      console.error("Variable definition failed:", error);
      setDefinitions("حدث خطأ أثناء محاولة شرح متغيرات المعادلة.");
    } finally {
      setDefiningId(null);
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
    setTimeout(() => {
        setEditingId(null);
    }, 150);
    setIsEditDialogOpen(false);
  }

  const filteredEquations = equations.filter(eq =>
    eq.name.toLowerCase().includes(searchQuery.toLowerCase())
  );


  return (
    <div className="space-y-8 animate-in fade-in-50">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
            <Library className="w-10 h-10 text-primary" />
            <h1 className="text-3xl font-bold font-headline md:text-4xl bg-gradient-to-r from-primary to-foreground text-transparent bg-clip-text">مكتبة المعادلات</h1>
        </div>
         <Input
            type="search"
            placeholder="ابحث عن معادلة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="md:max-w-xs bg-secondary/50 border-border"
          />
      </div>

      <div className="printable-area space-y-8">
      {filteredEquations.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-20 bg-card/50 rounded-xl border-2 border-dashed border-border">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 ring-4 ring-primary/20">
             <Library className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold font-headline">
            {searchQuery ? 'لا توجد نتائج بحث' : 'مكتبتك فارغة حاليًا'}
            </h2>
          <p className="text-muted-foreground mt-2 max-w-sm">
            {searchQuery ? 'جرّب كلمة بحث أخرى.' : 'ابدأ بإضافة بعض المعادلات من الشريط الجانبي لعرضها هنا والتحكم فيها.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredEquations.map((eq) => (
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

                  {noUnitsMessageId === eq.id && (
                     <div className="p-2 text-center text-sm text-amber-300 bg-amber-900/30 border border-amber-500/30 rounded-md flex items-center justify-center gap-2">
                        <Info size={16} />
                        المعادلة لا تحتوي على وحدات قابلة للتحويل.
                    </div>
                  )}


              </CardContent>
              <CardFooter className="no-print pt-4 flex-col items-stretch gap-2">
                 <Button
                      variant="outline"
                      className="w-full bg-secondary/80 border-border hover:bg-secondary hover:text-primary"
                      onClick={() => handleDefine(eq)}
                      disabled={definingId === eq.id}
                  >
                      {definingId === eq.id ? (
                        <Loader2 className="animate-spin ms-2 h-4 w-4" />
                      ) : (
                        <BookText className="ms-2 h-4 w-4" />
                      )}
                      شرح المتغيرات
                  </Button>
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
       <AlertDialog open={isDefinitionsOpen} onOpenChange={setIsDefinitionsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-primary"><BookText /> شرح متغيرات المعادلة</AlertDialogTitle>
             <div className="prose-custom dir-rtl text-right max-h-[50vh] overflow-y-auto mt-4 pr-4">
                {!definitions ? (
                    <div className="flex items-center justify-center gap-2 text-muted-foreground p-8">
                        <Loader2 className="animate-spin h-5 w-5" />
                        <span>جاري التحميل...</span>
                    </div>
                ) : (
                   <ReactMarkdown>{definitions}</ReactMarkdown>
                )}
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إغلاق</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
