<script setup lang="ts">
withDefaults(
  defineProps<{
    size?: number
    /** 纯黑剪影版，用于小尺寸 / 深浅底 */
    mono?: boolean
  }>(),
  { size: 20, mono: false },
)

defineOptions({ name: 'HomeIcon' })
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <!-- 忍者小屋：屋顶 + 门帘 + 招牌 -->
    <path
      d="M4 30 L32 6 L60 30 L55 30 L55 56 L9 56 L9 30 Z"
      :fill="mono ? 'currentColor' : '#fffef8'"
      stroke="currentColor"
      stroke-width="4"
      stroke-linejoin="round"
    />
    <!-- 门 -->
    <rect
      x="23"
      y="36"
      width="18"
      height="20"
      rx="1"
      :fill="mono ? 'var(--c-bg, #fdf46d)' : 'url(#home-door)'"
      stroke="currentColor"
      stroke-width="3.4"
    />
    <!-- 门帘 -->
    <path
      d="M23 36 H41 L38 45 H26 Z"
      :fill="mono ? 'currentColor' : '#fdf46d'"
      stroke="currentColor"
      stroke-width="2.6"
      stroke-linejoin="round"
    />
    <!-- 屋顶瓦线 -->
    <template v-if="!mono">
      <path d="M17 27 L32 14 L47 27" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" opacity="0.55" />
      <circle cx="32" cy="26" r="2.2" fill="currentColor" />
    </template>
    <defs v-if="!mono">
      <linearGradient id="home-door" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#3d3a36" />
        <stop offset="1" stop-color="#171514" />
      </linearGradient>
    </defs>
  </svg>
</template>
