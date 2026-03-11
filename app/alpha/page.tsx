import { createClient } from '@/lib/supabase/server'
import AlphaCard, { type AlphaAsset } from './AlphaCard'
import AlphaSortBar from './AlphaSortBar'
import ChainFilterBar from './ChainFilterBar'

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
  searchParams: Promise<{ type?: string; chain?: string; sort?: string }>
}) {
  const { type, chain, sort } = await searchParams
  const activeType = type ?? 'all'
  const activeChain = chain ?? 'all'
  const activeSort = sort ?? 'default'

  const supabase = await createClient()
  const query = supabase
    .from('alpha_assets')
    .select('*')
    .order('display_order', { ascending: true })

  const { data: assets } = activeType === 'all'
    ? await query
    : await query.eq('type', activeType)

  let items = (assets ?? []) as AlphaAsset[]
  // Filter by chain if selected
  if (activeChain !== 'all') {
    items = items.filter(a => a.chain_id === activeChain)
  }

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


        {/* Filter & Sort bar (Client Component) */}
        <AlphaSortBar activeType={activeType} sort={activeSort} itemsCount={items.length} />

        {/* Chain filter (Client Component) */}
        <ChainFilterBar activeType={activeType} activeChain={activeChain} activeSort={activeSort} assets={assets ?? []} />

        {/* Grid */}
        {items.length === 0 ? (
          <div className="text-center py-20 text-gray-600 font-outfit">
            No hay activos en esta categoría aún.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((asset) => (
              <AlphaCard key={asset.id} asset={asset} sort={sort} />
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
