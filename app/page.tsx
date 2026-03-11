import Image from 'next/image'
import Link from 'next/link'
import { BarChart2, TrendingUp, Radio, Landmark, Calendar } from 'lucide-react'
import CoinGeckoHeatmap from '@/components/CoinGeckoHeatmap'
import BentoGrid from '@/components/BentoGrid'
import AlphaCard from './alpha/AlphaCard'

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
              En vivo - Online - Gratis - Real
            </p>
          </div>


        </div>
      </section>

      {/* ══════════════════════════════════════════════
          §ALPHA
      ══════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
          <div className="flex-1 space-y-3">
            <h2 className="font-chakra text-2xl font-bold text-cyber-green mb-2">ALPHA</h2>
            <p className="font-outfit text-base text-gray-400 max-w-lg">Escogemos los que nos gustan y consideramos los mejores. Podemos ver desde Stocks, ETFs, Crypto, RWA.</p>
            <Link href="/alpha" className="inline-block mt-3 bg-cyber-green text-black font-chakra text-xs tracking-[0.2em] px-6 py-2 rounded hover:bg-cyber-green/90 transition-all">VER ALPHA</Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          §3  TOPICS
      ══════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-7">
          <TrendingUp className="w-4 h-4 text-cyber-green" />
          <h2 className="font-chakra text-sm font-semibold text-white tracking-[0.15em]">
            TOPICS
          </h2>
          <div className="flex-1 h-px bg-gradient-to-r from-border-dark to-transparent" />
          <span className="section-label">EXPLORA</span>
        </div>
        <BentoGrid />
      </section>
          {/* ══════════════════════════════════════════════
              §4  LIVE HUB
          ══════════════════════════════════════════════ */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center gap-3 mb-7">
              <Radio className="w-4 h-4 text-cyber-green" />
              <h2 className="font-chakra text-sm font-semibold text-white tracking-[0.15em]">LIVE HUB</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-border-dark to-transparent" />
              <span className="section-label">STREAMING</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link href="/live-hub/kick" className="bg-panel/60 border border-border-dark rounded-xl p-8 hover:border-cyber-green transition-all flex flex-col items-center">
                <Image src="https://pbs.twimg.com/profile_images/1972455427960135680/qhqI3V3z_400x400.jpg" alt="Kick logo" width={64} height={64} className="rounded-full mb-3 shadow-lg" />
                <span className="font-chakra text-lg text-cyber-green">KICK</span>
                <div className="mt-2 text-xs text-gray-500">Transmisiones en vivo en Kick.com</div>
              </Link>
              <Link href="/live-hub/x" className="bg-panel/60 border border-border-dark rounded-xl p-8 hover:border-white transition-all flex flex-col items-center">
                <Image src="https://pbs.twimg.com/profile_images/1955359038532653056/OSHY3ewP_400x400.jpg" alt="X logo" width={64} height={64} className="rounded-full mb-3 shadow-lg" />
                <span className="font-chakra text-lg text-white">X SPACES</span>
                <div className="mt-2 text-xs text-gray-500">Grabaciones y Spaces en X</div>
              </Link>
              <Link href="/live-hub/youtube" className="bg-panel/60 border border-border-dark rounded-xl p-8 hover:border-[#ff4444] transition-all flex flex-col items-center">
                <Image src="https://pbs.twimg.com/profile_images/1984471345854566400/5pd8GpgC_400x400.jpg" alt="YouTube logo" width={64} height={64} className="rounded-full mb-3 shadow-lg" />
                <span className="font-chakra text-lg" style={{ color: '#ff4444' }}>YOUTUBE</span>
                <div className="mt-2 text-xs text-gray-500">Grabaciones en YouTube</div>
              </Link>
            </div>
          </section>

          {/* ══════════════════════════════════════════════
              §5  EVENTS
          ══════════════════════════════════════════════ */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
            <div className="flex items-center gap-3 mb-7">
              <Calendar className="w-4 h-4 text-cyber-green" />
              <h2 className="font-chakra text-sm font-semibold text-white tracking-[0.15em]">EVENTS</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-border-dark to-transparent" />
              <span className="section-label">COMUNIDAD</span>
            </div>
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1 space-y-3">
                <p className="font-outfit text-base text-gray-400 max-w-lg">Online o IRL, para contribuir, reunir comunidad y hacer esto real y humano.</p>
                <Link href="/events" className="inline-block mt-3 bg-cyber-green text-black font-chakra text-xs tracking-[0.2em] px-6 py-2 rounded hover:bg-cyber-green/90 transition-all">VER EVENTOS</Link>
              </div>
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
    </div>
  )
}
