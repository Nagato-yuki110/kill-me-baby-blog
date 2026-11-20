/**
 * 把 /images/xxx 这类绝对路径接上部署时的 base 前缀。
 * GitHub Pages 项目页的地址是 /仓库名/，不做这层处理图片会 404。
 */
export function withBase(path: string | undefined | null): string {
  if (!path) return ''
  if (/^(https?:)?\/\//.test(path) || path.startsWith('data:') || path.startsWith('blob:')) return path
  const base = import.meta.env.BASE_URL || '/'
  if (path.startsWith(base)) return path
  return path.startsWith('/') ? `${base.replace(/\/$/, '')}${path}` : `${base}${path}`
}
