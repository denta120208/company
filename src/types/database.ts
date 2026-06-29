export interface Category {
  id: string
  name: string
  slug: string
  image: string | null
  created_at?: string
}

export interface Brand {
  id: string
  category_id: string
  name: string
  slug: string
  thumbnail: string | null
  description: string | null
  created_at?: string
  category?: Category
  variants?: Variant[]
  variant_count?: number
}

export interface Variant {
  id: string
  brand_id: string
  variant_name: string
  description: string | null
  shelf_life: string | null
  content_per_carton: string | null
  carton_length: string | null
  carton_width: string | null
  carton_height: string | null
  loading_capacity_20ft: string | null
  loading_capacity_40ft: string | null
  image: string | null
  origin_country: string | null
  sku: string | null
  gross_weight: string | null
  net_weight: string | null
  packing: string | null
  created_at?: string
}

export interface BrandMapping {
  id: string
  keyword: string
  brand_name: string
  created_at?: string
}

export interface ImportLog {
  id: string
  filename: string
  imported_rows: number
  updated_rows: number
  failed_rows: number
  created_at?: string
}

export interface ImportResult {
  categories_created: number
  brands_created: number
  brands_updated: number
  variants_created: number
  variants_updated: number
  images_imported: number
  rows_skipped: number
  rows_failed: number
  missing_images: string[]
  processing_time: number
}

export interface ParsedVariant {
  description: string
  shelf_life: string
  content_per_carton: string
  length: string
  width: string
  height: string
  loading_20ft: string
  loading_40ft: string
  picture?: string | null
  image_data?: string | null
  gross_weight?: string
  net_weight?: string
  packing?: string
  origin_country?: string
  sku?: string
}
