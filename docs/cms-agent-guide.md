# CMS Pattern — Agent Implementation Guide

A reusable guide for implementing a lightweight custom CMS on any website using Next.js + Supabase. Based on a proven implementation.

---

## Overview

This pattern gives you a **protected admin panel** embedded in a Next.js app where authorized users can manage content (create, edit, delete, reorder) that is then displayed on the public website — without writing code or using an external CMS platform.

**When to use this pattern:**
- Small-to-medium websites that need content flexibility
- Teams where non-developers need to update content
- Projects already using Supabase and Next.js (App Router)
- When a full CMS (Contentful, Sanity, etc.) is overkill

---

## Tech Stack Requirements

- **Next.js 14+** with App Router
- **Supabase** (database + auth + storage)
- **@supabase/ssr** package for SSR-safe auth
- **Tailwind CSS** (optional but recommended)

---

## Step 1 — Supabase Setup

### 1.1 Create your content tables

For each content type, create a table following this template:

```sql
CREATE TABLE your_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  -- add your custom fields here
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_your_content_updated_at
  BEFORE UPDATE ON your_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 1.2 Enable Row-Level Security

```sql
ALTER TABLE your_content ENABLE ROW LEVEL SECURITY;

-- Public can read
CREATE POLICY "Public read access" ON your_content
  FOR SELECT USING (true);

-- Only authenticated users can write
CREATE POLICY "Authenticated full access" ON your_content
  FOR ALL USING (auth.role() = 'authenticated');
```

### 1.3 Storage bucket (for image uploads)

In Supabase dashboard: Storage → New bucket → name it `images`, set to **public**.

Or via SQL:
```sql
INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true);

CREATE POLICY "Public read" ON storage.objects FOR SELECT USING (bucket_id = 'images');
CREATE POLICY "Auth upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');
CREATE POLICY "Auth delete" ON storage.objects FOR DELETE USING (bucket_id = 'images' AND auth.role() = 'authenticated');
```

---

## Step 2 — Supabase Client Setup

### `lib/supabase/client.ts` (browser client for admin)
```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

### `lib/supabase/server.ts` (server client for public pages)
```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options))
          } catch {}
        },
      },
    }
  )
}
```

### `lib/supabase/middleware.ts`
```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options))
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(e => e.trim()) || []
    if (!adminEmails.includes(user.email || '')) {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
  }

  return supabaseResponse
}
```

### `middleware.ts` (root)
```typescript
import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
```

---

## Step 3 — Authentication Pages

### `app/login/page.tsx`
```typescript
'use client'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const supabase = createClient()

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` }
    })
  }

  return (
    <div>
      <button onClick={handleLogin}>Sign in with Google</button>
    </div>
  )
}
```

### `app/auth/callback/route.ts`
```typescript
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) return NextResponse.redirect(`${origin}/admin`)
  }

  return NextResponse.redirect(`${origin}/login?error=auth`)
}
```

---

## Step 4 — Admin Layout

### `app/admin/layout.tsx`
```typescript
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

const navItems = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/content-type-1', label: 'Content Type 1' },
  // add more as needed
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div style={{ display: 'flex' }}>
      <aside>
        <nav>
          {navItems.map(item => (
            <Link key={item.href} href={item.href}>{item.label}</Link>
          ))}
        </nav>
        <form action="/auth/signout" method="post">
          <button type="submit">Logout</button>
        </form>
      </aside>
      <main>{children}</main>
    </div>
  )
}
```

---

## Step 5 — Admin CRUD Page (Template)

Each content type gets a page like this:

### `app/admin/your-content/page.tsx`
```typescript
'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

type Item = {
  id: string
  title: string
  // your fields
  display_order: number
}

export default function YourContentPage() {
  const supabase = createClient()
  const [items, setItems] = useState<Item[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Item | null>(null)
  const [form, setForm] = useState({ title: '' })

  useEffect(() => { fetchItems() }, [])

  async function fetchItems() {
    const { data } = await supabase
      .from('your_content')
      .select('*')
      .order('display_order', { ascending: true })
    if (data) setItems(data)
  }

  async function handleSave() {
    if (editingItem) {
      await supabase.from('your_content').update(form).eq('id', editingItem.id)
    } else {
      await supabase.from('your_content').insert({
        ...form,
        display_order: items.length
      })
    }
    setIsModalOpen(false)
    setEditingItem(null)
    setForm({ title: '' })
    fetchItems()
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this item?')) return
    await supabase.from('your_content').delete().eq('id', id)
    fetchItems()
  }

  function openEdit(item: Item) {
    setEditingItem(item)
    setForm({ title: item.title })
    setIsModalOpen(true)
  }

  return (
    <div>
      <button onClick={() => { setEditingItem(null); setForm({ title: '' }); setIsModalOpen(true) }}>
        + Add New
      </button>

      <ul>
        {items.map(item => (
          <li key={item.id}>
            {item.title}
            <button onClick={() => openEdit(item)}>Edit</button>
            <button onClick={() => handleDelete(item.id)}>Delete</button>
          </li>
        ))}
      </ul>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editingItem ? 'Edit' : 'Add'} Item</h2>
            <input
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="Title"
            />
            <button onClick={handleSave}>Save</button>
            <button onClick={() => setIsModalOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}
```

---

## Step 6 — Public Page (Server Component)

```typescript
// app/your-page/page.tsx
import { createClient } from '@/lib/supabase/server'

export default async function YourPage() {
  const supabase = createClient()
  const { data: items } = await supabase
    .from('your_content')
    .select('*')
    .order('display_order', { ascending: true })

  return (
    <div>
      {items?.map(item => (
        <div key={item.id}>{item.title}</div>
      ))}
    </div>
  )
}
```

---

## Step 7 — Image Upload Pattern

Use this in any admin page that needs file uploads to Supabase Storage:

```typescript
async function handleImageUpload(file: File, folder: string): Promise<string> {
  const ext = file.name.split('.').pop()
  const filename = `${Math.random()}.${ext}`
  const path = `${folder}/${filename}`

  const { error } = await supabase.storage.from('images').upload(path, file)
  if (error) throw error

  const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(path)
  return publicUrl
}
```

Then add the Supabase hostname to `next.config.js`:
```javascript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'YOUR_PROJECT_ID.supabase.co',
    },
  ],
}
```

---

## Step 8 — Environment Variables

```.env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
ADMIN_EMAILS=admin@example.com,other@example.com
```

---

## Checklist for a new content type

- [ ] Table created in Supabase with RLS policies
- [ ] `updated_at` trigger added
- [ ] Admin page created at `/app/admin/{type}/page.tsx`
- [ ] Link added to admin layout sidebar
- [ ] Public page fetches from Supabase using server client
- [ ] If images: storage bucket exists, hostname added to `next.config.js`

---

## Security checklist

- [ ] RLS enabled on all tables
- [ ] `ADMIN_EMAILS` env var set (never hardcode)
- [ ] Middleware protects all `/admin/*` routes
- [ ] Server components used for public pages (never expose write clients)
- [ ] Storage bucket policies restrict writes to authenticated users only
