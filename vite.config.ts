import { fileURLToPath, URL } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import Markdown from 'unplugin-vue-markdown/vite'
import anchor from 'markdown-it-anchor'
import type { MarkdownIt, StateCore, Token } from 'markdown-it'
import { createHighlighter, createJavaScriptRegexEngine } from 'shiki'
import { defineConfig } from 'vite'

/** 文章 markdown 里的标题，编译期收集起来给右侧目录用 */
export interface TocItem {
  id: string
  text: string
  level: number
}

// 编译期就初始化好 highlighter，代码块渲染是同步的
const highlighter = await createHighlighter({
  themes: ['github-light', 'github-dark'],
  langs: ['ts', 'js', 'tsx', 'jsx', 'vue', 'css', 'html', 'json', 'yaml', 'bash', 'shell', 'md', 'python', 'diff'],
  engine: createJavaScriptRegexEngine(),
})

export default defineConfig({
  plugins: [
    vue({ include: [/\.vue$/, /\.md$/] }),
    Markdown({
      include: [/\.md$/],
      wrapperClasses: 'prose',
      async markdownItSetup(md) {
        const instance = md as unknown as MarkdownIt
        const toc: TocItem[] = []
        // 中文标题会被编码成百分号形式，这里统一用 h-1、h-2 这种稳定 id。
        // 计数器每篇文章都要归零，否则会一直累加。
        let headingCount = 0

        // 先注册 reset 规则：ruler 按顺序执行，锚点规则是 core 阶段做的
        instance.core.ruler.push('reset-heading-count', () => {
          headingCount = 0
          toc.length = 0
          return true
        })

        instance.use(anchor as never, {
          level: [2, 3],
          slugify: () => `h-${++headingCount}`,
          permalink: anchor.permalink.linkInsideHeader({
            symbol: '#',
            placement: 'before',
            ariaHidden: true,
            // 默认会把中文 id 再编码一次，这里直接用原始 id
            renderHref: (slug: string) => `#${slug}`,
          }),
          callback: (
            token: { tag: string; attrGet: (name: string) => string | null },
            info: { slug: string; title: string },
          ) => {
            toc.push({
              id: token.attrGet('id') ?? info.slug,
              // 用原始标题文字，不要被 permalink 锚点污染
              text: info.title,
              level: Number(token.tag.slice(1)),
            })
          },
        })

        // 用 shiki 替换默认的 <pre><code> 渲染，双主题输出
        instance.renderer.rules.fence = (tokens: Token[], idx: number) => {
          const token = tokens[idx]!
          const info = token.info ? instance.utils.unescapeAll(token.info).trim() : ''
          const lang = info.split(/\s+/)[0] ?? ''
          const code = token.content

          if (lang && highlighter.getLoadedLanguages().includes(lang)) {
            return highlighter.codeToHtml(code, {
              lang,
              themes: { light: 'github-light', dark: 'github-dark' },
              defaultColor: false,
            })
          }
          return `<pre><code>${instance.utils.escapeHtml(code)}</code></pre>`
        }

        // 每篇文章编译完成后，把标题数据挂到 frontmatter 上
        instance.core.ruler.push('collect-toc', (state: StateCore) => {
          const fm = state.env as { frontmatter?: Record<string, unknown> } | undefined
          if (fm?.frontmatter) fm.frontmatter.toc = toc
          return true
        })
      },
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    // 绑到所有网卡，避免只监听 ::1 导致 127.0.0.1 / 局域网打不开
    host: true,
    port: 5180,
    // 端口被占用时直接报错，而不是悄悄换一个端口
    strictPort: true,
  },
})
