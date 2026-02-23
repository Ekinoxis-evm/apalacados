import type { Metadata } from 'next'
import { Chakra_Petch, DM_Mono, Outfit } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const chakraPetch = Chakra_Petch({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-chakra',
  display: 'swap',
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-dm-mono',
  display: 'swap',
})

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Apalancados',
    template: 'Apalancados',
  },
  description:
    'En Vido -Online - Gratis - Real. Contenido educativo sobre mercados financieros.',
  keywords: ['trading', 'crypto', 'DeFi', 'perpetuos', 'Web3', 'IA', 'apalancados'],
  openGraph: {
    title: 'Apalancados',
    description: 'En Vido -Online - Gratis - Real',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${chakraPetch.variable} ${dmMono.variable} ${outfit.variable}`}
    >
      <body className="bg-true-black text-white font-outfit antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
