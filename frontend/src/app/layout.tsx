import './globals.css';
import { Lato } from 'next/font/google';
import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Providers from './Providers';
import { Toaster } from 'sonner';

const lato = Lato({ subsets: ['latin'], weight: ['300', '400', '700', '900'], display: 'swap' });

export const metadata: Metadata = {
  title: 'محلل السيرة الذاتية بالذكاء الاصطناعي',
  description: 'حلل سيرتك الذاتية بالذكاء الاصطناعي وميز نفسك في سوق العمل.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${lato.className} bg-zinc-950 text-zinc-100 relative overflow-x-hidden`}>
        <Providers>
          <Header />
          {children}
          <Footer />
          <Toaster richColors position="top-center" />
        </Providers>
      </body>
    </html>
  );
}
