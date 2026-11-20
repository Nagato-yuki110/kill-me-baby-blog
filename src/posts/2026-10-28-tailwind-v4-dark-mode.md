---
title: 用 Tailwind v4 给博客搭一套暗色主题
date: 2026-10-28
description: v4 不再需要 tailwind.config.js，主题直接写在 CSS 里。记录一下这次改版踩到的几个点。
tags: [Tailwind, CSS, 前端]
---

Tailwind v4 最大的变化是「CSS-first」：配置从 `tailwind.config.js` 搬到了 CSS 文件里，用 `@theme` 声明变量，安装方式也变成了一个 Vite 插件。

## 安装只要两步

```bash
pnpm add -D tailwindcss @tailwindcss/vite
```

```ts
// vite.config.ts
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
})
```

然后在入口 CSS 里 `@import "tailwindcss";` 就完事了，不再需要 postcss 配置和 content 数组。

## 主题写在 CSS 里

以前要在 js 里写 `extend.colors`，现在直接声明 CSS 变量：

```css
@import 'tailwindcss';

@theme {
  --color-brand-500: #14b8a6;
  --color-brand-600: #0d9488;
  --font-sans: 'Inter', system-ui, sans-serif;
}
```

声明完就能用 `bg-brand-500`、`text-brand-600` 这些类，和内置颜色没有区别。

## 暗色模式：用 class 而不是系统偏好

默认的 `dark:` 跟随系统，但博客用户通常希望能自己切。用 `@custom-variant` 改一下：

```css
@custom-variant dark (&:where(.dark, .dark *));
```

之后给 `<html>` 加 `dark` 类就全局生效。配合一行首屏脚本可以避免刷新时闪白：

```js
const saved = localStorage.getItem('theme')
const dark = saved ? saved === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches
document.documentElement.classList.toggle('dark', dark)
```

## 三个容易踩的坑

1. **`@apply` 的边界**：自定义类写在 `@layer components` 里，否则可能被工具类覆盖。
2. **扫描不到动态类名**：`bg-${color}-500` 这种拼出来的类不会被生成，要么写全，要么用 `@source` 指定目录。
3. **Markdown 里的类名**：文章文件不在组件树里，需要在 CSS 里加 `@source "./posts/**/*.md";` 才能扫到。

## 写正文排版

博客没有装 `@tailwindcss/typography`，因为想要完全控制样式，干脆手写一遍 `.prose`：

```css
.prose h2 {
  @apply mt-14 mb-4 scroll-mt-24 text-2xl font-bold tracking-tight;
}
```

手写的好处是体积小、改起来直接；代价是元素一多就有点长。两种都行，看你更在意什么。

---

改版之后第一屏的 CSS 大概 20KB 出头（gzip 后），对博客来说完全够用了。
