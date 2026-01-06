import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import 'katex/dist/katex.min.css';

export const metadata: Metadata = {
  title: 'Note Ace | ملاحظة ايس',
  description: 'The professional notepad for engineering students.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap" rel="stylesheet" />
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700;900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <div className="fixed top-0 left-0 w-full h-full bg-background -z-10 overflow-hidden">
            {/* Stars background */}
            <div id="stars" className="absolute inset-0"></div>
            <div id="stars2" className="absolute inset-0"></div>
            <div id="stars3" className="absolute inset-0"></div>
            {/* Gradient glows */}
            <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/20 rounded-full mix-blend-screen filter blur-3xl animate-blob opacity-30"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-secondary/30 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-2000 opacity-30"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-primary/20 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-4000 opacity-30"></div>
            <style jsx>{`
              @keyframes animate-blob {
                0% { transform: scale(1) translateY(0px) rotate(0deg); }
                33% { transform: scale(1.1) translateY(-20px) rotate(40deg); }
                66% { transform: scale(0.9) translateY(20px) rotate(-40deg); }
                100% { transform: scale(1) translateY(0px) rotate(0deg); }
              }
              .animate-blob {
                animation: animate-blob 15s infinite ease-in-out;
              }
              .animation-delay-2000 { animation-delay: 2s; }
              .animation-delay-4000 { animation-delay: 4s; }

              // Starry background effect
              // https://codepen.io/WebCodeFlow/pen/NWgWdPe
              @function random_range($min, $max) {
                $rand: random();
                $random_range: $min + floor($rand * ($max - $min + 1));
                @return $random_range;
              }

              #stars {
                width: 1px;
                height: 1px;
                background: transparent;
                box-shadow: 25vw 38vh #FFF, 9vw 7vh #FFF, 88vw 1vh #FFF, 22vw 36vh #FFF, 89vw 9vh #FFF, 82vw 45vh #FFF, 3vw 6vh #FFF, 31vw 77vh #FFF, 53vw 3vh #FFF, 9vw 99vh #FFF, 24vw 89vh #FFF, 81vw 90vh #FFF, 5vw 41vh #FFF, 70vw 2vh #FFF, 4vw 9vh #FFF, 9vw 84vh #FFF, 54vw 2vh #FFF, 9vw 65vh #FFF, 8vw 27vh #FFF, 2vw 50vh #FFF;
                animation: animStar 50s linear infinite;
              }

              #stars2 {
                width: 2px;
                height: 2px;
                background: transparent;
                box-shadow: 25vw 38vh #FFF, 9vw 7vh #FFF, 88vw 1vh #FFF, 22vw 36vh #FFF, 89vw 9vh #FFF, 82vw 45vh #FFF, 3vw 6vh #FFF, 31vw 77vh #FFF, 53vw 3vh #FFF, 9vw 99vh #FFF, 24vw 89vh #FFF, 81vw 90vh #FFF, 5vw 41vh #FFF, 70vw 2vh #FFF, 4vw 9vh #FFF, 9vw 84vh #FFF, 54vw 2vh #FFF, 9vw 65vh #FFF, 8vw 27vh #FFF, 2vw 50vh #FFF;
                animation: animStar 100s linear infinite;
              }

              #stars3 {
                width: 3px;
                height: 3px;
                background: transparent;
                box-shadow: 25vw 38vh #FFF, 9vw 7vh #FFF, 88vw 1vh #FFF, 22vw 36vh #FFF, 89vw 9vh #FFF, 82vw 45vh #FFF, 3vw 6vh #FFF, 31vw 77vh #FFF, 53vw 3vh #FFF, 9vw 99vh #FFF, 24vw 89vh #FFF, 81vw 90vh #FFF, 5vw 41vh #FFF, 70vw 2vh #FFF, 4vw 9vh #FFF, 9vw 84vh #FFF, 54vw 2vh #FFF, 9vw 65vh #FFF, 8vw 27vh #FFF, 2vw 50vh #FFF;
                animation: animStar 150s linear infinite;
              }

              @keyframes animStar {
                from {
                  transform: translateY(0px);
                }
                to {
                  transform: translateY(-2000px);
                }
              }
            `}</style>
        </div>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
