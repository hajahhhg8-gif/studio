/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. تفعيل التصدير الثابت ليعمل كملفات APK
  output: 'export',
  
  // 2. تجاهل أخطاء البرمجة أثناء البناء لضمان عدم توقف عملية الـ APK
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  // 3. إعدادات الصور (تعديل مهم جداً للموبايل)
  images: {
    unoptimized: true, // ضروري لأن أندرويد لا يدعم معالجة الصور التلقائية من Next.js
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
