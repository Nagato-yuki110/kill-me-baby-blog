<script setup lang="ts">
import { withBase } from '@/lib/asset'
import { site } from '@/site'

const stack = [
  { name: 'Vue 3', note: 'Composition API + TypeScript' },
  { name: 'Vite', note: '开发与构建' },
  { name: 'Tailwind CSS v4', note: '样式系统' },
  { name: 'Markdown', note: '文章与日记都是内容文件' },
]

const likes = [
  { title: 'キルミーベイベー', note: '一本正经地胡闹，最喜欢这种' },
  { title: '深夜的厨房', note: '揉面比写代码更解压' },
  { title: '旧纸和粗描边', note: '所有东西都该有黑边' },
]
</script>

<template>
  <div class="container-page pt-10 sm:pt-14">
    <p class="inline-block -rotate-2 border-[3px] border-ink-800 bg-pop-200 px-2 py-1 font-pop text-[11px] font-black tracking-[0.2em] text-ink-800">
      アバウト / ABOUT
    </p>

    <div class="pop-card mt-5 p-5 sm:p-8">
      <header class="flex flex-col gap-5 sm:flex-row sm:items-center">
        <div class="relative shrink-0">
          <img
            :src="withBase(site.portrait)"
            alt=""
            class="size-24 border-[3px] border-ink-800 object-cover object-[50%_20%] shadow-[5px_5px_0_#1f1b1d]"
          />
          <span class="absolute -bottom-2 -right-2 rotate-6 border-2 border-ink-800 bg-pop-200 px-1 font-pop text-[9px] font-black text-ink-800">
            ME
          </span>
        </div>
        <div>
          <h1 class="font-pop text-3xl font-black tracking-tight">{{ site.author }}</h1>
          <p class="mt-2 text-sm font-bold leading-7 text-ink-800/70 dark:text-pop-200/70">{{ site.bio }}</p>
        </div>
      </header>

      <div class="mt-7 h-[3px] bg-ink-800 dark:bg-pop-200" />

      <div class="prose mt-7">
        <h2>关于这个地方</h2>
        <p>
          这里是我的抽屉：文章放想法和代码，日记放日子本身。网站的样子是照着
          《キルミーベイベー》的海报做的——亮黄、粗黑边、贴纸一样乱糟糟，
          但内容是认真写的。
        </p>

        <h2>喜欢的东西</h2>
        <ul>
          <li v-for="item in likes" :key="item.title">
            <strong>{{ item.title }}</strong> —— {{ item.note }}
          </li>
        </ul>

        <h2>怎么搭的</h2>
        <p>
          用 Vue 3 写成，文章和日记都是仓库里的 Markdown 文件 —— 写完保存就发布，
          不需要后台、不需要数据库。
        </p>
        <table>
          <thead>
            <tr>
              <th>技术</th>
              <th>用途</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in stack" :key="item.name">
              <td><strong>{{ item.name }}</strong></td>
              <td>{{ item.note }}</td>
            </tr>
          </tbody>
        </table>

        <h2>联系我</h2>
        <p>有想法、勘误，或者只是想聊聊动画，都欢迎。</p>
        <ul>
          <li v-for="link in site.social" :key="link.label">
            <a :href="link.href" target="_blank" rel="noopener noreferrer">{{ link.label }}</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>


