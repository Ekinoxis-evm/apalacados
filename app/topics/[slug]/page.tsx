import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

const topicMeta: Record<string, { title: string; color: string; description: string }> = {
  trading: {
    title: 'Trading & Perps',
    color: '#00ff41',
    description: 'Futuros perpetuos, gestión de riesgo y análisis técnico en tiempo real.',
  },
  prediction: {
    title: 'Prediction Markets',
    color: '#00d4ff',
    description: 'Mercados de predicción on-chain, apuestas descentralizadas y probabilidades.',
  },
  defi: {
    title: 'DeFi',
    color: '#00fff0',
    description: 'Protocolos descentralizados, yield farming y oportunidades de liquidez.',
  },
  memes: {
    title: 'Memes & NFTs',
    color: '#bc13fe',
    description: 'Cultura crypto, meme coins y el pulso de la comunidad Web3.',
  },
  ai: {
    title: 'Inteligencia Artificial',
    color: '#ff006e',
    description: 'IA aplicada a finanzas, agentes autónomos y trading algorítmico.',
  },
}

export default async function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const meta = topicMeta[slug] ?? {
    title: slug.toUpperCase(),
    color: '#00ff41',
    description: 'Contenido próximamente.',
  }

  return (
    <div className="min-h-screen grid-bg flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <div
          className="w-12 h-12 rounded-xl mx-auto flex items-center justify-center text-2xl"
          style={{ background: `${meta.color}14`, border: `1px solid ${meta.color}30` }}
        >
          🚧
        </div>
        <div>
          <p className="section-label mb-2">PRÓXIMAMENTE</p>
          <h1
            className="font-chakra text-2xl font-bold mb-3"
            style={{ color: meta.color }}
          >
            {meta.title.toUpperCase()}
          </h1>
          <p className="font-outfit text-sm text-gray-500 leading-relaxed">
            {meta.description}
            {' '}Esta sección estará disponible próximamente.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-chakra text-xs tracking-widest text-gray-500 hover:text-cyber-green transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          VOLVER AL LIVE HUB
        </Link>
      </div>
    </div>
  )
}
