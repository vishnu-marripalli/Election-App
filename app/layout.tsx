import './globals.css';
// import type { Metadata } from 'next/head';
import { Inter } from 'next/font/google';
import NextAuthProvider from '@/components/providers/SessionProvider';

const inter = Inter({ subsets: ['latin'] });


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthProvider>
          {children}
        </NextAuthProvider>
      </body>
    </html>
  );
}