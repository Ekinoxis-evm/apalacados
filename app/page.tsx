import Image from 'next/image'
import Link from 'next/link'
import { BarChart2, TrendingUp, Radio } from 'lucide-react'
import CoinGeckoHeatmap from '@/components/CoinGeckoHeatmap'
import BentoGrid from '@/components/BentoGrid'

export default function HomePage() {
  return (
    <div className="min-h-screen grid-bg">

      {/* ══════════════════════════════════════════════
          §1  HERO
      ══════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="flex flex-col items-center text-center gap-8">

          {/* Logo */}
          <div
            className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden border border-border-dark"
            style={{ boxShadow: '0 0 40px rgba(0,255,65,0.18), 0 0 80px rgba(0,255,65,0.06)' }}
          >
            <Image
              src="/apalancadoslogo.jpg"
              alt="APALANCADOS"
              fill
              className="object-contain"
              priority
            />
            {/* Green overlay tint */}
            <div className="absolute inset-0 bg-gradient-to-t from-cyber-green/5 to-transparent pointer-events-none" />
          </div>

          {/* Title */}
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-3 mb-1">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-cyber-green/40" />
              <span className="section-label">EL HUB DEFINITIVO</span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-cyber-green/40" />
            </div>
            <h1 className="font-chakra text-5xl sm:text-6xl lg:text-7xl font-bold tracking-[0.06em] glow-green text-cyber-green">
              APALANCADOS
            </h1>
            <p className="font-outfit text-base sm:text-lg text-gray-400 tracking-wide max-w-xl mx-auto leading-relaxed">
              En Vido -Online - Gratis - Real
            </p>
          </div>

          {/* Description */}
          <p className="font-outfit text-sm text-gray-500 max-w-lg leading-relaxed">
            El espacio donde los mercados se ven diferente. Análisis en vivo, educación financiera
            y la cultura crypto desde adentro — sin filtros, sin asesoría.
          </p>

          {/* CTAs */}
          <Link
            href="/live-hub"
            className="flex items-center gap-2 bg-cyber-green text-black font-chakra text-xs tracking-[0.2em] px-6 py-3 rounded hover:bg-cyber-green/90 hover:shadow-[0_0_24px_rgba(0,255,65,0.35)] transition-all"
          >
            <Radio className="w-3.5 h-3.5" />
            VER LIVE HUB
          </Link>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          §2  MARKET PULSE
      ══════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-5">
          <BarChart2 className="w-4 h-4 text-cyber-green" />
          <h2 className="font-chakra text-sm font-semibold text-white tracking-[0.15em]">
            MARKET PULSE
          </h2>
          <div className="flex-1 h-px bg-gradient-to-r from-border-dark to-transparent" />
          <span className="section-label">TOP 100</span>
        </div>
        <div className="rounded-xl overflow-hidden border border-border-dark bg-panel/30">
          <CoinGeckoHeatmap />
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          §3  LOS 5 PILARES
      ══════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
        <div className="flex items-center gap-3 mb-7">
          <TrendingUp className="w-4 h-4 text-cyber-green" />
          <h2 className="font-chakra text-sm font-semibold text-white tracking-[0.15em]">
            LOS 5 PILARES
          </h2>
          <div className="flex-1 h-px bg-gradient-to-r from-border-dark to-transparent" />
          <span className="section-label">EXPLORA</span>
        </div>
        <BentoGrid />
      </section>
    </div>
  )
}
