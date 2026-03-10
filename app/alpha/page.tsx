import { createClient } from '@/lib/supabase/server'
import AlphaCard from './AlphaCard'

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

const TYPE_FILTERS = [
  { value: 'all', label: 'Todos' },
  { value: 'crypto', label: 'Crypto' },
  { value: 'stock', label: 'Stocks' },
  { value: 'etf', label: 'ETFs' },
  { value: 'rwa', label: 'RWA' },
]

export default async function AlphaPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>
}) {
  const { type } = await searchParams
  const activeType = type ?? 'all'

  const supabase = await createClient()
  const query = supabase
    .from('alpha_assets')
    .select('*')
    .order('display_order', { ascending: true })

  const { data: assets } = activeType === 'all'
    ? await query
    : await query.eq('type', activeType)

  const items = (assets ?? []) as AlphaAsset[]

  return (
    <div className="min-h-screen grid-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20 space-y-8">

        {/* Header */}
        <div>
          <p className="section-label mb-1">RESEARCH</p>
          <h1 className="font-chakra text-3xl font-bold text-white tracking-wider">
            ALPHA <span className="text-cyber-green">PICKS</span>
          </h1>
          <p className="text-gray-500 text-sm mt-2 font-outfit">
            Activos curados — crypto, stocks, ETFs y RWAs con datos en tiempo real.
          </p>
        </div>

        {/* Filter bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {TYPE_FILTERS.map((f) => (
            <a
              key={f.value}
              href={f.value === 'all' ? '/alpha' : `/alpha?type=${f.value}`}
              className={`px-4 py-2 rounded-lg font-chakra text-xs tracking-wide transition-colors flex-shrink-0 border ${
                activeType === f.value
                  ? 'bg-cyber-green/10 text-cyber-green border-cyber-green/30'
                  : 'bg-panel/40 text-gray-400 border-border-dark hover:text-white'
              }`}
            >
              {f.label}
            </a>
          ))}
          <span className="ml-auto text-[10px] text-gray-600 font-mono tracking-widest flex-shrink-0">
            {items.length} ACTIVOS
          </span>
        </div>

        {/* Grid */}
        {items.length === 0 ? (
          <div className="text-center py-20 text-gray-600 font-outfit">
            No hay activos en esta categoría aún.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((asset) => (
              <AlphaCard key={asset.id} asset={asset} />
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
