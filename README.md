# APALANCADOS

Hub de Trading en Vivo, DeFi, Prediction Markets, IA y Cultura Web3.

## Stack

- **Next.js 15** (App Router) + TypeScript
- **Tailwind CSS** — tema oscuro customizado (`#050505` / `#00ff41` / `#bc13fe`)
- **Fuentes:** Chakra Petch · DM Mono · Outfit (Google Fonts)
- **Widgets:** CoinGecko · Kick · Luma · Twitter/X

## Correr en local

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Páginas

| Ruta | Contenido |
|---|---|
| `/` | Hero · Market Pulse (CoinGecko Heatmap) · Los 5 Pilares |
| `/live-hub` | Stream Kick + chat · Price banner · Grabaciones YouTube · Posts en X |
| `/events` | Cards de eventos con embeds de Luma |
| `/topics/[slug]` | Páginas por tema (Trading, DeFi, Prediction, Memes, IA) |

## Configuración rápida

**Kick** — el stream de `wmb81321` ya está configurado en `components/KickPlayer.tsx`.

**YouTube** — agrega tus video IDs en `app/live-hub/page.tsx`:
```ts
const youtubeVideos = [
  { id: 'yt-1', videoId: 'TU_VIDEO_ID', title: 'Título del video' },
]
```

**Posts en X** — copia el `<blockquote>` de un tweet (Tweet → `···` → Embed), agrégale `data-theme="dark"` y añádelo al array `xPosts` en `app/live-hub/page.tsx`.

**Eventos Luma** — agrega tus eventos en `app/events/page.tsx`:
```ts
const events = [
  { id: 'evt-XXXXXX', embedSrc: 'https://luma.com/embed/event/evt-XXXXXX/simple' },
]
```

**X handle** — reemplaza `REPLACE_TWITTER_HANDLE` en `components/Footer.tsx`.
