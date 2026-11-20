<script setup lang="ts">
withDefaults(
  defineProps<{
    size?: number
    /** 纯黑剪影版 */
    mono?: boolean
  }>(),
  { size: 20, mono: false },
)

defineOptions({ name: 'AboutIcon' })
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
    <!-- 名札：圆角牌 + 挂绳孔 -->
    <rect
      x="6"
      y="12"
      width="52"
      height="44"
      rx="6"
      :fill="mono ? 'currentColor' : '#fffef8'"
      stroke="currentColor"
      stroke-width="4"
    />
    <rect
      x="25"
      y="7"
      width="14"
      height="9"
      rx="4"
      :fill="mono ? 'var(--c-bg, #fdf46d)' : '#fdf46d'"
      stroke="currentColor"
      stroke-width="3.2"
    />

    <!-- 头像剪影 -->
    <path
      d="M32 24 C35.6 24 38.4 26.8 38.4 30.4 C38.4 33 37 35.2 34.8 36.2 C40.4 38 44 42.2 44 47 L20 47 C20 42.2 23.6 38 29.2 36.2 C27 35.2 25.6 33 25.6 30.4 C25.6 26.8 28.4 24 32 24 Z"
      :fill="mono ? 'var(--c-bg, #fdf46d)' : '#2b2e33'"
    />

    <!-- 右下角小印章 -->
    <template v-if="!mono">
      <rect x="43" y="40" width="9" height="9" rx="1.5" fill="#a3271d" stroke="currentColor" stroke-width="2" />
      <path d="M45.4 42.2 H49.6 M45.4 44.6 H49.6 M47.5 42.2 V46.8" stroke="#f3e8c8" stroke-width="1.2" />
    </template>
  </svg>
</template>
