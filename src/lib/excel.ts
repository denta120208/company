import * as XLSX from 'xlsx'
import type { ParsedVariant, BrandMapping } from '../types/database'

export async function parseExcelFile(
  file: ArrayBuffer,
  fileName: string,
  brandMappings: BrandMapping[]
): Promise<{ category: string; variants: ParsedVariant[] }[]> {
  const workbook = XLSX.read(file, { type: 'array' })
  const results: { category: string; variants: ParsedVariant[] }[] = []

  workbook.SheetNames.forEach((sheetName) => {
    const sheet = workbook.Sheets[sheetName]
    const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { defval: '', header: 1 })

    const headerInfo = findHeaderRow(rows)
    if (!headerInfo) return

    const { headerRowIdx, subHeaderRowIdx, colMap } = headerInfo

    const dataStartIdx = subHeaderRowIdx >= 0 ? subHeaderRowIdx + 1 : headerRowIdx + 1
    const variants: ParsedVariant[] = []

    for (let r = dataStartIdx; r < rows.length; r++) {
      const row = rows[r]
      const nonEmpty = row.filter((c: any) => String(c).trim())
      if (nonEmpty.length === 0) continue

      const descCol = Object.entries(colMap).find(([, field]) => field === 'description')
      if (!descCol) continue

      const description = String(row[parseInt(descCol[0])] || '').replace(/\n/g, ' ').replace(/\s+/g, ' ').trim()
      if (!description) continue

      if (/^(no|picture|description|sub |total|term|note)/i.test(description)) continue

      const variant: ParsedVariant = {
        description,
        shelf_life: '',
        content_per_carton: '',
        length: '',
        width: '',
        height: '',
        loading_20ft: '0',
        loading_40ft: '0',
        picture: null,
        gross_weight: '',
        net_weight: '',
        packing: '',
        origin_country: 'Indonesia',
        sku: '',
      }

      for (const [colIdxStr, field] of Object.entries(colMap)) {
        const colIdx = parseInt(colIdxStr)
        const val = String(row[colIdx] ?? '').replace(/\n/g, ' ').replace(/\s+/g, ' ').trim()
        if (!val) continue

        switch (field) {
          case 'shelf_life': variant.shelf_life = val; break
          case 'content_per_carton': variant.content_per_carton = val; break
          case 'length': variant.length = val; break
          case 'width': variant.width = val; break
          case 'height': variant.height = val; break
          case 'loading_20ft': variant.loading_20ft = val; break
          case 'loading_40ft': variant.loading_40ft = val; break
          case 'gross_weight': variant.gross_weight = val; break
          case 'net_weight': variant.net_weight = val; break
          case 'packing': variant.packing = val; break
          case 'picture': variant.picture = val; break
          case 'origin_country': variant.origin_country = val; break
          case 'sku': variant.sku = val; break
        }
      }

      variants.push(variant)
    }

    if (variants.length > 0) {
      const category = detectCategory(fileName, sheetName)
      results.push({ category, variants })
    }
  })

  return results
}

function findHeaderRow(rows: any[][]): { headerRowIdx: number; subHeaderRowIdx: number; colMap: Record<number, string> } | null {
  const headerKeywords = ['description', 'product', 'item', 'no', 'picture', 'image', 'shelf', 'content', 'carton', 'packing', 'weight', 'origin']

  let headerRowIdx = -1
  for (let i = 0; i < Math.min(rows.length, 50); i++) {
    const row = rows[i].map((c: any) => String(c).toLowerCase().trim())
    const matchCount = row.filter((cell: string) =>
      headerKeywords.some((kw) => cell.includes(kw))
    ).length
    if (matchCount >= 2) {
      headerRowIdx = i
      break
    }
  }
  if (headerRowIdx === -1) return null

  let subHeaderRowIdx = -1
  if (headerRowIdx + 1 < rows.length) {
    const nextRow = rows[headerRowIdx + 1].map((c: any) => String(c).toLowerCase().trim())
    if (nextRow.some((cell: string) => /^(length|width|height|20|40)/.test(cell))) {
      subHeaderRowIdx = headerRowIdx + 1
    }
  }

  const headerRow = rows[headerRowIdx]
  const subHeaderRow = subHeaderRowIdx >= 0 ? rows[subHeaderRowIdx] : []

  const colMap: Record<number, string> = {}

  const fieldPatterns: Record<string, RegExp[]> = {
    description: [/description/i, /desc/i, /product/i, /item/i, /nama barang/i],
    shelf_life: [/shelf\s*life/i, /shelf/i, /expir/i, /life/i, /umur simpan/i, /masa berlaku/i],
    content_per_carton: [/content/i, /carton\s*content/i, /packing/i, /per\s*carton/i, /unit/i, /koli/i, /qty/i, /isi/i],
    picture: [/picture/i, /image/i, /photo/i, /foto/i, /gambar/i],
    gross_weight: [/gross\s*weight/i, /weight/i, /berat kotor/i],
    net_weight: [/net\s*weight/i, /netto/i, /berat bersih/i],
    origin_country: [/origin/i, /country/i, /negara/i, /asal/i],
    sku: [/sku/i, /code/i, /barcode/i, /kode/i, /no\./i, /number/i],
  }

  for (let c = 0; c < headerRow.length; c++) {
    const cell = String(headerRow[c]).trim()
    if (!cell) continue

    for (const [field, patterns] of Object.entries(fieldPatterns)) {
      if (patterns.some((p) => p.test(cell))) {
        colMap[c] = field
        break
      }
    }
  }

  for (let c = 0; c < subHeaderRow.length; c++) {
    const cell = String(subHeaderRow[c]).trim().toLowerCase()
    if (!cell) continue
    if (colMap[c]) continue

    if (/panjang|length/i.test(cell)) colMap[c] = 'length'
    else if (/lebar|width/i.test(cell)) colMap[c] = 'width'
    else if (/tinggi|height/i.test(cell)) colMap[c] = 'height'
    else if (/20\s*ft/i.test(cell)) colMap[c] = 'loading_20ft'
    else if (/40\s*ft/i.test(cell)) colMap[c] = 'loading_40ft'
  }

  if (!Object.values(colMap).includes('description')) return null

  return { headerRowIdx, subHeaderRowIdx, colMap }
}

export function detectCategory(fileName: string, sheetName?: string): string {
  const clean = (s: string) =>
    s
      .replace(/\.(xlsx|xls)$/i, '')
      .replace(/[-_]/g, ' ')
      .replace(/\s*\(\d+\)\s*/g, '')
      .trim()

  if (sheetName && !/^sheet/i.test(sheetName)) {
    return clean(sheetName)
  }

  return clean(fileName)
}

export function detectBrand(
  description: string,
  brandMappings: BrandMapping[]
): { brandName: string; variantName: string } {
  const sorted = [...brandMappings].sort((a, b) => b.keyword.length - a.keyword.length)

  for (const mapping of sorted) {
    const regex = new RegExp(`(?:^|[-–—/\\s])${escapeRegex(mapping.keyword)}(?:[-–—/\\s]|$)`, 'i')
    if (regex.test(description)) {
      const variantName = description.replace(regex, '').replace(/^[-–—\s]+|[-–—\s]+$/g, '').trim()
      return { brandName: mapping.brand_name, variantName: variantName || description }
    }
  }

  const dashMatch = description.match(/^(.+?)\s*[-–—]\s*(.+)$/)
  if (dashMatch) {
    return { brandName: dashMatch[1].trim(), variantName: dashMatch[2].trim() }
  }

  const words = description.split(/\s+/)
  if (words.length >= 2) {
    return { brandName: words[0], variantName: words.slice(1).join(' ') }
  }

  return { brandName: description, variantName: description }
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function groupVariantsByBrand(
  parsedData: { category: string; variants: ParsedVariant[] }[],
  brandMappings: BrandMapping[]
): { category: string; brand: string; variants: ParsedVariant[] }[] {
  const grouped: { category: string; brand: string; variants: ParsedVariant[] }[] = []

  parsedData.forEach(({ category, variants }) => {
    const brandMap = new Map<string, ParsedVariant[]>()

    variants.forEach((variant) => {
      const { brandName, variantName } = detectBrand(variant.description, brandMappings)
      const modifiedVariant = { ...variant, description: variantName }
      if (!brandMap.has(brandName)) {
        brandMap.set(brandName, [])
      }
      brandMap.get(brandName)!.push(modifiedVariant)
    })

    brandMap.forEach((brandVariants, brand) => {
      grouped.push({ category, brand, variants: brandVariants })
    })
  })

  return grouped
}
