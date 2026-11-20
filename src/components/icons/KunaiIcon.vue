<script setup lang="ts">
withDefaults(defineProps<{ size?: number }>(), { size: 20 })

defineOptions({ name: 'KunaiIcon' })
</script>

<template>
  <svg
    :width="size * 0.85"
    :height="size"
    viewBox="0 0 64 72"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <circle cx="32" cy="8.5" r="5.6" stroke="currentColor" stroke-width="4.2" />
    <rect x="27.2" y="13.6" width="9.6" height="3.4" rx="1" fill="currentColor" />
    <rect x="27.6" y="16.4" width="8.8" height="11.2" fill="currentColor" />
    <path
      d="M27.2 26.6 L36.8 26.6 L36.8 30 L41 33.6 C42.6 39.6 41 48 32 61 C23 48 21.4 39.6 23 33.6 L27.2 30 Z"
      fill="currentColor"
      stroke="currentColor"
      stroke-width="2"
      stroke-linejoin="round"
    />
    <path d="M32 33.6 C33.4 40 33.2 47 32 54.5 C30.8 47 30.6 40 32 33.6 Z" fill="var(--c-accent, #fdf46d)" />
  </svg>
</template>
