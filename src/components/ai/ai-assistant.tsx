"use client";

import { useState } from 'react';
import { Bot, Loader2, Send, Sparkles, X, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { scientificAssistant } from '@/ai/flows/scientific-assistant';
import type { Equation, Note } from '@/lib/types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Latex from 'react-latex-next';
import { cn } from '@/lib/utils';


type Message = {
    role: 'user' | 'assistant';
    content: string;
};

interface AiAssistantProps {
    equations: Equation[];
    notes: Note[];
    addNote: (note: Omit<Note, 'id' | 'createdAt'>) => void;
    addEquation: (equation: Omit<Equation, 'id'>) => void;
}

export default function AiAssistant({ equations, notes, addNote, addEquation }: AiAssistantProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const quickActions = [
        { label: 'اشتقاق معادلة', command: 'اشتق المعادلة ' },
        { label: 'تكامل معادلة', command: 'كامل المعادلة ' },
        { label: 'تبسيط تعبير', command: 'بسط التعبير ' },
        { label: 'حل معادلة', command: 'حل المعادلة ' },
    ];

    const handleSubmit = async (command?: string) => {
        const userMessage = command ? command : input;
        if (!userMessage.trim()) return;

        const newMessages: Message[] = [...messages, { role: 'user', content: userMessage }];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        try {
            const result = await scientificAssistant({
                chatHistory: newMessages.slice(0, -1),
                request: userMessage,
                equations: equations,
                notes: notes,
            });
            
            // Handle tool calls for adding notes/equations
            if (result.toolResponse) {
                if (result.toolResponse.tool === 'addNote') {
                    const { title, content } = result.toolResponse.data;
                    addNote({ title, content });
                } else if (result.toolResponse.tool === 'addEquation') {
                    const { name, latex } = result.toolResponse.data;
                    addEquation({ name, latex });
                }
            }

            setMessages([...newMessages, { role: 'assistant', content: result.response }]);
        } catch (error) {
            console.error('AI assistant error:', error);
            toast({
                variant: 'destructive',
                title: 'خطأ في المساعد الذكي',
                description: 'حدث خطأ غير متوقع. الرجاء المحاولة مرة أخرى.',
            });
             setMessages([...newMessages, { role: 'assistant', content: "عذراً، لقد واجهت خطأ. الرجاء المحاولة مرة أخرى." }]);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <>
            <div className={cn("fixed bottom-6 right-6 z-50 transition-transform duration-300", isOpen ? "translate-x-[1000px]" : "translate-x-0")}>
                <Button
                    onClick={() => setIsOpen(true)}
                    className="rounded-full w-16 h-16 bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 hover:scale-110 active:scale-100 transition-transform"
                >
                    <Sparkles className="w-8 h-8" />
                    <span className="sr-only">افتح المساعد الذكي</span>
                </Button>
            </div>

            <div className={cn(
                "fixed inset-0 md:inset-auto md:bottom-6 md:right-6 z-50 w-full h-full md:w-[440px] md:h-[calc(100vh-48px)] md:max-h-[700px] transition-all duration-500 ease-in-out",
                isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full md:translate-y-4 pointer-events-none'
            )}>
                <Card className="flex flex-col h-full w-full bg-background/80 backdrop-blur-xl border-primary/50 shadow-2xl shadow-primary/20 md:rounded-2xl">
                    <CardHeader className="flex-row items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-primary font-headline">
                            <Sparkles />
                            المساعد العلمي
                        </CardTitle>
                        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-muted-foreground">
                            <X />
                        </Button>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-hidden p-0">
                        <ScrollArea className="h-full">
                            <div className="p-4 space-y-4">
                                {messages.length === 0 && (
                                     <div className="text-center p-8 space-y-4 text-muted-foreground">
                                        <Bot size={48} className="mx-auto text-primary/50" />
                                        <h3 className="font-semibold text-lg text-foreground">كيف يمكنني مساعدتك اليوم؟</h3>
                                        <p className="text-sm">يمكنك أن تسألني عن أي شيء علمي، أو تطلب مني تنفيذ مهام مثل "اشتقاق" أو "تكامل".</p>
                                        <div className='pt-4'>
                                             <h4 className="font-semibold text-foreground mb-2">أو جرب أحد الأوامر السريعة:</h4>
                                             <div className='flex flex-wrap gap-2 justify-center'>
                                                 {quickActions.map(action => (
                                                     <Button key={action.label} variant='outline' size='sm' onClick={() => handleSubmit(action.command)}>{action.label}</Button>
                                                 ))}
                                             </div>
                                        </div>
                                    </div>
                                )}
                                {messages.map((message, index) => (
                                    <div
                                        key={index}
                                        className={cn(
                                            "flex gap-3 text-sm",
                                            message.role === 'user' ? 'justify-end' : 'justify-start'
                                        )}
                                    >
                                        <div className={cn(
                                            "rounded-2xl p-3 max-w-[85%]",
                                            message.role === 'user'
                                                ? 'bg-primary text-primary-foreground rounded-br-none'
                                                : 'bg-secondary text-secondary-foreground rounded-bl-none'
                                        )}>
                                             <div className="prose-custom prose-sm text-foreground">
                                                <ReactMarkdown
                                                    components={{
                                                        p: ({...props}) => <p className="text-current" {...props} />,
                                                        code({node, inline, className, children, ...props}) {
                                                            if (inline) {
                                                                return <Latex>{`$${String(children)}$`}</Latex>
                                                            }
                                                            return <div className="text-center dir-ltr my-2 bg-black/20 p-2 rounded"><Latex>{`$$${String(children)}$$`}</Latex></div>
                                                        }
                                                    }}
                                                    remarkPlugins={[remarkGfm]}
                                                >
                                                    {message.content}
                                                </ReactMarkdown>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {isLoading && (
                                     <div className="flex justify-start gap-3 text-sm">
                                         <div className="bg-secondary text-secondary-foreground rounded-2xl p-3 rounded-bl-none flex items-center gap-2">
                                             <Loader2 className="animate-spin w-4 h-4" />
                                            <span>يفكر...</span>
                                         </div>
                                     </div>
                                )}
                            </div>
                        </ScrollArea>
                    </CardContent>
                    <CardFooter className="p-2 border-t border-border/50">
                       <div className="flex items-center w-full gap-2 relative">
                            <Textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="اسأل عن أي شيء..."
                                className="w-full resize-none border-0 shadow-none focus-visible:ring-0 bg-transparent pr-20"
                                rows={1}
                            />
                            <div className='absolute left-2 flex items-center'>
                                <Button type="submit" size="icon" onClick={() => handleSubmit()} disabled={isLoading || !input.trim()}>
                                    <Send />
                                </Button>
                            </div>
                       </div>
                    </CardFooter>
                </Card>
            </div>
        </>
    );
}
