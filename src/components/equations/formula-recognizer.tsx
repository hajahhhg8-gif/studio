"use client";

import { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { recognizeHandwrittenFormula } from "@/ai/flows/recognize-handwritten-formula";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload } from "lucide-react";
import type { Equation } from "@/lib/types";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

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
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      const dataReader = new FileReader();
      dataReader.onloadend = () => {
        setImageData(dataReader.result as string);
      };
      dataReader.readAsDataURL(file);
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
      form.reset();
      setRecognizedLatex(null);
      setImagePreview(null);
      setImageData(null);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">التعرف على الصيغة</CardTitle>
        <CardDescription>
          قم بتحميل صورة لمعادلة مكتوبة بخط اليد وسيقوم الذكاء الاصطناعي بتحويلها إلى LaTeX.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="formula-image" className="mb-2 block">صورة المعادلة</Label>
          <Input id="formula-image" type="file" accept="image/*" onChange={handleFileChange} />
        </div>

        {imagePreview && (
          <div className="border rounded-md p-2 flex justify-center bg-muted/50">
            <Image src={imagePreview} alt="Formula preview" width={300} height={150} style={{ objectFit: 'contain' }} />
          </div>
        )}

        <Button onClick={handleRecognize} disabled={!imagePreview || isLoading} className="w-full">
          {isLoading ? <Loader2 className="animate-spin ms-2" /> : <Upload className="ms-2 h-4 w-4" />}
          {isLoading ? "جاري التعرف..." : "تعرف على المعادلة"}
        </Button>

        {recognizedLatex && (
          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-semibold">النتيجة:</h3>
            <p className="p-3 bg-muted rounded-md font-code text-left dir-ltr break-all">{recognizedLatex}</p>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSaveSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>اسم المعادلة للحفظ</FormLabel>
                      <FormControl>
                        <Input placeholder="اسم وصفي للمعادلة" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">حفظ في المكتبة</Button>
              </form>
            </Form>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
