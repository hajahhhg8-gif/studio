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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Equation } from "@/lib/types";

interface EquationEditorProps {
    onSave: (equation: Omit<Equation, 'id'>) => void;
}

const formSchema = z.object({
  name: z.string().min(2, "الاسم مطلوب").max(50, "الاسم طويل جدًا"),
  latex: z.string().min(1, "كود LaTeX مطلوب"),
});

export default function EquationEditor({ onSave }: EquationEditorProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      latex: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    onSave(values);
    form.reset();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">محرر المعادلات</CardTitle>
      </CardHeader>
      <CardContent>
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
            <Button type="submit" className="w-full">حفظ في المكتبة</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
