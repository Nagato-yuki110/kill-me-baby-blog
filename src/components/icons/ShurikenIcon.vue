<script setup lang="ts">
withDefaults(
  defineProps<{
    size?: number | string
    /** 纯黑剪影版，用于 favicon / 小尺寸 */
    mono?: boolean
    /** 中心孔的颜色，默认跟随背景 */
    holeColor?: string
  }>(),
  { size: 20, mono: false, holeColor: 'var(--c-bg)' },
)

defineOptions({ name: 'ShurikenIcon' })
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
    <path
      d="M32 1 C35 11 39 17 45 21 C51 25 57 29 63 32 C57 35 51 39 45 43 C39 47 35 53 32 63 C29 53 25 47 19 43 C13 39 7 35 1 32 C7 29 13 25 19 21 C25 17 29 11 32 1 Z"
      :fill="mono ? 'currentColor' : 'url(#shuriken-steel)'"
      stroke="currentColor"
      :stroke-width="mono ? 3 : 2.6"
      stroke-linejoin="round"
    />
    <circle cx="32" cy="32" r="5" :fill="holeColor" stroke="currentColor" stroke-width="2.2" />
    <template v-if="!mono">
      <path
        d="M20 20.5 C22.5 17.5 25 15 28.5 12.5"
        stroke="#eef2f6"
        stroke-width="2"
        stroke-linecap="round"
        opacity="0.85"
      />
      <path
        d="M44 43.5 C41.5 46.5 39 49 35.5 51.5"
        stroke="#b9c2cb"
        stroke-width="1.4"
        stroke-linecap="round"
        opacity="0.55"
      />
    </template>
    <defs v-if="!mono">
      <radialGradient id="shuriken-steel" cx="0.35" cy="0.28" r="0.9">
        <stop offset="0" stop-color="#565b64" />
        <stop offset="0.5" stop-color="#2c3036" />
        <stop offset="1" stop-color="#141518" />
      </radialGradient>
    </defs>
  </svg>
</template>
