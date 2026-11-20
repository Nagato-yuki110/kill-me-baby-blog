<script setup lang="ts">
defineProps<{ name: string; count: number }>()
</script>

<template>
  <RouterLink
    :to="`/blog?tag=${encodeURIComponent(name)}`"
    class="pop-tag -rotate-1 px-2.5 py-1 text-xs transition hover:rotate-0 hover:bg-pop-200"
    :title="`${name}（${count} 篇）`"
  >
    <span>#{{ name }}</span>
    <span class="font-mono text-[10px] opacity-60">{{ count }}</span>
  </RouterLink>
</template>
