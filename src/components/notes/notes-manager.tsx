"use client";

import { useState } from 'react';
import type { Note } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PlusCircle, NotebookText, Trash2, Edit, Eye } from 'lucide-react';
import NoteEditor from './note-editor';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from '../ui/input';


interface NotesManagerProps {
    notes: Note[];
    onAdd: (note: Omit<Note, 'id'>) => void;
    onUpdate: (id: number, updates: Partial<Omit<Note, 'id'>>) => void;
    onDelete: (id: number) => void;
}

export default function NotesManager({ notes, onAdd, onUpdate, onDelete }: NotesManagerProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);

    const openViewDialog = (note: Note) => {
        setSelectedNote(note);
        setIsViewDialogOpen(true);
    };

    const openEditDialog = (note: Note) => {
        setSelectedNote(note);
        setIsEditDialogOpen(true);
    };

    const filteredNotes = notes.filter(note =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in-50">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                    <NotebookText className="w-10 h-10 text-primary" />
                    <h1 className="text-3xl font-bold font-headline md:text-4xl bg-gradient-to-r from-primary to-foreground text-transparent bg-clip-text">ملاحظاتي</h1>
                </div>
                 <div className='flex items-center gap-2'>
                    <Input
                        type="search"
                        placeholder="ابحث عن ملاحظة..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="md:max-w-xs bg-secondary/50 border-border"
                    />
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className='shrink-0'>
                                <PlusCircle className="ms-2" />
                                ملاحظة جديدة
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px] bg-background border-primary/50">
                            <DialogHeader>
                                <DialogTitle>إضافة ملاحظة جديدة</DialogTitle>
                            </DialogHeader>
                            <NoteEditor onSave={onAdd} onFinished={() => setIsAddDialogOpen(false)} />
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {filteredNotes.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-20 bg-card/50 rounded-xl border-2 border-dashed border-border">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 ring-4 ring-primary/20">
                        <NotebookText className="w-10 h-10 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold font-headline">
                        {searchQuery ? 'لا توجد نتائج بحث' : 'لا يوجد ملاحظات بعد'}
                    </h2>
                    <p className="text-muted-foreground mt-2 max-w-sm">
                        {searchQuery ? 'جرّب كلمة بحث أخرى.' : 'ابدأ بتدوين أفكارك وملخصاتك بالضغط على "ملاحظة جديدة".'}
                    </p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {filteredNotes.map((note) => (
                        <Card key={note.id} className="flex flex-col bg-card/80 backdrop-blur-sm border-border/80 hover:border-primary/50 transition-all duration-300 shadow-lg hover:shadow-primary/10">
                            <CardHeader>
                                <CardTitle className="font-headline text-xl text-foreground truncate">{note.title}</CardTitle>
                                <CardDescription>
                                    {format(new Date(note.createdAt), "d MMMM yyyy", { locale: ar })}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <p className="text-muted-foreground line-clamp-3">
                                    {note.content.replace(/#/g, '')}
                                </p>
                            </CardContent>
                            <CardContent className="flex items-center justify-end gap-2 pt-4">
                               <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive/80 hover:text-destructive hover:bg-destructive/10">
                                      <Trash2 size={18} />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        سيتم حذف هذه الملاحظة بشكل دائم. لا يمكن التراجع عن هذا الإجراء.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => onDelete(note.id)}>
                                        حذف
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>

                                <Button variant="ghost" size="icon" className="h-8 w-8 text-foreground/80 hover:text-primary hover:bg-primary/10" onClick={() => openEditDialog(note)}>
                                    <Edit size={18} />
                                </Button>
                                <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground" onClick={() => openViewDialog(note)}>
                                    <Eye className="ms-2" />
                                    عرض
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
            
            {/* View Note Dialog */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="sm:max-w-[800px] h-[80vh] flex flex-col bg-background border-primary/50">
                    <DialogHeader>
                        <DialogTitle className="font-headline text-2xl text-primary">{selectedNote?.title}</DialogTitle>
                        <DialogDescription>
                            {selectedNote && format(new Date(selectedNote.createdAt), "eeee, d MMMM yyyy 'الساعة' h:mm a", { locale: ar })}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex-1 overflow-y-auto pr-2">
                        <div className="prose-custom w-full max-w-none dir-rtl text-right">
                           {selectedNote && <ReactMarkdown remarkPlugins={[remarkGfm]}>{selectedNote.content}</ReactMarkdown>}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Edit Note Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[600px] bg-background border-primary/50">
                    <DialogHeader>
                        <DialogTitle>تعديل الملاحظة</DialogTitle>
                    </DialogHeader>
                    {selectedNote && (
                        <NoteEditor 
                            onSave={(updates) => onUpdate(selectedNote.id, updates)} 
                            initialData={selectedNote}
                            onFinished={() => setIsEditDialogOpen(false)}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
