"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb } from "lucide-react";

export default function ApkInstructions() {
  return (
    <div className="space-y-8 animate-in fade-in-50">
      <div className="flex items-center gap-4 mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></g></svg>
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
              يجب أن يكون لديك <a href="https://developer.android.com/studio" target="_blank" rel="noopener noreferrer" className="text-primary underline">Android Studio</a> مثبتًا ومهيأ على جهاز الكمبيوتر الخاص بك.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-lg text-primary mb-3">الخطوات</h3>
            <ol className="list-decimal list-inside space-y-4 text-foreground">
              <li>
                <span className="font-semibold">تثبيت واجهة أوامر Capacitor:</span>
                <p className="text-muted-foreground my-1">افتح الطرفية (terminal) في مجلد المشروع وقم بتشغيل الأمر التالي:</p>
                <pre className="p-3 bg-secondary/80 rounded-md text-sm font-code dir-ltr text-left overflow-x-auto"><code>npm install @capacitor/cli @capacitor/core @capacitor/android</code></pre>
              </li>
              <li>
                <span className="font-semibold">تهيئة Capacitor:</span>
                <p className="text-muted-foreground my-1">قم بتشغيل هذا الأمر لإنشاء ملف الإعدادات الخاص بـ Capacitor:</p>
                <pre className="p-3 bg-secondary/80 rounded-md text-sm font-code dir-ltr text-left overflow-x-auto"><code>npx cap init "Equation Note" "com.equationnote.app"</code></pre>
                <p className="text-muted-foreground mt-1">سيطلب منك تأكيد مجلد الويب، وهو `out` في حالتنا.</p>
              </li>
              <li>
                <span className="font-semibold">تهيئة Next.js للتصدير الثابت:</span>
                <p className="text-muted-foreground my-1">عدّل ملف `next.config.ts` لإضافة خيار `output: 'export'`. (لقد قمت بهذه الخطوة بالفعل نيابة عنك).</p>
                 <pre className="p-3 bg-secondary/80 rounded-md text-sm font-code dir-ltr text-left overflow-x-auto">
{`
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Required for Capacitor
  /* ... other config ... */
};
export default nextConfig;
`}
                </pre>
              </li>
               <li>
                <span className="font-semibold">بناء تطبيق الويب:</span>
                <p className="text-muted-foreground my-1">أنشئ نسخة الإنتاج من تطبيق الويب الخاص بك. سيؤدي هذا إلى إنشاء الملفات الثابتة في مجلد `out`.</p>
                <pre className="p-3 bg-secondary/80 rounded-md text-sm font-code dir-ltr text-left overflow-x-auto"><code>npm run build</code></pre>
              </li>
              <li>
                <span className="font-semibold">إضافة منصة أندرويد:</span>
                <p className="text-muted-foreground my-1">اطلب من Capacitor إنشاء مشروع أندرويد الأصلي.</p>
                <pre className="p-3 bg-secondary/80 rounded-md text-sm font-code dir-ltr text-left overflow-x-auto"><code>npx cap add android</code></pre>
              </li>
              <li>
                <span className="font-semibold">فتح المشروع في Android Studio:</span>
                <p className="text-muted-foreground my-1">سيفتح هذا الأمر مشروع أندرويد الجديد في Android Studio.</p>
                <pre className="p-3 bg-secondary/80 rounded-md text-sm font-code dir-ltr text-left overflow-x-auto"><code>npx cap open android</code></pre>
              </li>
              <li>
                <span className="font-semibold">بناء ملف APK في Android Studio:</span>
                <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                    <li>انتظر حتى يقوم Android Studio بمزامنة وبناء كل شيء.</li>
                    <li>اذهب إلى القائمة واختر <Badge variant="outline">Build</Badge> &gt; <Badge variant="outline">Build Bundle(s) / APK(s)</Badge> &gt; <Badge variant="outline">Build APK(s)</Badge>.</li>
                    <li>بعد اكتمال البناء، سيظهر إشعار يحتوي على رابط لتحديد موقع ملف APK الذي تم إنشاؤه.</li>
                </ul>
              </li>
            </ol>
          </div>
            <Card className="bg-primary/10 border-primary/20 mt-6">
                <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                        <Lightbulb className="text-primary mt-1 h-5 w-5 shrink-0" />
                        <div>
                            <h4 className="font-bold text-primary">ملاحظة مهمة</h4>
                            <p className="text-foreground/80 text-sm">
                                هذه العملية تقع خارج نطاق قدراتي المباشرة. لقد قمت بتوفير هذه الإرشادات لمساعدتك على إنجاز المهمة بنفسك. أنا متخصص في تطوير تطبيق الويب نفسه.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </CardContent>
      </Card>
    </div>
  );
}
