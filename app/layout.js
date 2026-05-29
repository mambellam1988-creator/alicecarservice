import './globals.css';
import { Bebas_Neue } from 'next/font/google';

const bebas = Bebas_Neue({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-bebas',
});

export const metadata = {
  title: 'AutoDoc AI',
  description: 'Frontend Next.js per domande di montaggio auto con sfondo supercar e risposta strutturata.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="it" className={bebas.variable}>
      <body>{children}</body>
    </html>
  );
}
