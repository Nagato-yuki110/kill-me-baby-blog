<script setup lang="ts">
import { useThemeStore } from '@/stores/theme'

const theme = useThemeStore()
</script>

<template>
  <button
    type="button"
    class="grid size-9 place-items-center border-[3px] border-ink-800 bg-white text-ink-800 transition hover:-translate-y-0.5 hover:shadow-[3px_3px_0_#1f1b1d] dark:border-pop-200 dark:bg-ink-800 dark:text-pop-200"
    :aria-label="theme.isDark ? '切换到日间模式' : '切换到夜间模式'"
    :title="theme.isDark ? '日间模式' : '夜间模式'"
    @click="theme.toggle()"
  >
    <svg
      v-if="theme.isDark"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2.2"
      stroke-linecap="round"
      class="size-5"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
    <svg
      v-else
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2.2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="size-5"
    >
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
    </svg>
  </button>
</template>
