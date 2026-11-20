/**
 * 把 dist/ 复制成 docs/ 供 GitHub Pages 发布。
 * 用法：pnpm build:pages
 */
import { cpSync, copyFileSync, existsSync, rmSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const dist = join(root, 'dist')
const docs = join(root, 'docs')

if (!existsSync(dist)) {
  console.error('找不到 dist，请先构建')
  process.exit(1)
}

rmSync(docs, { recursive: true, force: true })
cpSync(dist, docs, { recursive: true })
copyFileSync(join(docs, 'index.html'), join(docs, '404.html'))
console.log('已生成 docs/（含 404.html 回退）')
