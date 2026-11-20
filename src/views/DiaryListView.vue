<script setup lang="ts">
import { computed } from 'vue'
import ScrollIcon from '@/components/icons/ScrollIcon.vue'
import { diaryEntries, groupByMonth } from '@/lib/diary'
import { moodEmoji } from '@/site'

const months = computed(() => groupByMonth(diaryEntries))

/** 从最早的开始数，最近的一篇编号最大 */
function episodeOf(slug: string): number {
  const total = diaryEntries.length
  return total - diaryEntries.findIndex((entry) => entry.slug === slug)
}
</script>

<template>
  <div class="container-page pt-10 sm:pt-14">
    <header class="flex flex-wrap items-end justify-between gap-5">
      <div>
        <p class="inline-block -rotate-2 border-[3px] border-ink-800 bg-pop-200 px-2 py-1 font-pop text-[11px] font-black tracking-[0.2em] text-ink-800">
          ダイアリー / DIARY
        </p>
        <h1 class="mt-4 flex items-center gap-3 font-pop text-4xl font-black tracking-tight sm:text-5xl">
          <ScrollIcon :size="46" class="shrink-0" />
          日记
        </h1>
        <p class="mt-3 max-w-xl text-sm font-bold leading-7 text-ink-800/70 dark:text-pop-200/70">
          随手记下的日子。不用讲道理，也不用写完整，看到什么就记什么。
        </p>
      </div>

      <RouterLink to="/diary/new" class="pop-btn -rotate-1">
        <span class="text-lg leading-none">＋</span> 写一篇
      </RouterLink>
    </header>

    <div v-if="months.length" class="mt-10 space-y-12">
      <section v-for="month in months" :key="`${month.year}-${month.label}`">
        <div class="mb-4 flex items-center gap-3">
          <span class="font-pop text-2xl font-black">{{ month.label }}</span>
          <span class="font-mono text-xs font-black">{{ month.year }}</span>
          <span class="h-[3px] flex-1 bg-ink-800 dark:bg-pop-200" />
        </div>

        <ul class="space-y-4">
          <li v-for="entry in month.entries" :key="entry.slug">
            <RouterLink
              :to="`/diary/${entry.slug}`"
              class="pop-card group flex gap-4 p-4 transition hover:-translate-y-0.5 sm:gap-5 sm:p-5"
            >
              <!-- 日期 + 话数 -->
              <div class="flex w-16 shrink-0 flex-col items-center justify-center border-[3px] border-ink-800 bg-pop-200 py-2 text-ink-800">
                <span class="font-pop text-3xl font-black leading-none">{{ entry.day }}</span>
                <span class="mt-1 font-pop text-[10px] font-bold">{{ entry.weekday }}</span>
                <span class="mt-1 border-t-2 border-ink-800 px-1 pt-1 font-mono text-[9px] font-black">
                  第{{ episodeOf(entry.slug) }}話
                </span>
              </div>

              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-center gap-2">
                  <h2 class="font-pop text-lg font-black leading-snug transition group-hover:underline group-hover:decoration-[3px] group-hover:underline-offset-4">
                    {{ entry.title }}
                  </h2>
                  <span
                    v-if="entry.mood"
                    class="inline-block rotate-2 border-2 border-ink-800 bg-ink-800 px-1.5 py-0.5 font-pop text-[10px] font-black text-pop-200"
                  >
                    {{ entry.mood }} {{ moodEmoji[entry.mood] ?? '' }}
                  </span>
                  <span v-if="entry.weather" class="text-[11px] font-bold text-ink-800/60 dark:text-pop-200/60">
                    {{ entry.weather }}
                  </span>
                </div>
                <p class="mt-2 line-clamp-2 text-sm font-medium leading-6 text-ink-800/70 dark:text-pop-200/70">
                  {{ entry.excerpt }}
                </p>
              </div>

              <div v-if="entry.photos.length" class="hidden w-24 shrink-0 sm:block">
                <div class="relative aspect-square overflow-hidden border-[3px] border-ink-800">
                  <img :src="entry.photos[0]" alt="" loading="lazy" class="size-full object-cover" />
                  <span
                    v-if="entry.photos.length > 1"
                    class="absolute -bottom-0.5 -right-0.5 border-2 border-ink-800 bg-pop-200 px-1 font-mono text-[10px] font-black text-ink-800"
                  >
                    +{{ entry.photos.length - 1 }}
                  </span>
                </div>
              </div>
            </RouterLink>
          </li>
        </ul>
      </section>
    </div>

    <div v-else class="pop-card mt-10 p-12 text-center">
      <p class="font-pop text-lg font-black">还没有日记</p>
      <p class="mt-2 text-sm font-bold">从今天开始记吧，一句话也行。</p>
      <RouterLink to="/diary/new" class="pop-btn mt-6">写第一篇</RouterLink>
    </div>
  </div>
</template>
