import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { Brand, Variant, Category } from '../../types/database'
import { Package, Pencil, Trash2, Plus, Save, X, Image as ImageIcon, Search } from 'lucide-react'

interface BrandWithInfo extends Brand {
  category?: { name: string } | null
  variant_count?: number
}

interface EditableVariant {
  temp_id: string
  db_id?: string
  variant_name: string
  description: string
  shelf_life: string
  content_per_carton: string
  carton_length: string
  carton_width: string
  carton_height: string
  loading_capacity_20ft: string
  loading_capacity_40ft: string
  image: string | null
}

function emptyVariant(): EditableVariant {
  return {
    temp_id: crypto.randomUUID(),
    variant_name: '',
    description: '',
    shelf_life: '',
    content_per_carton: '',
    carton_length: '',
    carton_width: '',
    carton_height: '',
    loading_capacity_20ft: '',
    loading_capacity_40ft: '',
    image: null,
  }
}

function variantToEditable(v: Variant): EditableVariant {
  return {
    temp_id: crypto.randomUUID(),
    db_id: v.id,
    variant_name: v.variant_name || '',
    description: v.description || '',
    shelf_life: v.shelf_life || '',
    content_per_carton: v.content_per_carton || '',
    carton_length: v.carton_length || '',
    carton_width: v.carton_width || '',
    carton_height: v.carton_height || '',
    loading_capacity_20ft: v.loading_capacity_20ft || '',
    loading_capacity_40ft: v.loading_capacity_40ft || '',
    image: v.image || null,
  }
}

export default function ManageProducts() {
  const [brands, setBrands] = useState<BrandWithInfo[]>([])
  const [search, setSearch] = useState('')
  const [editingBrand, setEditingBrand] = useState<BrandWithInfo | null>(null)
  const [editBrandName, setEditBrandName] = useState('')
  const [editCategoryId, setEditCategoryId] = useState('')
  const [editBrandThumbnail, setEditBrandThumbnail] = useState<string | null>(null)
  const [variants, setVariants] = useState<EditableVariant[]>([])
  const [deletedVariantIds, setDeletedVariantIds] = useState<string[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  async function loadBrands() {
    const { data } = await supabase
      .from('brands')
      .select('*, category:categories(name)')
      .order('name')
    if (data) {
      const { data: counts } = await supabase
        .from('variants')
        .select('brand_id')
      const variantCounts: Record<string, number> = {}
      if (counts) {
        for (const v of counts) {
          variantCounts[v.brand_id] = (variantCounts[v.brand_id] || 0) + 1
        }
      }
      setBrands(data.map((b) => ({ ...b, variant_count: variantCounts[b.id] || 0 })))
    }
  }

  useEffect(() => {
    loadBrands()
    supabase.from('categories').select('*').order('name').then(({ data }) => {
      if (data) setCategories(data)
    })
  }, [])

  async function openEdit(brand: BrandWithInfo) {
    setEditingBrand(brand)
    setEditBrandName(brand.name)
    setEditCategoryId(brand.category_id)
    setEditBrandThumbnail(brand.thumbnail)
    setDeletedVariantIds([])

    const { data: variantData } = await supabase
      .from('variants')
      .select('*')
      .eq('brand_id', brand.id)
      .order('variant_name')
    setVariants((variantData || []).map(variantToEditable))
  }

  function closeEdit() {
    setEditingBrand(null)
    setVariants([])
    setDeletedVariantIds([])
    setEditBrandThumbnail(null)
    setConfirmDelete(null)
  }

  function addVariant() {
    setVariants((prev) => [...prev, emptyVariant()])
  }

  function removeVariant(tempId: string) {
    const v = variants.find((v) => v.temp_id === tempId)
    if (v?.db_id) setDeletedVariantIds((prev) => [...prev, v.db_id!])
    setVariants((prev) => prev.filter((v) => v.temp_id !== tempId))
  }

  function updateVariant(tempId: string, field: keyof EditableVariant, value: string) {
    setVariants((prev) => prev.map((v) => {
      if (v.temp_id !== tempId) return v
      const updated = { ...v, [field]: value }
      if (field === 'variant_name') updated.description = value
      return updated
    }))
  }

  function handleVariantImage(tempId: string, file: File | null) {
    if (!file) {
      updateVariant(tempId, 'image', '')
      return
    }
    const reader = new FileReader()
    reader.onload = (e) => updateVariant(tempId, 'image', e.target?.result as string)
    reader.readAsDataURL(file)
  }

  async function deleteBrand(brandId: string) {
    await supabase.from('brands').delete().eq('id', brandId)
    closeEdit()
    loadBrands()
  }

  async function saveBrand() {
    if (!editingBrand) return
    setSaving(true)

    try {
      const thumbnail = editBrandThumbnail || variants.find((v) => v.image)?.image || null
      await supabase
        .from('brands')
        .update({ name: editBrandName.trim(), category_id: editCategoryId, thumbnail })
        .eq('id', editingBrand.id)

      for (const vid of deletedVariantIds) {
        await supabase.from('variants').delete().eq('id', vid)
      }

      for (const v of variants) {
        const data = {
          brand_id: editingBrand.id,
          variant_name: v.variant_name.trim() || v.description.trim(),
          description: v.description.trim() || null,
          shelf_life: v.shelf_life.trim() || null,
          content_per_carton: v.content_per_carton.trim() || null,
          carton_length: v.carton_length.trim() || null,
          carton_width: v.carton_width.trim() || null,
          carton_height: v.carton_height.trim() || null,
          loading_capacity_20ft: v.loading_capacity_20ft.trim() || null,
          loading_capacity_40ft: v.loading_capacity_40ft.trim() || null,
          image: v.image || null,
        }
        if (v.db_id) {
          await supabase.from('variants').update(data).eq('id', v.db_id)
        } else if (data.variant_name) {
          await supabase.from('variants').insert(data)
        }
      }

      closeEdit()
      loadBrands()
    } catch (err: any) {
      alert(err.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  function inClass(value?: string) {
    return `w-full px-2 py-1.5 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${value ? 'border-blue-200 bg-blue-50/30' : ''}`
  }

  const filtered = brands.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-5">Products</h1>

      {/* Search */}
      <div className="relative mb-4 max-w-xs">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search brands..."
          className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Brand List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Brand</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Category</th>
              <th className="text-center px-4 py-3 text-sm font-medium text-gray-600 w-20">Variants</th>
              <th className="text-right px-4 py-3 text-sm font-medium text-gray-600 w-28">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((brand) => (
              <tr key={brand.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {brand.thumbnail ? (
                      <img src={brand.thumbnail} alt="" className="w-7 h-7 rounded object-cover" />
                    ) : (
                      <div className="w-7 h-7 rounded bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">{brand.name[0]}</div>
                    )}
                    <span className="text-sm font-medium text-gray-900">{brand.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">{brand.category?.name || '-'}</td>
                <td className="px-4 py-3 text-center text-sm text-gray-600">{brand.variant_count}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => openEdit(brand)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={async () => {
                        if (confirm('Delete this brand and all its variants?')) {
                          await supabase.from('brands').delete().eq('id', brand.id)
                          loadBrands()
                        }
                      }}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-16 text-center">
                  <Package size={40} className="mx-auto text-gray-300 mb-2" />
                  <p className="text-sm text-gray-500">No products yet.</p>
                  <p className="text-xs text-gray-400 mt-1">Use the Add Product page to add products.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* EDIT MODAL */}
      {editingBrand && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-start justify-center pt-10 pb-10 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-5xl mx-4">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Edit Product</h2>
              <button onClick={closeEdit} className="p-1 text-gray-400 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>

            {/* Brand info */}
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Brand Name</label>
                  <input
                    type="text"
                    value={editBrandName}
                    onChange={(e) => setEditBrandName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Category</label>
                  <select
                    value={editCategoryId}
                    onChange={(e) => setEditCategoryId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Brand Logo</label>
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer flex items-center gap-2 px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors">
                      {editBrandThumbnail ? (
                        <img src={editBrandThumbnail} alt="" className="w-7 h-7 rounded object-cover" />
                      ) : (
                        <ImageIcon size={16} className="text-gray-400" />
                      )}
                      <span className="text-sm text-gray-600">{editBrandThumbnail ? 'Change' : 'Upload'}</span>
                      <input
                        type="file" accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (!file) return
                          const reader = new FileReader()
                          reader.onload = (ev) => setEditBrandThumbnail(ev.target?.result as string)
                          reader.readAsDataURL(file)
                        }}
                        className="hidden"
                      />
                    </label>
                    {editBrandThumbnail && (
                      <button onClick={() => setEditBrandThumbnail(null)} className="text-xs text-red-500 hover:text-red-700">Remove</button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Variants header */}
            <div className="px-6 py-3 border-b border-gray-100 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-900">Variants ({variants.length})</span>
              <button
                onClick={addVariant}
                className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                <Plus size={16} />
                Add Variant
              </button>
            </div>

            {/* Variants table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-xs font-medium text-gray-500">
                    <th className="px-3 py-2 text-left w-8">#</th>
                    <th className="px-3 py-2 text-left min-w-[160px]">Description</th>
                    <th className="px-3 py-2 text-left min-w-[90px]">Shelf Life</th>
                    <th className="px-3 py-2 text-left min-w-[110px]">Content / Carton</th>
                    <th className="px-3 py-2 text-center text-blue-600 bg-blue-50/50 border-x border-blue-100" colSpan={3}>Carton Size</th>
                    <th className="px-3 py-2 text-center text-green-600 bg-green-50/50 border-x border-green-100" colSpan={2}>Total Carton</th>
                    <th className="px-3 py-2 text-left min-w-[70px]">Image</th>
                    <th className="px-3 py-2 w-10" />
                  </tr>
                  <tr className="bg-gray-50 border-b border-gray-100 text-xs font-medium text-gray-500">
                    <th className="px-3 py-1.5" />
                    <th className="px-3 py-1.5" />
                    <th className="px-3 py-1.5" />
                    <th className="px-3 py-1.5" />
                    <th className="px-3 py-1.5 text-left">Length</th>
                    <th className="px-3 py-1.5 text-left">Width</th>
                    <th className="px-3 py-1.5 text-left">Height</th>
                    <th className="px-3 py-1.5 text-left">20 FT</th>
                    <th className="px-3 py-1.5 text-left">40 FT</th>
                    <th className="px-3 py-1.5" />
                    <th className="px-3 py-1.5" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {variants.map((v, idx) => (
                    <tr key={v.temp_id} className="hover:bg-gray-50/50">
                      <td className="px-3 py-2 text-xs text-gray-400 font-mono align-top pt-3">{idx + 1}</td>
                      <td className="px-3 py-2" colSpan={3}>
                        <div className="grid grid-cols-3 gap-2">
                          <input
                            type="text"
                            value={v.variant_name}
                            onChange={(e) => updateVariant(v.temp_id, 'variant_name', e.target.value)}
                            placeholder="Name"
                            className={inClass(v.variant_name)}
                          />
                          <input
                            type="text"
                            value={v.shelf_life}
                            onChange={(e) => updateVariant(v.temp_id, 'shelf_life', e.target.value)}
                            placeholder="Shelf Life"
                            className={inClass(v.shelf_life)}
                          />
                          <input
                            type="text"
                            value={v.content_per_carton}
                            onChange={(e) => updateVariant(v.temp_id, 'content_per_carton', e.target.value)}
                            placeholder="Content / Carton"
                            className={inClass(v.content_per_carton)}
                          />
                        </div>
                      </td>
                      <td className="px-3 py-2" colSpan={3}>
                        <div className="grid grid-cols-3 gap-2">
                          <input
                            type="text"
                            value={v.carton_length}
                            onChange={(e) => updateVariant(v.temp_id, 'carton_length', e.target.value)}
                            placeholder="Length"
                            className={inClass(v.carton_length)}
                          />
                          <input
                            type="text"
                            value={v.carton_width}
                            onChange={(e) => updateVariant(v.temp_id, 'carton_width', e.target.value)}
                            placeholder="Width"
                            className={inClass(v.carton_width)}
                          />
                          <input
                            type="text"
                            value={v.carton_height}
                            onChange={(e) => updateVariant(v.temp_id, 'carton_height', e.target.value)}
                            placeholder="Height"
                            className={inClass(v.carton_height)}
                          />
                        </div>
                      </td>
                      <td className="px-3 py-2" colSpan={2}>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={v.loading_capacity_20ft}
                            onChange={(e) => updateVariant(v.temp_id, 'loading_capacity_20ft', e.target.value)}
                            placeholder="20 FT"
                            className={inClass(v.loading_capacity_20ft)}
                          />
                          <input
                            type="text"
                            value={v.loading_capacity_40ft}
                            onChange={(e) => updateVariant(v.temp_id, 'loading_capacity_40ft', e.target.value)}
                            placeholder="40 FT"
                            className={inClass(v.loading_capacity_40ft)}
                          />
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-1.5">
                          <label className="cursor-pointer">
                            {v.image ? (
                              <img src={v.image} alt="" className="w-8 h-8 rounded object-cover border border-gray-200" />
                            ) : (
                              <div className="w-8 h-8 rounded border border-dashed border-gray-300 flex items-center justify-center hover:border-blue-400">
                                <ImageIcon size={12} className="text-gray-400" />
                              </div>
                            )}
                            <input type="file" accept="image/*" onChange={(e) => handleVariantImage(v.temp_id, e.target.files?.[0] || null)} className="hidden" />
                          </label>
                          {v.image && (
                            <button onClick={() => updateVariant(v.temp_id, 'image', '')} className="text-xs text-red-500 hover:text-red-700">&times;</button>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <button
                          onClick={() => removeVariant(v.temp_id)}
                          className="p-1 text-gray-300 hover:text-red-500 transition-colors"
                          title="Delete variant"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {variants.length === 0 && (
              <div className="px-6 py-12 text-center">
                <p className="text-sm text-gray-500">No variants for this brand.</p>
                <button onClick={addVariant} className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium">Add a variant</button>
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50">
              <button
                onClick={async () => {
                  if (confirm('Delete this brand and ALL its variants? This cannot be undone.')) {
                    await deleteBrand(editingBrand.id)
                  }
                }}
                className="flex items-center gap-1.5 text-sm text-red-600 hover:text-red-700 font-medium"
              >
                <Trash2 size={15} />
                Delete Brand
              </button>
              <div className="flex items-center gap-3">
                <button onClick={closeEdit} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                  Cancel
                </button>
                <button
                  onClick={saveBrand}
                  disabled={saving}
                  className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                >
                  <Save size={15} />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
