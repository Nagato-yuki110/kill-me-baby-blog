<script setup lang="ts">
withDefaults(
  defineProps<{
    /** 高度，宽度按 2:3 自动算；传 'auto' 则按 class 控制 */
    size?: number
    /** 横放的卷轴 */
    horizontal?: boolean
  }>(),
  { size: 28, horizontal: false },
)

defineOptions({ name: 'ScrollIcon' })
</script>

<template>
  <svg
    v-if="!horizontal"
    :width="size * 0.66"
    :height="size"
    viewBox="0 0 64 96"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="scroll-green" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#2f5a3a" />
        <stop offset="0.3" stop-color="#5f9164" />
        <stop offset="0.65" stop-color="#3f6b47" />
        <stop offset="1" stop-color="#27482f" />
      </linearGradient>
    </defs>
    <!-- 黑端盖 -->
    <rect x="15" y="3" width="34" height="8" rx="2.5" fill="#2b2e33" stroke="currentColor" stroke-width="2.6" />
    <rect x="15" y="85" width="34" height="8" rx="2.5" fill="#2b2e33" stroke="currentColor" stroke-width="2.6" />
    <!-- 筒身 -->
    <rect x="15" y="11" width="34" height="74" fill="url(#scroll-green)" stroke="currentColor" stroke-width="2.6" />
    <rect x="20" y="14" width="4" height="68" rx="2" fill="#b6d4b2" opacity="0.35" />
    <!-- 米色标签 -->
    <rect x="26" y="22" width="12" height="52" rx="2" fill="#f2e6c8" stroke="currentColor" stroke-width="2.2" />
    <path
      d="M29.5 32 H34.5 M29.5 39 H34.5 M29.5 46 H34.5 M29.5 53 H34.5 M29.5 60 H34.5"
      stroke="#8a7a58"
      stroke-width="1.4"
      stroke-linecap="round"
    />
  </svg>

  <svg
    v-else
    :width="size * 2.4"
    :height="size * 0.9"
    viewBox="0 0 96 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <rect x="4" y="8" width="9" height="20" rx="2.5" fill="#2b2e33" stroke="currentColor" stroke-width="2.4" />
    <rect x="83" y="8" width="9" height="20" rx="2.5" fill="#2b2e33" stroke="currentColor" stroke-width="2.4" />
    <rect x="13" y="8" width="70" height="20" fill="#3f6b47" stroke="currentColor" stroke-width="2.4" />
    <rect x="38" y="11" width="18" height="14" rx="1.5" fill="#f2e6c8" stroke="currentColor" stroke-width="2" />
    <rect x="17" y="11" width="3" height="14" rx="1.5" fill="#b6d4b2" opacity="0.35" />
  </svg>
</template>
