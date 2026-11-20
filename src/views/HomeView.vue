<script setup lang="ts">
import { computed } from 'vue'
import NextEpisodePreview from '@/components/NextEpisodePreview.vue'
import PostCard from '@/components/PostCard.vue'
import TagPill from '@/components/TagPill.vue'
import { allTags, posts } from '@/lib/posts'
import { diaryEntries } from '@/lib/diary'
import { site } from '@/site'

const recent = computed(() => posts.slice(0, 4))
const topTags = computed(() => allTags.slice(0, 8))
const recentDiary = computed(() => diaryEntries.slice(0, 3))
/** 最新一篇日记 = 下一话预告的主角 */
const nextEntry = computed(() => diaryEntries[0])
/** 日记总数，也就是下一话的编号 */
const episodeCount = computed(() => diaryEntries.length)
</script>

<template>
  <!-- 主视觉：海报当封面，文字用描边贴上去 -->
  <section class="container-wide pt-8 sm:pt-12">
    <div class="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <!-- 左：标题区 -->
      <div class="relative order-2 lg:order-1">
        <!-- 爆炸标签 -->
        <span class="pop-tag pop-tag-yellow absolute -left-1 -top-8 rotate-[-6deg] text-xs sm:-top-9">
          ★ 毎日更新（たぶん）
        </span>

        <p class="font-pop text-xs font-black tracking-[0.3em] text-ink-800/80 dark:text-pop-200/80">
          ようこそ／WELCOME
        </p>

        <h1 class="mt-2 font-pop text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
          <span class="block text-ink-800 dark:text-pop-200">{{ site.title }}</span>
          <span class="mt-1 block text-2xl font-black tracking-[0.12em] text-ink-800/70 sm:text-3xl dark:text-pop-200/70">
            {{ site.titleEn }}
          </span>
        </h1>

        <p class="mt-5 max-w-md border-l-[6px] border-ink-800 pl-4 text-sm font-bold leading-7 text-ink-800 dark:border-pop-200 dark:text-pop-100">
          {{ site.tagline }}
        </p>

        <div class="mt-7 flex flex-wrap items-center gap-3">
          <RouterLink to="/blog" class="pop-btn -rotate-1">
            读文章 <span class="text-base">→</span>
          </RouterLink>
          <RouterLink to="/diary" class="pop-btn pop-btn-ghost rotate-1">
            翻日记 <span class="text-base">↺</span>
          </RouterLink>
        </div>

        <p class="mt-6 flex items-center gap-2 font-pop text-[11px] font-bold tracking-[0.15em] text-ink-800/60 dark:text-pop-200/60">
          <span class="inline-block size-2 rotate-45 bg-ink-800 dark:bg-pop-200" aria-hidden="true" />
          {{ site.author }} 的个人网站 · 共 {{ posts.length }} 篇文章 / {{ diaryEntries.length }} 篇日记
        </p>
      </div>

      <!-- 右：海报本体 -->
      <figure class="relative order-1 lg:order-2">
        <div class="relative rotate-[1.5deg] border-[4px] border-ink-800 bg-white p-2 shadow-[10px_10px_0_#1f1b1d] dark:border-pop-200 dark:bg-ink-800 dark:shadow-[10px_10px_0_#fdf46d]">
          <img
            :src="site.poster"
            alt="キルミーベイベー Blu-ray BOX 海报"
            class="block w-full"
            fetchpriority="high"
          />
          <span class="absolute -bottom-3 -right-3 rotate-[-4deg] border-[3px] border-ink-800 bg-pop-200 px-2 py-1 font-pop text-[10px] font-black text-ink-800">
            原作 / キルミーベイベー
          </span>
        </div>
        <!-- 星星装饰 -->
        <span class="absolute -left-4 -top-4 select-none font-pop text-4xl text-ink-800 dark:text-pop-200" aria-hidden="true">✦</span>
        <span class="absolute -bottom-6 left-6 select-none font-pop text-2xl text-ink-800/70 dark:text-pop-200/70" aria-hidden="true">✧</span>
      </figure>
    </div>
  </section>

  <!-- 最新文章 -->
  <section class="container-page mt-16">
    <div class="mb-5 flex items-end justify-between gap-4">
      <h2 class="flex items-end gap-2 font-pop text-2xl font-black">
        <span class="border-[3px] border-ink-800 bg-ink-800 px-2 py-0.5 text-base text-pop-200 dark:border-pop-200 dark:bg-pop-200 dark:text-ink-800">01</span>
        文章
        <span class="text-xs font-bold tracking-[0.2em] text-ink-800/50 dark:text-pop-200/50">コラム</span>
      </h2>
      <RouterLink to="/blog" class="font-pop text-[11px] font-bold tracking-[0.15em] underline decoration-2 underline-offset-4">
        全部 {{ posts.length }} 篇 →
      </RouterLink>
    </div>

    <div class="pop-card p-5 sm:p-7">
      <div v-if="recent.length" class="space-y-7">
        <PostCard v-for="(post, i) in recent" :key="post.slug" :post="post" :featured="i === 0" />
      </div>
      <p v-else class="py-10 text-center text-sm font-bold">
        还没有文章，去 <code class="border-2 border-ink-800 bg-pop-200 px-1.5 py-0.5 font-mono">src/posts</code> 写第一篇吧。
      </p>
    </div>
  </section>

  <!-- 最近日记 -->
  <section class="container-page mt-14">
    <div class="mb-5 flex items-end justify-between gap-4">
      <h2 class="flex items-end gap-2 font-pop text-2xl font-black">
        <span class="border-[3px] border-ink-800 bg-ink-800 px-2 py-0.5 text-base text-pop-200 dark:border-pop-200 dark:bg-pop-200 dark:text-ink-800">02</span>
        日记
        <span class="text-xs font-bold tracking-[0.2em] text-ink-800/50 dark:text-pop-200/50">ダイアリー</span>
      </h2>
      <RouterLink to="/diary" class="font-pop text-[11px] font-bold tracking-[0.15em] underline decoration-2 underline-offset-4">
        全部 {{ diaryEntries.length }} 篇 →
      </RouterLink>
    </div>

    <ul v-if="recentDiary.length" class="space-y-4">
      <li v-for="entry in recentDiary" :key="entry.slug">
        <RouterLink
          :to="`/diary/${entry.slug}`"
          class="pop-card-sm group flex items-center gap-4 p-4 transition hover:-translate-y-0.5"
        >
          <div class="grid size-14 shrink-0 place-items-center border-[3px] border-ink-800 bg-pop-200 text-ink-800">
            <span class="font-pop text-2xl font-black leading-none">{{ entry.day }}</span>
            <span class="text-[9px] font-bold leading-none">{{ entry.monthLabel }}</span>
          </div>
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2">
              <span class="border-2 border-ink-800 bg-ink-800 px-1 font-mono text-[9px] font-black text-pop-200">
                第{{ diaryEntries.length - diaryEntries.findIndex((item) => item.slug === entry.slug) }}話
              </span>
              <p class="truncate font-pop text-base font-black group-hover:underline">{{ entry.title }}</p>
            </div>
            <p class="mt-1 truncate text-xs font-bold text-ink-800/60 dark:text-pop-200/60">{{ entry.excerpt }}</p>
          </div>
          <span v-if="entry.photos.length" class="shrink-0 text-[11px] font-black">📷 {{ entry.photos.length }}</span>
        </RouterLink>
      </li>
    </ul>
    <p v-else class="pop-card-sm p-6 text-center text-sm font-bold">还没有日记。</p>
  </section>

  <!-- 次回予告 -->
  <NextEpisodePreview v-if="nextEntry" class="container-page" :entry="nextEntry" :episode="episodeCount" />

  <!-- 标签 -->
  <section v-if="topTags.length" class="container-page mt-14">
    <h2 class="mb-4 flex items-end gap-2 font-pop text-2xl font-black">
      <span class="border-[3px] border-ink-800 bg-ink-800 px-2 py-0.5 text-base text-pop-200 dark:border-pop-200 dark:bg-pop-200 dark:text-ink-800">03</span>
      标签
      <span class="text-xs font-bold tracking-[0.2em] text-ink-800/50 dark:text-pop-200/50">タグ</span>
    </h2>
    <div class="flex flex-wrap gap-2">
      <TagPill v-for="tag in topTags" :key="tag.name" :name="tag.name" :count="tag.count" />
    </div>
  </section>
</template>
