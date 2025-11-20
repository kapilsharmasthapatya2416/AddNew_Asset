import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { appConfig } from '@/config/app.config';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: `${appConfig.app.name} - ${appConfig.app.description}`,
  description: appConfig.app.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}
      </body>
    </html>
  );
}
