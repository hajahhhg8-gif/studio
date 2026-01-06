"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { FunctionSquare, Loader2, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { plotFunction } from '@/ai/flows/plot-function';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
    expression: z.string().min(1, 'الرجاء إدخال دالة'),
    min: z.coerce.number().default(-10),
    max: z.coerce.number().default(10),
    steps: z.coerce.number().min(10, 'يجب أن تكون الخطوات 10 على الأقل').max(500, 'يجب أن تكون الخطوات 500 على الأكثر').default(100),
});

type FormData = z.infer<typeof formSchema>;

export default function FunctionPlotter() {
    const [data, setData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            expression: 'x^2',
            min: -10,
            max: 10,
            steps: 100,
        },
    });

    const onSubmit = async (values: FormData) => {
        setIsLoading(true);
        setData([]);
        try {
            const result = await plotFunction(values);
            setData(result.points);
            toast({
                title: 'تم رسم الدالة بنجاح',
                className: 'bg-secondary border-primary/50 text-foreground',
            });
        } catch (error: any) {
            console.error('Failed to plot function:', error);
            toast({
                variant: 'destructive',
                title: 'فشل رسم الدالة',
                description: error.message || 'حدث خطأ أثناء محاولة حساب نقاط الدالة. تأكد من أن التعبير صحيح.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in-50">
            <div className="flex items-center gap-4 mb-6">
                <FunctionSquare className="w-10 h-10 text-primary" />
                <h1 className="text-3xl font-bold font-headline md:text-4xl bg-gradient-to-r from-primary to-foreground text-transparent bg-clip-text">راسم الدوال</h1>
            </div>

            <Card className="bg-card/80 backdrop-blur-sm border-border/80">
                <CardHeader>
                    <CardTitle className="font-headline text-xl text-foreground">إعدادات الرسم</CardTitle>
                    <CardDescription>أدخل دالة في متغير واحد (x)، وحدد النطاق لرسمها.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="expression"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>الدالة (y = f(x))</FormLabel>
                                        <FormControl>
                                            <Input placeholder="مثال: sin(x) / x" {...field} className="bg-secondary/50 border-border dir-ltr text-left font-code" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FormField
                                    control={form.control}
                                    name="min"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>x الأدنى</FormLabel>
                                            <FormControl>
                                                <Input type="number" {...field} className="bg-secondary/50 border-border" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="max"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>x الأقصى</FormLabel>
                                            <FormControl>
                                                <Input type="number" {...field} className="bg-secondary/50 border-border" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="steps"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>عدد النقاط</FormLabel>
                                            <FormControl>
                                                <Input type="number" {...field} className="bg-secondary/50 border-border" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <Button type="submit" disabled={isLoading} className="w-full text-lg py-6">
                                {isLoading ? <Loader2 className="animate-spin ms-2" /> : <Play className="ms-2" />}
                                {isLoading ? 'جاري الحساب...' : 'ارسم الدالة'}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            {data.length > 0 && (
                <Card className="bg-card/80 backdrop-blur-sm border-primary/30">
                    <CardHeader>
                        <CardTitle className="font-headline text-xl flex items-center gap-2 text-primary">الرسم البياني</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="w-full h-96 pr-8">
                             <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                                    <XAxis dataKey="x" type="number" domain={['dataMin', 'dataMax']} stroke="hsl(var(--foreground))" />
                                    <YAxis stroke="hsl(var(--foreground))" />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--background))',
                                            borderColor: 'hsl(var(--primary))',
                                            color: 'hsl(var(--foreground))'
                                        }}
                                        labelStyle={{ color: 'hsl(var(--primary))' }}
                                    />
                                    <Legend wrapperStyle={{ color: 'hsl(var(--foreground))' }} />
                                    <Line type="monotone" dataKey="y" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} name={form.getValues('expression')} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
