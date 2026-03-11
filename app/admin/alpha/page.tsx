'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, X as XIcon, RefreshCw } from 'lucide-react'

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
  display_order: number
  image_url: string | null
  dex_website: string | null
  x_handle: string | null
  dex_url: string | null
  pair_created_at: number | null
  base_token_address: string | null
  base_token_name: string | null
  base_token_symbol: string | null
}

type DexPreview = {
  priceUsd: string | null
  imageUrl: string | null
  dexWebsite: string | null
  xHandle: string | null
  dexUrl: string | null
  pairCreatedAt: number | null
  baseTokenAddress: string | null
  baseTokenName: string | null
  baseTokenSymbol: string | null
}

type FormData = {
  name: string
  ticker: string
  type: string
  industry: string
  category: string
  website: string
  x_url: string
  contract_address: string
  chain_id: string
  display_order: number
}

const ASSET_TYPES = [
  { value: 'crypto', label: 'Crypto', color: '#00ff41' },
  { value: 'stock', label: 'Stock', color: '#00d4ff' },
  { value: 'etf', label: 'ETF', color: '#f59e0b' },
  { value: 'rwa', label: 'RWA', color: '#bc13fe' },
]

const CHAIN_IDS = [
  { value: 'ethereum', label: 'Ethereum' },
  { value: 'base', label: 'Base' },
  { value: 'solana', label: 'Solana' },
  { value: 'xrpl', label: 'XRPL' },
  { value: 'bitcoin', label: 'Bitcoin' },
  { value: 'arbitrum', label: 'Arbitrum' },
  { value: 'linea', label: 'Linea' },
]

const EMPTY_FORM: FormData = {
  name: '',
  ticker: '',
  type: 'crypto',
  industry: '',
  category: '',
  website: '',
  x_url: '',
  contract_address: '',
  chain_id: 'ethereum',
  display_order: 0,
}

export default function AdminAlphaPage() {
  const [assets, setAssets] = useState<AlphaAsset[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<AlphaAsset | null>(null)
  const [form, setForm] = useState<FormData>(EMPTY_FORM)
  const [filterType, setFilterType] = useState('all')
  const [dexPreview, setDexPreview] = useState<DexPreview | null>(null)
  const [fetchingDex, setFetchingDex] = useState(false)
  const [dexError, setDexError] = useState('')
  const supabase = createClient()

  const loadAssets = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('alpha_assets')
      .select('*')
      .order('display_order', { ascending: true })
    if (!error && data) setAssets(data)
    setLoading(false)
  }

  useEffect(() => { loadAssets() }, [])

  const fetchDexData = async () => {
    if (!form.contract_address || !form.chain_id) return
    setFetchingDex(true)
    setDexError('')
    setDexPreview(null)
    try {
      const res = await fetch(`/api/dexscreener/${form.chain_id}/${form.contract_address}`)
      const data = await res.json()
      if (!data) {
        setDexError('No se encontró el token en DexScreener.')
      } else {
        setDexPreview(data)
      }
    } catch {
      setDexError('Error al conectar con DexScreener.')
    } finally {
      setFetchingDex(false)
    }
  }

  const openModal = (asset?: AlphaAsset) => {
    setDexPreview(null)
    setDexError('')
    if (asset) {
      setEditing(asset)
      setForm({
        name: asset.name,
        ticker: asset.ticker,
        type: asset.type,
        industry: asset.industry ?? '',
        category: asset.category ?? '',
        website: asset.website ?? '',
        x_url: asset.x_url ?? '',
        contract_address: asset.contract_address ?? '',
        chain_id: asset.chain_id ?? 'ethereum',
        display_order: asset.display_order,
      })
      // populate preview from saved DB data
      if (asset.type === 'crypto' && asset.image_url) {
        setDexPreview({
          priceUsd: null,
          imageUrl: asset.image_url,
          dexWebsite: asset.dex_website,
          xHandle: asset.x_handle,
          dexUrl: asset.dex_url,
          pairCreatedAt: asset.pair_created_at,
          baseTokenAddress: asset.base_token_address,
          baseTokenName: asset.base_token_name,
          baseTokenSymbol: asset.base_token_symbol,
        })
      }
    } else {
      setEditing(null)
      setForm(EMPTY_FORM)
    }
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditing(null)
    setForm(EMPTY_FORM)
    setDexPreview(null)
    setDexError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const staticDex = form.type === 'crypto' && dexPreview ? {
      image_url: dexPreview.imageUrl,
      dex_website: dexPreview.dexWebsite,
      x_handle: dexPreview.xHandle,
      dex_url: dexPreview.dexUrl,
      pair_created_at: dexPreview.pairCreatedAt,
      base_token_address: dexPreview.baseTokenAddress,
      base_token_name: dexPreview.baseTokenName,
      base_token_symbol: dexPreview.baseTokenSymbol,
    } : {}

    const payload = {
      name: form.name,
      ticker: form.ticker,
      type: form.type,
      industry: form.industry || null,
      category: form.category || null,
      website: form.type !== 'crypto' ? (form.website || null) : null,
      x_url: form.type !== 'crypto' ? (form.x_url || null) : null,
      contract_address: form.contract_address || null,
      chain_id: form.type === 'crypto' && form.contract_address ? form.chain_id : null,
      display_order: form.display_order,
      ...staticDex,
    }

    if (editing) {
      const { error } = await supabase.from('alpha_assets').update(payload).eq('id', editing.id)
      if (!error) { await loadAssets(); closeModal() }
    } else {
      const { error } = await supabase.from('alpha_assets').insert([payload])
      if (!error) { await loadAssets(); closeModal() }
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este activo?')) return
    const { error } = await supabase.from('alpha_assets').delete().eq('id', id)
    if (!error) await loadAssets()
  }

  const filtered = filterType === 'all' ? assets : assets.filter(a => a.type === filterType)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-chakra text-2xl font-bold text-white mb-1">Alpha Picks</h1>
          <p className="font-outfit text-sm text-gray-500">Activos curados con datos de DexScreener</p>
        </div>
        <button onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-cyber-green hover:bg-cyber-green/90 text-true-black font-chakra text-sm tracking-wide rounded-lg transition-colors">
          <Plus className="w-4 h-4" />
          Nuevo Activo
        </button>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button onClick={() => setFilterType('all')}
          className={`px-4 py-2 rounded-lg font-chakra text-xs tracking-wide transition-colors flex-shrink-0 border ${
            filterType === 'all' ? 'bg-cyber-green/10 text-cyber-green border-cyber-green/30' : 'bg-panel/40 text-gray-400 border-border-dark hover:text-white'
          }`}>
          Todos ({assets.length})
        </button>
        {ASSET_TYPES.map((t) => (
          <button key={t.value} onClick={() => setFilterType(t.value)}
            className={`px-4 py-2 rounded-lg font-chakra text-xs tracking-wide transition-colors flex-shrink-0 border ${
              filterType === t.value ? 'border' : 'bg-panel/40 text-gray-400 border-border-dark hover:text-white'
            }`}
            style={filterType === t.value ? { backgroundColor: `${t.color}10`, color: t.color, borderColor: `${t.color}30` } : {}}>
            {t.label} ({assets.filter(a => a.type === t.value).length})
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Cargando...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 bg-panel/40 border border-border-dark rounded-xl">
          <p className="text-gray-500 mb-4">No hay activos</p>
          <button onClick={() => openModal()} className="text-cyber-green hover:underline text-sm">Agregar el primero</button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-dark">
                <th className="text-left py-3 px-4 font-chakra text-xs text-gray-500 tracking-widest">NOMBRE</th>
                <th className="text-left py-3 px-4 font-chakra text-xs text-gray-500 tracking-widest">TICKER</th>
                <th className="text-left py-3 px-4 font-chakra text-xs text-gray-500 tracking-widest">TIPO</th>
                <th className="text-left py-3 px-4 font-chakra text-xs text-gray-500 tracking-widest">CHAIN</th>
                <th className="text-left py-3 px-4 font-chakra text-xs text-gray-500 tracking-widest">CONTRATO</th>
                <th className="text-right py-3 px-4 font-chakra text-xs text-gray-500 tracking-widest">ACCIONES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-dark">
              {filtered.map((asset) => {
                const typeInfo = ASSET_TYPES.find(t => t.value === asset.type)
                return (
                  <tr key={asset.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {asset.image_url && (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img src={asset.image_url} alt={asset.name} className="w-6 h-6 rounded-full object-cover flex-shrink-0" />
                        )}
                        <span className="font-outfit text-white">{asset.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-gray-400 text-xs">{asset.ticker}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-chakra tracking-wide border"
                        style={{ backgroundColor: `${typeInfo?.color}10`, color: typeInfo?.color, borderColor: `${typeInfo?.color}30` }}>
                        {asset.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-gray-500 text-xs">{asset.chain_id ?? '—'}</td>
                    <td className="py-3 px-4 font-mono text-gray-600 text-[10px] max-w-[120px] truncate">{asset.contract_address ?? '—'}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openModal(asset)}
                          className="p-1.5 rounded bg-panel/60 border border-border-dark hover:border-cyber-green/40 transition-colors text-gray-400 hover:text-cyber-green">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDelete(asset.id)}
                          className="p-1.5 rounded bg-panel/60 border border-border-dark hover:border-red-500/40 transition-colors text-gray-400 hover:text-red-400">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-true-black border border-border-dark rounded-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-chakra text-xl font-bold text-white">{editing ? 'Editar Activo' : 'Nuevo Activo'}</h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-white transition-colors"><XIcon className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-chakra text-xs text-gray-400 mb-2 tracking-wide">Nombre *</label>
                <input type="text" required value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 bg-panel/40 border border-border-dark rounded-lg text-white font-outfit text-sm focus:outline-none focus:border-cyber-green/30"
                  placeholder="Bitcoin" />
              </div>

              <div>
                <label className="block font-chakra text-xs text-gray-400 mb-2 tracking-wide">Ticker *</label>
                <input type="text" required value={form.ticker}
                  onChange={(e) => setForm({ ...form, ticker: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 bg-panel/40 border border-border-dark rounded-lg text-white font-outfit text-sm focus:outline-none focus:border-cyber-green/30"
                  placeholder="BTC" />
              </div>

              <div>
                <label className="block font-chakra text-xs text-gray-400 mb-2 tracking-wide">Tipo *</label>
                <select required value={form.type}
                  onChange={(e) => { setForm({ ...form, type: e.target.value }); setDexPreview(null) }}
                  className="w-full px-3 py-2 bg-panel/40 border border-border-dark rounded-lg text-white font-outfit text-sm focus:outline-none focus:border-cyber-green/30">
                  {ASSET_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>

              {(form.type === 'stock' || form.type === 'etf') && (
                <>
                  <div>
                    <label className="block font-chakra text-xs text-gray-400 mb-2 tracking-wide">Industria</label>
                    <input type="text" value={form.industry}
                      onChange={(e) => setForm({ ...form, industry: e.target.value })}
                      className="w-full px-3 py-2 bg-panel/40 border border-border-dark rounded-lg text-white font-outfit text-sm focus:outline-none focus:border-cyber-green/30"
                      placeholder="Tecnología" />
                  </div>
                  <div>
                    <label className="block font-chakra text-xs text-gray-400 mb-2 tracking-wide">Categoría</label>
                    <input type="text" value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full px-3 py-2 bg-panel/40 border border-border-dark rounded-lg text-white font-outfit text-sm focus:outline-none focus:border-cyber-green/30"
                      placeholder="Large Cap" />
                  </div>
                </>
              )}

              {form.type === 'crypto' && (
                <>
                  <div>
                    <label className="block font-chakra text-xs text-gray-400 mb-2 tracking-wide">Contrato</label>
                    <input type="text" value={form.contract_address}
                      onChange={(e) => { setForm({ ...form, contract_address: e.target.value }); setDexPreview(null) }}
                      className="w-full px-3 py-2 bg-panel/40 border border-border-dark rounded-lg text-white font-outfit text-sm focus:outline-none focus:border-cyber-green/30"
                      placeholder="0x... o dirección de Solana" />
                  </div>
                  <div>
                    <label className="block font-chakra text-xs text-gray-400 mb-2 tracking-wide">Chain</label>
                    <select value={form.chain_id}
                      onChange={(e) => { setForm({ ...form, chain_id: e.target.value }); setDexPreview(null) }}
                      className="w-full px-3 py-2 bg-panel/40 border border-border-dark rounded-lg text-white font-outfit text-sm focus:outline-none focus:border-cyber-green/30">
                      {CHAIN_IDS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                  </div>

                  {/* Fetch button */}
                  {form.contract_address && (
                    <button type="button" onClick={fetchDexData} disabled={fetchingDex}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-panel/40 hover:bg-panel/60 border border-cyber-green/30 text-cyber-green font-chakra text-xs tracking-wide rounded-lg transition-colors disabled:opacity-50">
                      <RefreshCw className={`w-3.5 h-3.5 ${fetchingDex ? 'animate-spin' : ''}`} />
                      {fetchingDex ? 'Obteniendo...' : 'Obtener datos de DexScreener'}
                    </button>
                  )}

                  {dexError && (
                    <p className="text-[11px] text-red-400 font-mono">{dexError}</p>
                  )}

                  {/* Preview */}
                  {dexPreview && (
                    <div className="rounded-lg border border-cyber-green/20 bg-cyber-green/5 p-3 space-y-2">
                      <p className="font-chakra text-[10px] text-cyber-green tracking-widest mb-2">PREVIEW — DATOS A GUARDAR</p>
                      <div className="flex items-center gap-3">
                        {dexPreview.imageUrl && (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img src={dexPreview.imageUrl} alt="token" className="w-10 h-10 rounded-full object-cover border border-border-dark" />
                        )}
                        <div>
                          <p className="font-mono text-xs text-white">{dexPreview.baseTokenName} <span className="text-gray-500">({dexPreview.baseTokenSymbol})</span></p>
                          {dexPreview.priceUsd && <p className="font-mono text-xs text-cyber-green">${Number(dexPreview.priceUsd).toPrecision(4)}</p>}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-1 text-[10px] font-mono text-gray-400">
                        {dexPreview.dexWebsite && <p>🌐 {dexPreview.dexWebsite}</p>}
                        {dexPreview.xHandle && <p>𝕏 @{dexPreview.xHandle}</p>}
                        {dexPreview.pairCreatedAt && (
                          <p>📅 Par creado: {new Date(dexPreview.pairCreatedAt).toLocaleDateString('es-ES')}</p>
                        )}
                        {dexPreview.baseTokenAddress && (
                          <p className="truncate">📋 {dexPreview.baseTokenAddress}</p>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}

              {form.type !== 'crypto' && (
                <>
                  <div>
                    <label className="block font-chakra text-xs text-gray-400 mb-2 tracking-wide">Website</label>
                    <input type="url" value={form.website}
                      onChange={(e) => setForm({ ...form, website: e.target.value })}
                      className="w-full px-3 py-2 bg-panel/40 border border-border-dark rounded-lg text-white font-outfit text-sm focus:outline-none focus:border-cyber-green/30"
                      placeholder="https://..." />
                  </div>
                  <div>
                    <label className="block font-chakra text-xs text-gray-400 mb-2 tracking-wide">X / Twitter</label>
                    <input type="url" value={form.x_url}
                      onChange={(e) => setForm({ ...form, x_url: e.target.value })}
                      className="w-full px-3 py-2 bg-panel/40 border border-border-dark rounded-lg text-white font-outfit text-sm focus:outline-none focus:border-cyber-green/30"
                      placeholder="https://twitter.com/..." />
                  </div>
                </>
              )}

              <div>
                <label className="block font-chakra text-xs text-gray-400 mb-2 tracking-wide">Orden</label>
                <input type="number" value={form.display_order}
                  onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-panel/40 border border-border-dark rounded-lg text-white font-outfit text-sm focus:outline-none focus:border-cyber-green/30" />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal}
                  className="flex-1 px-4 py-2 bg-panel/40 hover:bg-panel/60 border border-border-dark text-gray-400 hover:text-white font-chakra text-sm rounded-lg transition-colors">
                  Cancelar
                </button>
                <button type="submit"
                  className="flex-1 px-4 py-2 bg-cyber-green hover:bg-cyber-green/90 text-true-black font-chakra text-sm rounded-lg transition-colors">
                  {editing ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
