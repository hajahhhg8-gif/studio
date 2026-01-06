"use client";

import { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { recognizeHandwrittenFormula } from "@/ai/flows/recognize-handwritten-formula";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, ScanSearch } from "lucide-react";
import type { Equation } from "@/lib/types";
import Latex from 'react-latex-next';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";

interface FormulaRecognizerProps {
  onSave: (equation: Omit<Equation, 'id'>) => void;
}

const formSchema = z.object({
  name: z.string().min(2, "الاسم مطلوب").max(50, "الاسم طويل جدًا"),
});

export default function FormulaRecognizer({ onSave }: FormulaRecognizerProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageData, setImageData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [recognizedLatex, setRecognizedLatex] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "" },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setRecognizedLatex(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setImageData(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRecognize = async () => {
    if (!imageData) {
      toast({ variant: "destructive", title: "خطأ", description: "الرجاء تحديد صورة أولاً." });
      return;
    }
    setIsLoading(true);
    setRecognizedLatex(null);
    try {
      const result = await recognizeHandwrittenFormula({ photoDataUri: imageData });
      setRecognizedLatex(result.latexFormula);
      toast({ title: "تم التعرف بنجاح", description: "يمكنك الآن حفظ المعادلة.", className: 'bg-secondary border-primary/50 text-foreground' });
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "فشل التعرف", description: "حدث خطأ أثناء محاولة التعرف على المعادلة." });
    } finally {
      setIsLoading(false);
    }
  };

  function onSaveSubmit(values: z.infer<typeof formSchema>) {
    if (recognizedLatex) {
      onSave({ name: values.name, latex: recognizedLatex });
      // Reset state
      form.reset({ name: '' });
      setRecognizedLatex(null);
      setImagePreview(null);
      setImageData(null);
    }
  }

  return (
    <div className="space-y-4">
        <div>
          <Label htmlFor="formula-image" className="sr-only">صورة المعادلة</Label>
          <Input id="formula-image" type="file" accept="image/*" onChange={handleFileChange} className="bg-secondary/50 border-border file:text-primary file:font-bold"/>
        </div>

        {imagePreview && (
          <div className="border-2 border-dashed border-border rounded-md p-2 flex justify-center bg-background/50">
            <Image src={imagePreview} alt="Formula preview" width={300} height={150} style={{ objectFit: 'contain' }} className="rounded-sm" />
          </div>
        )}

        <Button onClick={handleRecognize} disabled={!imagePreview || isLoading} className="w-full">
          {isLoading ? <Loader2 className="animate-spin ms-2" /> : <ScanSearch className="ms-2 h-4 w-4" />}
          {isLoading ? "جاري التعرف..." : "تعرف على المعادلة"}
        </Button>

        {recognizedLatex && (
          <Card className="space-y-4 pt-4 bg-transparent border-t border-primary/20 shadow-none rounded-none">
            <CardContent className="p-0 space-y-6">
                <div>
                    <h3 className="font-semibold mb-2 text-primary">المعادلة المعترف بها:</h3>
                    <div className="p-4 bg-secondary rounded-md text-lg text-center dir-ltr text-foreground overflow-x-auto border border-border">
                        <Latex>{`$$${recognizedLatex}$$`}</Latex>
                    </div>
                </div>
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSaveSubmit)} className="space-y-4">
                    <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>اسم المعادلة للحفظ</FormLabel>
                        <FormControl>
                            <Input placeholder="اسم وصفي للمعادلة" {...field} className="bg-secondary/50 border-border" />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <Button type="submit" className="w-full">
                        <Save className="ms-2" />
                        حفظ في المكتبة
                    </Button>
                </form>
                </Form>
            </CardContent>
          </Card>
        )}
      </div>
  );
}
