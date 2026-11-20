<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ShurikenIcon from '@/components/icons/ShurikenIcon.vue'
import { allTags, filterPosts, formatDate, posts } from '@/lib/posts'

const route = useRoute()
const router = useRouter()

const keyword = ref('')
const activeTag = ref<string | null>(null)

watch(
  () => route.query.tag,
  (tag) => {
    activeTag.value = typeof tag === 'string' && tag ? tag : null
  },
  { immediate: true },
)

const filtered = computed(() => filterPosts(posts, activeTag.value, keyword.value))

/** 按时间正序算「放送第几回」，最早那篇是第 1 回 */
const total = computed(() => posts.length)
function episodeOf(slug: string): number {
  const index = posts.findIndex((post) => post.slug === slug)
  return index < 0 ? total.value : total.value - index
}

function selectTag(tag: string | null) {
  activeTag.value = tag
  const query = { ...route.query }
  if (tag) query.tag = tag
  else delete query.tag
  void router.replace({ query })
}
</script>

<template>
  <div class="container-page pt-10 sm:pt-14">
    <header>
      <p class="inline-block -rotate-2 border-[3px] border-ink-800 bg-pop-200 px-2 py-1 font-pop text-[11px] font-black tracking-[0.2em] text-ink-800">
        ON AIR / コラム
      </p>
      <h1 class="mt-4 flex items-center gap-3 font-pop text-4xl font-black tracking-tight sm:text-5xl">
        <ShurikenIcon :size="44" mono class="shrink-0 -rotate-12" />
        放送列表
      </h1>
      <p class="mt-3 text-sm font-bold text-ink-800/70 dark:text-pop-200/70">
        全 {{ total }} 回放送 · 关于代码、工具，和一点生活
      </p>
    </header>

    <div class="pop-card mt-7 space-y-4 p-4 sm:p-5">
      <div class="relative">
        <svg
          class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.6"
          stroke-linecap="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          v-model="keyword"
          type="search"
          placeholder="搜索标题、简介或标签…"
          class="w-full border-[3px] border-ink-800 bg-white py-2 pl-9 pr-3 text-sm font-bold text-ink-800 outline-none transition placeholder:text-ink-800/40 focus:bg-pop-50 dark:border-pop-200 dark:bg-ink-700 dark:text-pop-100 dark:placeholder:text-pop-200/40 dark:focus:bg-ink-600"
        />
      </div>

      <div class="flex flex-wrap gap-2">
        <button
          type="button"
          class="pop-tag px-3 py-1 text-xs transition"
          :class="!activeTag ? 'pop-tag-yellow font-black' : 'hover:bg-pop-200'"
          @click="selectTag(null)"
        >
          全部
        </button>
        <button
          v-for="tag in allTags"
          :key="tag.name"
          type="button"
          class="pop-tag px-3 py-1 text-xs transition"
          :class="activeTag === tag.name ? 'pop-tag-yellow font-black' : 'hover:bg-pop-200'"
          @click="selectTag(tag.name === activeTag ? null : tag.name)"
        >
          #{{ tag.name }}
          <span class="font-mono text-[10px] opacity-60">{{ tag.count }}</span>
        </button>
      </div>
    </div>

    <div v-if="filtered.length" class="mt-8 space-y-5">
      <RouterLink
        v-for="post in filtered"
        :key="post.slug"
        :to="`/blog/${post.slug}`"
        class="pop-card group block p-4 transition hover:-translate-x-0.5 hover:-translate-y-0.5 sm:p-5"
      >
        <div class="flex gap-4 sm:gap-5">
          <!-- 话数：像节目单上的编号 -->
          <div
            class="flex w-[5.5rem] shrink-0 flex-col items-center justify-center gap-0.5 self-start border-[3px] border-ink-800 bg-pop-200 px-1 py-2 text-ink-800 sm:w-24"
          >
            <span class="font-mono text-[9px] font-black tracking-[0.2em]">放送</span>
            <span class="whitespace-nowrap font-pop text-xl font-black leading-none sm:text-2xl">第{{ episodeOf(post.slug) }}回</span>
          </div>

          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-center gap-2">
              <h2 class="font-pop text-lg font-black leading-snug transition group-hover:underline group-hover:decoration-[3px] group-hover:underline-offset-4 sm:text-xl">
                {{ post.title }}
              </h2>
            </div>
            <p v-if="post.description" class="mt-2 line-clamp-2 text-sm font-medium leading-6 text-ink-800/70 dark:text-pop-200/70">
              {{ post.description }}
            </p>

            <div class="mt-3 flex flex-wrap items-center gap-2 font-pop text-[10px] font-bold">
              <span class="border-2 border-ink-800/30 px-1.5 py-0.5 font-mono dark:border-pop-200/30">
                {{ formatDate(post.date) }}
              </span>
              <span class="border-2 border-ink-800/30 px-1.5 py-0.5 dark:border-pop-200/30">
                {{ post.readingTime }} 分
              </span>
              <span
                v-for="tag in post.tags"
                :key="tag"
                class="bg-pop-200 px-1.5 py-0.5 text-ink-800"
              >
                #{{ tag }}
              </span>
            </div>
          </div>

          <div class="hidden shrink-0 items-center sm:flex">
            <span class="font-pop text-2xl transition-transform group-hover:translate-x-1">▶</span>
          </div>
        </div>
      </RouterLink>
    </div>

    <div v-else class="pop-card mt-10 p-10 text-center">
      <p class="font-pop text-lg font-black">没有找到匹配的放送</p>
      <button
        type="button"
        class="pop-btn mt-5"
        @click="
          keyword = '';
          selectTag(null)
        "
      >
        清除筛选
      </button>
    </div>
  </div>
</template>
