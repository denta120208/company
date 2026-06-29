import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Package, Layers, Tags, FileSpreadsheet } from 'lucide-react'

export default function Dashboard() {
  const [stats, setStats] = useState({ categories: 0, brands: 0, variants: 0, imports: 0 })

  useEffect(() => {
    async function load() {
      const { count: cat } = await supabase.from('categories').select('*', { count: 'exact', head: true })
      const { count: brand } = await supabase.from('brands').select('*', { count: 'exact', head: true })
      const { count: v } = await supabase.from('variants').select('*', { count: 'exact', head: true })
      const { count: imp } = await supabase.from('import_logs').select('*', { count: 'exact', head: true })
      setStats({ categories: cat || 0, brands: brand || 0, variants: v || 0, imports: imp || 0 })
    }
    load()
  }, [])

  const cards = [
    { label: 'Categories', value: stats.categories, icon: Layers, color: 'text-blue-600 bg-blue-100' },
    { label: 'Brands', value: stats.brands, icon: Tags, color: 'text-emerald-600 bg-emerald-100' },
    { label: 'Variants', value: stats.variants, icon: Package, color: 'text-purple-600 bg-purple-100' },
    { label: 'Imports', value: stats.imports, icon: FileSpreadsheet, color: 'text-amber-600 bg-amber-100' },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Overview of your product catalog</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <div key={card.label} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className={`w-10 h-10 rounded-lg ${card.color} flex items-center justify-center mb-3`}>
                <Icon size={20} />
              </div>
              <div className="text-2xl font-bold text-gray-900">{card.value}</div>
              <div className="text-sm text-gray-500 mt-0.5">{card.label}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
