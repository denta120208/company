import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Package, Ruler, Ship, Clock, ShoppingCart, ChevronDown } from 'lucide-react'
import type { Brand, Variant } from '../../types/database'
import { supabase } from '../../lib/supabase'

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const [brand, setBrand] = useState<Brand | null>(null)
  const [variants, setVariants] = useState<Variant[]>([])
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadBrand() {
      if (!id) return
      setLoading(true)
      const { data: brandData } = await supabase.from('brands').select('*').eq('id', id).single()
      if (brandData) {
        setBrand(brandData)
        const { data: variantData } = await supabase.from('variants').select('*').eq('brand_id', brandData.id).order('variant_name')
        if (variantData) {
          setVariants(variantData)
          setSelectedVariant(variantData[0] || null)
        }
      }
      setLoading(false)
    }
    loadBrand()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen pt-20 lg:pt-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-12 animate-scale-in space-y-6">
          <div className="h-5 bg-gray-100 rounded w-24" />
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="aspect-[4/3] bg-gray-100 rounded-xl" />
            <div className="space-y-3">
              <div className="h-8 bg-gray-100 rounded w-2/3" />
              <div className="h-4 bg-gray-100 rounded w-full" />
              <div className="h-4 bg-gray-100 rounded w-3/4" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!brand) {
    return (
      <div className="min-h-screen pt-20 lg:pt-24 bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
            <Package size={32} className="text-gray-300" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Product not found</h2>
          <Link to="/products" className="text-blue-600 hover:underline text-sm">Back to Products</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white pt-20 lg:pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <Link to="/products" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 mb-6 transition-colors group">
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to Products
        </Link>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-10">
          {/* IMAGE */}
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-8 flex items-center justify-center aspect-[4/3] relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 opacity-50" />
            {selectedVariant?.image ? (
              <img src={selectedVariant.image} alt={selectedVariant.variant_name} className="w-full h-full object-contain relative z-10 group-hover:scale-105 transition-transform duration-500" />
            ) : brand.thumbnail ? (
              <img src={brand.thumbnail} alt={brand.name} className="w-full h-full object-contain relative z-10 group-hover:scale-105 transition-transform duration-500" />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-gray-200 flex items-center justify-center">
                <span className="text-3xl font-bold text-gray-400">{brand.name[0]}</span>
              </div>
            )}
          </div>

          {/* INFO */}
          <div className="animate-fade-in-right">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{brand.name}</h1>
            {brand.description && <p className="mt-3 text-gray-600 leading-relaxed">{brand.description}</p>}

            {variants.length > 0 && (
              <div className="mt-6">
                <h2 className="text-sm font-semibold text-gray-900 mb-3">Available Variants ({variants.length})</h2>
                <div className="flex flex-wrap gap-2">
                  {variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-4 py-2 rounded-lg text-sm border transition-all ${
                        selectedVariant?.id === v.id
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:shadow-sm'
                      }`}
                    >
                      {v.variant_name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/contact"
                className="btn-primary inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-blue-600/25"
              >
                <ShoppingCart size={16} />
                Request Quotation
              </Link>
              <Link
                to="/contact"
                className="btn-secondary inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>

        {/* SPECIFICATIONS */}
        {selectedVariant && (
          <div className="rounded-xl border border-gray-200 p-6 lg:p-8 animate-fade-in-up">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Specifications</h2>
              <span className="inline-flex items-center gap-1 text-sm text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full">
                <ChevronDown size={12} />
                {selectedVariant.variant_name}
              </span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
              <SpecItem icon={Package} label="Description" value={selectedVariant.description} />
              <SpecItem icon={Clock} label="Shelf Life" value={selectedVariant.shelf_life} />
              <SpecItem icon={Package} label="Content / Carton" value={selectedVariant.content_per_carton} />
              <SpecItem icon={Ruler} label="Length (cm)" value={selectedVariant.carton_length} />
              <SpecItem icon={Ruler} label="Width (cm)" value={selectedVariant.carton_width} />
              <SpecItem icon={Ruler} label="Height (cm)" value={selectedVariant.carton_height} />
              <SpecItem icon={Ship} label="20 FT" value={selectedVariant.loading_capacity_20ft} />
              <SpecItem icon={Ship} label="40 FT" value={selectedVariant.loading_capacity_40ft} />
            </div>
          </div>
        )}

        {/* VARIANTS LIST */}
        {variants.length > 1 && (
          <div className="mt-10 animate-fade-in-up">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">All Variants</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 stagger">
              {variants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariant(v)}
                  className={`text-left p-3 rounded-lg border transition-all ${
                    selectedVariant?.id === v.id
                      ? 'bg-blue-50 border-blue-200 shadow-sm'
                      : 'bg-white border-gray-200 hover:border-blue-200 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-all ${
                      selectedVariant?.id === v.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {v.variant_name[0]}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 text-sm">{v.variant_name}</div>
                      {v.sku && <div className="text-xs text-gray-400">SKU: {v.sku}</div>}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function SpecItem({ icon: Icon, label, value }: { icon: any; label: string; value: string | number | null }) {
  if (value === null || value === undefined || value === '') return null
  return (
    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center shrink-0 shadow-sm">
        <Icon size={16} className="text-blue-600" />
      </div>
      <div>
        <div className="text-xs text-gray-400 uppercase tracking-wider">{label}</div>
        <div className="text-sm font-medium text-gray-900 mt-0.5">{value}</div>
      </div>
    </div>
  )
}
