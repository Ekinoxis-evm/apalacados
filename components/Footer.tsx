import Link from 'next/link'
import { Zap, ExternalLink } from 'lucide-react'

const topics = [
  { name: 'Trading & Perps', href: '/topics/trading' },
  { name: 'Prediction Markets', href: '/topics/prediction' },
  { name: 'DeFi', href: '/topics/defi' },
  { name: 'Memes & NFTs', href: '/topics/memes' },
  { name: 'Inteligencia Artificial', href: '/topics/ai' },
]

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-border-dark bg-panel/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">

          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <Zap
                className="w-4 h-4 text-cyber-green group-hover:drop-shadow-[0_0_6px_#00ff41] transition-all"
                fill="currentColor"
              />
              <span className="font-chakra font-bold text-sm tracking-[0.18em] text-white group-hover:text-cyber-green transition-colors">
                APALANCADOS
              </span>
            </Link>
            <p className="font-outfit text-xs text-gray-600 leading-relaxed max-w-[220px]">
              El hub de Trading en Vivo, DeFi, Prediction Markets, IA y Cultura Web3.
            </p>
          </div>

          {/* Topics */}
          <div>
            <p className="section-label mb-4">TOPICS</p>
            <ul className="space-y-2">
              {topics.map((t) => (
                <li key={t.href}>
                  <Link
                    href={t.href}
                    className="font-outfit text-xs text-gray-600 hover:text-cyber-green transition-colors"
                  >
                    {t.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <p className="section-label mb-4">PLATAFORMAS</p>
            <div className="space-y-2">
              {[
                { label: 'Kick · wmb81321', href: 'https://kick.com/wmb81321' },
                { label: 'Events & Vault', href: '/events' },
                { label: 'Live Hub', href: '/' },
              ].map((l) => (
                <div key={l.href}>
                  {l.href.startsWith('http') ? (
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 font-outfit text-xs text-gray-600 hover:text-cyber-green transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                      {l.label}
                    </a>
                  ) : (
                    <Link
                      href={l.href}
                      className="font-outfit text-xs text-gray-600 hover:text-cyber-green transition-colors"
                    >
                      {l.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── NFA Disclaimer ── */}
        <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/[0.04] p-4 mb-8">
          <div className="flex items-start gap-3">
            <span className="text-yellow-400 text-base leading-none mt-0.5 flex-shrink-0">⚠</span>
            <p className="font-outfit text-[11px] text-yellow-400/70 leading-relaxed">
              <strong className="text-yellow-400">AVISO IMPORTANTE — NFA:</strong>{' '}
              Contenido educativo únicamente. Esto no es asesoría financiera (NFA). Operar con
              Futuros, Cripto y DeFi conlleva un{' '}
              <strong className="text-yellow-400">alto riesgo de pérdida de capital</strong>.
              Puedes perder todo tu dinero. Consulta a un asesor financiero calificado antes de
              tomar cualquier decisión de inversión.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="hr-glow mb-6" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p
            className="text-[10px] text-gray-700 tracking-widest"
            style={{ fontFamily: 'var(--font-dm-mono)' }}
          >
            © {new Date().getFullYear()} APALANCADOS. ALL RIGHTS RESERVED.
          </p>
          <p
            className="text-[10px] text-gray-800 tracking-wider"
            style={{ fontFamily: 'var(--font-dm-mono)' }}
          >
            BUILT FOR THE FUTURE OF FINANCE.
          </p>
        </div>
      </div>
    </footer>
  )
}
