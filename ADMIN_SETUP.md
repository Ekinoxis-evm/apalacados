# Admin Panel Setup Guide

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in with your Google account
2. Click "New Project"
3. Fill in:
   - **Name**: apalancados
   - **Database Password**: (generate a strong password)
   - **Region**: Choose closest to your users
4. Click "Create new project" and wait ~2 minutes

## 2. Set up Database

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the entire contents of `supabase/schema.sql` from this project
4. Paste it into the SQL editor and click "Run"
5. You should see "Success. No rows returned"

## 3. Enable Google OAuth

1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Find **Google** and toggle it ON
3. You'll need to create a Google OAuth app:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project or select existing
   - Go to **APIs & Services** → **Credentials**
   - Click **Create Credentials** → **OAuth 2.0 Client ID**
   - Configure consent screen if needed
   - Application type: **Web application**
   - Add authorized redirect URIs:
     ```
     https://[YOUR_PROJECT_REF].supabase.co/auth/v1/callback
     ```
   - Copy the **Client ID** and **Client Secret**
4. Back in Supabase, paste the Google Client ID and Client Secret
5. Click **Save**

## 4. Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your Supabase credentials:
   - Go to **Project Settings** → **API** in Supabase dashboard
   - Copy **Project URL** → paste as `NEXT_PUBLIC_SUPABASE_URL`
   - Copy **anon public** key → paste as `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Your `.env.local` should look like:
```
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmno.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
ADMIN_EMAILS=your-email@gmail.com,another-admin@gmail.com
```

**IMPORTANT - Email Whitelist:**
- Add your Google email to `ADMIN_EMAILS`
- You can add multiple emails separated by commas
- Only these emails will be able to access `/admin`
- Anyone else will see an "Access Denied" page

## 5. Configure Image Domain

Already done! The `next.config.js` has been updated to allow Twitter image URLs.

## 6. Start the Dev Server

```bash
npm run dev
```

## 7. Access Admin Panel

1. Go to `http://localhost:3000/login`
2. Click "Continuar con Google"
3. Sign in with your Google account
4. You'll be redirected to `/admin`

## Admin Features

### 🔧 Herramientas (Tools)
- Add/Edit/Delete apps and projects for each tema
- Fields: Name, Logo URL (from X), Website, X/Twitter link, Topic
- Logo URL tip: Right-click on project's X profile picture → Copy Image Address

### ▶️ X Spaces
- Upload recordings from X Spaces
- Fields: Title, Image, Space URL
- Image upload: Select PNG/JPG from your computer

### 📺 YouTube
- Add YouTube video recordings
- Fields: Video ID, Title
- Video ID: The part after `?v=` in YouTube URL

### 📅 Eventos
- Manage Luma events
- Fields: Event ID, Embed URL
- Event ID: The part after `/event/` in Luma URL

## Troubleshooting

### "Invalid src prop" error for images
- Make sure the image hostname is added to `next.config.js`
- For Twitter images: `pbs.twimg.com` (already added)

### Login not working
- Check that Google OAuth is properly configured in Supabase
- Verify redirect URI matches exactly
- Make sure you're using the correct `.env.local` variables

### Database errors
- Ensure the SQL schema was run successfully
- Check Row Level Security policies are enabled
- Verify your Supabase anon key is correct

## Production Deployment

When deploying to Vercel/Netlify:

1. Add environment variables in your hosting dashboard
2. Update Google OAuth redirect URIs to include production URL:
   ```
   https://your-domain.com/auth/callback
   ```
3. Enable the same redirect URI in Supabase → Authentication → URL Configuration

## Need Help?

Check Supabase docs: https://supabase.com/docs
