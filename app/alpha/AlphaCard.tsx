'use client'

import { useEffect, useState } from 'react'
import { ExternalLink } from 'lucide-react'

type AlphaAsset = {
  id: string
  name: string
  ticker: string
  type: string
  industry: string | null
  category: string | null
  website: string | null
  x_url: string | null
  contract_address: string | null
  chain_id: string | null
}

type LiveData = {
  priceUsd: string | null
  priceChange24h: number | null
  volume24h: number | null
  liquidity: number | null
  fdv: number | null
  marketCap: number | null
  dexUrl: string | null
  pairCreatedAt: number | null
  imageUrl: string | null
  website: string | null
  xHandle: string | null
} | null

const TYPE_COLORS: Record<string, string> = {
  crypto: '#00ff41',
  stock: '#00d4ff',
  etf: '#f59e0b',
  rwa: '#bc13fe',
}

const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

function formatUsd(val: number | null): string {
  if (val === null) return '—'
  if (val >= 1_000_000_000) return `$${(val / 1_000_000_000).toFixed(2)}B`
  if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(2)}M`
  if (val >= 1_000) return `$${(val / 1_000).toFixed(2)}K`
  return `$${val.toFixed(2)}`
}

function formatAge(ts: number | null): string {
  if (!ts) return '—'
  const days = Math.floor((Date.now() - ts) / 86_400_000)
  if (days < 1) return 'hoy'
  if (days < 30) return `${days}d`
  if (days < 365) return `${Math.floor(days / 30)}m`
  return `${Math.floor(days / 365)}y`
}

function formatPrice(priceUsd: string | null): string {
  if (!priceUsd) return '—'
  const n = Number(priceUsd)
  if (n >= 1) return `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  // show up to 6 significant decimals for small prices
  return `$${n.toPrecision(4)}`
}

export default function AlphaCard({ asset }: { asset: AlphaAsset }) {
  const [live, setLive] = useState<LiveData>(undefined as unknown as LiveData)
  const [loadingLive, setLoadingLive] = useState(false)
  const color = TYPE_COLORS[asset.type] ?? '#00ff41'
  const hasDex = asset.type === 'crypto' && asset.contract_address && asset.chain_id

  useEffect(() => {
    if (!hasDex) return
    setLoadingLive(true)
    fetch(`/api/dexscreener/${asset.chain_id}/${asset.contract_address}`)
      .then((r) => r.json())
      .then((data) => setLive(data))
      .catch(() => setLive(null))
      .finally(() => setLoadingLive(false))
  }, [hasDex, asset.chain_id, asset.contract_address])

  const change = live?.priceChange24h
  const changePositive = change !== null && change !== undefined && change >= 0

  // For crypto: use API data. For others: use manual fields.
  const websiteUrl = hasDex ? live?.website : asset.website
  const xUrl = hasDex
    ? live?.xHandle ? `https://x.com/${live.xHandle}` : null
    : asset.x_url
  const imageUrl = hasDex ? live?.imageUrl : null

  return (
    <div
      className="group relative rounded-xl border border-border-dark bg-panel/40 flex flex-col hover:border-opacity-60 transition-all duration-200 overflow-hidden"
      style={{ borderColor: `${color}25` }}
    >
      {/* Token image (crypto only, from API) */}
      {hasDex && (
        <div className="w-full h-24 bg-true-black/60 flex items-center justify-center border-b border-border-dark">
          {loadingLive ? (
            <div className="w-10 h-10 rounded-full bg-panel/60 animate-pulse" />
          ) : imageUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={imageUrl} alt={asset.name} className="w-12 h-12 rounded-full object-cover" />
          ) : (
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center font-chakra text-lg font-bold"
              style={{ backgroundColor: `${color}15`, color }}
            >
              {asset.ticker.slice(0, 2)}
            </div>
          )}
        </div>
      )}

      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-chakra text-sm font-bold text-white tracking-wide">{asset.name}</h3>
            <span className="font-mono text-[10px] text-gray-500">{asset.ticker}</span>
          </div>
          <span
            className="px-2 py-0.5 rounded-full text-[10px] font-chakra tracking-wide border flex-shrink-0"
            style={{ backgroundColor: `${color}12`, color, borderColor: `${color}30` }}
          >
            {asset.type.toUpperCase()}
          </span>
        </div>

        {/* Industry / Category (stocks/etf) */}
        {(asset.industry || asset.category) && (
          <div className="flex flex-wrap gap-1">
            {asset.industry && (
              <span className="text-[10px] text-gray-500 bg-panel/60 border border-border-dark rounded px-2 py-0.5">
                {asset.industry}
              </span>
            )}
            {asset.category && (
              <span className="text-[10px] text-gray-500 bg-panel/60 border border-border-dark rounded px-2 py-0.5">
                {asset.category}
              </span>
            )}
          </div>
        )}

        {/* Live price */}
        {hasDex && (
          <div className="flex items-center justify-between bg-true-black/40 rounded-lg px-3 py-2 border border-border-dark">
            {loadingLive ? (
              <span className="text-[10px] text-gray-600 font-mono">cargando...</span>
            ) : live ? (
              <>
                <span className="font-mono text-sm text-white">{formatPrice(live.priceUsd)}</span>
                {change !== null && change !== undefined && (
                  <span
                    className="font-mono text-xs font-semibold"
                    style={{ color: changePositive ? '#00ff41' : '#ff4444' }}
                  >
                    {changePositive ? '+' : ''}{change.toFixed(2)}%
                  </span>
                )}
              </>
            ) : (
              <span className="text-[10px] text-gray-600 font-mono">precio no disponible</span>
            )}
          </div>
        )}

        {/* Stats row: MCap, FDV, Liquidity */}
        {hasDex && live && (
          <div className="grid grid-cols-3 gap-1 text-[10px] font-mono">
            <div className="bg-true-black/30 rounded px-2 py-1.5 flex flex-col gap-0.5">
              <span className="text-gray-600 tracking-widest">MCAP</span>
              <span className="text-gray-300">{formatUsd(live.marketCap)}</span>
            </div>
            <div className="bg-true-black/30 rounded px-2 py-1.5 flex flex-col gap-0.5">
              <span className="text-gray-600 tracking-widest">LIQ</span>
              <span className="text-gray-300">{formatUsd(live.liquidity)}</span>
            </div>
            <div className="bg-true-black/30 rounded px-2 py-1.5 flex flex-col gap-0.5">
              <span className="text-gray-600 tracking-widest">EDAD</span>
              <span className="text-gray-300">{formatAge(live.pairCreatedAt)}</span>
            </div>
          </div>
        )}

        {/* Chain badge */}
        {asset.chain_id && (
          <span className="text-[10px] text-gray-600 font-mono uppercase tracking-widest">
            {asset.chain_id}
          </span>
        )}

        {/* Links */}
        <div className="flex items-center gap-2 mt-auto pt-1">
          {websiteUrl && (
            <a
              href={websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg bg-panel/60 border border-border-dark hover:border-cyber-green/40 transition-colors"
              title="Website"
            >
              <ExternalLink className="w-3.5 h-3.5 text-gray-500 hover:text-cyber-green transition-colors" />
            </a>
          )}
          {xUrl && (
            <a
              href={xUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg bg-panel/60 border border-border-dark hover:border-cyber-green/40 transition-colors"
              title="X / Twitter"
            >
              <XIcon className="w-3.5 h-3.5 text-gray-500 hover:text-cyber-green transition-colors" />
            </a>
          )}
          {hasDex && live?.dexUrl && (
            <a
              href={live.dexUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto text-[10px] font-mono tracking-widest text-gray-600 hover:text-cyber-green transition-colors"
            >
              DEXSCREENER ↗
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
