import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Package, Grid3X3, SlidersHorizontal } from 'lucide-react'
import type { Category, Brand } from '../../types/database'
import { supabase } from '../../lib/supabase'

export default function Products() {
  const [searchParams] = useSearchParams()
  const selectedCategory = searchParams.get('category')
  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      const { data: cats } = await supabase.from('categories').select('*').order('name')
      if (cats) setCategories(cats)

      let query = supabase.from('brands').select('*, category:categories(name, slug), variants:variants(count)')
      if (selectedCategory) {
        const { data: cat } = await supabase.from('categories').select('id').eq('slug', selectedCategory).single()
        if (cat) query = query.eq('category_id', cat.id)
      }
      const { data: brs } = await query.order('name')
      if (brs) setBrands(brs)
      setLoading(false)
    }
    loadData()
  }, [selectedCategory])

  return (
    <div className="min-h-screen bg-white pt-20 lg:pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* SIDEBAR */}
          <aside className="lg:w-56 shrink-0">
            <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-24">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                <SlidersHorizontal size={14} className="text-gray-400" />
                <h2 className="font-semibold text-gray-900 text-sm">Categories</h2>
              </div>
              <div className="space-y-1">
                <Link
                  to="/products"
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                    !selectedCategory ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <Grid3X3 size={14} />
                  All Products
                </Link>
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/products?category=${cat.slug}`}
                    className={`block px-3 py-2 rounded-lg text-sm transition-all ${
                      selectedCategory === cat.slug ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          </aside>

          {/* MAIN */}
          <div className="flex-1">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Products</h1>
              <p className="text-sm text-gray-500 mt-1">{brands.length} brand(s)</p>
            </div>

            {loading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="rounded-xl border border-gray-200 overflow-hidden animate-scale-in">
                    <div className="aspect-[4/3] bg-gray-100" />
                    <div className="p-4 space-y-2">
                      <div className="h-4 bg-gray-100 rounded w-2/3" />
                      <div className="h-3 bg-gray-100 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : brands.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <Package size={32} className="text-gray-300" />
                </div>
                <p className="text-gray-500 font-medium">No products found</p>
                <p className="text-sm text-gray-400 mt-1">Import products via admin panel to get started.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger">
                {brands.map((brand) => (
                  <Link
                    key={brand.id}
                    to={`/products/${brand.slug}`}
                    className="group rounded-xl border border-gray-200 overflow-hidden card-hover bg-white"
                  >
                    <div className="aspect-[4/3] bg-gray-50 flex items-center justify-center p-6 relative">
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      {brand.thumbnail ? (
                        <img src={brand.thumbnail} alt={brand.name} className="w-full h-full object-contain relative z-10 group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-16 h-16 rounded-2xl bg-gray-200 flex items-center justify-center">
                          <span className="text-2xl font-bold text-gray-400">{brand.name[0]}</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{brand.name}</h3>
                      <p className="text-sm text-gray-400 mt-1">
                        {brand.category?.name && <>{brand.category.name} · </>}
                        {brand.variants?.[0]?.count || 0} variant(s)
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
