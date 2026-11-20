<script setup lang="ts">
import SceneBackground from '@/components/SceneBackground.vue'
import SiteFooter from '@/components/SiteFooter.vue'
import SiteHeader from '@/components/SiteHeader.vue'
</script>

<template>
  <SceneBackground />
  <div class="flex min-h-dvh flex-col">
    <SiteHeader />
    <main class="flex-1 pb-16">
      <slot />
    </main>
    <SiteFooter />
  </div>
</template>
