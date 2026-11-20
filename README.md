# キルミー日記 · 长门大法师的个人博客

一个用 **Vue 3 + Vite + TypeScript + Tailwind CSS v4** 写的个人博客 + 日记本。文章和日记都是仓库里的 Markdown 文件，写完保存即可发布，不需要后台和数据库。

视觉上照着《キルミーベイベー》的海报做：亮黄底、粗黑描边、贴纸一样的元素、滚动的 OP 字幕条。默认日间（黄），切到夜间是黑底黄字。

## 站点里的小设计

| 位置 | 说明 |
|---|---|
| 顶部 | 滚动的 OP 字幕条，内容在 `site.ts` 的 `marquee` |
| 首页 | 最新日记的「次回予告」——下一话预告风格，带放送日期和三个看点 |
| 文章列表 | 每篇是一个「放送第◯回」，按时间正序编号，卡片上有 ▶ |
| 文章详情 | 头部标着「放送 第◯回」，右侧目录是编号列表 |
| 日记 | 每篇自动编号「第◯話」，心情带颜文字贴纸 |
| 夜间模式 | 黑底黄字，海报压暗保留 |

作者名、邮箱都在 `src/site.ts` 里（当前为 长门大法师 / 3100024843@qq.com）。

## 快速开始

**最简单**：双击项目根目录的 `start-blog.cmd`，浏览器会自动打开 http://localhost:5180 。
关掉那个黑窗口就是停止服务；如果已经在运行，再双击只会重新打开浏览器。

命令行：

```bash
pnpm install
pnpm dev        # http://localhost:5180
pnpm build      # 类型检查 + 产物输出到 dist/
pnpm preview    # 预览构建结果
```

> 端口固定在 5180（`vite.config.ts` 里 `strictPort: true`）。被占用时会直接报错，不会悄悄换端口。

## 目录结构

```
my-blog/
├── src/
│   ├── posts/            # 文章：一个 .md 一篇（文件名 = URL slug）
│   ├── diary/            # 日记：一个 .md 一条
│   ├── views/            # 首页 / 文章列表 / 文章详情 / 日记列表 / 日记详情 / 写日记 / 关于 / 404
│   ├── components/       # 头部（含滚动字幕条）、页脚、文章卡片、标签、主题开关、图片灯箱、背景
│   ├── layouts/          # 全局布局
│   ├── lib/
│   │   ├── posts.ts      # 扫描文章、解析 frontmatter、排序、筛选、阅读时间
│   │   ├── diary.ts      # 扫描日记、按月分组、图片提取
│   │   └── save-diary.ts # 浏览器里直接写入项目目录（File System Access API）
│   ├── router/           # 路由 + 标题管理
│   ├── stores/theme.ts   # 日间/夜间切换（默认日间）
│   ├── assets/main.css   # 配色、粗描边积木、网点纸、正文排版
│   └── site.ts           # 站点名、作者、导航、社交链接、海报、字幕条文案、心情选项
├── public/
│   ├── images/           # 海报、头像
│   └── uploads/          # 写日记时上传的图片
└── vite.config.ts        # Vue + Markdown 编译 + Shiki 代码高亮 + Tailwind
```

## 视觉积木

改样式基本只用这几个 class（都在 `src/assets/main.css`）：

| class | 效果 |
|---|---|
| `.pop-card` / `.pop-card-sm` | 白底、3px 黑边、硬阴影（贴纸卡片） |
| `.pop-btn` | 黄色贴纸按钮，hover 上浮、active 下压 |
| `.pop-tag` / `.pop-tag-yellow` | 小标签 |
| `.marquee` | 顶部滚动的 OP 字幕条 |
| `.halftone` / `.dot-field` | 网点纸纹理 |

## 写文章

在 `src/posts/` 新建文件，例如 `2026-12-01-my-post.md`：

```md
---
title: 文章标题
date: 2026-12-01
description: 一句话简介，显示在列表页
tags: [Vue, 前端]
draft: false
---

正文用 Markdown 写，`##` / `###` 标题会自动生成右侧目录。
```

- 文件名前的日期只用于排序，URL 里会去掉
- `draft: true` 的文章不会出现在任何列表里
- 支持代码高亮（Shiki，跟随日/夜间切换）、表格、引用、行内代码

## 写日记

两种方式：

**1. 页面里直接写（推荐）**

访问 `/diary/new`，填标题、日期、心情、天气，可以添加图片。点保存时会让你选一次项目根目录（`my-blog` 文件夹），之后浏览器会记住：

- 图片会压缩到最长边 1600px，写进 `public/uploads/`
- 日记正文写进 `src/diary/日期-slug.md`
- 需要 Edge / Chrome 这类支持 File System Access API 的浏览器

**2. 手动新建 md**

```md
---
title: 把海报贴满墙
date: 2026-11-17
mood: 开心
weather: 晴
photos:
  - /images/poster.png
---

正文。也可以直接在正文里写 `![](/images/xxx.jpg)`，会被自动收进图集。
```

心情可选：平静 / 开心 / 疲惫 / 低落 / 专注 / 想念（在 `src/site.ts` 里改）。
日记会自动编号成「第◯話」，越新编号越大。

## 换成你自己的

- `src/site.ts`：站点名、作者、tagline、导航、社交链接、海报路径、字幕条文案
- `public/images/poster.png`：首页主视觉 + 全站背景（换图不用改代码）

## 部署

`pnpm build` 之后把 `dist/` 部署到任意静态托管即可：

- **Vercel / Netlify**：框架选 Vite，构建命令 `pnpm build`，输出目录 `dist`
- **GitHub Pages**：仓库名不是 `<user>.github.io` 时，设置 `base: '/仓库名/'` 后构建
- **Nginx**：需要把未知路径回退到 `index.html`（`try_files $uri $uri/ /index.html`）

> 「写日记」功能依赖浏览器的本地文件权限，只在你自己电脑上的 `pnpm dev` 环境有意义；部署到线上后那个页面仍会显示，但保存会失败。如果不想要，删掉 `/diary/new` 路由和入口链接即可。
