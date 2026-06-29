import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { Category } from '../../types/database'
import { Plus, Pencil, Trash2, Image as ImageIcon } from 'lucide-react'

export default function ManageCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [name, setName] = useState('')
  const [image, setImage] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => { load() }, [])
  async function load() {
    const { data } = await supabase.from('categories').select('*').order('name')
    if (data) setCategories(data)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    const payload = { name: name.trim(), slug, image: image || null }
    if (editingId) await supabase.from('categories').update(payload).eq('id', editingId)
    else await supabase.from('categories').insert(payload)
    setName(''); setImage(null); setEditingId(null); setLoading(false); load()
  }

  function startEdit(cat: Category) {
    setName(cat.name)
    setImage(cat.image)
    setEditingId(cat.id)
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this category?')) return
    await supabase.from('categories').delete().eq('id', id); load()
  }

  function handleImage(file: File | null) {
    if (!file) { setImage(null); return }
    const reader = new FileReader()
    reader.onload = (e) => setImage(e.target?.result as string)
    reader.readAsDataURL(file)
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-5">Categories</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-4 mb-5 flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Category name" required />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Image</label>
          <label className="cursor-pointer flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:border-blue-400 transition-colors">
            {image ? (
              <img src={image} alt="" className="w-6 h-6 rounded object-cover" />
            ) : (
              <ImageIcon size={16} className="text-gray-400" />
            )}
            {image ? 'Change' : 'Upload'}
            <input type="file" accept="image/*" onChange={(e) => handleImage(e.target.files?.[0] || null)} className="hidden" />
          </label>
          {image && <button type="button" onClick={() => setImage(null)} className="text-xs text-red-500 ml-2">Remove</button>}
        </div>
        <button type="submit" disabled={loading}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Plus size={16} />{editingId ? 'Update' : 'Add'}
        </button>
        {editingId && (
          <button type="button" onClick={() => { setName(''); setImage(null); setEditingId(null) }}
            className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
        )}
      </form>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600 w-10">&nbsp;</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Name</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Slug</th>
              <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  {cat.image ? (
                    <img src={cat.image} alt="" className="w-7 h-7 rounded object-cover" />
                  ) : (
                    <div className="w-7 h-7 rounded bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">{cat.name[0]}</div>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">{cat.name}</td>
                <td className="px-4 py-3 text-sm text-gray-400">{cat.slug}</td>
                <td className="px-4 py-3 text-sm text-right">
                  <button onClick={() => startEdit(cat)}
                    className="text-blue-600 hover:text-blue-800 p-1.5 hover:bg-blue-50 rounded transition-colors mr-1">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => handleDelete(cat.id)}
                    className="text-red-600 hover:text-red-800 p-1.5 hover:bg-red-50 rounded transition-colors">
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-12 text-center text-sm text-gray-400">No categories yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
