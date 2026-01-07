"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb } from "lucide-react";

export default function ApkInstructions() {
  return (
    <div className="space-y-8 animate-in fade-in-50">
      <div className="flex items-center gap-4 mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
          <line x1="12" y1="22.08" x2="12" y2="12"></line>
        </svg>
        <h1 className="text-3xl font-bold font-headline md:text-4xl bg-gradient-to-r from-primary to-foreground text-transparent bg-clip-text">
          تحويل التطبيق إلى APK
        </h1>
      </div>

      <Card className="bg-card/80 backdrop-blur-sm border-border/80">
        <CardHeader>
          <CardTitle>كيفية تحويل تطبيق الويب إلى ملف APK لنظام أندرويد</CardTitle>
          <CardDescription>
            هذا الدليل يوضح لك خطوة بخطوة كيفية استخدام أداة Capacitor لتحويل تطبيقك.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-bold text-lg text-primary mb-2">المتطلبات الأساسية</h3>
            <p className="text-muted-foreground">
              يجب أن يكون لديك Android Studio مثبتًا على جهاز الكمبيوتر الخاص بك.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-lg text-primary mb-3">الخطوات</h3>
            <ol className="list-decimal list-inside space-y-4 text-foreground">
              <li>تثبيت واجهة أوامر Capacitor</li>
              <li>تهيئة Capacitor</li>
              <li>بناء تطبيق الويب (npm run build)</li>
              <li>إضافة منصة أندرويد</li>
              <li>استخراج ملف APK من Android Studio</li>
            </ol>
          </div>
          
          <Card className="bg-primary/10 border-primary/20 mt-6">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Lightbulb className="text-primary mt-1 h-5 w-5 shrink-0" />
                <div>
                  <h4 className="font-bold text-primary">ملاحظة</h4>
                  <p className="text-foreground/80 text-sm">أنت الآن تقوم بعملية البناء السحابي عبر GitHub Actions.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
