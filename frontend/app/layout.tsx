import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers/Providers';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { InitialSplashGate } from '@/components/layout/InitialSplashGate';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Tyre Shop - Premium Tyres, Batteries & Accessories in Beruwala',
    description: 'Leading tyre shop in Beruwala, Sri Lanka. Shop premium tyres, batteries, and accessories with island-wide delivery.',
    keywords: 'tyres, batteries, accessories, Beruwala, Sri Lanka, tyre shop, car tyres, motorcycle tyres',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <InitialSplashGate>
                    <Providers>
                        <div className="flex min-h-dvh flex-col">
                            <Header />
                            <main className="flex-1 min-h-0">
                                {children}
                            </main>
                            <Footer />
                        </div>
                    </Providers>
                </InitialSplashGate>
            </body>
        </html>
    );
}
