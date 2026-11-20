/**
 * 浏览器里直接把日记写进项目目录（File System Access API）。
 * 只有 Chromium 系浏览器支持；不支持时调用方要给出提示。
 */

const DB_NAME = 'ink-lamp-diary'
const STORE = 'handles'
const ROOT_KEY = 'project-root'

export const supportsFileSystem = typeof window !== 'undefined' && 'showDirectoryPicker' in window

interface FsDirectoryHandle {
  name: string
  queryPermission(options: { mode: 'read' | 'readwrite' }): Promise<PermissionState>
  requestPermission(options: { mode: 'read' | 'readwrite' }): Promise<PermissionState>
  getFileHandle(name: string, options?: { create?: boolean }): Promise<FsFileHandle>
  getDirectoryHandle(name: string, options?: { create?: boolean }): Promise<FsDirectoryHandle>
}

interface FsFileHandle {
  createWritable(): Promise<{ write(data: Blob | string): Promise<void>; close(): Promise<void> }>
}

declare global {
  interface Window {
    showDirectoryPicker(options?: { id?: string; mode?: 'read' | 'readwrite' }): Promise<FsDirectoryHandle>
  }
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1)
    request.onupgradeneeded = () => request.result.createObjectStore(STORE)
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

async function saveHandle(handle: FsDirectoryHandle): Promise<void> {
  const db = await openDb()
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).put(handle, ROOT_KEY)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

async function loadHandle(): Promise<FsDirectoryHandle | null> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly')
    const request = tx.objectStore(STORE).get(ROOT_KEY)
    request.onsuccess = () => resolve((request.result as FsDirectoryHandle | undefined) ?? null)
    request.onerror = () => reject(request.error)
  })
}

/** 记住上次选的博客根目录，没有就弹窗让用户选 */
export async function pickProjectRoot(): Promise<FsDirectoryHandle> {
  const saved = await loadHandle()
  if (saved) {
    const permission = await saved.queryPermission({ mode: 'readwrite' })
    if (permission === 'granted') return saved
    if (permission === 'prompt' && (await saved.requestPermission({ mode: 'readwrite' })) === 'granted') {
      return saved
    }
  }
  const handle = await window.showDirectoryPicker({ id: 'ink-lamp-blog', mode: 'readwrite' })
  await saveHandle(handle)
  return handle
}

/** 把 File 压缩到指定最长边，返回 JPEG blob */
export async function compressImage(file: File, maxSize = 1600, quality = 0.85): Promise<Blob> {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height))
  const width = Math.round(bitmap.width * scale)
  const height = Math.round(bitmap.height * scale)
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()
  return new Promise((resolve) => canvas.toBlob((blob) => resolve(blob!), 'image/jpeg', quality))
}

function slugify(title: string, date: string): string {
  const ascii = title
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40)
  return `${date}-${ascii || 'entry'}`
}

export interface SaveDiaryInput {
  title: string
  date: string
  mood: string
  weather: string
  body: string
  photos: File[]
}

export interface SaveDiaryResult {
  markdownPath: string
  photoPaths: string[]
}

/** 写图片到 public/uploads，写 markdown 到 src/diary */
export async function saveDiary(input: SaveDiaryInput): Promise<SaveDiaryResult> {
  const root = await pickProjectRoot()
  const slug = slugify(input.title, input.date)
  const photoPaths: string[] = []

  if (input.photos.length) {
    const uploads = await root.getDirectoryHandle('public', { create: true }).then((dir) =>
      dir.getDirectoryHandle('uploads', { create: true }),
    )
    for (const [index, photo] of input.photos.entries()) {
      const blob = await compressImage(photo)
      const ext = 'jpg'
      const name = `${slug}-${index + 1}.${ext}`
      const fileHandle = await uploads.getFileHandle(name, { create: true })
      const writable = await fileHandle.createWritable()
      await writable.write(blob)
      await writable.close()
      photoPaths.push(`/uploads/${name}`)
    }
  }

  const frontmatter = [
    '---',
    `title: ${input.title}`,
    `date: ${input.date}`,
    input.mood ? `mood: ${input.mood}` : '',
    input.weather ? `weather: ${input.weather}` : '',
    photoPaths.length ? `photos:\n${photoPaths.map((p) => `  - ${p}`).join('\n')}` : '',
    '---',
    '',
  ]
    .filter((line) => line !== '')
    .join('\n')

  const diaryDir = await root.getDirectoryHandle('src', { create: true }).then((dir) =>
    dir.getDirectoryHandle('diary', { create: true }),
  )
  const markdownName = `${slug}.md`
  const fileHandle = await diaryDir.getFileHandle(markdownName, { create: true })
  const writable = await fileHandle.createWritable()
  await writable.write(`${frontmatter}\n${input.body.trim()}\n`)
  await writable.close()

  return { markdownPath: `src/diary/${markdownName}`, photoPaths }
}
