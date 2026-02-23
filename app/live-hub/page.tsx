'use client'

import { useEffect } from 'react'
import KickPlayer from '@/components/KickPlayer'
import CoinGeckoPriceBanner from '@/components/CoinGeckoPriceBanner'
const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
)

declare global {
  interface Window {
    twttr?: { widgets: { load: (el?: Element | null) => void } }
  }
}

// ── YouTube recordings ─────────────────────────────────────────────────
// Replace each videoId with your actual YouTube video ID
const youtubeVideos = [
  {
    id: 'yt-1',
    videoId: 'REPLACE_VIDEO_ID_1',
    title: 'Apalancados Spaces #1 — Trading & DeFi',
  },
  {
    id: 'yt-2',
    videoId: 'REPLACE_VIDEO_ID_2',
    title: 'Apalancados Spaces #2 — Prediction Markets',
  },
]

// ── X posts ────────────────────────────────────────────────────────────
// To add more posts: go to the tweet → ••• → Embed Tweet → copy the <blockquote> HTML
// Add data-theme="dark" to each blockquote for consistent styling
const xPosts = [
  {
    id: '2025614018572902897',
    html: `<blockquote class="twitter-tweet" data-theme="dark" data-width="500"><p lang="es" dir="ltr">Iniciamos nuestro primer espacio online de Aplacados Spaces #1 🌌<br><br>Un espacio libre y real para hablar sobre trading, futuros, mercados de predicción, DeFi, memes, NTFs y AI.<br><br>👇🏻Agendate Miércoles, 18:00 EDT (UTC -5) <a href="https://t.co/B3fGSOnJYa">pic.twitter.com/B3fGSOnJYa</a></p>&mdash; apalancados (@ApalancadosTech) <a href="https://twitter.com/ApalancadosTech/status/2025614018572902897?ref_src=twsrc%5Etfw">February 22, 2026</a></blockquote>`,
  },
]

export default function LiveHubPage() {
  // Load Twitter widgets.js once, then call load() to hydrate blockquotes
  useEffect(() => {
    const SCRIPT_ID = 'twitter-widgets-js'
    if (!document.getElementById(SCRIPT_ID)) {
      const s = document.createElement('script')
      s.id = SCRIPT_ID
      s.src = 'https://platform.twitter.com/widgets.js'
      s.async = true
      s.onload = () => window.twttr?.widgets.load()
      document.body.appendChild(s)
    } else {
      window.twttr?.widgets.load()
    }
  }, [])

  return (
    <div className="min-h-screen grid-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20 space-y-8">

        {/* ── Page header ── */}
        <div>
          <p className="section-label mb-1">TRANSMISIONES</p>
          <h1 className="font-chakra text-2xl font-bold text-white tracking-wider">
            LIVE <span className="text-cyber-green">HUB</span>
          </h1>
        </div>

        {/* ════════════════════════════════════════════
            §1  KICK STREAM
        ════════════════════════════════════════════ */}
        <div>
          {/* Header bar */}
          <div className="flex items-center gap-3 mb-4">
            <span className="w-2 h-2 rounded-full bg-cyber-green animate-live-pulse flex-shrink-0" />
            <span
              className="text-[10px] tracking-[0.3em] text-cyber-green uppercase"
              style={{ fontFamily: 'var(--font-dm-mono)' }}
            >
              EN VIVO · KICK.COM/WMB81321
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-cyber-green/20 to-transparent" />
          </div>

          {/* Desktop 70/30 | Mobile stacked */}
          <div className="flex flex-col lg:flex-row gap-3">

            {/* Stream (70%) */}
            <div className="relative lg:w-[70%] rounded-xl overflow-hidden border border-border-dark neon-border shadow-xl shadow-black/50">
              {['top-0 left-0 border-t border-l', 'top-0 right-0 border-t border-r', 'bottom-0 left-0 border-b border-l', 'bottom-0 right-0 border-b border-r'].map((cls, i) => (
                <div key={i} className={`absolute w-5 h-5 z-10 border-cyber-green/50 ${cls}`} />
              ))}
              <KickPlayer username="wmb81321" />
            </div>

            {/* Chat (30%) */}
            <div className="lg:w-[30%] min-h-[300px] rounded-xl overflow-hidden border border-border-dark bg-panel/60 flex flex-col">
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border-dark flex-shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-cyber-green animate-live-pulse" />
                <span
                  className="text-[10px] tracking-widest text-gray-500 uppercase"
                  style={{ fontFamily: 'var(--font-dm-mono)' }}
                >
                  CHAT EN VIVO
                </span>
              </div>
              <iframe
                src="https://kick.com/wmb81321/chatroom"
                className="flex-1 w-full min-h-[280px]"
                style={{ border: 'none' }}
                title="Chat de wmb81321"
              />
            </div>
          </div>

          {/* Meta bar */}
          <div className="flex items-center justify-between mt-2.5 px-0.5">
            <span
              className="text-[10px] tracking-widest text-gray-600"
              style={{ fontFamily: 'var(--font-dm-mono)' }}
            >
              STREAMER: <span className="text-cyber-green">WMB81321</span>
            </span>
            <a
              href="https://kick.com/wmb81321"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] tracking-widest text-cyber-green/50 hover:text-cyber-green transition-colors"
              style={{ fontFamily: 'var(--font-dm-mono)' }}
            >
              ABRIR EN KICK ↗
            </a>
          </div>
        </div>

        {/* ════════════════════════════════════════════
            §2  COINGECKO PRICE BANNER
        ════════════════════════════════════════════ */}
        <div className="rounded-xl overflow-hidden border border-border-dark bg-panel/30">
          <CoinGeckoPriceBanner />
        </div>

        {/* ════════════════════════════════════════════
            §3  GRABACIONES & POSTS EN X
        ════════════════════════════════════════════ */}
        <div className="hr-glow" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* ── YouTube column ── */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <YoutubeIcon className="w-4 h-4 text-[#ff4444]" />
              <h2 className="font-chakra text-sm font-semibold text-white tracking-[0.15em]">
                GRABACIONES
              </h2>
              <div className="flex-1 h-px bg-gradient-to-r from-[#ff4444]/20 to-transparent" />
            </div>

            <div className="space-y-4">
              {youtubeVideos.map((v) => {
                const isPlaceholder = v.videoId.startsWith('REPLACE')
                return (
                  <div key={v.id} className="neon-border rounded-xl overflow-hidden bg-panel/40">
                    {isPlaceholder ? (
                      /* Placeholder shown until a real video ID is added */
                      <div className="flex flex-col items-center justify-center gap-2.5 py-14 px-6 text-center">
                        <YoutubeIcon className="w-8 h-8 text-[#ff4444]/25" />
                        <p
                          className="text-[10px] tracking-widest text-gray-600 uppercase"
                          style={{ fontFamily: 'var(--font-dm-mono)' }}
                        >
                          AGREGA TU VIDEO ID
                        </p>
                        <p className="font-outfit text-[11px] text-gray-700 max-w-[180px] leading-relaxed">
                          Reemplaza{' '}
                          <code className="text-cyber-green/50">
                            youtubeVideos[{youtubeVideos.indexOf(v)}].videoId
                          </code>{' '}
                          en <code className="text-cyber-green/50">live-hub/page.tsx</code>
                        </p>
                      </div>
                    ) : (
                      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                        <iframe
                          src={`https://www.youtube.com/embed/${v.videoId}`}
                          className="absolute inset-0 w-full h-full"
                          style={{ border: 'none' }}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          title={v.title}
                        />
                      </div>
                    )}
                    <div className="px-4 py-3 border-t border-border-dark">
                      <p className="font-chakra text-xs text-gray-400">{v.title}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* ── X column ── */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-white flex-shrink-0" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <h2 className="font-chakra text-sm font-semibold text-white tracking-[0.15em]">
                POSTS EN X
              </h2>
              <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
            </div>

            <div className="space-y-4">
              {xPosts.map((post) => (
                <div
                  key={post.id}
                  className="rounded-xl overflow-hidden bg-panel/40 neon-border p-2"
                  dangerouslySetInnerHTML={{ __html: post.html }}
                />
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
