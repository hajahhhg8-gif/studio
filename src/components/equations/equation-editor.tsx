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

interface EquationEditorProps {
    onSave: (equation: Omit<Equation, 'id'>) => void;
    initialData?: Partial<Omit<Equation, 'id'>>;
    onFinished?: () => void;
}

const formSchema = z.object({
  name: z.string().min(2, "الاسم مطلوب").max(50, "الاسم طويل جدًا"),
  latex: z.string().min(1, "كود LaTeX مطلوب"),
});

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
      form.reset();
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
                <Input placeholder="مثال: نظرية فيثاغورس" {...field} />
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
                  className="min-h-[120px] text-left dir-ltr font-code"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          <Save className="ms-2" />
          {initialData ? 'تحديث المعادلة' : 'حفظ في المكتبة'}
        </Button>
      </form>
    </Form>
  );
}
