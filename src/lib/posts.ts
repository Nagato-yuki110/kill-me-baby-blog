import type { DefineComponent } from 'vue'

/** 文章标题锚点（右侧目录用） */
export interface TocItem {
  id: string
  text: string
  level: number
}

/** 文章 frontmatter，写 md 时按这个填 */
export interface PostFrontmatter {
  title: string
  description?: string
  /** 2026-11-17 或 2026-11-17 10:30 */
  date: string
  updated?: string
  tags?: string[]
  cover?: string
  draft?: boolean
  toc?: TocItem[]
}

export interface Post {
  slug: string
  title: string
  description: string
  date: string
  updated?: string
  tags: string[]
  cover?: string
  draft: boolean
  toc: TocItem[]
  /** 编译后的 Vue 组件，直接 <component :is> 渲染 */
  component: DefineComponent
  /** 中文按字、英文按词估算的阅读时间（分钟），详情页加载后会更精确 */
  readingTime: number
}

/** unplugin-vue-markdown 把 frontmatter 拆成具名导出，这里统一收回来 */
interface MarkdownModule {
  default: DefineComponent
  [key: string]: unknown
}

/**
 * 约定：文章放在 src/posts 下，文件名即 slug。
 * 想按日期排序、URL 好看，可以写成 2026-11-17-hello-world.md
 */
const modules = import.meta.glob<MarkdownModule>('../posts/*.md', { eager: true })
/**
 * 原文，用来算字数和阅读时间。
 * 直接 eager 加载：切文章时读取时间不会先显示 1 分钟再跳变。
 */
const rawModules = import.meta.glob<string>('../posts/*.md', { eager: true, query: '?raw', import: 'default' })

/** 粗略估算阅读时间：中文 400 字/分钟，英文 220 词/分钟 */
export function estimateReadingTime(source: string): number {
  const text = source
    .replace(/^---[\s\S]*?---/, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/[#>*`\-[\]()!]/g, ' ')
  const cjk = (text.match(/[\u4e00-\u9fa5]/g) ?? []).length
  const words = (text.match(/[a-zA-Z0-9]+/g) ?? []).length
  return Math.max(1, Math.ceil(cjk / 400 + words / 220))
}

/** 把 frontmatter 里的日期统一成 ISO 字符串 */
export function normalizeDate(value: unknown, fallback?: string): string {
  const raw =
    value instanceof Date ? value.toISOString() : typeof value === 'string' ? value : (fallback ?? '')
  if (!raw) return new Date().toISOString().slice(0, 10)
  const parsed = new Date(raw.replace(' ', 'T'))
  return Number.isNaN(parsed.getTime()) ? raw : parsed.toISOString()
}

/** 支持 tags: [a, b] 和 tags: a, b 两种写法 */
export function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === 'string')
  if (typeof value === 'string') return value.split(',').map((item) => item.trim()).filter(Boolean)
  return []
}

/** 2026-11-17-hello-world → { slug: 'hello-world', date: '2026-11-17' } */
export function parseFileName(fileName: string): { slug: string; date?: string } {
  const match = fileName.match(/^(\d{4}-\d{2}-\d{2})-(.+)$/)
  return match ? { slug: match[2]!, date: match[1]! } : { slug: fileName }
}

/** 去掉 markdown 语法，截出纯文本摘录 */
export function toPlainText(markdown: string, maxLength = 90): string {
  const text = markdown
    .replace(/^---[\s\S]*?---/, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#>*`_~\-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return text.length > maxLength ? `${text.slice(0, maxLength)}…` : text
}

interface PostWithFileName extends Post {
  fileName: string
}

function readFrontmatter(mod: MarkdownModule): Partial<PostFrontmatter> {
  return {
    title: typeof mod.title === 'string' ? mod.title : undefined,
    description: typeof mod.description === 'string' ? mod.description : undefined,
    date: typeof mod.date === 'string' ? mod.date : undefined,
    updated: typeof mod.updated === 'string' ? mod.updated : undefined,
    tags: toStringArray(mod.tags),
    cover: typeof mod.cover === 'string' ? mod.cover : undefined,
    draft: mod.draft === true,
    toc: Array.isArray(mod.toc) ? (mod.toc as TocItem[]) : [],
  }
}

const allPosts: PostWithFileName[] = Object.entries(modules)
  .map(([path, mod]) => {
    const fileName = path.split('/').pop()!.replace(/\.md$/, '')
    const parsed = parseFileName(fileName)
    const fm = readFrontmatter(mod)
    const source = rawModules[path] ?? ''

    return {
      fileName,
      slug: parsed.slug,
      title: fm.title ?? parsed.slug,
      description: fm.description ?? '',
      date: normalizeDate(fm.date, parsed.date),
      updated: fm.updated ? normalizeDate(fm.updated) : undefined,
      tags: fm.tags ?? [],
      cover: fm.cover,
      draft: fm.draft ?? false,
      toc: fm.toc ?? [],
      component: mod.default,
      readingTime: estimateReadingTime(source),
    }
  })
  .filter((post) => !post.draft)
  .sort((a, b) => +new Date(b.date) - +new Date(a.date))

export const posts = allPosts

export const allTags: { name: string; count: number }[] = Object.entries(
  posts.reduce<Record<string, number>>((acc, post) => {
    for (const tag of post.tags) acc[tag] = (acc[tag] ?? 0) + 1
    return acc
  }, {}),
)
  .map(([name, count]) => ({ name, count }))
  .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))

export function getPost(slug: string): PostWithFileName | undefined {
  return allPosts.find((post) => post.slug === slug)
}

/** 按标签和关键词筛选；tag 传空表示不过滤 */
export function filterPosts(list: Post[], tag: string | null, keyword = ''): Post[] {
  const query = keyword.trim().toLowerCase()
  return list.filter((post) => {
    const matchTag = !tag || post.tags.includes(tag)
    const matchQuery =
      !query ||
      post.title.toLowerCase().includes(query) ||
      post.description.toLowerCase().includes(query) ||
      post.tags.some((t) => t.toLowerCase().includes(query))
    return matchTag && matchQuery
  })
}

export function formatDate(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export function formatDateLong(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return `${date.getFullYear()} 年 ${date.getMonth() + 1} 月 ${date.getDate()} 日`
}
