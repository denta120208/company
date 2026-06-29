import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { BrandMapping } from '../../types/database'
import { Plus, Pencil, Trash2 } from 'lucide-react'

export default function ManageBrandMappings() {
  const [mappings, setMappings] = useState<BrandMapping[]>([])
  const [keyword, setKeyword] = useState('')
  const [brandName, setBrandName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => { load() }, [])
  async function load() {
    const { data } = await supabase.from('brand_mappings').select('*').order('keyword')
    if (data) setMappings(data)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!keyword.trim() || !brandName.trim()) return
    setLoading(true)
    if (editingId) await supabase.from('brand_mappings').update({ keyword, brand_name: brandName }).eq('id', editingId)
    else await supabase.from('brand_mappings').insert({ keyword, brand_name: brandName })
    setKeyword(''); setBrandName(''); setEditingId(null); setLoading(false); load()
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this mapping?')) return
    await supabase.from('brand_mappings').delete().eq('id', id); load()
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-5">Brand Mappings</h1>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-5 text-sm text-blue-800">
        Brand Mappings help the Excel importer automatically detect brand names from product descriptions.
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-4 mb-5 flex flex-wrap gap-3">
        <input type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)}
          className="flex-1 min-w-[150px] px-4 py-2 border border-gray-200 rounded-lg input-focus" placeholder="Keyword (e.g. Oreo)" required />
        <input type="text" value={brandName} onChange={(e) => setBrandName(e.target.value)}
          className="flex-1 min-w-[150px] px-4 py-2 border border-gray-200 rounded-lg input-focus" placeholder="Brand Name" required />
        <button type="submit" disabled={loading}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Plus size={16} />{editingId ? 'Update' : 'Add'}
        </button>
        {editingId && (
          <button type="button" onClick={() => { setKeyword(''); setBrandName(''); setEditingId(null) }}
            className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
        )}
      </form>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Keyword</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Brand Name</th>
              <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {mappings.map((m) => (
              <tr key={m.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{m.keyword}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{m.brand_name}</td>
                <td className="px-4 py-3 text-sm text-right">
                  <button onClick={() => { setKeyword(m.keyword); setBrandName(m.brand_name); setEditingId(m.id) }}
                    className="text-blue-600 hover:text-blue-800 p-1.5 hover:bg-blue-50 rounded transition-colors mr-1">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => handleDelete(m.id)}
                    className="text-red-600 hover:text-red-800 p-1.5 hover:bg-red-50 rounded transition-colors">
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
            {mappings.length === 0 && (
              <tr><td colSpan={3} className="px-4 py-12 text-center text-sm text-gray-400">No mappings yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
