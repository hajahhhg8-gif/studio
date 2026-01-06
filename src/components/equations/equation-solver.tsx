"use client";
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Latex from "react-latex-next";
import ReactMarkdown from 'react-markdown';
import { solveEquation } from '@/ai/flows/solve-equation';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Loader2, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  equation: z.string().min(3, "الرجاء إدخال معادلة صالحة"),
});

const EquationSolver = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [solution, setSolution] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      equation: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setSolution(null);
    try {
      const result = await solveEquation({ equation: values.equation });
      setSolution(result.solution);
    } catch (error) {
      console.error('Failed to solve equation:', error);
      toast({
        variant: 'destructive',
        title: 'فشل حل المعادلة',
        description: 'حدث خطأ أثناء محاولة حل المعادلة. الرجاء المحاولة مرة أخرى.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in-50">
       <div className="flex items-center gap-4 mb-6">
        <Bot className="w-10 h-10 text-primary" />
        <h1 className="text-3xl font-bold font-headline md:text-4xl">حلّال المعادلات الذكي</h1>
      </div>

      <Card className="bg-background/50 border-border/80">
        <CardHeader>
          <CardTitle className="font-headline text-xl text-primary-foreground">أدخل المعادلة</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="equation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">المعادلة</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="مثال: 2*x + 5 = 15"
                        className="min-h-[100px] text-left dir-ltr font-code text-lg bg-secondary/80 border-border"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full text-lg py-6">
                {isLoading ? (
                  <Loader2 className="animate-spin ms-2" />
                ) : (
                  <Wand2 className="ms-2" />
                )}
                {isLoading ? 'جاري الحل...' : 'حل المعادلة'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {solution && (
        <Card className="bg-background/50 border-primary/30">
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center gap-2 text-primary">
              <Bot />
              خطوات الحل
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-invert prose-p:text-foreground prose-h3:text-primary prose-h3:font-headline prose-code:text-green-400 prose-code:font-code dir-ltr text-left bg-secondary/50 p-4 rounded-md">
               <ReactMarkdown
                 components={{
                   p: ({...props}) => <p className="text-foreground" {...props} />,
                   h3: ({...props}) => <h3 className="text-primary" {...props} />,
                   code({node, inline, className, children, ...props}) {
                     const match = /language-(\w+)/.exec(className || '')
                     if(inline) {
                        return <Latex>{`$${String(children)}$`}</Latex>
                     }
                     return <Latex>{`$$${String(children)}$$`}</Latex>
                   }
                 }}
               >
                 {solution}
               </ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EquationSolver;
