# Design Spec: TradFi Topic + Alpha Page + Mobile Improvements
**Date:** 2026-03-10
**Status:** Approved

---

## 1. TradFi Topic

### What
Add a new `tradfi` topic to the existing topic system for Traditional Finance tools (CEX, brokers, stock platforms, etc.).

### Changes
- `components/Navbar.tsx` — add `{ name: 'TradFi', href: '/topics/tradfi', icon: Landmark, color: '#f59e0b' }` to `topics` array
- `app/topics/[slug]/page.tsx` — add `tradfi` entry to `topicMeta`:
  ```ts
  tradfi: {
    title: 'Traditional Finance',
    color: '#f59e0b',
    description: 'Exchanges centralizados, brokers y herramientas de finanzas tradicionales.',
    content: 'TradFi meets crypto...',
  }
  ```
- No DB migration needed — `tools` table already uses `topic` field. Admin can add TradFi tools immediately.

---

## 2. Mobile Responsive Improvements

### What
Audit and fix mobile layout across the app. No new features — purely visual/layout fixes.

### Scope
- **Navbar** (`components/Navbar.tsx`) — already modified; ensure mobile menu items are tappable, spaced, and readable
- **Topic pages** (`app/topics/[slug]/page.tsx`) — `grid-cols-2` on very small screens may be tight; review ToolCard sizing
- **Live Hub sub-pages** (`app/live-hub/kick/page.tsx`) — player + chat should stack cleanly on mobile
- **General** — verify `px-4` padding and text sizes are comfortable on 375px viewport

### Approach
Audit each page at 375px (iPhone SE) and 390px (iPhone 14). Fix padding, font sizes, grid columns, and overflow issues.

---

## 3. Alpha Page

### What
A new public page `/alpha` that displays a curated list of assets (crypto, stocks, ETFs, RWAs). Crypto assets with a contract address show live price data from DexScreener.

### DB Schema — `alpha_assets`

```sql
CREATE TABLE alpha_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  ticker TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('crypto', 'stock', 'etf', 'rwa')),
  industry TEXT,          -- for stocks
  category TEXT,          -- for stocks
  website TEXT,
  x_url TEXT,
  contract_address TEXT,  -- nullable, crypto only
  chain_id TEXT,          -- nullable: ethereum | base | solana | xrpl | bitcoin
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE alpha_assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON alpha_assets FOR SELECT USING (true);
CREATE POLICY "Auth write" ON alpha_assets FOR ALL USING (auth.role() = 'authenticated');
```

### DexScreener API Integration

**Endpoint:**
```
GET https://api.dexscreener.com/token-pairs/v1/{chainId}/{tokenAddress}
```

**Chain ID mapping (DexScreener values):**
| UI Label   | chain_id value |
|------------|----------------|
| Ethereum   | `ethereum`     |
| Base       | `base`         |
| Solana     | `solana`       |
| XRPL       | `xrpl`         |
| Bitcoin    | `bitcoin`      |

**Route Handler:** `app/api/dexscreener/[chainId]/[contract]/route.ts`
- Proxies DexScreener with `next: { revalidate: 60 }` (1-min cache)
- Returns: `{ priceUsd, priceChange24h, volume24h, liquidity, fdv, marketCap }`
- Returns null gracefully if token not found or API error

```ts
// Fetch pattern used in Route Handler
const response = await fetch(
  `https://api.dexscreener.com/token-pairs/v1/${chainId}/${contract}`,
  {
    headers: { Accept: '*/*' },
    next: { revalidate: 60 },
  }
)
```

### Public Page — `/alpha`

- Server component that fetches all `alpha_assets` from Supabase
- Renders a card grid; each card shows: name, ticker, type badge, website/X links
- For assets with `contract_address + chain_id`: client component fetches `/api/dexscreener/...` and displays live `priceUsd` + `priceChange24h` (green if positive, red if negative)
- Filter bar: All | Crypto | Stock | ETF | RWA
- No live price for stocks in v1 (static info only)

### Admin Page — `/admin/alpha`

Follows existing admin pattern (browser Supabase client, client component).

**Form fields:**
- Name (text, required)
- Ticker (text, required)
- Type (select: Crypto / Stock / ETF / RWA)
- Industry (text, shown when type = stock)
- Category (text, shown when type = stock)
- Website (url)
- X.com URL (url)
- Contract Address (text, shown when type = crypto)
- Chain ID (select: Ethereum / Base / Solana / XRPL / Bitcoin, shown when type = crypto)
- Display Order (number)

**List view:** table with name, ticker, type, chain, edit/delete actions.

---

## 4. Build Health

After all features are implemented, run `npm run build` and fix any TypeScript/lint errors before considering the work done.

---

## File Map

| File | Action |
|------|--------|
| `components/Navbar.tsx` | Add TradFi topic + mobile fixes |
| `app/topics/[slug]/page.tsx` | Add tradfi to topicMeta |
| `app/alpha/page.tsx` | New — public Alpha page |
| `app/alpha/AlphaCard.tsx` | New — card with DexScreener live data |
| `app/api/dexscreener/[chainId]/[contract]/route.ts` | New — proxy Route Handler |
| `app/admin/alpha/page.tsx` | New — admin CRUD for alpha_assets |
| `supabase/schema.sql` | Add alpha_assets table + RLS |
| Mobile pages | Fix responsive layout |
