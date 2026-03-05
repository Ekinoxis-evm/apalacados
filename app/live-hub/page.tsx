'use client'

import { useState } from 'react'
import KickPlayer from '@/components/KickPlayer'
import CoinGeckoPriceBanner from '@/components/CoinGeckoPriceBanner'

// ── SVG icons ──────────────────────────────────────────────────────────
const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
)
const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

// ── Data ────────────────────────────────────────────────────────────────

// Replace videoId values with your real YouTube video IDs
const youtubeVideos = [
  { id: 'yt-1', videoId: 'REPLACE_VIDEO_ID_1', title: 'Apalancados Spaces #1 — Trading & DeFi' },
  { id: 'yt-2', videoId: 'REPLACE_VIDEO_ID_2', title: 'Apalancados Spaces #2 — Prediction Markets' },
]

const xSpaces = [
  {
    id: 'space-1',
    title: 'Apalancados X Space #1',
    image: '/xspaces/1.png',
    url: 'https://x.com/i/spaces/1mGPaLLzQyDJN?s=20',
  },
  {
    id: 'space-2',
    title: 'Apalancados X Space #2',
    image: '/xspaces/2.png',
    url: 'https://x.com/i/spaces/1kKzDMPvQDgJv?s=20',
  },
]

// ── Tab types ───────────────────────────────────────────────────────────
type Tab = 'KICK' | 'YOUTUBE' | 'X'

const TABS: { id: Tab; label: string; accent: string }[] = [
  { id: 'KICK',    label: 'KICK',    accent: '#00ff41' },
  { id: 'X',       label: 'X',       accent: '#e7e9ea' },
  { id: 'YOUTUBE', label: 'YOUTUBE', accent: '#ff4444' },
]

// ── Kick channels ──────────────────────────────────────────────────────
const KICK_CHANNELS = [
  { id: 'apalancados', label: 'APALANCADOS', display: 'APALANCADOS' },
  { id: 'wmb81321',    label: 'WMB81321',    display: 'WMB81321' },
]

// ── Tab content components ──────────────────────────────────────────────

function KickTab() {
  const [channel, setChannel] = useState(KICK_CHANNELS[0].id)
  const ch = KICK_CHANNELS.find((c) => c.id === channel)!

  return (
    <div className="space-y-5">
      {/* Channel selector */}
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-cyber-green animate-live-pulse flex-shrink-0" />
        <div className="flex items-center gap-1 p-0.5 bg-panel/60 border border-border-dark rounded-lg">
          {KICK_CHANNELS.map((c) => {
            const active = channel === c.id
            return (
              <button
                key={c.id}
                onClick={() => setChannel(c.id)}
                className={`font-chakra text-[10px] tracking-widest px-4 py-1.5 rounded transition-all duration-200 ${
                  active
                    ? 'bg-true-black text-cyber-green shadow-md'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
                style={active ? { boxShadow: '0 0 14px #00ff4118' } : {}}
              >
                {c.label}
              </button>
            )
          })}
        </div>
        <div className="flex-1 h-px bg-gradient-to-r from-cyber-green/20 to-transparent" />
        <span
          className="text-[10px] tracking-[0.3em] text-cyber-green uppercase"
          style={{ fontFamily: 'var(--font-dm-mono)' }}
        >
          EN VIVO · KICK.COM/{ch.display}
        </span>
      </div>

      {/* 70/30 stream + chat */}
      <div className="flex flex-col lg:flex-row gap-3">
        {/* Player */}
        <div className="relative lg:w-[70%] rounded-xl overflow-hidden border border-border-dark neon-border shadow-xl shadow-black/50">
          {['top-0 left-0 border-t border-l', 'top-0 right-0 border-t border-r', 'bottom-0 left-0 border-b border-l', 'bottom-0 right-0 border-b border-r'].map((cls, i) => (
            <div key={i} className={`absolute w-5 h-5 z-10 border-cyber-green/50 ${cls}`} />
          ))}
          <KickPlayer username={ch.id} />
        </div>

        {/* Chat */}
        <div className="lg:w-[30%] min-h-[300px] rounded-xl overflow-hidden border border-border-dark bg-panel/60 flex flex-col">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border-dark flex-shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-cyber-green animate-live-pulse" />
            <span className="text-[10px] tracking-widest text-gray-500 uppercase" style={{ fontFamily: 'var(--font-dm-mono)' }}>
              CHAT EN VIVO
            </span>
          </div>
          <iframe
            key={ch.id}
            src={`https://kick.com/${ch.id}/chatroom`}
            className="flex-1 w-full min-h-[280px]"
            style={{ border: 'none' }}
            title={`Chat de ${ch.display}`}
          />
        </div>
      </div>

      {/* Meta bar */}
      <div className="flex items-center justify-between px-0.5">
        <span className="text-[10px] tracking-widest text-gray-600" style={{ fontFamily: 'var(--font-dm-mono)' }}>
          STREAMER: <span className="text-cyber-green">{ch.display}</span>
        </span>
        <a
          href={`https://kick.com/${ch.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] tracking-widest text-cyber-green/50 hover:text-cyber-green transition-colors"
          style={{ fontFamily: 'var(--font-dm-mono)' }}
        >
          ABRIR EN KICK ↗
        </a>
      </div>

      {/* CoinGecko price banner */}
      <div className="rounded-xl overflow-hidden border border-border-dark bg-panel/30">
        <CoinGeckoPriceBanner />
      </div>
    </div>
  )
}

function YouTubeTab() {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <YoutubeIcon className="w-4 h-4 text-[#ff4444]" />
        <h2 className="font-chakra text-sm font-semibold text-white tracking-[0.15em]">GRABACIONES</h2>
        <div className="flex-1 h-px bg-gradient-to-r from-[#ff4444]/20 to-transparent" />
        <span className="section-label" style={{ color: '#ff4444' }}>{youtubeVideos.filter(v => !v.videoId.startsWith('REPLACE')).length}/{youtubeVideos.length} VIDEOS</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {youtubeVideos.map((v) => {
          const isPlaceholder = v.videoId.startsWith('REPLACE')
          return (
            <div key={v.id} className="neon-border rounded-xl overflow-hidden bg-panel/40">
              {isPlaceholder ? (
                <div className="flex flex-col items-center justify-center gap-2.5 py-12 px-6 text-center">
                  <YoutubeIcon className="w-7 h-7 text-[#ff4444]/20" />
                  <p className="text-[10px] tracking-widest text-gray-600 uppercase" style={{ fontFamily: 'var(--font-dm-mono)' }}>
                    AGREGA TU VIDEO ID
                  </p>
                  <code className="text-[10px] text-gray-700 bg-black/40 px-2.5 py-1 rounded" style={{ fontFamily: 'var(--font-dm-mono)' }}>
                    youtubeVideos[{youtubeVideos.indexOf(v)}].videoId
                  </code>
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
              <div className="px-4 py-2.5 border-t border-border-dark">
                <p className="font-chakra text-xs text-gray-400">{v.title}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function XTab() {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <XIcon className="w-4 h-4 text-white" />
        <h2 className="font-chakra text-sm font-semibold text-white tracking-[0.15em]">X SPACES</h2>
        <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
        <a
          href="https://twitter.com/ApalancadosTech"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] tracking-widest text-gray-600 hover:text-white transition-colors"
          style={{ fontFamily: 'var(--font-dm-mono)' }}
        >
          @APALANCADOSTECH ↗
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
        {xSpaces.map((space) => (
          <a
            key={space.id}
            href={space.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block rounded-xl overflow-hidden border border-border-dark neon-border bg-panel/40 hover:border-white/20 transition-all duration-200"
          >
            {/* Chapter image */}
            <div className="relative w-full overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={space.image}
                alt={space.title}
                className="w-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
              />
              {/* Play overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/30">
                <div className="flex items-center gap-2 bg-black/70 border border-white/20 rounded-full px-4 py-2">
                  <XIcon className="w-3.5 h-3.5 text-white" />
                  <span className="text-[10px] tracking-widest text-white uppercase" style={{ fontFamily: 'var(--font-dm-mono)' }}>
                    ABRIR SPACE ↗
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-2.5 border-t border-border-dark">
              <p className="font-chakra text-xs text-gray-300 tracking-wide">{space.title}</p>
              <XIcon className="w-3 h-3 text-gray-500 group-hover:text-white transition-colors" />
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}

// ── Page ────────────────────────────────────────────────────────────────
export default function LiveHubPage() {
  const [activeTab, setActiveTab] = useState<Tab>('KICK')



  return (
    <div className="min-h-screen grid-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20 space-y-6">

        {/* Page header */}
        <div>
          <p className="section-label mb-1">TRANSMISIONES</p>
          <h1 className="font-chakra text-2xl font-bold text-white tracking-wider">
            LIVE <span className="text-cyber-green">HUB</span>
          </h1>
        </div>

        {/* ── Tab bar ── */}
        <div className="flex items-center gap-1 p-1 bg-panel/60 border border-border-dark rounded-lg w-fit">
          {TABS.map((t) => {
            const active = activeTab === t.id
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`font-chakra text-xs tracking-widest px-5 py-2 rounded transition-all duration-200 ${
                  active ? 'bg-true-black shadow-md' : 'text-gray-500 hover:text-gray-300'
                }`}
                style={active ? { color: t.accent, boxShadow: `0 0 14px ${t.accent}18` } : {}}
              >
                {t.id === 'KICK' ? (
                  <span className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full transition-colors ${active ? 'bg-cyber-green animate-live-pulse' : 'bg-gray-600'}`} />
                    {t.label}
                  </span>
                ) : t.id === 'YOUTUBE' ? (
                  <span className="flex items-center gap-1.5">
                    <YoutubeIcon className={`w-3 h-3 transition-colors ${active ? 'text-[#ff4444]' : 'text-gray-600'}`} />
                    {t.label}
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <XIcon className={`w-3 h-3 transition-colors ${active ? 'text-white' : 'text-gray-600'}`} />
                    {t.label}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* ── Tab content ── */}
        {activeTab === 'KICK'    && <KickTab />}
        {activeTab === 'X'       && <XTab />}
        {activeTab === 'YOUTUBE' && <YouTubeTab />}

      </div>
    </div>
  )
}
