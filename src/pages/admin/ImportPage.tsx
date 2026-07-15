import { useEffect, useState } from 'react'
import { Plus, Save, Image as ImageIcon } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import type { Category } from '../../types/database'

interface VariantRow {
  id: string
  description: string
  shelf_life: string
  content_per_carton: string
  length: string
  width: string
  height: string
  loading_20ft: string
  loading_40ft: string
  image_preview: string | null
}

function createRow(): VariantRow {
  return {
    id: crypto.randomUUID(),
    description: '',
    shelf_life: '',
    content_per_carton: '',
    length: '',
    width: '',
    height: '',
    loading_20ft: '',
    loading_40ft: '',
    image_preview: null,
  }
}

export default function ImportPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [categoryId, setCategoryId] = useState('')
  const [newCategoryName, setNewCategoryName] = useState('')
  const [showNewCategory, setShowNewCategory] = useState(false)
  const [brandName, setBrandName] = useState('')
  const [brandThumbnail, setBrandThumbnail] = useState<string | null>(null)
  const [rows, setRows] = useState<VariantRow[]>([createRow()])
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    supabase.from('categories').select('*').order('name').then(({ data }) => {
      if (data) setCategories(data)
    })
  }, [])

  function addRow() {
    setRows((prev) => [...prev, createRow()])
  }

  function updateRow(id: string, field: keyof VariantRow, value: any) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)))
  }

  function handleImage(id: string, file: File | null) {
    if (!file) {
      updateRow(id, 'image_preview', null)
      return
    }
    const reader = new FileReader()
    reader.onload = (e) => updateRow(id, 'image_preview', e.target?.result as string)
    reader.readAsDataURL(file)
  }

  function handleBrandThumbnail(file: File | null) {
    if (!file) { setBrandThumbnail(null); return }
    const reader = new FileReader()
    reader.onload = (e) => setBrandThumbnail(e.target?.result as string)
    reader.readAsDataURL(file)
  }

  function slugify(text: string): string {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }

  function handleReset() {
    setRows([createRow()])
    setBrandName('')
    setBrandThumbnail(null)
    setCategoryId('')
    setNewCategoryName('')
    setShowNewCategory(false)
    setMessage(null)
  }

  async function handleSave() {
    setMessage(null)

    if (!brandName.trim()) {
      setMessage({ type: 'error', text: 'Brand name is required.' })
      return
    }

    const skipped = rows.filter((r) => !r.description.trim()).length
    const validRows = rows.filter((r) => r.description.trim())
    if (validRows.length === 0) {
      setMessage({ type: 'error', text: 'At least one variant with a description is required.' })
      return
    }

    let catId = categoryId
    if (showNewCategory && newCategoryName.trim()) {
      const slug = slugify(newCategoryName)
      const { data: existing, error: catErr } = await supabase.from('categories').select('id').eq('slug', slug).maybeSingle()
      if (catErr) { setMessage({ type: 'error', text: `Category lookup failed: ${catErr.message}` }); return }
      if (existing) {
        catId = existing.id
      } else {
        const { data: newCat, error: newCatErr } = await supabase
          .from('categories')
          .insert({ name: newCategoryName.trim(), slug })
          .select('id')
          .single()
        if (newCatErr) { setMessage({ type: 'error', text: `Create category failed: ${newCatErr.message}` }); return }
        if (newCat) {
          catId = newCat.id
          setCategories((prev) => [...prev, { id: newCat.id, name: newCategoryName.trim(), slug }])
        }
      }
      setCategoryId(catId)
    }

    if (!catId) {
      setMessage({ type: 'error', text: 'Please select or create a category.' })
      return
    }

    setSaving(true)

    try {
      const brandSlug = slugify(brandName)
      let brandId: string
      const thumbnail = brandThumbnail || validRows.find((r) => r.image_preview)?.image_preview || null

      const { data: existingBrand, error: brandErr } = await supabase
        .from('brands')
        .select('id')
        .eq('slug', brandSlug)
        .eq('category_id', catId)
        .maybeSingle()
      if (brandErr) throw brandErr

      if (existingBrand) {
        brandId = existingBrand.id
        const { error: updErr } = await supabase.from('brands').update({ category_id: catId, name: brandName.trim(), thumbnail }).eq('id', brandId)
        if (updErr) throw updErr
      } else {
        const { data: newBrand, error: insErr } = await supabase
          .from('brands')
          .insert({ name: brandName.trim(), slug: brandSlug, category_id: catId, thumbnail })
          .select('id')
          .single()
        if (insErr) throw insErr
        brandId = newBrand!.id
      }

      let created = 0
      let updated = 0
      const errors: string[] = []

      for (const row of validRows) {
        const description = row.description.trim()
        const variantData = {
          brand_id: brandId,
          variant_name: description,
          description,
          shelf_life: row.shelf_life.trim() || null,
          content_per_carton: row.content_per_carton.trim() || null,
          carton_length: row.length.trim() || null,
          carton_width: row.width.trim() || null,
          carton_height: row.height.trim() || null,
          loading_capacity_20ft: row.loading_20ft.trim() || null,
          loading_capacity_40ft: row.loading_40ft.trim() || null,
          image: row.image_preview || null,
        }

        const { data: existingVariants, error: findErr } = await supabase
          .from('variants')
          .select('id, shelf_life, content_per_carton, carton_length, carton_width, carton_height, loading_capacity_20ft, loading_capacity_40ft')
          .eq('brand_id', brandId)
          .eq('variant_name', description)
        if (findErr) { errors.push(`${description}: lookup error — ${findErr.message}`); continue }

        const existing = existingVariants?.find((v: any) =>
          (v.shelf_life ?? null) === (row.shelf_life.trim() || null) &&
          (v.content_per_carton ?? null) === (row.content_per_carton.trim() || null) &&
          (v.carton_length ?? null) === (row.length.trim() || null) &&
          (v.carton_width ?? null) === (row.width.trim() || null) &&
          (v.carton_height ?? null) === (row.height.trim() || null) &&
          (v.loading_capacity_20ft ?? null) === (row.loading_20ft.trim() || null) &&
          (v.loading_capacity_40ft ?? null) === (row.loading_40ft.trim() || null)
        )

        if (existing) {
          const { error: updErr } = await supabase.from('variants').update(variantData).eq('id', existing.id)
          if (updErr) { errors.push(`${description}: update error — ${updErr.message}`); continue }
          updated++
        } else {
          const { error: insErr } = await supabase.from('variants').insert(variantData)
          if (insErr) { errors.push(`${description}: insert error — ${insErr.message}`); continue }
          created++
        }
      }

      const parts = [`Saved! ${created} created, ${updated} updated for "${brandName}".`]
      if (skipped) parts.push(`${skipped} row(s) skipped (no description).`)
      if (errors.length) parts.push(`Errors: ${errors.join('; ')}`)
      setMessage({ type: errors.length ? 'error' : 'success', text: parts.join(' ') })
      setRows([createRow()])
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to save.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Add Product</h1>

      {message && (
        <div className={`mb-6 px-4 py-3 rounded-lg text-sm font-medium ${
          message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* CATEGORY & BRAND */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
            {showNewCategory ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="New category name"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowNewCategory(false)}
                  className="text-sm text-gray-500 hover:text-gray-700 px-2"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowNewCategory(true)}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium whitespace-nowrap px-2"
                >
                  + New
                </button>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Brand Name</label>
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="e.g. Oreo"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Brand Logo</label>
            <label className="cursor-pointer flex items-center gap-3 px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors">
              {brandThumbnail ? (
                <img src={brandThumbnail} alt="" className="w-8 h-8 rounded object-cover" />
              ) : (
                <ImageIcon size={16} className="text-gray-400" />
              )}
              <span className="text-sm text-gray-600">{brandThumbnail ? 'Change' : 'Upload'}</span>
              <input type="file" accept="image/*" onChange={(e) => handleBrandThumbnail(e.target.files?.[0] || null)} className="hidden" />
            </label>
            {brandThumbnail && (
              <button type="button" onClick={() => setBrandThumbnail(null)} className="text-xs text-red-500 mt-1">Remove</button>
            )}
          </div>
        </div>
      </div>

      {/* VARIANTS TABLE */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">Variants</h2>
          <button
            type="button"
            onClick={addRow}
            className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            <Plus size={16} />
            Add Variant
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-3 py-1.5 text-center text-xs font-medium text-gray-500 w-8">&nbsp;</th>
                <th className="px-3 py-1.5 text-left text-xs font-medium text-gray-500" colSpan={2}>&nbsp;</th>
                <th className="px-3 py-1.5 text-center text-xs font-medium text-gray-500">&nbsp;</th>
                <th className="px-3 py-1.5 text-center text-xs font-medium text-blue-600 bg-blue-50/50 border-x border-blue-100" colSpan={3}>Carton Size</th>
                <th className="px-3 py-1.5 text-center text-xs font-medium text-green-600 bg-green-50/50 border-x border-green-100" colSpan={2}>Total Carton</th>
                <th className="px-3 py-1.5 text-left text-xs font-medium text-gray-500" colSpan={2}>&nbsp;</th>
              </tr>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 w-8">#</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 min-w-[180px]">Description</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 min-w-[100px]">Shelf Life</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 min-w-[120px]">Content / Carton</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 min-w-[80px]">Length (cm)</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 min-w-[80px]">Width (cm)</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 min-w-[80px]">Height (cm)</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 min-w-[60px]">20 FT</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 min-w-[60px]">40 FT</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 min-w-[100px]">Image</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((row, idx) => (
                <tr key={row.id} className="hover:bg-gray-50/50">
                  <td className="px-3 py-2 text-xs text-gray-400 font-mono align-top pt-3.5">{idx + 1}</td>
                  <td className="px-3 py-2" colSpan={3}>
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={row.description}
                        onChange={(e) => updateRow(row.id, 'description', e.target.value)}
                        placeholder="Description"
                        className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        value={row.shelf_life}
                        onChange={(e) => updateRow(row.id, 'shelf_life', e.target.value)}
                        placeholder="Shelf Life"
                        className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        value={row.content_per_carton}
                        onChange={(e) => updateRow(row.id, 'content_per_carton', e.target.value)}
                        placeholder="Content / Carton"
                        className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </td>
                  <td className="px-3 py-2" colSpan={3}>
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={row.length}
                        onChange={(e) => updateRow(row.id, 'length', e.target.value)}
                        placeholder="Length"
                        className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        value={row.width}
                        onChange={(e) => updateRow(row.id, 'width', e.target.value)}
                        placeholder="Width"
                        className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        value={row.height}
                        onChange={(e) => updateRow(row.id, 'height', e.target.value)}
                        placeholder="Height"
                        className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </td>
                  <td className="px-3 py-2" colSpan={2}>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={row.loading_20ft}
                        onChange={(e) => updateRow(row.id, 'loading_20ft', e.target.value)}
                        placeholder="20 FT"
                        className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        value={row.loading_40ft}
                        onChange={(e) => updateRow(row.id, 'loading_40ft', e.target.value)}
                        placeholder="40 FT"
                        className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer">
                        {row.image_preview ? (
                          <img src={row.image_preview} alt="" className="w-9 h-9 rounded object-cover border border-gray-200" />
                        ) : (
                          <div className="w-9 h-9 rounded border border-dashed border-gray-300 flex items-center justify-center hover:border-blue-400 transition-colors">
                            <ImageIcon size={14} className="text-gray-400" />
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImage(row.id, e.target.files?.[0] || null)}
                          className="hidden"
                        />
                      </label>
                      {row.image_preview && (
                        <button
                          type="button"
                          onClick={() => updateRow(row.id, 'image_preview', null)}
                          className="text-xs text-red-500 hover:text-red-700"
                        >
                          &times;
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SAVE */}
      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={handleReset}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          <Save size={16} />
          {saving ? 'Saving...' : 'Save All Variants'}
        </button>
      </div>
    </div>
  )
}
