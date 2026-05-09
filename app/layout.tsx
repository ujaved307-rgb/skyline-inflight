import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inflight', display: 'swap' });

export const metadata: Metadata = {
  title: 'SKYLINE — In-Flight Infotainment',
  description: 'A reimagined seat-back experience: learn, create, explore and unwind at 35,000 ft.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
