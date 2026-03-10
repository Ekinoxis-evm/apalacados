import Link from 'next/link'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'

type Tool = {
  name: string
  logo: string
  website: string
  x_url?: string | null
}

const topicMeta: Record<string, { title: string; color: string; description: string; content: string }> = {
  trading: {
    title: 'Trading & Perps',
    color: '#00ff41',
    description: 'Futuros perpetuos, gestión de riesgo y análisis técnico en tiempo real.',
    content: 'Exploramos plataformas de trading descentralizado y perpetuos on-chain. Desde análisis técnico hasta gestión de posiciones apalancadas, cubrimos las herramientas que usamos para navegar los mercados 24/7.',
  },
  prediction: {
    title: 'Prediction Markets',
    color: '#00d4ff',
    description: 'Mercados de predicción on-chain, apuestas descentralizadas y probabilidades.',
    content: 'Los mercados de predicción están redefiniendo cómo apostamos por eventos futuros. Desde elecciones hasta cripto, estas plataformas permiten especular con probabilidades reales y liquidez descentralizada.',
  },
  defi: {
    title: 'DeFi',
    color: '#00fff0',
    description: 'Protocolos descentralizados, yield farming y oportunidades de liquidez.',
    content: 'DeFi es el sistema financiero abierto. Protocolos de lending, AMMs, yield farming y estrategias de liquidez que democratizan el acceso a servicios financieros sin intermediarios.',
  },
  memes: {
    title: 'Memes & NFTs',
    color: '#bc13fe',
    description: 'Cultura crypto, meme coins y el pulso de la comunidad Web3.',
    content: 'Memes y NFTs son la cultura de crypto. Desde PFP collections hasta meme coins que rompen récords, exploramos el lado más especulativo y divertido del ecosistema.',
  },
  ai: {
    title: 'Inteligencia Artificial',
    color: '#ff006e',
    description: 'IA aplicada a finanzas, agentes autónomos y trading algorítmico.',
    content: 'La IA está transformando los mercados. Agentes autónomos, trading algorítmico y análisis predictivo están creando nuevas oportunidades en la intersección de cripto y machine learning.',
  },
  tradfi: {
    title: 'Traditional Finance',
    color: '#f59e0b',
    description: 'Exchanges centralizados, brokers y herramientas de finanzas tradicionales.',
    content: 'TradFi meets crypto. Exploramos exchanges centralizados, brokers regulados y plataformas que conectan las finanzas tradicionales con el ecosistema digital.',
  },
}

function ToolCard({ tool, color }: { tool: Tool; color: string }) {
  return (
    <div
      className="group relative rounded-xl overflow-hidden border border-border-dark bg-panel/40 hover:border-opacity-60 transition-all duration-200 p-4 flex flex-col items-center gap-3"
      style={{ borderColor: `${color}30` }}
    >
      {/* Logo */}
      <div className="relative w-16 h-16 rounded-full overflow-hidden border border-border-dark bg-true-black">
        <Image
          src={tool.logo}
          alt={tool.name}
          fill
          className="object-cover"
        />
      </div>

      {/* Name */}
      <h3 className="font-chakra text-sm font-semibold text-white tracking-wide text-center">
        {tool.name}
      </h3>

      {/* Links */}
      <div className="flex items-center gap-2">
        <a
          href={tool.website}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 rounded-lg bg-panel/60 border border-border-dark hover:border-cyber-green/40 transition-colors group/link"
          title="Website"
        >
          <ExternalLink className="w-3.5 h-3.5 text-gray-500 group-hover/link:text-cyber-green transition-colors" />
        </a>
{tool.x_url && (
          <a
            href={tool.x_url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg bg-panel/60 border border-border-dark hover:border-cyber-green/40 transition-colors group/link"
            title="X / Twitter"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-gray-500 group-hover/link:text-cyber-green transition-colors">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
        )}
      </div>
    </div>
  )
}

export default async function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const meta = topicMeta[slug] ?? {
    title: slug.toUpperCase(),
    color: '#00ff41',
    description: 'Contenido próximamente.',
    content: 'Esta sección estará disponible próximamente.',
  }

  // Fetch tools from Supabase
  const supabase = await createClient()
  const { data: tools } = await supabase
    .from('tools')
    .select('name, logo, website, x_url')
    .eq('topic', slug)
    .order('display_order', { ascending: true })

  return (
    <div className="min-h-screen grid-bg">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20">

        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-chakra text-xs tracking-widest text-gray-500 hover:text-cyber-green transition-colors mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          VOLVER
        </Link>

        {/* Header */}
        <div className="mb-10">
          <p className="section-label mb-2">TEMA</p>
          <h1
            className="font-chakra text-3xl sm:text-4xl font-bold mb-4 tracking-wide"
            style={{ color: meta.color }}
          >
            {meta.title.toUpperCase()}
          </h1>
          <p className="font-outfit text-base text-gray-400 leading-relaxed mb-4">
            {meta.description}
          </p>
          <p className="font-outfit text-sm text-gray-500 leading-relaxed max-w-2xl">
            {meta.content}
          </p>
        </div>

        {/* Tools section */}
        {tools && tools.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-1 rounded-full" style={{ background: meta.color, boxShadow: `0 0 8px ${meta.color}` }} />
              <h2 className="font-chakra text-sm font-semibold text-white tracking-[0.15em]">
                HERRAMIENTAS & PROYECTOS
              </h2>
              <div className="flex-1 h-px bg-gradient-to-r from-border-dark to-transparent" />
            </div>

            <div className="grid grid-cols-1 min-[360px]:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {tools.map((tool) => (
                <ToolCard key={tool.name} tool={tool} color={meta.color} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
