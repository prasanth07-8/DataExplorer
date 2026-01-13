import './globals.css';
import type { Metadata } from 'next';
import Providers from './providers';

export const metadata: Metadata = {
  title: {
    default: 'DataExplorer',
    template: '%s | DataExplorer',
  },
  description: 'Product data explorer built with Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
