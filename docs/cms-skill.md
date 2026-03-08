# CMS Skill — Apalancados

## What this project's CMS does

This project uses Supabase as a headless backend with a custom admin UI built inside the Next.js app at `/admin`. It allows non-technical users to manage website content (tools, X Spaces, YouTube videos, Luma events) without touching code.

## Architecture

```
Public pages (server components) → Supabase DB (read-only, RLS)
Admin pages (client components)  → Supabase DB (read/write, authenticated)
Auth → Google OAuth + email whitelist (ADMIN_EMAILS env var)
Storage → Supabase Storage bucket "images"
```

## Content types and their tables

| Content Type  | Table            | Key fields                                      |
|--------------|------------------|-------------------------------------------------|
| Tools/Apps   | `tools`          | name, logo (URL), website, x_url, topic, display_order |
| X Spaces     | `x_spaces`       | title, image_url (Supabase Storage), space_url, display_order |
| YouTube      | `youtube_videos` | video_id, title, display_order                  |
| Luma Events  | `luma_events`    | event_id, embed_src, display_order              |

All tables have: `id` (UUID), `created_at`, `updated_at`, RLS enabled.

## How to add a new content type

1. **Schema** — add table to `/supabase/schema.sql` following the same pattern (UUID pk, display_order, RLS policies for anon read + authenticated write)
2. **Admin page** — create `/app/admin/{type}/page.tsx` as a client component with:
   - State for list, modal open/close, form fields
   - CRUD functions using `createBrowserClient`
   - Modal form for create/edit
   - Confirmation before delete
3. **Admin nav** — add link in `/app/admin/layout.tsx` sidebar
4. **Public page** — fetch with server client in a server component:
   ```typescript
   const supabase = createClient()
   const { data } = await supabase.from('your_table').select('*').order('display_order')
   ```
5. **next.config.js** — if using images from a new hostname, add it to `remotePatterns`

## Image uploads (Supabase Storage)

```typescript
const filename = `${Math.random()}.${ext}`
const { data } = await supabase.storage
  .from('images')
  .upload(`xspaces/${filename}`, file)

const { data: { publicUrl } } = supabase.storage
  .from('images')
  .getPublicUrl(`xspaces/${filename}`)
```

Then store `publicUrl` in the DB column.

## Auth / Route protection

- Middleware (`middleware.ts`) checks session on every request
- Admin routes redirect to `/login` if not authenticated
- Checks email against `ADMIN_EMAILS` env var (comma-separated), redirects to `/unauthorized` if not whitelisted
- Google OAuth callback handled at `/auth/callback/route.ts`

## Supabase clients

- **Client components (admin):** `createBrowserClient` from `lib/supabase/client.ts`
- **Server components (public):** `createServerClient` from `lib/supabase/server.ts`
- Never use the browser client in server components

## Common patterns

- `display_order` field on all tables — always order by this ascending
- Modal overlay for forms (not separate pages)
- Optimistic UI: update local state after successful DB operation
- RLS: anon role has SELECT only; authenticated role has full CRUD
