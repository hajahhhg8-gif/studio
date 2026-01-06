"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Equation } from "@/lib/types";
import { Save } from "lucide-react";
import Latex from "react-latex-next";
import { useWatch } from "react-hook-form";

interface EquationEditorProps {
    onSave: (equation: Omit<Equation, 'id'>) => void;
    initialData?: Partial<Omit<Equation, 'id'>>;
    onFinished?: () => void;
}

const formSchema = z.object({
  name: z.string().min(2, "الاسم مطلوب").max(50, "الاسم طويل جدًا"),
  latex: z.string().min(1, "كود LaTeX مطلوب"),
});

const LivePreview = ({ control }: { control: any }) => {
  const latexValue = useWatch({ control, name: 'latex' });
  return (
    <div className="mt-4">
      <FormLabel>معاينة حية</FormLabel>
      <div className="p-4 bg-background border border-dashed border-border rounded-md mt-2 text-lg text-center dir-ltr min-h-[60px] flex items-center justify-center">
        {latexValue ? <Latex>{`$$${latexValue}$$`}</Latex> : <span className="text-muted-foreground text-sm">اكتب كود LaTeX أعلاه للمعاينة</span>}
      </div>
    </div>
  );
};

export default function EquationEditor({ onSave, initialData, onFinished }: EquationEditorProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      latex: initialData?.latex || "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    onSave(values);
    if(onFinished) {
      onFinished();
    } else {
      form.reset({name: '', latex: ''});
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>اسم المعادلة</FormLabel>
              <FormControl>
                <Input placeholder="مثال: نظرية فيثاغورس" {...field} className="bg-secondary/50 border-border" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="latex"
          render={({ field }) => (
            <FormItem>
              <FormLabel>كود LaTeX</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="a^2 + b^2 = c^2"
                  className="min-h-[120px] text-left dir-ltr font-code bg-secondary/50 border-border"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LivePreview control={form.control} />
        <Button type="submit" className="w-full !mt-8">
          <Save className="ms-2" />
          {initialData ? 'تحديث المعادلة' : 'حفظ في المكتبة'}
        </Button>
      </form>
    </Form>
  );
}
