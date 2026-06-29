import JSZip from 'jszip'

export async function extractEmbeddedImages(file: ArrayBuffer): Promise<string[]> {
  if (isZipFile(file)) {
    return extractImagesFromZip(file)
  }
  return scanBinaryImages(file)
}

function isZipFile(buffer: ArrayBuffer): boolean {
  const data = new Uint8Array(buffer, 0, 4)
  return data[0] === 0x50 && data[1] === 0x4B
}

async function extractImagesFromZip(buffer: ArrayBuffer): Promise<string[]> {
  const images: string[] = []
  try {
    const zip = await JSZip.loadAsync(buffer)
    const mediaFiles = Object.keys(zip.files).filter(
      (name) => name.startsWith('xl/media/') && !name.endsWith('/')
    )
    for (const filePath of mediaFiles) {
      const fileData = await zip.files[filePath].async('uint8array')
      const ext = filePath.split('.').pop()?.toLowerCase() || 'png'
      const mime = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg'
        : ext === 'png' ? 'image/png'
        : ext === 'gif' ? 'image/gif'
        : ext === 'bmp' ? 'image/bmp'
        : ext === 'webp' ? 'image/webp'
        : 'image/png'
      const b64 = uint8ToBase64(fileData)
      images.push(`data:${mime};base64,${b64}`)
    }
  } catch {
  }
  return images
}

function scanBinaryImages(buffer: ArrayBuffer): string[] {
  const data = new Uint8Array(buffer)
  const images: string[] = []
  const seen = new Set<number>()

  const pngs = findSeq(data, [0x89, 0x50, 0x4E, 0x47])
  const jpegs = findAllJpegHeaders(data)
  const gifs = findSeq(data, [0x47, 0x49, 0x46, 0x38])

  const all: { pos: number; type: string }[] = [
    ...pngs.map((p) => ({ pos: p, type: 'png' })),
    ...jpegs.map((p) => ({ pos: p, type: 'jpg' })),
    ...gifs.map((p) => ({ pos: p, type: 'gif' })),
  ].sort((a, b) => a.pos - b.pos)

  for (const { pos, type } of all) {
    if (seen.has(pos)) continue

    let end = -1
    if (type === 'png') {
      end = findPngEnd(data, pos)
    } else if (type === 'jpg') {
      end = findMarker(data, pos, [0xFF, 0xD9])
    } else if (type === 'gif') {
      end = findMarker(data, pos, [0x00, 0x3B])
    }
    if (end <= pos) continue

    const slice = data.slice(pos, end)
    const b64 = uint8ToBase64(slice)
    images.push(`data:image/${type};base64,${b64}`)
    seen.add(pos)
  }

  return images
}

function findAllJpegHeaders(data: Uint8Array): number[] {
  const positions: number[] = []
  for (let i = 0; i <= data.length - 3; i++) {
    if (data[i] === 0xFF && data[i + 1] === 0xD8 && data[i + 2] === 0xFF) {
      positions.push(i)
      i += 2
    }
  }
  return positions
}

function findSeq(data: Uint8Array, seq: number[]): number[] {
  const positions: number[] = []
  for (let i = 0; i <= data.length - seq.length; i++) {
    let match = true
    for (let j = 0; j < seq.length; j++) {
      if (data[i + j] !== seq[j]) { match = false; break }
    }
    if (match) positions.push(i)
  }
  return positions
}

function findPngEnd(data: Uint8Array, start: number): number {
  const iend = [0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82]
  if (start + 12 > data.length) return -1
  for (let i = start + 4; i <= data.length - iend.length; i++) {
    let match = true
    for (let j = 0; j < iend.length; j++) {
      if (data[i + j] !== iend[j]) { match = false; break }
    }
    if (match) return i + iend.length
  }
  return data.length
}

function findMarker(data: Uint8Array, start: number, marker: number[]): number {
  if (start + marker.length > data.length) return -1
  for (let i = start + 4; i <= data.length - marker.length; i++) {
    let match = true
    for (let j = 0; j < marker.length; j++) {
      if (data[i + j] !== marker[j]) { match = false; break }
    }
    if (match) return i + marker.length
  }
  return data.length
}

function uint8ToBase64(data: Uint8Array): string {
  let binary = ''
  const chunk = 8192
  for (let i = 0; i < data.length; i += chunk) {
    const end = Math.min(i + chunk, data.length)
    for (let j = i; j < end; j++) {
      binary += String.fromCharCode(data[j])
    }
  }
  try {
    return btoa(binary)
  } catch {
    return btoa(unescape(encodeURIComponent(binary)))
  }
}
