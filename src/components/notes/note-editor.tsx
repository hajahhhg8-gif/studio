"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Note } from "@/lib/types";
import { Save, Eye } from "lucide-react";
import { useState } from "react";

interface NoteEditorProps {
    onSave: (note: Omit<Note, 'id' | 'createdAt'> & { createdAt?: Date }) => void;
    initialData?: Omit<Note, 'id'>;
    onFinished?: () => void;
}

const formSchema = z.object({
  title: z.string().min(2, "العنوان مطلوب").max(100, "العنوان طويل جدًا"),
  content: z.string().min(1, "المحتوى مطلوب"),
});

export default function NoteEditor({ onSave, initialData, onFinished }: NoteEditorProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      content: initialData?.content || "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    onSave({ ...values, createdAt: new Date() });
    if (onFinished) {
      onFinished();
    } else {
      form.reset({ title: "", content: "" });
    }
  }

  const [activeTab, setActiveTab] = useState("edit");
  const contentValue = form.watch("content");


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>عنوان الملاحظة</FormLabel>
              <FormControl>
                <Input placeholder="مثال: ملخص محاضرة الأسبوع الثاني" {...field} className="bg-secondary/50 border-border" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-secondary/50">
                <TabsTrigger value="edit">
                    تعديل
                </TabsTrigger>
                <TabsTrigger value="preview">
                    <Eye className="ms-2 h-4 w-4" />
                    معاينة
                </TabsTrigger>
            </TabsList>
            <TabsContent value="edit" className="mt-4">
                <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>المحتوى (يدعم Markdown)</FormLabel>
                    <FormControl>
                        <Textarea
                        placeholder="اكتب ملاحظاتك هنا... يمكنك استخدام # للعناوين و - للقوائم."
                        className="min-h-[250px] text-right dir-rtl font-body bg-secondary/50 border-border"
                        {...field}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </TabsContent>
            <TabsContent value="preview" className="mt-4">
                <div className="prose-custom min-h-[250px] w-full rounded-md border border-border bg-secondary/50 p-4 dir-rtl text-right">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{contentValue || "لا يوجد محتوى للمعاينة."}</ReactMarkdown>
                </div>
            </TabsContent>
        </Tabs>

        <Button type="submit" className="w-full !mt-8">
          <Save className="ms-2" />
          {initialData ? 'تحديث الملاحظة' : 'حفظ الملاحظة'}
        </Button>
      </form>
    </Form>
  );
}
