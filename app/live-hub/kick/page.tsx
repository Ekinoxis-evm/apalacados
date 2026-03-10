"use client"
import KickPlayer from '@/components/KickPlayer'
import CoinGeckoPriceBanner from '@/components/CoinGeckoPriceBanner'
import { useState } from 'react'

const KICK_CHANNELS = [
  { id: 'apalancados', label: 'APALANCADOS', display: 'APALANCADOS' },
  { id: 'wmb81321',    label: 'WMB81321',    display: 'WMB81321' },
]

export default function KickPage() {
  const [channel, setChannel] = useState(KICK_CHANNELS[0].id)
  const ch = KICK_CHANNELS.find((c) => c.id === channel)!

  return (
    <div className="min-h-screen grid-bg max-w-4xl mx-auto px-4 py-10 space-y-8">
      <h1 className="font-chakra text-2xl font-bold text-white tracking-wider mb-4">
        LIVE <span className="text-cyber-green">KICK</span>
      </h1>
      <div className="flex items-center gap-2 mb-4">
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
      <div className="flex flex-col lg:flex-row gap-3">
        <div className="relative lg:w-[70%] min-h-[220px] rounded-xl overflow-hidden border border-border-dark neon-border shadow-xl shadow-black/50">
          {['top-0 left-0 border-t border-l', 'top-0 right-0 border-t border-r', 'bottom-0 left-0 border-b border-l', 'bottom-0 right-0 border-b border-r'].map((cls, i) => (
            <div key={i} className={`absolute w-5 h-5 z-10 border-cyber-green/50 ${cls}`} />
          ))}
          <KickPlayer username={ch.id} />
        </div>
        <div className="lg:w-[30%] min-h-[200px] lg:min-h-[300px] rounded-xl overflow-hidden border border-border-dark bg-panel/60 flex flex-col">
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
      <div className="flex items-center justify-between px-0.5 mt-2">
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
      <div className="rounded-xl overflow-hidden border border-border-dark bg-panel/30 mt-4">
        <CoinGeckoPriceBanner />
      </div>
    </div>
  )
}
