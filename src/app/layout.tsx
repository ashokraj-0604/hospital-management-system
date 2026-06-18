import type { Metadata } from 'next';
import { QueryProvider } from '@/src/lib/query/QueryProvider';
import '@/src/styles/globals.scss';

export const metadata: Metadata = {
  title: 'Medical HMS',
  description: 'Hospital Management System frontend',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="hospital-b">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
