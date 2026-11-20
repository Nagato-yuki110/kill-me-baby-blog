import type { DefineComponent } from 'vue'
import { withBase } from './asset'
import { normalizeDate, parseFileName, toPlainText, toStringArray } from './posts'

/** 一条日记的 frontmatter */
export interface DiaryFrontmatter {
  title: string
  /** 2026-11-17 */
  date: string
  mood?: string
  weather?: string
  /** 配图，路径相对 public：/uploads/xxx.jpg */
  photos?: string[]
  draft?: boolean
}

export interface DiaryEntry {
  slug: string
  /** 原文件名，用于定位 */
  fileName: string
  title: string
  date: string
  mood: string
  weather: string
  photos: string[]
  excerpt: string
  /** 正文编译后的 Vue 组件 */
  component: DefineComponent
  /** 正文原始 markdown，用于新建时回填 */
  source: string
  draft: boolean
  /** 显示用的日期碎片 */
  day: string
  monthLabel: string
  weekday: string
  year: string
}

interface MarkdownModule {
  default: DefineComponent
  [key: string]: unknown
}

/**
 * 约定：日记放在 src/diary 下，一个 .md 一条。
 * 文件名建议 2026-11-17-slug.md，日期会从文件名兜底。
 */
const modules = import.meta.glob<MarkdownModule>('../diary/*.md', { eager: true })
const rawModules = import.meta.glob<string>('../diary/*.md', { eager: true, query: '?raw', import: 'default' })

const WEEKDAYS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
const MONTHS = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']

function readFrontmatter(mod: MarkdownModule): Partial<DiaryFrontmatter> {
  return {
    title: typeof mod.title === 'string' ? mod.title : undefined,
    date: typeof mod.date === 'string' ? mod.date : undefined,
    mood: typeof mod.mood === 'string' ? mod.mood : undefined,
    weather: typeof mod.weather === 'string' ? mod.weather : undefined,
    photos: toStringArray(mod.photos),
    draft: mod.draft === true,
  }
}

/** 从 markdown 里捞出 ![alt](src)，和 frontmatter.photos 合并去重 */
function extractInlinePhotos(markdown: string): string[] {
  const found: string[] = []
  for (const match of markdown.matchAll(/!\[[^\]]*\]\(([^)\s]+)[^)]*\)/g)) {
    const src = match[1]
    if (src && !/^https?:/i.test(src)) found.push(src)
  }
  return found
}

const entries: DiaryEntry[] = Object.entries(modules)
  .map(([path, mod]) => {
    const fileName = path.split('/').pop()!.replace(/\.md$/, '')
    const parsed = parseFileName(fileName)
    const fm = readFrontmatter(mod)
    const source = rawModules[path] ?? ''
    const date = normalizeDate(fm.date, parsed.date)
    const d = new Date(date)

    return {
      fileName,
      slug: parsed.slug,
      title: fm.title ?? parsed.slug,
      date,
      mood: fm.mood ?? '',
      weather: fm.weather ?? '',
      photos: [...new Set([...(fm.photos ?? []), ...extractInlinePhotos(source)])].map(withBase),
      excerpt: toPlainText(source),
      component: mod.default,
      source,
      draft: fm.draft ?? false,
      day: Number.isNaN(d.getTime()) ? '--' : String(d.getDate()).padStart(2, '0'),
      monthLabel: Number.isNaN(d.getTime()) ? '' : MONTHS[d.getMonth()]!,
      weekday: Number.isNaN(d.getTime()) ? '' : WEEKDAYS[d.getDay()]!,
      year: Number.isNaN(d.getTime()) ? '' : String(d.getFullYear()),
    }
  })
  .filter((entry) => !entry.draft)
  .sort((a, b) => +new Date(b.date) - +new Date(a.date))

export const diaryEntries = entries

/** 按年月分组，日记列表按月份翻 */
export function groupByMonth(list: DiaryEntry[]): { label: string; year: string; entries: DiaryEntry[] }[] {
  const map = new Map<string, DiaryEntry[]>()
  for (const entry of list) {
    const key = entry.date.slice(0, 7)
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(entry)
  }
  return [...map.entries()].map(([key, items]) => {
    const [year, month] = key.split('-')
    return { label: `${MONTHS[Number(month) - 1] ?? month}`, year: year!, entries: items }
  })
}

export function getDiary(slug: string): DiaryEntry | undefined {
  return entries.find((entry) => entry.slug === slug)
}

export function formatDiaryDate(date: string): string {
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return date
  return `${d.getFullYear()} 年 ${d.getMonth() + 1} 月 ${d.getDate()} 日 · ${WEEKDAYS[d.getDay()]}`
}
