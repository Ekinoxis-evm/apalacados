# TradFi Topic + Alpha Page + Mobile Improvements — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a TradFi topic, improve mobile responsive layout, and build a new Alpha page with live DexScreener price data for crypto assets managed from the admin.

**Architecture:** Three independent feature areas: (1) trivial topic registration in two files, (2) CSS/layout audit across existing pages, (3) new `alpha_assets` Supabase table + DexScreener proxy Route Handler + public `/alpha` page + admin `/admin/alpha` CRUD. Live crypto prices use a Next.js Route Handler that proxies DexScreener with 60-second cache.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Supabase (PostgreSQL + RLS), Tailwind CSS, DexScreener REST API (no SDK, plain fetch)

---

## File Map

| File | Action | Purpose |
|------|--------|---------|
| `components/Navbar.tsx` | Modify | Add TradFi topic entry + mobile layout fixes |
| `app/topics/[slug]/page.tsx` | Modify | Add `tradfi` to `topicMeta` |
| `app/admin/tools/page.tsx` | Modify | Add `tradfi` to admin topics list |
| `app/live-hub/kick/page.tsx` | Modify | Mobile layout fixes |
| `supabase/schema.sql` | Modify | Add `alpha_assets` table + RLS |
| `app/api/dexscreener/[chainId]/[contract]/route.ts` | Create | DexScreener proxy with 60s cache |
| `app/alpha/page.tsx` | Create | Public Alpha page (server component, asset grid) |
| `app/alpha/AlphaCard.tsx` | Create | Client component — card with live price fetch |
| `app/admin/alpha/page.tsx` | Create | Admin CRUD for alpha_assets |
| `app/admin/layout.tsx` | Modify | Add Alpha nav item to admin sidebar |

---

## Chunk 1: TradFi Topic

### Task 1: Add tradfi to topicMeta and Navbar

**Files:**
- Modify: `app/topics/[slug]/page.tsx`
- Modify: `components/Navbar.tsx`
- Modify: `app/admin/tools/page.tsx`

- [ ] **Step 1: Add `tradfi` to `topicMeta` in topics page**

In `app/topics/[slug]/page.tsx`, add to the `topicMeta` object (after the `ai` entry):

```ts
tradfi: {
  title: 'Traditional Finance',
  color: '#f59e0b',
  description: 'Exchanges centralizados, brokers y herramientas de finanzas tradicionales.',
  content: 'TradFi meets crypto. Exploramos exchanges centralizados, brokers regulados y plataformas que conectan las finanzas tradicionales con el ecosistema digital.',
},
```

- [ ] **Step 2: Add `tradfi` to Navbar topics array**

In `components/Navbar.tsx`, add `Landmark` to the lucide-react import and add the entry to the `topics` array:

```ts
// Add to import:
import {
  ChevronDown, Menu, X, TrendingUp, Target, Layers, Smile, Brain, Landmark,
} from 'lucide-react'

// Add to topics array (after ai):
{ name: 'Traditional Finance', href: '/topics/tradfi', icon: Landmark, color: '#f59e0b' },
```

- [ ] **Step 3: Add `tradfi` to the admin tools topic list**

In `app/admin/tools/page.tsx`, add to the `topics` constant array (after ai):

```ts
{ value: 'tradfi', label: 'Traditional Finance', color: '#f59e0b' },
```

- [ ] **Step 4: Verify — check TypeScript compiles**

```bash
cd /Users/williammartinez/Documents/ekinoxis/apalancados
npx tsc --noEmit
```

Expected: no errors related to these files.

- [ ] **Step 5: Commit**

```bash
git add components/Navbar.tsx app/topics/[slug]/page.tsx app/admin/tools/page.tsx
git commit -m "feat: add TradFi topic to navbar, topic pages, and admin"
```

---

## Chunk 2: Mobile Responsive Improvements

### Task 2: Audit and fix mobile layout

**Files:**
- Modify: `components/Navbar.tsx`
- Modify: `app/live-hub/kick/page.tsx`
- Modify: `app/topics/[slug]/page.tsx`

- [ ] **Step 1: Fix Navbar mobile menu tap targets**

In `components/Navbar.tsx`, inside the mobile menu `{mobileOpen && (...)}` block, ensure topic links have enough padding and the LIVE HUB section items are spaced:

```tsx
// In mobile menu, Live Hub links — increase tap target:
<Link href="/live-hub/kick" className="block py-2.5 text-gray-500 hover:text-cyber-green font-chakra text-xs tracking-widest transition-colors">
  KICK
</Link>
<Link href="/live-hub/x" className="block py-2.5 text-gray-500 hover:text-cyber-green font-chakra text-xs tracking-widest transition-colors">
  X SPACES
</Link>
<Link href="/live-hub/youtube" className="block py-2.5 text-gray-500 hover:text-cyber-green font-chakra text-xs tracking-widest transition-colors">
  YOUTUBE
</Link>
```

Also ensure the mobile menu has a max height and scrolls if content overflows:
```tsx
<div className="md:hidden glass border-t border-border-dark max-h-[80vh] overflow-y-auto">
```

- [ ] **Step 2: Fix Kick page mobile layout**

In `app/live-hub/kick/page.tsx`, the player + chat flex layout needs a min-height on mobile. Change:

```tsx
// Before:
<div className="flex flex-col lg:flex-row gap-3">
  <div className="relative lg:w-[70%] rounded-xl overflow-hidden ...">

// After — add explicit height on mobile:
<div className="flex flex-col lg:flex-row gap-3">
  <div className="relative lg:w-[70%] min-h-[220px] rounded-xl overflow-hidden ...">
```

Also the chat iframe on mobile should have a reasonable min-height:
```tsx
// Change min-h-[300px] to min-h-[200px] on the chat container on mobile
<div className="lg:w-[30%] min-h-[200px] lg:min-h-[300px] rounded-xl overflow-hidden ...">
```

- [ ] **Step 3: Fix topics page tool grid on very small screens**

In `app/topics/[slug]/page.tsx`, the tools grid is `grid-cols-2 sm:grid-cols-3 md:grid-cols-4`. On 320px devices, 2 columns can be tight. Change to:

```tsx
<div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
```

Since Tailwind doesn't have `xs` by default, use `min-[360px]:grid-cols-2` instead:
```tsx
<div className="grid grid-cols-1 min-[360px]:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
```

- [ ] **Step 4: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no new errors.

- [ ] **Step 5: Commit**

```bash
git add components/Navbar.tsx app/live-hub/kick/page.tsx app/topics/[slug]/page.tsx
git commit -m "fix: improve mobile responsive layout across navbar, kick page, and topic grids"
```

---

## Chunk 3: Alpha DB Migration + DexScreener API Route

### Task 3: Create alpha_assets Supabase table

**Files:**
- Modify: `supabase/schema.sql`

- [ ] **Step 1: Add migration SQL to schema.sql**

Append to `supabase/schema.sql`:

```sql
-- Create alpha_assets table
CREATE TABLE IF NOT EXISTS alpha_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  ticker TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('crypto', 'stock', 'etf', 'rwa')),
  industry TEXT,
  category TEXT,
  website TEXT,
  x_url TEXT,
  contract_address TEXT,
  chain_id TEXT CHECK (chain_id IN ('ethereum', 'base', 'solana', 'xrpl', 'bitcoin')),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE alpha_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all for authenticated users" ON alpha_assets
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read for all users" ON alpha_assets
  FOR SELECT USING (true);

-- updated_at trigger
CREATE TRIGGER update_alpha_assets_updated_at BEFORE UPDATE ON alpha_assets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

- [ ] **Step 2: Run migration in Supabase**

Go to Supabase Dashboard → SQL Editor, paste and run the migration above.

Verify by checking Table Editor — `alpha_assets` table should exist with all columns.

- [ ] **Step 3: Commit schema**

```bash
git add supabase/schema.sql
git commit -m "feat: add alpha_assets table with RLS to schema"
```

### Task 4: Create DexScreener API Route Handler

**Files:**
- Create: `app/api/dexscreener/[chainId]/[contract]/route.ts`

- [ ] **Step 1: Create the route handler file**

Create `app/api/dexscreener/[chainId]/[contract]/route.ts`:

```ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ chainId: string; contract: string }> }
) {
  const { chainId, contract } = await params

  try {
    const response = await fetch(
      `https://api.dexscreener.com/token-pairs/v1/${chainId}/${contract}`,
      {
        headers: { Accept: '*/*' },
        next: { revalidate: 60 },
      }
    )

    if (!response.ok) {
      return NextResponse.json(null, { status: 200 })
    }

    const pairs: DexPair[] = await response.json()
    if (!pairs || pairs.length === 0) {
      return NextResponse.json(null, { status: 200 })
    }

    // Return the first pair's key metrics
    const pair = pairs[0]
    return NextResponse.json({
      priceUsd: pair.priceUsd ?? null,
      priceChange24h: pair.priceChange?.h24 ?? null,
      volume24h: pair.volume?.h24 ?? null,
      liquidity: pair.liquidity?.usd ?? null,
      fdv: pair.fdv ?? null,
      marketCap: pair.marketCap ?? null,
      dexUrl: pair.url ?? null,
    })
  } catch {
    return NextResponse.json(null, { status: 200 })
  }
}

type DexPair = {
  priceUsd?: string | null
  priceChange?: { h24?: number }
  volume?: { h24?: number }
  liquidity?: { usd?: number }
  fdv?: number | null
  marketCap?: number | null
  url?: string
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Test the route locally**

Start dev server (`npm run dev`) and test with a known token:
```
http://localhost:3000/api/dexscreener/solana/JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN
```
Expected: JSON with `priceUsd`, `priceChange24h`, etc.

- [ ] **Step 4: Commit**

```bash
git add app/api/dexscreener/
git commit -m "feat: add DexScreener proxy route handler with 60s cache"
```

---

## Chunk 4: Alpha Public Page

### Task 5: Create AlphaCard client component

**Files:**
- Create: `app/alpha/AlphaCard.tsx`

- [ ] **Step 1: Create AlphaCard.tsx**

Create `app/alpha/AlphaCard.tsx`:

```tsx
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
  fdv: number | null
  marketCap: number | null
  dexUrl: string | null
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

  return (
    <div
      className="group relative rounded-xl border border-border-dark bg-panel/40 p-4 flex flex-col gap-3 hover:border-opacity-60 transition-all duration-200"
      style={{ borderColor: `${color}25` }}
    >
      {/* Header row */}
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

      {/* Industry / Category (stocks) */}
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

      {/* Live price (crypto only) */}
      {hasDex && (
        <div className="flex items-center justify-between bg-true-black/40 rounded-lg px-3 py-2 border border-border-dark">
          {loadingLive ? (
            <span className="text-[10px] text-gray-600 font-mono">cargando...</span>
          ) : live ? (
            <>
              <span className="font-mono text-sm text-white">
                ${live.priceUsd ? Number(live.priceUsd).toFixed(6) : '—'}
              </span>
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

      {/* FDV / MCap row */}
      {hasDex && live && (live.fdv || live.marketCap) && (
        <div className="flex gap-3 text-[10px] text-gray-500 font-mono">
          {live.marketCap && <span>MCap: <span className="text-gray-400">{formatUsd(live.marketCap)}</span></span>}
          {live.fdv && <span>FDV: <span className="text-gray-400">{formatUsd(live.fdv)}</span></span>}
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
        {asset.website && (
          <a
            href={asset.website}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg bg-panel/60 border border-border-dark hover:border-cyber-green/40 transition-colors"
            title="Website"
          >
            <ExternalLink className="w-3.5 h-3.5 text-gray-500 hover:text-cyber-green transition-colors" />
          </a>
        )}
        {asset.x_url && (
          <a
            href={asset.x_url}
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
  )
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors.

### Task 6: Create Alpha public page

**Files:**
- Create: `app/alpha/page.tsx`

- [ ] **Step 1: Create the server page**

Create `app/alpha/page.tsx`:

```tsx
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
```

- [ ] **Step 2: Add Alpha link to Navbar**

In `components/Navbar.tsx`, add an ALPHA link in the desktop nav (after EVENTS) and in the mobile menu:

```tsx
// Desktop — after EVENTS link:
<Link
  href="/alpha"
  className={`font-chakra text-xs tracking-widest transition-colors ${isActive('/alpha') ? 'text-cyber-green' : 'text-gray-400 hover:text-white'}`}
>
  ALPHA
</Link>

// Mobile — after EVENTS link:
<Link href="/alpha" className={`block py-1.5 font-chakra text-xs tracking-widest transition-colors ${isActive('/alpha') ? 'text-cyber-green' : 'text-gray-400 hover:text-cyber-green'}`}>
  ALPHA
</Link>
```

- [ ] **Step 3: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add app/alpha/ components/Navbar.tsx
git commit -m "feat: add Alpha public page with DexScreener live prices and filter bar"
```

---

## Chunk 5: Alpha Admin CRUD

### Task 7: Add admin sidebar nav item

**Files:**
- Modify: `app/admin/layout.tsx`

- [ ] **Step 1: Add Alpha to admin sidebar**

In `app/admin/layout.tsx`, add `TrendingUp` to the lucide import and add the nav item:

```ts
// Add to import:
import { LayoutDashboard, Wrench, PlayCircle, Youtube, Calendar, LogOut, TrendingUp } from 'lucide-react'

// Add to navItems array (after events):
{ href: '/admin/alpha', icon: TrendingUp, label: 'Alpha Picks' },
```

### Task 8: Create admin Alpha CRUD page

**Files:**
- Create: `app/admin/alpha/page.tsx`

- [ ] **Step 1: Create the admin alpha page**

Create `app/admin/alpha/page.tsx`. This follows the exact same pattern as `app/admin/tools/page.tsx`:

```tsx
'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, X as XIcon } from 'lucide-react'

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

  const openModal = (asset?: AlphaAsset) => {
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
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      ...form,
      industry: form.industry || null,
      category: form.category || null,
      website: form.website || null,
      x_url: form.x_url || null,
      contract_address: form.contract_address || null,
      chain_id: form.type === 'crypto' && form.contract_address ? form.chain_id : null,
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
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-cyber-green hover:bg-cyber-green/90 text-true-black font-chakra text-sm tracking-wide rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nuevo Activo
        </button>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setFilterType('all')}
          className={`px-4 py-2 rounded-lg font-chakra text-xs tracking-wide transition-colors flex-shrink-0 border ${
            filterType === 'all'
              ? 'bg-cyber-green/10 text-cyber-green border-cyber-green/30'
              : 'bg-panel/40 text-gray-400 border-border-dark hover:text-white'
          }`}
        >
          Todos ({assets.length})
        </button>
        {ASSET_TYPES.map((t) => (
          <button
            key={t.value}
            onClick={() => setFilterType(t.value)}
            className={`px-4 py-2 rounded-lg font-chakra text-xs tracking-wide transition-colors flex-shrink-0 border ${
              filterType === t.value ? 'border' : 'bg-panel/40 text-gray-400 border-border-dark hover:text-white'
            }`}
            style={filterType === t.value ? { backgroundColor: `${t.color}10`, color: t.color, borderColor: `${t.color}30` } : {}}
          >
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
          <button onClick={() => openModal()} className="text-cyber-green hover:underline text-sm">
            Agregar el primero
          </button>
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
                    <td className="py-3 px-4 font-outfit text-white">{asset.name}</td>
                    <td className="py-3 px-4 font-mono text-gray-400 text-xs">{asset.ticker}</td>
                    <td className="py-3 px-4">
                      <span
                        className="px-2 py-0.5 rounded-full text-[10px] font-chakra tracking-wide border"
                        style={{ backgroundColor: `${typeInfo?.color}10`, color: typeInfo?.color, borderColor: `${typeInfo?.color}30` }}
                      >
                        {asset.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-gray-500 text-xs">{asset.chain_id ?? '—'}</td>
                    <td className="py-3 px-4 font-mono text-gray-600 text-[10px] max-w-[120px] truncate">
                      {asset.contract_address ?? '—'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openModal(asset)}
                          className="p-1.5 rounded bg-panel/60 border border-border-dark hover:border-cyber-green/40 transition-colors text-gray-400 hover:text-cyber-green"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(asset.id)}
                          className="p-1.5 rounded bg-panel/60 border border-border-dark hover:border-red-500/40 transition-colors text-gray-400 hover:text-red-400"
                        >
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
              <h2 className="font-chakra text-xl font-bold text-white">
                {editing ? 'Editar Activo' : 'Nuevo Activo'}
              </h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-white transition-colors">
                <XIcon className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Name */}
              <div>
                <label className="block font-chakra text-xs text-gray-400 mb-2 tracking-wide">Nombre *</label>
                <input
                  type="text" required value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 bg-panel/40 border border-border-dark rounded-lg text-white font-outfit text-sm focus:outline-none focus:border-cyber-green/30"
                  placeholder="Bitcoin"
                />
              </div>

              {/* Ticker */}
              <div>
                <label className="block font-chakra text-xs text-gray-400 mb-2 tracking-wide">Ticker *</label>
                <input
                  type="text" required value={form.ticker}
                  onChange={(e) => setForm({ ...form, ticker: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 bg-panel/40 border border-border-dark rounded-lg text-white font-outfit text-sm focus:outline-none focus:border-cyber-green/30"
                  placeholder="BTC"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block font-chakra text-xs text-gray-400 mb-2 tracking-wide">Tipo *</label>
                <select
                  required value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full px-3 py-2 bg-panel/40 border border-border-dark rounded-lg text-white font-outfit text-sm focus:outline-none focus:border-cyber-green/30"
                >
                  {ASSET_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              {/* Industry (stocks only) */}
              {(form.type === 'stock' || form.type === 'etf') && (
                <div>
                  <label className="block font-chakra text-xs text-gray-400 mb-2 tracking-wide">Industria</label>
                  <input
                    type="text" value={form.industry}
                    onChange={(e) => setForm({ ...form, industry: e.target.value })}
                    className="w-full px-3 py-2 bg-panel/40 border border-border-dark rounded-lg text-white font-outfit text-sm focus:outline-none focus:border-cyber-green/30"
                    placeholder="Tecnología"
                  />
                </div>
              )}

              {/* Category (stocks only) */}
              {(form.type === 'stock' || form.type === 'etf') && (
                <div>
                  <label className="block font-chakra text-xs text-gray-400 mb-2 tracking-wide">Categoría</label>
                  <input
                    type="text" value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 bg-panel/40 border border-border-dark rounded-lg text-white font-outfit text-sm focus:outline-none focus:border-cyber-green/30"
                    placeholder="Large Cap"
                  />
                </div>
              )}

              {/* Contract + Chain (crypto only) */}
              {form.type === 'crypto' && (
                <>
                  <div>
                    <label className="block font-chakra text-xs text-gray-400 mb-2 tracking-wide">Contrato (opcional)</label>
                    <input
                      type="text" value={form.contract_address}
                      onChange={(e) => setForm({ ...form, contract_address: e.target.value })}
                      className="w-full px-3 py-2 bg-panel/40 border border-border-dark rounded-lg text-white font-outfit text-sm focus:outline-none focus:border-cyber-green/30"
                      placeholder="0x... o dirección de Solana"
                    />
                  </div>
                  <div>
                    <label className="block font-chakra text-xs text-gray-400 mb-2 tracking-wide">Chain</label>
                    <select
                      value={form.chain_id}
                      onChange={(e) => setForm({ ...form, chain_id: e.target.value })}
                      className="w-full px-3 py-2 bg-panel/40 border border-border-dark rounded-lg text-white font-outfit text-sm focus:outline-none focus:border-cyber-green/30"
                    >
                      {CHAIN_IDS.map((c) => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {/* Website */}
              <div>
                <label className="block font-chakra text-xs text-gray-400 mb-2 tracking-wide">Website</label>
                <input
                  type="url" value={form.website}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                  className="w-full px-3 py-2 bg-panel/40 border border-border-dark rounded-lg text-white font-outfit text-sm focus:outline-none focus:border-cyber-green/30"
                  placeholder="https://bitcoin.org"
                />
              </div>

              {/* X URL */}
              <div>
                <label className="block font-chakra text-xs text-gray-400 mb-2 tracking-wide">X / Twitter</label>
                <input
                  type="url" value={form.x_url}
                  onChange={(e) => setForm({ ...form, x_url: e.target.value })}
                  className="w-full px-3 py-2 bg-panel/40 border border-border-dark rounded-lg text-white font-outfit text-sm focus:outline-none focus:border-cyber-green/30"
                  placeholder="https://twitter.com/..."
                />
              </div>

              {/* Display Order */}
              <div>
                <label className="block font-chakra text-xs text-gray-400 mb-2 tracking-wide">Orden</label>
                <input
                  type="number" value={form.display_order}
                  onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-panel/40 border border-border-dark rounded-lg text-white font-outfit text-sm focus:outline-none focus:border-cyber-green/30"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button" onClick={closeModal}
                  className="flex-1 px-4 py-2 bg-panel/40 hover:bg-panel/60 border border-border-dark text-gray-400 hover:text-white font-chakra text-sm rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-cyber-green hover:bg-cyber-green/90 text-true-black font-chakra text-sm rounded-lg transition-colors"
                >
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
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add app/admin/alpha/ app/admin/layout.tsx
git commit -m "feat: add admin Alpha Picks CRUD page"
```

---

## Chunk 6: Build Health

### Task 9: Clean npm run build

**Files:** Any files with TypeScript/lint errors discovered during build.

- [ ] **Step 1: Run full build**

```bash
cd /Users/williammartinez/Documents/ekinoxis/apalancados
npm run build
```

- [ ] **Step 2: Fix any TypeScript errors**

For each error reported, open the file, read the error, fix it. Common patterns:
- `params` type in Next.js App Router pages must be `Promise<{...}>` — already handled in this plan
- Missing `'use client'` directive on components using hooks
- Unused imports

- [ ] **Step 3: Fix any ESLint errors**

Common ones: `@next/next/no-img-element` (use `<Image>` from next/image or add eslint-disable comment), missing `key` props.

- [ ] **Step 4: Confirm build succeeds**

```bash
npm run build
```

Expected: `✓ Compiled successfully` with no errors.

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "fix: resolve build errors, all pages compile successfully"
```
