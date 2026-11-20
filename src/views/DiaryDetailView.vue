<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import PhotoLightbox from '@/components/PhotoLightbox.vue'
import { diaryEntries, formatDiaryDate, getDiary } from '@/lib/diary'
import { moodEmoji } from '@/site'

const route = useRoute()
const entry = computed(() => getDiary(route.params.slug as string))

const index = computed(() => diaryEntries.findIndex((item) => item.slug === entry.value?.slug))
const newer = computed(() => (index.value > 0 ? diaryEntries[index.value - 1] : undefined))
const older = computed(() => (index.value >= 0 ? diaryEntries[index.value + 1] : undefined))
const episode = computed(() => (index.value >= 0 ? diaryEntries.length - index.value : 0))
</script>

<template>
  <div v-if="entry" class="container-page pt-8 sm:pt-12">
    <RouterLink
      to="/diary"
      class="inline-flex items-center gap-1 border-[3px] border-ink-800 bg-white px-2.5 py-1 font-pop text-[11px] font-black transition hover:bg-pop-200 dark:border-pop-200 dark:bg-ink-700 dark:text-pop-100"
    >
      ← 返回日记
    </RouterLink>

    <article class="mt-5">
      <!-- 头部 -->
      <header class="pop-card relative p-5 sm:p-7">
        <span class="absolute -right-3 -top-3 rotate-6 border-[3px] border-ink-800 bg-pop-200 px-2 py-1 font-pop text-xs font-black text-ink-800">
          第{{ episode }}話
        </span>

        <div class="flex flex-col gap-5 sm:flex-row sm:items-start">
          <div class="flex shrink-0 items-center gap-4 sm:flex-col sm:gap-1 sm:border-r-[3px] sm:border-ink-800 sm:pr-6 dark:sm:border-pop-200">
            <span class="font-pop text-6xl font-black leading-none">{{ entry.day }}</span>
            <div class="flex flex-col sm:items-center">
              <span class="font-pop text-sm font-black">{{ entry.monthLabel }}</span>
              <span class="font-mono text-xs font-bold">{{ entry.year }}</span>
            </div>
          </div>

          <div class="min-w-0 flex-1">
            <h1 class="font-pop text-2xl font-black leading-snug sm:text-3xl">{{ entry.title }}</h1>
            <div class="mt-3 flex flex-wrap items-center gap-2 font-pop text-[11px] font-bold">
              <span class="pop-tag">{{ formatDiaryDate(entry.date) }}</span>
              <span v-if="entry.mood" class="pop-tag pop-tag-yellow -rotate-2">
                {{ entry.mood }} {{ moodEmoji[entry.mood] ?? '' }}
              </span>
              <span v-if="entry.weather" class="pop-tag">{{ entry.weather }}</span>
            </div>
          </div>
        </div>
      </header>

      <!-- 配图 -->
      <div v-if="entry.photos.length" class="mt-5">
        <PhotoLightbox :photos="entry.photos" :columns="2" />
      </div>

      <!-- 正文 -->
      <div class="pop-card prose mt-5 px-5 py-7 sm:px-8 sm:py-9">
        <component :is="entry.component" />

        <div class="mt-12 flex items-center gap-3 font-pop text-[11px] font-black tracking-[0.2em]">
          <span class="h-1 w-10 bg-ink-800 dark:bg-pop-200" />
          おしまい / {{ entry.date }}
        </div>
      </div>
    </article>

    <!-- 前后篇 -->
    <nav class="mt-6 grid gap-4 sm:grid-cols-2" aria-label="相邻日记">
      <RouterLink v-if="older" :to="`/diary/${older.slug}`" class="pop-card-sm group -rotate-1 p-4 transition hover:rotate-0">
        <span class="font-pop text-[11px] font-black">← 前の話</span>
        <p class="mt-1 truncate font-pop text-base font-black group-hover:underline">{{ older.title }}</p>
      </RouterLink>
      <span v-else class="hidden sm:block" />

      <RouterLink v-if="newer" :to="`/diary/${newer.slug}`" class="pop-card-sm group rotate-1 p-4 text-right transition hover:rotate-0">
        <span class="font-pop text-[11px] font-black">次の話 →</span>
        <p class="mt-1 truncate font-pop text-base font-black group-hover:underline">{{ newer.title }}</p>
      </RouterLink>
    </nav>
  </div>

  <div v-else class="container-page py-32 text-center">
    <p class="font-pop text-7xl font-black text-ink-800/15 dark:text-pop-200/20">404</p>
    <h1 class="mt-3 font-pop text-2xl font-black">这页日记不存在</h1>
    <p class="mt-2 text-sm font-bold">可能已经删了，或者链接写错了。</p>
    <RouterLink to="/diary" class="pop-btn mt-6">回日记列表</RouterLink>
  </div>
</template>
