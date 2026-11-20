<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

const route = useRoute()
const isPost = computed(() => route.name === 'post')

const progress = ref(0)

function updateProgress() {
  const doc = document.documentElement
  const total = doc.scrollHeight - doc.clientHeight
  progress.value = total > 0 ? Math.min(100, (doc.scrollTop / total) * 100) : 0
}

onMounted(() => {
  window.addEventListener('scroll', updateProgress, { passive: true })
  updateProgress()
})

onBeforeUnmount(() => window.removeEventListener('scroll', updateProgress))

watch(
  () => route.fullPath,
  async () => {
    await nextTick()
    updateProgress()
  },
)
</script>

<template>
  <div v-if="isPost" class="reading-progress" :style="{ width: `${progress}%` }" aria-hidden="true" />
  <DefaultLayout>
    <RouterView v-slot="{ Component }">
      <Transition name="fade" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </DefaultLayout>
</template>
