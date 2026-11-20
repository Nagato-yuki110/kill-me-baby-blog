<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { formatDateLong, getPost, posts, type TocItem } from '@/lib/posts'

const route = useRoute()

const post = computed(() => getPost(route.params.slug as string))
const readingTime = computed(() => post.value?.readingTime ?? 1)

const index = computed(() => posts.findIndex((p) => p.slug === post.value?.slug))
const nextPost = computed(() => (index.value > 0 ? posts[index.value - 1] : undefined))
const prevPost = computed(() => (index.value >= 0 ? posts[index.value + 1] : undefined))

const toc = computed<TocItem[]>(() => post.value?.toc ?? [])
const activeId = ref('')

/** 放送第几回：和列表页一致，最早那篇是第 1 回 */
const episode = computed(() => {
  if (index.value < 0) return 0
  return posts.length - index.value
})

let observer: IntersectionObserver | undefined

function setupHeadingObserver() {
  observer?.disconnect()
  activeId.value = ''
  const headings = document.querySelectorAll<HTMLElement>('.prose h2[id], .prose h3[id]')
  if (!headings.length) return
  observer = new IntersectionObserver(
    (entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting)
      if (visible[0]) activeId.value = visible[0].target.id
    },
    { rootMargin: '-110px 0px -70% 0px', threshold: 0 },
  )
  headings.forEach((heading) => observer!.observe(heading))
}

onMounted(async () => {
  await new Promise((resolve) => setTimeout(resolve, 0))
  setupHeadingObserver()
})

onBeforeUnmount(() => observer?.disconnect())

watch(post, async () => {
  await new Promise((resolve) => setTimeout(resolve, 0))
  setupHeadingObserver()
})
</script>

<template>
  <div v-if="post" class="container-wide pt-8 sm:pt-12">
    <div class="mx-auto max-w-6xl lg:grid lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-8">
      <article class="min-w-0">
        <!-- 文章头 -->
        <header class="pop-card p-5 sm:p-7">
          <RouterLink
            to="/blog"
            class="inline-flex items-center gap-1 border-[3px] border-ink-800 bg-white px-2.5 py-1 font-pop text-[11px] font-black transition hover:bg-pop-200 dark:border-pop-200 dark:bg-ink-700 dark:text-pop-100"
          >
            ← 返回列表
          </RouterLink>

          <p class="mt-4 flex flex-wrap items-center gap-2 font-pop text-[11px] font-black">
            <span class="bg-pop-200 px-2 py-0.5 text-ink-800">放送 第{{ episode }}回</span>
            <span class="text-ink-800/50 dark:text-pop-200/50">ON AIR</span>
          </p>

          <h1 class="mt-2 font-pop text-3xl font-black leading-tight sm:text-4xl">
            {{ post.title }}
          </h1>

          <p v-if="post.description" class="mt-3 text-base font-bold leading-7 text-ink-800/70 dark:text-pop-200/70">
            {{ post.description }}
          </p>

          <div class="mt-5 flex flex-wrap items-center gap-2 font-pop text-[11px] font-bold">
            <time :datetime="post.date" class="pop-tag font-mono">{{ formatDateLong(post.date) }}</time>
            <span class="pop-tag">{{ readingTime }} 分钟阅读</span>
            <span v-if="post.updated && post.updated !== post.date" class="pop-tag">更新 {{ formatDateLong(post.updated) }}</span>
            <RouterLink
              v-for="tag in post.tags"
              :key="tag"
              :to="`/blog?tag=${encodeURIComponent(tag)}`"
              class="pop-tag pop-tag-yellow transition hover:rotate-2"
            >
              #{{ tag }}
            </RouterLink>
          </div>
        </header>

        <!-- 正文 -->
        <div class="pop-card prose mt-5 px-5 py-7 sm:px-8 sm:py-9">
          <component :is="post.component" />

          <div class="mt-12 flex items-center gap-3 font-pop text-[11px] font-black tracking-[0.2em]">
            <span class="h-1 w-10 bg-ink-800 dark:bg-pop-200" />
            END / {{ post.date.slice(0, 4) }}
          </div>
        </div>

        <!-- 上下篇 -->
        <nav class="mt-6 grid gap-4 sm:grid-cols-2" aria-label="相邻文章">
          <RouterLink
            v-if="prevPost"
            :to="`/blog/${prevPost.slug}`"
            class="pop-card-sm group -rotate-1 p-4 transition hover:rotate-0"
          >
            <span class="font-pop text-[11px] font-black">← 更早</span>
            <p class="mt-1 line-clamp-1 font-pop text-base font-black group-hover:underline">{{ prevPost.title }}</p>
          </RouterLink>
          <span v-else class="hidden sm:block" />

          <RouterLink
            v-if="nextPost"
            :to="`/blog/${nextPost.slug}`"
            class="pop-card-sm group rotate-1 p-4 text-right transition hover:rotate-0"
          >
            <span class="font-pop text-[11px] font-black">更新 →</span>
            <p class="mt-1 line-clamp-1 font-pop text-base font-black group-hover:underline">{{ nextPost.title }}</p>
          </RouterLink>
        </nav>
      </article>

      <!-- 目录 -->
      <aside v-if="toc.length" class="mt-8 lg:mt-0">
        <div class="lg:sticky lg:top-40">
          <h2 class="mb-3 inline-block -rotate-1 border-[3px] border-ink-800 bg-ink-800 px-2 py-1 font-pop text-[11px] font-black tracking-[0.2em] text-pop-200 dark:border-pop-200 dark:bg-pop-200 dark:text-ink-800">
            目次 / INDEX
          </h2>
          <nav aria-label="文章目录">
            <ul class="space-y-1.5">
              <li v-for="(item, i) in toc" :key="item.id">
                <a
                  :href="`#${item.id}`"
                  class="flex items-baseline gap-2 border-2 px-2 py-1.5 font-pop text-[12px] font-bold leading-5 transition"
                  :class="[
                    item.level === 3 ? 'ml-4' : '',
                    activeId === item.id
                      ? 'border-ink-800 bg-pop-200 text-ink-800 dark:border-pop-200 dark:bg-pop-200 dark:text-ink-800'
                      : 'border-transparent hover:border-ink-800 hover:bg-white dark:hover:border-pop-200 dark:hover:bg-ink-700',
                  ]"
                >
                  <span class="font-mono text-[10px] opacity-60">{{ String(i + 1).padStart(2, '0') }}</span>
                  {{ item.text }}
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
    </div>
  </div>

  <div v-else class="container-page py-32 text-center">
    <p class="font-pop text-7xl font-black text-ink-800/15 dark:text-pop-200/20">404</p>
    <h1 class="mt-3 font-pop text-2xl font-black">这篇文章不存在</h1>
    <p class="mt-2 text-sm font-bold">可能已经删除，或者链接写错了。</p>
    <RouterLink to="/blog" class="pop-btn mt-6">去文章列表看看</RouterLink>
  </div>
</template>
