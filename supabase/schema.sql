-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tools table (for apps/projects in temas)
CREATE TABLE IF NOT EXISTS tools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  logo TEXT NOT NULL,
  website TEXT NOT NULL,
  x_url TEXT,
  topic TEXT NOT NULL, -- 'trading', 'prediction', 'defi', 'memes', 'ai'
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS x_spaces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  space_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create youtube_videos table
CREATE TABLE IF NOT EXISTS youtube_videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  video_id TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
-- Table: digital_asset_categories
CREATE TABLE IF NOT EXISTS digital_asset_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE
);

-- Join Table: asset_category_links
CREATE TABLE IF NOT EXISTS asset_category_links (
  asset_id UUID REFERENCES alpha_assets(id) ON DELETE CASCADE,
  category_id UUID REFERENCES digital_asset_categories(id) ON DELETE CASCADE,
  PRIMARY KEY (asset_id, category_id)
);
  created_at TIMESTAMPTZ DEFAULT NOW(),
);

-- Create luma_events table
CREATE TABLE IF NOT EXISTS luma_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id TEXT NOT NULL UNIQUE,
  embed_src TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE x_spaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE youtube_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE luma_events ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users (admin access)
CREATE POLICY "Enable all for authenticated users" ON tools
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all for authenticated users" ON x_spaces
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all for authenticated users" ON youtube_videos
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all for authenticated users" ON luma_events
  FOR ALL USING (auth.role() = 'authenticated');

-- Create policies for public read access
CREATE POLICY "Enable read for all users" ON tools
  FOR SELECT USING (true);

CREATE POLICY "Enable read for all users" ON x_spaces
  FOR SELECT USING (true);

CREATE POLICY "Enable read for all users" ON youtube_videos
  FOR SELECT USING (true);

CREATE POLICY "Enable read for all users" ON luma_events
  FOR SELECT USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_tools_updated_at BEFORE UPDATE ON tools
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_x_spaces_updated_at BEFORE UPDATE ON x_spaces
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_youtube_videos_updated_at BEFORE UPDATE ON youtube_videos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_luma_events_updated_at BEFORE UPDATE ON luma_events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

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
