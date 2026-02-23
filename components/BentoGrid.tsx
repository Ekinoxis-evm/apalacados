import Link from 'next/link'
import { TrendingUp, Target, Layers, Smile, Brain, ArrowRight } from 'lucide-react'

const pillars = [
  {
    id: 'trading',
    title: 'Trading & Perps',
    description:
      'Futuros perpetuos, estrategias de trading activo y análisis técnico en tiempo real.',
    icon: TrendingUp,
    href: '/topics/trading',
    color: '#00ff41',
    tag: 'LIVE',
  },
  {
    id: 'prediction',
    title: 'Prediction Markets',
    description:
      'Mercados de predicción descentralizados, apuestas on-chain y probabilidades de eventos.',
    icon: Target,
    href: '/topics/prediction',
    color: '#00d4ff',
    tag: 'HOT',
  },
  {
    id: 'defi',
    title: 'DeFi',
    description:
      'Protocolos DeFi, yield farming, liquidity pools y las mejores oportunidades del ecosistema.',
    icon: Layers,
    href: '/topics/defi',
    color: '#00fff0',
    tag: 'TVL ↑',
  },
  {
    id: 'memes',
    title: 'Memes & NFTs',
    description:
      'Cultura crypto, meme coins, NFTs y el pulso real de la comunidad Web3.',
    icon: Smile,
    href: '/topics/memes',
    color: '#bc13fe',
    tag: 'VIRAL',
  },
  {
    id: 'ai',
    title: 'Inteligencia Artificial',
    description:
      'IA aplicada a finanzas, agentes autónomos y el futuro del trading algorítmico.',
    icon: Brain,
    href: '/topics/ai',
    color: '#ff006e',
    tag: 'AI',
  },
]

export default function BentoGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {pillars.map((p, i) => {
        const Icon = p.icon
        // Make the last item span 2 cols on lg if odd total
        const isLast = i === pillars.length - 1 && pillars.length % 3 !== 0
        return (
          <Link
            key={p.id}
            href={p.href}
            className={`group relative bracket neon-border rounded-xl p-5 bg-panel flex flex-col gap-4 transition-all duration-300 hover:-translate-y-0.5 ${
              isLast ? 'sm:col-span-2 lg:col-span-1' : ''
            }`}
          >
            {/* Hover background bloom */}
            <div
              className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: `radial-gradient(ellipse at 20% 20%, ${p.color}12 0%, transparent 65%)`,
              }}
            />

            {/* Header row */}
            <div className="relative flex items-start justify-between gap-2">
              <div
                className="p-2.5 rounded-lg flex-shrink-0"
                style={{ background: `${p.color}14`, border: `1px solid ${p.color}28` }}
              >
                <Icon className="w-4 h-4" style={{ color: p.color }} />
              </div>
              <span
                className="font-dm-mono text-[10px] tracking-widest px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5"
                style={{
                  color: p.color,
                  background: `${p.color}14`,
                  border: `1px solid ${p.color}30`,
                  fontFamily: 'var(--font-dm-mono)',
                }}
              >
                {p.tag}
              </span>
            </div>

            {/* Body */}
            <div className="relative flex-1 space-y-2">
              <h3 className="font-chakra text-sm font-semibold text-white leading-snug">
                {p.title}
              </h3>
              <p className="font-outfit text-xs text-gray-500 leading-relaxed group-hover:text-gray-400 transition-colors">
                {p.description}
              </p>
            </div>

            {/* CTA */}
            <div
              className="relative flex items-center gap-1 font-chakra text-[10px] tracking-widest transition-colors"
              style={{ color: p.color }}
            >
              EXPLORAR
              <ArrowRight className="w-3 h-3 transform group-hover:translate-x-1 transition-transform duration-200" />
            </div>
          </Link>
        )
      })}
    </div>
  )
}
