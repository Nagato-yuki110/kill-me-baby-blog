<script setup lang="ts">
import { withBase } from '@/lib/asset'
import { site } from '@/site'
</script>

<template>
  <!-- 海报铺满视口，压一层黄/黑蒙版保证文字可读 -->
  <div class="poster-backdrop" aria-hidden="true">
    <img :src="withBase(site.poster)" alt="" decoding="async" fetchpriority="high" />
  </div>
  <div class="dot-field" aria-hidden="true" />
</template>
