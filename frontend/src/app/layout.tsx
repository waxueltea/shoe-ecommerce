import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ShoeStore - Modern Ayakkabı Alışverişi',
  description: 'Kaliteli ayakkabılar, uygun fiyatlar. Türkiye\'nin en güvenilir ayakkabı mağazası.',
  keywords: 'ayakkabı, spor ayakkabı, günlük ayakkabı, online alışveriş',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
