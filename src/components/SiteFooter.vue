<script setup lang="ts">
import { site } from '@/site'
</script>

<template>
  <footer class="mt-20 border-t-[3px] border-ink-800 bg-ink-800 text-pop-200 dark:border-pop-200">
    <div class="container-wide flex flex-col items-center justify-between gap-4 py-8 sm:flex-row">
      <div class="flex items-center gap-3">
        <span class="grid size-7 -rotate-6 place-items-center rounded-full border-2 border-pop-200 font-pop text-[11px] font-black leading-none">
          キ
        </span>
        <p class="font-pop text-[11px] font-bold tracking-[0.2em]">{{ site.footer }}</p>
        <span class="text-[10px] text-pop-200/60">/ {{ site.titleEn }}</span>
      </div>
      <div class="flex items-center gap-5">
        <a
          v-for="link in site.social"
          :key="link.label"
          :href="link.href"
          target="_blank"
          rel="noopener noreferrer"
          class="font-pop text-[11px] font-bold tracking-[0.15em] underline decoration-2 underline-offset-4 transition hover:text-white"
        >
          {{ link.label }}
        </a>
      </div>
    </div>
  </footer>
</template>
