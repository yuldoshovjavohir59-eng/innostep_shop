import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'INNOSTEP Shop — Premium Mahsulotlar',
  description: 'Eng sifatli mahsulotlar katalogi. Lotlar, narxlar, xarakteristikalar.',
  keywords: 'innostep, shop, lot, mahsulot, elektron, smartphone',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <body className="noise-bg">{children}</body>
    </html>
  );
}
