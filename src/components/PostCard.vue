<script setup lang="ts">
import type { Post } from '@/lib/posts'
import { formatDate } from '@/lib/posts'

defineProps<{ post: Post; featured?: boolean }>()
</script>

<template>
  <article class="group border-b-2 border-dashed border-ink-800/25 pb-6 last:border-0 last:pb-0 dark:border-pop-200/25">
    <RouterLink :to="`/blog/${post.slug}`" class="block">
      <div class="flex flex-wrap items-center gap-2 font-pop text-[11px] font-bold">
        <time :datetime="post.date" class="pop-tag font-mono">{{ formatDate(post.date) }}</time>
        <span class="pop-tag">{{ post.readingTime }} 分钟</span>
        <span v-if="featured" class="pop-tag pop-tag-yellow -rotate-2 font-black">★ 精选</span>
      </div>

      <h3 class="mt-3 font-pop text-xl font-black leading-snug transition group-hover:underline group-hover:decoration-[3px] group-hover:underline-offset-4">
        {{ post.title }}
      </h3>

      <p v-if="post.description" class="mt-2 line-clamp-2 text-sm font-medium leading-7 text-ink-800/70 dark:text-pop-200/70">
        {{ post.description }}
      </p>

      <p v-if="post.tags.length" class="mt-3 flex flex-wrap gap-2 font-pop text-[11px] font-bold">
        <span v-for="tag in post.tags" :key="tag" class="bg-pop-200 px-1.5 py-0.5 text-ink-800 dark:bg-pop-400/80">
          #{{ tag }}
        </span>
      </p>
    </RouterLink>
  </article>
</template>
