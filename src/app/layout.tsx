import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'HMS Platform',
  description: 'Multi-Tenant Hospital Management System',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}