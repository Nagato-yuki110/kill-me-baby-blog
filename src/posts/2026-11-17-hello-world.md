---
title: 你好，世界
date: 2026-11-17
description: 这是一个用 Vue 3 搭起来的个人博客，第一篇文章说说它怎么运转的。
tags: [随笔, Vue]
---

欢迎来到我的博客。这篇文章既是第一篇内容，也是这套博客系统的「使用说明书」。

## 文章从哪来

所有文章都是 `src/posts/` 目录下的 Markdown 文件。文件名就是 URL 里的 slug，比如：

```
src/posts/2026-11-17-hello-world.md   →   /blog/hello-world
```

文件名前面的日期只是为了让文件在目录里按时间排序，URL 里不会出现。

## 写一篇新文章

新建一个 `.md` 文件，开头写 frontmatter：

```yaml
---
title: 文章标题
date: 2026-11-17
description: 一句话简介，列表页和 SEO 都会用到
tags: [Vue, 前端]
draft: false
---
```

然后正文直接用 Markdown 写。支持标题、列表、表格、引用、代码高亮，也支持直接插入 Vue 组件。

> 想先存草稿？把 `draft` 设为 `true`，它就不会出现在列表里。

## 代码高亮

代码块用 Shiki 渲染，和 VS Code 的配色一致，并且跟随暗色模式切换：

```ts
import { computed } from 'vue'

const posts = computed(() => allPosts.filter((post) => !post.draft))
```

## 目录是自动生成的

`##` 和 `###` 标题会在编译时收集成右侧的目录，滚动时会自动高亮当前章节。你什么都不用做。

## 下一步

- 把 `src/site.ts` 里的名字、简介、社交链接换成你自己的
- 在 `src/posts/` 里删掉示例文章，或者直接改
- 部署到 Vercel / Netlify / GitHub Pages，`pnpm build` 出来的 `dist` 直接上传就行

就这样，开始写吧。
