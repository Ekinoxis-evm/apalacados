'use client'

import { useState, useEffect } from 'react'
import KickPlayer from '@/components/KickPlayer'
import CoinGeckoPriceBanner from '@/components/CoinGeckoPriceBanner'

declare global {
  interface Window {
    twttr?: { widgets: { load: (el?: Element | null) => void } }
  }
}

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

// To add more posts: Tweet → ••• → Embed → copy <blockquote> → add data-theme="dark" data-width="320"
const xPosts = [
  {
    id: '2025614018572902897',
    html: `<blockquote class="twitter-tweet" data-theme="dark" data-width="320"><p lang="es" dir="ltr">Iniciamos nuestro primer espacio online de Aplacados Spaces #1 🌌<br><br>Un espacio libre y real para hablar sobre trading, futuros, mercados de predicción, DeFi, memes, NTFs y AI.<br><br>👇🏻Agendate Miércoles, 18:00 EDT (UTC -5) <a href="https://t.co/B3fGSOnJYa">pic.twitter.com/B3fGSOnJYa</a></p>&mdash; apalancados (@ApalancadosTech) <a href="https://twitter.com/ApalancadosTech/status/2025614018572902897?ref_src=twsrc%5Etfw">February 22, 2026</a></blockquote>`,
  },
]

// ── Tab types ───────────────────────────────────────────────────────────
type Tab = 'KICK' | 'YOUTUBE' | 'X'

const TABS: { id: Tab; label: string; accent: string }[] = [
  { id: 'KICK',    label: 'KICK',    accent: '#00ff41' },
  { id: 'X',       label: 'X',       accent: '#e7e9ea' },
  { id: 'YOUTUBE', label: 'YOUTUBE', accent: '#ff4444' },
]

// ── Tab content components ──────────────────────────────────────────────

function KickTab() {
  return (
    <div className="space-y-5">
      {/* Stream header */}
      <div className="flex items-center gap-3">
        <span className="w-2 h-2 rounded-full bg-cyber-green animate-live-pulse flex-shrink-0" />
        <span
          className="text-[10px] tracking-[0.3em] text-cyber-green uppercase"
          style={{ fontFamily: 'var(--font-dm-mono)' }}
        >
          EN VIVO · KICK.COM/WMB81321
        </span>
        <div className="flex-1 h-px bg-gradient-to-r from-cyber-green/20 to-transparent" />
      </div>

      {/* 70/30 stream + chat */}
      <div className="flex flex-col lg:flex-row gap-3">
        {/* Player */}
        <div className="relative lg:w-[70%] rounded-xl overflow-hidden border border-border-dark neon-border shadow-xl shadow-black/50">
          {['top-0 left-0 border-t border-l', 'top-0 right-0 border-t border-r', 'bottom-0 left-0 border-b border-l', 'bottom-0 right-0 border-b border-r'].map((cls, i) => (
            <div key={i} className={`absolute w-5 h-5 z-10 border-cyber-green/50 ${cls}`} />
          ))}
          <KickPlayer username="wmb81321" />
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
            src="https://kick.com/wmb81321/chatroom"
            className="flex-1 w-full min-h-[280px]"
            style={{ border: 'none' }}
            title="Chat de wmb81321"
          />
        </div>
      </div>

      {/* Meta bar */}
      <div className="flex items-center justify-between px-0.5">
        <span className="text-[10px] tracking-widest text-gray-600" style={{ fontFamily: 'var(--font-dm-mono)' }}>
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
        <h2 className="font-chakra text-sm font-semibold text-white tracking-[0.15em]">POSTS EN X</h2>
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

      {/*
        Tweets render at data-width="320" — compact card size.
        Grid adjusts: 1 col mobile → 2 col md → 3 col lg
      */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        {xPosts.map((post) => (
          <div
            key={post.id}
            className="break-inside-avoid rounded-xl overflow-hidden bg-panel/40 neon-border p-1.5"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
        ))}
      </div>
    </div>
  )
}

// ── Page ────────────────────────────────────────────────────────────────
export default function LiveHubPage() {
  const [activeTab, setActiveTab] = useState<Tab>('KICK')

  // Load Twitter widgets once
  useEffect(() => {
    const SCRIPT_ID = 'twitter-widgets-js'
    if (!document.getElementById(SCRIPT_ID)) {
      const s = document.createElement('script')
      s.id = SCRIPT_ID
      s.src = 'https://platform.twitter.com/widgets.js'
      s.async = true
      document.body.appendChild(s)
    }
  }, [])

  // Re-hydrate tweet embeds whenever the X tab becomes visible
  useEffect(() => {
    if (activeTab === 'X') {
      const timer = setTimeout(() => window.twttr?.widgets.load(), 150)
      return () => clearTimeout(timer)
    }
  }, [activeTab])

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
