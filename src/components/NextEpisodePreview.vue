<script setup lang="ts">
import { computed } from 'vue'
import type { DiaryEntry } from '@/lib/diary'
import ScrollIcon from '@/components/icons/ScrollIcon.vue'

const props = defineProps<{
  entry: DiaryEntry
  /** 这一话的编号 */
  episode: number
}>()

/** 预告播出的日期：最新一篇的第二天 */
const airDate = computed(() => {
  const base = new Date(props.entry.date)
  if (Number.isNaN(base.getTime())) return ''
  base.setDate(base.getDate() + 1)
  return `${base.getMonth() + 1} 月 ${base.getDate()} 日`
})

/** 预告里的小要点 */
const points = computed(() => {
  const sentences = props.entry.source
    .replace(/^---[\s\S]*?---/, '')
    .split(/\n+/)
    .map((line) => line.replace(/^[#>\-*\s]+/, '').trim())
    .filter((line) => line.length > 12 && !line.startsWith('!'))
  return sentences.slice(0, 3)
})
</script>

<template>
  <section class="relative mt-16">
    <!-- 斜纹底 -->
    <div class="stripes absolute inset-0 opacity-[0.07]" aria-hidden="true" />

    <div class="relative border-[4px] border-ink-800 bg-ink-800 shadow-[10px_10px_0_#1f1b1d]">
      <!-- 胶带 -->
      <span class="absolute -top-3 left-8 h-6 w-24 -rotate-3 bg-pop-200/90" aria-hidden="true" />
      <span class="absolute -top-3 right-10 h-6 w-16 rotate-2 bg-pop-200/70" aria-hidden="true" />

      <div class="relative p-5 sm:p-8">
        <!-- 标题行 -->
        <div class="flex flex-wrap items-center justify-between gap-3 border-b-[3px] border-pop-200/30 pb-4">
          <div class="flex items-center gap-3">
            <span class="grid size-12 -rotate-6 place-items-center rounded-full border-[3px] border-pop-200 bg-pop-200 font-pop text-xs font-black leading-none text-ink-800">
              <ScrollIcon :size="26" class="rotate-6" />
            </span>
            <div>
              <p class="font-pop text-[10px] font-bold tracking-[0.35em] text-pop-200/60">次回予告</p>
              <h2 class="font-pop text-2xl font-black tracking-tight text-pop-200 sm:text-3xl">
                第{{ episode + 1 }}話「{{ entry.title }}」
              </h2>
            </div>
          </div>
          <p v-if="airDate" class="border-2 border-pop-200/50 px-2 py-1 font-mono text-[11px] font-bold text-pop-200/80">
            {{ airDate }} 放送予定
          </p>
        </div>

        <!-- 预告正文 -->
        <div class="mt-5 grid gap-5 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <p class="font-pop text-sm font-bold leading-7 text-pop-100/90">
              下一话：{{ entry.mood ? `${entry.mood}的一天。` : '又是平静的一天。' }}
              <span class="text-pop-200/60">{{ entry.weather ? `天气 ${entry.weather}。` : '' }}</span>
            </p>

            <ul v-if="points.length" class="mt-4 space-y-2 font-pop text-[12px] font-bold leading-6 text-pop-100/70">
              <li v-for="(point, index) in points" :key="index" class="flex gap-2">
                <span class="text-pop-200">▶</span>
                <span class="line-clamp-1">{{ point }}</span>
              </li>
            </ul>

            <p class="mt-5 font-pop text-[11px] font-black tracking-[0.3em] text-pop-200/70">
              —— お楽しみに！
            </p>
          </div>

          <!-- 缩略图 -->
          <RouterLink
            :to="`/diary/${entry.slug}`"
            class="group block w-full border-[3px] border-pop-200 bg-pop-200 p-1.5 sm:w-52"
          >
            <div v-if="entry.photos.length" class="relative aspect-[4/3] overflow-hidden">
              <img :src="entry.photos[0]" alt="" class="size-full object-cover transition group-hover:scale-105" />
              <span class="absolute bottom-1 left-1 border-2 border-ink-800 bg-pop-200 px-1 font-pop text-[10px] font-black text-ink-800">
                {{ episode + 1 }}話
              </span>
            </div>
            <div v-else class="grid aspect-[4/3] place-items-center bg-ink-700">
              <span class="font-pop text-4xl text-pop-200/30">？</span>
            </div>
            <p class="mt-1.5 text-center font-pop text-[10px] font-black tracking-[0.2em] text-ink-800">
              本編はこちら →
            </p>
          </RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>
