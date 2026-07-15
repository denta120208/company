-- Run this SQL in Supabase SQL Editor to create the database tables

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Brands
CREATE TABLE IF NOT EXISTS brands (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  thumbnail TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(category_id, slug)
);

-- Variants
CREATE TABLE IF NOT EXISTS variants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  variant_name TEXT NOT NULL,
  description TEXT,
  shelf_life TEXT,
  content_per_carton TEXT,
  carton_length TEXT,
  carton_width TEXT,
  carton_height TEXT,
  loading_capacity_20ft TEXT,
  loading_capacity_40ft TEXT,
  image TEXT,
  origin_country TEXT DEFAULT 'Indonesia',
  sku TEXT,
  gross_weight TEXT,
  net_weight TEXT,
  packing TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Brand Mappings
CREATE TABLE IF NOT EXISTS brand_mappings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  keyword TEXT NOT NULL,
  brand_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Import Logs
CREATE TABLE IF NOT EXISTS import_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  imported_rows INTEGER DEFAULT 0,
  updated_rows INTEGER DEFAULT 0,
  failed_rows INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Migration for existing DB: run these to fix constraints
-- ALTER TABLE brands DROP CONSTRAINT brands_slug_key;
-- ALTER TABLE brands ADD CONSTRAINT brands_category_slug_key UNIQUE(category_id, slug);
-- ALTER TABLE variants DROP CONSTRAINT variants_brand_id_variant_name_key;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_brands_category_id ON brands(category_id);
CREATE INDEX IF NOT EXISTS idx_brands_slug ON brands(slug);
CREATE INDEX IF NOT EXISTS idx_variants_brand_id ON variants(brand_id);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
